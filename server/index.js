const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
class HttpError extends Error{constructor(status,message){super(message);this.status=status}}
const fail=(code,message)=>{throw new HttpError(code,message)};
const all=async(db,sql,...args)=>(await db.prepare(sql).bind(...args).all()).results;
const first=(db,sql,...args)=>db.prepare(sql).bind(...args).first();
const run=(db,sql,...args)=>db.prepare(sql).bind(...args).run();
const str=(v,label,min=1,max=120)=>{if(typeof v!=='string'||v.trim().length<min||v.trim().length>max)fail(400,`Enter a valid ${label}.`);return v.trim()};
const num=(v,label,min,max)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)fail(400,`Invalid ${label}.`);return v};
const vehicles=['Car','Auto','Cab','Commercial'];
const active="('Active','In Progress')";
function stationView(s){const count=Number(s.queue_count||0);return{id:s.id,name:s.name,city:s.city,address:s.address,area:s.city,status:s.status,pricePerKg:s.price,gasPressure:s.pressure,totalNozzles:s.nozzles,activeNozzles:s.status==='Open'?s.nozzles:0,operatingHours:s.hours,supportedVehicles:JSON.parse(s.vehicles),queueCount:count,avgWaitMins:Math.ceil(count*4/s.nozzles),updatedAt:s.updated_at,code:'CNG',servingToken:s.serving_id||'—'};}
async function stationList(db){return (await all(db,`SELECT s.*, (SELECT count(*) FROM bookings b WHERE b.station_id=s.id AND b.status IN ${active} AND b.scheduled_at<=?) queue_count,(SELECT id FROM bookings b WHERE b.station_id=s.id AND b.status='In Progress' ORDER BY sequence LIMIT 1) serving_id FROM stations s ORDER BY s.name`,new Date().toISOString())).map(stationView);}
function stationInput(b){const v=b.supportedVehicles;if(!Array.isArray(v)||!v.length||v.some(x=>!vehicles.includes(x)))fail(400,'Select supported vehicles.');const n=num(b.nozzles,'nozzles',1,30);if(!Number.isInteger(n))fail(400,'Nozzles must be a whole number.');if(!['Open','Closed'].includes(b.status))fail(400,'Invalid station status.');return[str(b.name,'station name',3),str(b.city,'city',2,60),str(b.address,'address',5,250),b.status,num(b.pricePerKg,'price',1,500),num(b.gasPressure,'pressure',0,400),n,str(b.operatingHours,'operating hours',2,100),JSON.stringify([...new Set(v)])];}
async function ownStation(db,id,user){const s=await first(db,'SELECT * FROM stations WHERE id=? AND owner_id=?',id,user);if(!s)fail(403,'You can only manage your own station.');return s;}
async function bookingList(db,user,operator=false){const rows=await all(db,`SELECT b.*,s.name station_name,s.address station_address,s.city,s.nozzles FROM bookings b JOIN stations s ON s.id=b.station_id WHERE ${operator?'s.owner_id':'b.user_id'}=? ORDER BY b.sequence DESC LIMIT 500`,user);const waiting=await all(db,`SELECT id,station_id,scheduled_at,sequence FROM bookings WHERE status IN ${active} ORDER BY scheduled_at,sequence`);const now=new Date().toISOString();return rows.map(b=>{const position=waiting.filter(w=>w.station_id===b.station_id&&(w.scheduled_at<b.scheduled_at||(w.scheduled_at===b.scheduled_at&&w.sequence<=b.sequence))).length;return{id:b.id,tokenNo:`CNG-${b.sequence}`,stationId:b.station_id,stationName:b.station_name,stationAddress:b.station_address,city:b.city,driverName:b.driver_name,phone:b.phone,vehicleType:b.vehicle_type,vehicleNo:b.vehicle_no,refillQty:b.quantity,status:b.status,scheduledAt:b.scheduled_at,bookingDate:b.scheduled_at.slice(0,10),createdAt:b.created_at,slotTime:b.scheduled_at,bookingType:b.scheduled_at>b.created_at?'Scheduled':'Express Queue',positionInQueue:['Active','In Progress'].includes(b.status)?position:0,estWaitMinutes:Math.max(0,Math.ceil((position-1)*4/b.nozzles)),assignedNozzle:b.status==='In Progress'?'At station':'Assigned on arrival',due:b.scheduled_at<=now};});}
export async function api(request,env){try{
 const url=new URL(request.url),path=url.pathname,method=request.method;
 if(path==='/api/health')return json({ok:true});
 const id=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email');
 if(!id||!email)return json({error:'Sign in to continue.'},401);
 const user={id,email};
 if(method!=='GET'){
  if(request.headers.get('Origin')!==url.origin)fail(403,'Invalid request origin.');
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))fail(415,'JSON required.');
 }
 if(!env.DB)fail(503,'Booking service is unavailable. Please try again later.');
 const db=env.DB;
 if(path==='/api/state'&&method==='GET'){
  const [stations,bookings,operatorBookings,owned,favs]=await Promise.all([stationList(db),bookingList(db,id),bookingList(db,id,true),all(db,'SELECT id FROM stations WHERE owner_id=?',id),all(db,'SELECT station_id FROM favorites WHERE user_id=?',id)]);
  return json({user,stations,bookings,operatorBookings,ownedStationIds:owned.map(s=>s.id),favorites:favs.map(f=>f.station_id)});
 }
 let b={};if(method!=='GET'){const raw=await request.text();if(raw.length>12000)fail(413,'Request too large.');try{b=JSON.parse(raw)}catch{fail(400,'Invalid JSON.')}if(!b||Array.isArray(b)||typeof b!=='object')fail(400,'JSON object required.');}
 if(path==='/api/stations'&&method==='POST'){
  const values=stationInput(b),sid=crypto.randomUUID();
  if((await first(db,'SELECT count(*) n FROM stations WHERE owner_id=?',id)).n>=20)fail(409,'Station limit reached.');
  await run(db,'INSERT INTO stations(id,owner_id,name,city,address,status,price,pressure,nozzles,hours,vehicles,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',sid,id,...values,new Date().toISOString());return json({id:sid},201);
 }
 const stationMatch=path.match(/^\/api\/stations\/([^/]+)$/);
 if(stationMatch&&method==='PATCH'){await ownStation(db,stationMatch[1],id);await run(db,'UPDATE stations SET name=?,city=?,address=?,status=?,price=?,pressure=?,nozzles=?,hours=?,vehicles=?,updated_at=? WHERE id=? AND owner_id=?',...stationInput(b),new Date().toISOString(),stationMatch[1],id);return json({ok:true});}
 if(path==='/api/bookings'&&method==='POST'){
  const sid=str(b.stationId,'station',1,80),key=str(b.requestKey,'request ID',16,80);
  const prior=await first(db,'SELECT id FROM bookings WHERE user_id=? AND request_key=?',id,key);if(prior)return json({id:prior.id});
  const s=await first(db,'SELECT * FROM stations WHERE id=?',sid);if(!s||s.status!=='Open')fail(409,'This station is not accepting bookings.');
  const name=str(b.driverName,'driver name',2,80),phone=str(b.phone,'mobile',10,20).replace(/[\s()+-]/g,'');if(!/^(91)?[6-9]\d{9}$/.test(phone))fail(400,'Enter a valid Indian mobile number.');
  const plate=str(b.vehicleNo,'vehicle number',5,20).toUpperCase().replace(/[\s-]/g,'');if(!/^[A-Z0-9]{5,15}$/.test(plate))fail(400,'Invalid vehicle number.');
  if(!JSON.parse(s.vehicles).includes(b.vehicleType))fail(400,'This station does not support that vehicle.');
  const quantity=str(b.refillQty,'refill quantity',1,60),now=new Date().toISOString();let when=now;
  if(b.scheduledAt){const time=new Date(b.scheduledAt).getTime();if(!Number.isFinite(time)||time<Date.now()+60000||time>Date.now()+7*86400000)fail(400,'Select a slot between one minute and seven days from now.');when=new Date(time).toISOString();}
  const bid=crypto.randomUUID();
  try{await run(db,`INSERT INTO bookings(id,user_id,station_id,request_key,driver_name,phone,vehicle_type,vehicle_no,quantity,scheduled_at,status,created_at) SELECT ?,?,?,?,?,?,?,?,?,?,'Active',? WHERE EXISTS(SELECT 1 FROM stations WHERE id=? AND status='Open') AND NOT EXISTS(SELECT 1 FROM bookings WHERE user_id=? AND station_id=? AND status IN ${active})`,bid,id,sid,key,name,phone,b.vehicleType,plate,quantity,when,now,sid,id,sid);}catch(e){if(!String(e).includes('UNIQUE'))throw e;}
  const saved=await first(db,'SELECT id FROM bookings WHERE user_id=? AND request_key=?',id,key);if(!saved)fail(409,'You already have an active booking here, or the station just closed.');return json({id:saved.id},201);
 }
 const statusMatch=path.match(/^\/api\/bookings\/([^/]+)\/status$/);
 if(statusMatch&&method==='PATCH'){
  const row=await first(db,'SELECT b.*,s.owner_id,s.status station_status FROM bookings b JOIN stations s ON s.id=b.station_id WHERE b.id=?',statusMatch[1]);if(!row)fail(404,'Booking not found.');
  const owner=row.owner_id===id,driver=row.user_id===id;if(!owner&&!driver)fail(403,'Access denied.');
  if(!['Cancelled','In Progress','Completed'].includes(b.status))fail(400,'Invalid booking status.');
  if(!owner&&b.status!=='Cancelled')fail(403,'Only the station operator can serve a booking.');
  const valid=(row.status==='Active'&&(b.status==='Cancelled'||b.status==='In Progress'))||(row.status==='In Progress'&&b.status==='Completed'&&owner);
  if(!valid)fail(409,'This booking can no longer be changed that way.');
  if(b.status==='In Progress'&&row.station_status!=='Open')fail(409,'Station is closed.');
  if(b.status==='In Progress'&&row.scheduled_at>new Date().toISOString())fail(409,'This scheduled booking is not due yet.');
  const changed=await run(db,'UPDATE bookings SET status=? WHERE id=? AND status=?',b.status,row.id,row.status);if(!changed.meta.changes)fail(409,'Booking changed. Refresh and try again.');return json({ok:true});
 }
 const nextMatch=path.match(/^\/api\/stations\/([^/]+)\/next$/);
 if(nextMatch&&method==='POST'){
  const s=await ownStation(db,nextMatch[1],id);if(s.status!=='Open')fail(409,'Open the station before calling a token.');
  const changed=await run(db,"UPDATE bookings SET status='In Progress' WHERE sequence=(SELECT sequence FROM bookings WHERE station_id=? AND status='Active' AND scheduled_at<=? ORDER BY scheduled_at,sequence LIMIT 1) AND status='Active'",s.id,new Date().toISOString());if(!changed.meta.changes)fail(409,'No waiting tokens are due yet.');return json({ok:true});
 }
 const fav=path.match(/^\/api\/favorites\/([^/]+)$/);
 if(fav&&method==='PUT'){if(!await first(db,'SELECT id FROM stations WHERE id=?',fav[1]))fail(404,'Station not found.');if(b.saved===true)await run(db,'INSERT OR IGNORE INTO favorites(user_id,station_id) VALUES(?,?)',id,fav[1]);else if(b.saved===false)await run(db,'DELETE FROM favorites WHERE user_id=? AND station_id=?',id,fav[1]);else fail(400,'Invalid favorite.');return json({ok:true});}
 return json({error:'Not found.'},404);
 }catch(e){if(!e.status)console.error('Booking API failed:',e.message);return json({error:e.status?e.message:'Unable to save or load data. Please retry.'},e.status||503);}}
export default {async fetch(request,env){if(new URL(request.url).pathname.startsWith('/api/'))return api(request,env);return env.ASSETS.fetch(request);}};
