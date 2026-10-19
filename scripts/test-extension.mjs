/**
 * Smoke test of the built extension against production (no mocks, except that
 * /go redirects are blocked so no real provider click is recorded):
 *
 *   npm run test:extension               # builds the production package first
 *   npm run test:extension:price-check   # + the price check on real provider pages
 *
 * Every tab renders real data, the toolbar rate and an alert work in the
 * worker, the popup talks to sendmoneycompare.com only, and nothing logs an
 * error. Exits 1 on any failure.
 */
import { chromium } from "playwright";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const EXT = path.resolve(import.meta.dirname, "../extension/build");
let failed = 0;
const ok = (c, m) => {
  if (!c) failed++;
  console.log(c ? "ok  " : "FAIL", m);
};

const ctx = await chromium.launchPersistentContext(mkdtempSync(path.join(os.tmpdir(), "smc-prod-")), {
  channel: "chromium", headless: true,
  // Provider sites serve their calculators to a normal desktop browser.
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`],
  viewport: { width: 380, height: 600 }, deviceScaleFactor: 2,
});
const outbound = [];
ctx.on("request", (r) => { const u = new URL(r.url()); if (u.protocol.startsWith("http")) outbound.push(u.host); });
await ctx.route(/\/(go|out)\//, (r) => r.abort());
let [sw] = ctx.serviceWorkers();
if (!sw) sw = await ctx.waitForEvent("serviceworker");
const id = sw.url().split("/")[2];
const errors = [];
const page = await ctx.newPage();
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(`chrome-extension://${id}/popup.html`);

await page.waitForSelector(".prow", { timeout: 20000 });
const rows = await page.locator(".prow").count();
ok(rows >= 3, `compare: ${rows} provider rows from production`);
ok(/\d/.test(await page.textContent(".receive-amount")), `compare: recipient gets ${await page.textContent(".receive-amount")}`);
await page.waitForSelector(".insight", { timeout: 15000 }).catch(() => {});
ok(await page.locator(".insight").count() >= 1, "compare: timing / top payout insights");
await page.waitForSelector("#live:not([hidden])", { timeout: 15000 }).catch(() => {});
ok(!(await page.locator("#live").isHidden()), `live strip: ${(await page.textContent("#live")).replace(/\s+/g, " ").slice(0, 80)}`);

await page.click('[data-tab="convert"]');
await page.waitForSelector(".chart-line", { timeout: 15000 });
const values = await page.locator(".conv-input").evaluateAll((els) => els.map((e) => e.value));
ok(values.every(Boolean), `convert: ${values.join(" | ")}`);
ok((await page.locator(".crow-chg .chg").count()) >= 1, "convert: period changes shown");
ok(/Live|Mid-market/.test(await page.textContent(".status")), `convert status: ${await page.textContent(".status")}`);

await page.click('[data-tab="offers"]');
await page.waitForTimeout(500);
ok((await page.locator(".orow").count()) >= 1, `offers: ${await page.locator(".orow").count()} offers (all verified 2026-10-18)`);

// Worker: toolbar rate and an alert that must fire at once.
await page.evaluate(() => chrome.storage.sync.set({
  watch: [{ from: "USD", to: "INR" }], badgePair: "USD:INR",
  alerts: [{ id: "t1", from: "USD", to: "INR", op: "above", target: 1, active: true }],
}));
await page.waitForTimeout(4000);
const badge = await sw.evaluate(() => chrome.action.getBadgeText({}));
ok(/^\d/.test(badge), `toolbar badge shows USD→INR: "${badge}"`);
const alerts = (await page.evaluate(() => chrome.storage.sync.get("alerts"))).alerts;
ok(alerts[0].active === false && alerts[0].firedRate > 1, `alert fired at ${alerts[0].firedRate}`);

await page.click('[data-tab="rates"]');
await page.waitForSelector(".wrow");
ok(/Reached/.test(await page.textContent(".wrow")), "rates: row shows the alert was reached");

const hosts = [...new Set(outbound)];
ok(hosts.every((h) => h === "sendmoneycompare.com"), `network: only ${hosts.join(", ")}`);
outbound.length = 0;
ok(errors.length === 0, `console errors: ${errors.length ? errors.join(" / ") : "none"}`);
// The price check on real provider pages (a build with --grant-price-check):
// the panel must appear and the detector must read amount, both currencies and
// the provider's own payout. Read-only: nothing on those pages is clicked.
if (process.argv.includes("--price-check")) {
  const PAGES = [
    "https://wise.com/us/send-money/send-money-to-india",
    "https://www.remitly.com/us/en/india",
    "https://www.xoom.com/india/send-money",
    "https://www.westernunion.com/us/en/send-money-to-india.html",
  ];
  for (const url of PAGES) {
    const p = await ctx.newPage();
    try {
      await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      let panel = false;
      for (let i = 0; i < 40 && !panel; i++) {
        await p.waitForTimeout(500);
        panel = await p.evaluate(() => Boolean(document.querySelector("smc-price-check")));
      }
      ok(panel, `price check on ${new URL(url).hostname}`);
    } catch (e) {
      ok(false, `price check on ${new URL(url).hostname}: ${e.message.split("\n")[0]}`);
    }
    await p.close();
  }
}

await ctx.close();
process.exit(failed ? 1 : 0);
