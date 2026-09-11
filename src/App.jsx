import React,{useState,useEffect,useCallback,useRef} from 'react';
import Navbar from './components/Navbar';
import StationFinder from './components/StationFinder';
import BookingModal from './components/BookingModal';
import TokenPassModal from './components/TokenPassModal';
import LiveQueueTracker from './components/LiveQueueTracker';
import OperatorDashboard from './components/OperatorDashboard';
import SavingsCalculator from './components/SavingsCalculator';
import {request} from './utils/api';
export default function App(){
 const [data,setData]=useState(null),[error,setError]=useState(''),[auth,setAuth]=useState(false),[tab,setTab]=useState('stations'),[city,setCity]=useState('All cities'),[station,setStation]=useState(null),[pass,setPass]=useState(null),[busy,setBusy]=useState(false);
 const serial=useRef(0);
 const refresh=useCallback(async()=>{const n=++serial.current;try{const d=await request('/state');if(n===serial.current){setData(d);setAuth(false);setError('');}return d;}catch(e){if(n===serial.current){if(e.status===401){setAuth(true);setData(null);}else setError(e.message);}throw e;}},[]);
 useEffect(()=>{refresh().catch(()=>{});const t=setInterval(()=>{if(!document.hidden)refresh().catch(()=>{});},15000);return()=>clearInterval(t);},[refresh]);
 const change=async(path,method,body)=>{setBusy(true);setError('');try{const r=await request(path,method,body);const d=await refresh();return{r,d};}catch(e){setError(e.message);throw e;}finally{setBusy(false);}};
 useEffect(()=>{const context=document.modelContext;if(!context?.registerTool)return;const life=new AbortController();Promise.resolve(context.registerTool({name:'list_cng_stations',description:'Read the current station list displayed in this app.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:async input=>{if(!input||Object.keys(input).length)throw new Error('No parameters expected.');const d=await refresh();return d.stations.map(s=>({id:s.id,name:s.name,city:s.city,status:s.status,queueCount:s.queueCount}));}},{signal:life.signal})).catch(()=>{});return()=>life.abort();},[refresh]);
 if(auth)return <main className="login-shell"><div className="glass-card"><span className="badge badge-primary">CNG मित्र</span><h1>Your refill, organised.</h1><p>Sign in to book CNG tokens, save stations and manage your station’s queue.</p><a className="btn btn-primary" href="/signin-with-chatgpt?return_to=%2F" target="_top">Sign in with ChatGPT</a></div></main>;
 if(!data)return <main className="login-shell"><div className="glass-card"><h1>CNG मित्र</h1><p role="status">{error||'Loading your stations…'}</p>{error&&<button className="btn btn-primary" onClick={()=>refresh().catch(()=>{})}>Retry</button>}</div></main>;
 const owned=data.stations.filter(s=>data.ownedStationIds.includes(s.id));
 const updateStatus=(id,status)=>change(`/bookings/${id}/status`,'PATCH',{status});
 return <div className="app-container"><Navbar currentTab={tab} setCurrentTab={setTab} selectedCity={city} setSelectedCity={setCity} cities={['All cities',...new Set(data.stations.map(s=>s.city))]} activeBookingsCount={data.bookings.filter(b=>['Active','In Progress'].includes(b.status)).length}/>
 <main className="main-content"><div className="account-strip"><span>{data.user.email}</span><a href="/signout-with-chatgpt?return_to=%2F" target="_top">Sign out</a></div>
 {error&&<div className="error-banner" role="alert">{error}<button onClick={()=>refresh().catch(()=>{})}>Retry</button></div>}
 {tab==='stations'&&<><StationFinder stations={data.stations} selectedCity={city} onBookStation={setStation} favorites={data.favorites} onToggleFavorite={id=>change(`/favorites/${id}`,'PUT',{saved:!data.favorites.includes(id)}).catch(()=>{})}/>{data.stations.length===0&&<div className="glass-card empty-state"><h2>No stations registered yet</h2><p>Register a station you manage to start accepting bookings. Station information is supplied by its operator.</p><button className="btn btn-primary" onClick={()=>setTab('operator')}>Register my station</button></div>}</>}
 {tab==='liveQueue'&&<LiveQueueTracker bookings={data.bookings} stations={data.stations} onUpdateBookingStatus={updateStatus} busy={busy}/>}
 {tab==='calculator'&&<SavingsCalculator/>}
 {tab==='operator'&&<OperatorDashboard stations={owned} bookings={data.operatorBookings} busy={busy} onCreate={b=>change('/stations','POST',b)} onUpdate={(id,b)=>change(`/stations/${id}`,'PATCH',b)} onCallNext={id=>change(`/stations/${id}/next`,'POST',{})} onUpdateBookingStatus={updateStatus}/>}
 </main><footer className="app-footer">CNG मित्र · Station updates are supplied by operators. Queue times are estimates.</footer>
 {station&&<BookingModal station={station} onClose={()=>setStation(null)} onSubmitBooking={async b=>{const{r,d}=await change('/bookings','POST',b);setStation(null);setPass(d.bookings.find(x=>x.id===r.id));}}/>}
 {pass&&<TokenPassModal booking={pass} onClose={()=>setPass(null)} onGoToTracker={()=>{setPass(null);setTab('liveQueue');}}/>}</div>;
}
