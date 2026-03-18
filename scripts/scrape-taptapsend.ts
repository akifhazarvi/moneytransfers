/**
 * TapTap Send API Scraper
 *
 * TapTap Send exposes a public API at https://api.taptapsend.com/api/fxRates
 * that returns all corridors with exchange rates and fee schedules in a single
 * call. No browser automation needed.
 *
 * The fxRates response structure:
 *   { availableCountries: [{ isoCountryCode, currency, corridors: [{ isoCountryCode, currency, fxRate, feeSchedule? }] }] }
 *
 * Fee schedule (when present) is tiered:
 *   { type: "tiered", tiers: [{ fee: "0.99", minValue: "0.00" }, { fee: "0.00", minValue: "125.00" }] }
 *   Meaning: fee is 0.99 for sends under 125, and 0 for sends >= 125.
 *
 * Strategy: Fetch fxRates API → match corridors → compute quotes for each SEND_AMOUNT.
 */
import {
  OUTPUT_DIR,
  SEND_AMOUNTS,
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

// Map from send currency to the origin country ISO code used in the API.
// For EUR we pick Germany (DE) as a representative; all EUR countries share the same rates.
const CURRENCY_TO_ORIGIN_ISO: Record<string, string> = {
  USD: "US",
  GBP: "GB",
  EUR: "DE",
  CAD: "CA",
  AUD: "AU",
  AED: "AE",
  SAR: "SA",
  SGD: "SG",
};

// Corridors we care about — must match currencies our platform tracks
const CORRIDORS = [
  // From USD
  { from: "USD", to: "INR" },
  { from: "USD", to: "PHP" },
  { from: "USD", to: "IDR" },
  { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" },
  { from: "USD", to: "BDT" },
  { from: "USD", to: "GHS" },
  { from: "USD", to: "KES" },
  { from: "USD", to: "MXN" },
  { from: "USD", to: "COP" },
  { from: "USD", to: "BRL" },
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  // From GBP
  { from: "GBP", to: "INR" },
  { from: "GBP", to: "NGN" },
  { from: "GBP", to: "PKR" },
  { from: "GBP", to: "GHS" },
  { from: "GBP", to: "KES" },
  { from: "GBP", to: "BDT" },
  { from: "GBP", to: "PHP" },
  { from: "GBP", to: "EUR" },
  // From EUR
  { from: "EUR", to: "NGN" },
  { from: "EUR", to: "GHS" },
  { from: "EUR", to: "KES" },
  { from: "EUR", to: "INR" },
  { from: "EUR", to: "GBP" },
  { from: "EUR", to: "PHP" },
  // From CAD
  { from: "CAD", to: "INR" },
  { from: "CAD", to: "PHP" },
  // From AUD
  { from: "AUD", to: "INR" },
  { from: "AUD", to: "PHP" },
  // From AED
  { from: "AED", to: "INR" },
  { from: "AED", to: "PKR" },
  // From SAR
  { from: "SAR", to: "INR" },
  { from: "SAR", to: "PKR" },
  { from: "SAR", to: "BDT" },
  { from: "SAR", to: "PHP" },
  // From SGD
  { from: "SGD", to: "INR" },
  { from: "SGD", to: "PHP" },
  { from: "SGD", to: "BDT" },
];

interface FxCorridor {
  isoCountryCode: string;
  countryDisplayName: string;
  currency: string;
  currencyScale: number;
  fxRate: string;
  feeSchedule?: {
    type: string;
    tiers: Array<{ fee: string; minValue: string }>;
  };
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

/**
 * Determine the fee for a given send amount based on a tiered fee schedule.
 * Tiers are sorted ascending by minValue; the highest tier whose minValue <= amount applies.
 */
function getFeeForAmount(
  feeSchedule: FxCorridor["feeSchedule"],
  sendAmount: number
): number {
  if (!feeSchedule || !feeSchedule.tiers || feeSchedule.tiers.length === 0) {
    return 0; // No fee schedule means $0 fee (TapTap Send default)
  }

  // Sort tiers by minValue ascending
  const tiers = [...feeSchedule.tiers].sort(
    (a, b) => parseFloat(a.minValue) - parseFloat(b.minValue)
  );

  let fee = parseFloat(tiers[0].fee) || 0;
  for (const tier of tiers) {
    if (sendAmount >= parseFloat(tier.minValue)) {
      fee = parseFloat(tier.fee) || 0;
    }
  }
  return fee;
}

async function main() {
  console.log("=== TapTap Send API Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const startTime = Date.now();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;

  // Fetch rates from the public API
  console.log("Fetching rates from api.taptapsend.com/api/fxRates ...");
  const response = await fetch("https://api.taptapsend.com/api/fxRates", {
    headers: {
      "Appian-Version": "web/2022-05-03.0",
      "X-Device-Id": "web",
      "X-Device-Model": "web",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    console.error(`API request failed: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const data: FxRatesResponse = await response.json();
  console.log(
    `Received data for ${data.availableCountries.length} origin countries\n`
  );

  // Build a lookup: originISO -> { destCurrency -> FxCorridor }
  const rateMap = new Map<string, Map<string, FxCorridor>>();
  for (const origin of data.availableCountries) {
    const destMap = new Map<string, FxCorridor>();
    for (const corridor of origin.corridors) {
      destMap.set(corridor.currency, corridor);
    }
    rateMap.set(origin.isoCountryCode, destMap);
  }

  for (const corridor of CORRIDORS) {
    const originISO = CURRENCY_TO_ORIGIN_ISO[corridor.from];
    if (!originISO) {
      console.log(`  Skipping ${corridor.from} -> ${corridor.to}: no origin ISO mapping`);
      failCount += SEND_AMOUNTS.length;
      continue;
    }

    const destMap = rateMap.get(originISO);
    if (!destMap) {
      console.log(`  Skipping ${corridor.from} -> ${corridor.to}: origin ${originISO} not in API`);
      failCount += SEND_AMOUNTS.length;
      continue;
    }

    const fxCorridor = destMap.get(corridor.to);
    if (!fxCorridor) {
      console.log(`  Skipping ${corridor.from} -> ${corridor.to}: destination currency not found`);
      failCount += SEND_AMOUNTS.length;
      continue;
    }

    const rate = parseFloat(fxCorridor.fxRate);
    if (!rate || rate <= 0) {
      console.log(`  Skipping ${corridor.from} -> ${corridor.to}: invalid rate ${fxCorridor.fxRate}`);
      failCount += SEND_AMOUNTS.length;
      continue;
    }

    console.log(`${corridor.from} -> ${corridor.to}: rate=${rate}`);

    for (const amount of SEND_AMOUNTS) {
      const fee = getFeeForAmount(fxCorridor.feeSchedule, amount);
      const effectiveSend = amount - fee;
      const receiveAmount = effectiveSend > 0 ? effectiveSend * rate : 0;

      if (receiveAmount <= 0) {
        console.log(`    $${amount}: fee=${fee} exceeds send amount, skipping`);
        failCount++;
        continue;
      }

      const quote: ProviderQuote = {
        provider: "TapTap Send",
        providerSlug: "taptap-send",
        providerType: "moneyTransferProvider",
        sendCurrency: corridor.from,
        receiveCurrency: corridor.to,
        sendAmount: amount,
        fee: Math.round(fee * 100) / 100,
        exchangeRate: Math.round(rate * 10000) / 10000,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        deliveryEstimate: null,
        deliveryMethod: null,
        dateCollected: new Date().toISOString(),
        source: "taptapsend-api",
      };

      allQuotes.push(quote);
      successCount++;
      console.log(
        `    $${amount}: fee=${fee}, receive=${quote.receiveAmount} ${corridor.to}`
      );
    }
  }

  writeOutput("TapTap Send", "taptapsend", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("TapTap Send scraper failed:", err);
  process.exit(1);
});
