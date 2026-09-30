import { test, expect, everyCachedPath, savedPages, waitForServiceWorker } from "./fixtures";

test.describe("offline", () => {
  test("the worker takes control and saves the page it was installed on", async ({ page }) => {
    await page.goto("/");
    await waitForServiceWorker(page);
    // That page loaded before the worker existed; PwaManager asks for it.
    await expect.poll(() => savedPages(page)).toContain("/");
  });

  test("the first page read reopens offline, styled, labelled as a saved copy", async ({ page, context }) => {
    // The worker installs DURING this visit, so the page and its assets are
    // handed over after the fact (smc:save-pages) — the hardest case.
    await page.goto("/send-money");
    await waitForServiceWorker(page);
    await expect.poll(() => savedPages(page)).toContain("/send-money");

    await context.setOffline(true);
    const res = await page.reload();
    // Stamped by sw.js when it stored the copy: proof this came from the cache.
    expect(res?.headers()["x-smc-saved-at"]).toMatch(/^\d+$/);
    await expect(page.locator("h1").first()).toBeVisible();

    // The worker writes the label into the HTML itself, so it shows even when
    // no script runs (a CSS label React's hydration cannot remove)…
    expect(await res?.text()).toContain('<style id="smc-saved-copy"');
    // …and once React runs, it takes over as an announced status.
    const notice = page.locator("[data-pwa-offline-notice]");
    await expect(notice).toContainText("You're offline. This is a copy saved on");
    await expect(notice).toContainText("rates and fees may have changed since");
    expect(await page.evaluate(() => getComputedStyle(document.body, "::before").content)).toBe("none");

    // The page's own stylesheet came from the cache too.
    expect(
      await page.evaluate(() =>
        [...document.styleSheets].some((sheet) => {
          try {
            return !!sheet.href?.includes("/_next/static/") && sheet.cssRules.length > 0;
          } catch {
            return false;
          }
        }),
      ),
    ).toBe(true);

    // Back online, it stops saying "offline" and offers live figures.
    await context.setOffline(false);
    await expect(notice).toContainText("You're back online");
    await notice.getByRole("button", { name: "Reload" }).click();
    await expect(notice).toHaveCount(0);
    await expect(page.locator("#smc-saved-copy")).toHaveCount(0);
  });

  test("with scripts off, a saved copy still carries its label", async ({ browser, page, context }) => {
    await page.goto("/exchange-rates");
    await waitForServiceWorker(page);
    await expect.poll(() => savedPages(page)).toContain("/exchange-rates");
    await context.setOffline(true);
    const res = await page.reload();
    const html = (await res?.text()) ?? "";
    await page.close();

    // Render exactly what the worker served, with JavaScript disabled.
    // Nothing may load: the label must come from the served HTML alone (and
    // the page's absolute image/font URLs would otherwise hit the network).
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    await noJs.route("**/*", (route) => route.abort());
    const raw = await noJs.newPage();
    await raw.setContent(html, { waitUntil: "domcontentloaded" });
    const label = await raw.evaluate(() => getComputedStyle(document.body, "::before").content);
    expect(label).toContain("This is a copy saved on");
    expect(label).toContain("rates and fees may have changed since");
    await noJs.close();
  });

  test("a live page that loses its connection says its figures may be out of date", async ({ page, context }) => {
    await page.goto("/exchange-rates");
    await waitForServiceWorker(page);
    await context.setOffline(true);
    await expect(page.locator("[data-pwa-offline-notice]")).toContainText("You're offline");
    await context.setOffline(false);
    await expect(page.locator("[data-pwa-offline-notice]")).toHaveCount(0);
  });

  test("an unsaved page falls back to the offline page, which lists saved ones", async ({ page, context }) => {
    await page.goto("/");
    await waitForServiceWorker(page);
    await expect.poll(() => savedPages(page)).toContain("/");

    await context.setOffline(true);
    await page.goto("/methodology");
    await expect(page.getByRole("heading", { name: "You’re offline" })).toBeVisible();
    await expect(page.locator('#saved-list a[href="/"]')).toBeVisible();
    await expect(page.locator("#saved-list a").first()).toContainText("Saved");

    // Back online, the offline page reloads itself into the page that was asked for.
    await context.setOffline(false);
    await expect(page.getByRole("heading", { name: "You’re offline" })).toHaveCount(0);
    await expect(page).toHaveURL(/\/methodology$/);
  });

  test("online navigations are never answered from the cache", async ({ page }) => {
    await page.goto("/send-money");
    await waitForServiceWorker(page);
    await expect.poll(() => savedPages(page)).toContain("/send-money");

    const res = await page.reload();
    expect(res?.status()).toBe(200);
    expect(res?.headers()["x-smc-saved-at"]).toBeUndefined();
    await expect(page.locator("[data-pwa-offline-notice]")).toHaveCount(0);
  });

  test("affiliate redirects and API responses are never cached", async ({ page }) => {
    await page.goto("/");
    await waitForServiceWorker(page);
    await page.goto("/send-money");
    await page.goto("/exchange-rates");
    await expect.poll(() => savedPages(page)).toContain("/exchange-rates");

    const paths = await everyCachedPath(page);
    expect(paths.filter((p) => /^\/(go|out|api)\//.test(p))).toEqual([]);
  });

  test("tracking parameters do not create duplicate saved copies", async ({ page }) => {
    await page.goto("/");
    await waitForServiceWorker(page);
    await page.goto("/exchange-rates?utm_source=test&utm_medium=e2e");
    await expect.poll(() => savedPages(page)).toContain("/exchange-rates");
    expect((await savedPages(page)).filter((p) => p.includes("utm_"))).toEqual([]);
  });
});
