import { test, expect } from "@playwright/test";

// Local-only tests intercept vendors and counters; they never send real analytics.
const pagePath = process.env.CONSENT_TEST_PATH || '/cookies';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/consent-metrics', route => route.fulfill({status:204}));
  await page.route(/https:\/\/[^/]*(?:google|clarity|trustpilot|vercel-insights)[^/]*\//, route => route.fulfill({status:200,body:''}));
  await page.route('**/_vercel/insights/**',route=>route.fulfill({status:200,body:''}));
});

test('notice gives equal choices, remembers rejection and reopens from footer', async ({page,context}, testInfo)=>{
  await page.goto(pagePath);
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await expect(notice).toBeVisible();
  const accept=notice.getByRole('button',{name:'Accept analytics'});
  const reject=notice.getByRole('button',{name:'Reject optional'});
  expect(await accept.getAttribute('class')).toBe(await reject.getAttribute('class'));
  await expect(accept).toBeInViewport();
  await expect(reject).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:`reports/consent-2026-10-18/${testInfo.project.name}.png`});
  await reject.click();await expect(notice).toBeHidden();
  expect((await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.denied');
  expect((await context.cookies()).some(c=>c.name==='smc_vid')).toBe(false);
  await page.reload();await expect(notice).toBeHidden();
  await page.getByRole('button',{name:'Cookie settings'}).first().click();
  await expect(notice).toBeVisible();
  await expect(notice.getByRole('checkbox',{name:/Usage analytics/})).not.toBeChecked();
  await expect(notice.getByRole('checkbox',{name:/Session replay/})).not.toBeChecked();
});

test('acceptance excludes replay; withdrawal clears cookies and survives reload',async({page,context})=>{
  await page.goto(pagePath);
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await notice.getByRole('button',{name:'Accept analytics'}).click();
  expect((await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.granted.denied');
  await page.evaluate(()=>{document.cookie='_ga=GA1.1.123.456; path=/';document.cookie='smc_vid=old; path=/';});
  await page.getByRole('button',{name:'Cookie settings'}).first().click();
  await notice.getByRole('button',{name:'Reject optional'}).click();
  await expect.poll(async()=> (await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.denied');
  await page.waitForLoadState('domcontentloaded');
  expect((await context.cookies()).some(c=>c.name==='_ga'||c.name==='smc_vid')).toBe(false);
  await expect(notice).toBeHidden();
});

test('unknown location and legacy automatic grants ask for an explicit choice',async({page,context,baseURL})=>{
  await context.addCookies([{name:'smc_consent',value:'granted',url:baseURL!}]);
  await page.goto(pagePath);
  const notice=page.getByRole('dialog',{name:'Cookie consent'});await expect(notice).toBeVisible();
  await notice.getByRole('button',{name:'Choose settings'}).click();
  await expect(notice.getByRole('checkbox',{name:/Usage analytics/})).not.toBeChecked();
  await expect(notice.getByRole('checkbox',{name:/Session replay/})).not.toBeChecked();
  await notice.getByRole('checkbox',{name:/Session replay/}).check();
  await notice.getByRole('button',{name:'Save choices'}).click();
  expect((await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.granted');
});

test('privacy signal keeps optional tracking disabled',async({page,context})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));
  await page.goto(pagePath);
  await expect.poll(async()=> (await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.denied');
  await page.getByRole('button',{name:'Cookie settings'}).first().click();
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await expect(notice.getByRole('button',{name:'Accept analytics'})).toBeDisabled();
  await expect(notice.getByRole('checkbox',{name:/Usage analytics/})).toBeDisabled();
});
