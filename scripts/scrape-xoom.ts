/**
 * Xoom (PayPal) Browser Automation Scraper
 *
 * Xoom has a public guest API:
 * - Initial load: GET /wapi/guest-app/remittance
 * - Amount update: GET /wapi/guest-app/remittance/amount
 *
 * Country-specific pages: https://www.xoom.com/{country}/send-money
 * (generic /send-money requires login)
 *
 * Response: quote.pricing[] with fxRate, sendAmount, receiveAmount, feeAmount
 * for multiple payment types (ACH, debit, credit, PayPal balance).
 */
import * as fs from "fs";
import * as path from "path";
import { type BrowserContext } from "playwright";
import {
  OUTPUT_DIR,
  NAV_TIMEOUT,
  MAX_RETRIES,
  delay,
  jitteredDelay,
  dismissOverlays,
  setupBrowserContext,
  fillAmountInput,
  withRetry,
  blockHeavyResources,
  type ProviderQuote,
} from "./lib/browser";

// Xoom only operates a US storefront via `xoom.com/{country}/send-money` —
// EU/GCC senders need a separate localized storefront we don't scrape. The
// scraper used to record GBP/EUR/AED/SAR-originating corridors by visiting
// the US site and labeling the captured USD rate with the wrong send
// currency, which produced fabricated data. Those corridors are covered
// for Xoom by the Wise Comparison API (~73 Xoom corridors including all
// the GBP/EUR/AED/SAR routes), so dropping them here loses no coverage.
const CORRIDORS = [
  { from: "USD", to: "INR", country: "india" },
  { from: "USD", to: "PHP", country: "philippines" },
  { from: "USD", to: "MXN", country: "mexico" },
  { from: "USD", to: "NGN", country: "nigeria" },
  { from: "USD", to: "PKR", country: "pakistan" },
  { from: "USD", to: "BDT", country: "bangladesh" },
  { from: "USD", to: "GHS", country: "ghana" },
  { from: "USD", to: "KES", country: "kenya" },
  { from: "USD", to: "BRL", country: "brazil" },
  { from: "USD", to: "COP", country: "colombia" },
  { from: "USD", to: "GTQ", country: "guatemala" },
  { from: "USD", to: "EUR", country: "germany" },
  { from: "USD", to: "VND", country: "vietnam" },
  { from: "USD", to: "ZAR", country: "south-africa" },
  { from: "USD", to: "IDR", country: "indonesia" },
  { from: "USD", to: "THB", country: "thailand" },
];

const SEND_AMOUNTS = [100, 1000];

// Corridors where Xoom offered only a first-time promo for account delivery.
// The promo applies at every amount, so neither a retry nor the next amount
// can produce a standard quote — each wasted ~8s of browser time x3 attempts.
const PROMO_ONLY = new Set<string>();
const PROMO_ONLY_SKIP = { promoOnly: true } as const;

interface XoomPricing {
  disbursementType?: string;
  paymentType?: { type?: string };
  fxRate?: { rate?: string };
  feeAmount?: { rawValue?: string };
  sendAmount?: { rawValue?: string };
  receiveAmount?: { rawValue?: string };
  tags?: { text?: string; type?: string }[] | null;
  validations?: { level?: string }[];
}

// Account-based delivery — comparable with the bank-deposit quotes elsewhere.
const ACCOUNT_DISBURSEMENTS = ["DEPOSIT", "CARD_DEPOSIT", "UPI_DEPOSIT", "MOBILE_WALLET"];
const DISBURSEMENT_LABELS: Record<string, string> = {
  DEPOSIT: "Bank Deposit",
  CARD_DEPOSIT: "Card Deposit",
  UPI_DEPOSIT: "UPI",
  MOBILE_WALLET: "Mobile Wallet",
};
const PAYMENT_PREFERENCE = ["ACH", "DEBIT_CARD"];
function entryRank(e: XoomPricing): number {
  const d = ACCOUNT_DISBURSEMENTS.indexOf(e.disbursementType ?? "");
  const p = PAYMENT_PREFERENCE.indexOf(e.paymentType?.type ?? "");
  return (d < 0 ? 9 : d) * 10 + (p < 0 ? 9 : p);
}

function parseXoomResponse(
  body: string,
  sendCurrency: string,
  receiveCurrency: string,
  expectedAmount: number
): ProviderQuote | null {
  try {
    const data = JSON.parse(body);
    const pricing = data?.quote?.pricing as XoomPricing[] | undefined;
    if (!Array.isArray(pricing) || pricing.length === 0) return null;

    // pricing[] has one entry per (disbursementType × paymentType). Anonymous
    // visitors are priced as NEW customers: account-based entries for INR, PHP,
    // MXN, COP and GTQ carry tags[{type:"FIRST_TIME_RATE"}] — a first-transfer
    // promo (up to +2.8% over mid-market on USD→PHP $100) — and the scraper used
    // to store exactly those as Xoom's rate. Verified against raw responses and
    // Xoom's promo terms 2026-09-26. Promo entries are excluded from the
    // comparison rate, and cash pickup/delivery is never substituted for a bank
    // deposit quote (different product, often 10% worse). Where only a promo is
    // offered for account delivery we publish nothing rather than overstate.
    const isPromo = (e: XoomPricing) => (e.tags ?? []).some((t) => t?.type === "FIRST_TIME_RATE");
    const hasError = (e: XoomPricing) => (e.validations ?? []).some((v) => v?.level === "error");
    const accountDelivery = pricing.filter(
      (e) => ACCOUNT_DISBURSEMENTS.includes(e.disbursementType ?? "") && !hasError(e) && parseFloat(e.fxRate?.rate ?? "0") > 0
    );
    const standard = accountDelivery.filter((e) => !isPromo(e));
    const byPreference = (list: XoomPricing[]) =>
      [...list].sort((a, b) => entryRank(a) - entryRank(b))[0];
    const best = byPreference(standard);
    if (!best) {
      if (accountDelivery.some(isPromo)) {
        if (!PROMO_ONLY.has(`${sendCurrency}-${receiveCurrency}`)) {
          console.log(`    ⚠ ${sendCurrency}→${receiveCurrency}: only a first-time promo rate offered for account delivery — skipped`);
        }
        PROMO_ONLY.add(`${sendCurrency}-${receiveCurrency}`);
      }
      return null;
    }

    // The requested amount must be what Xoom priced. A mis-filled input once
    // priced "100350.00" (typed "100" in front of the default 350) — the root of
    // the old "scaled-integer rawValue" theory. rawValue is plain major units.
    const pricedSend = parseFloat(best.sendAmount?.rawValue ?? "0");
    if (pricedSend && Math.abs(pricedSend - expectedAmount) > 0.01) {
      console.log(`    ⚠ Xoom priced ${pricedSend}, expected ${expectedAmount} — discarded`);
      return null;
    }

    const rate = parseFloat(best.fxRate?.rate || "0");
    const fee = parseFloat(best.feeAmount?.rawValue || "0");
    const paymentType = best.paymentType?.type || null;
    const promo = byPreference(accountDelivery.filter(isPromo));
    const promoRate = promo ? parseFloat(promo.fxRate?.rate || "0") : 0;

    // Xoom charges the fee on top (receive = send × rate); we store the
    // deducted-convention figure for a total outlay of `sendAmount`.
    const sendAmount = expectedAmount;
    if (!rate) return null;
    const receiveAmount = (sendAmount - fee) * rate;

    return {
      provider: "Xoom",
      providerSlug: "xoom",
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: rate,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      firstTimeRate: promoRate > rate ? promoRate : null,
      firstTimeLimit: null,
      paymentMethod: paymentType,
      deliveryEstimate: null,
      deliveryMethod: DISBURSEMENT_LABELS[best.disbursementType ?? ""] ?? null,
      dateCollected: new Date().toISOString(),
      source: "xoom-browser-api",
    };
  } catch {
    return null;
  }
}

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ProviderQuote | null> {
  const page = await context.newPage();
  await blockHeavyResources(page);
  let capturedQuote: ProviderQuote | null = null;

  try {
    // Intercept Xoom's guest API responses
    page.on("response", async (response) => {
      const url = response.url();
      if (
        url.includes("/wapi/guest-app/remittance") ||
        url.includes("/wapi/") && url.includes("remittance")
      ) {
        try {
          const ct = response.headers()["content-type"] || "";
          if (!ct.includes("json")) return;
          const body = await response.text();
          if (body.includes("pricing") && body.includes("fxRate")) {
            const parsed = parseXoomResponse(
              body,
              corridor.from,
              corridor.to,
              amount
            );
            if (parsed && parsed.receiveAmount > 0) {
              capturedQuote = parsed;
            }
          }
        } catch {
          // Not readable
        }
      }
    });

    // Navigate to country-specific send page
    const url = `https://www.xoom.com/${corridor.country}/send-money`;
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    await delay(3000);
    await dismissOverlays(page);

    // Fill the send amount
    const filled = await fillAmountInput(page, amount, [
      "#text-input-send-input",
      'input[name="send-input"]',
      'input[inputmode="decimal"]',
      'input[type="tel"]',
      'input[type="number"]',
    ]);

    if (filled) {
      // Tab out to trigger recalculation
      await page.keyboard.press("Tab");
    }

    // Wait for API response
    await delay(4000);

    if (capturedQuote) return capturedQuote;

    // No DOM fallback (removed 2026-09-26). The page's "1 USD = x" headline is
    // the first pricing entry — the first-time promo on INR/PHP/MXN/COP/GTQ —
    // and it was stored with an assumed $0 fee, reintroducing exactly the
    // overstated rate the parser above rejects. No API quote means no quote.
    return null;
  } catch (err) {
    console.log(`    ⚠ Browser error: ${(err as Error).message?.slice(0, 80)}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("=== Xoom (PayPal) Browser Automation Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    for (const corridor of CORRIDORS) {
      console.log(`\n📍 ${corridor.from} → ${corridor.to} (${corridor.country})`);

      for (const amount of SEND_AMOUNTS) {
        try {
          console.log(`  Scraping: ${corridor.from} → ${corridor.to} ($${amount})...`);

          const key = `${corridor.from}-${corridor.to}`;
          if (PROMO_ONLY.has(key)) {
            console.log(`    – skipped: promo-only corridor`);
            continue;
          }
          const result = await withRetry(
            async () => (PROMO_ONLY.has(key) ? PROMO_ONLY_SKIP : await scrapeCorridorAmount(context, corridor, amount)),
            MAX_RETRIES
          );
          if (result === PROMO_ONLY_SKIP) continue;
          const quote = result as ProviderQuote | null;

          if (quote) {
            allQuotes.push(quote);
            successCount++;
            console.log(
              `    ✓ Fee: ${quote.fee}, Rate: ${quote.exchangeRate}, Receive: ${quote.receiveAmount} [${quote.source}]`
            );
          } else {
            failCount++;
            console.log(`    ✗ No data after ${MAX_RETRIES} attempts`);
          }

          await jitteredDelay(3000);
        } catch (err) {
          failCount++;
          console.error(`    ✗ Error scraping ${corridor.from} → ${corridor.to} ($${amount}):`, (err as Error).message);
        }
      }
    }
  } finally {
    await context.browser()?.close();

    const outputPath = path.join(OUTPUT_DIR, "xoom-quotes.json");
    // An empty result is a broken page, not "Xoom quotes nothing": keep the
    // previous file (the merge layer expires rows >72h behind the freshest)
    // rather than wiping Xoom from every table. check-scrape-health flags it.
    if (allQuotes.length > 0) {
      fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));
    } else {
      console.error("✗ No Xoom quotes collected — keeping the previous xoom-quotes.json");
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const total = successCount + failCount;
    console.log(`\n=== Xoom Scraping Complete ===`);
    console.log(`Wrote ${outputPath} (${allQuotes.length} quotes)`);
    console.log(`Success: ${successCount}, Failed: ${failCount}`);
    console.log(`Success rate: ${total > 0 ? ((successCount / total) * 100).toFixed(1) : 0}%`);
    console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
  }
}

main().catch((err) => {
  console.error("Xoom scraper failed:", err);
});
