const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { createHash } = require('node:crypto');
function moduleFrom(path, imports = {}, globals = {}) {
  const context = { exports: {}, URL, require: name => { if (!(name in imports)) throw Error(name); return imports[name]; }, ...globals };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  return context.exports;
}
const consent = moduleFrom('src/lib/consent.ts');
const scripts = moduleFrom('src/lib/inline-scripts.ts');
function browser(cookie = '', navigator = {}, hostname = 'sendmoneycompare.com') {
  const listeners = new Map(), timers = [], requests = [], storage = new Map();
  const context = { navigator, location: { hostname, pathname: '/iban', search: '', href: `https://${hostname}/iban` },
    document: { cookie, title: 'IBAN', referrer: '', createElement: () => ({}), head: { appendChild: s => requests.push(s.src) } },
    sessionStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v) },
    addEventListener: (event, callback) => listeners.set(event, [...(listeners.get(event) || []), callback]),
    setTimeout: callback => timers.push(callback), matchMedia: () => ({ matches: false }), URL };
  context.window = context;
  vm.createContext(context);
  return { context, requests, timers, fire: e => (listeners.get(e) || []).forEach(f => f()), run: s => vm.runInContext(s, context) };
}
test('legacy automatic grants and malformed choices are never explicit permission', () => {
  for (const cookie of ['', 'smc_consent=granted', 'smc_consent=v2.granted.deniedbad', 'other_smc_consent=v2.granted.denied']) assert.equal(consent.readConsent(cookie), null);
  assert.equal(consent.readConsent('smc_consent=denied').analytics, false);
  assert.equal(consent.readConsent('a=1; smc_consent=v2.granted.denied').analytics, true);
});
test('server requires a versioned analytics grant and honors privacy headers', () => {
  for (const cookie of ['', 'smc_consent=denied', 'smc_consent=granted', 'smc_consent=v2.denied.granted']) assert.equal(consent.requestAnalyticsAllowed(new Request('https://example.com', {headers:{cookie}})), false);
  const cookie = 'smc_consent=v2.granted.denied';
  assert.equal(consent.requestAnalyticsAllowed(new Request('https://example.com',{headers:{cookie}})),true);
  for(const header of ['sec-gpc','dnt']) assert.equal(consent.requestAnalyticsAllowed(new Request('https://example.com',{headers:{cookie,[header]:'1'}})),false);
});
test('no Google or Clarity loads before consent, after rejection or legacy automatic grant', () => {
  for(const cookie of ['', 'smc_consent=denied','smc_consent=granted','smc_consent=v2.denied.denied']) {
    const b=browser(cookie);b.run(scripts.GTAG_INLINE);b.run(scripts.CLARITY_INLINE);
    b.fire('pointerdown');b.fire('scroll');b.timers.forEach(f=>f());
    b.context.gtag('event','provider_clicked');assert.equal(b.requests.length,0);
    assert.equal(b.context.dataLayer.filter(a=>a[0]==='event').length,0);
  }
});
test('acceptance loads Google once with one current-page view; no replay of earlier events', () => {
  const b=browser();b.run(scripts.GTAG_INLINE);b.run(scripts.CLARITY_INLINE);
  b.context.gtag('event','before_consent');
  b.context.document.cookie='smc_consent=v2.granted.denied';b.fire('smc:consent-changed');b.fire('scroll');b.timers.forEach(f=>f());
  assert.equal(b.requests.length,1);assert.match(b.requests[0],/googletagmanager/);
  const commands=b.context.dataLayer.map(a=>Array.from(a));
  assert.equal(commands.filter(a=>a[0]==='config').length,1);
  assert.equal(commands.filter(a=>a[0]==='event').length,0);
  b.context.gtag('event','after_consent');assert.equal(b.context.dataLayer.filter(a=>a[0]==='event').length,1);
  b.context.document.cookie='smc_consent=v2.denied.denied';b.fire('smc:consent-changed');b.context.gtag('event','after_withdrawal');
  assert.equal(b.context.dataLayer.filter(a=>a[0]==='event').length,1);
  assert.equal(b.context['ga-disable-G-HJH07QEJ30'],true);
});
test('replay-only choice loads Clarity independently and denies advertising', () => {
  const b=browser('smc_consent=v2.denied.granted');b.run(scripts.GTAG_INLINE);b.run(scripts.CLARITY_INLINE);b.fire('pointerdown');
  assert.equal(b.requests.length,1);assert.match(b.requests[0],/clarity.ms/);
  assert.equal(b.context.clarity.q[0][1].ad_Storage,'denied');
});
test('privacy signals, previews and automation cannot load optional SDKs', () => {
  for(const [nav,host] of [[{globalPrivacyControl:true},'sendmoneycompare.com'],[{doNotTrack:'1'},'sendmoneycompare.com'],[{webdriver:true},'sendmoneycompare.com'],[{},'localhost']]) {
    const b=browser('smc_consent=v2.granted.granted',nav,host);b.run(scripts.GTAG_INLINE);b.run(scripts.CLARITY_INLINE);b.fire('pointerdown');b.fire('smc:consent-changed');b.timers.forEach(f=>f());assert.equal(b.requests.length,0);
  }
});
test('Measurement Protocol cannot bypass rejected or missing consent',async()=>{
  let calls=0;
  const ga=moduleFrom('src/lib/ga4-server.ts',{'@/lib/consent':consent,'@/lib/ga4-params':{forGa4:x=>x}},{process:{env:{GA4_API_SECRET:'test'}},fetch:async()=>{calls++;}});
  await ga.gaServerEvent('test',{},'client',{},new Request('https://example.com'));
  await ga.gaServerEvent('test',{},'client',{},new Request('https://example.com',{headers:{cookie:'smc_consent=v2.denied.denied'}}));
  assert.equal(calls,0);
  await ga.gaServerEvent('test',{},'client',{},new Request('https://example.com',{headers:{cookie:'smc_consent=v2.granted.denied'}}));assert.equal(calls,1);
});
test('all inline CSP hashes match actual script bytes',()=>{
  for(const key of ['GTAG_INLINE','CLARITY_INLINE','THEME_INLINE','PWA_INLINE'])assert.equal(createHash('sha256').update(scripts[key]).digest('base64'),scripts[`${key}_SHA256`]);
});
test('server redirects keep only aggregate totals without consent',async()=>{
  const vendors=[],totals=[];
  const sink=moduleFrom('src/lib/server-track.ts',{
    '@/lib/consent':consent,
    '@/lib/consent-metrics':{countConsentMetric:async e=>totals.push(e)},
    '@/lib/ga4-server':{gaServerEvent:async (...args)=>vendors.push(['ga',...args])},
    '@vercel/analytics/server':{track:async (...args)=>vendors.push(['vercel',...args])},
  },{process:{env:{}}});
  const params={outcome:'redirect',genuine_click:true,is_bot:false,click_id:'private-id'};
  await sink.serverTrack('affiliate_redirect',params,'private-client',{},new Request('https://example.com'));
  assert.deepEqual(totals,['qualified_redirect']);assert.equal(vendors.length,0);
  await sink.serverTrack('affiliate_redirect',params,'client',{},new Request('https://example.com',{headers:{cookie:'smc_consent=v2.granted.denied'}}));
  assert.equal(vendors.length,2);
});
test('counter endpoint accepts only bounded same-origin consent actions',async()=>{
  const totals=[];
  const api=moduleFrom('src/app/api/consent-metrics/route.ts',{
    'next/server':{NextResponse:Response},
    '@/lib/consent-metrics':{countConsentMetric:async e=>totals.push(e)},
    '@/lib/rate-limit':{checkRateLimit:()=>({allowed:true})},
  });
  const request=(event,origin='https://example.com')=>new Request('https://example.com/api/consent-metrics',{method:'POST',headers:{origin,'sec-fetch-site':'same-origin','content-type':'application/json'},body:JSON.stringify({event})});
  await api.POST(request('accepted','https://other.example'));
  await api.POST(request('qualified_redirect'));
  await api.POST(request('a'.repeat(200)));
  assert.equal(totals.length,0);
  await api.POST(request('accepted'));assert.deepEqual(totals,['accepted']);
});
