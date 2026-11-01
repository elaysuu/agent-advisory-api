import { check } from '../lib.mjs';
export default async function handler(req,res){
 const u=new URL(req.url,'http://x');
 if(req.method!=='GET')return res.status(404).json({error:'not found'});
 const [c,b]=await check(u.searchParams,new Headers(req.headers),process.env.RAPIDAPI_PROXY_SECRET||'',req.headers['x-forwarded-for']);
 res.status(c).json(b);}






