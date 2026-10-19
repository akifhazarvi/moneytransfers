import { test, expect } from "@playwright/test";

// Local-only tests intercept vendors and counters; they never send real analytics.
const pagePath = process.env.CONSENT_TEST_PATH || '/cookies';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/consent-metrics', route => route.fulfill({status:204}));
  await page.route('**/api/tally', route => route.fulfill({status:204}));
  await page.route(/https:\/\/[^/]*(?:google|clarity|trustpilot|vercel-insights)[^/]*\//, route => route.fulfill({status:200,body:''}));
  await page.route('**/_vercel/insights/**',route=>route.fulfill({status:200,body:''}));
});

// The notice asks only where the law requires a choice (consent.ts); the
// middleware keeps an existing geo-country cookie, so a test can pick the region.
const inRegion = (country: string) => async ({ context, baseURL }: { context: import("@playwright/test").BrowserContext; baseURL?: string }) =>
  context.addCookies([{ name: 'geo-country', value: country, url: baseURL! }]);

test('EU: notice gives equal choices, remembers rejection and reopens from footer', async ({page,context,baseURL}, testInfo)=>{
  await inRegion('DE')({context,baseURL});
  await page.goto(pagePath);
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await expect(notice).toBeVisible();
  const accept=notice.getByRole('button',{name:'Allow'});
  const reject=notice.getByRole('button',{name:'No thanks'});
  expect(await accept.getAttribute('class')).toBe(await reject.getAttribute('class'));
  await expect(accept).toBeInViewport();
  await expect(reject).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:`test-results/consent-${testInfo.project.name}.png`});
  await reject.click();await expect(notice).toBeHidden();
  expect((await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.denied');
  expect((await context.cookies()).some(c=>c.name==='smc_vid')).toBe(false);
  await page.reload();await expect(notice).toBeHidden();
  await page.getByRole('button',{name:'Cookie settings'}).first().click();
  await expect(notice).toBeVisible();
  await expect(notice.getByRole('checkbox',{name:/Usage analytics/})).not.toBeChecked();
  await expect(notice.getByRole('checkbox',{name:/Session replay/})).not.toBeChecked();
});

test('EU: Allow grants analytics and replay; withdrawal clears cookies and survives reload',async({page,context,baseURL})=>{
  await inRegion('FR')({context,baseURL});
  await page.goto(pagePath);
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await notice.getByRole('button',{name:'Allow'}).click();
  expect((await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.granted.granted');
  await page.evaluate(()=>{document.cookie='_ga=GA1.1.123.456; path=/';document.cookie='smc_vid=old; path=/';});
  await page.getByRole('button',{name:'Cookie settings'}).first().click();
  await notice.getByRole('button',{name:'No thanks'}).click();
  await expect.poll(async()=> (await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.denied');
  await page.waitForLoadState('domcontentloaded');
  expect((await context.cookies()).some(c=>c.name==='_ga'||c.name==='smc_vid')).toBe(false);
  await expect(notice).toBeHidden();
});

test('UK: legacy automatic grants ask for an explicit choice',async({page,context,baseURL})=>{
  await inRegion('GB')({context,baseURL});
  await context.addCookies([{name:'smc_consent',value:'granted',url:baseURL!}]);
  await page.goto(pagePath);
  const notice=page.getByRole('dialog',{name:'Cookie consent'});await expect(notice).toBeVisible();
  await notice.getByRole('button',{name:'Settings'}).click();
  await expect(notice.getByRole('checkbox',{name:/Usage analytics/})).not.toBeChecked();
  await expect(notice.getByRole('checkbox',{name:/Session replay/})).not.toBeChecked();
  await notice.getByRole('checkbox',{name:/Session replay/}).check();
  await notice.getByRole('button',{name:'Save choices'}).click();
  expect((await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.granted');
});

test('elsewhere: no notice asks, both run by default, Cookie settings can refuse',async({page,context,baseURL})=>{
  await inRegion('US')({context,baseURL});
  await page.goto(pagePath);
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await page.waitForTimeout(500);
  await expect(notice).toBeHidden();
  await page.getByRole('button',{name:'Cookie settings'}).first().click();
  await expect(notice).toBeVisible();
  await expect(notice.getByRole('checkbox',{name:/Usage analytics/})).toBeChecked();
  await expect(notice.getByRole('checkbox',{name:/Session replay/})).toBeChecked();
  await notice.getByRole('button',{name:'No thanks'}).click();
  await expect.poll(async()=> (await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.denied');
  await page.waitForLoadState('domcontentloaded');
  await expect(notice).toBeHidden();
});

test('privacy signal keeps optional tracking disabled',async({page,context,baseURL})=>{
  await inRegion('US')({context,baseURL});
  await page.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));
  await page.goto(pagePath);
  await expect.poll(async()=> (await context.cookies()).find(c=>c.name==='smc_consent')?.value).toBe('v2.denied.denied');
  await page.getByRole('button',{name:'Cookie settings'}).first().click();
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await expect(notice.getByRole('button',{name:'Allow'})).toBeDisabled();
  await expect(notice.getByRole('checkbox',{name:/Usage analytics/})).toBeDisabled();
});

test('the notice never covers the Send bar',async({page,context,baseURL})=>{
  await inRegion('DE')({context,baseURL});
  await page.goto('/send-money/usa-to-india');
  const notice=page.getByRole('dialog',{name:'Cookie consent'});
  await expect(notice).toBeVisible();
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(250); }
  await page.waitForTimeout(1000);
  const overlap = await page.evaluate(() => {
    const box = document.querySelector('[data-consent-banner] > div')!.getBoundingClientRect();
    const docked = [...document.querySelectorAll<HTMLElement>('.pwa-lift:not([data-consent-banner])')]
      .map(el => el.getBoundingClientRect())
      .filter(r => r.height > 0 && r.top < innerHeight && r.width >= innerWidth * 0.5);
    return { docked: docked.length, overlaps: docked.filter(r => r.top < box.bottom - 1).length };
  });
  expect(overlap.overlaps).toBe(0);
});
