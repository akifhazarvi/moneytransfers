// The browser extension's funnel from the site, as daily totals with no identifier
// (src/lib/browser-extension.ts → /api/tally → ext:v1:<day>), plus the
// extension's own Send clicks (consent:v2 qualified_redirect_extension).
// Run: node --env-file=.env.local scripts/report-extension.mjs [days]
//
// Installs, uninstalls and weekly users come from the store dashboards
// (Chrome Web Store: Analytics, with utm_medium = the surface below); usage
// inside the extension is the opt-in GA4 stream (ext_* events).
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
if (!url || !token) throw new Error('Configure the existing Upstash/KV REST integration to read the extension totals.');
const days = Number(process.argv[2]) || 28;
const dates = Array.from({length:days},(_,i)=>new Date(Date.now()-(days-1-i)*86400000).toISOString().slice(0,10));
const response = await fetch(`${url}/pipeline`, {method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},
  body:JSON.stringify(dates.flatMap(d=>[['HGETALL',`ext:v1:${d}`],['HGET',`consent:v2:${d}`,'qualified_redirect_extension']]))});
if (!response.ok) throw new Error(`Counter read failed (${response.status})`);
const result=await response.json();
const hash=r=>{if(r.error)throw new Error('Counter store returned an error.');const v={};for(let j=0;j<(r.result||[]).length;j+=2)v[r.result[j]]=Number(r.result[j+1]);return v;};
const KINDS=['shown','click','confirmed','visit','uninstall'];
const bySurface={};
const rows=dates.map((date,i)=>{
  const row={date,...Object.fromEntries(KINDS.map(k=>[k,0])),send_clicks:Number(result[2*i+1].result||0)};
  for(const [field,n] of Object.entries(hash(result[2*i]))){
    const [kind,label]=field.split(':');
    if(!(kind in row))continue;
    row[kind]+=n;
    (bySurface[label]??=Object.fromEntries(KINDS.map(k=>[k,0])))[kind]+=n;
  }
  return row;
});
console.table(rows.filter(r=>Object.entries(r).some(([k,v])=>k!=='date'&&v)));
const total=rows.reduce((a,r)=>{for(const k of Object.keys(a))a[k]+=r[k];return a;},{...Object.fromEntries(KINDS.map(k=>[k,0])),send_clicks:0});
console.log({total,clickPerShown:total.shown?total.click/total.shown:null,confirmedPerClick:total.click?total.confirmed/total.click:null});
console.log('By surface (shown/click/confirmed) and browser (visit/uninstall):');
console.table(bySurface);
console.log('shown counts the in-flow offer and the /go review card only (the header pill and footer link are always there). confirmed needs extension 1.0.1+ and the same browser that clicked; visit is once a session; tally starts 2026-10-20.');
