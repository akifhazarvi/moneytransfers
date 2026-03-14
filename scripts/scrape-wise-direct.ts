/**
 * Wise Direct Browser Automation Scraper
 *
 * Wise has a public calculator at https://wise.com/us/send-money/
 * When you change the amount or currency, it triggers their quote API.
 *
 * This scraper gets Wise's actual transfer quotes directly from their calculator,
 * as opposed to scrape-providers.ts which uses the Wise Comparison API (third-party view).
 * Direct quotes are Priority 1 (most accurate).
 *
 * Strategy: Navigate to calculator → select currencies → intercept quote API → fill amount.
 * Fallback: DOM scraping for displayed rate/fee/receive values.
 */
import {
  OUTPUT_DIR,
  NAV_TIMEOUT,
  MAX_RETRIES,
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
import type { BrowserContext, Page } from "playwright";

const CORRIDORS = [
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "BDT" },
  { from: "USD", to: "GHS" }, { from: "USD", to: "KES" },
  { from: "USD", to: "BRL" }, { from: "USD", to: "COP" },
  { from: "USD", to: "EUR" }, { from: "USD", to: "GBP" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "NGN" }, { from: "GBP", to: "PKR" },
  { from: "GBP", to: "PHP" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "NGN" }, { from: "EUR", to: "PHP" },
  { from: "CAD", to: "INR" }, { from: "CAD", to: "PHP" },
  { from: "AUD", to: "INR" }, { from: "AUD", to: "PHP" },
  { from: "AED", to: "INR" }, { from: "AED", to: "PKR" },
];

function parseWiseApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);

    // Wise API shapes:
    // 1. Quote API: { rate, sourceAmount, targetAmount, fee, formattedEstimatedDelivery }
    // 2. Pricing: { paymentOptions: [{ fee: { total }, sourceAmount, targetAmount, ... }] }
    // 3. Gateway: { rate, sourceCurrency, targetCurrency, ... }

    // Try direct quote shape
    const rate = parseFloat(
      String(data.rate || data.midMarketRate || data.guaranteedTargetAmount && (data.guaranteedTargetAmount / data.sourceAmount) || "0")
    );

    // Try paymentOptions array (pick cheapest)
    let bestFee = Infinity;
    let bestReceive = 0;
    let bestRate = rate;
    let delivery: string | null = null;

    if (data.paymentOptions && Array.isArray(data.paymentOptions)) {
      for (const opt of data.paymentOptions) {
        const optFee = parseFloat(String(opt.fee?.total || opt.fee || "0"));
        const optReceive = parseFloat(String(opt.targetAmount || opt.estimatedAmount || "0"));
        const optRate = parseFloat(String(opt.rate || "0")) || rate;

        if (optFee < bestFee && optReceive > 0) {
          bestFee = optFee;
          bestReceive = optReceive;
          bestRate = optRate;
          delivery = opt.formattedEstimatedDelivery || opt.estimatedDelivery || null;
        }
      }
    }

    const sendAmount = parseFloat(String(data.sourceAmount || data.sendAmount || "0")) || expectedAmount;
    const fee = bestFee < Infinity ? bestFee : parseFloat(String(data.fee?.total || data.fee || data.totalFee || "0"));
    const receiveAmount = bestReceive || parseFloat(String(data.targetAmount || data.guaranteedTargetAmount || data.receiveAmount || "0"));
    delivery = delivery || data.formattedEstimatedDelivery || data.estimatedDelivery || null;

    if (!receiveAmount && !bestRate) return null;

    const effectiveRate = bestRate || (receiveAmount > 0 ? receiveAmount / (sendAmount - fee) : 0);
    const effectiveReceive = receiveAmount || (sendAmount - fee) * bestRate;

    if (effectiveReceive <= 0) return null;

    return {
      provider: "Wise",
      providerSlug: "wise",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      deliveryEstimate: delivery,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "wise-direct-browser",
    };
  } catch {
    return null;
  }
}

async function scrapeDom(
  page: Page,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): Promise<ProviderQuote | null> {
  try {
    const bodyText = await page.locator("body").textContent({ timeout: 3000 });
    if (!bodyText) return null;

    // Wise shows "1 GBP = X.XXXX EUR" and fee info
    const rateMatch = bodyText.match(/1\s*[A-Z]{3}\s*=\s*([\d,.]+)\s*[A-Z]{3}/);
    const feeMatch = bodyText.match(/(?:Fee|Total fees|Our fee)[:\s]*([\d,.]+)/i);

    // Find receive amount
    const receivePattern = new RegExp(`([\\d,]+(?:\\.\\d{2,4})?)\\s*${receiveCurrency}`, "g");
    let receiveAmount = 0;
    let match;
    while ((match = receivePattern.exec(bodyText)) !== null) {
      const num = parseNumber(match[1]);
      if (num > receiveAmount) receiveAmount = num;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const fee = feeMatch ? parseNumber(feeMatch[1]) : 0;

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || receiveAmount / amount;
    const effectiveReceive = receiveAmount || amount * rate;

    return {
      provider: "Wise",
      providerSlug: "wise",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "wise-direct-browser-dom",
    };
  } catch {
    return null;
  }
}

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  let capturedQuote: ProviderQuote | null = null;

  try {
    // Intercept Wise's quote/pricing API calls
    page.on("response", async (response) => {
      const url = response.url();
      if (
        url.includes("wise.com") &&
        (url.includes("quote") || url.includes("pricing") || url.includes("rates") ||
         url.includes("calculator") || url.includes("transfer") ||
         url.includes("gateway") || url.includes("payment-options"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (
            body.includes("rate") || body.includes("targetAmount") ||
            body.includes("sourceAmount") || body.includes("fee")
          ) {
            const parsed = parseWiseApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to Wise's send-money calculator with pre-filled currencies
    const url = `https://wise.com/us/send-money/send-${corridor.from.toLowerCase()}-to-${corridor.to.toLowerCase()}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(3000);
    await dismissOverlays(page);

    // Fill the send amount
    const filled = await fillAmountInput(page, amount, [
      '#amount-input-source',
      'input[data-testid="amount-input"]',
      'input[data-testid*="source"]',
      'input[name*="source"]',
      'input[name*="send"]',
      'input[id*="source"]',
      'input[aria-label*="send"]',
      'input[aria-label*="Send"]',
      'input[aria-label*="You send"]',
      'input[inputmode="decimal"]',
      'input[inputmode="numeric"]',
      'input[type="tel"]',
      'input[type="number"]',
    ]);

    if (filled) {
      await page.keyboard.press("Tab");
    }

    // Wait for quote API response
    await delay(5000);

    if (capturedQuote) return capturedQuote;

    // If no API interception, try the direct API endpoint
    // Wise has a public endpoint: /gateway/v3/quotes/
    try {
      const apiUrl = `https://wise.com/gateway/v3/quotes/?sourceCurrency=${corridor.from}&targetCurrency=${corridor.to}&sourceAmount=${amount}&targetAmount=`;
      const apiResponse = await page.evaluate(async (fetchUrl) => {
        const res = await fetch(fetchUrl, { credentials: "omit" });
        return res.ok ? await res.text() : null;
      }, apiUrl);

      if (apiResponse) {
        const parsed = parseWiseApiResponse(apiResponse, corridor.from, corridor.to, amount);
        if (parsed && parsed.receiveAmount > 0) return parsed;
      }
    } catch {
      // Direct API call failed
    }

    return await scrapeDom(page, corridor.from, corridor.to, amount);
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== Wise Direct Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to}`);

      for (const amount of SEND_AMOUNTS) {
        console.log(`  Scraping: ${corridor.from} → ${corridor.to} ($${amount})...`);

        const quote = await withRetry(
          () => scrapeCorridorAmount(context, corridor, amount),
          MAX_RETRIES
        );

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(
            `    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount} [${quote.source}]`
          );
        } else {
          failCount++;
          console.log(`    ✗ No data after ${MAX_RETRIES} attempts`);
        }

        await jitteredDelay(3000);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("Wise", "wise-direct", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("Wise direct scraper failed:", err);
  process.exit(1);
});
