/**
 * TapTap Send API Scraper
 *
 * TapTap Send exposes a public API at https://api.taptapsend.com/api/fxRates
 * and a partner endpoint at https://api.taptapsend.com/api/fxRates/partners.
 * Both return corridor exchange rates with fee schedules in a single call, so
 * no browser automation is needed.
 *
 * Public response shape:
 *   { availableCountries: [{ isoCountryCode, currency, corridors: [{ currency, fxRate, feeSchedule? }] }] }
 * Partner response shape adds payoutMethods[] and renames the fee fields:
 *   feeSchedule → transferFeeSchedule, tier.minValue → tier.minTransferAmount.
 *
 * Tiered fees: { tiers: [{ fee: "0.99", minValue: "0.00" }, { fee: "0.00", minValue: "125.00" }] }
 * means $0.99 fee under 125, $0 at 125+.
 * Flat fees: { type: "standard", flatFee: "1.99" } (a few add feePercent/maxFee)
 * means $1.99 at every amount. Until 2026-09-29 only tiers were read, so every
 * flat schedule priced at $0 — USD→INR ($1.99), GBP→INR (£0.99), CAD→INR,
 * AED→INR (AED 5) and ~36 more pairs overstated what TapTap delivers.
 *
 * Partner API configuration:
 * - TAPTAP_PARTNER_API_KEY: enables partner mode (Authorization: Bearer <key>)
 * - TAPTAP_FX_RATES_URL: override endpoint if needed
 */
import {
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

// Wider per-amount coverage than the shared SEND_AMOUNTS — TapTap's API
// returns every corridor in a single HTTP call, so adding amounts costs
// essentially nothing. Denser amount buckets let the unified-quote layer
// snap to a real per-amount fee instead of falling back to corridor-wide.
const TAPTAP_SEND_AMOUNTS = [100, 250, 500, 1000, 2500, 5000, 10000];

type ProcessWithLoadEnvFile = NodeJS.Process & {
  loadEnvFile?: (path?: string) => void;
};

// Local dev only — CI injects TAPTAP_PARTNER_API_KEY via workflow env.
// loadEnvFile throws ENOENT (not a no-op) when the file is missing.
try { (process as ProcessWithLoadEnvFile).loadEnvFile?.(".env.local"); } catch {}

import { sendCurrencies, currencies } from "../src/data/transfer-currencies";
import countryCodes from "../src/data/scraped/country-codes.json";
import currencyCodes from "../src/data/scraped/currency-codes.json";
import { roundRate } from "./lib/scrape-budget";

// --- Which destination represents a currency? ---------------------------------
// TapTap prices per DESTINATION COUNTRY, but our quotes are keyed by currency
// pair. One origin sends USD to ~15 countries (AUD→USD: 0.70 Liberia, 0.69
// Ecuador, 0.63 Vietnam), EUR to every eurozone member plus Georgia and Türkiye,
// XOF/XAF to eight and six CFA states. Emitting all of them wrote up to 25
// conflicting rows per key (5,054 duplicates) and the merge layer kept whichever
// came first. We now emit ONE row per pair: a destination where the currency is
// the official one (never USD-cash-in-Vietnam standing in for "to the USA"), at
// the lower median rate when several qualify (CFA states differ by up to 3.6%).
const normName = (n: string) => n.toLowerCase().replace(/[^a-z]/g, "");
const alpha2ByName = new Map(
  (countryCodes as { country: string; alpha2: string }[]).map((c) => [normName(c.country), c.alpha2])
);
const OFFICIAL_CURRENCIES = new Map<string, Set<string>>();
for (const row of currencyCodes as { country: string; code?: string }[]) {
  const a2 = alpha2ByName.get(normName(row.country));
  if (!a2 || !row.code) continue;
  if (!OFFICIAL_CURRENCIES.has(a2)) OFFICIAL_CURRENCIES.set(a2, new Set());
  OFFICIAL_CURRENCIES.get(a2)!.add(row.code);
}
// The bundled ISO 4217 list predates Venezuela's VES redenomination.
OFFICIAL_CURRENCIES.get("VE")?.add("VES");

/**
 * Relative error implied by how many decimals TapTap published the rate with.
 * "0.002" (HUF→EUR, true 0.00274) can be off by 25%; "0.09" (NOK→USD, true
 * 0.105) by 5.6%. Those rows landed 14–27% away from mid-market.
 */
const MAX_PUBLISHED_PRECISION_ERROR = 0.01;
function publishedPrecisionError(fxRate: string): number {
  const value = parseFloat(fxRate);
  if (!value) return Infinity;
  const decimals = fxRate.includes(".") ? fxRate.split(".")[1].length : 0;
  return (0.5 * 10 ** -decimals) / value;
}

const TRACKED_SEND = new Set(sendCurrencies.map((c) => c.code));
const TRACKED_RECEIVE = new Set(currencies.map((c) => c.code));

interface FeeTier {
  fee: string;
  minValue?: string;
  minTransferAmount?: string;
}

interface FeeSchedule {
  type: string;
  tiers?: FeeTier[];
  flatFee?: string;
  feePercent?: string;
  maxFee?: string;
}

interface FxCorridor {
  isoCountryCode: string;
  countryDisplayName: string;
  currency: string;
  currencyScale: number;
  fxRate: string;
  feeSchedule?: FeeSchedule;
  transferFeeSchedule?: FeeSchedule;
}

interface FxOriginCountry {
  isoCountryCode: string;
  countryDisplayName: string;
  currency: string;
  corridors: FxCorridor[];
}

interface FxRatesResponse {
  availableCountries: FxOriginCountry[];
}

const DEFAULT_PUBLIC_FX_RATES_URL = "https://api.taptapsend.com/api/fxRates";
const DEFAULT_PARTNER_FX_RATES_URL =
  "https://api.taptapsend.com/api/fxRates/partners";
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

interface TapTapApiConfig {
  headers: Record<string, string>;
  isPartner: boolean;
  source: string;
  url: string;
}

function getApiConfig(): TapTapApiConfig {
  const partnerApiKey = process.env.TAPTAP_PARTNER_API_KEY?.trim() || "";
  const explicitUrl = process.env.TAPTAP_FX_RATES_URL?.trim() || "";
  const isPartner =
    explicitUrl.includes("/partners") ||
    (!explicitUrl && partnerApiKey.length > 0);
  const url =
    explicitUrl ||
    (isPartner ? DEFAULT_PARTNER_FX_RATES_URL : DEFAULT_PUBLIC_FX_RATES_URL);

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": DEFAULT_USER_AGENT,
  };

  if (isPartner) {
    if (!partnerApiKey) {
      throw new Error(
        "Partner endpoint requires TAPTAP_PARTNER_API_KEY in env."
      );
    }
    headers.Authorization = `Bearer ${partnerApiKey}`;
  } else {
    headers["Appian-Version"] = "web/2022-05-03.0";
    headers["X-Device-Id"] = "web";
    headers["X-Device-Model"] = "web";
  }

  return {
    headers,
    isPartner,
    source: isPartner ? "taptapsend-partner-api" : "taptapsend-api",
    url,
  };
}

function extractAvailableCountries(payload: unknown): FxOriginCountry[] {
  if (Array.isArray(payload)) return payload as FxOriginCountry[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.availableCountries)) {
    return record.availableCountries as FxOriginCountry[];
  }

  if (record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    if (Array.isArray(nested.availableCountries)) {
      return nested.availableCountries as FxOriginCountry[];
    }
    if (Array.isArray(nested.countries)) {
      return nested.countries as FxOriginCountry[];
    }
  }

  if (Array.isArray(record.countries)) {
    return record.countries as FxOriginCountry[];
  }
  if (Array.isArray(record.originCountries)) {
    return record.originCountries as FxOriginCountry[];
  }

  return [];
}

async function fetchFxRates(config: TapTapApiConfig): Promise<FxRatesResponse> {
  const response = await fetch(config.url, { headers: config.headers });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const bodyPreview = body.trim().slice(0, 300);
    throw new Error(
      `TapTap returned ${response.status} ${response.statusText}${bodyPreview ? `: ${bodyPreview}` : ""}`
    );
  }

  const payload = (await response.json()) as unknown;
  const availableCountries = extractAvailableCountries(payload);

  if (availableCountries.length === 0) {
    const topLevelKeys =
      payload && typeof payload === "object"
        ? Object.keys(payload as Record<string, unknown>).join(", ")
        : typeof payload;
    throw new Error(
      `TapTap response did not contain available countries. Top-level keys: ${topLevelKeys || "(none)"}`
    );
  }

  return { availableCountries };
}

function tierMin(tier: FeeTier): number {
  return parseFloat(tier.minTransferAmount ?? tier.minValue ?? "0") || 0;
}

/** Schedules with a shape we cannot price — logged so a format change shows in CI. */
const unreadSchedules: string[] = [];

function getFeeForAmount(
  schedule: FeeSchedule | undefined,
  sendAmount: number
): number {
  if (!schedule) return 0;
  if (!schedule.tiers?.length) {
    const flat = parseFloat(schedule.flatFee ?? "");
    const pct = parseFloat(schedule.feePercent ?? "");
    if (Number.isNaN(flat) && Number.isNaN(pct)) {
      if (unreadSchedules.length < 5) unreadSchedules.push(JSON.stringify(schedule));
      return 0;
    }
    let fee = (flat || 0) + (sendAmount * (pct || 0)) / 100;
    const max = parseFloat(schedule.maxFee ?? "");
    if (max > 0) fee = Math.min(fee, max);
    return fee;
  }

  const tiers = [...schedule.tiers].sort((a, b) => tierMin(a) - tierMin(b));
  let fee = parseFloat(tiers[0].fee) || 0;
  for (const tier of tiers) {
    if (sendAmount >= tierMin(tier)) {
      fee = parseFloat(tier.fee) || 0;
    }
  }
  return fee;
}

async function main() {
  const apiConfig = getApiConfig();

  console.log("=== TapTap Send API Scraper ===");
  console.log(`Endpoint: ${apiConfig.url} (${apiConfig.isPartner ? "partner" : "public"})`);
  console.log(`Amounts: ${TAPTAP_SEND_AMOUNTS.join(", ")}\n`);

  const startTime = Date.now();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;

  const data = await fetchFxRates(apiConfig);
  console.log(`Received data for ${data.availableCountries.length} origin countries\n`);

  // Dedupe origin currencies — multiple eurozone countries share EUR rates.
  // Keep the first origin we see per send currency.
  const originBySendCurrency = new Map<string, FxOriginCountry>();
  for (const origin of data.availableCountries) {
    if (!TRACKED_SEND.has(origin.currency)) continue;
    if (!originBySendCurrency.has(origin.currency)) {
      originBySendCurrency.set(origin.currency, origin);
    }
  }

  const sendCurrenciesCovered = [...originBySendCurrency.keys()].sort();
  console.log(`Send currencies covered: ${sendCurrenciesCovered.join(", ")}\n`);

  const dropped = { noHomeDestination: 0, coarseRate: 0 };

  for (const [sendCurrency, origin] of originBySendCurrency) {
    let corridorCount = 0;

    const byCurrency = new Map<string, FxCorridor[]>();
    for (const corridor of origin.corridors) {
      const receiveCurrency = corridor.currency;
      if (!TRACKED_RECEIVE.has(receiveCurrency)) continue;
      if (sendCurrency === receiveCurrency) continue;
      if (!(parseFloat(corridor.fxRate) > 0)) continue;
      if (!byCurrency.has(receiveCurrency)) byCurrency.set(receiveCurrency, []);
      byCurrency.get(receiveCurrency)!.push(corridor);
    }

    for (const [receiveCurrency, destinations] of byCurrency) {
      const home = destinations.filter((d) =>
        OFFICIAL_CURRENCIES.get(d.isoCountryCode)?.has(receiveCurrency)
      );
      if (home.length === 0) {
        dropped.noHomeDestination++;
        continue;
      }
      const precise = home.filter(
        (d) => publishedPrecisionError(d.fxRate) <= MAX_PUBLISHED_PRECISION_ERROR
      );
      if (precise.length === 0) {
        dropped.coarseRate++;
        continue;
      }
      precise.sort((a, b) => parseFloat(a.fxRate) - parseFloat(b.fxRate));
      const corridor = precise[Math.floor((precise.length - 1) / 2)];
      const rate = parseFloat(corridor.fxRate);

      const schedule = corridor.transferFeeSchedule ?? corridor.feeSchedule;

      for (const amount of TAPTAP_SEND_AMOUNTS) {
        const fee = getFeeForAmount(schedule, amount);
        const effectiveSend = amount - fee;
        const receiveAmount = effectiveSend > 0 ? effectiveSend * rate : 0;
        if (receiveAmount <= 0) {
          failCount++;
          continue;
        }

        allQuotes.push({
          provider: "TapTap Send",
          providerSlug: "taptap-send",
          providerType: "moneyTransferProvider",
          sendCurrency,
          receiveCurrency,
          receiveCountry: corridor.isoCountryCode,
          sendAmount: amount,
          fee: Math.round(fee * 100) / 100,
          exchangeRate: roundRate(rate),
          receiveAmount: Math.round(receiveAmount * 100) / 100,
          paymentMethod: null,
          deliveryEstimate: null,
          deliveryMethod: null,
          dateCollected: new Date().toISOString(),
          source: apiConfig.source,
        });
        successCount++;
      }
      corridorCount++;
    }
    console.log(`${sendCurrency} (${origin.isoCountryCode}): ${corridorCount} corridors`);
  }

  console.log(
    `\nSkipped currency pairs — no destination where it is the official currency: ${dropped.noHomeDestination}; ` +
    `rate published too coarsely (>${MAX_PUBLISHED_PRECISION_ERROR * 100}%): ${dropped.coarseRate}`
  );
  if (unreadSchedules.length) {
    console.warn(`\nWARN fee schedules with no tiers and no flatFee/feePercent, priced at $0:\n  ${unreadSchedules.join("\n  ")}`);
  }
  console.log(`\nTotal quotes: ${successCount} success, ${failCount} failed`);
  writeOutput("TapTap Send", "taptapsend", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("TapTap Send scraper failed:", err);
  process.exit(1);
});
