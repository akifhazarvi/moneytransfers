/**
 * CurrencyFair Scraper
 *
 * CurrencyFair is a peer-to-peer exchange marketplace with competitive rates.
 * They expose live exchange rates via a public-ish API.
 *
 * Strategy:
 *  1. Public rates API — currencyfair.com/api/rates or widget endpoint
 *  2. Browser interception — load calculator, capture API response
 *  3. DOM fallback
 */
import {
  NAV_TIMEOUT,
  SEND_AMOUNTS,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  fillAmountInput,
  withRetry,
  writeOutput,
  parseNumber,
  extractReceiveAmount,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext } from "playwright";

const CORRIDORS = [
  { from: "GBP", to: "EUR" }, { from: "GBP", to: "USD" },
  { from: "GBP", to: "AUD" }, { from: "GBP", to: "CAD" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "HKD" },
  { from: "GBP", to: "CHF" }, { from: "GBP", to: "NZD" },
  { from: "EUR", to: "GBP" }, { from: "EUR", to: "USD" },
  { from: "EUR", to: "AUD" }, { from: "EUR", to: "CAD" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "HKD" },
  { from: "EUR", to: "CHF" }, { from: "EUR", to: "PLN" },
  { from: "USD", to: "EUR" }, { from: "USD", to: "GBP" },
  { from: "USD", to: "AUD" }, { from: "USD", to: "CAD" },
  { from: "USD", to: "INR" }, { from: "USD", to: "HKD" },
  { from: "AUD", to: "EUR" }, { from: "AUD", to: "GBP" },
  { from: "AUD", to: "USD" }, { from: "AUD", to: "NZD" },
  { from: "CAD", to: "EUR" }, { from: "CAD", to: "GBP" },
  { from: "CAD", to: "USD" }, { from: "CAD", to: "INR" },
];

const rateCache = new Map<string, number>();

function buildQuote(
  from: string, to: string, amount: number,
  rate: number, fee: number, source: string,
  apiRecv = 0
): ProviderQuote {
  // CurrencyFair charges a flat €3 / £3 / $3 fee per transfer + minimal markup
  const effectiveFee = fee || 3;
  return {
    provider: "CurrencyFair",
    providerSlug: "currencyfair",
    providerType: "moneyTransferProvider",
    sendCurrency: from, receiveCurrency: to, sendAmount: amount,
    fee: Math.round(effectiveFee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: apiRecv > 0 ? Math.round(apiRecv * 100) / 100 : Math.round((amount - effectiveFee) * rate * 100) / 100,
    paymentMethod: null,
    deliveryEstimate: "1-2 business days",
    deliveryMethod: null,
    dateCollected: new Date().toISOString(), source,
  };
}

// ---------------------------------------------------------------------------
// Strategy 1 — public API
// ---------------------------------------------------------------------------
async function tryPublicApi(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  const cached = rateCache.get(`${from}:${to}`);
  if (cached) return buildQuote(from, to, amount, cached, 0, "currencyfair-api-cache");

  const endpoints = [
    `https://app.currencyfair.com/api/v1/rates?from=${from}&to=${to}`,
    `https://www.currencyfair.com/api/rates?baseCurrency=${from}&targetCurrency=${to}`,
    `https://www.currencyfair.com/api/v1/exchange-rates?from=${from}&to=${to}&amount=${amount}`,
    `https://app.currencyfair.com/api/exchange-rate?sell=${from}&buy=${to}&amount=${amount}`,
    `https://www.currencyfair.com/tools/currency-converter/api?from=${from}&to=${to}&amount=${amount}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Referer": "https://www.currencyfair.com/",
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.trim().startsWith("{")) continue;
      const data: Record<string, unknown> = JSON.parse(text);
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.marketRate ?? data.bestRate ?? data[to] ?? "0"));
      if (rate <= 0) continue;
      rateCache.set(`${from}:${to}`, rate);
      return buildQuote(from, to, amount, rate, 0, "currencyfair-api", extractReceiveAmount(data));
    } catch { continue; }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Strategy 2 — browser interception
// ---------------------------------------------------------------------------
async function tryBrowser(
  context: BrowserContext,
  from: string, to: string,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let capturedRate = rateCache.get(`${from}:${to}`) ?? 0;
  let capturedFee = 0;

  page.on("response", async (response) => {
    const url = response.url();
    if (capturedRate) return;
    if (!url.includes("currencyfair.com")) return;
    if (response.status() !== 200) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      if (!body.includes("rate") && !body.includes("Rate")) return;
      const data: Record<string, unknown> = JSON.parse(body);
      const r = parseFloat(String(data.rate ?? data.exchangeRate ?? data.marketRate ?? data.bestRate ?? "0"));
      const f = parseFloat(String(data.fee ?? data.totalFee ?? "0"));
      if (r > 0) { capturedRate = r; capturedFee = f; rateCache.set(`${from}:${to}`, r); }
    } catch { /* ignore */ }
  });

  try {
    const converterUrl = `https://www.currencyfair.com/tools/currency-converter/?sell=${from}&buy=${to}&amount=${amount}`;
    try {
      await page.goto(converterUrl, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    } catch {
      await page.goto("https://www.currencyfair.com/", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    }

    await delay(2500);
    await dismissOverlays(page);

    // Set currencies
    for (const sel of ['select[name*="sell"]', 'select[id*="from"]', 'select[name*="from"]']) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 800 })) { await el.selectOption({ value: from }); await delay(300); break; }
      } catch { continue; }
    }
    for (const sel of ['select[name*="buy"]', 'select[id*="to"]', 'select[name*="to"]']) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 800 })) { await el.selectOption({ value: to }); await delay(300); break; }
      } catch { continue; }
    }

    await fillAmountInput(page, amount, [
      'input[name*="amount"]', 'input[id*="amount"]',
      'input[aria-label*="amount" i]', 'input[data-testid*="amount"]',
      'input[inputmode="decimal"]', 'input[type="number"]',
    ]);
    await page.keyboard.press("Tab");
    await delay(3000);

    if (capturedRate) return buildQuote(from, to, amount, capturedRate, capturedFee, "currencyfair-browser");

    // DOM fallback
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const rateRe = new RegExp(`1\\s*${from}[^\\d]*([\\d,.]+)\\s*${to}`, "i");
    const m = bodyText.match(rateRe) ?? bodyText.match(/rate[:\s]*([\d,.]+)/i);
    if (m) {
      const r = parseNumber(m[1]);
      if (r > 0) { rateCache.set(`${from}:${to}`, r); return buildQuote(from, to, amount, r, 0, "currencyfair-dom"); }
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
  console.log("=== CurrencyFair Scraper ===\n");
  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0, failCount = 0;
  const startTime = Date.now();

  try {
    for (const c of CORRIDORS) {
      console.log(`\n${c.from} → ${c.to}`);

      let baseRate = rateCache.get(`${c.from}:${c.to}`) ?? 0;
      if (!baseRate) {
        const probe = await withRetry(() => tryPublicApi(c.from, c.to, SEND_AMOUNTS[1]), 2);
        if (probe) baseRate = probe.exchangeRate;
        else {
          const bProbe = await withRetry(() => tryBrowser(context, c.from, c.to, SEND_AMOUNTS[1]), 2);
          if (bProbe) baseRate = bProbe.exchangeRate;
        }
      }

      if (!baseRate) {
        failCount += SEND_AMOUNTS.length;
        console.log(`  ✗ No rate`);
        continue;
      }

      for (const amount of SEND_AMOUNTS) {
        const q = buildQuote(c.from, c.to, amount, baseRate, 0, "currencyfair-api");
        allQuotes.push(q);
        successCount++;
        console.log(`  ✓ $${amount} rate=${q.exchangeRate} recv=${q.receiveAmount}`);
      }

      await jitteredDelay(600);
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("CurrencyFair", "currencyfair", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("CurrencyFair scraper failed:", err); process.exit(1); });
