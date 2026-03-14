/**
 * MoneyTransfers.com Comparison Scraper (Playwright)
 *
 * MoneyTransfers.com is a comparison aggregator — each corridor page shows
 * quotes from multiple providers with fees, exchange rates, and receive amounts.
 *
 * The site is a JS-rendered SPA, so we use Playwright to load pages and
 * intercept API/XHR responses containing comparison data, with a DOM
 * fallback for extracting provider cards.
 *
 * URL: /send-money/{destination-country}
 */
import * as fs from "fs";
import * as path from "path";
import { type BrowserContext, type Page } from "playwright";
import {
  OUTPUT_DIR,
  NAV_TIMEOUT,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  parseNumber,
  type ProviderQuote,
} from "./lib/browser";

const DELAY_MS = 3000;

// Corridors: destination country slug + currency pair
const CORRIDORS = [
  { country: "india", from: "USD", to: "INR" },
  { country: "philippines", from: "USD", to: "PHP" },
  { country: "mexico", from: "USD", to: "MXN" },
  { country: "nigeria", from: "USD", to: "NGN" },
  { country: "pakistan", from: "USD", to: "PKR" },
  { country: "bangladesh", from: "USD", to: "BDT" },
  { country: "ghana", from: "USD", to: "GHS" },
  { country: "kenya", from: "USD", to: "KES" },
  { country: "brazil", from: "USD", to: "BRL" },
  { country: "colombia", from: "USD", to: "COP" },
  { country: "united-kingdom", from: "USD", to: "GBP" },
  { country: "germany", from: "USD", to: "EUR" },
  { country: "india", from: "GBP", to: "INR" },
  { country: "germany", from: "GBP", to: "EUR" },
  { country: "nigeria", from: "GBP", to: "NGN" },
  { country: "pakistan", from: "GBP", to: "PKR" },
  { country: "india", from: "EUR", to: "INR" },
  { country: "india", from: "CAD", to: "INR" },
  { country: "india", from: "AUD", to: "INR" },
  { country: "india", from: "AED", to: "INR" },
];

const SEND_AMOUNTS = [500, 1000, 5000];

interface CapturedQuote {
  provider: string;
  providerSlug: string;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  deliveryEstimate: string | null;
}

/**
 * Try to parse comparison data from intercepted API responses.
 */
function parseApiResponse(body: string): CapturedQuote[] {
  try {
    const json = JSON.parse(body);

    // Handle array of provider quotes
    const providers = Array.isArray(json) ? json : json.data || json.results || json.providers || json.quotes || [];
    if (!Array.isArray(providers) || providers.length === 0) return [];

    const quotes: CapturedQuote[] = [];
    for (const p of providers) {
      const name =
        p.provider?.name || p.providerName || p.name || p.provider || "";
      if (!name || typeof name !== "string") continue;

      const slug = (
        p.provider?.slug ||
        p.providerSlug ||
        p.slug ||
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      );

      const receiveAmount =
        p.receiveAmount || p.receivedAmount || p.receive_amount || p.payout_amount || 0;
      const exchangeRate =
        p.exchangeRate || p.rate || p.exchange_rate || p.fx_rate || 0;
      const fee =
        p.fee?.total ?? p.fee ?? p.fees?.total ?? p.totalFee ?? p.transfer_fee ?? 0;

      if (!receiveAmount && !exchangeRate) continue;

      const delivery =
        p.deliveryEstimate ||
        p.delivery_time ||
        p.transferTime ||
        p.speed ||
        null;

      quotes.push({
        provider: name,
        providerSlug: slug,
        fee: typeof fee === "number" ? Math.round(fee * 100) / 100 : 0,
        exchangeRate: typeof exchangeRate === "number" ? exchangeRate : 0,
        receiveAmount:
          typeof receiveAmount === "number"
            ? Math.round(receiveAmount * 100) / 100
            : 0,
        deliveryEstimate: typeof delivery === "string" ? delivery : null,
      });
    }
    return quotes;
  } catch {
    return [];
  }
}

/**
 * Fallback: extract provider data from rendered DOM.
 */
async function extractFromDOM(page: Page): Promise<CapturedQuote[]> {
  return page.evaluate(() => {
    const quotes: {
      provider: string;
      providerSlug: string;
      fee: number;
      exchangeRate: number;
      receiveAmount: number;
      deliveryEstimate: string | null;
    }[] = [];

    // Look for comparison table rows or provider cards
    const selectors = [
      "table tbody tr",
      '[class*="provider"] [class*="row"]',
      '[class*="comparison"] [class*="item"]',
      '[class*="result"] [class*="card"]',
      '[data-provider]',
      '[class*="quote"]',
    ];

    for (const sel of selectors) {
      const rows = document.querySelectorAll(sel);
      if (rows.length < 2) continue;

      for (const row of rows) {
        const text = row.textContent || "";
        // Try to find provider name from images, headings, or data attributes
        const nameEl =
          row.querySelector("img[alt]") ||
          row.querySelector("h3, h4, [class*='name'], [class*='provider']");
        const name =
          (row as HTMLElement).dataset?.provider ||
          nameEl?.getAttribute("alt") ||
          nameEl?.textContent?.trim() ||
          "";

        if (!name) continue;

        // Extract numbers from the row text
        const numbers = text.match(/[\d,]+\.?\d*/g)?.map((n) =>
          parseFloat(n.replace(/,/g, ""))
        ) || [];

        if (numbers.length < 1) continue;

        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        quotes.push({
          provider: name,
          providerSlug: slug,
          fee: 0,
          exchangeRate: 0,
          receiveAmount: numbers[numbers.length - 1] || 0, // Usually last number is receive amount
          deliveryEstimate: null,
        });
      }

      if (quotes.length > 0) break;
    }

    return quotes;
  });
}

async function scrapeCorridor(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote[]> {
  const page = await context.newPage();
  let capturedQuotes: CapturedQuote[] = [];

  try {
    // Intercept API responses containing comparison data
    page.on("response", async (response) => {
      const url = response.url();
      const ct = response.headers()["content-type"] || "";
      if (!ct.includes("json")) return;

      // Skip tracking/analytics endpoints
      if (
        url.includes("google") ||
        url.includes("analytics") ||
        url.includes("gtm") ||
        url.includes("facebook") ||
        url.includes("sentry")
      )
        return;

      try {
        const body = await response.text();
        if (
          body.includes("provider") ||
          body.includes("exchange") ||
          body.includes("receiveAmount") ||
          body.includes("quote")
        ) {
          const parsed = parseApiResponse(body);
          if (parsed.length > capturedQuotes.length) {
            capturedQuotes = parsed;
          }
        }
      } catch {
        /* not readable */
      }
    });

    const url = `https://moneytransfers.com/send-money/${corridor.country}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(4000);
    await dismissOverlays(page);

    // Try to set the send amount if there's an input field
    const amountSelectors = [
      'input[type="number"]',
      'input[name*="amount"]',
      'input[id*="amount"]',
      'input[placeholder*="amount"]',
      'input[aria-label*="amount"]',
      'input[class*="amount"]',
    ];

    for (const sel of amountSelectors) {
      try {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 2000 })) {
          await input.click({ clickCount: 3 });
          await delay(200);
          await input.press("Backspace");
          await delay(100);
          for (const char of String(amount)) {
            await input.press(char);
            await delay(60);
          }
          await delay(100);
          await input.press("Enter");
          await delay(3000);
          break;
        }
      } catch {
        continue;
      }
    }

    // Wait for data to load
    await delay(3000);

    // If API interception didn't capture data, try DOM extraction
    if (capturedQuotes.length === 0) {
      capturedQuotes = await extractFromDOM(page);
    }

    // Normalize to ProviderQuote format
    const now = new Date().toISOString();
    return capturedQuotes.map((q) => ({
      provider: q.provider,
      providerSlug: q.providerSlug,
      providerType: "moneyTransferProvider",
      sendCurrency: corridor.from,
      receiveCurrency: corridor.to,
      sendAmount: amount,
      fee: q.fee,
      exchangeRate: q.exchangeRate,
      receiveAmount: q.receiveAmount,
      deliveryEstimate: q.deliveryEstimate,
      deliveryMethod: null,
      dateCollected: now,
      source: "moneytransfers-comparison",
    }));
  } catch (err) {
    console.log(`    ⚠ Error: ${(err as Error).message?.slice(0, 80)}`);
    return [];
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== MoneyTransfers.com Comparison Scraper (Playwright) ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  const providersSeen = new Set<string>();
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      for (const amount of SEND_AMOUNTS) {
        console.log(
          `  Fetching: ${corridor.from} → ${corridor.to} (${corridor.country}, $${amount})...`
        );

        const quotes = await scrapeCorridor(context, corridor, amount);

        if (quotes.length > 0) {
          allQuotes.push(...quotes);
          for (const q of quotes) providersSeen.add(q.providerSlug);
          successCount++;
          console.log(`    ✓ ${quotes.length} providers`);
        } else {
          failCount++;
          console.log(`    ✗ No data`);
        }

        await jitteredDelay(DELAY_MS);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  const outputPath = path.join(OUTPUT_DIR, "moneytransfers-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== MoneyTransfers.com Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Corridors: ${successCount} success, ${failCount} failed`);
  console.log(`Unique providers: ${providersSeen.size}`);
  console.log(`Providers: ${[...providersSeen].sort().join(", ")}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);

  const total = successCount + failCount;
  if (total > 0 && successCount / total < 0.2) {
    console.error(
      "\n⚠ Success rate below 20% — moneytransfers.com may have changed their site structure"
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("MoneyTransfers.com scraper failed:", err);
  process.exit(1);
});
