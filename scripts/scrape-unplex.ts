/**
 * Unplex Direct Scraper
 *
 * Unplex exposes a public currency-converter endpoint:
 *   POST https://unplex.money/api-payment/currency-converter
 *   body: { from, to, amount }
 *
 * Unplex's per-unit rates live at the TOP LEVEL of `data` (present for every
 * corridor, including PHP where Unplex isn't in its own provider-comparison
 * list):
 *   - data.BlendedRate → the effective standard rate a typical sender gets.
 *     This is what we compare on (per Unplex). Falls back to data.Currency.
 *   - data.Currency → the visible headline rate (≈ BlendedRate, slightly lower).
 *   - data.FirstTimeRate + data.FirstTimeTransferLimit → an enhanced first-
 *     transfer rate applying only up to a per-corridor cap ($100 INR, $500 PHP).
 *
 * The comparison rate is always the standard (Blended) rate, so we never
 * overstate what a sender receives. The first-time promo is carried as metadata
 * for the UI to MENTION as a badge, not baked into the comparison rate.
 *
 * (Earlier bug: we used quote.toOthersTransferAmount — a COMPETITOR-comparison
 * figure, not Unplex's rate — which understated Unplex.)
 *
 * Unplex corridors today: USD/GBP/EUR/CAD → INR and → PHP.
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
  { from: "USD", to: "PHP" },
  { from: "GBP", to: "PHP" },
  { from: "EUR", to: "PHP" },
  { from: "CAD", to: "PHP" },
];

// One amount per corridor, chosen ABOVE every promo cap ($100 INR, $500 PHP) so
// BlendedRate reflects the true standard rate, not the promo-inflated rate the
// API returns at small amounts. The promo is captured separately as metadata.
const SEND_AMOUNTS = [1000];

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
    // NOTE: don't bail on data.Enabled === false — Unplex returns valid rates
    // for corridors flagged Enabled:false (it reflects geo-default state, not
    // whether the corridor is served). We gate on the rate fields instead.

    const num = (v: unknown): number | null => {
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v === "string") { const n = parseFloat(v); return Number.isFinite(n) ? n : null; }
      return null;
    };

    // Unplex's per-unit rate fields live at the TOP LEVEL of `data` and are
    // present for every corridor (including PHP, where Unplex isn't listed in
    // its own rateComparision.providers array). Per Unplex, BlendedRate is the
    // effective standard rate a typical sender receives; Currency is the
    // visible headline. We use BlendedRate, falling back to Currency.
    const blended = num(data.BlendedRate);
    const headline = num(data.Currency);
    const standardRate = blended ?? headline;
    if (!standardRate || standardRate <= 0) return null;

    // First-time promo: a higher rate applying only up to a per-corridor send
    // cap (FirstTimeTransferLimit — $100 for INR, $500 for PHP, etc.).
    const firstTimeRate = num(data.FirstTimeRate) ?? num(data.PromotionalTransferRate);
    const firstTimeLimit =
      typeof data.FirstTimeTransferLimit === "number"
        ? data.FirstTimeTransferLimit
        : null;

    // Unplex charges no transfer fee on these corridors.
    const unplex = Array.isArray(data?.rateComparision?.providers)
      ? data.rateComparision.providers.find((p: { alias?: string }) => p?.alias === "unplex")
      : null;
    const fee = unplex?.quotes?.[0]?.fee || 0;

    // ALWAYS store the standard rate as the comparison quote — it's the rate a
    // sender actually gets at any amount, so it never overstates the receive
    // amount. The first-time promo is carried as metadata (firstTimeRate/
    // firstTimeLimit) for the UI to MENTION, rather than baked into the
    // comparison rate where the engine would scale it past its cap.
    const exchangeRate = standardRate;
    const receiveAmount = standardRate * (amount - fee);

    // Mid-market is left to the unified index's XE table (these are Unplex's
    // own rates, not mid-market).
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
