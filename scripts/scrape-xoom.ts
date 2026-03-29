/**
 * Xoom (PayPal) Browser Automation Scraper
 *
 * Xoom has a public guest API:
 * - Initial load: GET /wapi/guest-app/remittance
 * - Amount update: GET /wapi/guest-app/remittance/amount
 *
 * Country-specific pages: https://www.xoom.com/{country}/send-money
 * (generic /send-money requires login)
 *
 * Response: quote.pricing[] with fxRate, sendAmount, receiveAmount, feeAmount
 * for multiple payment types (ACH, debit, credit, PayPal balance).
 */
import * as fs from "fs";
import * as path from "path";
import { chromium, type BrowserContext } from "playwright";
import {
  OUTPUT_DIR,
  NAV_TIMEOUT,
  MAX_RETRIES,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  fillAmountInput,
  withRetry,
  blockHeavyResources,
  type ProviderQuote,
} from "./lib/browser";

const CORRIDORS = [
  { from: "USD", to: "INR", country: "india" },
  { from: "USD", to: "PHP", country: "philippines" },
  { from: "USD", to: "MXN", country: "mexico" },
  { from: "USD", to: "NGN", country: "nigeria" },
  { from: "USD", to: "PKR", country: "pakistan" },
  { from: "USD", to: "BDT", country: "bangladesh" },
  { from: "USD", to: "GHS", country: "ghana" },
  { from: "USD", to: "KES", country: "kenya" },
  { from: "USD", to: "BRL", country: "brazil" },
  { from: "USD", to: "COP", country: "colombia" },
  { from: "USD", to: "GTQ", country: "guatemala" },
  { from: "USD", to: "EUR", country: "germany" },
  { from: "USD", to: "VND", country: "vietnam" },
  { from: "USD", to: "ZAR", country: "south-africa" },
  { from: "USD", to: "IDR", country: "indonesia" },
  { from: "USD", to: "THB", country: "thailand" },
  // From GBP
  { from: "GBP", to: "INR", country: "india" },
  { from: "GBP", to: "PHP", country: "philippines" },
  { from: "GBP", to: "NGN", country: "nigeria" },
  { from: "GBP", to: "PKR", country: "pakistan" },
  { from: "GBP", to: "BDT", country: "bangladesh" },
  // From EUR
  { from: "EUR", to: "INR", country: "india" },
  { from: "EUR", to: "PHP", country: "philippines" },
  { from: "EUR", to: "NGN", country: "nigeria" },
  { from: "EUR", to: "PKR", country: "pakistan" },
  { from: "EUR", to: "BDT", country: "bangladesh" },
  { from: "EUR", to: "MXN", country: "mexico" },
  { from: "EUR", to: "BRL", country: "brazil" },
  // From AED
  { from: "AED", to: "INR", country: "india" },
  { from: "AED", to: "PKR", country: "pakistan" },
  { from: "AED", to: "PHP", country: "philippines" },
  { from: "AED", to: "BDT", country: "bangladesh" },
  // From SAR
  { from: "SAR", to: "INR", country: "india" },
  { from: "SAR", to: "PKR", country: "pakistan" },
  { from: "SAR", to: "PHP", country: "philippines" },
  { from: "SAR", to: "BDT", country: "bangladesh" },
];

const SEND_AMOUNTS = [100, 1000];

function parseXoomResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);
    const pricing = data?.quote?.pricing;
    if (!Array.isArray(pricing) || pricing.length === 0) return null;

    // Prefer ACH (bank) payment, then debit card
    const achPricing = pricing.find(
      (p: Record<string, unknown>) =>
        (p.paymentType as Record<string, string>)?.type === "ACH"
    );
    const debitPricing = pricing.find(
      (p: Record<string, unknown>) =>
        (p.paymentType as Record<string, string>)?.type === "DEBIT_CARD"
    );
    const best = achPricing || debitPricing || pricing[0];

    const rate = parseFloat(best.fxRate?.rate || "0");
    const sendAmount = parseFloat(best.sendAmount?.rawValue || "0") || expectedAmount;
    const receiveAmount = parseFloat(best.receiveAmount?.rawValue || "0");
    const fee = parseFloat(best.feeAmount?.rawValue || "0");
    const paymentType =
      (best.paymentType as Record<string, string>)?.type || null;

    if (!rate || !receiveAmount) return null;

    return {
      provider: "Xoom",
      providerSlug: "xoom",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: rate,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryEstimate: null,
      deliveryMethod: paymentType,
      dateCollected: new Date().toISOString(),
      source: "xoom-browser-api",
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
  await blockHeavyResources(page);
  let capturedQuote: ProviderQuote | null = null;

  try {
    // Intercept Xoom's guest API responses
    page.on("response", async (response) => {
      const url = response.url();
      if (
        url.includes("/wapi/guest-app/remittance") ||
        url.includes("/wapi/") && url.includes("remittance")
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (body.includes("pricing") && body.includes("fxRate")) {
            const parsed = parseXoomResponse(
              body,
              corridor.from,
              corridor.to,
              amount
            );
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to country-specific send page
    const url = `https://www.xoom.com/${corridor.country}/send-money`;
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(3000);
    await dismissOverlays(page);

    // Fill the send amount
    const filled = await fillAmountInput(page, amount, [
      "#text-input-send-input",
      'input[name="send-input"]',
      'input[inputmode="decimal"]',
      'input[type="tel"]',
      'input[type="number"]',
    ]);

    if (filled) {
      // Tab out to trigger recalculation
      await page.keyboard.press("Tab");
    }

    // Wait for API response
    await delay(4000);

    if (capturedQuote) return capturedQuote;

    // DOM fallback
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }).catch(() => "");
    const rateMatch = bodyText?.match(/1\s*USD\s*=\s*([\d,.]+)\s*[A-Z]{3}/);
    if (rateMatch) {
      const rate = parseFloat(rateMatch[1].replace(/,/g, ""));
      if (rate > 0) {
        return {
          provider: "Xoom",
          providerSlug: "xoom",
          providerType: "moneyTransferProvider",
          sendCurrency: corridor.from,
          receiveCurrency: corridor.to,
          sendAmount: amount,
          fee: 0,
          exchangeRate: rate,
          receiveAmount: Math.round(amount * rate * 100) / 100,
          paymentMethod: null,
          deliveryEstimate: null,
          deliveryMethod: null,
          dateCollected: new Date().toISOString(),
          source: "xoom-browser-dom",
        };
      }
    }

    return null;
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== Xoom (PayPal) Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.country})`);

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

    const outputPath = path.join(OUTPUT_DIR, "xoom-quotes.json");
    fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const total = successCount + failCount;
    console.log(`\n=== Xoom Scraping Complete ===`);
    console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
    console.log(`Success: ${successCount}, Failed: ${failCount}`);
    console.log(`Success rate: ${total > 0 ? ((successCount / total) * 100).toFixed(1) : 0}%`);
    console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
  }
}

main().catch((err) => {
  console.error("Xoom scraper failed:", err);
});
