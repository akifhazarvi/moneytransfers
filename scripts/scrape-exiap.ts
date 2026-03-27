/**
 * Exiap / TheCurrencyShop Scraper (Cheerio — JSON-LD)
 *
 * Scrapes comparison data from the Exiap network (owned by Wise):
 *   - exiap.com (US, USD corridors)
 *   - exiap.co.uk (UK, GBP corridors)
 *   - thecurrencyshop.com.au (AU, AUD corridors)
 *
 * Data source: JSON-LD MoneyTransfer schema embedded in every corridor page.
 * Pure HTML fetch + Cheerio parse — no browser needed.
 *
 * Output: src/data/scraped/exiap-quotes.json
 */
import * as cheerio from "cheerio";
import { writeOutput, type ProviderQuote } from "./lib/browser";

const DELAY_MS = 800;

interface Corridor {
  site: string;
  sendCurrency: string;
  path: string;
  country: string; // destination country name for logging
}

// High-value corridors across all three sites
const CORRIDORS: Corridor[] = [
  // === exiap.com (USD from US) ===
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-india", country: "India" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-philippines-2", country: "Philippines" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-mexico", country: "Mexico" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-pakistan", country: "Pakistan" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-ghana", country: "Ghana" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-kenya", country: "Kenya" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-brazil", country: "Brazil" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-colombia", country: "Colombia" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-united-kingdom", country: "UK" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-germany", country: "Germany" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-europe", country: "Europe" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-japan", country: "Japan" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-china", country: "China" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-south-korea", country: "South Korea" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-thailand", country: "Thailand" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-vietnam", country: "Vietnam" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-indonesia", country: "Indonesia" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-sri-lanka", country: "Sri Lanka" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-ethiopia", country: "Ethiopia" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-south-africa", country: "South Africa" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-peru", country: "Peru" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-the-dominican-republic", country: "Dominican Republic" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-jamaica", country: "Jamaica" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-uganda", country: "Uganda" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-tanzania", country: "Tanzania" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-nigeria", country: "Nigeria" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-senegal", country: "Senegal" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-cameroon", country: "Cameroon" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-australia", country: "Australia" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-new-zealand", country: "New Zealand" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-canada", country: "Canada" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-hong-kong", country: "Hong Kong" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-singapore", country: "Singapore" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-malaysia", country: "Malaysia" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-poland", country: "Poland" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-romania", country: "Romania" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-hungary", country: "Hungary" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-czech-republic", country: "Czech Republic" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-israel", country: "Israel" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-costa-rica", country: "Costa Rica" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-honduras", country: "Honduras" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-chile", country: "Chile" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-argentina", country: "Argentina" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-haiti", country: "Haiti" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-rwanda", country: "Rwanda" },
  { site: "https://www.exiap.com", sendCurrency: "USD", path: "/international-money-transfers/send-money-to-zambia", country: "Zambia" },

  // === exiap.co.uk (GBP from UK) ===
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-india", country: "India" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-pakistan", country: "Pakistan" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-nigeria", country: "Nigeria" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-philippines", country: "Philippines" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-ghana", country: "Ghana" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-kenya", country: "Kenya" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-south-africa", country: "South Africa" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-the-united-states", country: "USA" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-europe", country: "Europe" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-australia", country: "Australia" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-canada", country: "Canada" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-japan", country: "Japan" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-china", country: "China" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-bangladesh", country: "Bangladesh" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-poland", country: "Poland" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-new-zealand", country: "New Zealand" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-turkey", country: "Turkey" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-sri-lanka", country: "Sri Lanka" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-mexico", country: "Mexico" },
  { site: "https://www.exiap.co.uk", sendCurrency: "GBP", path: "/international-money-transfers/send-money-to-uganda", country: "Uganda" },

  // === thecurrencyshop.com.au (AUD from Australia) ===
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-india", country: "India" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-philippines", country: "Philippines" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-the-united-states", country: "USA" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-the-united-kingdom", country: "UK" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-china", country: "China" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-new-zealand", country: "New Zealand" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-indonesia", country: "Indonesia" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-vietnam", country: "Vietnam" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-japan", country: "Japan" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-south-korea", country: "South Korea" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-thailand", country: "Thailand" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-malaysia", country: "Malaysia" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-singapore", country: "Singapore" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-hong-kong", country: "Hong Kong" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-sri-lanka", country: "Sri Lanka" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-pakistan", country: "Pakistan" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-south-africa", country: "South Africa" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-europe", country: "Europe" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-canada", country: "Canada" },
  { site: "https://www.thecurrencyshop.com.au", sendCurrency: "AUD", path: "/international-money-transfers/send-money-to-kenya", country: "Kenya" },
];

// Country name → currency code mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  "India": "INR", "Philippines": "PHP", "Mexico": "MXN", "Nigeria": "NGN",
  "Pakistan": "PKR", "Ghana": "GHS", "Kenya": "KES", "Brazil": "BRL",
  "Colombia": "COP", "UK": "GBP", "Germany": "EUR", "Europe": "EUR",
  "Japan": "JPY", "China": "CNY", "South Korea": "KRW", "Thailand": "THB",
  "Vietnam": "VND", "Indonesia": "IDR", "Sri Lanka": "LKR", "Ethiopia": "ETB",
  "South Africa": "ZAR", "Peru": "PEN", "Dominican Republic": "DOP",
  "Jamaica": "JMD", "Uganda": "UGX", "Tanzania": "TZS", "Senegal": "XOF",
  "Cameroon": "XAF", "Australia": "AUD", "New Zealand": "NZD",
  "Canada": "CAD", "Hong Kong": "HKD", "Singapore": "SGD", "Malaysia": "MYR",
  "Poland": "PLN", "Romania": "RON", "Hungary": "HUF", "Czech Republic": "CZK",
  "Israel": "ILS", "Costa Rica": "CRC", "Honduras": "HNL", "Chile": "CLP",
  "Argentina": "ARS", "Haiti": "HTG", "Rwanda": "RWF", "Zambia": "ZMW",
  "USA": "USD", "Bangladesh": "BDT", "Turkey": "TRY",
};

// Normalize provider names to slugs
const PROVIDER_SLUG_MAP: Record<string, string> = {
  "Wise": "wise",
  "Remitly": "remitly",
  "Xoom": "xoom",
  "XE": "xe",
  "OFX": "ofx",
  "Moneygram": "moneygram",
  "MoneyGram": "moneygram",
  "Western Union": "western-union",
  "WorldRemit": "worldremit",
  "CurrencyFair": "currencyfair",
  "Instarem": "instarem",
  "PayPal": "paypal",
  "Skrill": "skrill",
  "Revolut": "revolut",
  "Paysend": "paysend",
  "Monese": "monese",
  "Ria": "ria",
  "TapTap Send": "taptap-send",
  "Lloyds": "lloyds",
  "Barclays": "barclays",
  "HSBC": "hsbc",
  "Commonwealth Bank": "commonwealth-bank",
  "Westpac": "westpac",
  "ANZ": "anz",
  "NAB": "nab",
  "Wells Fargo": "wells-fargo",
  "Chase": "chase",
  "Bank of America": "bank-of-america",
};

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 400));
}

function toSlug(name: string): string {
  if (PROVIDER_SLUG_MAP[name]) return PROVIDER_SLUG_MAP[name];
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface ExiapAgent {
  "@type": string;
  name: string;
  hasOfferCatalog?: {
    itemListElement?: Array<{
      "@type": string;
      feesAndCommissionsSpecification?: string;
      currentExchangeRate?: {
        price: number;
        priceCurrency: string;
      };
    }>;
  };
}

interface ExiapSchema {
  "@graph"?: Array<{
    "@type": string;
    amount?: { currency: string; value: number };
    agent?: ExiapAgent[];
    potentialAction?: {
      fromLocation?: { name: string };
      toLocation?: { name: string };
    };
  }>;
}

function parseJsonLd(html: string): {
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  agents: ExiapAgent[];
} | null {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const data = JSON.parse($(scripts[i]).html() || "{}") as ExiapSchema;
      const graph = data["@graph"];
      if (!Array.isArray(graph)) continue;

      const transfer = graph.find((n) => n["@type"] === "MoneyTransfer");
      if (!transfer?.agent?.length) continue;

      const sendAmount = transfer.amount?.value || 5000;
      const sendCurrency = transfer.amount?.currency || "USD";

      // Determine receive currency from the first agent's exchange rate
      let receiveCurrency = "";
      for (const agent of transfer.agent) {
        const items = agent.hasOfferCatalog?.itemListElement || [];
        const rateItem = items.find((it) => it["@type"] === "ExchangeRateSpecification");
        if (rateItem?.currentExchangeRate?.priceCurrency) {
          // priceCurrency in ExchangeRateSpecification is actually the send currency
          // The rate converts send → receive, so we need the description
        }
      }

      // Try to get receive currency from destination country
      const toCountry = transfer.potentialAction?.toLocation?.name || "";
      receiveCurrency = COUNTRY_TO_CURRENCY[toCountry] || "";

      // Fallback: parse from description field
      if (!receiveCurrency) {
        for (const agent of transfer.agent) {
          const items = agent.hasOfferCatalog?.itemListElement || [];
          const feeItem = items.find((it) => it["@type"] === "FinancialProduct");
          const desc = (feeItem as Record<string, unknown>)?.description as string || "";
          const match = desc.match(/Money Transfer \w+-(\w+)/);
          if (match) {
            receiveCurrency = match[1];
            break;
          }
        }
      }

      if (!receiveCurrency) continue;

      return { sendAmount, sendCurrency, receiveCurrency, agents: transfer.agent };
    } catch {
      continue;
    }
  }

  return null;
}

function extractQuotes(
  parsed: NonNullable<ReturnType<typeof parseJsonLd>>,
  sourceSite: string
): ProviderQuote[] {
  const { sendAmount, sendCurrency, receiveCurrency, agents } = parsed;
  const quotes: ProviderQuote[] = [];

  for (const agent of agents) {
    const name = agent.name;
    if (!name) continue;

    const items = agent.hasOfferCatalog?.itemListElement || [];
    const feeItem = items.find((it) => it["@type"] === "FinancialProduct");
    const rateItem = items.find((it) => it["@type"] === "ExchangeRateSpecification");

    if (!rateItem?.currentExchangeRate?.price) continue;

    const exchangeRate = rateItem.currentExchangeRate.price;

    // Parse fee from string like "23.5 USD" or "0 GBP"
    let fee = 0;
    const feeStr = (feeItem as Record<string, unknown>)?.feesAndCommissionsSpecification as string || "0";
    const feeMatch = feeStr.match(/^([\d.]+)/);
    if (feeMatch) fee = parseFloat(feeMatch[1]);

    const receiveAmount = (sendAmount - fee) * exchangeRate;

    if (receiveAmount <= 0 || exchangeRate <= 0) continue;

    quotes.push({
      provider: name,
      providerSlug: toSlug(name),
      providerType: "moneyTransferProvider",
      sendCurrency,
      receiveCurrency,
      sendAmount,
      fee: Math.round(fee * 100) / 100,
      exchangeRate: Math.round(exchangeRate * 10000) / 10000,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      paymentMethod: null,
      deliveryMethod: null,
      deliveryEstimate: null,
      dateCollected: new Date().toISOString(),
      source: `exiap-${new URL(sourceSite).hostname}`,
    });
  }

  return quotes;
}

async function fetchCorridor(corridor: Corridor): Promise<ProviderQuote[]> {
  const url = `${corridor.site}${corridor.path}`;
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const html = await res.text();
  const parsed = parseJsonLd(html);
  if (!parsed) {
    throw new Error("No MoneyTransfer JSON-LD found");
  }

  return extractQuotes(parsed, corridor.site);
}

async function main() {
  console.log("=== Exiap / TheCurrencyShop Scraper (JSON-LD) ===\n");
  console.log(`Corridors: ${CORRIDORS.length}`);
  console.log(`Sites: exiap.com (USD), exiap.co.uk (GBP), thecurrencyshop.com.au (AUD)\n`);

  const allQuotes: ProviderQuote[] = [];
  const providersSeen = new Set<string>();
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const corridor of CORRIDORS) {
    try {
      const quotes = await fetchCorridor(corridor);

      if (quotes.length > 0) {
        allQuotes.push(...quotes);
        successCount++;
        for (const q of quotes) providersSeen.add(q.providerSlug);
        console.log(
          `✓ ${corridor.sendCurrency}→${corridor.country}: ${quotes.length} providers — ${quotes.map((q) => q.providerSlug).join(", ")}`
        );
      } else {
        failCount++;
        console.log(`✗ ${corridor.sendCurrency}→${corridor.country}: no providers`);
      }
    } catch (err) {
      failCount++;
      console.log(
        `✗ ${corridor.sendCurrency}→${corridor.country}: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    await delay(DELAY_MS);
  }

  console.log(`\n📊 Unique providers discovered: ${providersSeen.size}`);
  console.log(`   ${[...providersSeen].sort().join(", ")}`);

  writeOutput(
    "Exiap / TheCurrencyShop",
    "exiap",
    allQuotes,
    startTime,
    successCount,
    failCount
  );
}

main().catch((err) => {
  console.error("Exiap scraper failed:", err);
});
