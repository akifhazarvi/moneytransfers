/**
 * Ria Money Transfer Browser Automation Scraper
 *
 * Ria has a rates-conversion page at:
 * https://www.riamoneytransfer.com/en-us/rates-conversion/?From=USD&To=INR&Amount=1000
 *
 * Strategy: Navigate directly to the rates page with query params →
 * intercept API responses with pricing data → fallback to DOM scraping.
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
  withRetry,
  writeOutput,
  parseNumber,
  type ProviderQuote,
} from "./lib/browser";
import type { BrowserContext, Page } from "playwright";

const CORRIDORS = [
  { from: "USD", to: "INR", locale: "en-us" },
  { from: "USD", to: "PHP", locale: "en-us" },
  { from: "USD", to: "MXN", locale: "en-us" },
  { from: "USD", to: "NGN", locale: "en-us" },
  { from: "USD", to: "PKR", locale: "en-us" },
  { from: "USD", to: "BDT", locale: "en-us" },
  { from: "USD", to: "GHS", locale: "en-us" },
  { from: "USD", to: "KES", locale: "en-us" },
  { from: "USD", to: "BRL", locale: "en-us" },
  { from: "USD", to: "COP", locale: "en-us" },
  { from: "USD", to: "GTQ", locale: "en-us" },
  { from: "GBP", to: "INR", locale: "en-gb" },
  { from: "GBP", to: "NGN", locale: "en-gb" },
  { from: "GBP", to: "PKR", locale: "en-gb" },
  { from: "GBP", to: "PHP", locale: "en-gb" },
  { from: "EUR", to: "INR", locale: "en-de" },
  { from: "EUR", to: "NGN", locale: "en-de" },
  { from: "EUR", to: "PHP", locale: "en-de" },
  { from: "CAD", to: "INR", locale: "en-ca" },
  { from: "CAD", to: "PHP", locale: "en-ca" },
  { from: "AUD", to: "INR", locale: "en-au" },
  { from: "AUD", to: "PHP", locale: "en-au" },
  { from: "AED", to: "INR", locale: "en-ae" },
  { from: "AED", to: "PKR", locale: "en-ae" },
  { from: "AED", to: "PHP", locale: "en-ae" },
  { from: "SGD", to: "INR", locale: "en-sg" },
  { from: "SGD", to: "PHP", locale: "en-sg" },
  { from: "SAR", to: "INR", locale: "en-sa" },
  { from: "SAR", to: "PKR", locale: "en-sa" },
  { from: "NZD", to: "INR", locale: "en-nz" },
  { from: "NZD", to: "PHP", locale: "en-nz" },
];

function parseApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);
    const root = data?.data || data?.quote || data?.result || data;
    const quotes = root?.quotes || root?.results || (Array.isArray(root) ? root : null);

    if (quotes && Array.isArray(quotes)) {
      const bankQuote = quotes.find(
        (q: Record<string, unknown>) =>
          (q.deliveryMethod as string)?.toLowerCase().includes("bank") ||
          (q.payoutMethod as string)?.toLowerCase().includes("bank") ||
          (q.serviceType as string)?.toLowerCase().includes("deposit")
      ) || quotes[0];

      if (bankQuote) {
        return extractQuote(bankQuote, sendCurrency, receiveCurrency, expectedAmount);
      }
    }

    return extractQuote(root, sendCurrency, receiveCurrency, expectedAmount);
  } catch {
    return null;
  }
}

function extractQuote(
  obj: Record<string, unknown>,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  const rate =
    parseFloat(String(obj.exchangeRate || obj.rate || obj.fx_rate || obj.fxRate || "0"));
  const fee =
    parseFloat(String(obj.fee || obj.transferFee || obj.totalFee || obj.fees || "0"));
  const sendAmount =
    parseFloat(String(obj.sendAmount || obj.amountToSend || obj.send_amount || "0")) || expectedAmount;
  const receiveAmount =
    parseFloat(String(obj.receiveAmount || obj.amountToReceive || obj.receive_amount || obj.recipientAmount || "0"));

  if (!receiveAmount && !rate) return null;

  const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / (sendAmount - fee) : 0);
  const effectiveReceive = receiveAmount || (sendAmount - fee) * rate;

  if (effectiveReceive <= 0) return null;

  return {
    provider: "Ria Money Transfer",
    providerSlug: "ria",
    providerType: "moneyTransferProvider",
    sendCurrency,
    receiveCurrency,
    sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(effectiveRate * 10000) / 10000,
    receiveAmount: Math.round(effectiveReceive * 100) / 100,
    deliveryEstimate: null,
    deliveryMethod: null,
    dateCollected: new Date().toISOString(),
    source: "ria-browser",
  };
}

async function scrapeDom(
  page: Page,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): Promise<ProviderQuote | null> {
  try {
    // Wait for the page to render rate data
    await delay(2000);

    const bodyText = await page.locator("body").textContent({ timeout: 5000 });
    if (!bodyText) return null;

    // Look for rate pattern: "1 USD = XX.XX INR" or "Exchange Rate: XX.XX"
    const rateMatch =
      bodyText.match(/1\s*[A-Z]{3}\s*=\s*([\d,.]+)\s*[A-Z]{3}/) ||
      bodyText.match(/(?:Exchange\s*Rate|Rate)[:\s]*([\d,.]+)/i);

    const feeMatch = bodyText.match(/(?:Fee|Transfer fee|Service fee)[:\s$]*([\d,.]+)/i);

    // Find receive amount - look for the converted amount
    const receivePattern = new RegExp(
      `([\\d,]+(?:\\.\\d{1,4})?)\\s*${receiveCurrency}`,
      "g"
    );
    let receiveAmount = 0;
    let match;
    while ((match = receivePattern.exec(bodyText)) !== null) {
      const num = parseNumber(match[1]);
      // Filter out tiny numbers (like "1 INR") and unreasonably large ones
      if (num > amount * 0.5 && num > receiveAmount) receiveAmount = num;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const fee = feeMatch ? parseNumber(feeMatch[1]) : 0;

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || receiveAmount / amount;
    const effectiveReceive = receiveAmount || amount * rate;

    return {
      provider: "Ria Money Transfer",
      providerSlug: "ria",
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
      source: "ria-browser-dom",
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
    // Intercept Ria's pricing/quote API calls
    page.on("response", async (response) => {
      const url = response.url();
      if (
        (url.includes("riamoneytransfer.com") || url.includes("riafinancial.com")) &&
        (url.includes("price") || url.includes("quote") || url.includes("calculator") ||
         url.includes("rate") || url.includes("estimate") || url.includes("transfer") ||
         url.includes("convert") || url.includes("compute"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (
            body.includes("exchangeRate") || body.includes("rate") ||
            body.includes("receiveAmount") || body.includes("fee") ||
            body.includes("receive_amount") || body.includes("exchange_rate")
          ) {
            const parsed = parseApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate directly to the rates conversion page with query params
    const url = `https://www.riamoneytransfer.com/${corridor.locale}/rates-conversion/?From=${corridor.from}&To=${corridor.to}&Amount=${amount}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(3000);
    await dismissOverlays(page);

    // Try to find and update the amount input to ensure it reflects our requested amount
    // (Ria's server ignores the URL Amount param, so the DOM may show a default value)
    const amountSelectors = [
      'input[name*="amount" i]',
      'input[id*="amount" i]',
      'input[placeholder*="amount" i]',
      'input[type="number"]',
      'input[type="tel"]',
      '#amount',
      '[data-testid*="amount"]',
    ];
    for (const sel of amountSelectors) {
      try {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 2000 })) {
          await input.click({ clickCount: 3 });
          await input.fill(String(amount));
          await page.keyboard.press("Tab");
          await delay(3000); // Wait for recalculation
          break;
        }
      } catch { continue; }
    }

    // Wait for dynamic content to load
    await delay(4000);

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
  console.log("=== Ria Money Transfer Browser Automation Scraper ===\n");
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

          await jitteredDelay(2000);
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
    writeOutput("Ria Money Transfer", "ria", allQuotes, startTime, successCount, failCount);
  }
}

main().catch((err) => {
  console.error("Ria scraper failed:", err);
});
