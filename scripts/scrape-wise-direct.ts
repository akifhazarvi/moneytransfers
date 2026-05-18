/**
 * Wise Direct Quote Scraper
 *
 * Uses Wise's public comparison API v4 to extract Wise's own first-party quotes.
 * This gives fee, rate, delivery estimate, and receive amount data.
 *
 * Fallback chain:
 *   1. Comparison API v4 (primary — fast, reliable, includes fee data)
 *   2. Comparison API v3 (if v4 returns no Wise entry)
 *   3. Live rates API (mid-market rate only, no fee info)
 *
 * Note: scrape-providers.ts also uses this API but extracts ALL providers.
 * This scraper focuses only on the Wise entry for priority-1 direct quotes.
 */
import {
  SEND_AMOUNTS,
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

const DELAY_MS = 800;

const CORRIDORS = [
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "IDR" }, { from: "USD", to: "MXN" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "BDT" },
  { from: "USD", to: "GHS" }, { from: "USD", to: "KES" },
  { from: "USD", to: "BRL" }, { from: "USD", to: "COP" },
  { from: "USD", to: "EUR" }, { from: "USD", to: "GBP" },
  { from: "USD", to: "JPY" }, { from: "USD", to: "CNY" },
  { from: "USD", to: "BRL" }, { from: "USD", to: "ZAR" },
  { from: "USD", to: "AED" }, { from: "USD", to: "GTQ" },
  { from: "USD", to: "VND" }, { from: "USD", to: "TRY" },
  { from: "USD", to: "MAD" }, { from: "USD", to: "MYR" },
  { from: "USD", to: "FJD" }, { from: "USD", to: "NPR" },
  { from: "USD", to: "LKR" }, { from: "USD", to: "EGP" },
  { from: "USD", to: "ETB" }, { from: "USD", to: "THB" },
  { from: "USD", to: "PEN" }, { from: "USD", to: "UGX" },
  { from: "USD", to: "TZS" }, { from: "USD", to: "JMD" },
  { from: "USD", to: "DOP" }, { from: "USD", to: "XOF" },
  { from: "USD", to: "PLN" }, { from: "USD", to: "RON" },
  { from: "USD", to: "TWD" }, { from: "USD", to: "CZK" },
  { from: "USD", to: "HUF" }, { from: "USD", to: "ILS" },
  { from: "USD", to: "RWF" }, { from: "USD", to: "ZMW" },
  { from: "USD", to: "XAF" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "NGN" }, { from: "GBP", to: "PKR" },
  { from: "GBP", to: "PHP" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "NGN" }, { from: "EUR", to: "PHP" },
  { from: "EUR", to: "PKR" }, { from: "EUR", to: "MXN" },
  { from: "EUR", to: "BDT" }, { from: "EUR", to: "GHS" },
  { from: "EUR", to: "KES" }, { from: "EUR", to: "BRL" },
  { from: "EUR", to: "COP" }, { from: "EUR", to: "TRY" },
  { from: "EUR", to: "MAD" }, { from: "EUR", to: "LKR" },
  { from: "CAD", to: "INR" }, { from: "CAD", to: "PHP" },
  { from: "AUD", to: "INR" }, { from: "AUD", to: "PHP" },
  { from: "AED", to: "INR" }, { from: "AED", to: "PKR" },
  { from: "AED", to: "PHP" }, { from: "AED", to: "BDT" },
  { from: "AED", to: "NGN" }, { from: "AED", to: "EGP" },
  { from: "AED", to: "NPR" }, { from: "AED", to: "LKR" },
  { from: "AED", to: "IDR" }, { from: "AED", to: "KES" },
  { from: "SAR", to: "INR" }, { from: "SAR", to: "PKR" },
  { from: "SAR", to: "PHP" }, { from: "SAR", to: "BDT" },
  { from: "SAR", to: "NGN" }, { from: "SAR", to: "EGP" },
  { from: "SAR", to: "IDR" }, { from: "SAR", to: "NPR" },
  { from: "OMR", to: "INR" }, { from: "OMR", to: "PKR" },
  { from: "OMR", to: "PHP" }, { from: "OMR", to: "BDT" },
  { from: "OMR", to: "NGN" }, { from: "OMR", to: "EGP" },
  { from: "KWD", to: "INR" }, { from: "KWD", to: "PKR" },
  { from: "KWD", to: "PHP" }, { from: "KWD", to: "BDT" },
  { from: "KWD", to: "NGN" }, { from: "KWD", to: "EGP" },
  { from: "BHD", to: "INR" }, { from: "BHD", to: "PKR" },
  { from: "BHD", to: "PHP" }, { from: "BHD", to: "BDT" },
  { from: "QAR", to: "INR" }, { from: "QAR", to: "PKR" },
  { from: "QAR", to: "PHP" }, { from: "QAR", to: "BDT" },
  { from: "SGD", to: "INR" }, { from: "SGD", to: "PHP" },
  { from: "NZD", to: "INR" }, { from: "NZD", to: "PHP" },
  { from: "CHF", to: "INR" }, { from: "CHF", to: "EUR" },
  { from: "HKD", to: "INR" }, { from: "HKD", to: "PHP" },
  { from: "JPY", to: "INR" }, { from: "JPY", to: "PHP" },
  { from: "KRW", to: "INR" }, { from: "KRW", to: "PHP" },
  { from: "CNY", to: "USD" }, { from: "CNY", to: "EUR" },
  { from: "CNY", to: "GBP" }, { from: "CNY", to: "AUD" },
  { from: "CNY", to: "SGD" }, { from: "CNY", to: "JPY" },
  { from: "CNY", to: "HKD" }, { from: "CNY", to: "KRW" },
  { from: "CNY", to: "INR" }, { from: "CNY", to: "PHP" },
  { from: "CNY", to: "MYR" }, { from: "CNY", to: "THB" },
  { from: "CNY", to: "NZD" }, { from: "CNY", to: "CAD" },
  { from: "CNY", to: "CHF" }, { from: "CNY", to: "NOK" },
  { from: "CNY", to: "SEK" }, { from: "CNY", to: "DKK" },
  { from: "CNY", to: "PLN" }, { from: "CNY", to: "CZK" },
  { from: "CNY", to: "HUF" }, { from: "CNY", to: "RON" },
  { from: "CNY", to: "ILS" }, { from: "CNY", to: "TRY" },
  { from: "CNY", to: "AED" }, { from: "CNY", to: "SAR" },
  { from: "CNY", to: "KWD" }, { from: "CNY", to: "QAR" },
  { from: "CNY", to: "BHD" }, { from: "CNY", to: "OMR" },
  { from: "CNY", to: "BDT" }, { from: "CNY", to: "PKR" },
  { from: "CNY", to: "NGN" }, { from: "CNY", to: "KES" },
  { from: "CNY", to: "GHS" }, { from: "CNY", to: "ZAR" },
  { from: "CNY", to: "BRL" }, { from: "CNY", to: "MXN" },
  { from: "CNY", to: "COP" }, { from: "CNY", to: "VND" },
  { from: "CNY", to: "IDR" }, { from: "CNY", to: "NPR" },
  { from: "CNY", to: "LKR" }, { from: "CNY", to: "EGP" },
];

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US", GBP: "GB", EUR: "DE", CAD: "CA", AUD: "AU",
  AED: "AE", SGD: "SG", NZD: "NZ",
  SAR: "SA", OMR: "OM", KWD: "KW", BHD: "BH", QAR: "QA",
  CHF: "CH", HKD: "HK", JPY: "JP", KRW: "KR",
  INR: "IN", PHP: "PH", MXN: "MX", NGN: "NG", PKR: "PK",
  BDT: "BD", CNY: "CN", BRL: "BR", KES: "KE", GHS: "GH",
  ZAR: "ZA", COP: "CO", GTQ: "GT", VND: "VN", TRY: "TR",
  MAD: "MA", MYR: "MY", IDR: "ID", FJD: "FJ", NPR: "NP",
  LKR: "LK", EGP: "EG", ETB: "ET", THB: "TH", PEN: "PE",
  UGX: "UG", TZS: "TZ", JMD: "JM", DOP: "DO", XOF: "SN",
  PLN: "PL", RON: "RO", TWD: "TW", CZK: "CZ", HUF: "HU",
  ILS: "IL", RWF: "RW", ZMW: "ZM", XAF: "CM",
};

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function makeQuote(
  from: string, to: string, sendAmount: number,
  fee: number, rate: number, receiveAmount: number,
  deliveryEstimate: string | null, source: string
): ProviderQuote {
  return {
    provider: "Wise",
    providerSlug: "wise",
    providerType: "moneyTransferProvider",
    sendCurrency: from,
    receiveCurrency: to,
    sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: Math.round(receiveAmount * 100) / 100,
    paymentMethod: null,
    deliveryEstimate,
    deliveryMethod: null,
    dateCollected: new Date().toISOString(),
    source,
  };
}

/**
 * Extract Wise's own quote from comparison API response.
 * Works for both v3 and v4 response shapes.
 */
function extractWiseQuote(
  data: Record<string, unknown>,
  from: string,
  to: string,
  amount: number,
  apiVersion: string
): ProviderQuote | null {
  const providers = data.providers as Array<{
    alias?: string;
    name?: string;
    quotes?: Array<{
      fee?: number;
      rate?: number;
      receivedAmount?: number;
      sendAmount?: number | null;
      sourceCountry?: string | null;
      deliveryEstimation?: {
        duration?: { min?: string; max?: string } | null;
        deliveryDate?: { min?: string; max?: string } | null;
        providerGivesEstimate?: boolean;
      };
    }>;
  }>;

  if (!Array.isArray(providers)) return null;

  // Find Wise — try multiple alias patterns
  const wiseProvider = providers.find(
    (p) =>
      p.alias === "wise" ||
      p.alias === "transferwise" ||
      (p.name && p.name.toLowerCase() === "wise")
  );

  if (!wiseProvider?.quotes?.length) return null;

  // Prefer the quote with a matching sourceCountry (country-specific, more accurate)
  // over the generic quote with sourceCountry: null
  const sourceCountry = CURRENCY_TO_COUNTRY[from];
  const q =
    wiseProvider.quotes.find((quote) => quote.sourceCountry === sourceCountry) ??
    wiseProvider.quotes[0];
  const fee = q.fee ?? 0;
  const rate = q.rate ?? 0;
  const receiveAmount = q.receivedAmount ?? 0;

  if (!receiveAmount || !rate) return null;

  // Parse delivery from duration or delivery date
  let deliveryEstimate: string | null = null;
  const dur = q.deliveryEstimation?.duration;
  if (dur?.max) {
    deliveryEstimate = parseDuration(dur.max);
  } else if (q.deliveryEstimation?.deliveryDate?.max) {
    try {
      deliveryEstimate = new Date(q.deliveryEstimation.deliveryDate.max)
        .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    } catch {
      // Ignore
    }
  }

  return makeQuote(from, to, amount, fee, rate, receiveAmount, deliveryEstimate, `wise-direct-${apiVersion}`);
}

/**
 * Primary: Wise comparison API v4.
 * Includes Wise's own quote with fee, rate, receive amount, delivery.
 */
async function fetchV4(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  try {
    const sourceCountry = CURRENCY_TO_COUNTRY[from] || "US";
    const params = new URLSearchParams({
      sendAmount: String(amount),
      sourceCurrency: from,
      targetCurrency: to,
      sourceCountry,
      includeWise: "true",
      payInMethod: "DIRECT_DEBIT",
    });
    const res = await fetch(`https://wise.com/gateway/v4/comparisons?${params}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return extractWiseQuote(await res.json(), from, to, amount, "api-v4");
  } catch {
    return null;
  }
}

/**
 * Fallback 1: Wise comparison API v3 (simpler params).
 */
async function fetchV3(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  try {
    const params = new URLSearchParams({
      sourceCurrency: from,
      targetCurrency: to,
      sendAmount: String(amount),
    });
    const res = await fetch(`https://wise.com/gateway/v3/comparisons?${params}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return extractWiseQuote(await res.json(), from, to, amount, "api-v3");
  } catch {
    return null;
  }
}

/**
 * Fallback 2: Live rates API (mid-market rate, no fee data).
 */
async function fetchLiveRate(from: string, to: string, amount: number): Promise<ProviderQuote | null> {
  try {
    const res = await fetch(`https://wise.com/rates/live?source=${from}&target=${to}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = parseFloat(String(data.value || "0"));
    if (!rate) return null;
    return makeQuote(from, to, amount, 0, rate, amount * rate, null, "wise-direct-live-rate");
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Wise Direct API Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    console.log(`\n📍 ${corridor.from} → ${corridor.to}`);

    for (const amount of SEND_AMOUNTS) {
      try {
        console.log(`  Fetching: ${corridor.from} → ${corridor.to} ($${amount})...`);

        // Try v4 first (most complete data)
        let quote = await fetchV4(corridor.from, corridor.to, amount);

        // Fallback to v3
        if (!quote) {
          console.log(`    → Trying v3 API fallback...`);
          quote = await fetchV3(corridor.from, corridor.to, amount);
        }

        // Last resort: live rate (no fee info)
        if (!quote) {
          console.log(`    → Trying live rates fallback...`);
          quote = await fetchLiveRate(corridor.from, corridor.to, amount);
        }

        if (quote) {
          allQuotes.push(quote);
          successCount++;
          console.log(
            `    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount} [${quote.source}]`
          );
        } else {
          failCount++;
          console.log(`    ✗ No data`);
        }
      } catch (err) {
        failCount++;
        console.log(`    ✗ Error: ${err instanceof Error ? err.message : String(err)}`);
      }

      await delay(DELAY_MS);
    }
  }

  writeOutput("Wise", "wise-direct", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("Wise direct scraper failed:", err);
  // Don't exit(1) — partial data is still written by writeOutput
});
