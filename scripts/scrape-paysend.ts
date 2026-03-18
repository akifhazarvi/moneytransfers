/**
 * Paysend Scraper
 *
 * Strategy:
 *  1. Direct public API — GET /api/v2/public/card-to-card/rates (no auth needed)
 *  2. Browser interception — load paysend.com calculator, capture API responses
 *  3. DOM fallback
 */
import {
  OUTPUT_DIR,
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
  extractDeliveryTime,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext } from "playwright";

const CORRIDORS = [
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "BDT" },
  { from: "USD", to: "GHS" }, { from: "USD", to: "KES" },
  { from: "USD", to: "EUR" }, { from: "USD", to: "GBP" },
  { from: "USD", to: "PLN" }, { from: "USD", to: "BRL" },
  { from: "USD", to: "TRY" }, { from: "USD", to: "COP" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "NGN" }, { from: "GBP", to: "PKR" },
  { from: "GBP", to: "PHP" }, { from: "GBP", to: "GHS" },
  { from: "GBP", to: "KES" }, { from: "GBP", to: "PLN" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "NGN" }, { from: "EUR", to: "PKR" },
  { from: "EUR", to: "PHP" }, { from: "EUR", to: "PLN" },
  { from: "EUR", to: "TRY" }, { from: "EUR", to: "BDT" },
  { from: "CAD", to: "INR" }, { from: "CAD", to: "PHP" },
  { from: "AUD", to: "INR" }, { from: "AUD", to: "PHP" },
  { from: "AED", to: "INR" }, { from: "AED", to: "PKR" },
];

// ---------------------------------------------------------------------------
// Strategy 1 — public API (no auth)
// ---------------------------------------------------------------------------
interface PaysendRate { rate?: number; fee?: number; feeAmount?: number; exchangeRate?: number; totalFee?: number }

async function tryPublicApi(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  const endpoints = [
    `https://paysend.com/api/v2/public/card-to-card/rates?sendingCurrency=${from}&receivingCurrency=${to}&sendingAmount=${amount}`,
    `https://paysend.com/api/v2/public/rates?from=${from}&to=${to}&amount=${amount}`,
    `https://paysend.com/api/v3/public/rates?sendingCurrency=${from}&receivingCurrency=${to}&amount=${amount}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Referer": "https://paysend.com/",
          "Origin": "https://paysend.com",
        },
      });
      if (!res.ok) continue;
      const data: PaysendRate = await res.json();
      const rate = data.rate ?? data.exchangeRate;
      const fee = data.fee ?? data.feeAmount ?? data.totalFee ?? 0;
      if (!rate || rate <= 0) continue;

      const effectiveSend = amount - fee;
      const receiveAmount = effectiveSend > 0 ? effectiveSend * rate : amount * rate;

      return {
        provider: "Paysend",
        providerSlug: "paysend",
        providerType: "moneyTransferProvider",
        sendCurrency: from,
        receiveCurrency: to,
        sendAmount: amount,
        fee: Math.round(fee * 100) / 100,
        exchangeRate: Math.round(rate * 10000) / 10000,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        paymentMethod: "Debit Card",
        deliveryMethod: "Bank Deposit",
        deliveryEstimate: extractDeliveryTime(data as Record<string, unknown>) ?? "1-2 days",
        dateCollected: new Date().toISOString(),
        source: "paysend-api",
      };
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
    if (!url.includes("paysend.com")) return;
    if (!url.includes("rate") && !url.includes("quote") && !url.includes("fee") && !url.includes("price") && !url.includes("calc")) return;
    if (response.status() !== 200) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      if (!body.includes("rate") && !body.includes("fee")) return;
      const data: PaysendRate = JSON.parse(body);
      const rate = data.rate ?? data.exchangeRate;
      const fee = data.fee ?? data.feeAmount ?? data.totalFee ?? 0;
      if (!rate || rate <= 0) return;
      const effectiveSend = amount - fee;
      captured = {
        provider: "Paysend",
        providerSlug: "paysend",
        providerType: "moneyTransferProvider",
        sendCurrency: from,
        receiveCurrency: to,
        sendAmount: amount,
        fee: Math.round(fee * 100) / 100,
        exchangeRate: Math.round(rate * 10000) / 10000,
        receiveAmount: Math.round((effectiveSend > 0 ? effectiveSend * rate : amount * rate) * 100) / 100,
        deliveryEstimate: null,
        deliveryMethod: null,
        dateCollected: new Date().toISOString(),
        source: "paysend-browser",
      };
    } catch { /* ignore */ }
  });

  try {
    await page.goto("https://paysend.com/en/", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(2000);
    await dismissOverlays(page);

    // Select currencies
    const fromSelectors = [
      `[data-testid*="from-currency"]`, `[data-cy*="sending"]`,
      `select[name*="from"]`, `select[name*="send"]`, `select[id*="from"]`,
    ];
    const toSelectors = [
      `[data-testid*="to-currency"]`, `[data-cy*="receiving"]`,
      `select[name*="to"]`, `select[name*="receive"]`, `select[id*="to"]`,
    ];

    for (const sel of fromSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1000 })) {
          await el.selectOption({ value: from });
          await delay(500);
          break;
        }
      } catch { continue; }
    }
    for (const sel of toSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1000 })) {
          await el.selectOption({ value: to });
          await delay(500);
          break;
        }
      } catch { continue; }
    }

    await fillAmountInput(page, amount, [
      'input[data-testid*="amount"]', 'input[name*="amount"]',
      'input[aria-label*="amount" i]', 'input[inputmode="decimal"]',
      'input[inputmode="numeric"]', 'input[type="number"]',
    ]);
    await page.keyboard.press("Tab");
    await delay(3500);

    if (captured) return captured;

    // DOM fallback
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const rateMatch = bodyText.match(new RegExp(`1\\s*${from}\\s*=\\s*([\\d,.]+)\\s*${to}`, "i"))
      ?? bodyText.match(/rate[:\s]*([\d,.]+)/i);
    const feeMatch = bodyText.match(/fee[:\s$]*([\d,.]+)/i);
    if (rateMatch) {
      const r = parseNumber(rateMatch[1]);
      const f = feeMatch ? parseNumber(feeMatch[1]) : 0;
      if (r > 0) {
        return {
          provider: "Paysend",
          providerSlug: "paysend",
          providerType: "moneyTransferProvider",
          sendCurrency: from, receiveCurrency: to, sendAmount: amount,
          fee: f, exchangeRate: Math.round(r * 10000) / 10000,
          receiveAmount: Math.round((amount - f) * r * 100) / 100,
          deliveryEstimate: null, deliveryMethod: null,
          dateCollected: new Date().toISOString(), source: "paysend-dom",
        };
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
  console.log("=== Paysend Scraper ===\n");
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

  writeOutput("Paysend", "paysend", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("Paysend scraper failed:", err); process.exit(1); });
