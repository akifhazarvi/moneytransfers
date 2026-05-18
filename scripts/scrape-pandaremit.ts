/**
 * PandaRemit API Scraper
 *
 * PandaRemit exposes two unauthenticated prod endpoints:
 *
 *   GET  https://prod.pandaremit.com/web/ratefee/statistics/show/{FROM}/{TO}
 *        → currentRate.sellRate (their FX rate), bankRate (mid-market)
 *
 *   POST https://prod.pandaremit.com/web/ratefee/fee
 *        body: { sourceAmount, sourceCountry, sourceCurrency, targetCountry, targetCurrency }
 *        → model.defaultFee (canonical fee; model.fee may be 0 during promotions)
 *
 * PandaRemit specialises in CNY corridors — both sending TO China and FROM China.
 * The fee endpoint requires ISO country codes (e.g. "CHN", "USA").
 *
 * TLS note: prod.pandaremit.com sits behind Zscaler on corporate networks, which
 * presents a self-signed certificate that Node's bundled CA store rejects. On CI
 * (GitHub Actions) there is no Zscaler proxy, so TLS verifies fine. Locally we
 * disable verification to allow the scraper to run behind the proxy.
 */
import * as https from "https";
import {
  SEND_AMOUNTS,
  writeOutput,
  delay,
  type ProviderQuote,
} from "./lib/browser";

// Disable TLS verification only when behind a corporate MITM proxy (Zscaler).
// On CI / production runners this env var is not set and TLS is verified normally.
const tlsAgent = process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0"
  ? new https.Agent({ rejectUnauthorized: false })
  : undefined;

const BASE = "https://prod.pandaremit.com/web/ratefee";
const DELAY_MS = 800;

// ISO 3166-1 alpha-3 country code for each currency used in corridors below.
const COUNTRY_CODE: Record<string, string> = {
  CNY: "CHN",
  USD: "USA",
  GBP: "GBR",
  EUR: "DEU",
  AUD: "AUS",
  CAD: "CAN",
  JPY: "JPN",
  HKD: "HKG",
  KRW: "KOR",
  SGD: "SGP",
  THB: "THA",
  VND: "VNM",
  PHP: "PHL",
  MYR: "MYS",
  IDR: "IDN",
  NPR: "NPL",
};

// CNY as send currency (Chinese users sending abroad) +
// CNY as receive currency (diaspora sending to China)
const CORRIDORS: { from: string; to: string }[] = [
  // CNY → foreign (send from China)
  { from: "CNY", to: "USD" },
  { from: "CNY", to: "GBP" },
  { from: "CNY", to: "EUR" },
  { from: "CNY", to: "AUD" },
  { from: "CNY", to: "CAD" },
  { from: "CNY", to: "JPY" },
  { from: "CNY", to: "HKD" },
  { from: "CNY", to: "KRW" },
  { from: "CNY", to: "SGD" },
  { from: "CNY", to: "THB" },
  { from: "CNY", to: "VND" },
  { from: "CNY", to: "PHP" },
  { from: "CNY", to: "MYR" },
  { from: "CNY", to: "IDR" },
  { from: "CNY", to: "NPR" },
  // foreign → CNY (send to China)
  { from: "USD", to: "CNY" },
  { from: "GBP", to: "CNY" },
  { from: "EUR", to: "CNY" },
  { from: "AUD", to: "CNY" },
  { from: "CAD", to: "CNY" },
  { from: "JPY", to: "CNY" },
  { from: "HKD", to: "CNY" },
  { from: "KRW", to: "CNY" },
  { from: "SGD", to: "CNY" },
];

interface RateResponse {
  suc: boolean;
  model?: {
    currentRate?: {
      sellRate?: string;
      bankRate?: string;
    };
  };
}

interface FeeResponse {
  suc: boolean;
  model?: {
    fee?: string;
    defaultFee?: string;
  };
}

async function fetchRate(from: string, to: string): Promise<{ sellRate: number; bankRate: number } | null> {
  const url = `${BASE}/statistics/show/${from}/${to}`;
  try {
    const res = await fetch(url, {
      // @ts-expect-error — Node fetch accepts dispatcher/agent; not in DOM types
      agent: tlsAgent,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as RateResponse;
    if (!json.suc) return null;

    const sellRate = parseFloat(json.model?.currentRate?.sellRate ?? "");
    const bankRate = parseFloat(json.model?.currentRate?.bankRate ?? "");
    if (!sellRate || sellRate <= 0) return null;
    return { sellRate, bankRate: bankRate || 0 };
  } catch {
    return null;
  }
}

async function fetchFee(from: string, to: string, amount: number): Promise<number> {
  const fromCountry = COUNTRY_CODE[from];
  const toCountry = COUNTRY_CODE[to];
  if (!fromCountry || !toCountry) return 0;

  try {
    const res = await fetch(`${BASE}/fee`, {
      method: "POST",
      // @ts-expect-error — Node fetch accepts dispatcher/agent; not in DOM types
      agent: tlsAgent,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sourceAmount: amount,
        sourceCountry: fromCountry,
        sourceCurrency: from,
        targetCountry: toCountry,
        targetCurrency: to,
      }),
    });
    if (!res.ok) return 0;
    const json = (await res.json()) as FeeResponse;
    if (!json.suc) return 0;

    // defaultFee is the canonical fee; model.fee may be 0 during promotions
    const defaultFee = parseFloat(json.model?.defaultFee ?? "0") || 0;
    return Math.round(defaultFee * 100) / 100;
  } catch {
    return 0;
  }
}

async function main() {
  console.log("=== PandaRemit API Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const startTime = Date.now();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const { from, to } of CORRIDORS) {
    console.log(`  Fetching rate: ${from} → ${to}...`);

    const rateData = await fetchRate(from, to);
    if (!rateData) {
      console.log(`    ✗ No rate data`);
      failCount += SEND_AMOUNTS.length;
      await delay(DELAY_MS);
      continue;
    }

    console.log(`    Rate: ${rateData.sellRate} (mid: ${rateData.bankRate})`);

    for (const amount of SEND_AMOUNTS) {
      const fee = await fetchFee(from, to, amount);
      const effectiveSend = amount - fee;
      const receiveAmount = effectiveSend > 0 ? effectiveSend * rateData.sellRate : 0;

      if (receiveAmount <= 0) {
        failCount++;
        continue;
      }

      allQuotes.push({
        provider: "PandaRemit",
        providerSlug: "pandaremit",
        providerType: "moneyTransferProvider",
        sendCurrency: from,
        receiveCurrency: to,
        sendAmount: amount,
        fee: Math.round(fee * 100) / 100,
        exchangeRate: Math.round(rateData.sellRate * 10000) / 10000,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        paymentMethod: null,
        deliveryMethod: "Bank Deposit",
        deliveryEstimate: "Minutes",
        dateCollected: new Date().toISOString(),
        source: "pandaremit-api",
      });
      successCount++;

      await delay(300);
    }

    await delay(DELAY_MS);
  }

  writeOutput("PandaRemit", "pandaremit", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("PandaRemit scraper failed:", err);
  process.exit(1);
});
