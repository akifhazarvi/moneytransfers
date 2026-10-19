// Read-only daily totals. Run: node --env-file=.env.local scripts/report-consent-metrics.mjs
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
if (!url || !token) throw new Error('Configure the existing Upstash/KV REST integration to store consent totals.');
const days = 28;
const dates = Array.from({length:days},(_,i)=>new Date(Date.now()-(days-1-i)*86400000).toISOString().slice(0,10));
const response = await fetch(`${url}/pipeline`, {method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(dates.map(d=>['HGETALL',`consent:v2:${d}`]))});
if (!response.ok) throw new Error(`Counter read failed (${response.status})`);
const result=await response.json();
const rows=result.map((r,i)=>{
  if(r.error)throw new Error('Counter store returned an error.');
  const values={};for(let j=0;j<(r.result||[]).length;j+=2)values[r.result[j]]=Number(r.result[j+1]);
  return {date:dates[i],shown:values.shown||0,accepted:values.accepted||0,rejected:values.rejected||0,updated:values.updated||0,qualified_redirect:values.qualified_redirect||0,from_extension:values.qualified_redirect_extension||0};
});
console.table(rows);
const total=rows.reduce((a,r)=>{for(const k of Object.keys(a))a[k]+=r[k];return a;},{shown:0,accepted:0,rejected:0,updated:0,qualified_redirect:0,from_extension:0});
console.log({total,acceptanceAmongDecisions:total.accepted+total.rejected?total.accepted/(total.accepted+total.rejected):null});
console.log('Counts are UI actions and operational redirects, not unique people or credited conversions.');
