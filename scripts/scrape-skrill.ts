/**
 * Skrill Scraper
 *
 * Strategy:
 *  1. Direct public rates API — skrill.com/api/... (no auth for FX rates)
 *  2. Browser interception — load skrill.com/en/send-money/ calculator,
 *     capture API responses from account.skrill.com
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
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "BDT" },
  { from: "USD", to: "EUR" }, { from: "USD", to: "GBP" },
  { from: "USD", to: "BRL" }, { from: "USD", to: "PLN" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "NGN" }, { from: "GBP", to: "PKR" },
  { from: "GBP", to: "PHP" }, { from: "GBP", to: "PLN" },
  { from: "GBP", to: "BDT" }, { from: "GBP", to: "GHS" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "NGN" }, { from: "EUR", to: "PKR" },
  { from: "EUR", to: "PHP" }, { from: "EUR", to: "PLN" },
  { from: "EUR", to: "BDT" }, { from: "EUR", to: "GHS" },
  { from: "CAD", to: "INR" }, { from: "CAD", to: "EUR" },
  { from: "AUD", to: "INR" }, { from: "AUD", to: "EUR" },
  { from: "AED", to: "INR" }, { from: "AED", to: "PKR" },
];

function buildSkrillQuote(
  from: string, to: string, amount: number,
  rate: number, fee: number, delivery: string | null, source: string,
  apiRecv = 0
): ProviderQuote {
  const effectiveSend = amount - fee;
  return {
    provider: "Skrill",
    providerSlug: "skrill",
    providerType: "moneyTransferProvider",
    sendCurrency: from, receiveCurrency: to, sendAmount: amount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: apiRecv > 0 ? Math.round(apiRecv * 100) / 100 : Math.round((effectiveSend > 0 ? effectiveSend : amount) * rate * 100) / 100,
    paymentMethod: null,
    deliveryEstimate: delivery, deliveryMethod: null,
    dateCollected: new Date().toISOString(), source,
  };
}

// ---------------------------------------------------------------------------
// Strategy 1 — public rates API
// ---------------------------------------------------------------------------
async function tryPublicApi(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  const endpoints = [
    `https://www.skrill.com/api/rate?from=${from}&to=${to}&amount=${amount}`,
    `https://www.skrill.com/api/v1/rates?sendCurrency=${from}&receiveCurrency=${to}&sendAmount=${amount}`,
    `https://account.skrill.com/api/exchange/rate?from=${from}&to=${to}&amount=${amount}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Referer": "https://www.skrill.com/en/send-money/",
        },
      });
      if (!res.ok) continue;
      const data: Record<string, unknown> = await res.json();
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.fx_rate ?? "0"));
      const fee = parseFloat(String(data.fee ?? data.totalFee ?? data.feeAmount ?? "0"));
      if (rate <= 0) continue;
      const apiRecv = extractReceiveAmount(data);
      return buildSkrillQuote(from, to, amount, rate, fee, data.deliveryTime as string ?? null, "skrill-api", apiRecv);
    } catch { continue; }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Strategy 2 — browser interception
// ---------------------------------------------------------------------------
async function tryBrowser(
  context: BrowserContext,
  from: string,
  to: string,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let captured: ProviderQuote | null = null;

  page.on("response", async (response) => {
    const url = response.url();
    if (captured) return;
    if (!url.includes("skrill.com")) return;
    if (response.status() !== 200) return;
    if (!url.includes("rate") && !url.includes("quote") && !url.includes("fee") && !url.includes("exchange") && !url.includes("price")) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      const data: Record<string, unknown> = JSON.parse(body);
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.fx_rate ?? "0"));
      const fee = parseFloat(String(data.fee ?? data.totalFee ?? data.feeAmount ?? "0"));
      if (rate <= 0) return;
      captured = buildSkrillQuote(from, to, amount, rate, fee, null, "skrill-browser");
    } catch { /* ignore */ }
  });

  try {
    await page.goto("https://www.skrill.com/en/send-money/", {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(2000);
    await dismissOverlays(page);

    // Select currencies
    const currencyInputs = [
      'select[name*="from"]', 'select[name*="send"]', '[data-testid*="from"]',
      'select[id*="from"]', 'select[id*="send"]',
    ];
    for (const sel of currencyInputs) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1000 })) {
          await el.selectOption({ value: from });
          await delay(400);
          break;
        }
      } catch { continue; }
    }

    const toCurrencyInputs = [
      'select[name*="to"]', 'select[name*="receive"]', '[data-testid*="to"]',
      'select[id*="to"]', 'select[id*="receive"]',
    ];
    for (const sel of toCurrencyInputs) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1000 })) {
          await el.selectOption({ value: to });
          await delay(400);
          break;
        }
      } catch { continue; }
    }

    await fillAmountInput(page, amount, [
      'input[name*="amount"]', 'input[data-testid*="amount"]',
      'input[aria-label*="amount" i]', 'input[inputmode="decimal"]',
      'input[type="number"]', 'input[type="text"][class*="amount"]',
    ]);
    await page.keyboard.press("Tab");
    await delay(3500);

    if (captured) return captured;

    // DOM fallback
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const rateRe = new RegExp(`1\\s*${from}\\s*=\\s*([\\d,.]+)\\s*${to}`, "i");
    const rateMatch = bodyText.match(rateRe) ?? bodyText.match(/(?:exchange rate|rate)[:\s]+([\d,.]+)/i);
    const feeMatch = bodyText.match(/(?:fee|transfer fee)[:\s$]*([\d,.]+)/i);
    if (rateMatch) {
      const r = parseNumber(rateMatch[1]);
      const f = feeMatch ? parseNumber(feeMatch[1]) : 0;
      if (r > 0) return buildSkrillQuote(from, to, amount, r, f, null, "skrill-dom");
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
  console.log("=== Skrill Scraper ===\n");
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

  writeOutput("Skrill", "skrill", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("Skrill scraper failed:", err); process.exit(1); });
