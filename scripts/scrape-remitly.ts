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
import * as path from "path";
import {
  OUTPUT_DIR,
  SEND_AMOUNTS,
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";
import { carryForward, createDeadline, roundRate } from "./lib/scrape-budget";

// Remitly's calculator answers a share of requests with HTTP 429
// {"error_key":"NOT_ALLOWED"} and no Retry-After header — ~25-40% of them,
// largely regardless of pacing (measured 2026-09-26: ~30% at 1.5s spacing, and
// widening the gap adaptively only slowed the run without reducing 429s). The
// same request succeeds moments later. The old code waited 5s and gave up,
// losing USD→PHP, USD→MXN, GBP→INR and ~20 other corridors per run. Now a
// 429'd request goes to the back of the queue and the run keeps its pace; each
// corridor-amount gets up to MAX_ATTEMPTS tries.
const DELAY_MS = 1200;
const MAX_ATTEMPTS = 4;
// Stop fetching here and write what we have. CI's hard timeout sits above it.
const deadline = createDeadline("REMITLY_BUDGET_SEC", 400);
// A corridor-amount lost this run keeps its previous quote for up to this long.
const CARRY_FORWARD_HOURS = 30;

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
  { from: "EUR", to: "PKR", conduit: "DEU:EUR-PAK:PKR" },
  { from: "EUR", to: "MXN", conduit: "DEU:EUR-MEX:MXN" },
  { from: "EUR", to: "BDT", conduit: "DEU:EUR-BGD:BDT" },
  { from: "EUR", to: "GHS", conduit: "DEU:EUR-GHA:GHS" },
  { from: "EUR", to: "KES", conduit: "DEU:EUR-KEN:KES" },
  { from: "EUR", to: "BRL", conduit: "DEU:EUR-BRA:BRL" },
  { from: "EUR", to: "COP", conduit: "DEU:EUR-COL:COP" },
  { from: "EUR", to: "TRY", conduit: "DEU:EUR-TUR:TRY" },
  { from: "EUR", to: "MAD", conduit: "DEU:EUR-MAR:MAD" },
  { from: "CAD", to: "INR", conduit: "CAN:CAD-IND:INR" },
  { from: "CAD", to: "PHP", conduit: "CAN:CAD-PHL:PHP" },
  { from: "AUD", to: "INR", conduit: "AUS:AUD-IND:INR" },
  { from: "AUD", to: "PHP", conduit: "AUS:AUD-PHL:PHP" },
  { from: "AED", to: "INR", conduit: "ARE:AED-IND:INR" },
  { from: "AED", to: "PKR", conduit: "ARE:AED-PAK:PKR" },
  { from: "AED", to: "PHP", conduit: "ARE:AED-PHL:PHP" },
  { from: "AED", to: "BDT", conduit: "ARE:AED-BGD:BDT" },
  { from: "AED", to: "NGN", conduit: "ARE:AED-NGA:NGN" },
  { from: "AED", to: "EGP", conduit: "ARE:AED-EGY:EGP" },
  { from: "AED", to: "LKR", conduit: "ARE:AED-LKA:LKR" },
  // SAR, OMR and KWD send corridors removed 2026-09-26: the calculator answers
  // all 14 with HTTP 400 "unsupported corridor" — zero quotes across every run
  // checked — while costing ~40s of requests per run.
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type FetchResult =
  | { quote: ProviderQuote; reason?: undefined }
  | { quote: null; reason: "rate-limited" | "unsupported" | "error" };

async function fetchRemitlyQuote(
  from: string,
  to: string,
  conduit: string,
  amount: number
): Promise<FetchResult> {
  const url = `https://api.remitly.io/v3/calculator/estimate?conduit=${encodeURIComponent(conduit)}&anchor=SEND&amount=${amount}&purpose=OTHER&customer_segment=NON_CUSTOMER`;

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });

    if (res.status === 429) return { quote: null, reason: "rate-limited" };
    if (res.status === 400) return { quote: null, reason: "unsupported" };
    if (!res.ok) return { quote: null, reason: "error" };

    const json = await res.json();
    const estimate = json?.estimate;
    if (!estimate) return { quote: null, reason: "error" };

    // Prefer base_rate over promotional_exchange_rate: the promo is typically
    // "new customers only, capped at first $1,000" — using it as the headline
    // rate makes Remitly look more competitive than what a typical/repeat
    // user will actually receive. base_rate is what we want to compare.
    const baseRate = parseFloat(estimate.exchange_rate?.base_rate || "0");
    const rate = baseRate || parseFloat(estimate.exchange_rate?.promotional_exchange_rate || "0");
    const fee = parseFloat(estimate.fee?.total_fee_amount || "0");
    const sendAmount = parseFloat(estimate.send_amount || String(amount));
    const payInMethod = estimate.pay_in_method || null;
    const payOutMethod = estimate.pay_out_method || null;

    if (!rate) return { quote: null, reason: "error" };
    // Compute receive from base rate (Remitly's `receive_amount` field uses
    // the promo rate when present, so we can't reuse it here).
    const receiveAmount = (sendAmount - fee) * rate;

    return {
      quote: {
        provider: "Remitly",
        providerSlug: "remitly",
        providerType: "moneyTransferProvider",
        sendCurrency: from,
        receiveCurrency: to,
        sendAmount,
        fee: Math.round(fee * 100) / 100,
        exchangeRate: roundRate(rate),
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        paymentMethod: payInMethod === "BANK" ? "Bank Transfer" : payInMethod,
        deliveryMethod: payOutMethod || null,
        deliveryEstimate: null,
        dateCollected: new Date().toISOString(),
        source: "remitly-api",
      },
    };
  } catch (err) {
    console.log(`    ⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return { quote: null, reason: "error" };
  }
}

async function main() {
  console.log("=== Remitly Direct API Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}`);
  console.log(`Budget: ${deadline.budgetSec}s\n`);

  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const failures: Record<string, number> = {};
  const startTime = Date.now();

  // Corridors are listed in priority order (USD, GBP, EUR first), so if the
  // budget runs out it is the long tail that waits for the next run.
  const queue = CORRIDORS.flatMap((corridor) =>
    SEND_AMOUNTS.map((amount) => ({ corridor, amount, attempts: 0 }))
  );
  let deferred = 0;

  while (queue.length > 0 && !deadline.expired()) {
    const task = queue.shift()!;
    const { corridor, amount } = task;
    task.attempts++;
    const result = await fetchRemitlyQuote(corridor.from, corridor.to, corridor.conduit, amount);

    if (result.quote) {
      const quote = result.quote;
      allQuotes.push(quote);
      successCount++;
      console.log(`  ✓ ${corridor.from} → ${corridor.to} ($${amount}) Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}${task.attempts > 1 ? ` [attempt ${task.attempts}]` : ""}`);
    } else if (result.reason === "rate-limited" && task.attempts < MAX_ATTEMPTS) {
      deferred++;
      queue.push(task);
      console.log(`  ⚠ ${corridor.from} → ${corridor.to} ($${amount}) rate limited (429) — requeued, attempt ${task.attempts}/${MAX_ATTEMPTS}`);
    } else {
      const reason = result.reason ?? "error";
      failCount++;
      failures[reason] = (failures[reason] ?? 0) + 1;
      console.log(`  ✗ ${corridor.from} → ${corridor.to} ($${amount}) no data (${reason})`);
    }

    await delay(DELAY_MS);
  }

  if (queue.length > 0) {
    console.log(`\n⏱ Budget of ${deadline.budgetSec}s reached — ${queue.length} corridor-amounts not fetched.`);
  }
  console.log(`\n429s requeued: ${deferred}. Final failures by reason: ${JSON.stringify(failures)}`);

  const { rows, carried } = carryForward(
    path.join(OUTPUT_DIR, "remitly-quotes.json"),
    allQuotes,
    (q) => `${q.sendCurrency}_${q.receiveCurrency}_${q.sendAmount}`,
    CARRY_FORWARD_HOURS
  );
  if (carried > 0) console.log(`Carried forward ${carried} quotes (< ${CARRY_FORWARD_HOURS}h old) not refreshed this run.`);

  writeOutput("Remitly", "remitly", rows, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("Remitly scraper failed:", err);
  process.exit(1);
});
