/**
 * Western Union Browser Automation Scraper
 *
 * WU has a public pricing API at /wuconnect/prices/catalog that returns
 * rates for all service/payment combinations. We use Playwright to navigate
 * to their send-money flow, select the destination, and intercept the
 * pricing catalog response.
 *
 * API: GET /wuconnect/prices/catalog (triggered by calculator interaction)
 * Response: services_groups[] → pay_groups[] with fx_rate, fees, receive_amount
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

// WU country names for destination selection
const CORRIDORS = [
  { from: "USD", to: "INR", destCountry: "India", destCode: "IN" },
  { from: "USD", to: "PHP", destCountry: "Philippines", destCode: "PH" },
  { from: "USD", to: "IDR", destCountry: "Indonesia", destCode: "ID" },
  { from: "USD", to: "THB", destCountry: "Thailand", destCode: "TH" },
  { from: "USD", to: "NPR", destCountry: "Nepal", destCode: "NP" },
  { from: "USD", to: "LKR", destCountry: "Sri Lanka", destCode: "LK" },
  { from: "USD", to: "EGP", destCountry: "Egypt", destCode: "EG" },
  { from: "USD", to: "MAD", destCountry: "Morocco", destCode: "MA" },
  { from: "USD", to: "MYR", destCountry: "Malaysia", destCode: "MY" },
  { from: "USD", to: "TRY", destCountry: "Turkey", destCode: "TR" },
  { from: "USD", to: "PEN", destCountry: "Peru", destCode: "PE" },
  { from: "USD", to: "MXN", destCountry: "Mexico", destCode: "MX" },
  { from: "USD", to: "NGN", destCountry: "Nigeria", destCode: "NG" },
  { from: "USD", to: "PKR", destCountry: "Pakistan", destCode: "PK" },
  { from: "USD", to: "BDT", destCountry: "Bangladesh", destCode: "BD" },
  { from: "USD", to: "GHS", destCountry: "Ghana", destCode: "GH" },
  { from: "USD", to: "KES", destCountry: "Kenya", destCode: "KE" },
  { from: "USD", to: "BRL", destCountry: "Brazil", destCode: "BR" },
  { from: "USD", to: "COP", destCountry: "Colombia", destCode: "CO" },
  { from: "USD", to: "EUR", destCountry: "Germany", destCode: "DE" },
  { from: "USD", to: "GBP", destCountry: "United Kingdom", destCode: "GB" },
  { from: "GBP", to: "INR", destCountry: "India", destCode: "IN" },
  { from: "GBP", to: "NGN", destCountry: "Nigeria", destCode: "NG" },
  { from: "GBP", to: "PKR", destCountry: "Pakistan", destCode: "PK" },
  { from: "EUR", to: "INR", destCountry: "India", destCode: "IN" },
  { from: "EUR", to: "PKR", destCountry: "Pakistan", destCode: "PK" },
  { from: "CAD", to: "INR", destCountry: "India", destCode: "IN" },
  { from: "CAD", to: "PHP", destCountry: "Philippines", destCode: "PH" },
  { from: "AUD", to: "INR", destCountry: "India", destCode: "IN" },
  { from: "AUD", to: "PHP", destCountry: "Philippines", destCode: "PH" },
  { from: "AED", to: "INR", destCountry: "India", destCode: "IN" },
  { from: "AED", to: "PKR", destCountry: "Pakistan", destCode: "PK" },
  { from: "SAR", to: "INR", destCountry: "India", destCode: "IN" },
  { from: "SAR", to: "PKR", destCountry: "Pakistan", destCode: "PK" },
  { from: "SAR", to: "PHP", destCountry: "Philippines", destCode: "PH" },
];

const SEND_AMOUNTS = [100, 500, 1000, 5000];

interface WUPricing {
  fxRate: number;
  sendAmount: number;
  receiveAmount: number;
  grossFee: number;
  baseFee: number;
  serviceName: string;
  fundIn: string;
}

function parsePricingCatalog(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);
    const groups = data.services_groups;
    if (!Array.isArray(groups)) return null;

    // Find the best bank account / direct debit option
    let bestQuote: WUPricing | null = null;

    for (const group of groups) {
      const payGroups = group.pay_groups;
      if (!Array.isArray(payGroups)) continue;

      for (const pg of payGroups) {
        const fxRate = pg.fx_rate;
        const receiveAmount = pg.receive_amount;
        const grossFee = pg.gross_fee ?? pg.base_fee ?? 0;
        const fundIn = pg.fund_in || "";

        if (!fxRate || !receiveAmount) continue;

        // Prefer AC (bank account) or DC (debit card) over CC (credit card)
        if (
          !bestQuote ||
          (fundIn === "AC" && bestQuote.fundIn !== "AC") ||
          (fundIn === "DC" && bestQuote.fundIn === "CC") ||
          grossFee < bestQuote.grossFee
        ) {
          bestQuote = {
            fxRate,
            sendAmount: pg.send_amount || amount,
            receiveAmount,
            grossFee,
            baseFee: pg.base_fee || grossFee,
            serviceName: group.service_name || "Money Transfer",
            fundIn,
          };
        }
      }
    }

    if (!bestQuote) return null;

    return {
      provider: "Western Union",
      providerSlug: "western-union",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount: amount,
      fee: Math.round(bestQuote.grossFee * 100) / 100,
      exchangeRate: bestQuote.fxRate,
      receiveAmount: Math.round(bestQuote.receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryEstimate: bestQuote.serviceName.includes("Minutes")
        ? "Minutes"
        : bestQuote.serviceName.includes("Next Day")
          ? "1 day"
          : null,
      deliveryMethod: bestQuote.fundIn === "AC" ? "Bank Account" : bestQuote.fundIn === "DC" ? "Debit Card" : bestQuote.fundIn,
      dateCollected: new Date().toISOString(),
      source: "western-union-browser",
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
  // Set a hard per-page timeout to prevent indefinite hangs
  page.setDefaultTimeout(45000);
  let capturedQuote: ProviderQuote | null = null;
  let pageClosing = false;

  try {
    // Intercept pricing catalog responses
    page.on("response", async (response) => {
      if (pageClosing) return;
      const url = response.url();
      if (
        url.includes("/prices/catalog") ||
        (url.includes("/wuconnect/") && (url.includes("price") || url.includes("rate")))
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (body.includes("fx_rate") || body.includes("services_groups")) {
            const parsed = parsePricingCatalog(
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
          // Response not readable
        }
      }
    });

    // Always use the US site — it supports all send currencies via the
    // currency selector on the page, and we know its selectors work reliably.
    const url = `https://www.westernunion.com/us/en/web/send-money/start`;
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await delay(4000);
    await dismissOverlays(page);

    // Select destination country
    const countryInput = page.locator("#country, input[name='country'], input[aria-label*='country'], input[placeholder*='country']").first();
    if (await countryInput.isVisible({ timeout: 3000 })) {
      await countryInput.click();
      await countryInput.fill(corridor.destCountry);
      await delay(1000);
      // Click the matching option
      try {
        await page
          .locator(`li:has-text("${corridor.destCountry}"), [role="option"]:has-text("${corridor.destCountry}")`)
          .first()
          .click({ timeout: 3000 });
      } catch {
        // Try pressing Enter
        await countryInput.press("Enter");
      }
      await delay(2000);
    }

    // Fill amount
    const filled = await fillAmountInput(page, amount, [
      "#txtSendAmount",
      'input[name="txtSendAmount"]',
      'input[aria-label*="Send amount"]',
      'input[placeholder*="Send amount"]',
      'input[id*="send"]',
      'input[type="number"]',
      'input[type="tel"]',
    ]);

    if (filled) {
      // Tab out to trigger calculation
      await page.keyboard.press("Tab");
      await delay(5000);
    }

    if (capturedQuote) return capturedQuote;

    // Fallback: try to read from DOM
    const bodyText = await page.locator("body").textContent({ timeout: 3000 }).catch(() => "");
    const rateMatch = bodyText?.match(/1\s*[A-Z]{3}\s*=\s*([\d,.]+)/);
    if (rateMatch) {
      const rate = parseFloat(rateMatch[1].replace(/,/g, ""));
      if (rate > 0) {
        return {
          provider: "Western Union",
          providerSlug: "western-union",
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
          source: "western-union-browser-dom",
        };
      }
    }

    return null;
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    pageClosing = true;
    await page.close().catch(() => {});
  }
}

/** Wrap a scrape attempt with an overall timeout to prevent indefinite hangs */
function withTimeout<T>(
  fn: () => Promise<T | null>,
  ms: number
): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.log(`    ⚠ Timed out after ${ms / 1000}s`);
      resolve(null);
    }, ms);
    fn().then(
      (result) => { clearTimeout(timer); resolve(result); },
      () => { clearTimeout(timer); resolve(null); }
    );
  });
}

async function main() {
  console.log("=== Western Union Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.destCountry})`);

    // Fresh browser context per corridor to avoid WU bot detection
    const context = await setupBrowserContext();

    try {
      for (const amount of SEND_AMOUNTS) {
        try {
          console.log(`  Scraping: ${corridor.from} → ${corridor.to} ($${amount})...`);

          const quote = await withRetry(
            () => withTimeout(
              () => scrapeCorridorAmount(context, corridor, amount),
              90000 // 90s hard timeout per attempt
            ),
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
        } catch (err) {
          failCount++;
          console.log(`    ✗ Error: ${err instanceof Error ? err.message : String(err)}`);
        }

        await jitteredDelay(5000);
      }
    } finally {
      await context.browser()?.close().catch(() => {});
    }

    // Save partial results after each corridor
    const outputPath = path.join(OUTPUT_DIR, "western-union-quotes.json");
    fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));
  }

  const outputPath = path.join(OUTPUT_DIR, "western-union-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const total = successCount + failCount;
  console.log(`\n=== Western Union Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Success rate: ${total > 0 ? ((successCount / total) * 100).toFixed(1) : 0}%`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
}

main().catch((err) => {
  console.error("Western Union scraper failed:", err);
});
