/**
 * RemitFinder Comparison Scraper (Playwright)
 *
 * RemitFinder is a comparison aggregator showing exchange rates and fees
 * from multiple providers per corridor.
 *
 * The site is a JS-rendered SPA, so we use Playwright to load pages and
 * intercept API responses, with DOM fallback for extracting provider data.
 *
 * URL: /best-exchange-rate-to-send-money-from-{source}-to-{destination}
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

// Corridors with country name slugs for RemitFinder URLs
const CORRIDORS = [
  { fromCountry: "united-states", toCountry: "india", from: "USD", to: "INR" },
  { fromCountry: "united-states", toCountry: "philippines", from: "USD", to: "PHP" },
  { fromCountry: "united-states", toCountry: "mexico", from: "USD", to: "MXN" },
  { fromCountry: "united-states", toCountry: "nigeria", from: "USD", to: "NGN" },
  { fromCountry: "united-states", toCountry: "pakistan", from: "USD", to: "PKR" },
  { fromCountry: "united-states", toCountry: "bangladesh", from: "USD", to: "BDT" },
  { fromCountry: "united-states", toCountry: "ghana", from: "USD", to: "GHS" },
  { fromCountry: "united-states", toCountry: "kenya", from: "USD", to: "KES" },
  { fromCountry: "united-states", toCountry: "brazil", from: "USD", to: "BRL" },
  { fromCountry: "united-states", toCountry: "colombia", from: "USD", to: "COP" },
  { fromCountry: "united-states", toCountry: "united-kingdom", from: "USD", to: "GBP" },
  { fromCountry: "united-states", toCountry: "germany", from: "USD", to: "EUR" },
  { fromCountry: "united-kingdom", toCountry: "india", from: "GBP", to: "INR" },
  { fromCountry: "united-kingdom", toCountry: "germany", from: "GBP", to: "EUR" },
  { fromCountry: "united-kingdom", toCountry: "nigeria", from: "GBP", to: "NGN" },
  { fromCountry: "united-kingdom", toCountry: "pakistan", from: "GBP", to: "PKR" },
  { fromCountry: "united-kingdom", toCountry: "philippines", from: "GBP", to: "PHP" },
  { fromCountry: "germany", toCountry: "india", from: "EUR", to: "INR" },
  { fromCountry: "germany", toCountry: "nigeria", from: "EUR", to: "NGN" },
  { fromCountry: "canada", toCountry: "india", from: "CAD", to: "INR" },
  { fromCountry: "canada", toCountry: "philippines", from: "CAD", to: "PHP" },
  { fromCountry: "australia", toCountry: "india", from: "AUD", to: "INR" },
  { fromCountry: "australia", toCountry: "philippines", from: "AUD", to: "PHP" },
  { fromCountry: "united-arab-emirates", toCountry: "india", from: "AED", to: "INR" },
  { fromCountry: "united-arab-emirates", toCountry: "pakistan", from: "AED", to: "PKR" },
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

    // Try various response shapes
    const providers =
      Array.isArray(json)
        ? json
        : json.data?.providers ||
          json.data?.quotes ||
          json.data?.results ||
          json.providers ||
          json.quotes ||
          json.results ||
          json.remittanceProviders ||
          [];

    if (!Array.isArray(providers) || providers.length === 0) return [];

    const quotes: CapturedQuote[] = [];
    for (const p of providers) {
      const name =
        p.provider?.name ||
        p.providerName ||
        p.name ||
        p.provider_name ||
        p.title ||
        "";
      if (!name || typeof name !== "string") continue;

      const slug =
        p.provider?.slug ||
        p.providerSlug ||
        p.slug ||
        p.provider_slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const receiveAmount =
        p.receiveAmount ||
        p.receivedAmount ||
        p.receive_amount ||
        p.payout_amount ||
        p.recipientGets ||
        0;
      const exchangeRate =
        p.exchangeRate ||
        p.rate ||
        p.exchange_rate ||
        p.fx_rate ||
        p.fxRate ||
        0;
      const fee =
        p.fee?.total ?? p.fee ?? p.fees?.total ?? p.totalFee ?? p.transfer_fee ?? 0;

      if (!receiveAmount && !exchangeRate) continue;

      const delivery =
        p.deliveryEstimate ||
        p.delivery_time ||
        p.transferTime ||
        p.speed ||
        p.eta ||
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
 * RemitFinder shows comparison tables/cards with provider details.
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

    // Try multiple selector strategies
    const selectors = [
      "table tbody tr",
      '[class*="provider"] [class*="row"]',
      '[class*="comparison"] [class*="item"]',
      '[class*="result"] [class*="card"]',
      '[class*="remittance"] [class*="row"]',
      '[data-provider]',
      '[class*="quote"]',
      ".provider-card",
      ".compare-row",
    ];

    for (const sel of selectors) {
      const rows = document.querySelectorAll(sel);
      if (rows.length < 2) continue;

      for (const row of rows) {
        const text = row.textContent || "";

        // Try to find provider name
        const nameEl =
          row.querySelector("img[alt]") ||
          row.querySelector(
            "h3, h4, h5, [class*='name'], [class*='provider'], [class*='title']"
          );
        const name =
          (row as HTMLElement).dataset?.provider ||
          nameEl?.getAttribute("alt") ||
          nameEl?.textContent?.trim() ||
          "";

        if (!name || name.length > 60) continue;

        // Extract numbers
        const numbers =
          text.match(/[\d,]+\.?\d*/g)?.map((n) =>
            parseFloat(n.replace(/,/g, ""))
          ) || [];

        if (numbers.length < 1) continue;

        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Try to identify fee and receive amount from context
        let fee = 0;
        let receiveAmount = 0;
        let exchangeRate = 0;

        // Look for labeled values
        const cells = row.querySelectorAll("td, [class*='cell'], [class*='col']");
        for (const cell of cells) {
          const cellText = (cell.textContent || "").toLowerCase();
          const cellNum = parseFloat(
            (cell.textContent || "").replace(/[^0-9.,-]/g, "").replace(/,/g, "")
          );
          if (isNaN(cellNum)) continue;

          if (cellText.includes("fee") || cellText.includes("cost")) {
            fee = cellNum;
          } else if (cellText.includes("rate") || cellText.includes("exchange")) {
            exchangeRate = cellNum;
          } else if (
            cellText.includes("receive") ||
            cellText.includes("get") ||
            cellText.includes("payout")
          ) {
            receiveAmount = cellNum;
          }
        }

        // Fallback: largest number is likely receive amount
        if (!receiveAmount && numbers.length > 0) {
          receiveAmount = Math.max(...numbers);
        }

        quotes.push({
          provider: name,
          providerSlug: slug,
          fee,
          exchangeRate,
          receiveAmount: Math.round(receiveAmount * 100) / 100,
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
    // Intercept API responses
    page.on("response", async (response) => {
      const url = response.url();
      const ct = response.headers()["content-type"] || "";
      if (!ct.includes("json")) return;

      // Skip tracking/analytics
      if (
        url.includes("google") ||
        url.includes("analytics") ||
        url.includes("gtm") ||
        url.includes("facebook") ||
        url.includes("sentry") ||
        url.includes("hotjar")
      )
        return;

      try {
        const body = await response.text();
        if (
          body.includes("provider") ||
          body.includes("exchange") ||
          body.includes("receive") ||
          body.includes("quote") ||
          body.includes("remittance")
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

    const url = `https://www.remitfinder.com/best-exchange-rate-to-send-money-from-${corridor.fromCountry}-to-${corridor.toCountry}`;
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(4000);
    await dismissOverlays(page);

    // Try to set send amount
    const amountSelectors = [
      'input[type="number"]',
      'input[name*="amount"]',
      'input[id*="amount"]',
      'input[placeholder*="amount"]',
      'input[aria-label*="amount"]',
      'input[class*="amount"]',
      'input[name*="send"]',
      'input[id*="send"]',
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
      source: "remitfinder-comparison",
    }));
  } catch (err) {
    console.log(`    ⚠ Error: ${(err as Error).message?.slice(0, 80)}`);
    return [];
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== RemitFinder Comparison Scraper (Playwright) ===\n");
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
          `  Fetching: ${corridor.from} → ${corridor.to} (${corridor.fromCountry} → ${corridor.toCountry}, $${amount})...`
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

  const outputPath = path.join(OUTPUT_DIR, "remitfinder-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== RemitFinder Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Corridors: ${successCount} success, ${failCount} failed`);
  console.log(`Unique providers: ${providersSeen.size}`);
  console.log(`Providers: ${[...providersSeen].sort().join(", ")}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);

  const total = successCount + failCount;
  if (total > 0 && successCount / total < 0.2) {
    console.error(
      "\n⚠ Success rate below 20% — remitfinder.com may have changed their site structure"
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("RemitFinder scraper failed:", err);
  process.exit(1);
});
