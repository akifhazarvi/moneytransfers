import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const BASE_URL = "https://wise.com/gb/swift-codes";
const DELAY_MS = 1500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
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

async function scrapeCountry(slug: string): Promise<SwiftCountryData | null> {
  const url = `${BASE_URL}/countries/${slug}`;
  try {
    const html = await fetchPage(url);

    // Extract from __NEXT_DATA__
    const nextData = extractNextData(html) as {
      props?: {
        pageProps?: {
          country?: { name: string; iso2Code: string; currencyCode: string };
          allBanks?: { name: string }[];
        };
      };
    } | null;
    const pp = nextData?.props?.pageProps;

    const country = {
      name: pp?.country?.name || slug.replace(/-/g, " "),
      code: pp?.country?.iso2Code || "",
      currencyCode: pp?.country?.currencyCode || "",
    };

    // Extract bank slugs from HTML links (most reliable)
    const linkPattern = new RegExp(
      `href="/(?:gb|us)/swift-codes/countries/${slug}/([^"?#]+)"`,
      "g"
    );
    const bankSlugs = new Set<string>();
    let m;
    while ((m = linkPattern.exec(html)) !== null) {
      bankSlugs.add(m[1]);
    }

    // Also get names from allBanks
    const allBanks = (pp?.allBanks || []).map((b: { name: string }) => ({
      name: b.name,
      slug: b.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));

    // Merge: prefer HTML slugs, fill in with allBanks
    const banks: { name: string; slug: string }[] = [];
    for (const slug of bankSlugs) {
      const match = allBanks.find(
        (b: { slug: string }) =>
          b.slug === slug || slug.includes(b.slug) || b.slug.includes(slug)
      );
      banks.push({
        name: match?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        slug,
      });
    }
    // Add remaining from allBanks that weren't matched
    for (const bank of allBanks) {
      if (!banks.find((b) => b.name === bank.name)) {
        banks.push(bank);
      }
    }

    // Check all pages for more banks
    // Extract pagination info
    const pageMatch = html.match(/page=(\d+)#pagination/g);
    const totalPages = pageMatch
      ? Math.max(...pageMatch.map((p: string) => parseInt(p.match(/page=(\d+)/)?.[1] || "1")))
      : 1;

    // Fetch remaining pages if any
    for (let page = 2; page <= totalPages; page++) {
      await delay(DELAY_MS);
      try {
        const pageHtml = await fetchPage(`${url}?page=${page}`);
        let pm;
        while ((pm = linkPattern.exec(pageHtml)) !== null) {
          const bankSlug = pm[1];
          if (!banks.find((b) => b.slug === bankSlug)) {
            banks.push({
              name: bankSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
              slug: bankSlug,
            });
          }
        }
      } catch {
        // Skip failed pages
      }
    }

    return {
      slug,
      name: country.name,
      countryCode: country.code,
      currencyCode: country.currencyCode,
      bankCount: banks.length,
      banks,
      branches: [],
    };
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
            };
          };
        };
      };
    } | null;

    const elements =
      nextData?.props?.pageProps?.model?.pagination?.elements || [];

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
  console.log("=== Wise SWIFT/BIC Code Scraper (Fast) ===\n");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allCountries: SwiftCountryData[] = [];

  for (let i = 0; i < COUNTRY_SLUGS.length; i++) {
    const slug = COUNTRY_SLUGS[i];
    await delay(DELAY_MS);
    process.stdout.write(`[${i + 1}/${COUNTRY_SLUGS.length}] ${slug}...`);

    const result = await scrapeCountry(slug);
    if (result) {
      // Scrape branch/SWIFT data for top 5 banks
      const banksToScrape = result.banks.slice(0, 5);
      for (const bank of banksToScrape) {
        await delay(DELAY_MS);
        const branches = await scrapeBankBranches(slug, bank.slug);
        if (branches.length > 0) {
          result.branches.push(...branches);
          console.log(`    ${bank.slug}: ${branches.length} codes (${branches[0]?.bic8 || "?"})`);
        }
      }
      allCountries.push(result);
      console.log(` ${result.name} (${result.countryCode}): ${result.bankCount} banks, ${result.branches.length} codes`);
    } else {
      console.log(` FAILED`);
    }
  }

  const outputPath = path.join(OUTPUT_DIR, "swift-codes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allCountries, null, 2));

  const totalBanks = allCountries.reduce((s, c) => s + c.bankCount, 0);
  const totalBranches = allCountries.reduce((s, c) => s + c.branches.length, 0);
  console.log(`\nWrote ${outputPath}`);
  console.log(`Countries: ${allCountries.length}, Banks: ${totalBanks}, SWIFT codes: ${totalBranches}`);
}

main().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
