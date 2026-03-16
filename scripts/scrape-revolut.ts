/**
 * Revolut Exchange Rate Scraper
 *
 * Revolut's public quote API:
 * GET /api/exchange/quote?amount={CENTS}&country=GB&fromCurrency={FROM}&isRecipientAmount=false&toCurrency={TO}
 *
 * Important: amounts are in MINOR UNITS (cents/paise). $500 = 50000.
 * Response amounts are also in minor units.
 *
 * Uses Playwright because the API requires browser cookies/context.
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
  type ProviderQuote,
} from "./lib/browser";

const COUNTRY_MAP: Record<string, string> = {
  USD: "US", GBP: "GB", EUR: "DE", CAD: "CA", AUD: "AU",
  AED: "AE", SGD: "SG", NZD: "NZ",
  SAR: "SA", CHF: "CH", HKD: "HK",
};

const CORRIDORS = [
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" }, { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "BRL" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "USD" }, { from: "GBP", to: "NGN" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "USD" },
  { from: "CAD", to: "INR" }, { from: "AUD", to: "INR" },
  { from: "AED", to: "INR" }, { from: "AED", to: "PKR" },
  { from: "SAR", to: "INR" }, { from: "SAR", to: "PKR" },
  { from: "SGD", to: "INR" }, { from: "SGD", to: "PHP" },
  { from: "CHF", to: "INR" }, { from: "CHF", to: "EUR" },
  { from: "NZD", to: "INR" }, { from: "NZD", to: "PHP" },
  { from: "HKD", to: "INR" }, { from: "HKD", to: "PHP" },
];

const SEND_AMOUNTS = [500, 1000, 5000];

function parseRevolutQuote(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);

    // Amounts are in minor units (cents)
    const senderAmount = (data.sender?.amount || 0) / 100;
    const recipientAmount = (data.recipient?.amount || 0) / 100;
    const rate = data.rate?.rate || 0;

    if (!recipientAmount || !rate) return null;

    // Extract fee from the Standard plan
    let fee = 0;
    if (data.plans && Array.isArray(data.plans)) {
      const standard = data.plans.find(
        (p: Record<string, unknown>) => p.id === "STANDARD"
      );
      if (standard?.fees?.total?.amount) {
        fee = standard.fees.total.amount / 100;
      }
    }

    return {
      provider: "Revolut",
      providerSlug: "revolut",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: senderAmount || amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(rate * 10000) / 10000,
      receiveAmount: Math.round(recipientAmount * 100) / 100,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "revolut-browser-api",
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
    // Intercept Revolut's quote API
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("/api/exchange/quote") && !url.includes("recipient-currencies")) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          const parsed = parseRevolutQuote(
            body,
            corridor.from,
            corridor.to,
            amount
          );
          if (parsed && parsed.receiveAmount > 0) {
            capturedQuote = parsed;
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to the currency converter page
    await page.goto("https://www.revolut.com/currency-converter/", {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(2000);
    await dismissOverlays(page);
    await delay(1000);

    // Select source currency if needed
    const fromButton = page.locator('button[aria-label="Currency you are converting from"]').first();
    if (await fromButton.isVisible({ timeout: 2000 })) {
      const buttonText = await fromButton.textContent();
      if (!buttonText?.includes(corridor.from)) {
        await fromButton.click();
        await delay(500);
        // Type the currency in the search
        const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
        if (await searchInput.isVisible({ timeout: 1000 })) {
          await searchInput.fill(corridor.from);
          await delay(500);
        }
        // Click the matching option
        await page.locator(`button:has-text("${corridor.from}"), [role="option"]:has-text("${corridor.from}")`).first().click({ timeout: 2000 });
        await delay(1000);
      }
    }

    // Select destination currency
    const toButton = page.locator('button[aria-label="Currency you are converting to"]').first();
    if (await toButton.isVisible({ timeout: 2000 })) {
      const buttonText = await toButton.textContent();
      if (!buttonText?.includes(corridor.to)) {
        await toButton.click();
        await delay(500);
        const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
        if (await searchInput.isVisible({ timeout: 1000 })) {
          await searchInput.fill(corridor.to);
          await delay(500);
        }
        await page.locator(`button:has-text("${corridor.to}"), [role="option"]:has-text("${corridor.to}")`).first().click({ timeout: 2000 });
        await delay(1000);
      }
    }

    // Fill amount — clear the field fully first to avoid concatenation
    const amountSelectors = [
      'input[inputmode="numeric"]',
      'input[type="number"]',
      'input[type="tel"]',
    ];
    for (const sel of amountSelectors) {
      try {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 2000 })) {
          await input.click({ clickCount: 3 });
          await delay(100);
          await input.press("Control+a");
          await delay(100);
          await input.press("Backspace");
          await delay(200);
          for (const char of String(amount)) {
            await input.press(char);
            await delay(60);
          }
          break;
        }
      } catch {
        continue;
      }
    }

    // Wait for quote API response
    await delay(4000);

    if (capturedQuote) return capturedQuote;
    return null;
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== Revolut Browser Automation Scraper ===\n");
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
              `    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}`
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

    const outputPath = path.join(OUTPUT_DIR, "revolut-quotes.json");
    fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const total = successCount + failCount;
    console.log(`\n=== Revolut Scraping Complete ===`);
    console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
    console.log(`Success: ${successCount}, Failed: ${failCount}`);
    console.log(`Success rate: ${total > 0 ? ((successCount / total) * 100).toFixed(1) : 0}%`);
    console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
  }
}

main().catch((err) => {
  console.error("Revolut scraper failed:", err);
});
