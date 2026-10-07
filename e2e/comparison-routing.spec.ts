import { expect, test } from '@playwright/test';

// Comparison selections belong to the browser, not separately indexed pages.
for (const to of ['CNY', 'CRC', 'NZD']) {
  test(`legacy USD/${to} has a clean canonical and no default INR fallback`, async ({ request, page }) => {
    const path = `/send-money?from=USD&to=${to}`;
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toMatch(/<link[^>]+rel="canonical"[^>]+href="https:\/\/sendmoneycompare\.com\/send-money"/);
    expect(html).not.toContain('Top providers for');
    const requested: string[] = [];
    await page.route('**/api/quotes?**', async (route) => {
      requested.push(new URL(route.request().url()).searchParams.get('to') ?? '');
      await route.fulfill({ json: { quotes: [] } });
    });
    await page.goto(path);
    await expect.poll(() => requested.includes(to)).toBe(true);
    expect(requested).not.toContain('INR');
    await expect(page.locator('a[href*="/send-money?"]')).toHaveCount(0);
  });
}

test('fragment comparisons follow hash changes and browser back', async ({ page }) => {
  const requested: string[] = [];
  await page.route('**/api/quotes?**', async (route) => {
    requested.push(new URL(route.request().url()).searchParams.get('to') ?? '');
    await route.fulfill({ json: { quotes: [] } });
  });
  await page.goto('/send-money#from=USD&to=CNY&amount=2500');
  await expect.poll(() => requested.includes('CNY')).toBe(true);
  requested.length = 0;
  await page.evaluate(() => { window.location.hash = 'from=GBP&to=NZD&amount=500'; });
  await expect(page).toHaveURL(/from=GBP&to=NZD&amount=500/);
  await expect.poll(() => requested.includes('NZD')).toBe(true);
  requested.length = 0;
  await page.goBack();
  await expect.poll(() => requested.includes('CNY')).toBe(true);
});
