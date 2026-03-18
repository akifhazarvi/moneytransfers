/**
 * PayPal International Transfer Scraper
 *
 * PayPal's own peer-to-peer international transfers (distinct from Xoom).
 * PayPal charges a percentage fee above mid-market for personal sends.
 * Their calculator is at paypal.com/us/digital-wallet/send-receive-money.
 *
 * Strategy:
 *  1. Browser interception — load PayPal's send flow, capture API pricing calls
 *  2. Fee schedule parse — extract fees from the public fee page
 *  3. Synthesise quotes from known markup structure if no API data
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
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext } from "playwright";

// PayPal supports most major corridors
const CORRIDORS = [
  { from: "USD", to: "INR", sendCountry: "US", destCountry: "IN" },
  { from: "USD", to: "PHP", sendCountry: "US", destCountry: "PH" },
  { from: "USD", to: "MXN", sendCountry: "US", destCountry: "MX" },
  { from: "USD", to: "NGN", sendCountry: "US", destCountry: "NG" },
  { from: "USD", to: "PKR", sendCountry: "US", destCountry: "PK" },
  { from: "USD", to: "BDT", sendCountry: "US", destCountry: "BD" },
  { from: "USD", to: "BRL", sendCountry: "US", destCountry: "BR" },
  { from: "USD", to: "EUR", sendCountry: "US", destCountry: "DE" },
  { from: "USD", to: "GBP", sendCountry: "US", destCountry: "GB" },
  { from: "USD", to: "CAD", sendCountry: "US", destCountry: "CA" },
  { from: "USD", to: "AUD", sendCountry: "US", destCountry: "AU" },
  { from: "USD", to: "CNY", sendCountry: "US", destCountry: "CN" },
  { from: "GBP", to: "INR", sendCountry: "GB", destCountry: "IN" },
  { from: "GBP", to: "EUR", sendCountry: "GB", destCountry: "DE" },
  { from: "GBP", to: "USD", sendCountry: "GB", destCountry: "US" },
  { from: "GBP", to: "NGN", sendCountry: "GB", destCountry: "NG" },
  { from: "GBP", to: "PKR", sendCountry: "GB", destCountry: "PK" },
  { from: "EUR", to: "INR", sendCountry: "DE", destCountry: "IN" },
  { from: "EUR", to: "GBP", sendCountry: "DE", destCountry: "GB" },
  { from: "EUR", to: "USD", sendCountry: "DE", destCountry: "US" },
  { from: "EUR", to: "NGN", sendCountry: "DE", destCountry: "NG" },
  { from: "CAD", to: "INR", sendCountry: "CA", destCountry: "IN" },
  { from: "AUD", to: "INR", sendCountry: "AU", destCountry: "IN" },
];

function buildQuote(
  from: string, to: string, amount: number,
  rate: number, fee: number, delivery: string | null, source: string
): ProviderQuote {
  const effectiveSend = amount - fee;
  return {
    provider: "PayPal",
    providerSlug: "paypal",
    providerType: "moneyTransferProvider",
    sendCurrency: from, receiveCurrency: to, sendAmount: amount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: Math.round((effectiveSend > 0 ? effectiveSend : amount) * rate * 100) / 100,
    paymentMethod: null,
    deliveryEstimate: delivery ?? "1-3 business days",
    deliveryMethod: null,
    dateCollected: new Date().toISOString(), source,
  };
}

// ---------------------------------------------------------------------------
// Strategy 1 — browser, intercept PayPal API pricing calls
// ---------------------------------------------------------------------------
async function tryBrowserInterception(
  context: BrowserContext,
  from: string, to: string,
  sendCountry: string, destCountry: string,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let captured: ProviderQuote | null = null;

  page.on("response", async (response) => {
    const url = response.url();
    if (captured) return;
    if (!url.includes("paypal.com")) return;
    if (response.status() !== 200) return;
    if (
      !url.includes("rate") && !url.includes("fee") &&
      !url.includes("xo-") && !url.includes("checkout") &&
      !url.includes("transfer") && !url.includes("fx") &&
      !url.includes("price") && !url.includes("quote")
    ) return;
    try {
      const ct = response.headers()["content-type"] ?? "";
      if (!ct.includes("json")) return;
      const body = await response.text();
      if (!body.includes("rate") && !body.includes("fee") && !body.includes("exchange")) return;
      const data: Record<string, unknown> = JSON.parse(body);

      // PayPal nests data under various keys
      const root = (data.data ?? data.result ?? data.response ?? data) as Record<string, unknown>;
      const exchangeInfo = (root.exchangeRate ?? root.fxRate ?? root.rate) as Record<string, unknown> | number | null;
      let rate = 0;
      if (typeof exchangeInfo === "number") rate = exchangeInfo;
      else if (exchangeInfo && typeof exchangeInfo === "object") {
        rate = parseFloat(String((exchangeInfo as Record<string, unknown>).rate ?? (exchangeInfo as Record<string, unknown>).value ?? "0"));
      }

      const fee = parseFloat(String(
        (root.fee as Record<string, unknown>)?.value ??
        root.totalFee ?? root.feeAmount ?? root.transferFee ?? "0"
      ));

      if (rate <= 0) return;
      const delivery = String(root.estimatedDelivery ?? root.deliveryEstimate ?? "") || null;
      captured = buildQuote(from, to, amount, rate, fee, delivery, "paypal-browser");
    } catch { /* ignore */ }
  });

  try {
    // Try the international money transfer calculator page
    const urls = [
      `https://www.paypal.com/${sendCountry.toLowerCase()}/digital-wallet/send-receive-money/international-money-transfers`,
      `https://www.paypal.com/${sendCountry.toLowerCase()}/webapps/mpp/international-money-transfers`,
      `https://www.paypal.com/us/webapps/mpp/paypal-international`,
    ];

    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
        break;
      } catch { continue; }
    }

    await delay(3000);
    await dismissOverlays(page);

    // Attempt to fill calculator if visible
    const selectors = [
      'input[name*="amount"]', 'input[id*="amount"]',
      'input[aria-label*="amount" i]', 'input[aria-label*="send" i]',
      'input[data-testid*="amount"]', 'input[inputmode="decimal"]',
      'input[type="number"]', 'input[type="tel"]',
    ];
    const filled = await fillAmountInput(page, amount, selectors);

    // Try destination country selection
    if (filled) {
      try {
        const countryDropdown = page.locator('select[name*="country"], select[id*="country"], [data-testid*="country"]').first();
        if (await countryDropdown.isVisible({ timeout: 1500 })) {
          await countryDropdown.selectOption({ value: destCountry });
          await delay(500);
        }
      } catch { /* no dropdown */ }

      await page.keyboard.press("Tab");
      await delay(4000);
    } else {
      await delay(2000);
    }

    return captured;
  } catch {
    return null;
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Strategy 2 — page.evaluate() direct API call within PayPal session
// ---------------------------------------------------------------------------
async function tryApiInPage(
  context: BrowserContext,
  from: string, to: string,
  sendCountry: string, destCountry: string,
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  try {
    await page.goto("https://www.paypal.com/", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(1500);

    const endpoints = [
      `https://www.paypal.com/webapps/mpp/api/international-transfer?sendCurrency=${from}&receiveCurrency=${to}&sendCountry=${sendCountry}&receiveCountry=${destCountry}&amount=${amount}`,
      `https://www.paypal.com/cgi-bin/webscr?cmd=_international-transfer-rate&sender_currency=${from}&receiver_currency=${to}&amount=${amount}`,
      `https://www.paypal.com/v1/payments/transfer/rate?from=${from}&to=${to}&amount=${amount}&senderCountry=${sendCountry}&receiverCountry=${destCountry}`,
    ];

    for (const url of endpoints) {
      const text = await page.evaluate(async (fetchUrl: string) => {
        try {
          const res = await fetch(fetchUrl, {
            headers: { "Accept": "application/json" },
            credentials: "include",
          });
          if (res.ok) return await res.text();
          return null;
        } catch { return null; }
      }, url);

      if (text) {
        try {
          const data: Record<string, unknown> = JSON.parse(text);
          const rate = parseFloat(String(data.rate ?? data.exchangeRate ?? data.fxRate ?? "0"));
          const fee = parseFloat(String(data.fee ?? data.totalFee ?? "0"));
          if (rate > 0) return buildQuote(from, to, amount, rate, fee, null, "paypal-api");
        } catch { continue; }
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
  console.log("=== PayPal International Transfer Scraper ===\n");
  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0, failCount = 0;
  const startTime = Date.now();

  try {
    for (const c of CORRIDORS) {
      console.log(`\n${c.from} → ${c.to}`);
      for (const amount of SEND_AMOUNTS) {
        const quote = await withRetry(async () => {
          const api = await tryApiInPage(context, c.from, c.to, c.sendCountry, c.destCountry, amount);
          if (api) return api;
          return tryBrowserInterception(context, c.from, c.to, c.sendCountry, c.destCountry, amount);
        }, 2, `${c.from}→${c.to} $${amount}`);

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(`  ✓ $${amount} rate=${quote.exchangeRate} recv=${quote.receiveAmount} [${quote.source}]`);
        } else {
          failCount++;
          console.log(`  ✗ $${amount} failed`);
        }
        await jitteredDelay(1200);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("PayPal", "paypal", allQuotes, startTime, successCount, failCount);
}

main().catch(err => { console.error("PayPal scraper failed:", err); process.exit(1); });
