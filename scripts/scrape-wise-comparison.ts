/**
 * Wise Comparison API Scraper — ALL Providers
 *
 * Uses Wise's public comparison API v4 to extract quotes from ALL providers
 * (not just Wise). This is a pure REST API — no browser automation needed.
 *
 * Returns 8-18 providers per corridor including banks (Chase, Wells Fargo,
 * HSBC, Barclays, etc.) and transfer providers (Remitly, OFX, Xoom, etc.).
 *
 * Source priority: 2 (same as Monito — these are Wise-estimated competitor rates)
 *
 * Output: src/data/scraped/wise-comparison-quotes.json
 */
import {
  SEND_AMOUNTS,
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

const DELAY_MS = 600;

// Comprehensive corridor list — includes all Wise-direct corridors plus extras
const CORRIDORS: { from: string; to: string; country: string }[] = [
  // USD corridors (major remittance + developed)
  { from: "USD", to: "INR", country: "US" },
  { from: "USD", to: "PHP", country: "US" },
  { from: "USD", to: "MXN", country: "US" },
  { from: "USD", to: "NGN", country: "US" },
  { from: "USD", to: "PKR", country: "US" },
  { from: "USD", to: "BDT", country: "US" },
  { from: "USD", to: "GHS", country: "US" },
  { from: "USD", to: "KES", country: "US" },
  { from: "USD", to: "BRL", country: "US" },
  { from: "USD", to: "COP", country: "US" },
  { from: "USD", to: "EUR", country: "US" },
  { from: "USD", to: "GBP", country: "US" },
  { from: "USD", to: "JPY", country: "US" },
  { from: "USD", to: "CNY", country: "US" },
  { from: "USD", to: "ZAR", country: "US" },
  { from: "USD", to: "AED", country: "US" },
  { from: "USD", to: "GTQ", country: "US" },
  { from: "USD", to: "VND", country: "US" },
  { from: "USD", to: "TRY", country: "US" },
  { from: "USD", to: "MAD", country: "US" },
  { from: "USD", to: "IDR", country: "US" },
  { from: "USD", to: "THB", country: "US" },
  { from: "USD", to: "EGP", country: "US" },
  { from: "USD", to: "ETB", country: "US" },
  { from: "USD", to: "LKR", country: "US" },
  { from: "USD", to: "NPR", country: "US" },
  { from: "USD", to: "PEN", country: "US" },
  { from: "USD", to: "DOP", country: "US" },
  { from: "USD", to: "JMD", country: "US" },
  { from: "USD", to: "UGX", country: "US" },
  { from: "USD", to: "TZS", country: "US" },
  { from: "USD", to: "XOF", country: "US" },
  { from: "USD", to: "PLN", country: "US" },
  { from: "USD", to: "RON", country: "US" },
  { from: "USD", to: "CZK", country: "US" },
  { from: "USD", to: "HUF", country: "US" },

  // GBP corridors (richest — 18 providers including UK banks)
  { from: "GBP", to: "INR", country: "GB" },
  { from: "GBP", to: "EUR", country: "GB" },
  { from: "GBP", to: "NGN", country: "GB" },
  { from: "GBP", to: "PKR", country: "GB" },
  { from: "GBP", to: "PHP", country: "GB" },
  { from: "GBP", to: "USD", country: "GB" },
  { from: "GBP", to: "BDT", country: "GB" },
  { from: "GBP", to: "GHS", country: "GB" },
  { from: "GBP", to: "KES", country: "GB" },
  { from: "GBP", to: "ZAR", country: "GB" },
  { from: "GBP", to: "AED", country: "GB" },
  { from: "GBP", to: "PLN", country: "GB" },
  { from: "GBP", to: "TRY", country: "GB" },
  { from: "GBP", to: "AUD", country: "GB" },
  { from: "GBP", to: "CAD", country: "GB" },
  { from: "GBP", to: "NZD", country: "GB" },

  // EUR corridors
  { from: "EUR", to: "INR", country: "DE" },
  { from: "EUR", to: "GBP", country: "DE" },
  { from: "EUR", to: "NGN", country: "DE" },
  { from: "EUR", to: "PHP", country: "DE" },
  { from: "EUR", to: "PKR", country: "DE" },
  { from: "EUR", to: "USD", country: "DE" },
  { from: "EUR", to: "BRL", country: "DE" },
  { from: "EUR", to: "COP", country: "DE" },
  { from: "EUR", to: "TRY", country: "DE" },
  { from: "EUR", to: "PLN", country: "DE" },

  // CAD corridors
  { from: "CAD", to: "INR", country: "CA" },
  { from: "CAD", to: "PHP", country: "CA" },
  { from: "CAD", to: "NGN", country: "CA" },
  { from: "CAD", to: "PKR", country: "CA" },
  { from: "CAD", to: "GBP", country: "CA" },
  { from: "CAD", to: "EUR", country: "CA" },
  { from: "CAD", to: "USD", country: "CA" },

  // AUD corridors (10 providers including AU banks)
  { from: "AUD", to: "INR", country: "AU" },
  { from: "AUD", to: "PHP", country: "AU" },
  { from: "AUD", to: "GBP", country: "AU" },
  { from: "AUD", to: "EUR", country: "AU" },
  { from: "AUD", to: "USD", country: "AU" },
  { from: "AUD", to: "NZD", country: "AU" },
  { from: "AUD", to: "IDR", country: "AU" },
  { from: "AUD", to: "VND", country: "AU" },
  { from: "AUD", to: "CNY", country: "AU" },
  { from: "AUD", to: "THB", country: "AU" },

  // AED corridors (Gulf remittances)
  { from: "AED", to: "INR", country: "AE" },
  { from: "AED", to: "PKR", country: "AE" },
  { from: "AED", to: "PHP", country: "AE" },
  { from: "AED", to: "BDT", country: "AE" },
  { from: "AED", to: "NGN", country: "AE" },
  { from: "AED", to: "EGP", country: "AE" },
  { from: "AED", to: "LKR", country: "AE" },
  { from: "AED", to: "NPR", country: "AE" },

  // SAR corridors (Saudi remittances)
  { from: "SAR", to: "INR", country: "SA" },
  { from: "SAR", to: "PKR", country: "SA" },
  { from: "SAR", to: "PHP", country: "SA" },
  { from: "SAR", to: "BDT", country: "SA" },
  { from: "SAR", to: "EGP", country: "SA" },
  { from: "SAR", to: "IDR", country: "SA" },

  // SGD corridors
  { from: "SGD", to: "INR", country: "SG" },
  { from: "SGD", to: "PHP", country: "SG" },
  { from: "SGD", to: "MYR", country: "SG" },
  { from: "SGD", to: "IDR", country: "SG" },

  // NZD corridors
  { from: "NZD", to: "INR", country: "NZ" },
  { from: "NZD", to: "PHP", country: "NZ" },
  { from: "NZD", to: "GBP", country: "NZ" },
  { from: "NZD", to: "AUD", country: "NZ" },

  // CHF corridors
  { from: "CHF", to: "INR", country: "CH" },
  { from: "CHF", to: "EUR", country: "CH" },

  // HKD corridors
  { from: "HKD", to: "INR", country: "HK" },
  { from: "HKD", to: "PHP", country: "HK" },

  // JPY corridors
  { from: "JPY", to: "INR", country: "JP" },
  { from: "JPY", to: "PHP", country: "JP" },

  // KRW corridors
  { from: "KRW", to: "INR", country: "KR" },
  { from: "KRW", to: "PHP", country: "KR" },
];

// Slug aliases to normalize Wise's provider aliases to our slugs
const SLUG_NORMALIZE: Record<string, string> = {
  "world-remit": "worldremit",
  "western-union": "western-union",
  "xe-money-transfer": "xe",
  "xe-money-transfer-fx": "xe",
  taptapsend: "taptap-send",
  "tap-tap-send": "taptap-send",
  "ria-money-transfer": "ria",
  "ria-financial": "ria",
  money_gram: "moneygram",
  "money-gram": "moneygram",
  "revolut-money-transfer": "revolut",
  "bank-of-america": "bank-of-america",
  "wells-fargo": "wells-fargo",
  "td-bank": "td-bank",
  "santander-uk": "santander",
  "commonwealth-bank-of-australia": "commonwealth-bank",
  "national-australia-bank": "nab",
  "hsbc-australia": "hsbc",
  "starling-bank": "starling",
  "deutsche-bank": "deutsche-bank",
};

// Provider name overrides (Wise sometimes uses long names)
const NAME_OVERRIDES: Record<string, string> = {
  "commonwealth-bank-of-australia": "Commonwealth Bank",
  "national-australia-bank": "NAB",
  "hsbc-australia": "HSBC",
  "santander-uk": "Santander",
  "starling-bank": "Starling Bank",
  "deutsche-bank": "Deutsche Bank",
  "bank-of-america": "Bank of America",
  "wells-fargo": "Wells Fargo",
  "td-bank": "TD Bank",
};

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));
}

function normalizeSlug(alias: string): string {
  return SLUG_NORMALIZE[alias] || alias;
}

function normalizeName(alias: string, apiName: string): string {
  return NAME_OVERRIDES[alias] || apiName;
}

function parseDuration(isoDuration: string | null | undefined): string | null {
  if (!isoDuration) return null;
  const match = isoDuration.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  const d = parseInt(match[1] || "0");
  const h = parseInt(match[2] || "0");
  const m = parseInt(match[3] || "0");
  if (d > 0 && h > 0) return `${d}d ${h}h`;
  if (d > 0) return `${d} day${d > 1 ? "s" : ""}`;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h} hour${h > 1 ? "s" : ""}`;
  if (m > 0) return `${m} min`;
  return "Instant";
}

interface WiseQuote {
  fee?: number;
  rate?: number;
  receivedAmount?: number;
  sendAmount?: number | null;
  sourceCountry?: string | null;
  markup?: number;
  deliveryEstimation?: {
    duration?: { min?: string; max?: string } | null;
    deliveryDate?: { min?: string; max?: string } | null;
    providerGivesEstimate?: boolean;
  };
}

interface WiseProvider {
  alias?: string;
  name?: string;
  type?: string;
  quotes?: WiseQuote[];
}

interface WiseResponse {
  providers?: WiseProvider[];
}

function extractAllQuotes(
  data: WiseResponse,
  from: string,
  to: string,
  amount: number,
  sourceCountry: string
): ProviderQuote[] {
  const providers = data.providers;
  if (!Array.isArray(providers)) return [];

  const quotes: ProviderQuote[] = [];

  for (const provider of providers) {
    const alias = provider.alias || "";
    const name = provider.name || alias;
    const providerType = provider.type || "moneyTransferProvider";

    if (!provider.quotes?.length) continue;

    // Prefer country-specific quote, fallback to first
    const q =
      provider.quotes.find((quote) => quote.sourceCountry === sourceCountry) ??
      provider.quotes[0];

    const fee = q.fee ?? 0;
    const rate = q.rate ?? 0;
    const receiveAmount = q.receivedAmount ?? 0;

    if (!receiveAmount || !rate) continue;

    // Parse delivery estimate
    let deliveryEstimate: string | null = null;
    const dur = q.deliveryEstimation?.duration;
    if (dur?.max) {
      deliveryEstimate = parseDuration(dur.max);
    } else if (q.deliveryEstimation?.deliveryDate?.max) {
      try {
        deliveryEstimate = new Date(q.deliveryEstimation.deliveryDate.max)
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
      } catch {
        // ignore
      }
    }

    const slug = normalizeSlug(alias);

    // Skip Wise itself — we get that from wise-direct scraper at priority 1
    if (slug === "wise" || alias === "wise" || alias === "transferwise") continue;

    quotes.push({
      provider: normalizeName(alias, name),
      providerSlug: slug,
      providerType: providerType,
      sendCurrency: from,
      receiveCurrency: to,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(rate * 10000) / 10000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryMethod: null,
      deliveryEstimate,
      dateCollected: new Date().toISOString(),
      source: "wise-comparison-api",
    });
  }

  return quotes;
}

async function fetchComparison(
  from: string,
  to: string,
  country: string,
  amount: number
): Promise<ProviderQuote[]> {
  const params = new URLSearchParams({
    sendAmount: String(amount),
    sourceCurrency: from,
    targetCurrency: to,
    sourceCountry: country,
    includeWise: "false",
    payInMethod: "DIRECT_DEBIT",
  });

  const res = await fetch(
    `https://wise.com/gateway/v4/comparisons?${params}`,
    { headers: HEADERS, signal: AbortSignal.timeout(15000) }
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as WiseResponse;
  return extractAllQuotes(data, from, to, amount, country);
}

async function main() {
  console.log("=== Wise Comparison API Scraper (All Providers) ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const allQuotes: ProviderQuote[] = [];
  const providersSeen = new Set<string>();
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    console.log(`\n📍 ${corridor.from} → ${corridor.to}`);

    for (const amount of SEND_AMOUNTS) {
      try {
        const quotes = await fetchComparison(
          corridor.from,
          corridor.to,
          corridor.country,
          amount
        );

        if (quotes.length > 0) {
          allQuotes.push(...quotes);
          successCount++;
          for (const q of quotes) providersSeen.add(q.providerSlug);
          console.log(
            `  $${amount}: ${quotes.length} providers — ${quotes.map((q) => q.providerSlug).join(", ")}`
          );
        } else {
          failCount++;
          console.log(`  $${amount}: no providers`);
        }
      } catch (err) {
        failCount++;
        console.log(
          `  $${amount}: error — ${err instanceof Error ? err.message : String(err)}`
        );
      }

      await delay(DELAY_MS);
    }
  }

  console.log(`\n📊 Unique providers discovered: ${providersSeen.size}`);
  console.log(`   ${[...providersSeen].sort().join(", ")}`);

  writeOutput(
    "Wise Comparison (All Providers)",
    "wise-comparison",
    allQuotes,
    startTime,
    successCount,
    failCount
  );
}

main().catch((err) => {
  console.error("Wise comparison scraper failed:", err);
});
