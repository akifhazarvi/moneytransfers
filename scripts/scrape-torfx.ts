/**
 * TorFX Scraper
 *
 * TorFX is a UK-based currency broker, strong for GBP corridors and large transfers.
 * They have a public live-rates page and a currency converter calculator.
 *
 * Strategy:
 *  1. Direct rates API — torfx.com/api/rates or /rates/live JSON endpoint
 *  2. Browser interception — load torfx.com calculator, capture API response
 *  3. DOM fallback — parse rate from the live-rates table
 */
import {
  NAV_TIMEOUT,
  SEND_AMOUNTS,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  fillAmountInput,
  humanClick,
  withRetry,
  writeOutput,
  parseNumber,
  extractReceiveAmount,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext } from "playwright";

const CORRIDORS = [
  // GBP-centric (TorFX core market)
  { from: "GBP", to: "EUR" }, { from: "GBP", to: "USD" },
  { from: "GBP", to: "AUD" }, { from: "GBP", to: "CAD" },
  { from: "GBP", to: "NZD" }, { from: "GBP", to: "ZAR" },
  { from: "GBP", to: "CHF" }, { from: "GBP", to: "INR" },
  { from: "GBP", to: "PKR" }, { from: "GBP", to: "NGN" },
  { from: "GBP", to: "PHP" }, { from: "GBP", to: "BDT" },
  // EUR
  { from: "EUR", to: "GBP" }, { from: "EUR", to: "USD" },
  { from: "EUR", to: "AUD" }, { from: "EUR", to: "CAD" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "NGN" },
  // USD
  { from: "USD", to: "GBP" }, { from: "USD", to: "EUR" },
  { from: "USD", to: "AUD" }, { from: "USD", to: "CAD" },
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" }, { from: "USD", to: "NGN" },
  // AUD
  { from: "AUD", to: "GBP" }, { from: "AUD", to: "EUR" },
  { from: "AUD", to: "USD" }, { from: "AUD", to: "INR" },
  { from: "AUD", to: "PHP" }, { from: "AUD", to: "NZD" },
  // CAD
  { from: "CAD", to: "GBP" }, { from: "CAD", to: "EUR" },
  { from: "CAD", to: "USD" }, { from: "CAD", to: "INR" },
  // AED
  { from: "AED", to: "INR" }, { from: "AED", to: "PKR" },
  // SAR
  { from: "SAR", to: "INR" }, { from: "SAR", to: "PKR" },
];

function buildQuote(
  from: string, to: string, amount: number,
  rate: number, fee: number, source: string,
  apiRecv = 0
): ProviderQuote {
  return {
    provider: "TorFX",
    providerSlug: "torfx",
    providerType: "moneyTransferProvider",
    sendCurrency: from, receiveCurrency: to, sendAmount: amount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: apiRecv > 0 ? Math.round(apiRecv * 100) / 100 : Math.round((amount - fee) * rate * 100) / 100,
    paymentMethod: null,
    deliveryEstimate: "1-2 business days",
    deliveryMethod: null,
    dateCollected: new Date().toISOString(), source,
  };
}

// ---------------------------------------------------------------------------
// Strategy 1 — public rates API
// ---------------------------------------------------------------------------
const rateCache = new Map<string, number>();

async function tryPublicApi(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  const cacheKey = `${from}:${to}`;
  const cached = rateCache.get(cacheKey);
  if (cached) return buildQuote(from, to, amount, cached, 0, "torfx-api-cache");

  const endpoints = [
    `https://www.torfx.com/rates/live-rates-api?baseCurrency=${from}&targetCurrency=${to}`,
    `https://www.torfx.com/api/rates?from=${from}&to=${to}`,
    `https://www.torfx.com/currency/${from.toLowerCase()}-${to.toLowerCase()}/api`,
    `https://api.torfx.com/rates?base=${from}&quote=${to}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Referer": "https://www.torfx.com/",
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) continue;
      const data: Record<string, unknown> = JSON.parse(text);
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.buyRate ?? data.customerRate ?? data[to] ?? "0"));
      if (rate <= 0) continue;
      rateCache.set(cacheKey, rate);
      return buildQuote(from, to, amount, rate, 0, "torfx-api", extractReceiveAmount(data));
    } catch { continue; }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Strategy 2 — browser interception + calculator
// ---------------------------------------------------------------------------
async function tryBrowser(
  context: BrowserContext,
  from: string,
  to: string,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let capturedRate = rateCache.get(`${from}:${to}`) ?? 0;

  page.on("response", async (response) => {
    const url = response.url();
    if (capturedRate) return;
    if (!url.includes("torfx.com")) return;
    if (response.status() !== 200) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      if (!body.includes("rate") && !body.includes("Rate") && !body.includes("exchange")) return;
      const data: Record<string, unknown> = JSON.parse(body);
      const r = parseFloat(String(data.rate ?? data.exchangeRate ?? data.customerRate ?? data[to] ?? "0"));
      if (r > 0) {
        capturedRate = r;
        rateCache.set(`${from}:${to}`, r);
      }
    } catch { /* ignore */ }
  });

  try {
    // Try converter page first
    const converterUrl = `https://www.torfx.com/currency/${from.toLowerCase()}-to-${to.toLowerCase()}`;
    try {
      await page.goto(converterUrl, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    } catch {
      await page.goto("https://www.torfx.com/", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    }

    await delay(2500);
    await dismissOverlays(page);

    // Fill amount in converter
    const amountFilled = await fillAmountInput(page, amount, [
      'input[name*="amount"]', 'input[id*="amount"]',
      'input[aria-label*="amount" i]', 'input[data-testid*="amount"]',
      'input[class*="amount"]', 'input[inputmode="decimal"]', 'input[type="number"]',
    ]);

    // Select currencies if dropdowns present
    if (!capturedRate) {
      for (const sel of ['select[name*="from"]', 'select[id*="from"]', 'select[name*="base"]']) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 800 })) {
            await el.selectOption({ value: from });
            await delay(300);
            break;
          }
        } catch { continue; }
      }
      for (const sel of ['select[name*="to"]', 'select[id*="to"]', 'select[name*="quote"]']) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 800 })) {
            await el.selectOption({ value: to });
            await delay(300);
            break;
          }
        } catch { continue; }
      }
    }

    if (amountFilled) {
      await humanClick(page, 'button[type="submit"], button:has-text("Convert"), button:has-text("Calculate"), button:has-text("Get rate")');
      await delay(3000);
    } else {
      await delay(2000);
    }

    if (capturedRate) return buildQuote(from, to, amount, capturedRate, 0, "torfx-browser");

    // DOM fallback — look for rate display
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const rateRe = new RegExp(`1\\s*${from}[^\\d]*([\\d,.]+)\\s*${to}`, "i");
    const m = bodyText.match(rateRe) ?? bodyText.match(new RegExp(`${from}[^\\d]+([\\d.]{4,})[^\\d]+${to}`, "i"));
    if (m) {
      const r = parseNumber(m[1]);
      if (r > 0) {
        rateCache.set(`${from}:${to}`, r);
        return buildQuote(from, to, amount, r, 0, "torfx-dom");
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== TorFX Scraper ===\n");
  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0, failCount = 0;
  const startTime = Date.now();

  try {
    for (const c of CORRIDORS) {
      console.log(`\n${c.from} → ${c.to}`);

      // Fetch rate once per corridor, synthesise quotes for all amounts
      let baseRate = rateCache.get(`${c.from}:${c.to}`) ?? 0;
      if (!baseRate) {
        const probe = await withRetry(() => tryPublicApi(c.from, c.to, SEND_AMOUNTS[1]), 2);
        if (!probe) {
          const bProbe = await withRetry(() => tryBrowser(context, c.from, c.to, SEND_AMOUNTS[1]), 2);
          if (bProbe) baseRate = bProbe.exchangeRate;
        } else {
          baseRate = probe.exchangeRate;
        }
      }

      if (!baseRate) {
        failCount += SEND_AMOUNTS.length;
        console.log(`  ✗ No rate found for ${c.from}→${c.to}`);
        continue;
      }

      for (const amount of SEND_AMOUNTS) {
        const q = buildQuote(c.from, c.to, amount, baseRate, 0, "torfx-api");
        allQuotes.push(q);
        successCount++;
        console.log(`  ✓ $${amount} rate=${q.exchangeRate} recv=${q.receiveAmount}`);
      }

      await jitteredDelay(1000);
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("TorFX", "torfx", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("TorFX scraper failed:", err); process.exit(1); });
