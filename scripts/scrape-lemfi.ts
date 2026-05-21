/**
 * LemFi Direct Scraper
 *
 * LemFi exposes a public exchange endpoint that returns a rate string scaled
 * by a per-response divisor derived from the response ID. The actual rate is:
 *
 *   rate = parseFloat(data.rate) / parseInt(digitsOnly(data.ID), 10)
 *
 * This matches LemFi's own frontend logic (Nuxt bundle p3yR4q58.js, function
 * `bt(rate, id)` which strips non-digits from the ID and divides). Without
 * this step the rate string is a meaningless 20+ digit scaled integer.
 *
 * The endpoint does not take an amount, so the scraper records the rate plus
 * the published `transaction_fee` / `min_transaction_amount`. Receive amounts
 * are computed at $100 and $1000 send amounts (matching other scrapers).
 */
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const ENDPOINT = "https://lemfi.com/api/lemonade/v2/exchange";
const DELAY_MS = 500;

// Each sender_country needs to match LemFi's accepted display name exactly.
const SENDER_COUNTRIES: Record<string, string> = {
  USD: "United States",
  GBP: "United Kingdom",
  CAD: "Canada",
  EUR: "Germany",
  AUD: "Australia",
  NZD: "New Zealand",
};

// Probe LemFi's remittance corridors. Lemfi-targeted destinations (African
// diaspora + South Asia + a few LATAM). Corridors where Lemfi returns an
// error are filtered out — the scraper is self-cleaning.
const CORRIDORS: { from: string; to: string }[] = [];
const SEND_CCYS = ["USD", "GBP", "CAD", "EUR", "AUD", "NZD"];
const RECV_CCYS = [
  "EUR", "GBP", "INR", "NGN", "PHP", "PKR", "BDT", "KES", "GHS",
  "UGX", "TZS", "ZAR", "MXN", "BRL", "CAD", "USD", "AUD", "NZD",
  "XOF", "XAF", "RWF", "ETB", "MAD", "EGP",
];
for (const from of SEND_CCYS) {
  for (const to of RECV_CCYS) {
    if (from === to) continue;
    CORRIDORS.push({ from, to });
  }
}

const SEND_AMOUNTS = [100, 1000];

interface LemfiQuote {
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

// LemFi's rate is encoded as a BigInt-scaled string. Decoder mirrors
// the frontend's `bt(rate, ID)`: strip non-digits from the ID, then
// `rate / scale`. Both sides can exceed Number.MAX_SAFE_INTEGER, so we
// parse them as floats — the result is always a sensible FX rate.
function decodeRate(rateStr: string, idStr: string): number {
  const scaleStr = (idStr || "").replace(/\D/g, "");
  if (!scaleStr) return 0;
  const rate = parseFloat(rateStr);
  const scale = parseFloat(scaleStr);
  if (!Number.isFinite(rate) || !Number.isFinite(scale) || scale <= 0) return 0;
  return rate / scale;
}

interface MidMarketRatesFile {
  baseCurrency: string;
  rates: Record<string, number>;
}

function loadMidMarketRates(): Record<string, number> | null {
  const p = path.join(OUTPUT_DIR, "xe-midmarket-rates.json");
  if (!fs.existsSync(p)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf-8")) as MidMarketRatesFile;
    return data.rates || null;
  } catch {
    return null;
  }
}

function getMidMarketRate(
  from: string,
  to: string,
  rates: Record<string, number> | null,
): number {
  if (!rates) return 0;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return 0;
  return toRate / fromRate;
}

async function fetchLemfiQuote(
  from: string,
  to: string,
): Promise<{ rate: number; fee: number; minAmount: number } | null> {
  const senderCountry = SENDER_COUNTRIES[from];
  if (!senderCountry) return null;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Origin: "https://lemfi.com",
        Referer: "https://lemfi.com/",
      },
      body: JSON.stringify({
        from,
        to,
        sender_country: senderCountry,
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (json?.error || !json?.data) return null;

    const rate = decodeRate(json.data.rate, json.data.ID);
    if (!rate || !Number.isFinite(rate) || rate <= 0) return null;

    return {
      rate,
      fee: Number(json.data.transaction_fee) || 0,
      minAmount: Number(json.data.min_transaction_amount) || 0,
    };
  } catch (err) {
    console.log(`    ⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

async function main() {
  console.log("=== LemFi Direct Scraper ===\n");
  console.log(`Corridors to probe: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const midRates = loadMidMarketRates();

  const allQuotes: LemfiQuote[] = [];
  let successCount = 0;
  let skippedCount = 0;
  const supportedCorridors = new Set<string>();
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    const quote = await fetchLemfiQuote(corridor.from, corridor.to);

    if (!quote) {
      skippedCount++;
      await delay(DELAY_MS);
      continue;
    }

    supportedCorridors.add(`${corridor.from}->${corridor.to}`);
    const midMarketRate = getMidMarketRate(corridor.from, corridor.to, midRates);
    const markup = midMarketRate > 0
      ? Math.round(((midMarketRate - quote.rate) / midMarketRate) * 10000) / 100
      : 0;

    for (const amount of SEND_AMOUNTS) {
      // Skip amounts below LemFi's published minimum for this corridor.
      if (quote.minAmount > 0 && amount < quote.minAmount) continue;

      const receiveAmount = (amount - quote.fee) * quote.rate;
      allQuotes.push({
        provider: "LemFi",
        providerSlug: "lemfi",
        providerType: "moneyTransferProvider",
        sendCurrency: corridor.from,
        receiveCurrency: corridor.to,
        sendAmount: amount,
        fee: Math.round(quote.fee * 100) / 100,
        exchangeRate: Math.round(quote.rate * 1000000) / 1000000,
        midMarketRate: midMarketRate || 0,
        markup,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        paymentMethod: null,
        deliveryEstimate: "Minutes to 1 business day",
        deliveryMethod: null,
        dateCollected: new Date().toISOString(),
        source: "lemfi-api",
      });
      successCount++;
    }

    console.log(
      `  ✓ ${corridor.from} → ${corridor.to}: rate=${quote.rate.toFixed(4)}, fee=${quote.fee}, markup=${markup}%`,
    );

    await delay(DELAY_MS);
  }

  const outputPath = path.join(OUTPUT_DIR, "lemfi-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== LemFi Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Supported corridors: ${supportedCorridors.size} / ${CORRIDORS.length}`);
  console.log(`Quotes written: ${successCount}, corridors skipped: ${skippedCount}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
}

main().catch((err) => {
  console.error("LemFi scraper failed:", err);
  process.exit(1);
});
