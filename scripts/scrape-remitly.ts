/**
 * Remitly Direct API Scraper
 *
 * Remitly has a public calculator API at api.remitly.io/v3/calculator/estimate.
 * Conduit format: {ISO3_COUNTRY}:{ISO3_CURRENCY}-{ISO3_COUNTRY}:{ISO3_CURRENCY}
 * Example: USA:USD-IND:INR
 *
 * No browser needed — pure fetch, fast and reliable.
 *
 * Response includes: exchange_rate (base + promotional), fee, receive_amount,
 * pay_in_method, pay_out_method, and promo disclaimer.
 */
import {
  SEND_AMOUNTS,
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

const DELAY_MS = 1000;

const CORRIDORS = [
  { from: "USD", to: "INR", conduit: "USA:USD-IND:INR" },
  { from: "USD", to: "PHP", conduit: "USA:USD-PHL:PHP" },
  { from: "USD", to: "MXN", conduit: "USA:USD-MEX:MXN" },
  { from: "USD", to: "NGN", conduit: "USA:USD-NGA:NGN" },
  { from: "USD", to: "PKR", conduit: "USA:USD-PAK:PKR" },
  { from: "USD", to: "BDT", conduit: "USA:USD-BGD:BDT" },
  { from: "USD", to: "GHS", conduit: "USA:USD-GHA:GHS" },
  { from: "USD", to: "KES", conduit: "USA:USD-KEN:KES" },
  { from: "USD", to: "BRL", conduit: "USA:USD-BRA:BRL" },
  { from: "USD", to: "COP", conduit: "USA:USD-COL:COP" },
  { from: "USD", to: "GTQ", conduit: "USA:USD-GTM:GTQ" },
  { from: "USD", to: "EUR", conduit: "USA:USD-DEU:EUR" },
  { from: "USD", to: "GBP", conduit: "USA:USD-GBR:GBP" },
  { from: "USD", to: "VND", conduit: "USA:USD-VNM:VND" },
  { from: "USD", to: "IDR", conduit: "USA:USD-IDN:IDR" },
  { from: "USD", to: "THB", conduit: "USA:USD-THA:THB" },
  { from: "USD", to: "ZAR", conduit: "USA:USD-ZAF:ZAR" },
  { from: "GBP", to: "INR", conduit: "GBR:GBP-IND:INR" },
  { from: "GBP", to: "NGN", conduit: "GBR:GBP-NGA:NGN" },
  { from: "GBP", to: "PKR", conduit: "GBR:GBP-PAK:PKR" },
  { from: "GBP", to: "PHP", conduit: "GBR:GBP-PHL:PHP" },
  { from: "GBP", to: "EUR", conduit: "GBR:GBP-DEU:EUR" },
  { from: "EUR", to: "INR", conduit: "DEU:EUR-IND:INR" },
  { from: "EUR", to: "NGN", conduit: "DEU:EUR-NGA:NGN" },
  { from: "EUR", to: "PHP", conduit: "DEU:EUR-PHL:PHP" },
  { from: "EUR", to: "GBP", conduit: "DEU:EUR-GBR:GBP" },
  { from: "CAD", to: "INR", conduit: "CAN:CAD-IND:INR" },
  { from: "CAD", to: "PHP", conduit: "CAN:CAD-PHL:PHP" },
  { from: "AUD", to: "INR", conduit: "AUS:AUD-IND:INR" },
  { from: "AUD", to: "PHP", conduit: "AUS:AUD-PHL:PHP" },
  { from: "AED", to: "INR", conduit: "ARE:AED-IND:INR" },
  { from: "AED", to: "PKR", conduit: "ARE:AED-PAK:PKR" },
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRemitlyQuote(
  from: string,
  to: string,
  conduit: string,
  amount: number
): Promise<ProviderQuote | null> {
  const url = `https://api.remitly.io/v3/calculator/estimate?conduit=${encodeURIComponent(conduit)}&anchor=SEND&amount=${amount}&purpose=OTHER&customer_segment=NON_CUSTOMER`;

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      if (res.status === 429) {
        // Rate limited — wait and return null (will be retried)
        console.log(`    ⚠ Rate limited (429), backing off...`);
        await delay(5000);
      }
      return null;
    }

    const json = await res.json();
    const estimate = json?.estimate;
    if (!estimate) return null;

    const baseRate = parseFloat(estimate.exchange_rate?.base_rate || "0");
    const promoRate = parseFloat(estimate.exchange_rate?.promotional_exchange_rate || "0");
    const rate = promoRate > 0 ? promoRate : baseRate;
    const fee = parseFloat(estimate.fee?.total_fee_amount || "0");
    const receiveAmount = parseFloat(estimate.receive_amount || "0");
    const sendAmount = parseFloat(estimate.send_amount || String(amount));
    const payInMethod = estimate.pay_in_method || null;
    const payOutMethod = estimate.pay_out_method || null;

    if (!rate && !receiveAmount) return null;

    return {
      provider: "Remitly",
      providerSlug: "remitly",
      providerType: "moneyTransferProvider",
      sendCurrency: from,
      receiveCurrency: to,
      sendAmount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(rate * 10000) / 10000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: payInMethod === "BANK" ? "Bank Transfer" : payInMethod,
      deliveryMethod: payOutMethod || null,
      deliveryEstimate: null,
      dateCollected: new Date().toISOString(),
      source: "remitly-api",
    };
  } catch (err) {
    console.log(`    ⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

async function main() {
  console.log("=== Remitly Direct API Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    console.log(`\n📍 ${corridor.from} → ${corridor.to}`);

    for (const amount of SEND_AMOUNTS) {
      console.log(`  Fetching: ${corridor.from} → ${corridor.to} ($${amount})...`);

      const quote = await fetchRemitlyQuote(corridor.from, corridor.to, corridor.conduit, amount);

      if (quote) {
        allQuotes.push(quote);
        successCount++;
        console.log(`    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}`);
      } else {
        failCount++;
        console.log(`    ✗ No data`);
      }

      await delay(DELAY_MS);
    }
  }

  writeOutput("Remitly", "remitly", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("Remitly scraper failed:", err);
});
