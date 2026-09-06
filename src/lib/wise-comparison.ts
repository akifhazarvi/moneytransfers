/**
 * Wise comparison API — shared client.
 *
 * Extracted from scripts/scrape-wise-comparison.ts so the nightly scraper and
 * the live `/api/quotes/live` route parse the same payload with the same slug
 * and name maps. Duplicating them would have let the live view and the stored
 * history disagree about who a provider even is, which is the class of drift
 * this codebase has spent its time removing.
 *
 * One call returns 8-17 competing providers for a corridor in ~350ms, which is
 * what makes a genuinely live comparison affordable per request.
 */


/**
 * One normalised competitor quote. Structurally identical to the scrapers'
 * `ProviderQuote` in scripts/lib/browser.ts, redeclared here so this module
 * carries no dependency on scraper-side code (which pulls Playwright) and can
 * be imported by a serverless route.
 */
export interface WiseComparisonQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  paymentMethod: string | null;
  deliveryMethod: string | null;
  deliveryEstimate: string | null;
  dateCollected: string;
  source: string;
}

export const SLUG_NORMALIZE: Record<string, string> = {
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
export const NAME_OVERRIDES: Record<string, string> = {
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

export const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));
}

export function normalizeSlug(alias: string): string {
  return SLUG_NORMALIZE[alias] || alias;
}

export function normalizeName(alias: string, apiName: string): string {
  return NAME_OVERRIDES[alias] || apiName;
}

export function parseDuration(isoDuration: string | null | undefined): string | null {
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

export interface WiseQuote {
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

export interface WiseProvider {
  alias?: string;
  name?: string;
  type?: string;
  quotes?: WiseQuote[];
}

export interface WiseResponse {
  providers?: WiseProvider[];
}

export function extractAllQuotes(
  data: WiseResponse,
  from: string,
  to: string,
  amount: number,
  sourceCountry: string
): WiseComparisonQuote[] {
  const providers = data.providers;
  if (!Array.isArray(providers)) return [];

  const quotes: WiseComparisonQuote[] = [];

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

export async function fetchComparison(
  from: string,
  to: string,
  country: string,
  amount: number
): Promise<WiseComparisonQuote[]> {
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

