/**
 * IndexNow Ping Script
 *
 * Submits all data-driven URLs to IndexNow (Bing, Yandex, Naver, Seznam)
 * after scraper runs. Reads scraped quote files to determine which corridors
 * have data, then generates the full URL list.
 *
 * Run: npx tsx scripts/ping-indexnow.ts
 * Env: INDEXNOW_KEY (optional override, defaults to key in public/)
 */
import * as fs from "fs";
import * as path from "path";
import { getSwiftCountries } from "../src/data/swift-codes";

const SITE_URL = "https://sendmoneycompare.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "504f73e915dcbe38e02c363c31409cad";
const SCRAPED_DIR = path.join(__dirname, "..", "src", "data", "scraped");

// ── IBAN country slugs that are indexed (must match indexedIbanCountries in iban/[slug]/page.tsx) ──
const INDEXED_IBAN_SLUGS = [
  "united-kingdom", "germany", "france", "netherlands", "spain",
  "italy", "denmark", "belgium", "austria", "ireland",
  "portugal", "sweden", "switzerland", "poland", "norway",
  "pakistan",
  "turkey", "romania", "czechia", "hungary", "croatia",
  "finland", "greece", "cyprus", "luxembourg",
  "united-arab-emirates", "saudi-arabia", "qatar", "kuwait", "bahrain",
  "jordan", "egypt", "israel", "brazil", "ukraine", "georgia",
];

// ── Provider slugs (must match src/data/providers.ts) ──
const PROVIDER_SLUGS = [
  "wise", "remitly", "ofx", "xe", "western-union", "worldremit",
  "revolut", "paypal", "moneygram", "xoom", "torfx", "instarem",
  "taptap-send", "ace-money-transfer",
];

// ── Exchange rate pairs (must match sitemap.ts) ──
const EXCHANGE_RATE_PAIRS = [
  "usd-to-inr", "usd-to-pkr", "usd-to-php", "usd-to-mxn", "usd-to-ngn",
  "gbp-to-eur", "gbp-to-inr", "gbp-to-usd", "gbp-to-pkr",
  "eur-to-usd", "eur-to-gbp",
  "cad-to-inr", "aud-to-inr",
  "usd-to-gbp", "usd-to-eur", "usd-to-cad", "usd-to-aud", "usd-to-jpy",
  "usd-to-brl", "usd-to-cny",
];

// ── Currency → country slug mapping for corridor URL generation ──
const CURRENCY_TO_SLUG: Record<string, string> = {
  USD: "usa", GBP: "uk", EUR: "europe", CAD: "canada", AUD: "australia",
  NZD: "new-zealand", SGD: "singapore", AED: "uae", SAR: "saudi-arabia",
  CHF: "switzerland", HKD: "hong-kong", JPY: "japan", KRW: "south-korea",
  INR: "india", PKR: "pakistan", BDT: "bangladesh", NPR: "nepal", LKR: "sri-lanka",
  PHP: "philippines", VND: "vietnam", IDR: "indonesia", THB: "thailand",
  CNY: "china", MXN: "mexico", BRL: "brazil", COP: "colombia", PEN: "peru",
  GTQ: "guatemala", DOP: "dominican-republic", JMD: "jamaica",
  NGN: "nigeria", KES: "kenya", GHS: "ghana", ZAR: "south-africa",
  ETB: "ethiopia", UGX: "uganda", TZS: "tanzania", XOF: "senegal",
  EGP: "egypt", MAD: "morocco", TRY: "turkey", PLN: "poland", RON: "romania",
  FJD: "fiji", MYR: "malaysia", CZK: "czech-republic", HUF: "hungary",
  ILS: "israel", TWD: "taiwan", RWF: "rwanda", ZMW: "zambia", XAF: "cameroon",
  NOK: "norway", SEK: "sweden", DKK: "denmark",
  KWD: "kuwait", QAR: "qatar", BHD: "bahrain", OMR: "oman",
  BGN: "bulgaria", CLP: "chile", ISK: "iceland",
};

interface Quote {
  sendCurrency: string;
  receiveCurrency: string;
}

/**
 * Read all scraped quote files and extract unique currency pairs with data.
 */
function getCorridorsWithData(): Set<string> {
  const pairs = new Set<string>();
  const files = fs.readdirSync(SCRAPED_DIR).filter((f) => f.endsWith("-quotes.json"));

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(SCRAPED_DIR, file), "utf-8");
      const quotes: Quote[] = JSON.parse(raw);
      for (const q of quotes) {
        if (q.sendCurrency && q.receiveCurrency) {
          pairs.add(`${q.sendCurrency}_${q.receiveCurrency}`);
        }
      }
    } catch {
      // Skip unreadable files
    }
  }
  return pairs;
}

/**
 * Read the editorial corridor list directly from the source so newly added
 * corridors (e.g. ireland-to-bangladesh, denmark-to-france) get pinged even
 * when no scraped quote file references them yet.
 */
function getEditorialCorridorSlugs(): string[] {
  try {
    const corridorsTs = fs.readFileSync(
      path.join(__dirname, "..", "src", "data", "corridors.ts"),
      "utf-8"
    );
    const slugs = new Set<string>();
    const re = /slug:\s*"([a-z0-9-]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(corridorsTs))) {
      slugs.add(m[1]);
    }
    return [...slugs];
  } catch {
    return [];
  }
}

/**
 * Read editorial slugs from a data file using the same `slug: "..."` pattern
 * used elsewhere in src/data. Used for /news and /guides so newly published
 * articles get pinged on the next scrape/deploy run.
 */
function getEditorialSlugs(relativeDataPath: string): string[] {
  try {
    const src = fs.readFileSync(
      path.join(__dirname, "..", "src", "data", relativeDataPath),
      "utf-8"
    );
    const slugs = new Set<string>();
    const re = /slug:\s*"([a-z0-9-]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      slugs.add(m[1]);
    }
    return [...slugs];
  } catch {
    return [];
  }
}

/**
 * Generate all data-driven URLs that change when scraped data updates.
 */
function generateUrls(): string[] {
  const urls: string[] = [];
  const corridorsWithData = getCorridorsWithData();
  const editorialSlugs = getEditorialCorridorSlugs();
  const newsSlugs = getEditorialSlugs("news.ts");
  const guideSlugs = getEditorialSlugs("blog-posts.ts");

  // 1. Homepage + hub pages
  urls.push(
    `${SITE_URL}/`,
    `${SITE_URL}/send-money`,
    `${SITE_URL}/companies`,
    `${SITE_URL}/compare`,
    `${SITE_URL}/compare-money-transfer`,
    `${SITE_URL}/exchange-rates`,
    `${SITE_URL}/currency-converter`,
    `${SITE_URL}/remittance-cost-index`,
    `${SITE_URL}/guides`,
    `${SITE_URL}/iban`,
    `${SITE_URL}/swift-codes`,
  );

  // 1a. IBAN country pages (indexed subset)
  for (const slug of INDEXED_IBAN_SLUGS) {
    urls.push(`${SITE_URL}/iban/${slug}`);
  }

  // 1b. Every editorial corridor (always indexed regardless of scrape data)
  for (const slug of editorialSlugs) {
    urls.push(`${SITE_URL}/send-money/${slug}`);
  }

  // 1c. News and guides — editorial articles freshly published or revised
  urls.push(`${SITE_URL}/news`);
  for (const slug of newsSlugs) {
    urls.push(`${SITE_URL}/news/${slug}`);
  }
  for (const slug of guideSlugs) {
    urls.push(`${SITE_URL}/guides/${slug}`);
  }

  // 1d. Bank international-transfer-cost pages — live data, refresh every scrape
  urls.push(`${SITE_URL}/banks`);
  for (const slug of ["hsbc", "wells-fargo", "chase", "lloyds", "barclays"]) {
    urls.push(`${SITE_URL}/banks/${slug}`);
  }

  // 2. Corridor pages — only corridors that have scraped data
  for (const pair of corridorsWithData) {
    const [from, to] = pair.split("_");
    const fromSlug = CURRENCY_TO_SLUG[from];
    const toSlug = CURRENCY_TO_SLUG[to];
    if (fromSlug && toSlug && fromSlug !== toSlug) {
      urls.push(`${SITE_URL}/send-money/${fromSlug}-to-${toSlug}`);
    }
  }

  // 3. Country pages (send-money-to-X) — destinations that appear in receive data
  const receiveCurrencies = new Set<string>();
  for (const pair of corridorsWithData) {
    receiveCurrencies.add(pair.split("_")[1]);
  }
  for (const currency of receiveCurrencies) {
    const slug = CURRENCY_TO_SLUG[currency];
    if (slug) {
      urls.push(`${SITE_URL}/send-money/send-money-to-${slug}`);
    }
  }

  // 4. Currency-pair pages (usd-to-inr style)
  for (const pair of corridorsWithData) {
    const [from, to] = pair.split("_");
    urls.push(`${SITE_URL}/send-money/${from.toLowerCase()}-to-${to.toLowerCase()}`);
  }

  // 5. Provider review pages (rates change with data)
  for (const slug of PROVIDER_SLUGS) {
    urls.push(`${SITE_URL}/companies/${slug}`);
  }

  // 6. Comparison pages (all pairs of providers)
  for (let i = 0; i < PROVIDER_SLUGS.length; i++) {
    for (let j = i + 1; j < PROVIDER_SLUGS.length; j++) {
      urls.push(`${SITE_URL}/compare/${PROVIDER_SLUGS[i]}-vs-${PROVIDER_SLUGS[j]}`);
    }
  }

  // 7. Exchange rate pages
  for (const pair of EXCHANGE_RATE_PAIRS) {
    urls.push(`${SITE_URL}/exchange-rates/${pair}`);
  }

  // 8. Retired locale URLs (410 Gone) — ping so Bing recrawls and deindexes them.
  // The middleware returns 410 for /fr/, /es/, /pt/ prefixes. Submitting these
  // to IndexNow tells Bing to revisit and drop them from the index.
  const KILLED_LOCALES = ["fr", "es", "pt"];
  for (const locale of KILLED_LOCALES) {
    // Swift-codes country pages that were previously indexed under /fr/
    for (const country of getSwiftCountries().map((c) => c.slug)) {
      urls.push(`${SITE_URL}/${locale}/swift-codes/${country}`);
    }
    // IBAN country pages
    for (const slug of INDEXED_IBAN_SLUGS) {
      urls.push(`${SITE_URL}/${locale}/iban/${slug}`);
    }
    // Top-level hub pages
    for (const hub of ["", "send-money", "companies", "swift-codes", "iban", "exchange-rates"]) {
      urls.push(`${SITE_URL}/${locale}${hub ? `/${hub}` : ""}`);
    }
  }

  // Deduplicate
  return [...new Set(urls)];
}

/**
 * Submit URLs to IndexNow via batched POST. Spec allows up to 10,000 URLs per
 * request; we chunk at 10,000 to stay well under any soft limit and keep
 * payloads under typical CDN body caps. A handful of POSTs replaces ~1,700
 * sequential GETs and finishes in under 10 seconds vs. ~15 minutes.
 *
 * Spec: https://www.indexnow.org/documentation
 */
async function submitToIndexNow(urls: string[]): Promise<void> {
  const HOST = new URL(SITE_URL).host;
  const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
  const BATCH_SIZE = 10_000;
  const ENDPOINT = "https://api.indexnow.org/indexnow";
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const body = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent": "SendMoneyCompare-IndexNow/1.0 (+https://sendmoneycompare.com)",
        },
        body: JSON.stringify(body),
      });
      if (res.ok || res.status === 202) {
        succeeded += batch.length;
        console.log(`  ✓ Batch of ${batch.length} URLs accepted (HTTP ${res.status})`);
      } else {
        failed += batch.length;
        const text = await res.text().catch(() => "");
        console.error(`  ✗ Batch failed — HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
      }
    } catch (err) {
      failed += batch.length;
      console.error(`  ✗ Batch failed — network error:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\n✓ Done: ${succeeded}/${urls.length} URLs accepted, ${failed} failed`);
}

async function main() {
  const urls = generateUrls();
  console.log(`IndexNow: Generated ${urls.length} data-driven URLs from scraped quote files`);

  if (urls.length === 0) {
    console.log("No URLs to submit — check that scraped data exists in src/data/scraped/");
    process.exit(0);
  }

  // Log a sample for debugging
  console.log(`Sample URLs (first 5):`);
  urls.slice(0, 5).forEach((u) => console.log(`  ${u}`));
  console.log(`  ... and ${urls.length - 5} more\n`);

  await submitToIndexNow(urls);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
