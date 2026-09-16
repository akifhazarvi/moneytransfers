/**
 * OFX Direct Scraper
 *
 * OFX has a clean public REST API for spot rates.
 * GET https://api.ofx.com/PublicSite.ApiService/OFX/spotrate/Individual/{FROM}/{TO}/{AMOUNT}
 *
 * Returns: CustomerRate, CustomerAmount, Fee, InterbankRate, DeliveryTime
 * Min transfer: $150 USD equivalent
 *
 * THE `Fee` FIELD IS A GENERIC DEFAULT, NOT A REAL PER-MARKET CHARGE.
 * The endpoint takes no country/account context, so `Fee` (or its
 * `DefaultFee` fallback) is a flat value keyed only by send currency —
 * confirmed by sampling every corridor: USD is always 5, GBP always 7, AUD
 * and CAD always 15, regardless of destination or amount. Cross-checked
 * against OFX's own published policy (ofx.com FAQ pages, fetched 2026-09-16):
 * AUD and CAD match exactly ("no fee above AU$/CA$10,000, else a flat
 * AU$/CA$15" — our two test amounts are both under the threshold, so the
 * API's default is correct there). USD does not match: OFX's US FAQ states
 * transfers are fee-free "regardless of the amount you send," with no
 * threshold, yet the API's default for USD is 5. `receiveAmount` never nets
 * the fee out (verified: sendAmount × exchangeRate matches receiveAmount to
 * the cent on every sampled quote), so this only corrupts the standalone fee
 * figure, not the cost/markup index. Overridden below for USD specifically,
 * since that's the one currency with a verified mismatch; GBP/EUR/NZD/SGD/
 * CHF/AED are left as the API reports them — unverified against a citable
 * source, not shown to be wrong.
 */
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 1500;

const CORRIDORS = [
  { from: "USD", to: "INR" }, { from: "USD", to: "PHP" },
  { from: "USD", to: "IDR" }, { from: "USD", to: "THB" }, { from: "USD", to: "MYR" },
  { from: "USD", to: "TRY" }, { from: "USD", to: "MXN" }, { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" }, { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" }, { from: "USD", to: "BRL" },
  { from: "USD", to: "COP" }, { from: "USD", to: "KES" },
  { from: "GBP", to: "INR" }, { from: "GBP", to: "EUR" },
  { from: "GBP", to: "USD" }, { from: "GBP", to: "NGN" },
  { from: "EUR", to: "INR" }, { from: "EUR", to: "GBP" },
  { from: "EUR", to: "USD" }, { from: "EUR", to: "NGN" },
  { from: "CAD", to: "INR" }, { from: "CAD", to: "USD" },
  { from: "AUD", to: "INR" }, { from: "AUD", to: "USD" },
  { from: "AED", to: "INR" },
  { from: "SGD", to: "INR" }, { from: "SGD", to: "PHP" },
  { from: "NZD", to: "INR" }, { from: "NZD", to: "AUD" },
  { from: "CHF", to: "INR" }, { from: "CHF", to: "EUR" },
  { from: "SAR", to: "INR" }, { from: "SAR", to: "PKR" },
];

// OFX has a minimum of ~150 USD equivalent
const SEND_AMOUNTS = [500, 1000];

interface OFXQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  interbankRate: number;
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

async function fetchOFXQuote(
  from: string,
  to: string,
  amount: number
): Promise<OFXQuote | null> {
  const url = `https://api.ofx.com/PublicSite.ApiService/OFX/spotrate/Individual/${from}/${to}/${amount}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;
    const data = await res.json();

    const customerRate = data.CustomerRate;
    const customerAmount = data.CustomerAmount;
    const interbankRate = data.InterbankRate;
    // USD override: OFX's own FAQ (ofx.com/en-us/faqs/are-there-any-transfer-fees)
    // states transfers are fee-free regardless of amount; the API's generic
    // default (5) does not reflect that. See file header for the full check.
    const fee = from === "USD" ? 0 : data.Fee ?? data.DefaultFee ?? 0;
    const deliveryDays = data.DeliveryTime;

    if (!customerRate || !customerAmount) return null;

    const markup =
      interbankRate > 0
        ? Math.round(
            ((interbankRate - customerRate) / interbankRate) * 10000
          ) / 100
        : 0;

    return {
      provider: "OFX",
      providerSlug: "ofx",
      providerType: "moneyTransferProvider",
      sendCurrency: from,
      receiveCurrency: to,
      sendAmount: amount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: customerRate,
      interbankRate,
      markup,
      receiveAmount: Math.round(customerAmount * 100) / 100,
      paymentMethod: null,
      deliveryEstimate: deliveryDays
        ? `${deliveryDays} day${deliveryDays > 1 ? "s" : ""}`
        : null,
      deliveryMethod: null,
      dateCollected: new Date().toISOString(),
      source: "ofx-api",
    };
  } catch (err) {
    console.log(`    ⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

async function main() {
  console.log("=== OFX Direct Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allQuotes: OFXQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    for (const amount of SEND_AMOUNTS) {
      console.log(`  Fetching: ${corridor.from} → ${corridor.to} ($${amount})...`);

      const quote = await fetchOFXQuote(corridor.from, corridor.to, amount);

      if (quote) {
        allQuotes.push(quote);
        successCount++;
        console.log(
          `    ✓ Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount}, Fee: ${quote.fee}, Markup: ${quote.markup}%`
        );
      } else {
        failCount++;
        console.log(`    ✗ No data`);
      }

      await delay(DELAY_MS);
    }
  }

  const outputPath = path.join(OUTPUT_DIR, "ofx-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== OFX Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
}

main().catch((err) => {
  console.error("OFX scraper failed:", err);
  process.exit(1);
});
