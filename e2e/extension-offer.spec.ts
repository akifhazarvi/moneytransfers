import type { BrowserContext, Page } from "@playwright/test";
import { test, expect, installPrompt, scrollUntilOffered, trackedEventParams } from "./fixtures";

// Desktop Chrome and Edge are offered the browser extension before the app
// (src/lib/browser-extension.ts, owner decision 2026-10-20). The store is never
// reached: its URL answers a stub, and only the URL the site opened is checked.

test.use({ hasExtension: false });

const STORE = /chromewebstore\.google\.com/;
const ADD = /^Add to (Chrome|Edge|browser)$/;

test.beforeEach(async ({ context }) => {
  await context.route(STORE, (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>store</title>" }));
});

/** Click and return the store tab's URL. */
async function storeUrlAfter(context: BrowserContext, click: () => Promise<void>): Promise<URL> {
  const [tab] = await Promise.all([context.waitForEvent("page"), click()]);
  await tab.waitForURL(STORE);
  const url = new URL(tab.url());
  await tab.close();
  return url;
}

/** Every /api/tally post this page makes: automated browsers must never count (navigator.webdriver). */
function tallyPosts(page: Page): string[] {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.url().endsWith("/api/tally")) posts.push(r.postData() ?? "");
  });
  return posts;
}

/** From here on, the extension answers the site, as 1.0.1+ does. */
async function installExtension(context: BrowserContext) {
  await context.addInitScript(() => {
    const w = window as Window & { chrome?: Record<string, unknown> };
    w.chrome = Object.assign(w.chrome ?? {}, {
      runtime: { sendMessage: (_id: string, _m: unknown, reply: (r: unknown) => void) => setTimeout(() => reply({ installed: true, version: "1.0.1" }), 0) },
    });
  });
}

test("the header offers the extension and opens its store page, attributed to the header", async ({ page, context }) => {
  await page.goto("/");
  const pill = page.getByRole("button", { name: ADD });
  await expect(pill).toBeVisible();
  await expect(page.getByRole("button", { name: "Install app", exact: true })).toHaveCount(0);

  const posts = tallyPosts(page);
  const store = await storeUrlAfter(context, () => pill.click());
  expect(store.pathname).toContain("lmlfkphheloiibbbchelmfpmalhpoboi");
  expect(Object.fromEntries(store.searchParams)).toMatchObject({ utm_source: "sendmoneycompare.com", utm_medium: "header", utm_campaign: "site_install" });
  await expect.poll(() => trackedEventParams(page, "extension_offer_clicked")).toEqual([expect.objectContaining({ placement: "header" })]);
  expect(posts, "a test run never reaches the production counters").toEqual([]);
});

test("the in-flow offer is the extension, with the app offer's rules", async ({ page, context }) => {
  await page.goto("/");
  await page.goto("/send-money");
  await scrollUntilOffered(page);
  const prompt = installPrompt(page);
  await expect(prompt).toHaveAttribute("data-pwa-install-prompt", "extension");
  await expect(prompt).toContainText(/Add SendMoneyCompare to (Chrome|Edge|your browser)/);
  expect(await trackedEventParams(page, "extension_offer_shown")).toEqual([expect.objectContaining({ placement: "comparison-end" })]);

  const store = await storeUrlAfter(context, () => prompt.getByRole("button", { name: ADD }).click());
  expect(store.searchParams.get("utm_medium")).toBe("comparison-end");
  await expect(prompt).toHaveCount(0);
  expect(await trackedEventParams(page, "pwa_install_prompt_shown")).toEqual([]);
});

test("Not now snoozes the offer like the app's", async ({ page, context }) => {
  await page.goto("/");
  await page.goto("/send-money");
  await scrollUntilOffered(page);
  await installPrompt(page).getByRole("button", { name: "Not now" }).click();
  await expect(installPrompt(page)).toHaveCount(0);
  expect(await trackedEventParams(page, "extension_offer_dismissed")).toEqual([expect.objectContaining({ placement: "comparison-end" })]);

  const later = await context.newPage();
  await later.goto("/exchange-rates");
  await later.waitForTimeout(5_500);
  await expect(installPrompt(later)).toHaveCount(0);
});

test("once the extension answers, the site offers the app and closes the install funnel", async ({ page, context }) => {
  await page.goto("/");
  await storeUrlAfter(context, () => page.getByRole("button", { name: ADD }).click());

  await installExtension(context);
  await page.reload();
  await expect(page.getByRole("button", { name: "Install app", exact: true })).toBeAttached();
  await expect(page.getByRole("button", { name: ADD })).toHaveCount(0);
  await expect.poll(() => trackedEventParams(page, "extension_install_confirmed")).toEqual([expect.objectContaining({ placement: "header" })]);
  await expect.poll(() => trackedEventParams(page, "extension_detected")).toEqual([expect.objectContaining({ version: "1.0.1" })]);

  // Detected once a session; confirmed once.
  await page.goto("/exchange-rates");
  await page.waitForTimeout(1_000);
  expect(await trackedEventParams(page, "extension_detected")).toEqual([]);
  expect(await trackedEventParams(page, "extension_install_confirmed")).toEqual([]);
});

test("after the extension's uninstall page, the site offers the app", async ({ page }) => {
  await page.goto("/contact?utm_source=chrome-extension&utm_medium=extension&utm_content=uninstall");
  await expect(page.getByRole("button", { name: "Install app", exact: true })).toBeAttached();
  await expect(page.getByRole("button", { name: ADD })).toHaveCount(0);
  await page.goto("/exchange-rates");
  await expect(page.getByRole("button", { name: "Install app", exact: true })).toBeAttached();
  await expect(page.getByRole("button", { name: ADD })).toHaveCount(0);
});

test("the review page names the provider's own site", async ({ page, context }) => {
  // Never forward or beacon from a test: the review page's Continue is a real click.
  await context.route("**/api/track/**", (route) => route.abort());
  await page.goto("/go/wise/review?from=GBP&to=INR&amount=1000");
  const card = page.locator(".go-review-card--extension");
  await card.scrollIntoViewIfNeeded();
  await expect(card).toContainText("A price check on Wise’s own site");

  // On screen is not a view here: the bots that hit /go render and scroll.
  await page.waitForTimeout(1_000);
  expect(await trackedEventParams(page, "extension_offer_shown")).toEqual([]);
  await page.mouse.move(40, 40);
  await expect.poll(() => trackedEventParams(page, "extension_offer_shown")).toEqual([expect.objectContaining({ placement: "go_review" })]);

  const store = await storeUrlAfter(context, () => card.getByRole("button", { name: ADD }).click());
  expect(store.searchParams.get("utm_medium")).toBe("go_review");
  await expect(page.locator(".go-review-card--app:not(.go-review-card--extension)")).toHaveCount(0);
});
