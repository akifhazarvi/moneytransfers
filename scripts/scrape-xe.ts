/**
 * XE Mid-Market Rate Scraper
 *
 * XE exposes mid-market exchange rates via:
 * GET https://www.xe.com/api/protected/midmarket-converter/
 *
 * Returns ALL currency rates in a single call. This gives us the
 * benchmark mid-market rate for calculating provider markups.
 *
 * Note: XE's actual transfer rates (with markup) require login,
 * so we only scrape mid-market rates here.
 */
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");

interface XERates {
  baseCurrency: string;
  timestamp: string;
  rates: Record<string, number>;
  source: string;
}

async function fetchXERates(): Promise<XERates | null> {
  const url = "https://www.xe.com/api/protected/midmarket-converter/";

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
        // XE requires an authorization header for their "protected" API
        // It's a static public key embedded in their frontend
        Authorization: "Basic bG9kZXN0YXI6cHVnc25heA==",
      },
    });

    if (!res.ok) {
      console.log(`⚠ XE API returned ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    if (!data.rates) return null;

    return {
      baseCurrency: "USD",
      timestamp: new Date(data.timestamp).toISOString(),
      rates: data.rates,
      source: "xe-midmarket-api",
    };
  } catch (err) {
    console.log(`⚠ Failed: ${(err as Error).message?.slice(0, 60)}`);
    return null;
  }
}

async function main() {
  console.log("=== XE Mid-Market Rate Scraper ===\n");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const startTime = Date.now();

  const rates = await fetchXERates();

  if (rates) {
    const outputPath = path.join(OUTPUT_DIR, "xe-midmarket-rates.json");
    fs.writeFileSync(outputPath, JSON.stringify(rates, null, 2));

    const currencyCount = Object.keys(rates.rates).length;
    console.log(`✓ Fetched ${currencyCount} currency rates`);
    console.log(`  Timestamp: ${rates.timestamp}`);
    console.log(`  Base: ${rates.baseCurrency}`);

    // Print key rates
    const keyCurrencies = ["INR", "PHP", "MXN", "EUR", "GBP", "NGN", "PKR", "BDT", "BRL", "CAD", "AUD", "AED"];
    console.log("\n  Key rates (1 USD =):");
    for (const curr of keyCurrencies) {
      if (rates.rates[curr]) {
        console.log(`    ${curr}: ${rates.rates[curr]}`);
      }
    }

    console.log(`\nWrote ${outputPath}`);
  } else {
    console.log("✗ Failed to fetch XE rates");
    process.exit(1);
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`Duration: ${elapsed}s`);
}

main().catch((err) => {
  console.error("XE scraper failed:", err);
  process.exit(1);
});
