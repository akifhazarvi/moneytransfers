/**
 * Unplex Direct Scraper
 *
 * Unplex exposes a public currency-converter endpoint:
 *   POST https://unplex.money/api-payment/currency-converter
 *   body: { from, to, amount }
 *
 * The response carries Unplex's own quote inside `data.rateComparision.providers`
 * under `alias: "unplex"`. That entry has two receive amounts:
 *   - receivedAmount      → the first-time / promotional rate (capped at $100)
 *   - toOthersTransferAmount → the standard ongoing rate every user gets
 *
 * We surface the STANDARD rate (toOthersTransferAmount) so Unplex is comparable
 * to other providers and never claims an undeserved "Best Deal" off a promo
 * that doesn't apply at typical transfer sizes.
 *
 * Unplex serves India-only corridors today: USD/GBP/EUR/CAD → INR.
 */
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const API_URL = "https://unplex.money/api-payment/currency-converter";
const DELAY_MS = 1500;

const CORRIDORS = [
  { from: "USD", to: "INR" },
  { from: "GBP", to: "INR" },
  { from: "EUR", to: "INR" },
  { from: "CAD", to: "INR" },
];

const SEND_AMOUNTS = [100, 1000];

interface UnplexQuote {
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
  deliveryMethod: null;
  dateCollected: string;
  source: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUnplexQuote(
  from: string,
  to: string,
  amount: number
): Promise<UnplexQuote | null> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
      },
      body: JSON.stringify({ from, to, amount: String(amount) }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;

    const providers = data?.rateComparision?.providers;
    if (!Array.isArray(providers)) return null;

    const unplex = providers.find(
      (p: { alias?: string }) => p?.alias === "unplex"
    );
    const quote = unplex?.quotes?.[0];
    if (!quote) return null;

    // Standard ongoing rate (what everyone gets), NOT the first-time promo.
    const receiveAmount =
      typeof quote.toOthersTransferAmount === "number"
        ? quote.toOthersTransferAmount
        : quote.receivedAmount;
    if (!receiveAmount) return null;

    // Effective rate implied by the standard receive amount (Unplex charges no
    // fee, so rate = receiveAmount / sendAmount).
    const fee = quote.fee || 0;
    const exchangeRate = receiveAmount / (amount - fee);

    // Mid-market: the API's top-level `Currency` field is Unplex's headline
    // rate, not mid-market; leave mid-market to the unified index's XE table.
    return {
      provider: "Unplex",
      providerSlug: "unplex",
      providerType: "moneyTransferProvider",
      sendCurrency: from,
      receiveCurrency: to,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(exchangeRate * 10000) / 10000,
      midMarketRate: 0,
      markup: 0,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "unplex-api",
    };
  } catch (err) {
    console.log(`    ⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

async function main() {
  console.log("=== Unplex Direct Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allQuotes: UnplexQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    for (const amount of SEND_AMOUNTS) {
      console.log(`  Fetching: ${corridor.from} → ${corridor.to} ($${amount})...`);

      const quote = await fetchUnplexQuote(corridor.from, corridor.to, amount);

      if (quote) {
        allQuotes.push(quote);
        successCount++;
        console.log(
          `    ✓ Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}`
        );
      } else {
        failCount++;
        console.log(`    ✗ No data`);
      }

      await delay(DELAY_MS);
    }
  }

  const outputPath = path.join(OUTPUT_DIR, "unplex-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== Unplex Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
}

main().catch((err) => {
  console.error("Unplex scraper failed:", err);
  process.exit(1);
});
