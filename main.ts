// Deno Deploy entrypoint. Secret check enforced only when RAPIDAPI_PROXY_SECRET is set.
// @ts-ignore js module
import { check } from './lib.mjs';
const json=(c:number,o:unknown)=>new Response(JSON.stringify(o),{status:c,headers:{'content-type':'application/json'}});
Deno.serve(async (req,info)=>{const u=new URL(req.url);
 if(u.pathname==='/health')return json(200,{ok:true});
 if(u.pathname!=='/check'||req.method!=='GET')return json(404,{error:'not found'});
 const [c,b]=await check(u.searchParams,req.headers,Deno.env.get('RAPIDAPI_PROXY_SECRET')||'',(info.remoteAddr as Deno.NetAddr).hostname);
 return json(c,b);});
