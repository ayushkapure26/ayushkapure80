// Development-only loopback server. Never deploy this file or expose its port.
import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readdirSync,readFileSync} from 'node:fs';
import {sqliteAdapter} from './sqlite-adapter.mjs';
import {api} from '../server/index.js';
mkdirSync('.local-data',{recursive:true});
const db=new DatabaseSync('.local-data/cng.sqlite');
db.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())if(!db.prepare('SELECT name FROM local_migrations WHERE name=?').get(f)){db.exec('BEGIN');try{db.exec(readFileSync(`drizzle/${f}`,'utf8'));db.prepare('INSERT INTO local_migrations VALUES(?)').run(f);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}}
const env={DB:sqliteAdapter(()=>db)};
createServer(async(req,res)=>{try{
 const host=req.headers.host;if(!['localhost:3000','127.0.0.1:3000','127.0.0.1:8787','localhost:8787'].includes(host)){res.writeHead(403);res.end('Local access only');return;}
 const parts=[];for await(const part of req)parts.push(part);
 const headers=new Headers(req.headers);headers.set('oai-authenticated-user-id','local-developer');headers.set('oai-authenticated-user-email','developer@localhost');
 const request=new Request(`http://${host}${req.url}`,{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(parts)});
 const response=await api(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());
 }catch(e){res.writeHead(500);res.end('Local API error');console.error(e);}}).listen(8787,'127.0.0.1',()=>console.log('Local-only API on 127.0.0.1:8787; development identity active.'));
