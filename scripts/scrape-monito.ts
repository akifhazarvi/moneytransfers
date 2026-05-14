/**
 * Monito Comparison Scraper (Playwright)
 *
 * Monito is a comparison aggregator — one page returns quotes from
 * 15-20 providers per corridor. The data is server-rendered in __NUXT_DATA__
 * and also fetched via GraphQL at /api/v2.
 *
 * We use Playwright to load the comparison page and extract the SSR data
 * directly from the HTML — no need to replicate the exact GraphQL query.
 *
 * URL: /en/compare/transfer/{sendCountry}/{receiveCountry}/{sendCur}/{recvCur}/{amount}
 */
import * as fs from "fs";
import * as path from "path";
import { chromium, type BrowserContext } from "playwright";
import {
  OUTPUT_DIR,
  NAV_TIMEOUT,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  blockHeavyResources,
} from "./lib/browser";

const DELAY_MS = 2500;

const CORRIDORS = [
  { fromCountry: "us", toCountry: "in", from: "USD", to: "INR" },
  { fromCountry: "us", toCountry: "ph", from: "USD", to: "PHP" },
  { fromCountry: "us", toCountry: "mx", from: "USD", to: "MXN" },
  { fromCountry: "us", toCountry: "ng", from: "USD", to: "NGN" },
  { fromCountry: "us", toCountry: "pk", from: "USD", to: "PKR" },
  { fromCountry: "us", toCountry: "bd", from: "USD", to: "BDT" },
  { fromCountry: "us", toCountry: "gh", from: "USD", to: "GHS" },
  { fromCountry: "us", toCountry: "ke", from: "USD", to: "KES" },
  { fromCountry: "us", toCountry: "br", from: "USD", to: "BRL" },
  { fromCountry: "us", toCountry: "co", from: "USD", to: "COP" },
  { fromCountry: "us", toCountry: "gb", from: "USD", to: "GBP" },
  { fromCountry: "us", toCountry: "de", from: "USD", to: "EUR" },
  { fromCountry: "gb", toCountry: "in", from: "GBP", to: "INR" },
  { fromCountry: "gb", toCountry: "de", from: "GBP", to: "EUR" },
  { fromCountry: "gb", toCountry: "ng", from: "GBP", to: "NGN" },
  { fromCountry: "gb", toCountry: "pk", from: "GBP", to: "PKR" },
  { fromCountry: "gb", toCountry: "ph", from: "GBP", to: "PHP" },
  { fromCountry: "de", toCountry: "in", from: "EUR", to: "INR" },
  { fromCountry: "de", toCountry: "ng", from: "EUR", to: "NGN" },
  { fromCountry: "de", toCountry: "ph", from: "EUR", to: "PHP" },
  { fromCountry: "de", toCountry: "pk", from: "EUR", to: "PKR" },
  { fromCountry: "de", toCountry: "mx", from: "EUR", to: "MXN" },
  { fromCountry: "de", toCountry: "bd", from: "EUR", to: "BDT" },
  { fromCountry: "de", toCountry: "gh", from: "EUR", to: "GHS" },
  { fromCountry: "de", toCountry: "ke", from: "EUR", to: "KES" },
  { fromCountry: "de", toCountry: "br", from: "EUR", to: "BRL" },
  { fromCountry: "de", toCountry: "co", from: "EUR", to: "COP" },
  { fromCountry: "de", toCountry: "tr", from: "EUR", to: "TRY" },
  { fromCountry: "de", toCountry: "ma", from: "EUR", to: "MAD" },
  { fromCountry: "ca", toCountry: "in", from: "CAD", to: "INR" },
  { fromCountry: "ca", toCountry: "ph", from: "CAD", to: "PHP" },
  { fromCountry: "au", toCountry: "in", from: "AUD", to: "INR" },
  { fromCountry: "au", toCountry: "ph", from: "AUD", to: "PHP" },
  { fromCountry: "ae", toCountry: "in", from: "AED", to: "INR" },
  { fromCountry: "ae", toCountry: "pk", from: "AED", to: "PKR" },
  { fromCountry: "ae", toCountry: "ph", from: "AED", to: "PHP" },
  { fromCountry: "ae", toCountry: "bd", from: "AED", to: "BDT" },
  { fromCountry: "ae", toCountry: "ng", from: "AED", to: "NGN" },
  { fromCountry: "ae", toCountry: "eg", from: "AED", to: "EGP" },
  { fromCountry: "ae", toCountry: "np", from: "AED", to: "NPR" },
  { fromCountry: "ae", toCountry: "lk", from: "AED", to: "LKR" },
  { fromCountry: "sg", toCountry: "in", from: "SGD", to: "INR" },
  { fromCountry: "sg", toCountry: "ph", from: "SGD", to: "PHP" },
  { fromCountry: "sa", toCountry: "in", from: "SAR", to: "INR" },
  { fromCountry: "sa", toCountry: "pk", from: "SAR", to: "PKR" },
  { fromCountry: "sa", toCountry: "ph", from: "SAR", to: "PHP" },
  { fromCountry: "sa", toCountry: "bd", from: "SAR", to: "BDT" },
  { fromCountry: "sa", toCountry: "ng", from: "SAR", to: "NGN" },
  { fromCountry: "sa", toCountry: "eg", from: "SAR", to: "EGP" },
  // From OMR (Oman)
  { fromCountry: "om", toCountry: "in", from: "OMR", to: "INR" },
  { fromCountry: "om", toCountry: "pk", from: "OMR", to: "PKR" },
  { fromCountry: "om", toCountry: "ph", from: "OMR", to: "PHP" },
  { fromCountry: "om", toCountry: "bd", from: "OMR", to: "BDT" },
  // From KWD (Kuwait)
  { fromCountry: "kw", toCountry: "in", from: "KWD", to: "INR" },
  { fromCountry: "kw", toCountry: "pk", from: "KWD", to: "PKR" },
  { fromCountry: "kw", toCountry: "ph", from: "KWD", to: "PHP" },
  { fromCountry: "kw", toCountry: "bd", from: "KWD", to: "BDT" },
  // From BHD (Bahrain)
  { fromCountry: "bh", toCountry: "in", from: "BHD", to: "INR" },
  { fromCountry: "bh", toCountry: "pk", from: "BHD", to: "PKR" },
  { fromCountry: "bh", toCountry: "ph", from: "BHD", to: "PHP" },
  { fromCountry: "bh", toCountry: "bd", from: "BHD", to: "BDT" },
  // From QAR (Qatar)
  { fromCountry: "qa", toCountry: "in", from: "QAR", to: "INR" },
  { fromCountry: "qa", toCountry: "pk", from: "QAR", to: "PKR" },
  { fromCountry: "qa", toCountry: "ph", from: "QAR", to: "PHP" },
  { fromCountry: "qa", toCountry: "bd", from: "QAR", to: "BDT" },
  { fromCountry: "nz", toCountry: "in", from: "NZD", to: "INR" },
  { fromCountry: "nz", toCountry: "ph", from: "NZD", to: "PHP" },
  // Phase 1: Caribbean corridors
  { fromCountry: "us", toCountry: "do", from: "USD", to: "DOP" },
  { fromCountry: "us", toCountry: "jm", from: "USD", to: "JMD" },
  { fromCountry: "us", toCountry: "ht", from: "USD", to: "HTG" },
  { fromCountry: "gb", toCountry: "jm", from: "GBP", to: "JMD" },
  // Phase 1: India outbound
  { fromCountry: "in", toCountry: "us", from: "INR", to: "USD" },
  { fromCountry: "in", toCountry: "gb", from: "INR", to: "GBP" },
  { fromCountry: "in", toCountry: "ca", from: "INR", to: "CAD" },
  { fromCountry: "in", toCountry: "au", from: "INR", to: "AUD" },
  { fromCountry: "in", toCountry: "ae", from: "INR", to: "AED" },
  { fromCountry: "in", toCountry: "sg", from: "INR", to: "SGD" },
  { fromCountry: "in", toCountry: "de", from: "INR", to: "EUR" },
  // Phase 2: Ukraine corridors
  { fromCountry: "us", toCountry: "ua", from: "USD", to: "UAH" },
  { fromCountry: "gb", toCountry: "ua", from: "GBP", to: "UAH" },
  { fromCountry: "de", toCountry: "ua", from: "EUR", to: "UAH" },
  // Phase 2: Ethiopia & Guatemala
  { fromCountry: "us", toCountry: "et", from: "USD", to: "ETB" },
  { fromCountry: "us", toCountry: "gt", from: "USD", to: "GTQ" },
  // Phase 2: Japan outbound
  { fromCountry: "jp", toCountry: "ph", from: "JPY", to: "PHP" },
  { fromCountry: "jp", toCountry: "in", from: "JPY", to: "INR" },
  { fromCountry: "jp", toCountry: "us", from: "JPY", to: "USD" },
  // Phase 2: Hong Kong outbound
  { fromCountry: "hk", toCountry: "ph", from: "HKD", to: "PHP" },
  { fromCountry: "hk", toCountry: "in", from: "HKD", to: "INR" },
  // Phase 2: South Korea outbound
  { fromCountry: "kr", toCountry: "ph", from: "KRW", to: "PHP" },
  { fromCountry: "kr", toCountry: "vn", from: "KRW", to: "VND" },
  // Phase 3: Honduras, Nepal expanded, Sri Lanka expanded
  { fromCountry: "us", toCountry: "hn", from: "USD", to: "HNL" },
  { fromCountry: "us", toCountry: "np", from: "USD", to: "NPR" },
  { fromCountry: "gb", toCountry: "np", from: "GBP", to: "NPR" },
  { fromCountry: "us", toCountry: "lk", from: "USD", to: "LKR" },
  { fromCountry: "gb", toCountry: "lk", from: "GBP", to: "LKR" },
  // Phase 3: Malaysia outbound
  { fromCountry: "my", toCountry: "in", from: "MYR", to: "INR" },
  { fromCountry: "my", toCountry: "id", from: "MYR", to: "IDR" },
  { fromCountry: "my", toCountry: "ph", from: "MYR", to: "PHP" },
  // Phase 3: Switzerland outbound
  { fromCountry: "ch", toCountry: "in", from: "CHF", to: "INR" },
  { fromCountry: "ch", toCountry: "ph", from: "CHF", to: "PHP" },
  // Phase 3: South Africa outbound
  { fromCountry: "za", toCountry: "ng", from: "ZAR", to: "NGN" },
  { fromCountry: "za", toCountry: "gb", from: "ZAR", to: "GBP" },
  { fromCountry: "za", toCountry: "ke", from: "ZAR", to: "KES" },
];

const SEND_AMOUNTS = [100, 1000];

interface MonitoQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  midMarketRate: number;
  markup: number;
  receiveAmount: number;
  paymentMethod: string | null;
  deliveryEstimate: string | null;
  payinMethod: string | null;
  payoutMethod: string | null;
  providerScore: number | null;
  promoReceiveAmount: number | null;
  dateCollected: string;
  source: string;
}

function parseGraphQLResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  amount: number
): { midMarketRate: number; quotes: MonitoQuote[] } | null {
  try {
    const json = JSON.parse(body);
    const results = json?.data?.results;
    if (!results?.providerQuotes) return null;

    const midMarketRate = results.midMarket?.rate || 0;
    const quotes: MonitoQuote[] = [];

    for (const pq of results.providerQuotes) {
      const provider = pq.psp;
      if (!pq.quotes || pq.quotes.length === 0) continue;

      // Pick the best bank-to-bank quote, or first available
      const bankQuote =
        pq.quotes.find(
          (q: Record<string, unknown>) =>
            (q.payin === "BANK" || q.payin === "DIRECT") &&
            (q.payout === "BANK" || q.payout === "INTERNATIONAL_BANK")
        ) || pq.quotes[0];

      const receiveAmount = bankQuote.receivedAmount || 0;
      const rate = bankQuote.rate || 0;
      const fee = bankQuote.fee?.total ?? 0;
      const markup =
        midMarketRate > 0 && rate > 0
          ? Math.round(((midMarketRate - rate) / midMarketRate) * 10000) / 100
          : 0;

      let deliveryEstimate: string | null = null;
      if (bankQuote.transferTime) {
        const min = bankQuote.transferTime.min;
        const max = bankQuote.transferTime.max;
        if (min === 0 && max === 0) deliveryEstimate = "Instant";
        else if (min === max) deliveryEstimate = `${min} day${min > 1 ? "s" : ""}`;
        else deliveryEstimate = `${min}-${max} days`;
      }

      const promo = bankQuote.promos?.[0];

      quotes.push({
        provider: provider.displayName || provider.name,
        providerSlug: provider.slug,
        providerType: provider.type || "moneyTransferProvider",
        sendCurrency,
        receiveCurrency,
        sendAmount: amount,
        fee: Math.round(fee * 100) / 100,
        exchangeRate: rate,
        midMarketRate,
        markup,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        paymentMethod: null,
        deliveryEstimate,
        payinMethod: bankQuote.payin || null,
        payoutMethod: bankQuote.payout || null,
        providerScore: provider.score?.value || null,
        promoReceiveAmount: promo?.receivedAmount ? Math.round(promo.receivedAmount * 100) / 100 : null,
        dateCollected: new Date().toISOString(),
        source: "monito-comparison",
      });
    }

    return { midMarketRate, quotes };
  } catch {
    return null;
  }
}

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<{ midMarketRate: number; quotes: MonitoQuote[] } | null> {
  const page = await context.newPage();
  await blockHeavyResources(page);
  let capturedResult: { midMarketRate: number; quotes: MonitoQuote[] } | null = null;

  try {
    // Intercept the GraphQL response
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("monito.com/api")) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (body.includes("providerQuotes") || body.includes("transfer_comparison")) {
            const parsed = parseGraphQLResponse(body, corridor.from, corridor.to, amount);
            if (parsed && parsed.quotes.length > 0) {
              capturedResult = parsed;
            }
          }
        } catch { /* not readable */ }
      }
    });

    const url = `https://www.monito.com/en/compare/transfer/${corridor.fromCountry}/${corridor.toCountry}/${corridor.from.toLowerCase()}/${corridor.to.toLowerCase()}/${amount}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(5000);
    await dismissOverlays(page);

    // If GraphQL was intercepted, use it
    if (capturedResult) return capturedResult;

    // Fallback: wait a bit more for async GraphQL
    await delay(5000);
    if (capturedResult) return capturedResult;

    return null;
  } catch (err) {
    console.log(`    ⚠ Error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

// Write atomically (tmp → rename) so a kill mid-write can't leave a
// half-written file that breaks the Next.js build that imports it.
function writeQuotesAtomic(outputPath: string, quotes: MonitoQuote[]) {
  const tmp = `${outputPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(quotes, null, 2));
  fs.renameSync(tmp, outputPath);
}

async function main() {
  console.log("=== Monito Comparison Scraper (Playwright) ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const context = await setupBrowserContext();
  const allQuotes: MonitoQuote[] = [];
  const providersSeen = new Set<string>();
  let successCorridors = 0;
  let failCorridors = 0;
  const startTime = Date.now();

  const outputPath = path.join(OUTPUT_DIR, "monito-quotes.json");
  // Persist every N corridors so CI timeouts (28 min job vs ~34 min local
  // runtime) still produce useful partial output instead of losing the
  // entire scrape and leaving stale data from the previous run.
  const FLUSH_EVERY = 10;
  let corridorsProcessed = 0;

  try {
    for (const corridor of CORRIDORS) {
      for (const amount of SEND_AMOUNTS) {
        console.log(`  Fetching: ${corridor.from} → ${corridor.to} ($${amount})...`);

        const result = await scrapeCorridorAmount(context, corridor, amount);

        if (result && result.quotes.length > 0) {
          allQuotes.push(...result.quotes);
          for (const q of result.quotes) providersSeen.add(q.providerSlug);
          successCorridors++;
          console.log(`    ✓ ${result.quotes.length} providers, mid-market: ${result.midMarketRate}`);
        } else {
          failCorridors++;
          console.log(`    ✗ No data`);
        }

        corridorsProcessed++;
        if (corridorsProcessed % FLUSH_EVERY === 0 && allQuotes.length > 0) {
          writeQuotesAtomic(outputPath, allQuotes);
          console.log(`    [flushed ${allQuotes.length} quotes]`);
        }

        await jitteredDelay(DELAY_MS);
      }
    }
  } finally {
    await context.browser()?.close();
    if (allQuotes.length > 0) writeQuotesAtomic(outputPath, allQuotes);
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== Monito Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Corridors: ${successCorridors} success, ${failCorridors} failed`);
  console.log(`Unique providers: ${providersSeen.size}`);
  console.log(`Providers: ${[...providersSeen].sort().join(", ")}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
}

main().catch((err) => {
  console.error("Monito scraper failed:", err);
  process.exit(1);
});
