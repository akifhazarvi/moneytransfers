/**
 * ACE Money Transfer Scraper
 *
 * ACE specialises in UK/EU → South Asia + Middle East remittances.
 * Their calculator at acemoneytransfer.com makes API calls for live rates.
 *
 * Strategy:
 *  1. Direct API — try known ACE API endpoint patterns
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

// ACE's core corridors — GBP/EUR/AED → Pakistan/India/Bangladesh etc.
const CORRIDORS = [
  { from: "GBP", to: "PKR" }, { from: "GBP", to: "INR" },
  { from: "GBP", to: "BDT" }, { from: "GBP", to: "LKR" },
  { from: "GBP", to: "NPR" }, { from: "GBP", to: "NGN" },
  { from: "GBP", to: "GHS" }, { from: "GBP", to: "KES" },
  { from: "GBP", to: "PHP" }, { from: "GBP", to: "EUR" },
  { from: "EUR", to: "PKR" }, { from: "EUR", to: "INR" },
  { from: "EUR", to: "BDT" }, { from: "EUR", to: "NGN" },
  { from: "EUR", to: "GHS" }, { from: "EUR", to: "PHP" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "INR" },
  { from: "USD", to: "BDT" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PHP" }, { from: "USD", to: "GHS" },
  { from: "AED", to: "PKR" }, { from: "AED", to: "INR" },
  { from: "AED", to: "BDT" }, { from: "AED", to: "LKR" },
  { from: "SAR", to: "PKR" }, { from: "SAR", to: "INR" },
  { from: "SAR", to: "BDT" },
  { from: "CAD", to: "PKR" }, { from: "CAD", to: "INR" },
  { from: "AUD", to: "PKR" }, { from: "AUD", to: "INR" },
];

// Currency → ACE send country slug
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  GBP: "gb", EUR: "de", USD: "us", AED: "ae", SAR: "sa", CAD: "ca", AUD: "au",
};

// Receive currency → ACE destination slug
const RECEIVE_TO_COUNTRY: Record<string, string> = {
  PKR: "pakistan", INR: "india", BDT: "bangladesh", LKR: "srilanka",
  NPR: "nepal", NGN: "nigeria", GHS: "ghana", KES: "kenya",
  PHP: "philippines", EUR: "germany",
};

function buildQuote(
  from: string, to: string, amount: number,
  rate: number, fee: number, delivery: string | null, source: string,
  apiRecv = 0
): ProviderQuote {
  return {
    provider: "ACE Money Transfer",
    providerSlug: "ace-money-transfer",
    providerType: "moneyTransferProvider",
    sendCurrency: from, receiveCurrency: to, sendAmount: amount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: apiRecv > 0 ? Math.round(apiRecv * 100) / 100 : Math.round((amount - fee) * rate * 100) / 100,
    paymentMethod: null,
    deliveryEstimate: delivery ?? "Same day - 1 business day",
    deliveryMethod: null,
    dateCollected: new Date().toISOString(), source,
  };
}

// ---------------------------------------------------------------------------
// Strategy 1 — direct API
// ---------------------------------------------------------------------------
async function tryPublicApi(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  const country = CURRENCY_TO_COUNTRY[from] ?? "gb";
  const endpoints = [
    `https://www.acemoneytransfer.com/api/v1/rates?sendCurrency=${from}&receiveCurrency=${to}&sendAmount=${amount}`,
    `https://api.acemoneytransfer.com/rates?from=${from}&to=${to}&amount=${amount}`,
    `https://www.acemoneytransfer.com/${country}/api/exchange-rate?from=${from}&to=${to}&amount=${amount}`,
    `https://www.acemoneytransfer.com/api/calculator?sendCurrency=${from}&receiveCurrency=${to}&sendAmount=${amount}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Referer": "https://www.acemoneytransfer.com/",
          "Origin": "https://www.acemoneytransfer.com",
        },
      });
      if (!res.ok) continue;
      const data: Record<string, unknown> = await res.json();
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.fx_rate ?? data.transferRate ?? "0"));
      const fee = parseFloat(String(data.fee ?? data.transferFee ?? data.serviceFee ?? "0"));
      if (rate <= 0) continue;
      return buildQuote(from, to, amount, rate, fee, data.deliveryTime as string ?? null, "ace-api", extractReceiveAmount(data));
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
    if (!url.includes("acemoneytransfer.com")) return;
    if (response.status() !== 200) return;
    if (!url.includes("rate") && !url.includes("calc") && !url.includes("exchange") && !url.includes("quote") && !url.includes("fee")) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      const data: Record<string, unknown> = JSON.parse(body);
      const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.transferRate ?? data.fx_rate ?? "0"));
      const fee = parseFloat(String(data.fee ?? data.transferFee ?? data.serviceFee ?? "0"));
      if (rate <= 0) return;
      captured = buildQuote(from, to, amount, rate, fee, null, "ace-browser");
    } catch { /* ignore */ }
  });

  try {
    const country = CURRENCY_TO_COUNTRY[from] ?? "gb";
    const destSlug = RECEIVE_TO_COUNTRY[to];
    const url = destSlug
      ? `https://www.acemoneytransfer.com/${country}/send-money-to-${destSlug}`
      : `https://www.acemoneytransfer.com/${country}/`;

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(2500);
    await dismissOverlays(page);

    // Fill amount
    await fillAmountInput(page, amount, [
      'input[name*="amount"]', 'input[id*="amount"]', 'input[data-testid*="amount"]',
      'input[placeholder*="amount" i]', 'input[aria-label*="send" i]',
      'input[inputmode="decimal"]', 'input[inputmode="numeric"]', 'input[type="number"]',
    ]);
    await page.keyboard.press("Tab");
    await delay(3500);

    if (captured) return captured;

    // DOM fallback
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }) ?? "";
    const rateRe = new RegExp(`1\\s*${from}[^\\d]*([\\d,.]+)\\s*${to}`, "i");
    const rateMatch = bodyText.match(rateRe) ?? bodyText.match(/exchange rate[:\s]*([\d,.]+)/i);
    const feeMatch = bodyText.match(/(?:fee|service fee)[:\s£$]*([\d,.]+)/i);
    if (rateMatch) {
      const r = parseNumber(rateMatch[1]);
      const f = feeMatch ? parseNumber(feeMatch[1]) : 0;
      if (r > 0) return buildQuote(from, to, amount, r, f, null, "ace-dom");
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
  console.log("=== ACE Money Transfer Scraper ===\n");
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

  writeOutput("ACE Money Transfer", "ace-money-transfer", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("ACE Money Transfer scraper failed:", err); process.exit(1); });
