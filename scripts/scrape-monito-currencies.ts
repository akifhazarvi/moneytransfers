/**
 * Monito Currency & Corridor List Scraper
 *
 * Extracts all supported corridors from Monito's sitemaps and the Nuxt app state.
 * Sources:
 *   1. corridor-en-sitemap.xml — all English corridor pages
 *   2. currency-en-sitemap.xml — all currency pages
 *   3. country-sitemap.xml — all country pages
 *   4. __NUXT__ window state — dropdown data with country/currency lists
 */
import * as fs from "fs";
import * as path from "path";
import { setupBrowserContext, dismissOverlays, delay, NAV_TIMEOUT } from "./lib/browser";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");

async function fetchSitemapUrls(page: Awaited<ReturnType<Awaited<ReturnType<typeof setupBrowserContext>>["newPage"]>>, url: string): Promise<string[]> {
  console.log(`  Loading sitemap: ${url}`);
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await delay(2000);
    const content = await page.evaluate(() => document.documentElement?.outerHTML || "");
    // Extract all <loc> URLs
    const matches = content.match(/<loc>([^<]+)<\/loc>/g) || [];
    return matches.map(m => m.replace(/<\/?loc>/g, ""));
  } catch (e) {
    console.log(`    Error: ${(e as Error).message?.slice(0, 80)}`);
    return [];
  }
}

async function main() {
  console.log("=== Monito Currency & Corridor List Scraper ===\n");

  const context = await setupBrowserContext();
  const page = await context.newPage();

  try {
    // 1. Load corridor sitemap
    const corridorUrls = await fetchSitemapUrls(page, "https://www.monito.com/corridor-en-sitemap.xml");
    console.log(`  Corridor URLs: ${corridorUrls.length}`);

    // 2. Load currency sitemap
    const currencyUrls = await fetchSitemapUrls(page, "https://www.monito.com/currency-en-sitemap.xml");
    console.log(`  Currency URLs: ${currencyUrls.length}`);

    // 3. Load country sitemap
    const countryUrls = await fetchSitemapUrls(page, "https://www.monito.com/country-sitemap.xml");
    console.log(`  Country URLs: ${countryUrls.length}`);

    // Parse corridor URLs: /send-money/{from-country}/{to-country}/{fromCur}/{toCur}
    const corridors: { fromCountry: string; toCountry: string; fromCurrency: string; toCurrency: string }[] = [];
    const sendCountryNames = new Set<string>();
    const receiveCountryNames = new Set<string>();
    const sendCurrencies = new Set<string>();
    const receiveCurrencies = new Set<string>();

    for (const u of corridorUrls) {
      // Pattern: /send-money/{from}/{to}/{cur1}/{cur2}
      const match = u.match(/\/send-money\/([^/]+)\/([^/]+)\/([a-z]{3})\/([a-z]{3})/i);
      if (match) {
        const [, fromC, toC, fromCur, toCur] = match;
        corridors.push({
          fromCountry: fromC,
          toCountry: toC,
          fromCurrency: fromCur.toUpperCase(),
          toCurrency: toCur.toUpperCase(),
        });
        sendCountryNames.add(fromC);
        receiveCountryNames.add(toC);
        sendCurrencies.add(fromCur.toUpperCase());
        receiveCurrencies.add(toCur.toUpperCase());
      }
    }

    // Parse currency URLs: e.g. /en/wiki/convert/{cur1}-to-{cur2}
    const currencyPairs: { from: string; to: string; url: string }[] = [];
    const allCurrencies = new Set<string>();

    for (const u of currencyUrls) {
      // Various patterns
      const convertMatch = u.match(/\/convert\/([a-z]{3})-to-([a-z]{3})/i);
      if (convertMatch) {
        currencyPairs.push({ from: convertMatch[1].toUpperCase(), to: convertMatch[2].toUpperCase(), url: u });
        allCurrencies.add(convertMatch[1].toUpperCase());
        allCurrencies.add(convertMatch[2].toUpperCase());
      }
      // Also: /en/wiki/{currency-name} pages
      const wikiMatch = u.match(/\/wiki\/([a-z]{3})(?:\/|$)/i);
      if (wikiMatch) {
        allCurrencies.add(wikiMatch[1].toUpperCase());
      }
    }

    // Parse country URLs
    const countries: { name: string; url: string }[] = [];
    for (const u of countryUrls) {
      const match = u.match(/\/country\/([^/]+)/);
      if (match) {
        countries.push({ name: match[1], url: u });
      }
    }

    // 4. Load a comparison page and extract __NUXT__ data for dropdown options
    console.log("\n--- Extracting Nuxt App State ---");
    await page.goto("https://www.monito.com/en/compare/transfer/us/in/usd/inr/1000", {
      waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT
    });
    await delay(6000);
    await dismissOverlays(page);

    let nuxtCountryCurrencyData: Record<string, unknown> | null = null;
    try {
      nuxtCountryCurrencyData = await page.evaluate(() => {
        try {
          const w = window as unknown as Record<string, unknown>;
          const nuxt = w["__NUXT__"] as Record<string, unknown> | null;
          if (!nuxt) return null;

          const results: Record<string, unknown> = {};
          const seen = new WeakSet();

          const search = (obj: unknown, p: string, d: number): void => {
            if (d > 6 || !obj || typeof obj !== "object") return;
            if (seen.has(obj as object)) return;
            seen.add(obj as object);

            if (Array.isArray(obj)) {
              if (obj.length > 5 && obj[0] && typeof obj[0] === "object") {
                const keys = Object.keys(obj[0]);
                if (keys.some(k => /country|name|code|currency|iso/i.test(k))) {
                  results[p] = obj.slice(0, 300);
                }
              }
              return;
            }

            const entries = Object.entries(obj as Record<string, unknown>);
            for (const [key, value] of entries) {
              if (/countr|currenc|corridor|available|options/i.test(key)) {
                if (Array.isArray(value) && value.length > 0) {
                  results[p + "." + key] = (value as unknown[]).slice(0, 300);
                } else if (value && typeof value === "object") {
                  search(value, p + "." + key, d + 1);
                }
              }
              if (/^(data|state|payload|config)$/.test(key)) {
                search(value, p + "." + key, d + 1);
              }
            }
          };

          search(nuxt, "nuxt", 0);
          return results;
        } catch {
          return null;
        }
      });
    } catch (e) {
      console.log(`  Nuxt extraction failed: ${(e as Error).message?.slice(0, 80)}`);
    }

    console.log(`Nuxt state entries found: ${nuxtCountryCurrencyData ? Object.keys(nuxtCountryCurrencyData).length : 0}`);

    // Deduplicate corridors
    const uniqueCorridors = new Map<string, typeof corridors[number]>();
    for (const c of corridors) {
      const key = `${c.fromCountry}|${c.toCountry}|${c.fromCurrency}|${c.toCurrency}`;
      uniqueCorridors.set(key, c);
    }

    // Build final output
    const output = {
      scrapedAt: new Date().toISOString(),
      source: "monito.com",
      summary: {
        totalUniqueCorridors: uniqueCorridors.size,
        totalCurrencyPairs: currencyPairs.length,
        totalCountryPages: countries.length,
        sendCountries: [...sendCountryNames].sort(),
        receiveCountries: [...receiveCountryNames].sort(),
        sendCurrencies: [...sendCurrencies].sort(),
        receiveCurrencies: [...receiveCurrencies].sort(),
        allCurrenciesFromCurrencyPages: [...allCurrencies].sort(),
        sendCountryCount: sendCountryNames.size,
        receiveCountryCount: receiveCountryNames.size,
        sendCurrencyCount: sendCurrencies.size,
        receiveCurrencyCount: receiveCurrencies.size,
      },
      corridors: [...uniqueCorridors.values()].sort((a, b) => {
        if (a.fromCountry !== b.fromCountry) return a.fromCountry.localeCompare(b.fromCountry);
        if (a.toCountry !== b.toCountry) return a.toCountry.localeCompare(b.toCountry);
        return a.fromCurrency.localeCompare(b.fromCurrency);
      }),
      currencyConversionPages: currencyPairs.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)),
      countryPages: countries.sort((a, b) => a.name.localeCompare(b.name)),
      nuxtAppState: nuxtCountryCurrencyData,
      rawSitemapCounts: {
        corridorSitemap: corridorUrls.length,
        currencySitemap: currencyUrls.length,
        countrySitemap: countryUrls.length,
      },
    };

    // Write output
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const outputPath = path.join(OUTPUT_DIR, "monito-currencies.json");
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    // Print summary
    console.log(`\n=== Results ===`);
    console.log(`Unique corridors: ${uniqueCorridors.size}`);
    console.log(`Send countries (${sendCountryNames.size}): ${[...sendCountryNames].sort().join(", ")}`);
    console.log(`Receive countries (${receiveCountryNames.size}): ${[...receiveCountryNames].sort().join(", ")}`);
    console.log(`Send currencies (${sendCurrencies.size}): ${[...sendCurrencies].sort().join(", ")}`);
    console.log(`Receive currencies (${receiveCurrencies.size}): ${[...receiveCurrencies].sort().join(", ")}`);
    console.log(`Currency conversion pages: ${currencyPairs.length}`);
    console.log(`Country pages: ${countries.length}`);
    console.log(`All currencies from conversion pages: ${[...allCurrencies].sort().join(", ")}`);
    console.log(`\nWritten to: ${outputPath}`);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await page.close();
    await context.browser()?.close();
  }
}

main().catch(err => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
