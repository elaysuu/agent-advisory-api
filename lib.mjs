export const ECOS=new Set(['npm','PyPI','Go','crates.io','Maven','NuGet','RubyGems','Packagist','Pub','Hex','Hackage','CRAN','GitHub Actions','Debian','Alpine','Ubuntu']);
const cache=new Map(),TTL=600e3,hits=new Map(),RL=60;
// returns [status, body]
export async function check(params,headers,secret,caller){
 if(secret&&headers.get('x-rapidapi-proxy-secret')!==secret)return[403,{error:'forbidden'}];
 const k=(headers.get('x-rapidapi-user')||caller||'anon')+Math.floor(Date.now()/60e3),n=(hits.get(k)||0)+1;hits.set(k,n);if(hits.size>1e4)hits.clear();
 if(n>RL)return[429,{error:'rate limit 60/min'}];
 const pkg=params.get('pkg')||'',eco=params.get('ecosystem')||'npm',ver=params.get('version')||'';
 if(!/^[@\w.\/:+-]{1,214}$/.test(pkg))return[400,{error:'invalid pkg'}];
 if(!ECOS.has(eco))return[400,{error:'invalid ecosystem',allowed:[...ECOS]}];
 if(ver&&!/^[\w.+-]{1,64}$/.test(ver))return[400,{error:'invalid version'}];
 const ck=eco+'|'+pkg+'|'+ver,c=cache.get(ck);if(c&&Date.now()-c.t<TTL)return[200,{...c.v,cached:true}];
 try{const body={package:{name:pkg,ecosystem:eco}};if(ver)body.version=ver;
  const r=await fetch('https://api.osv.dev/v1/query',{method:'POST',body:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  if(!r.ok)return[502,{error:'upstream '+r.status}];const j=await r.json();
  const adv=(j.vulns||[]).map(x=>({id:x.id,aliases:x.aliases||[],summary:x.summary||null,severity:(x.database_specific||{}).severity||null,modified:x.modified,url:'https://osv.dev/vulnerability/'+x.id}));
  const v={pkg,ecosystem:eco,version:ver||null,count:adv.length,advisories:adv,source:'osv.dev',checked_at:new Date().toISOString()};
  cache.set(ck,{t:Date.now(),v});if(cache.size>5000)cache.clear();return[200,v];
 }catch{return[504,{error:'upstream timeout'}]}}
