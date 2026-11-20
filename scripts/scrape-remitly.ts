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
 *
 * Fallback: Remitly's partner Pricing API (GET prices.remitly.com/v2/prices,
 * key issued to us 2026-11-20, env REMITLY_PRICES_API_KEY). It is called only
 * here, in the scheduled scrape, never when a page or API is requested (owner
 * rule 2026-11-20: no live fetches; the site shows scraped data). It prices
 * every payment method × product for a corridor in one call and did not
 * rate-limit in testing, but it does not say which method Remitly leads with.
 * The calculator does, and that default is the price we show (owner,
 * 2026-11-20). So the calculator stays first, and a corridor-amount it will not
 * answer (429s past MAX_ATTEMPTS, errors, or the budget running out) is priced
 * through the partner API for the method the calculator last chose for it. On
 * 2026-11-20 the two returned the same method, rate and fee on all 94
 * corridor-amounts the calculator answered. Rows priced this way carry
 * `source: "remitly-partner-api"`.
 */
import * as fs from "fs";
import * as path from "path";
import {
  OUTPUT_DIR,
  SEND_AMOUNTS,
  sendAmountsFor,
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
// The partner-API fallback gets its own window after the calculator's budget;
// CI's `timeout 450s` sits above REMITLY_BUDGET_SEC (360) + this.
const PARTNER_API_KEY = process.env.REMITLY_PRICES_API_KEY?.trim() ?? "";
const PARTNER_BUDGET_SEC = 45;
const PARTNER_CONCURRENCY = 4;
const OUTPUT_PATH = path.join(OUTPUT_DIR, "remitly-quotes.json");

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
  // Added 2026-10-03 after probing every ARE conduit: all eight quote.
  { from: "AED", to: "NPR", conduit: "ARE:AED-NPL:NPR" },
  { from: "AED", to: "IDR", conduit: "ARE:AED-IDN:IDR" },
  { from: "AED", to: "KES", conduit: "ARE:AED-KEN:KES" },
  { from: "AED", to: "ETB", conduit: "ARE:AED-ETH:ETB" },
  { from: "AED", to: "UGX", conduit: "ARE:AED-UGA:UGX" },
  { from: "AED", to: "JOD", conduit: "ARE:AED-JOR:JOD" },
  { from: "AED", to: "VND", conduit: "ARE:AED-VNM:VND" },
  { from: "AED", to: "THB", conduit: "ARE:AED-THA:THB" },
  // No other Gulf sender: SAR, OMR and KWD were removed 2026-09-26 (HTTP 400
  // "unsupported corridor" on all 14), and a 2026-10-03 probe of SAU, KWT, QAT,
  // OMN and BHR against 15 destinations each returned 400 on every one.
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Remitly's own codes: pay-in (BANK, DEBIT, OPEN_BANKING…) and pay-out
 * (BANK_DEPOSIT, CASH_PICKUP…; null when the calculator names none). */
interface Method {
  payIn: string | null;
  payOut: string | null;
}

type Corridor = (typeof CORRIDORS)[number];

const methodKey = (from: string, to: string, amount: number) => `${from}_${to}_${amount}`;

function buildQuote(
  from: string,
  to: string,
  sendAmount: number,
  fee: number,
  rate: number,
  method: Method,
  source: string
): ProviderQuote {
  return {
    provider: "Remitly",
    providerSlug: "remitly",
    providerType: "moneyTransferProvider",
    sendCurrency: from,
    receiveCurrency: to,
    sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate: roundRate(rate),
    // Total outlay = sendAmount, the convention every row is restated to.
    receiveAmount: Math.round((sendAmount - fee) * rate * 100) / 100,
    paymentMethod: method.payIn === "BANK" ? "Bank Transfer" : method.payIn,
    deliveryMethod: method.payOut || null,
    deliveryEstimate: null,
    dateCollected: new Date().toISOString(),
    source,
  };
}

/** The methods the calculator chose on the previous run, from the rows it
 * wrote (paymentMethod is stored with BANK spelled "Bank Transfer"). */
function previousMethods(): Map<string, Method> {
  const methods = new Map<string, Method>();
  try {
    const rows = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8")) as ProviderQuote[];
    for (const row of Array.isArray(rows) ? rows : []) {
      if (!row.paymentMethod) continue;
      methods.set(methodKey(row.sendCurrency, row.receiveCurrency, row.sendAmount), {
        payIn: row.paymentMethod === "Bank Transfer" ? "BANK" : row.paymentMethod,
        payOut: row.deliveryMethod || null,
      });
    }
  } catch {
    // No previous file: the fallback can only use this run's methods.
  }
  return methods;
}

interface PartnerPrice {
  payment_method?: string;
  product?: { delivery_speed?: string; priced_disbursement_methods?: string[] };
  fee?: string;
  rate?: string;
}

/**
 * The partner-API entry for the calculator's method: same pay-in, and the
 * entry priced for its pay-out (or, when none is, the entry whose price does
 * not vary by pay-out). Anything but exactly one match is no answer — the
 * docs warn the pay-out list can come back empty while the detail is
 * unavailable, and guessing then could price the wrong product.
 */
function pickPartnerEntry(prices: PartnerPrice[], method: Method): PartnerPrice | null {
  const samePayIn = prices.filter((p) => p.payment_method === method.payIn);
  const disbursements = (p: PartnerPrice) => p.product?.priced_disbursement_methods ?? [];
  let matches = method.payOut
    ? samePayIn.filter((p) => disbursements(p).includes(method.payOut!))
    : [];
  if (matches.length === 0) matches = samePayIn.filter((p) => disbursements(p).length === 0);
  return matches.length === 1 ? matches[0] : null;
}

async function fetchPartnerQuote(
  corridor: Corridor,
  amount: number,
  method: Method
): Promise<ProviderQuote | null> {
  const [fromPart, toPart] = corridor.conduit.split("-");
  const [fromCountry, fromCurrency] = fromPart.split(":");
  const [toCountry, toCurrency] = toPart.split(":");
  const params = new URLSearchParams({
    from_country: fromCountry,
    to_country: toCountry,
    from_currency: fromCurrency,
    to_currency: toCurrency,
    send_amount: String(amount),
    // Standard pricing; the default (true) folds in first-transfer promos.
    new_customer: "false",
  });

  // Two tries: a 429, or a pay-out list that came back empty (see above).
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`https://prices.remitly.com/v2/prices?${params}`, {
        headers: { "X-API-KEY": PARTNER_API_KEY, Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 429 || res.status >= 500) {
        await delay(2000);
        continue;
      }
      if (!res.ok) {
        console.log(`    ⚠ partner API HTTP ${res.status}`);
        return null;
      }
      const json = await res.json();
      const prices: PartnerPrice[] = Array.isArray(json?.prices) ? json.prices : [];
      const entry = pickPartnerEntry(prices, method);
      if (!entry) {
        await delay(1000);
        continue;
      }
      const fee = parseFloat(entry.fee ?? "");
      const rate = parseFloat(entry.rate ?? "");
      if (!(rate > 0) || !Number.isFinite(fee) || fee < 0) return null;
      return buildQuote(corridor.from, corridor.to, amount, fee, rate, method, "remitly-partner-api");
    } catch (err) {
      console.log(`    ⚠ partner API failed: ${(err as Error).message?.slice(0, 60)}`);
      return null;
    }
  }
  return null;
}

type FetchResult =
  | { quote: ProviderQuote; method: Method; reason?: undefined }
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
    // buildQuote computes receive from the base rate (Remitly's
    // `receive_amount` field uses the promo rate when present, so we can't
    // reuse it here).
    const method: Method = { payIn: payInMethod, payOut: payOutMethod || null };
    return {
      quote: buildQuote(from, to, sendAmount, fee, rate, method, "remitly-api"),
      method,
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
  console.log(`Budget: ${deadline.budgetSec}s (+${PARTNER_BUDGET_SEC}s partner-API fallback${PARTNER_API_KEY ? "" : ", OFF: no REMITLY_PRICES_API_KEY"})\n`);

  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  const failures: Record<string, number> = {};
  const startTime = Date.now();
  // Read before anything is written: the methods the calculator chose last run.
  const lastMethods = previousMethods();
  const thisRunMethods = new Map<string, Method>();

  // Corridors are listed in priority order (USD, GBP, EUR first), so if the
  // budget runs out it is the long tail that waits for the next run.
  const queue = CORRIDORS.flatMap((corridor) =>
    sendAmountsFor(corridor.from).map((amount) => ({ corridor, amount, attempts: 0 }))
  );
  type Task = (typeof queue)[number];
  // The calculator gave up on these (429s past MAX_ATTEMPTS, or an error), so
  // the partner API gets a try. A 400 "unsupported" means Remitly does not
  // serve the route, so it is not retried anywhere.
  const missed: Task[] = [];
  let deferred = 0;

  while (queue.length > 0 && !deadline.expired()) {
    const task = queue.shift()!;
    const { corridor, amount } = task;
    task.attempts++;
    const result = await fetchRemitlyQuote(corridor.from, corridor.to, corridor.conduit, amount);

    if (result.quote) {
      const quote = result.quote;
      allQuotes.push(quote);
      thisRunMethods.set(methodKey(corridor.from, corridor.to, amount), result.method);
      successCount++;
      console.log(`  ✓ ${corridor.from} → ${corridor.to} ($${amount}) Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}${task.attempts > 1 ? ` [attempt ${task.attempts}]` : ""}`);
    } else if (result.reason === "rate-limited" && task.attempts < MAX_ATTEMPTS) {
      deferred++;
      queue.push(task);
      console.log(`  ⚠ ${corridor.from} → ${corridor.to} ($${amount}) rate limited (429) — requeued, attempt ${task.attempts}/${MAX_ATTEMPTS}`);
    } else if (result.reason === "unsupported") {
      failures.unsupported = (failures.unsupported ?? 0) + 1;
      console.log(`  ✗ ${corridor.from} → ${corridor.to} ($${amount}) no data (unsupported)`);
    } else {
      missed.push(task);
      console.log(`  ⚠ ${corridor.from} → ${corridor.to} ($${amount}) calculator gave no quote (${result.reason}), left for the partner API`);
    }

    await delay(DELAY_MS);
  }

  if (queue.length > 0) {
    console.log(`\n⏱ Budget of ${deadline.budgetSec}s reached — ${queue.length} corridor-amounts not fetched from the calculator.`);
  }
  console.log(`\n429s requeued: ${deferred}.`);

  // Partner-API fallback, for the method the calculator chose for this
  // corridor-amount last run; failing that, for another amount on the same
  // corridor (this run first). Defaults can differ by amount (EUR→NGN was
  // DEBIT at 100 and OPEN_BANKING at 1,000 on 2026-11-20), hence the order.
  const leftover = [...missed, ...queue];
  let partnerCount = 0;
  if (leftover.length > 0 && PARTNER_API_KEY) {
    const partnerDeadline = Date.now() + PARTNER_BUDGET_SEC * 1000;
    const methodFor = ({ corridor, amount }: Task): Method | undefined => {
      const exact = lastMethods.get(methodKey(corridor.from, corridor.to, amount));
      if (exact) return exact;
      for (const known of [thisRunMethods, lastMethods]) {
        for (const other of sendAmountsFor(corridor.from)) {
          const m = known.get(methodKey(corridor.from, corridor.to, other));
          if (m) return m;
        }
      }
      return undefined;
    };
    console.log(`\nPartner API: pricing ${leftover.length} corridor-amounts the calculator did not answer`);
    // A few requests in flight: ~0.6s each, so one at a time priced only 49
    // of 120 in the window when the calculator budget ran out (2026-11-20).
    const pending = [...leftover];
    const worker = async () => {
      for (let task = pending.shift(); task; task = pending.shift()) {
        const { corridor, amount } = task;
        if (Date.now() >= partnerDeadline) {
          failures["partner-budget"] = (failures["partner-budget"] ?? 0) + 1;
          continue;
        }
        const method = methodFor(task);
        if (!method?.payIn) {
          failures["no-known-method"] = (failures["no-known-method"] ?? 0) + 1;
          console.log(`  ✗ ${corridor.from} → ${corridor.to} ($${amount}) no calculator method on record`);
          continue;
        }
        const quote = await fetchPartnerQuote(corridor, amount, method);
        if (quote) {
          allQuotes.push(quote);
          partnerCount++;
          successCount++;
          console.log(`  ✓ ${corridor.from} → ${corridor.to} ($${amount}) [partner API, ${method.payIn}${method.payOut ? "/" + method.payOut : ""}] Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}`);
        } else {
          failures.partner = (failures.partner ?? 0) + 1;
          console.log(`  ✗ ${corridor.from} → ${corridor.to} ($${amount}) partner API gave no matching price`);
        }
      }
    };
    await Promise.all(Array.from({ length: PARTNER_CONCURRENCY }, worker));
  } else if (leftover.length > 0) {
    failures["no-partner-key"] = leftover.length;
    console.log(`\n${leftover.length} corridor-amounts unanswered and REMITLY_PRICES_API_KEY is not set, so their last quotes carry forward.`);
  }
  const failCount = Object.values(failures).reduce((a, b) => a + b, 0);
  console.log(`Partner API priced ${partnerCount}. Final failures by reason: ${JSON.stringify(failures)}`);

  const { rows, carried } = carryForward(
    OUTPUT_PATH,
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
