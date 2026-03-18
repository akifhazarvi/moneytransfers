/**
 * ACE Money Transfer Scraper
 *
 * ACE specialises in UK/EU → South Asia + Middle East remittances.
 * Their send-money pages embed rate data directly in the HTML as
 * JavaScript variables (all_payers / payer_details).
 *
 * Strategy: Cheerio HTML scrape — fetch each destination page,
 * extract the embedded JSON rate data. No browser or API needed.
 */
import * as cheerio from "cheerio";
import {
  SEND_AMOUNTS,
  jitteredDelay,
  writeOutput,
  type ProviderQuote,
} from "./lib/browser";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// ---------------------------------------------------------------------------
// Corridors — ACE pages always default to GBP as the send currency.
// Each destination page has one set of embedded rates for GBP → X.
// ---------------------------------------------------------------------------
interface Corridor {
  from: string;          // always GBP (page default)
  to: string;            // receive currency
  country: string;       // URL slug: /Country/Send-Money-to-Country
}

const CORRIDORS: Corridor[] = [
  { from: "GBP", to: "PKR", country: "Pakistan" },
  { from: "GBP", to: "INR", country: "India" },
  { from: "GBP", to: "BDT", country: "Bangladesh" },
  { from: "GBP", to: "LKR", country: "Sri-Lanka" },
  { from: "GBP", to: "NPR", country: "Nepal" },
  { from: "GBP", to: "NGN", country: "Nigeria" },
  { from: "GBP", to: "GHS", country: "Ghana" },
  { from: "GBP", to: "KES", country: "Kenya" },
  { from: "GBP", to: "PHP", country: "Philippines" },
  { from: "GBP", to: "EGP", country: "Egypt" },
  { from: "GBP", to: "MAD", country: "Morocco" },
  { from: "GBP", to: "TRY", country: "Turkey" },
  { from: "GBP", to: "THB", country: "Thailand" },
  { from: "GBP", to: "VND", country: "Vietnam" },
  { from: "GBP", to: "MXN", country: "Mexico" },
  { from: "GBP", to: "IDR", country: "Indonesia" },
  { from: "GBP", to: "UGX", country: "Uganda" },
  { from: "GBP", to: "TZS", country: "Tanzania" },
  { from: "GBP", to: "ZMW", country: "Zambia" },
  { from: "GBP", to: "ETB", country: "Ethiopia" },
  { from: "GBP", to: "RWF", country: "Rwanda" },
  { from: "GBP", to: "CNY", country: "China" },
  { from: "GBP", to: "BRL", country: "Brazil" },
  { from: "GBP", to: "COP", country: "Colombia" },
];

// Delivery method labels
const METHOD_DELIVERY: Record<string, string> = {
  Bank: "Same day – 1 business day",
  Cash: "Minutes",
  Wallet: "Minutes",
  "Mobile Topup": "Instant",
};

// ---------------------------------------------------------------------------
// Parse embedded rate data from page HTML
// ---------------------------------------------------------------------------
interface PayerEntry {
  company_rate: number;
  company_method: string;
  company_currency: string;
  company_name: string;
  method_masking?: string;
}

function extractRates(html: string): PayerEntry[] {
  // Try all_payers first, then payer_details
  const allPayersMatch = html.match(/all_payers\s*=\s*(\[[\s\S]*?\])\s*;/);
  if (allPayersMatch) {
    try {
      return JSON.parse(allPayersMatch[1]);
    } catch { /* fall through */ }
  }

  // payer_details is { "Bank": [...], "Cash": [...], ... }
  const payerDetailsMatch = html.match(/payer_details\s*=\s*(\{[\s\S]*?\})\s*;?\s*var\s/);
  if (payerDetailsMatch) {
    try {
      const obj = JSON.parse(payerDetailsMatch[1]) as Record<string, PayerEntry[]>;
      return Object.values(obj).flat();
    } catch { /* fall through */ }
  }

  return [];
}

function bestRate(payers: PayerEntry[]): { rate: number; method: string } | null {
  // Pick the highest customer rate (Bank deposit is usually best).
  // Exclude Mobile Topup as it has distorted rates.
  let best: { rate: number; method: string } | null = null;
  for (const p of payers) {
    const method = p.method_masking ?? p.company_method;
    if (method === "Mobile Topup" || method === "Airtime Topup") continue;
    if (p.company_rate > 0 && (!best || p.company_rate > best.rate)) {
      best = { rate: p.company_rate, method };
    }
  }
  return best;
}

function buildQuote(
  from: string, to: string, amount: number,
  rate: number, method: string,
): ProviderQuote {
  return {
    provider: "ACE Money Transfer",
    providerSlug: "ace-money-transfer",
    providerType: "moneyTransferProvider",
    sendCurrency: from,
    receiveCurrency: to,
    sendAmount: amount,
    fee: 0,
    exchangeRate: Math.round(rate * 10000) / 10000,
    receiveAmount: Math.round(amount * rate * 100) / 100,
    paymentMethod: method === "Bank" ? "Bank Transfer" : method,
    deliveryEstimate: METHOD_DELIVERY[method] ?? "Same day – 1 business day",
    deliveryMethod: method === "Bank" ? "Bank Deposit" : method === "Cash" ? "Cash Pickup" : method === "Wallet" ? "Mobile Wallet" : null,
    dateCollected: new Date().toISOString(),
    source: "ace-html",
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== ACE Money Transfer Scraper ===\n");
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const c of CORRIDORS) {
    const url = `https://acemoneytransfer.com/${c.country}/Send-Money-to-${c.country}`;
    process.stdout.write(`${c.from} → ${c.to} (${c.country})`);

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "text/html" },
      });

      if (!res.ok) {
        console.log(` ✗ HTTP ${res.status}`);
        failCount += SEND_AMOUNTS.length;
        await jitteredDelay(500);
        continue;
      }

      const html = await res.text();
      const payers = extractRates(html);

      if (payers.length === 0) {
        console.log(" ✗ no rate data found");
        failCount += SEND_AMOUNTS.length;
        await jitteredDelay(500);
        continue;
      }

      const best = bestRate(payers);
      if (!best) {
        console.log(" ✗ no valid rate");
        failCount += SEND_AMOUNTS.length;
        await jitteredDelay(500);
        continue;
      }

      // ACE rates are flat (not amount-dependent), generate quotes for each amount
      for (const amount of SEND_AMOUNTS) {
        const quote = buildQuote(c.from, c.to, amount, best.rate, best.method);
        allQuotes.push(quote);
        successCount++;
      }

      console.log(` ✓ rate=${best.rate} method=${best.method}`);
    } catch (err) {
      console.log(` ✗ ${(err as Error).message}`);
      failCount += SEND_AMOUNTS.length;
    }

    await jitteredDelay(500);
  }

  writeOutput("ACE Money Transfer", "ace-money-transfer", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("ACE Money Transfer scraper failed:", err);
  process.exit(1);
});
