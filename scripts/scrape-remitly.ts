/**
 * Remitly Browser Automation Scraper
 *
 * Remitly's calculator triggers API calls to api.remitly.io with
 * /v3/calculator/estimate responses containing rates, fees, and delivery info.
 *
 * Strategy: Navigate to corridor page → intercept calculator API → fill amount → capture response.
 * Fallback: DOM scraping for rate/receive amount patterns.
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
  { from: "USD", to: "INR", urlPath: "us/en/india" },
  { from: "USD", to: "PHP", urlPath: "us/en/philippines" },
  { from: "USD", to: "IDR", urlPath: "us/en/indonesia" },
  { from: "USD", to: "THB", urlPath: "us/en/thailand" },
  { from: "USD", to: "NPR", urlPath: "us/en/nepal" },
  { from: "USD", to: "LKR", urlPath: "us/en/sri-lanka" },
  { from: "USD", to: "EGP", urlPath: "us/en/egypt" },
  { from: "USD", to: "MAD", urlPath: "us/en/morocco" },
  { from: "USD", to: "MYR", urlPath: "us/en/malaysia" },
  { from: "USD", to: "TRY", urlPath: "us/en/turkey" },
  { from: "USD", to: "PEN", urlPath: "us/en/peru" },
  { from: "USD", to: "JMD", urlPath: "us/en/jamaica" },
  { from: "USD", to: "DOP", urlPath: "us/en/dominican-republic" },
  { from: "USD", to: "MXN", urlPath: "us/en/mexico" },
  { from: "USD", to: "NGN", urlPath: "us/en/nigeria" },
  { from: "USD", to: "PKR", urlPath: "us/en/pakistan" },
  { from: "USD", to: "BDT", urlPath: "us/en/bangladesh" },
  { from: "USD", to: "GHS", urlPath: "us/en/ghana" },
  { from: "USD", to: "KES", urlPath: "us/en/kenya" },
  { from: "USD", to: "BRL", urlPath: "us/en/brazil" },
  { from: "USD", to: "COP", urlPath: "us/en/colombia" },
  { from: "GBP", to: "INR", urlPath: "gb/en/india" },
  { from: "GBP", to: "NGN", urlPath: "gb/en/nigeria" },
  { from: "GBP", to: "PKR", urlPath: "gb/en/pakistan" },
  { from: "GBP", to: "PHP", urlPath: "gb/en/philippines" },
  { from: "EUR", to: "INR", urlPath: "de/en/india" },
  { from: "EUR", to: "NGN", urlPath: "de/en/nigeria" },
  { from: "EUR", to: "PHP", urlPath: "de/en/philippines" },
  { from: "CAD", to: "INR", urlPath: "ca/en/india" },
  { from: "CAD", to: "PHP", urlPath: "ca/en/philippines" },
  { from: "AUD", to: "INR", urlPath: "au/en/india" },
  { from: "AUD", to: "PHP", urlPath: "au/en/philippines" },
  { from: "AED", to: "INR", urlPath: "ae/en/india" },
  { from: "AED", to: "PKR", urlPath: "ae/en/pakistan" },
  { from: "AED", to: "PHP", urlPath: "ae/en/philippines" },
  { from: "SGD", to: "INR", urlPath: "sg/en/india" },
  { from: "SGD", to: "PHP", urlPath: "sg/en/philippines" },
  { from: "NZD", to: "INR", urlPath: "nz/en/india" },
  { from: "NZD", to: "PHP", urlPath: "nz/en/philippines" },
];

function parseApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const json = JSON.parse(body);

    // Handle both /v3/calculator/estimate and newer API shapes
    const est = json?.estimate || json;
    if (!est) return null;

    const sendAmount = parseFloat(est.send_amount) || expectedAmount;
    const receiveAmount = parseFloat(est.receive_amount) || 0;
    const fee = parseFloat(est.fee?.total_fee_amount) || 0;
    const baseRate = parseFloat(est.exchange_rate?.base_rate) || 0;
    const promoRate =
      parseFloat(est.exchange_rate?.promotional_exchange_rate) || 0;
    const discount = parseFloat(est.discount?.fee_discount_amount || "0");

    const exchangeRate =
      promoRate || baseRate || (receiveAmount > 0 ? receiveAmount / sendAmount : 0);

    if (!receiveAmount || receiveAmount <= 0) return null;

    // Extract delivery estimate
    let deliveryEstimate: string | null = null;
    if (est.delivery_date_estimate) {
      deliveryEstimate = est.delivery_date_estimate;
    } else if (est.delivery_option?.description) {
      deliveryEstimate = est.delivery_option.description;
    }

    return {
      provider: "Remitly",
      providerSlug: "remitly",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round((fee - discount) * 100) / 100,
      exchangeRate: Math.round(exchangeRate * 10000) / 10000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryEstimate,
      deliveryMethod: est.pay_out_method || null,
      dateCollected: new Date().toISOString(),
      source: "remitly-browser",
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

    // Look for corridor-specific exchange rate: "1 USD = XX.XX INR"
    const rateRegex = new RegExp(
      `1\\s*${sendCurrency}\\s*=\\s*([\\d,.]+)\\s*${receiveCurrency}`
    );
    const rateMatch = bodyText.match(rateRegex);
    const feeMatch = bodyText.match(
      new RegExp(`(?:Fee|fee|Transfer fee)[^\\d]*([\\d,.]+)\\s*${sendCurrency}`, "i")
    );

    // Find receive amount — large number near currency code
    // Filter: must be proportional to send amount (> 50% of expected)
    const receivePattern = new RegExp(
      `([\\d,]+(?:\\.\\d{2})?)\\s*${receiveCurrency}`,
      "g"
    );
    let receiveAmount = 0;
    let match;
    while ((match = receivePattern.exec(bodyText)) !== null) {
      const num = parseNumber(match[1]);
      if (num > amount * 0.5 && num > receiveAmount) receiveAmount = num;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const fee = feeMatch ? parseNumber(feeMatch[1]) : 0;

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || receiveAmount / amount;
    const effectiveReceive = receiveAmount || amount * rate;

    return {
      provider: "Remitly",
      providerSlug: "remitly",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(effectiveRate * 10000) / 10000,
      receiveAmount: Math.round(effectiveReceive * 100) / 100,
      paymentMethod: null,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "remitly-browser-dom",
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
    // Intercept Remitly's calculator API — match both old and new endpoints
    page.on("response", async (response) => {
      const url = response.url();
      if (
        (url.includes("api.remitly.io") || url.includes("remitly.com/api")) &&
        (url.includes("calculator") || url.includes("estimate") || url.includes("pricing"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          const parsed = parseApiResponse(body, corridor.from, corridor.to, amount);
          if (parsed && parsed.receiveAmount > 0) {
            // Prefer exact match for requested amount
            if (Math.abs(parsed.sendAmount - amount) < 1 || !capturedQuote) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Response not readable
        }
      }
    });

    // Navigate to corridor page
    const url = `https://www.remitly.com/${corridor.urlPath}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(3000);
    await dismissOverlays(page);

    // Fill send amount
    const filled = await fillAmountInput(page, amount, [
      'input[data-testid="send-amount"]',
      'input[data-testid="calculator-input"]',
      'input[id*="send"]',
      'input[name="sendAmount"]',
      'input[name="amount"]',
      'input[id*="amount"]',
      'input[aria-label*="send"]',
      'input[aria-label*="Send"]',
      'input[aria-label*="You send"]',
      'input[inputmode="decimal"]',
      'input[inputmode="numeric"]',
      'input[type="tel"]',
    ]);

    if (!filled) {
      console.log(`    ⚠ Could not find amount input`);
    }

    // Wait for calculator API response
    await delay(5000);

    if (capturedQuote && Math.abs((capturedQuote as ProviderQuote).sendAmount - amount) < 1) {
      return capturedQuote;
    }
    if (capturedQuote) return capturedQuote;

    // Fallback: DOM scraping
    return await scrapeDom(page, corridor.from, corridor.to, amount);
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== Remitly Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.urlPath})`);

      for (const amount of SEND_AMOUNTS) {
        try {
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
        } catch (err) {
          failCount++;
          console.error(
            `    ✗ Error scraping ${corridor.from} → ${corridor.to} ($${amount}):`,
            (err as Error).message || err
          );
        }
      }
    }
  } finally {
    await context.browser()?.close();
    writeOutput("Remitly", "remitly", allQuotes, startTime, successCount, failCount);
  }
}

main().catch((err) => {
  console.error("Remitly scraper failed:", err);
});
