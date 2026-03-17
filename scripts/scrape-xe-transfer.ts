/**
 * XE Money Transfer Browser Automation Scraper
 *
 * XE has a send-money calculator at https://www.xe.com/send-money/
 * The calculator triggers API calls with pricing data when you change amounts.
 *
 * Note: This is separate from scrape-xe.ts which fetches mid-market rates.
 * This scraper gets XE's actual transfer quotes (fees, exchange rates, receive amounts).
 *
 * Strategy: Navigate to send-money page → intercept pricing API → fill amount → capture.
 * Fallback: DOM scraping for displayed calculator values.
 */
import fs from "fs";
import path from "path";
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
  { from: "USD", to: "INR", destCountry: "India" },
  { from: "USD", to: "PHP", destCountry: "Philippines" },
  { from: "USD", to: "MXN", destCountry: "Mexico" },
  { from: "USD", to: "NGN", destCountry: "Nigeria" },
  { from: "USD", to: "PKR", destCountry: "Pakistan" },
  { from: "USD", to: "GBP", destCountry: "United Kingdom" },
  { from: "USD", to: "EUR", destCountry: "Germany" },
  { from: "USD", to: "BRL", destCountry: "Brazil" },
  { from: "USD", to: "COP", destCountry: "Colombia" },
  { from: "GBP", to: "INR", destCountry: "India" },
  { from: "GBP", to: "EUR", destCountry: "Germany" },
  { from: "GBP", to: "NGN", destCountry: "Nigeria" },
  { from: "GBP", to: "PKR", destCountry: "Pakistan" },
  { from: "EUR", to: "INR", destCountry: "India" },
  { from: "EUR", to: "GBP", destCountry: "United Kingdom" },
  { from: "EUR", to: "NGN", destCountry: "Nigeria" },
  { from: "CAD", to: "INR", destCountry: "India" },
  { from: "CAD", to: "PHP", destCountry: "Philippines" },
  { from: "AUD", to: "INR", destCountry: "India" },
  { from: "AUD", to: "PHP", destCountry: "Philippines" },
  { from: "AED", to: "INR", destCountry: "India" },
  { from: "AED", to: "PKR", destCountry: "Pakistan" },
  { from: "SGD", to: "INR", destCountry: "India" },
  { from: "SGD", to: "PHP", destCountry: "Philippines" },
  { from: "SAR", to: "INR", destCountry: "India" },
  { from: "SAR", to: "PKR", destCountry: "Pakistan" },
  { from: "NZD", to: "INR", destCountry: "India" },
  { from: "NZD", to: "PHP", destCountry: "Philippines" },
  { from: "CHF", to: "INR", destCountry: "India" },
  { from: "CHF", to: "EUR", destCountry: "Germany" },
];

function parseXeApiResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);

    // XE API shapes vary — try common patterns
    const root = data?.data || data?.result || data?.quote || data;

    const rate = parseFloat(
      String(root.rate || root.exchangeRate || root.fx_rate || root.customerRate || "0")
    );
    const fee = parseFloat(
      String(root.fee || root.transferFee || root.totalFee || root.fees?.total || "0")
    );
    const sendAmount = parseFloat(
      String(root.sendAmount || root.sourceAmount || root.send_amount || "0")
    ) || expectedAmount;
    const receiveAmount = parseFloat(
      String(root.receiveAmount || root.destinationAmount || root.receive_amount || root.convertedAmount || "0")
    );
    const deliveryEstimate =
      (root.deliveryEstimate as string) || (root.deliveryTime as string) || (root.eta as string) || null;

    if (!receiveAmount && !rate) return null;

    const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / (sendAmount - fee) : 0);
    const effectiveReceive = receiveAmount || (sendAmount - fee) * rate;

    if (effectiveReceive <= 0) return null;

    return {
      provider: "XE",
      providerSlug: "xe",
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
      source: "xe-transfer-browser",
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
    // Try data-testid locators for receive/rate/amount elements first
    const testIdSelectors = [
      '[data-testid*="receive"]',
      '[data-testid*="amount"]',
      '[data-testid*="rate"]',
    ];
    for (const sel of testIdSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1500 })) {
          const text = await el.textContent({ timeout: 1500 });
          if (text) {
            const numMatch = text.match(/([\d,]+(?:\.\d{1,4})?)/);
            if (numMatch) {
              const num = parseNumber(numMatch[1]);
              if (num > amount * 0.01) {
                // Plausible receive amount found via data-testid
                break;
              }
            }
          }
        }
      } catch {
        // continue
      }
    }

    const bodyText = await page.locator("body").textContent({ timeout: 3000 });
    if (!bodyText) return null;

    const feeMatch = bodyText.match(/(?:Fee|Transfer fee|No fee)[:\s$]*([\d,.]+)/i);

    // Match rate for the specific corridor: "1 USD = XX.XX INR"
    const corridorRateRegex = new RegExp(
      `1\\s*${sendCurrency}\\s*=\\s*([\\d,.]+)\\s*${receiveCurrency}`
    );
    const rateMatch = bodyText.match(corridorRateRegex) ||
      bodyText.match(new RegExp(`(?:Exchange\\s*Rate|Rate)[:\\s]*(\\d[\\d,.]+)\\s*${receiveCurrency}`, "i"));

    // Find receive amount with the target currency
    const receivePattern = new RegExp(`([\\d,]+(?:\\.\\d{1,4})?)\\s*${receiveCurrency}`, "g");
    let receiveAmount = 0;
    let match;
    while ((match = receivePattern.exec(bodyText)) !== null) {
      const num = parseNumber(match[1]);
      // Filter out tiny values (like "1 INR") — receive should be proportional to send
      if (num > amount * 0.01 && num > receiveAmount) receiveAmount = num;
    }

    const rate = rateMatch ? parseNumber(rateMatch[1]) : 0;
    const fee = feeMatch ? parseNumber(feeMatch[1]) : 0;

    if (!rate && !receiveAmount) return null;

    const effectiveRate = rate || (receiveAmount > 0 ? receiveAmount / amount : 0);
    const effectiveReceive = receiveAmount || (rate > 0 ? amount * rate : 0);

    return {
      provider: "XE",
      providerSlug: "xe",
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
      source: "xe-transfer-browser-dom",
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
    // Intercept XE's transfer/pricing API calls
    page.on("response", async (response) => {
      const url = response.url();
      if (
        url.includes("xe.com") && (
          url.includes("/api/") || url.includes("transfer") || url.includes("quote") ||
          url.includes("pricing") || url.includes("calculator") || url.includes("rate") ||
          url.includes("send-money") || url.includes("conversion") || url.includes("convert")
        )
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (
            body.includes("rate") || body.includes("exchangeRate") ||
            body.includes("receiveAmount") || body.includes("fee")
          ) {
            const parsed = parseXeApiResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate directly to XE's results page with pre-filled corridor and amount
    const directUrl = `https://www.xe.com/send-money/results/?amount=${amount}&fromCurrency=${corridor.from}&toCurrency=${corridor.to}`;
    await page.goto(directUrl, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(4000);
    await dismissOverlays(page);
    // Wait a bit more for SPA to load
    await delay(3000);

    if (capturedQuote) return capturedQuote;

    // Fallback: navigate to base send-money page and interact with selectors
    if (!capturedQuote) {
      await page.goto("https://www.xe.com/send-money/", {
        waitUntil: "domcontentloaded",
        timeout: NAV_TIMEOUT,
      });
      await delay(3000);
      await dismissOverlays(page);
    }

    // Select source currency (fallback interaction)
    const fromSelectors = [
      `button:has-text("${corridor.from}")`,
      `[data-testid="source-currency"]`,
      `select[name*="source"] option[value="${corridor.from}"]`,
      `[aria-label*="send"] button`,
      `[aria-label*="From"]`,
    ];
    for (const sel of fromSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1500 })) {
          await el.click();
          await delay(500);
          // If this opened a search, type the currency
          const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
          if (await searchInput.isVisible({ timeout: 1000 })) {
            await searchInput.fill(corridor.from);
            await delay(500);
            await page.locator(`[role="option"]:has-text("${corridor.from}"), li:has-text("${corridor.from}")`).first().click({ timeout: 2000 });
          }
          await delay(1000);
          break;
        }
      } catch {
        continue;
      }
    }

    // Select destination currency
    const toSelectors = [
      `[data-testid="destination-currency"]`,
      `[aria-label*="receive"] button`,
      `[aria-label*="To"]`,
    ];
    for (const sel of toSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1500 })) {
          await el.click();
          await delay(500);
          const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
          if (await searchInput.isVisible({ timeout: 1000 })) {
            await searchInput.fill(corridor.to);
            await delay(500);
            await page.locator(`[role="option"]:has-text("${corridor.to}"), li:has-text("${corridor.to}")`).first().click({ timeout: 2000 });
          }
          await delay(1000);
          break;
        }
      } catch {
        continue;
      }
    }

    // Fill amount
    const filled = await fillAmountInput(page, amount, [
      'input[data-testid*="amount"]',
      'input[name*="amount"]',
      'input[name*="send"]',
      'input[aria-label*="send"]',
      'input[aria-label*="Send"]',
      'input[aria-label*="You send"]',
      'input[aria-label*="amount"]',
      'input[inputmode="decimal"]',
      'input[inputmode="numeric"]',
      'input[type="tel"]',
      'input[type="number"]',
    ]);

    if (filled) {
      await page.keyboard.press("Tab");
    }

    await delay(5000);

    if (capturedQuote) return capturedQuote;
    return await scrapeDom(page, corridor.from, corridor.to, amount);
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== XE Money Transfer Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.destCountry})`);

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
          console.error(`    ✗ Error scraping ${corridor.from} → ${corridor.to} ($${amount}):`, (err as Error).message);
        }
      }
    }
  } finally {
    await context.browser()?.close();
    // If 0% success, write an empty file and exit cleanly (don't block the workflow)
    if (successCount === 0 && failCount > 0) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      const outputPath = path.join(OUTPUT_DIR, "xe-transfer-quotes.json");
      fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`\n=== XE Money Transfer Scraping Complete ===`);
      console.log(`Wrote ${outputPath} (0 quotes)`);
      console.log(`Success: 0, Failed: ${failCount} — exiting cleanly (0% success, site may have changed)`);
      console.log(`Time: ${elapsed}s`);
    } else {
      writeOutput("XE Money Transfer", "xe-transfer", allQuotes, startTime, successCount, failCount);
    }
  }
}

main().catch((err) => {
  console.error("XE Transfer scraper failed:", err);
});
