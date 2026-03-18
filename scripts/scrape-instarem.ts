/**
 * Instarem Direct Scraper
 *
 * Instarem has a clean public API:
 * - Computed value: /api/v1/public/transaction/computed-value
 * - Competitor comparison: /api/v1/public/transaction/computation/comparison
 *
 * The competitor comparison endpoint is a bonus — it returns rates from
 * Instarem + Chase, OFX, MoneyGram, Western Union, Ria, CurrencyFair, etc.
 */
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 1500;

// Country code → Instarem bank account ID mapping (for payment method)
const COUNTRY_CONFIG: Record<string, { code: string; bankAccountId: number }> = {
  USD: { code: "US", bankAccountId: 58 }, // ACH
  GBP: { code: "GB", bankAccountId: 11 }, // Faster Payments
  EUR: { code: "DE", bankAccountId: 26 }, // SEPA
  CAD: { code: "CA", bankAccountId: 45 }, // EFT
  AUD: { code: "AU", bankAccountId: 1 },  // PayID
  AED: { code: "AE", bankAccountId: 68 }, // Bank transfer
  SGD: { code: "SG", bankAccountId: 5 },  // PayNow
  HKD: { code: "HK", bankAccountId: 72 }, // Bank transfer
  NZD: { code: "NZ", bankAccountId: 73 }, // Bank transfer
};

const CORRIDORS = [
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "MXN" }, { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "BDT" },
  { from: "USD", to: "BRL" }, { from: "USD", to: "KES" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "NGN" }, { from: "GBP", to: "PKR" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "NGN" },
  { from: "CAD", to: "INR" }, { from: "CAD", to: "PHP" },
  { from: "AUD", to: "INR" }, { from: "AUD", to: "PHP" },
  { from: "AED", to: "INR" }, { from: "AED", to: "PKR" },
  { from: "SGD", to: "INR" }, { from: "SGD", to: "PHP" },
  { from: "SGD", to: "IDR" }, { from: "SGD", to: "MYR" },
  { from: "HKD", to: "INR" }, { from: "HKD", to: "PHP" },
  { from: "NZD", to: "INR" }, { from: "NZD", to: "PHP" },
];

const SEND_AMOUNTS = [500, 1000, 5000];

interface InstaremQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  midMarketRate: number;
  markup: number;
  receiveAmount: number;
  paymentMethod: string | null;
  deliveryEstimate: string | null;
  deliveryMethod: null;
  dateCollected: string;
  source: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchInstaremQuote(
  from: string,
  to: string,
  amount: number
): Promise<InstaremQuote | null> {
  const config = COUNTRY_CONFIG[from];
  if (!config) return null;

  const url = `https://www.instarem.com/api/v1/public/transaction/computed-value?source_currency=${from}&destination_currency=${to}&instarem_bank_account_id=${config.bankAccountId}&country_code=${config.code}&source_amount=${amount}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;

    const receiveAmount = data.destination_amount;
    const instaremRate = data.instarem_fx_rate;
    const midMarketRate = data.fx_rate;
    const marginPercent = data.margin_percent || 0;
    const txFee = data.transaction_fee_amount || 0;
    const paymentFee = data.payment_method_fee_amount || 0;
    const totalFee = txFee + paymentFee;

    if (!receiveAmount || !instaremRate) return null;

    return {
      provider: "Instarem",
      providerSlug: "instarem",
      providerType: "moneyTransferProvider",
      sendCurrency: from,
      receiveCurrency: to,
      sendAmount: amount,
      fee: Math.round(totalFee * 100) / 100,
      exchangeRate: instaremRate,
      midMarketRate: midMarketRate || 0,
      markup: Math.round(marginPercent * 100) / 100,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryEstimate: null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "instarem-api",
    };
  } catch (err) {
    console.log(`    ⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

// Bonus: fetch competitor comparison data
async function fetchCompetitorComparison(
  from: string,
  to: string,
  amount: number
): Promise<InstaremQuote[]> {
  const config = COUNTRY_CONFIG[from];
  if (!config) return [];

  const url = `https://www.instarem.com/api/v1/public/transaction/computation/comparison?sourceCountry=${config.code}&sourceCurrency=${from}&destinationCurrency=${to}&instaremBankAccountId=${config.bankAccountId}&sourceAmount=${amount}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    const competitors = json?.data?.competitors;
    if (!Array.isArray(competitors)) return [];

    const quotes: InstaremQuote[] = [];
    for (const comp of competitors) {
      if (!comp.received_amount || !comp.exchange_rate) continue;

      quotes.push({
        provider: comp.name || comp.provider_name,
        providerSlug: (comp.name || comp.provider_name || "")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        providerType: "moneyTransferProvider",
        sendCurrency: from,
        receiveCurrency: to,
        sendAmount: amount,
        fee: Math.round((comp.fee || 0) * 100) / 100,
        exchangeRate: comp.exchange_rate,
        midMarketRate: 0,
        markup: 0,
        receiveAmount: Math.round(comp.received_amount * 100) / 100,
        paymentMethod: null,
        deliveryEstimate: null,
        deliveryMethod: null,
        dateCollected: new Date().toISOString(),
        source: "instarem-comparison",
      });
    }
    return quotes;
  } catch {
    return [];
  }
}

async function main() {
  console.log("=== Instarem Direct Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allQuotes: InstaremQuote[] = [];
  const competitorQuotes: InstaremQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    for (const amount of SEND_AMOUNTS) {
      console.log(`  Fetching: ${corridor.from} → ${corridor.to} ($${amount})...`);

      const quote = await fetchInstaremQuote(corridor.from, corridor.to, amount);

      if (quote) {
        allQuotes.push(quote);
        successCount++;
        console.log(
          `    ✓ Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}, Markup: ${quote.markup}%`
        );
      } else {
        failCount++;
        console.log(`    ✗ No data`);
      }

      // Also fetch competitor comparison (only for first amount to avoid too many requests)
      if (amount === 1000) {
        const comps = await fetchCompetitorComparison(corridor.from, corridor.to, amount);
        if (comps.length > 0) {
          competitorQuotes.push(...comps);
          console.log(`    + ${comps.length} competitor quotes`);
        }
      }

      await delay(DELAY_MS);
    }
  }

  // Write Instarem quotes
  const outputPath = path.join(OUTPUT_DIR, "instarem-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  // Write competitor comparison quotes
  if (competitorQuotes.length > 0) {
    const compPath = path.join(OUTPUT_DIR, "instarem-competitor-quotes.json");
    fs.writeFileSync(compPath, JSON.stringify(competitorQuotes, null, 2));
    console.log(`\nWrote ${compPath} (${competitorQuotes.length} competitor quotes)`);
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== Instarem Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
}

main().catch((err) => {
  console.error("Instarem scraper failed:", err);
  process.exit(1);
});
