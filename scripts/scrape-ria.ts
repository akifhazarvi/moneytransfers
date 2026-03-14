/**
 * Ria Money Transfer Browser Automation Scraper
 *
 * Ria has a calculator at https://www.riamoneytransfer.com/en/us/
 * When you change the amount/corridor, it calls their pricing API.
 *
 * Strategy: Navigate to calculator → intercept API calls for pricing/quotes →
 * fill amount → capture response with rate, fee, receive amount.
 * Fallback: DOM scraping for displayed values.
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

// Ria URL pattern: /en/{sendCountryCode}/ then select destination
// Or direct: /en/us/online/transfer/{from}/{to}
const CORRIDORS = [
  { from: "USD", to: "INR", sendCountry: "us", recvCountry: "india", recvCode: "IN" },
  { from: "USD", to: "PHP", sendCountry: "us", recvCountry: "philippines", recvCode: "PH" },
  { from: "USD", to: "MXN", sendCountry: "us", recvCountry: "mexico", recvCode: "MX" },
  { from: "USD", to: "NGN", sendCountry: "us", recvCountry: "nigeria", recvCode: "NG" },
  { from: "USD", to: "PKR", sendCountry: "us", recvCountry: "pakistan", recvCode: "PK" },
  { from: "USD", to: "BDT", sendCountry: "us", recvCountry: "bangladesh", recvCode: "BD" },
  { from: "USD", to: "GHS", sendCountry: "us", recvCountry: "ghana", recvCode: "GH" },
  { from: "USD", to: "KES", sendCountry: "us", recvCountry: "kenya", recvCode: "KE" },
  { from: "USD", to: "BRL", sendCountry: "us", recvCountry: "brazil", recvCode: "BR" },
  { from: "USD", to: "COP", sendCountry: "us", recvCountry: "colombia", recvCode: "CO" },
  { from: "USD", to: "GTQ", sendCountry: "us", recvCountry: "guatemala", recvCode: "GT" },
  { from: "GBP", to: "INR", sendCountry: "gb", recvCountry: "india", recvCode: "IN" },
  { from: "GBP", to: "NGN", sendCountry: "gb", recvCountry: "nigeria", recvCode: "NG" },
  { from: "GBP", to: "PKR", sendCountry: "gb", recvCountry: "pakistan", recvCode: "PK" },
  { from: "GBP", to: "PHP", sendCountry: "gb", recvCountry: "philippines", recvCode: "PH" },
  { from: "EUR", to: "INR", sendCountry: "de", recvCountry: "india", recvCode: "IN" },
  { from: "EUR", to: "NGN", sendCountry: "de", recvCountry: "nigeria", recvCode: "NG" },
  { from: "EUR", to: "PHP", sendCountry: "de", recvCountry: "philippines", recvCode: "PH" },
  { from: "CAD", to: "INR", sendCountry: "ca", recvCountry: "india", recvCode: "IN" },
  { from: "CAD", to: "PHP", sendCountry: "ca", recvCountry: "philippines", recvCode: "PH" },
  { from: "AUD", to: "INR", sendCountry: "au", recvCountry: "india", recvCode: "IN" },
  { from: "AUD", to: "PHP", sendCountry: "au", recvCountry: "philippines", recvCode: "PH" },
];

function parseRiaApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);

    // Ria API can return different shapes. Common patterns:
    // 1. { exchangeRate, fee, sendAmount, receiveAmount }
    // 2. { rate, transferFee, amountToSend, amountToReceive }
    // 3. { quotes: [{ ... }] } or { results: [{ ... }] }
    // 4. Nested: { data: { exchangeRate, ... } }

    const root = data?.data || data?.quote || data?.result || data;
    const quotes = root?.quotes || root?.results || (Array.isArray(root) ? root : null);

    // If array of quotes, pick the bank deposit option
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

    // Single quote object
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
  const deliveryEstimate =
    (obj.deliveryEstimate as string) || (obj.deliveryTime as string) || (obj.eta as string) || null;

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
    deliveryEstimate,
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
    const bodyText = await page.locator("body").textContent({ timeout: 3000 });
    if (!bodyText) return null;

    // Look for rate pattern: "1 USD = XX.XX INR" or "Exchange Rate: XX.XX"
    const rateMatch =
      bodyText.match(/1\s*[A-Z]{3}\s*=\s*([\d,.]+)\s*[A-Z]{3}/) ||
      bodyText.match(/(?:Exchange\s*Rate|Rate)[:\s]*([\d,.]+)/i);
    const feeMatch = bodyText.match(/(?:Fee|Transfer fee|Service fee)[:\s$]*([\d,.]+)/i);

    // Find receive amount
    const receivePattern = new RegExp(
      `([\\d,]+(?:\\.\\d{2})?)\\s*${receiveCurrency}`,
      "g"
    );
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
         url.includes("rate") || url.includes("estimate") || url.includes("transfer"))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          // Only parse if body looks like it contains pricing data
          if (
            body.includes("exchangeRate") || body.includes("rate") ||
            body.includes("receiveAmount") || body.includes("fee")
          ) {
            const parsed = parseRiaApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to Ria's calculator page
    const url = `https://www.riamoneytransfer.com/en/${corridor.sendCountry}/`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(3000);
    await dismissOverlays(page);

    // Try to select destination country if there's a dropdown
    const countrySelectors = [
      `button:has-text("${corridor.recvCountry}")`,
      `[data-country="${corridor.recvCode}"]`,
      `select option[value="${corridor.recvCode}"]`,
    ];
    for (const sel of countrySelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1500 })) {
          await el.click();
          await delay(1500);
          break;
        }
      } catch {
        continue;
      }
    }

    // Try to find and click destination country in a search/dropdown
    const searchInputs = [
      'input[placeholder*="country"]',
      'input[placeholder*="Country"]',
      'input[placeholder*="destination"]',
      'input[placeholder*="Where"]',
      'input[aria-label*="country"]',
    ];
    for (const sel of searchInputs) {
      try {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 1500 })) {
          await input.fill(corridor.recvCountry);
          await delay(1000);
          // Click matching option
          await page
            .locator(`li:has-text("${corridor.recvCountry}"), [role="option"]:has-text("${corridor.recvCountry}")`)
            .first()
            .click({ timeout: 2000 });
          await delay(1500);
          break;
        }
      } catch {
        continue;
      }
    }

    // Fill the send amount
    const filled = await fillAmountInput(page, amount, [
      'input[data-testid*="send"]',
      'input[name*="send"]',
      'input[id*="send"]',
      'input[aria-label*="send"]',
      'input[aria-label*="Send"]',
      'input[aria-label*="You send"]',
      'input[placeholder*="send"]',
      'input[inputmode="decimal"]',
      'input[inputmode="numeric"]',
      'input[type="tel"]',
      'input[type="number"]',
    ]);

    if (filled) {
      await page.keyboard.press("Tab");
    }

    // Wait for API response
    await delay(5000);

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
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.recvCountry})`);

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

  writeOutput("Ria Money Transfer", "ria", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("Ria scraper failed:", err);
  process.exit(1);
});
