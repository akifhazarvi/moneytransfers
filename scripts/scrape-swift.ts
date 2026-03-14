import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const BASE_URL = "https://wise.com/gb/swift-codes";
const DELAY_MS = 2000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  Fetching: ${url}${attempt > 1 ? ` (retry ${attempt})` : ""}`);
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`    Connection error, retrying in 3s...`);
      await delay(3000);
    }
  }
  throw new Error("unreachable");
}

function extractNextData(html: string): Record<string, unknown> | null {
  const marker = '__NEXT_DATA__" type="application/json">';
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const jsonStart = start + marker.length;
  const jsonEnd = html.indexOf("</script>", jsonStart);
  if (jsonEnd === -1) return null;
  try {
    return JSON.parse(html.substring(jsonStart, jsonEnd));
  } catch {
    return null;
  }
}

interface SwiftBranch {
  bankName: string;
  bankSlug: string;
  city: string;
  bic11: string;
  bic8: string;
  bankCode: string;
  countryCode: string;
  locationCode: string;
  branchCode: string;
  headOffice: boolean;
  address: string;
}

interface SwiftCountryData {
  slug: string;
  name: string;
  countryCode: string;
  currencyCode: string;
  bankCount: number;
  banks: { name: string; slug: string }[];
  branches: SwiftBranch[];
}

// Country slugs from the Wise swift-codes/countries page
const COUNTRY_SLUGS = [
  "albania", "andorra", "argentina", "armenia", "australia", "austria",
  "azerbaijan", "bangladesh", "belarus", "belgium", "benin",
  "bosnia-and-herzegovina", "brazil", "bulgaria", "burkina-faso",
  "cameroon", "canada", "chile", "china", "colombia", "costa-rica",
  "cote-d-ivoire", "croatia", "cyprus", "czech-republic", "denmark",
  "ecuador", "egypt", "el-salvador", "equatorial-guinea", "estonia",
  "finland", "france", "gabon", "georgia", "germany", "ghana",
  "gibraltar", "greece", "guinea-bissau", "holy-see", "hong-kong",
  "hungary", "iceland", "india", "indonesia", "ireland", "israel",
  "italy", "japan", "kenya", "kiribati", "latvia", "liechtenstein",
  "lithuania", "luxembourg", "malaysia", "mali", "malta",
  "marshall-islands", "mexico", "micronesia", "moldova", "monaco",
  "morocco", "mozambique", "nepal", "netherlands", "new-zealand",
  "niger", "nigeria", "norway", "pakistan", "panama", "paraguay",
  "peru", "philippines", "poland", "portugal", "romania", "russia",
  "san-marino", "senegal", "serbia", "singapore", "slovakia",
  "slovenia", "south-africa", "south-korea", "spain", "sri-lanka",
  "sweden", "switzerland", "tanzania", "thailand", "timor-leste",
  "togo", "turkiye", "tuvalu", "uganda", "ukraine",
  "united-arab-emirates", "united-kingdom", "united-states",
  "uruguay", "viet-nam", "virgin-islands-uk",
];

async function scrapeCountryBankList(slug: string): Promise<{
  country: { name: string; code: string; currencyCode: string };
  banks: { name: string; slug: string }[];
  bankLinks: string[];
} | null> {
  const url = `${BASE_URL}/countries/${slug}`;
  try {
    const html = await fetchPage(url);

    // Extract bank list from __NEXT_DATA__
    const nextData = extractNextData(html) as { props?: { pageProps?: { country?: { name: string; iso2Code: string; currencyCode: string }; allBanks?: { name: string }[] } } } | null;
    const pp = nextData?.props?.pageProps;

    const country = {
      name: pp?.country?.name || slug.replace(/-/g, " "),
      code: pp?.country?.iso2Code || "",
      currencyCode: pp?.country?.currencyCode || "",
    };

    const allBanks = (pp?.allBanks || []).map((b: { name: string }) => ({
      name: b.name,
      slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));

    // Also extract bank links from HTML for getting slugs right
    const linkPattern = new RegExp(`/swift-codes/countries/${slug}/([^"]+)`, "g");
    const bankLinks: string[] = [];
    let m;
    while ((m = linkPattern.exec(html)) !== null) {
      const bankSlug = m[1].replace(/\?.*/, "");
      if (bankSlug && !bankSlug.includes("#") && !bankLinks.includes(bankSlug)) {
        bankLinks.push(bankSlug);
      }
    }

    return { country, banks: allBanks, bankLinks };
  } catch (err) {
    console.log(`    Failed: ${(err as Error).message}`);
    return null;
  }
}

async function scrapeBankBranches(
  countrySlug: string,
  bankSlug: string
): Promise<SwiftBranch[]> {
  const url = `${BASE_URL}/countries/${countrySlug}/${bankSlug}`;
  try {
    const html = await fetchPage(url);
    const nextData = extractNextData(html) as {
      props?: {
        pageProps?: {
          model?: {
            pagination?: {
              elements?: Array<{
                name: string;
                bank: { name: string; slug: string };
                city: { name: string };
                bicCode: {
                  bankCode: string;
                  countryCode: string;
                  locationCode: string;
                  branchCode: string;
                  bic11: string;
                  bic8: string;
                  headOffice: boolean;
                };
                address: string;
              }>;
              totalPages?: number;
            };
          };
        };
      };
    } | null;

    const elements = nextData?.props?.pageProps?.model?.pagination?.elements || [];

    return elements.map((el) => ({
      bankName: el.bank?.name || el.name || "",
      bankSlug: el.bank?.slug || bankSlug,
      city: el.city?.name || "",
      bic11: el.bicCode?.bic11 || "",
      bic8: el.bicCode?.bic8 || "",
      bankCode: el.bicCode?.bankCode || "",
      countryCode: el.bicCode?.countryCode || "",
      locationCode: el.bicCode?.locationCode || "",
      branchCode: el.bicCode?.branchCode || "",
      headOffice: el.bicCode?.headOffice || false,
      address: el.address || "",
    }));
  } catch {
    return [];
  }
}

async function main() {
  console.log("=== Wise SWIFT/BIC Code Scraper ===\n");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allCountries: SwiftCountryData[] = [];
  let totalBranches = 0;

  for (let i = 0; i < COUNTRY_SLUGS.length; i++) {
    const slug = COUNTRY_SLUGS[i];
    console.log(`\n[${i + 1}/${COUNTRY_SLUGS.length}] ${slug}`);
    await delay(DELAY_MS);

    const result = await scrapeCountryBankList(slug);
    if (!result) continue;

    const countryData: SwiftCountryData = {
      slug,
      name: result.country.name,
      countryCode: result.country.code,
      currencyCode: result.country.currencyCode,
      bankCount: result.bankLinks.length || result.banks.length,
      banks: [],
      branches: [],
    };

    // Scrape first page of bank branches (limit to first 10 banks per country to be respectful)
    const banksToScrape = result.bankLinks.slice(0, 10);
    for (const bankSlug of banksToScrape) {
      await delay(DELAY_MS);
      const branches = await scrapeBankBranches(slug, bankSlug);
      if (branches.length > 0) {
        countryData.branches.push(...branches);
        const bankName = branches[0]?.bankName || bankSlug;
        if (!countryData.banks.find((b) => b.slug === bankSlug)) {
          countryData.banks.push({ name: bankName, slug: bankSlug });
        }
        console.log(`    ${bankSlug}: ${branches.length} branches (${branches[0]?.bic8 || "?"})`);
      }
    }

    // Add remaining banks (without branch data)
    for (const bank of result.banks) {
      if (!countryData.banks.find((b) => b.name === bank.name)) {
        countryData.banks.push(bank);
      }
    }

    totalBranches += countryData.branches.length;
    allCountries.push(countryData);
    console.log(`  Total: ${countryData.banks.length} banks, ${countryData.branches.length} branches`);
  }

  // Write output
  const outputPath = path.join(OUTPUT_DIR, "swift-codes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allCountries, null, 2));
  console.log(`\nWrote ${outputPath}`);
  console.log(`\n=== SWIFT Scraping Complete ===`);
  console.log(
    JSON.stringify(
      {
        countries: allCountries.length,
        totalBanks: allCountries.reduce((s, c) => s + c.banks.length, 0),
        totalBranches,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
