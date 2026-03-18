/**
 * ExchangeRates.org.uk Money Transfer Comparison Scraper
 *
 * Scrapes bank and broker transfer rates from exchangerates.org.uk.
 * Data is server-rendered HTML — no Playwright needed, just fetch + Cheerio.
 *
 * Provides rates from TorFX and UK banks (Lloyds, Halifax, NatWest, RBS, Bank of Scotland)
 * which adds SEO value by showing traditional bank rates alongside specialist providers.
 *
 * URL: /compare-money-transfers/best-rate-send-{from-country}-to-{to-country}?amount={amount}
 */
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");

const DELAY_MS = 2000;
const REQUEST_TIMEOUT = 15000;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36";

// Known provider name cleanup: the site prefixes cell text with "Money Transfer" or "Best Rate\nMoney Transfer"
const PROVIDER_NAME_MAP: Record<string, { name: string; slug: string; type: string }> = {
  torfx: { name: "TorFX", slug: "torfx", type: "BROKER" },
  "bank of scotland": { name: "Bank of Scotland", slug: "bank-of-scotland", type: "BANK" },
  "lloyds bank": { name: "Lloyds Bank", slug: "lloyds-bank", type: "BANK" },
  natwest: { name: "NatWest", slug: "natwest", type: "BANK" },
  rbs: { name: "RBS", slug: "rbs", type: "BANK" },
  halifax: { name: "Halifax", slug: "halifax", type: "BANK" },
};

function cleanProviderName(raw: string): { name: string; slug: string; type: string } | null {
  // Strip common prefixes from the cell text
  const cleaned = raw
    .replace(/best\s+rate\s*/gi, "")
    .replace(/money\s+transfer\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  const key = cleaned.toLowerCase();
  if (PROVIDER_NAME_MAP[key]) return PROVIDER_NAME_MAP[key];

  // Fuzzy match — check if any known name is contained
  for (const [match, info] of Object.entries(PROVIDER_NAME_MAP)) {
    if (key.includes(match)) return info;
  }

  // Unknown provider — use cleaned name
  return {
    name: cleaned,
    slug: slugify(cleaned),
    type: key.includes("bank") ? "BANK" : "BROKER",
  };
}

// Corridors that have comparison tables (verified working)
const CORRIDORS = [
  // USA corridors
  { slug: "usa-to-mexico", from: "USD", to: "MXN" },
  { slug: "usa-to-india", from: "USD", to: "INR" },
  { slug: "usa-to-philippines", from: "USD", to: "PHP" },
  { slug: "usa-to-china", from: "USD", to: "CNY" },
  // UK corridors
  { slug: "uk-to-spain", from: "GBP", to: "EUR" },
  { slug: "uk-to-france", from: "GBP", to: "EUR" },
  { slug: "uk-to-australia", from: "GBP", to: "AUD" },
  { slug: "uk-to-india", from: "GBP", to: "INR" },
  { slug: "uk-to-canada", from: "GBP", to: "CAD" },
  // Canada corridors
  { slug: "canada-to-india", from: "CAD", to: "INR" },
  { slug: "canada-to-philippines", from: "CAD", to: "PHP" },
  // Australia corridors
  { slug: "australia-to-philippines", from: "AUD", to: "PHP" },
  { slug: "australia-to-uk", from: "AUD", to: "GBP" },
  // Other corridors
  { slug: "new-zealand-to-india", from: "NZD", to: "INR" },
  { slug: "singapore-to-india", from: "SGD", to: "INR" },
  { slug: "united-arab-emirates-to-india", from: "AED", to: "INR" },
  { slug: "belgium-to-india", from: "EUR", to: "INR" },
];

// Only scrape 2 amounts — derive the rest via linear fee model
const SCRAPE_AMOUNTS = [100, 1000];
// Expand to these amounts in the output using the computed fee model
const EXPAND_AMOUNTS = [100, 250, 500, 1000, 2000, 5000, 10000];

interface ExchangeRatesQuote {
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  paymentMethod: string | null;
  deliveryEstimate: string | null;
  dateCollected: string;
  source: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseNumber(text: string): number {
  const cleaned = text.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        Referer: "https://www.google.com/",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`    ⚠ HTTP ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (err) {
    console.log(`    ⚠ Fetch error: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

function parseComparisonTable(
  html: string,
  sendCurrency: string,
  receiveCurrency: string,
  sendAmount: number
): ExchangeRatesQuote[] {
  const $ = cheerio.load(html);
  const quotes: ExchangeRatesQuote[] = [];
  const now = new Date().toISOString();

  // The comparison table has class "compare-rates-table"
  // Rows with data-label="Provider" are data rows; skip .info-content (expandable detail rows)
  const rows = $(".compare-rates-table tbody tr").filter(function () {
    const firstTd = $(this).find("td").first();
    return firstTd.attr("data-label") === "Provider";
  });

  if (rows.length === 0) return quotes;

  rows.each(function () {
    const row = $(this);
    const cells = row.find("td");
    if (cells.length < 4) return;

    // Extract provider name from first cell, clean up prefixes
    const rawName = cells.first().text().trim();
    const providerInfo = cleanProviderName(rawName);
    if (!providerInfo) return;

    // Extract data from cells using data-label attributes
    let exchangeRate = 0;
    let fee = 0;
    let receiveAmount = 0;
    let deliveryEstimate: string | null = null;

    cells.each(function () {
      const cell = $(this);
      const label = (cell.attr("data-label") || "").toLowerCase();

      if (label.includes("exchange rate")) {
        exchangeRate = parseNumber(cell.text());
      } else if (label === "fee") {
        fee = parseNumber(cell.text());
      } else if (label.includes("recipient gets") || label.includes("you get")) {
        // The cell may contain a diff line like "-1,952.36 INR" after the amount
        // Only parse the first number (the actual receive amount)
        const text = cell.text().trim();
        const firstLine = text.split("\n")[0].trim();
        receiveAmount = parseNumber(firstLine);
      } else if (label === "speed") {
        deliveryEstimate = cell.text().trim() || null;
      }
    });

    if (!receiveAmount && !exchangeRate) return;

    // Derive receiveAmount from rate if missing
    if (!receiveAmount && exchangeRate && sendAmount) {
      receiveAmount = Math.round((sendAmount - fee) * exchangeRate * 100) / 100;
    }

    // Derive rate from receiveAmount if missing
    if (!exchangeRate && receiveAmount && sendAmount) {
      exchangeRate = receiveAmount / (sendAmount - fee);
    }

    quotes.push({
      provider: providerInfo.name,
      providerSlug: providerInfo.slug,
      providerType: providerInfo.type,
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(exchangeRate * 1000000) / 1000000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryEstimate,
      dateCollected: now,
      source: "exchangerates-uk",
    });
  });

  return quotes;
}

/**
 * Build a linear fee model from 2 scraped data points:
 *   fee(amount) = baseFee + feePercent * amount
 *
 * With quotes at amounts A1 and A2:
 *   feePercent = (fee2 - fee1) / (A2 - A1)
 *   baseFee = fee1 - feePercent * A1
 *
 * If both fees are 0 (common for banks on this site), model stays all-zero.
 */
interface FeeModel {
  baseFee: number;
  feePercent: number;
  exchangeRate: number; // avg of both data points (typically identical)
  provider: string;
  providerSlug: string;
  providerType: string;
  sendCurrency: string;
  receiveCurrency: string;
  deliveryEstimate: string | null;
}

function buildFeeModels(
  quotesLow: ExchangeRatesQuote[],
  quotesHigh: ExchangeRatesQuote[]
): FeeModel[] {
  // Index high-amount quotes by provider slug
  const highBySlug = new Map<string, ExchangeRatesQuote>();
  for (const q of quotesHigh) highBySlug.set(q.providerSlug, q);

  const models: FeeModel[] = [];

  for (const low of quotesLow) {
    const high = highBySlug.get(low.providerSlug);

    if (high) {
      // Two data points — solve linear model
      const amtDiff = high.sendAmount - low.sendAmount;
      const feePercent = amtDiff > 0
        ? (high.fee - low.fee) / amtDiff
        : 0;
      const baseFee = low.fee - feePercent * low.sendAmount;

      models.push({
        baseFee: Math.round(Math.max(baseFee, 0) * 100) / 100,
        feePercent: Math.round(Math.max(feePercent, 0) * 1000000) / 1000000,
        exchangeRate: Math.round(((low.exchangeRate + high.exchangeRate) / 2) * 1000000) / 1000000,
        provider: low.provider,
        providerSlug: low.providerSlug,
        providerType: low.providerType,
        sendCurrency: low.sendCurrency,
        receiveCurrency: low.receiveCurrency,
        deliveryEstimate: low.deliveryEstimate,
      });
    } else {
      // Only low-amount data point — assume flat fee
      models.push({
        baseFee: low.fee,
        feePercent: 0,
        exchangeRate: low.exchangeRate,
        provider: low.provider,
        providerSlug: low.providerSlug,
        providerType: low.providerType,
        sendCurrency: low.sendCurrency,
        receiveCurrency: low.receiveCurrency,
        deliveryEstimate: low.deliveryEstimate,
      });
    }
  }

  // Also add providers that only appeared in high quotes
  const lowSlugs = new Set(quotesLow.map((q) => q.providerSlug));
  for (const high of quotesHigh) {
    if (!lowSlugs.has(high.providerSlug)) {
      models.push({
        baseFee: high.fee,
        feePercent: 0,
        exchangeRate: high.exchangeRate,
        provider: high.provider,
        providerSlug: high.providerSlug,
        providerType: high.providerType,
        sendCurrency: high.sendCurrency,
        receiveCurrency: high.receiveCurrency,
        deliveryEstimate: high.deliveryEstimate,
      });
    }
  }

  return models;
}

function expandModels(models: FeeModel[], dateCollected: string): ExchangeRatesQuote[] {
  const expanded: ExchangeRatesQuote[] = [];

  for (const m of models) {
    for (const amount of EXPAND_AMOUNTS) {
      const fee = Math.round(Math.max(m.baseFee + m.feePercent * amount, 0) * 100) / 100;
      const receiveAmount = Math.round((amount - fee) * m.exchangeRate * 100) / 100;

      if (receiveAmount <= 0) continue;

      expanded.push({
        provider: m.provider,
        providerSlug: m.providerSlug,
        providerType: m.providerType,
        sendCurrency: m.sendCurrency,
        receiveCurrency: m.receiveCurrency,
        sendAmount: amount,
        fee,
        exchangeRate: m.exchangeRate,
        receiveAmount,
        paymentMethod: null,
        deliveryEstimate: m.deliveryEstimate,
        dateCollected,
        source: "exchangerates-uk",
      });
    }
  }

  return expanded;
}

async function main() {
  console.log("=== ExchangeRates.org.uk Money Transfer Scraper ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Scrape amounts: ${SCRAPE_AMOUNTS.join(", ")}`);
  console.log(`Expand to: ${EXPAND_AMOUNTS.join(", ")}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allQuotes: ExchangeRatesQuote[] = [];
  const providersSeen = new Set<string>();
  let successCount = 0;
  let failCount = 0;
  let modelsBuilt = 0;
  const startTime = Date.now();
  const dateCollected = new Date().toISOString();

  for (const corridor of CORRIDORS) {
    // Scrape both amounts for this corridor
    const quotesByAmount: Record<number, ExchangeRatesQuote[]> = {};

    for (const amount of SCRAPE_AMOUNTS) {
      console.log(`  Fetching: ${corridor.from} → ${corridor.to} (${corridor.slug}, ${amount})...`);

      const url = `https://www.exchangerates.org.uk/compare-money-transfers/best-rate-send-${corridor.slug}?amount=${amount}`;
      const html = await fetchPage(url);

      if (!html) {
        failCount++;
        console.log(`    ✗ No response`);
        await delay(DELAY_MS);
        continue;
      }

      const quotes = parseComparisonTable(html, corridor.from, corridor.to, amount);

      if (quotes.length > 0) {
        quotesByAmount[amount] = quotes;
        for (const q of quotes) providersSeen.add(q.providerSlug);
        successCount++;
        console.log(`    ✓ ${quotes.length} providers`);
      } else {
        failCount++;
        console.log(`    ✗ No data parsed`);
      }

      await delay(DELAY_MS + Math.random() * 1000);
    }

    // Build fee models and expand to all amounts
    const low = quotesByAmount[SCRAPE_AMOUNTS[0]] || [];
    const high = quotesByAmount[SCRAPE_AMOUNTS[1]] || [];

    if (low.length > 0 || high.length > 0) {
      const models = buildFeeModels(low, high);
      modelsBuilt += models.length;
      const expanded = expandModels(models, dateCollected);
      allQuotes.push(...expanded);

      for (const m of models) {
        console.log(`    📐 ${m.provider}: fee = ${m.baseFee} + ${(m.feePercent * 100).toFixed(4)}% × amount, rate = ${m.exchangeRate}`);
      }
    }
  }

  const outputPath = path.join(OUTPUT_DIR, "exchangerates-uk-quotes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allQuotes, null, 2));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n=== ExchangeRates.org.uk Scraping Complete ===`);
  console.log(`Wrote ${outputPath} (${allQuotes.length} quotes, expanded from ${modelsBuilt} fee models)`);
  console.log(`Scraped: ${successCount} success, ${failCount} failed (of ${CORRIDORS.length * SCRAPE_AMOUNTS.length} requests)`);
  console.log(`Unique providers: ${providersSeen.size}`);
  console.log(`Providers: ${[...providersSeen].sort().join(", ")}`);
  console.log(`Duration: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);

  const total = successCount + failCount;
  if (total > 0 && successCount / total < 0.2) {
    console.error(
      "\n⚠ Success rate below 20% — exchangerates.org.uk may have changed their site structure"
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("ExchangeRates.org.uk scraper failed:", err);
  process.exit(1);
});
