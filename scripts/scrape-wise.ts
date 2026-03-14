import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");
const DELAY_MS = 2000;

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
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`    Connection error, retrying in 3s...`);
      await delay(3000);
    }
  }
  throw new Error("unreachable");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Country slugs discovered from the Wise IBAN page
const COUNTRY_SLUGS = [
  "pakistan", "bulgaria", "jordan", "bahrain", "faroe-islands", "france",
  "saudi-arabia", "brazil", "sweden", "slovenia", "slovakia", "san-marino",
  "united-kingdom", "georgia", "gibraltar", "el-salvador", "switzerland",
  "greenland", "greece", "kuwait", "guatemala", "costa-rica", "kazakhstan",
  "kosovo", "cyprus", "lebanon", "czech-republic", "timor-leste", "poland",
  "liechtenstein", "turkey", "germany", "portugal", "denmark", "lithuania",
  "luxembourg", "croatia", "latvia", "dominican-republic", "ukraine",
  "hungary", "qatar", "monaco", "moldova", "montenegro", "ireland",
  "north-macedonia", "estonia", "egypt", "andorra", "israel",
  "united-arab-emirates", "mauritania", "malta", "iceland", "albania",
  "italy", "vatican-city", "spain", "british-virgin-islands", "austria",
  "azerbaijan", "romania", "netherlands", "bosnia-and-herzegovina",
  "norway", "serbia", "belgium", "finland",
];

interface WiseCountryData {
  slug: string;
  countryCode: string;
  countryName: string;
  sepa: boolean;
  ibanLength: number;
  currency: string;
  exampleIban: string;
  bbanFields: {
    value: string;
    label: string;
    regex: string;
  }[];
  banks: {
    name: string;
    slug: string;
    logo: string;
  }[];
}

// Not used — extraction happens in extractAllCountriesFromPage

function extractAllCountriesFromPage(html: string): WiseCountryData[] {
  const results: WiseCountryData[] = [];
  const seen = new Set<string>();

  console.log(`  HTML length: ${html.length}`);

  // Wise embeds country data as JSON in a script. The format varies between
  // page loads (A/B testing). Try multiple extraction strategies.

  // Strategy 1: Look for {"countryCode":"XX","sepa": pattern
  const marker = '"countryCode":"';
  const sepaMarker = '","sepa":';
  let searchPos = 0;
  const jsonObjects: string[] = [];

  while (true) {
    const idx = html.indexOf(marker, searchPos);
    if (idx === -1) break;

    const codeEnd = idx + marker.length + 2;
    if (codeEnd >= html.length || html.substring(codeEnd, codeEnd + sepaMarker.length) !== sepaMarker) {
      searchPos = idx + 1;
      continue;
    }

    let start = idx - 1;
    while (start > 0 && html[start] !== "{") start--;

    let depth = 0;
    let end = start;
    for (let i = start; i < html.length && i < start + 200000; i++) {
      if (html[i] === "{") depth++;
      if (html[i] === "}") depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }

    jsonObjects.push(html.substring(start, end));
    searchPos = end;
  }

  // Strategy 2: If strategy 1 failed, try extracting from escaped JSON
  // Sometimes Wise encodes the data as escaped JSON in a script tag
  if (jsonObjects.length === 0) {
    console.log("  Strategy 1 found nothing, trying escaped JSON...");

    // Look for patterns like \"countryCode\":\"PK\"
    const escapedMarker = '\\"countryCode\\":\\"';
    let pos = html.indexOf(escapedMarker);
    if (pos > -1) {
      // Find the enclosing string — go back to find the opening quote
      let strStart = pos;
      while (strStart > 0 && html[strStart] !== '"') strStart--;

      // Find the end of the string
      let strEnd = pos + 10;
      let escaped = false;
      while (strEnd < html.length) {
        if (escaped) { escaped = false; strEnd++; continue; }
        if (html[strEnd] === "\\") { escaped = true; strEnd++; continue; }
        if (html[strEnd] === '"') break;
        strEnd++;
      }

      const rawStr = html.substring(strStart + 1, strEnd);
      // Unescape the JSON string
      try {
        const unescaped = JSON.parse('"' + rawStr + '"');
        // Now try to extract country objects from the unescaped string
        let uPos = 0;
        while (true) {
          const uIdx = unescaped.indexOf('{"countryCode":"', uPos);
          if (uIdx === -1) break;

          let d = 0, e = uIdx;
          for (let i = uIdx; i < unescaped.length && i < uIdx + 200000; i++) {
            if (unescaped[i] === "{") d++;
            if (unescaped[i] === "}") d--;
            if (d === 0) { e = i + 1; break; }
          }
          jsonObjects.push(unescaped.substring(uIdx, e));
          uPos = e;
        }
        console.log(`  Found ${jsonObjects.length} objects in escaped JSON`);
      } catch {
        console.log("  Could not unescape JSON string");
      }
    }
  }

  // Strategy 3: Extract from each individual page during step 2 (fallback)

  console.log(`  Found ${jsonObjects.length} country JSON objects`);

  for (const jsonStr of jsonObjects) {

    try {
      const obj = JSON.parse(jsonStr);
      if (seen.has(obj.countryCode)) continue;
      seen.add(obj.countryCode);

      // Actual structure: countryCode, sepa, exampleIban (nested with digitalFormat + bbanFields),
      // bbanFields (top-level duplicate), banks, slug, currencyCode, supported
      const exampleIban =
        typeof obj.exampleIban === "string"
          ? obj.exampleIban
          : obj.exampleIban?.digitalFormat || "";

      const bbanFields = (obj.bbanFields || obj.exampleIban?.bbanFields || []).map(
        (f: { value: string; messageKey: string; regex: string; length: number; type: string }) => ({
          label: (f.messageKey || "").replace("bban.", ""),
          regex: f.regex || "",
          length: f.length || 0,
          type: f.type || "",
        })
      );

      const ibanLength = obj.ibanLength || (exampleIban ? exampleIban.replace(/\s/g, "").length : 0);

      results.push({
        slug: obj.slug || "",
        countryCode: obj.countryCode,
        countryName: "", // filled in later from page scraping
        sepa: obj.sepa,
        ibanLength,
        currency: obj.currencyCode || obj.currency || "",
        exampleIban,
        bbanFields,
        banks: (obj.banks || []).map(
          (b: { name: string; slug: string; logoAlias: string }) => ({
            name: b.name,
            slug: b.slug,
            logo: (b.logoAlias || "").replace(/\\u002F/g, "/"),
          })
        ),
      });
    } catch {
      // Skip malformed entries
    }
  }

  console.log(`  Extracted ${results.length} unique countries from embedded data`);
  return results;
}

// Scrape individual country pages for richer content (headings, descriptions, FAQs)
interface WiseCountryPage {
  slug: string;
  countryCode: string;
  title: string;
  description: string;
  sections: { heading: string; content: string }[];
  faqs: { question: string; answer: string }[];
}

async function scrapeCountryPage(
  slug: string,
  allCountries: WiseCountryData[]
): Promise<WiseCountryPage | null> {
  const url = `https://wise.com/gb/iban/${slug}`;
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    const title = $("h1").first().text().trim();
    const description = $("meta[name='description']").attr("content") || "";

    // Extract country code from the page data
    const codeMatch = html.match(/"countryCode":"([A-Z]{2})"/);
    const countryCode = codeMatch ? codeMatch[1] : slug.substring(0, 2).toUpperCase();

    // If this country isn't in allCountries yet, try to extract IBAN data from this page
    const existing = allCountries.find((c) => c.countryCode === countryCode);
    if (!existing) {
      const extracted = extractAllCountriesFromPage(html);
      // Find the matching country entry
      const match = extracted.find((c) => c.countryCode === countryCode);
      if (match) {
        match.slug = slug;
        match.countryName = title.replace(/\s*IBAN.*$/i, "").replace(/^IBAN\s*/i, "").trim();
        allCountries.push(match);
      }
    }

    // Extract content sections (h2 + following paragraphs)
    const sections: { heading: string; content: string }[] = [];
    $("h2").each((_, el) => {
      const heading = $(el).text().trim();
      let content = "";
      let next = $(el).next();
      while (next.length && !next.is("h2")) {
        const text = next.text().trim();
        if (text) content += text + "\n";
        next = next.next();
      }
      if (heading && content) {
        sections.push({ heading, content: content.trim() });
      }
    });

    // Extract FAQs (often in accordion/details elements)
    const faqs: { question: string; answer: string }[] = [];
    $("details, [data-testid*='faq'], .accordion-item").each((_, el) => {
      const q = $(el).find("summary, [data-testid*='question'], .accordion-header").text().trim();
      const a = $(el).find("p, [data-testid*='answer'], .accordion-body").text().trim();
      if (q && a) faqs.push({ question: q, answer: a });
    });

    return { slug, countryCode, title, description, sections, faqs };
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Wise IBAN Data Scraper ===\n");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Step 1: Scrape the main IBAN page to extract all country IBAN data from embedded JSON
  console.log("[1/2] Extracting country IBAN data from Wise...");
  const mainHtml = await fetchPage("https://wise.com/gb/iban/pakistan");
  const allCountries = extractAllCountriesFromPage(mainHtml);
  console.log(`  Extracted ${allCountries.length} countries with IBAN data\n`);

  // Step 2: Scrape individual country pages for content
  console.log("[2/2] Scraping individual country pages for content...");
  const countryPages: WiseCountryPage[] = [];
  let scraped = 0;

  for (const slug of COUNTRY_SLUGS) {
    await delay(DELAY_MS);
    const page = await scrapeCountryPage(slug, allCountries);
    if (page) {
      countryPages.push(page);
      scraped++;

      // Enrich allCountries with slug and name
      const match = allCountries.find((c) => c.countryCode === page.countryCode);
      if (match) {
        match.slug = slug;
        match.countryName = page.title.replace(/\s*IBAN.*$/i, "").replace(/^IBAN\s*/i, "").trim();
      }

      const bankCount = allCountries.find((c) => c.countryCode === page.countryCode)?.banks.length || 0;
      console.log(`    ${slug} (${page.countryCode}): ${page.sections.length} sections, ${bankCount} banks`);
    } else {
      console.log(`    ${slug}: failed`);
    }
  }

  console.log(`\n  Scraped ${scraped}/${COUNTRY_SLUGS.length} country pages`);

  // Write outputs
  const ibanDataPath = path.join(OUTPUT_DIR, "wise-iban-data.json");
  fs.writeFileSync(ibanDataPath, JSON.stringify(allCountries, null, 2));
  console.log(`\nWrote ${ibanDataPath} (${allCountries.length} countries)`);

  const pagesPath = path.join(OUTPUT_DIR, "wise-country-pages.json");
  fs.writeFileSync(pagesPath, JSON.stringify(countryPages, null, 2));
  console.log(`Wrote ${pagesPath} (${countryPages.length} pages)`);

  // Summary
  const totalBanks = allCountries.reduce((sum, c) => sum + c.banks.length, 0);
  const summary = {
    scrapedAt: new Date().toISOString(),
    source: "https://wise.com/gb/iban/",
    counts: {
      countries: allCountries.length,
      countryPages: countryPages.length,
      totalBanks,
    },
  };
  console.log(`\n=== Wise Scraping Complete ===`);
  console.log(JSON.stringify(summary.counts, null, 2));
}

main().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
