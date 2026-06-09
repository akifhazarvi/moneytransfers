/**
 * Unplex Direct Scraper
 *
 * Unplex exposes a public currency-converter endpoint:
 *   POST https://unplex.money/api-payment/currency-converter
 *   body: { from, to, amount }
 *
 * The response carries Unplex's own quote inside `data.rateComparision.providers`
 * under `alias: "unplex"`. Rate fields:
 *   - quote.receivedAmount / quote.rate → Unplex's STANDARD rate, matching the
 *     top-level `data.Currency` headline. This is what every customer gets.
 *   - quote.toOthersTransferAmount → a competitor-comparison figure, NOT
 *     Unplex's own rate. (Using it understated Unplex — the original bug.)
 *   - data.FirstTimeRate + data.FirstTimeTransferLimit → an enhanced first-
 *     transfer rate that applies only up to a small send cap (~$100).
 *
 * We surface the STANDARD rate at normal amounts, and the FIRST-TIME promo
 * rate only when the send amount is within the cap (so we never overstate what
 * a sender actually receives). Promo metadata is carried through so the UI can
 * mention it.
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
  /** Unplex's enhanced first-transfer rate (applies up to firstTimeLimit). */
  firstTimeRate: number | null;
  /** Max send amount (in send currency) the first-time rate applies to. */
  firstTimeLimit: number | null;
  /** True when this quote's receiveAmount was computed using the promo rate. */
  isPromoRate: boolean;
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

    // Unplex's STANDARD rate. `receivedAmount` (and the quote's `rate`) match
    // Unplex's own headline `data.Currency` rate — this is what every customer
    // actually gets. (`toOthersTransferAmount` is a competitor-comparison
    // figure, NOT Unplex's rate — using it understated us, which is the bug
    // Prashanth reported.)
    const standardReceive = quote.receivedAmount;
    if (!standardReceive) return null;

    // First-time promo: a higher rate that applies only up to a small send
    // cap (FirstTimeTransferLimit, ~$100). data.FirstTimeRate is per-unit.
    const firstTimeRate =
      typeof data.FirstTimeRate === "string"
        ? parseFloat(data.FirstTimeRate)
        : typeof data.FirstTimeRate === "number"
          ? data.FirstTimeRate
          : (data.PromotionalTransferRate ?? null);
    const firstTimeLimit =
      typeof data.FirstTimeTransferLimit === "number"
        ? data.FirstTimeTransferLimit
        : null;

    const fee = quote.fee || 0;

    // ALWAYS store the standard rate as the comparison quote — it's the rate a
    // sender actually gets at any amount, so it never overstates the receive
    // amount. The first-time promo is carried as metadata (firstTimeRate/
    // firstTimeLimit) for the UI to MENTION, rather than baked into the
    // comparison rate where the engine would scale it past its $100 cap.
    const receiveAmount = standardReceive;
    const exchangeRate = receiveAmount / (amount - fee);

    // Mid-market is left to the unified index's XE table (data.Currency is
    // Unplex's own rate, not mid-market).
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
      firstTimeRate: firstTimeRate != null ? Math.round(firstTimeRate * 10000) / 10000 : null,
      firstTimeLimit,
      isPromoRate: false, // comparison rate is always the standard rate
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
