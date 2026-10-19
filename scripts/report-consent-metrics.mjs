// Read-only daily totals. Run: node --env-file=.env.local scripts/report-consent-metrics.mjs
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
if (!url || !token) throw new Error('Configure the existing Upstash/KV REST integration to store consent totals.');
const days = 28;
// The browser-spoofing bot waves come from these (CLAUDE.md, GA4 measurement).
const BOT_COUNTRIES = new Set(['CN', 'SG', 'HK']);
const dates = Array.from({length:days},(_,i)=>new Date(Date.now()-(days-1-i)*86400000).toISOString().slice(0,10));
const response = await fetch(`${url}/pipeline`, {method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},
  body:JSON.stringify(dates.flatMap(d=>[['HGETALL',`consent:v2:${d}`],['HGETALL',`tally:v1:${d}`]]))});
if (!response.ok) throw new Error(`Counter read failed (${response.status})`);
const result=await response.json();
const hash=r=>{if(r.error)throw new Error('Counter store returned an error.');const v={};for(let j=0;j<(r.result||[]).length;j+=2)v[r.result[j]]=Number(r.result[j+1]);return v;};
const rows=dates.map((date,i)=>{
  const values=hash(result[2*i]),tally=hash(result[2*i+1]);
  let views=0,landings=0,viewsExBots=0,landingsExBots=0;
  for(const [field,n] of Object.entries(tally)){
    const [cc,kind]=field.split(':');const bot=BOT_COUNTRIES.has(cc);
    views+=n;if(!bot)viewsExBots+=n;
    if(kind==='land'){landings+=n;if(!bot)landingsExBots+=n;}
  }
  return {date,page_views:views,page_views_ex_cn_sg_hk:viewsExBots,landings_ex_cn_sg_hk:landingsExBots,
    shown:values.shown||0,accepted:values.accepted||0,rejected:values.rejected||0,updated:values.updated||0,qualified_redirect:values.qualified_redirect||0,from_extension:values.qualified_redirect_extension||0};
});
console.table(rows.filter(r=>Object.entries(r).some(([k,v])=>k!=='date'&&v)));
const total=rows.reduce((a,r)=>{for(const k of Object.keys(a))a[k]+=r[k];return a;},{page_views:0,page_views_ex_cn_sg_hk:0,landings_ex_cn_sg_hk:0,shown:0,accepted:0,rejected:0,updated:0,qualified_redirect:0,from_extension:0});
console.log({total,acceptanceAmongDecisions:total.accepted+total.rejected?total.accepted/(total.accepted+total.rejected):null});
const today=hash(result[2*(days-1)+1]);
console.log('Today by country (views incl. landings):',Object.entries(Object.entries(today).reduce((a,[f,n])=>{const cc=f.split(':')[0];a[cc]=(a[cc]||0)+n;return a;},{})).sort((a,b)=>b[1]-a[1]).slice(0,12));
console.log('page_views: engaged page views (first pointer/touch/key/scroll), no consent needed, automation and crawlers excluded; tally starts 2026-10-18.');
console.log('Consent counts are UI actions in the regions that ask (EU/EEA/UK/CH since 2026-10-18 evening) and operational redirects, not unique people or credited conversions.');
