/**
 * Profee Scraper
 *
 * Profee is an EU/UK-focused fintech for card-to-card international transfers.
 * Strong corridors: EUR/GBP → Eastern Europe, Ukraine, CIS, South Asia.
 *
 * Strategy:
 *  1. Direct public API — profee.com API endpoints for rates
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
  // EUR sends — Profee's core market
  { from: "EUR", to: "UAH" }, { from: "EUR", to: "GEL" },
  { from: "EUR", to: "AMD" }, { from: "EUR", to: "AZN" },
  { from: "EUR", to: "KZT" }, { from: "EUR", to: "UZS" },
  { from: "EUR", to: "PLN" }, { from: "EUR", to: "CZK" },
  { from: "EUR", to: "RON" }, { from: "EUR", to: "HUF" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "PKR" },
  { from: "EUR", to: "NGN" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "USD" }, { from: "EUR", to: "TRY" },
  // GBP sends
  { from: "GBP", to: "UAH" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "USD" }, { from: "GBP", to: "INR" },
  { from: "GBP", to: "PKR" }, { from: "GBP", to: "NGN" },
  { from: "GBP", to: "PLN" }, { from: "GBP", to: "TRY" },
  // USD sends
  { from: "USD", to: "UAH" }, { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" }, { from: "USD", to: "INR" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PLN" }, { from: "USD", to: "TRY" },
];

function buildQuote(
  from: string, to: string, amount: number,
  rate: number, fee: number, source: string,
  apiRecv = 0
): ProviderQuote {
  return {
    provider: "Profee",
    providerSlug: "profee",
    providerType: "moneyTransferProvider",
    sendCurrency: from, receiveCurrency: to, sendAmount: amount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: apiRecv > 0 ? Math.round(apiRecv * 100) / 100 : Math.round((amount - fee) * rate * 100) / 100,
    paymentMethod: "Card",
    deliveryEstimate: "Instant - 1 hour",
    deliveryMethod: "Card",
    dateCollected: new Date().toISOString(), source,
  };
}

// ---------------------------------------------------------------------------
// Strategy 1 — public API
// ---------------------------------------------------------------------------
async function tryPublicApi(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  const endpoints = [
    `https://profee.com/api/v1/public/rates?from=${from}&to=${to}&amount=${amount}`,
    `https://profee.com/api/rates?sendCurrency=${from}&receiveCurrency=${to}&sendAmount=${amount}`,
    `https://api.profee.com/v1/rates?from=${from}&to=${to}&amount=${amount}`,
    `https://profee.com/api/v2/transfer/rate?from=${from}&to=${to}&amount=${amount}`,
    `https://profee.com/api/calculator?currency_from=${from}&currency_to=${to}&amount=${amount}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Referer": "https://profee.com/",
          "Origin": "https://profee.com",
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.trim().startsWith("{")) continue;
      const data: Record<string, unknown> = JSON.parse(text);
      const root = (data.data ?? data.result ?? data) as Record<string, unknown>;
      const rate = parseFloat(String(root.rate ?? root.exchangeRate ?? root.fx_rate ?? root.conversionRate ?? "0"));
      const fee = parseFloat(String(root.fee ?? root.totalFee ?? root.serviceFee ?? "0"));
      if (rate <= 0) continue;
      return buildQuote(from, to, amount, rate, fee, "profee-api", extractReceiveAmount(root));
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
  let captured: ProviderQuote | null = null;

  page.on("response", async (response) => {
    const url = response.url();
    if (captured) return;
    if (!url.includes("profee.com")) return;
    if (response.status() !== 200) return;
    if (!url.includes("rate") && !url.includes("calc") && !url.includes("fee") && !url.includes("transfer") && !url.includes("price") && !url.includes("quote")) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      const data: Record<string, unknown> = JSON.parse(body);
      const root = (data.data ?? data.result ?? data) as Record<string, unknown>;
      const rate = parseFloat(String(root.rate ?? root.exchangeRate ?? root.fx_rate ?? root.conversionRate ?? "0"));
      const fee = parseFloat(String(root.fee ?? root.totalFee ?? root.serviceFee ?? "0"));
      if (rate <= 0) return;
      captured = buildQuote(from, to, amount, rate, fee, "profee-browser");
    } catch { /* ignore */ }
  });

  try {
    await page.goto("https://profee.com/", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(2500);
    await dismissOverlays(page);

    // Select send currency
    for (const sel of ['select[name*="from"]', 'select[id*="from"]', '[data-testid*="from-currency"]', '[data-testid*="send-currency"]']) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 800 })) { await el.selectOption({ value: from }); await delay(400); break; }
      } catch { continue; }
    }

    // Select receive currency
    for (const sel of ['select[name*="to"]', 'select[id*="to"]', '[data-testid*="to-currency"]', '[data-testid*="receive-currency"]']) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 800 })) { await el.selectOption({ value: to }); await delay(400); break; }
      } catch { continue; }
    }

    await fillAmountInput(page, amount, [
      'input[name*="amount"]', 'input[id*="amount"]',
      'input[data-testid*="amount"]', 'input[aria-label*="amount" i]',
      'input[inputmode="decimal"]', 'input[inputmode="numeric"]',
      'input[type="number"]',
    ]);
    await page.keyboard.press("Tab");
    await delay(3500);

    if (captured) return captured;

    // DOM fallback
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const rateRe = new RegExp(`1\\s*${from}[^\\d]*([\\d,.]+)\\s*${to}`, "i");
    const rateMatch = bodyText.match(rateRe) ?? bodyText.match(/(?:exchange rate|rate)[:\s]*([\d,.]+)/i);
    const feeMatch = bodyText.match(/(?:fee|commission)[:\s€$£]*([\d,.]+)/i);
    const receiveRe = new RegExp(`([\\d,]+(?:\\.\\d{1,4})?)\\s*${to}`, "g");
    let receiveAmount = 0, m;
    while ((m = receiveRe.exec(bodyText)) !== null) {
      const n = parseNumber(m[1]);
      if (n > amount * 0.1 && n > receiveAmount) receiveAmount = n;
    }

    if (rateMatch) {
      const r = parseNumber(rateMatch[1]);
      const f = feeMatch ? parseNumber(feeMatch[1]) : 0;
      if (r > 0) return buildQuote(from, to, amount, r, f, "profee-dom");
    }
    if (receiveAmount > 0) {
      return buildQuote(from, to, amount, Math.round((receiveAmount / amount) * 10000) / 10000, 0, "profee-dom");
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
  console.log("=== Profee Scraper ===\n");
  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0, failCount = 0;
  const startTime = Date.now();

  try {
    for (const c of CORRIDORS) {
      console.log(`\n${c.from} → ${c.to}`);
      for (const amount of SEND_AMOUNTS) {
        const quote = await withRetry(async () => {
          const api = await tryPublicApi(c.from, c.to, amount);
          if (api) return api;
          return tryBrowser(context, c.from, c.to, amount);
        }, 2, `${c.from}→${c.to} $${amount}`);

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(`  ✓ $${amount} rate=${quote.exchangeRate} recv=${quote.receiveAmount} [${quote.source}]`);
        } else {
          failCount++;
          console.log(`  ✗ $${amount} failed`);
        }
        await jitteredDelay(800);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("Profee", "profee", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("Profee scraper failed:", err); process.exit(1); });
