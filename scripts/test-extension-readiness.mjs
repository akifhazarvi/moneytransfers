import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';

function analyticsHarness() {
  const listeners=[]; const sync={analytics:false},local={};const sent=[];
  const area=data=>({get:async keys=>typeof keys==='object'&&!Array.isArray(keys)?{...keys,...data}:Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,data[k]])),set:async patch=>{Object.assign(data,patch);if(data===sync)listeners.forEach(f=>f({analytics:{newValue:sync.analytics}},'sync'));},remove:async keys=>keys.forEach(k=>delete data[k])});
  const context={API:'https://example.com',navigator:{},crypto:webcrypto,setTimeout:()=>1,clearTimeout:()=>{},fetch:async(u,opts)=>sent.push(JSON.parse(opts.body)),chrome:{runtime:{getManifest:()=>({version:'1.0.0'})},storage:{sync:area(sync),local:area(local),onChanged:{addListener:f=>listeners.push(f)}}}};
  vm.createContext(context);
  const code=fs.readFileSync('extension/src/lib/analytics.js','utf8').replace(/^import .*;$/gm,'').replace(/\bexport /g,'');
  vm.runInContext(code+'\nglobalThis.api={analyticsReady,setAnalytics,track,flush};',context);
  return {context,sync,local,sent,api:context.api,change:value=>{sync.analytics=value;listeners.forEach(f=>f({analytics:{newValue:value}},'sync'));}};
}
test('no usage is sent before permission; opt-out in another context cancels queued events',async()=>{
  const h=analyticsHarness();await h.api.analyticsReady();h.api.track('ext_opened');await h.api.flush();assert.equal(h.sent.length,0);
  await h.api.setAnalytics(true);h.api.track('ext_opened');await h.api.flush();assert.equal(h.sent.length,1);
  h.api.track('ext_tab');h.change(false);await h.api.flush();assert.equal(h.sent.length,1);assert.equal(h.local.aid,undefined);
});
test('GPC and DNT prevent extension analytics and ID creation',async()=>{
  for(const key of ['globalPrivacyControl','doNotTrack']){
    const h=analyticsHarness();h.context.navigator[key]=key==='doNotTrack'?'1':true;h.sync.analytics=true;
    assert.equal(await h.api.analyticsReady(),false);h.api.track('ext_opened');await h.api.flush();assert.equal(h.sent.length,0);assert.equal(h.local.aid,undefined);
  }
});
test('alerts never fire from stale or offline cached data',async()=>{
  const code=fs.readFileSync('extension/src/background.js','utf8');const fn=code.slice(code.indexOf('async function runCheck('),code.indexOf('async function paintBadge('));
  for(const scenario of ['fresh','stale','offline']){
    let fired=0;const rates={rates:{USD:1,INR:90},asOf:new Date(Date.now()-(scenario==='stale'?48:1)*3600000).toISOString()};
    const ctx={saved:async()=>({data:rates}),fetchJson:async()=>{if(scenario==='offline')throw Error('offline');return rates;},save:async()=>{},getPrefs:async()=>({}),paintBadge:async()=>{},fireAlerts:async()=>fired++};
    vm.createContext(ctx);vm.runInContext(fn,ctx);await ctx.runCheck();assert.equal(fired,scenario==='fresh'?1:0,scenario);
  }
});
