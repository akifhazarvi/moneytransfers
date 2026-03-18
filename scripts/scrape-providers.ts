import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 1500; // polite delay between requests

// All corridors we want to scrape
const CORRIDORS = [
  // From USD (top remittance destination from US)
  { from: "USD", to: "INR" },
  { from: "USD", to: "PHP" },
  { from: "USD", to: "IDR" },
  { from: "USD", to: "MXN" },
  { from: "USD", to: "NGN" },
  { from: "USD", to: "PKR" },
  { from: "USD", to: "BDT" },
  { from: "USD", to: "GBP" },
  { from: "USD", to: "EUR" },
  { from: "USD", to: "CAD" },
  { from: "USD", to: "BRL" },
  { from: "USD", to: "JPY" },
  { from: "USD", to: "CNY" },
  { from: "USD", to: "KES" },
  { from: "USD", to: "GHS" },
  { from: "USD", to: "ZAR" },
  { from: "USD", to: "AED" },
  { from: "USD", to: "COP" },
  { from: "USD", to: "GTQ" },
  { from: "USD", to: "VND" },
  { from: "USD", to: "TRY" },
  { from: "USD", to: "MAD" },
  { from: "USD", to: "MYR" },
  { from: "USD", to: "FJD" },
  { from: "USD", to: "NPR" },
  { from: "USD", to: "LKR" },
  { from: "USD", to: "EGP" },
  { from: "USD", to: "ETB" },
  { from: "USD", to: "THB" },
  { from: "USD", to: "PEN" },
  { from: "USD", to: "UGX" },
  { from: "USD", to: "TZS" },
  { from: "USD", to: "JMD" },
  { from: "USD", to: "DOP" },
  { from: "USD", to: "XOF" },
  { from: "USD", to: "PLN" },
  { from: "USD", to: "RON" },
  { from: "USD", to: "TWD" },
  { from: "USD", to: "CZK" },
  { from: "USD", to: "HUF" },
  { from: "USD", to: "ILS" },
  { from: "USD", to: "RWF" },
  { from: "USD", to: "ZMW" },
  { from: "USD", to: "XAF" },
  // From GBP
  { from: "GBP", to: "EUR" },
  { from: "GBP", to: "INR" },
  { from: "GBP", to: "PKR" },
  { from: "GBP", to: "NGN" },
  { from: "GBP", to: "USD" },
  { from: "GBP", to: "BDT" },
  { from: "GBP", to: "GHS" },
  { from: "GBP", to: "ZAR" },
  { from: "GBP", to: "PHP" },
  // From EUR
  { from: "EUR", to: "GBP" },
  { from: "EUR", to: "INR" },
  { from: "EUR", to: "USD" },
  { from: "EUR", to: "PKR" },
  { from: "EUR", to: "NGN" },
  { from: "EUR", to: "TRY" },
  { from: "EUR", to: "PHP" },
  { from: "EUR", to: "BRL" },
  { from: "EUR", to: "MAD" },
  // From CAD
  { from: "CAD", to: "INR" },
  { from: "CAD", to: "PHP" },
  { from: "CAD", to: "GBP" },
  { from: "CAD", to: "EUR" },
  { from: "CAD", to: "USD" },
  { from: "CAD", to: "PKR" },
  { from: "CAD", to: "NGN" },
  { from: "CAD", to: "BDT" },
  // From AUD
  { from: "AUD", to: "INR" },
  { from: "AUD", to: "PHP" },
  { from: "AUD", to: "GBP" },
  { from: "AUD", to: "EUR" },
  { from: "AUD", to: "USD" },
  { from: "AUD", to: "NZD" },
  { from: "AUD", to: "CNY" },
  { from: "AUD", to: "VND" },
  // From AED (huge remittance origin — Gulf workers)
  { from: "AED", to: "INR" },
  { from: "AED", to: "PKR" },
  { from: "AED", to: "PHP" },
  { from: "AED", to: "BDT" },
  { from: "AED", to: "EGP" },
  // From SGD (Singapore — major Asia hub)
  { from: "SGD", to: "INR" },
  { from: "SGD", to: "PHP" },
  { from: "SGD", to: "MYR" },
  { from: "SGD", to: "IDR" },
  { from: "SGD", to: "BDT" },
  // From NZD
  { from: "NZD", to: "AUD" },
  { from: "NZD", to: "GBP" },
  { from: "NZD", to: "INR" },
  { from: "NZD", to: "FJD" },
  // From SAR (Saudi Arabia — massive remittance origin)
  { from: "SAR", to: "INR" },
  { from: "SAR", to: "PKR" },
  { from: "SAR", to: "BDT" },
  { from: "SAR", to: "PHP" },
  { from: "SAR", to: "EGP" },
  // From KWD (Kuwait)
  { from: "KWD", to: "INR" },
  { from: "KWD", to: "PKR" },
  { from: "KWD", to: "PHP" },
  // From QAR (Qatar)
  { from: "QAR", to: "INR" },
  { from: "QAR", to: "PKR" },
  { from: "QAR", to: "PHP" },
  // From CHF (Switzerland)
  { from: "CHF", to: "INR" },
  { from: "CHF", to: "EUR" },
  { from: "CHF", to: "PKR" },
  // From HKD (Hong Kong)
  { from: "HKD", to: "INR" },
  { from: "HKD", to: "PHP" },
  { from: "HKD", to: "CNY" },
  // From JPY (Japan)
  { from: "JPY", to: "INR" },
  { from: "JPY", to: "PHP" },
  // From KRW (South Korea)
  { from: "KRW", to: "INR" },
  { from: "KRW", to: "PHP" },
  { from: "KRW", to: "VND" },
  // From NOK (Norway)
  { from: "NOK", to: "INR" },
  { from: "NOK", to: "PKR" },
  { from: "NOK", to: "PLN" },
  // From SEK (Sweden)
  { from: "SEK", to: "INR" },
  { from: "SEK", to: "PKR" },
  { from: "SEK", to: "PLN" },
  // From DKK (Denmark)
  { from: "DKK", to: "INR" },
  { from: "DKK", to: "PKR" },
  { from: "DKK", to: "PLN" },
];

const SEND_AMOUNTS = [100, 500, 1000, 5000, 10000];

// Map Wise provider aliases to our provider slugs
const ALIAS_TO_SLUG: Record<string, string> = {
  wise: "wise",
  remitly: "remitly",
  ofx: "ofx",
  xe: "xe",
  "western-union": "western-union",
  westernunion: "western-union",
  worldremit: "worldremit",
  "world-remit": "worldremit",
  revolut: "revolut",
  paypal: "paypal",
  moneygram: "moneygram",
  xoom: "xoom",
  torfx: "torfx",
  instarem: "instarem",
  pangea: "pangea",
  skrill: "skrill",
  // Banks
  "bank-of-america": "bank-of-america",
  chase: "chase",
  "wells-fargo": "wells-fargo",
  hsbc: "hsbc",
  barclays: "barclays",
  lloyds: "lloyds",
  santander: "santander",
};

interface WiseQuote {
  dateCollected: string;
  fee: number;
  markup: number;
  rate: number;
  receivedAmount: number;
  sendAmount: number | null;
  sourceCountry: string | null;
  targetCountry: string | null;
  isConsideredMidMarketRate?: boolean;
  deliveryEstimation: {
    deliveryDate?: { min: string; max: string } | null;
    duration: { min: string; max: string } | null;
    durationType?: string | null;
    providerGivesEstimate: boolean;
  };
}

interface WiseProvider {
  alias: string;
  id: number;
  name: string;
  type: string;
  logo: string;
  logos?: {
    normal?: { svgUrl?: string; pngUrl?: string };
  };
  partner: boolean;
  quotes: WiseQuote[];
}

interface WiseComparison {
  sourceCurrency: string;
  targetCurrency: string;
  sendAmount: number;
  providers: WiseProvider[];
}

interface ScrapedQuote {
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
  deliveryEstimate: string | null;
  dateCollected: string;
  logoUrl: string | null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseDuration(isoDuration: string | null): string | null {
  if (!isoDuration) return null;
  // Parse ISO 8601 duration like PT12H54M or P1D
  const match = isoDuration.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  const days = parseInt(match[1] || "0");
  const hours = parseInt(match[2] || "0");
  const minutes = parseInt(match[3] || "0");
  if (days > 0 && hours > 0) return `${days}d ${hours}h`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `${minutes} min`;
  return "Instant";
}

// Source country codes for v4 API
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US", GBP: "GB", EUR: "DE", CAD: "CA", AUD: "AU",
  INR: "IN", PHP: "PH", MXN: "MX", NGN: "NG", PKR: "PK",
  BDT: "BD", JPY: "JP", CNY: "CN", BRL: "BR", KES: "KE",
  GHS: "GH", ZAR: "ZA", AED: "AE", SGD: "SG", NZD: "NZ",
  COP: "CO", GTQ: "GT", VND: "VN", TRY: "TR", MAD: "MA",
  MYR: "MY", IDR: "ID", EGP: "EG", FJD: "FJ",
  SAR: "SA", KWD: "KW", QAR: "QA", CHF: "CH", HKD: "HK",
  KRW: "KR", NOK: "NO", SEK: "SE", DKK: "DK", PLN: "PL",
  NPR: "NP", LKR: "LK", ETB: "ET", THB: "TH", PEN: "PE",
  UGX: "UG", TZS: "TZ", JMD: "JM", DOP: "DO", XOF: "SN",
  RON: "RO", TWD: "TW", CZK: "CZ", HUF: "HU", ILS: "IL",
  RWF: "RW", ZMW: "ZM", XAF: "CM",
};

async function fetchComparison(
  from: string,
  to: string,
  amount: number,
  midMarketRate: number | null
): Promise<WiseComparison | null> {
  const sourceCountry = CURRENCY_TO_COUNTRY[from] || "US";
  // Use v4 gateway with better params for accurate Wise fees
  const params = new URLSearchParams({
    sendAmount: String(amount),
    sourceCurrency: from,
    targetCurrency: to,
    sourceCountry,
    includeWise: "true",
    payInMethod: "DIRECT_DEBIT",
  });
  if (midMarketRate) params.set("midMarketRate", String(midMarketRate));

  const url = `https://wise.com/gateway/v4/comparisons?${params}`;
  console.log(`  Fetching: ${from} → ${to} (${amount})...`);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.log(`    ⚠ ${res.status} ${res.statusText}`);
      return null;
    }

    return (await res.json()) as WiseComparison;
  } catch (err) {
    console.log(`    ⚠ Failed: ${err}`);
    return null;
  }
}

async function fetchMidMarketRate(
  from: string,
  to: string
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://wise.com/rates/live?source=${from}&target=${to}&length=1`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.value ?? null;
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Provider Quotes Scraper (via Wise Comparison API) ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Amounts: ${SEND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allQuotes: ScrapedQuote[] = [];
  const midMarketRates: Record<string, number> = {};
  const providersSeen = new Set<string>();
  const corridorStats: { corridor: string; providers: number }[] = [];

  // First, fetch mid-market rates for all corridors
  console.log("--- Fetching mid-market rates ---");
  for (const corridor of CORRIDORS) {
    const key = `${corridor.from}_${corridor.to}`;
    const rate = await fetchMidMarketRate(corridor.from, corridor.to);
    if (rate) {
      midMarketRates[key] = rate;
      console.log(`  ${corridor.from}/${corridor.to}: ${rate}`);
    }
    await delay(500);
  }

  // Fetch comparisons
  console.log("\n--- Fetching provider comparisons ---");
  for (const corridor of CORRIDORS) {
    for (const amount of SEND_AMOUNTS) {
      const midRate =
        midMarketRates[`${corridor.from}_${corridor.to}`] ?? null;
      const comparison = await fetchComparison(
        corridor.from,
        corridor.to,
        amount,
        midRate
      );

      if (!comparison || !comparison.providers) {
        corridorStats.push({
          corridor: `${corridor.from}→${corridor.to}`,
          providers: 0,
        });
        await delay(DELAY_MS);
        continue;
      }

      let providerCount = 0;

      for (const provider of comparison.providers) {
        if (!provider.quotes || provider.quotes.length === 0) continue;

        // For providers with multiple quotes, prefer the one marked as mid-market rate
        // (Wise returns two quotes: one generic, one with actual payInMethod-specific fee)
        const quote =
          provider.quotes.find((q) => q.isConsideredMidMarketRate) ||
          provider.quotes[provider.quotes.length - 1]; // latest quote as fallback
        const slug =
          ALIAS_TO_SLUG[provider.alias] || provider.alias.toLowerCase();
        providersSeen.add(slug);
        providerCount++;

        // Parse delivery estimate
        let deliveryEstimate: string | null = null;
        if (quote.deliveryEstimation?.duration?.max) {
          deliveryEstimate = parseDuration(quote.deliveryEstimation.duration.max);
        } else if (quote.deliveryEstimation?.duration?.min) {
          deliveryEstimate = parseDuration(quote.deliveryEstimation.duration.min);
        }

        allQuotes.push({
          provider: provider.name,
          providerSlug: slug,
          providerType: provider.type,
          sendCurrency: corridor.from,
          receiveCurrency: corridor.to,
          sendAmount: amount,
          fee: Math.round(quote.fee * 100) / 100,
          exchangeRate: quote.rate,
          midMarketRate: midRate ?? quote.rate / (1 - quote.markup / 100),
          markup: Math.round(quote.markup * 10000) / 10000,
          receiveAmount: Math.round(quote.receivedAmount * 100) / 100,
          deliveryEstimate,
          dateCollected: quote.dateCollected,
          logoUrl: provider.logos?.normal?.svgUrl || provider.logo || null,
        });
      }

      corridorStats.push({
        corridor: `${corridor.from}→${corridor.to}`,
        providers: providerCount,
      });
      console.log(
        `    ✓ ${corridor.from}→${corridor.to}: ${providerCount} providers`
      );

      await delay(DELAY_MS);
    }
  }

  // Write outputs
  // 1. All quotes
  const quotesPath = path.join(OUTPUT_DIR, "provider-quotes.json");
  fs.writeFileSync(quotesPath, JSON.stringify(allQuotes, null, 2));
  console.log(`\nWrote ${quotesPath} (${allQuotes.length} quotes)`);

  // 2. Mid-market rates
  const ratesPath = path.join(OUTPUT_DIR, "mid-market-rates.json");
  fs.writeFileSync(ratesPath, JSON.stringify(midMarketRates, null, 2));
  console.log(`Wrote ${ratesPath} (${Object.keys(midMarketRates).length} pairs)`);

  // 3. Provider summary — aggregate stats per provider
  const providerAgg: Record<
    string,
    {
      name: string;
      slug: string;
      type: string;
      corridors: number;
      avgFee: number;
      avgMarkup: number;
      logoUrl: string | null;
    }
  > = {};

  for (const q of allQuotes) {
    if (!providerAgg[q.providerSlug]) {
      providerAgg[q.providerSlug] = {
        name: q.provider,
        slug: q.providerSlug,
        type: q.providerType,
        corridors: 0,
        avgFee: 0,
        avgMarkup: 0,
        logoUrl: q.logoUrl,
      };
    }
    providerAgg[q.providerSlug].corridors++;
    providerAgg[q.providerSlug].avgFee += q.fee;
    providerAgg[q.providerSlug].avgMarkup += q.markup;
  }

  const providerSummary = Object.values(providerAgg)
    .map((p) => ({
      ...p,
      avgFee: Math.round((p.avgFee / p.corridors) * 100) / 100,
      avgMarkup: Math.round((p.avgMarkup / p.corridors) * 10000) / 10000,
    }))
    .sort((a, b) => b.corridors - a.corridors);

  const providerSummaryPath = path.join(OUTPUT_DIR, "provider-summary.json");
  fs.writeFileSync(providerSummaryPath, JSON.stringify(providerSummary, null, 2));
  console.log(`Wrote ${providerSummaryPath} (${providerSummary.length} providers)`);

  // 4. Historical snapshot
  const now = new Date();
  const historyDir = path.join(OUTPUT_DIR, "history");
  fs.mkdirSync(historyDir, { recursive: true });
  const datestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 16); // 2026-03-13T06-00
  const historyPath = path.join(historyDir, `quotes-${datestamp}.json`);
  fs.writeFileSync(historyPath, JSON.stringify(allQuotes, null, 2));
  console.log(`Wrote ${historyPath} (historical snapshot)`);

  // Update history index
  const indexPath = path.join(historyDir, "index.json");
  let historyIndex: { snapshots: { timestamp: string; file: string; corridors: number; quotes: number }[] } = { snapshots: [] };
  if (fs.existsSync(indexPath)) {
    try { historyIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8")); } catch { /* start fresh */ }
  }
  historyIndex.snapshots.push({
    timestamp: now.toISOString(),
    file: `quotes-${datestamp}.json`,
    corridors: CORRIDORS.length,
    quotes: allQuotes.length,
  });
  // Keep last 90 days of snapshots (4 per day * 90 = 360)
  if (historyIndex.snapshots.length > 360) {
    const removed = historyIndex.snapshots.splice(0, historyIndex.snapshots.length - 360);
    for (const s of removed) {
      const oldPath = path.join(historyDir, s.file);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  }
  fs.writeFileSync(indexPath, JSON.stringify(historyIndex, null, 2));

  // 5. Scrape summary
  const summary = {
    scrapedAt: now.toISOString(),
    source: "Wise Comparison API v4 (wise.com/gateway/v4/comparisons)",
    totalQuotes: allQuotes.length,
    totalProviders: providersSeen.size,
    totalCorridors: CORRIDORS.length,
    sendAmounts: SEND_AMOUNTS,
    corridorStats,
    providers: [...providersSeen].sort(),
  };
  const summaryPath = path.join(OUTPUT_DIR, "provider-scrape-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log("\n=== Scraping Complete ===");
  console.log(`Total quotes: ${allQuotes.length}`);
  console.log(`Total providers: ${providersSeen.size}`);
  console.log(`Providers found: ${[...providersSeen].sort().join(", ")}`);
  console.log("\nCorridor coverage:");
  for (const stat of corridorStats) {
    console.log(`  ${stat.corridor}: ${stat.providers} providers`);
  }
}

main().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
