/**
 * CompareRemit Scraper (Playwright)
 *
 * CompareRemit is a comparison site focused on remittances to India, Philippines,
 * Mexico, etc. Data is server-rendered HTML — no API calls needed.
 *
 * Strategy: load each corridor page, parse the DOM for provider data.
 * Fast because data is in the initial HTML (domcontentloaded is enough).
 *
 * URL pattern: /compare-money-transfer-services-from-{currency}-to-{country}/
 */
import * as fs from "fs";
import * as path from "path";
import {
  setupBrowserContext,
  delay,
  jitteredDelay,
  dismissOverlays,
  NAV_TIMEOUT,
  OUTPUT_DIR,
  parseNumber,
  blockHeavyResources,
  type ProviderQuote,
  writeOutput,
} from "./lib/browser";
import type { BrowserContext, Page } from "playwright";

// Cross-check rates against XE mid-market so we can drop suspicious quotes.
// CompareRemit lists obscure providers (Unplex, Xpat) advertising rates
// 5-10% ABOVE mid-market, which is mathematically impossible for an honest
// transfer service — those are bait/promo numbers we shouldn't surface.
type XeRates = { rates: Record<string, number> };
function loadMidMarketRate(from: string, to: string): number {
  try {
    const p = path.join(OUTPUT_DIR, "xe-midmarket-rates.json");
    const xe = JSON.parse(fs.readFileSync(p, "utf-8")) as XeRates;
    const f = xe.rates[from] || (from === "USD" ? 1 : 0);
    const t = xe.rates[to];
    if (!f || !t) return 0;
    return t / f;
  } catch {
    return 0;
  }
}

// Reject rates more than this fraction better than mid-market. Real providers
// occasionally offer ~0.5-1% above mid for promo wallets, but anything beyond
// 2% is either a stale headline rate or outright bait pricing.
const MAX_RATE_ABOVE_MIDMARKET = 0.02;

const DELAY_MS = 1500;

// CompareRemit uses country names in URLs, not currency codes
// Only corridors that CompareRemit actually covers (verified 2026-03)
const CORRIDORS = [
  { from: "USD", to: "INR", urlPath: "from-usd-to-india" },       // 3 providers
  { from: "USD", to: "PHP", urlPath: "from-usd-to-philippines" },  // 1 provider
  { from: "USD", to: "MXN", urlPath: "from-usd-to-mexico" },      // 1 provider
  { from: "USD", to: "PKR", urlPath: "from-usd-to-pakistan" },     // 1 provider
  { from: "USD", to: "BDT", urlPath: "from-usd-to-bangladesh" },   // 1 provider
  { from: "GBP", to: "INR", urlPath: "from-gbp-to-india" },       // 1 provider
  { from: "GBP", to: "PKR", urlPath: "from-gbp-to-pakistan" },     // 1 provider
  { from: "GBP", to: "PHP", urlPath: "from-gbp-to-philippines" },  // 1 provider
  { from: "CAD", to: "INR", urlPath: "from-cad-to-india" },       // 1 provider
  { from: "AUD", to: "INR", urlPath: "from-aud-to-india" },       // 1 provider
  { from: "AUD", to: "PHP", urlPath: "from-aud-to-philippines" },  // 1 provider
];

const SEND_AMOUNTS = [500, 1000];

/** Slug mapping for providers CompareRemit shows */
const SLUG_MAP: Record<string, string> = {
  "remitly": "remitly",
  "remit2any inc.": "remit2any",
  "remit2any": "remit2any",
  "sbi california": "sbi-california",
  "wise": "wise",
  "xoom": "xoom",
  "western union": "western-union",
  "ria money transfer": "ria",
  "worldremit": "worldremit",
  "pangea": "pangea",
  "instarem": "instarem",
  "xe money transfer": "xe",
  "xe": "xe",
  "taptap send": "taptapsend",
  "boss revolution": "boss-revolution",
  "sharemoney": "sharemoney",
  "remitbee": "remitbee",
  "atlantic money": "atlantic-money",
};

function toSlug(name: string): string {
  const lower = name.toLowerCase().trim();
  return SLUG_MAP[lower] || lower.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface ParsedProvider {
  name: string;
  rate: number;
  fee: number;
  transferTime: string;
  receiveAmount: number;
}

async function scrapeCorridorAmount(
  context: BrowserContext,
  corridor: (typeof CORRIDORS)[number],
  amount: number
): Promise<ParsedProvider[]> {
  const page = await context.newPage();
  await blockHeavyResources(page);

  try {
    const url = `https://www.compareremit.com/compare-money-transfer-services-${corridor.urlPath}/?amt=${amount}&sc=${corridor.from}&rc=${corridor.to}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    // Data is server-rendered — short wait for DOM to settle
    await delay(2000);
    await dismissOverlays(page);

    const providers = await page.evaluate(() => {
      const results: ParsedProvider[] = [];
      const joins = document.querySelectorAll("[id^='table_join_']");

      for (const j of joins) {
        const nameEl = j.querySelector("[data-name]");
        const name = nameEl?.getAttribute("data-name") || "";
        if (!name) continue;

        // Exchange rate from hidden input
        const rateInput = j.querySelector("input[name='exchange_rate']") as HTMLInputElement | null;
        const rate = parseFloat(rateInput?.value || "0") || 0;

        // Fee — look for "Transfer fee" section, extract dollar amount
        let fee = 0;
        const feeMatch = j.textContent?.match(/Transfer fee\s*\$?([\d,.]+)/i);
        if (feeMatch) fee = parseFloat(feeMatch[1].replace(/,/g, "")) || 0;

        // Transfer time — extract from text
        let transferTime = "";
        const timeMatch = j.textContent?.match(/Transfer time\s*([\d]+\s*-\s*[\d]+\s*(?:Hour|Day|Minute|Business Day)s?)/i);
        if (timeMatch) transferTime = timeMatch[1].trim();

        // Receive amount — from the blue text or calculate from rate
        let receiveAmount = 0;
        const amountEls = j.querySelectorAll(".txt-blue-big");
        if (amountEls.length > 0) {
          // First .txt-blue-big is usually the promo/first-time amount,
          // second is the regular amount. Prefer regular (last one).
          const lastAmountEl = amountEls[amountEls.length - 1];
          const amountText = lastAmountEl.textContent?.replace(/[^0-9.,]/g, "") || "";
          receiveAmount = parseFloat(amountText.replace(/,/g, "")) || 0;
        }

        if (rate > 0) {
          results.push({ name, rate, fee, transferTime, receiveAmount });
        }
      }

      return results;
    });

    return providers;
  } catch (err) {
    console.log(`    ⚠ Error: ${(err as Error).message?.slice(0, 80)}`);
    return [];
  } finally {
    try { await page.close(); } catch {}
  }
}

async function main() {
  console.log("=== CompareRemit Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  const context = await setupBrowserContext();
  const allQuotes: ProviderQuote[] = [];
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  // Build all (corridor, amount) tasks
  const tasks = CORRIDORS.flatMap((corridor) =>
    SEND_AMOUNTS.map((amount) => ({ corridor, amount }))
  );

  const CONCURRENCY = 3;

  function processResult(
    corridor: (typeof CORRIDORS)[number],
    amount: number,
    providers: ParsedProvider[]
  ) {
    if (providers.length > 0) {
      const midMarket = loadMidMarketRate(corridor.from, corridor.to);
      const ceiling = midMarket > 0 ? midMarket * (1 + MAX_RATE_ABOVE_MIDMARKET) : 0;
      for (const p of providers) {
        if (ceiling > 0 && p.rate > ceiling) {
          console.log(
            `    ⚠ Dropping ${p.name} ${corridor.from}->${corridor.to}: rate ${p.rate} > ${ceiling.toFixed(4)} (mid+${(MAX_RATE_ABOVE_MIDMARKET * 100).toFixed(0)}%)`
          );
          continue;
        }
        const receiveAmount = p.receiveAmount > 0
          ? p.receiveAmount
          : Math.round((amount - p.fee) * p.rate * 100) / 100;

        allQuotes.push({
          provider: p.name,
          providerSlug: toSlug(p.name),
          providerType: "moneyTransferProvider",
          sendCurrency: corridor.from,
          receiveCurrency: corridor.to,
          sendAmount: amount,
          fee: p.fee,
          exchangeRate: p.rate,
          receiveAmount,
          paymentMethod: null,
          deliveryMethod: null,
          deliveryEstimate: p.transferTime || null,
          dateCollected: new Date().toISOString(),
          source: "compareremit",
        });
      }
      successCount++;
      console.log(`  ✓ ${corridor.from}→${corridor.to} $${amount}: ${providers.length} providers (${providers.map(p => p.name).join(", ")})`);
    } else {
      failCount++;
      console.log(`  ✗ ${corridor.from}→${corridor.to} $${amount}: No data`);
    }
  }

  try {
    // Process tasks in batches of CONCURRENCY
    for (let i = 0; i < tasks.length; i += CONCURRENCY) {
      const batch = tasks.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        batch.map(({ corridor, amount }) =>
          scrapeCorridorAmount(context, corridor, amount)
            .then((providers) => ({ corridor, amount, providers }))
        )
      );
      for (const { corridor, amount, providers } of results) {
        processResult(corridor, amount, providers);
      }
      if (i + CONCURRENCY < tasks.length) {
        await jitteredDelay(DELAY_MS);
      }
    }
  } finally {
    await context.browser()?.close();
  }

  writeOutput("CompareRemit", "compareremit", allQuotes, startTime, successCount, failCount);
}

main().catch((err) => {
  console.error("CompareRemit scraper failed:", err);
  process.exit(1);
});
