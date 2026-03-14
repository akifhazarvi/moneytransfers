import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://www.iban.com";
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "scraped");

const DELAY_MS = 1000; // polite delay between requests

async function fetchPage(url: string): Promise<string> {
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

/** Fetch a page, returning null instead of throwing on failure */
async function tryFetchPage(url: string): Promise<string | null> {
  try {
    return await fetchPage(url);
  } catch {
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// -------------------------------------------------------------------
// 1. Country Codes (ISO 3166)
// -------------------------------------------------------------------
interface CountryCode {
  country: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
}

async function scrapeCountryCodes(): Promise<CountryCode[]> {
  console.log("\n[1/7] Scraping country codes...");
  const html = await fetchPage(`${BASE_URL}/country-codes`);
  const $ = cheerio.load(html);
  const results: CountryCode[] = [];

  $("table#myTable tbody tr, table.table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 4) {
      results.push({
        country: $(cells[0]).text().trim(),
        alpha2: $(cells[1]).text().trim(),
        alpha3: $(cells[2]).text().trim(),
        numeric: $(cells[3]).text().trim(),
      });
    }
  });

  if (results.length === 0) {
    $("table tbody tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 4) {
        results.push({
          country: $(cells[0]).text().trim(),
          alpha2: $(cells[1]).text().trim(),
          alpha3: $(cells[2]).text().trim(),
          numeric: $(cells[3]).text().trim(),
        });
      }
    });
  }

  console.log(`  Found ${results.length} country codes`);
  return results;
}

// -------------------------------------------------------------------
// 2. Currency Codes (ISO 4217)
// -------------------------------------------------------------------
interface CurrencyCode {
  country: string;
  currency: string;
  code: string;
  number: string;
}

async function scrapeCurrencyCodes(): Promise<CurrencyCode[]> {
  console.log("\n[2/7] Scraping currency codes...");
  const html = await fetchPage(`${BASE_URL}/currency-codes`);
  const $ = cheerio.load(html);
  const results: CurrencyCode[] = [];

  $("table#myTable tbody tr, table.table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 4) {
      results.push({
        country: $(cells[0]).text().trim(),
        currency: $(cells[1]).text().trim(),
        code: $(cells[2]).text().trim(),
        number: $(cells[3]).text().trim(),
      });
    }
  });

  if (results.length === 0) {
    $("table tbody tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 4) {
        results.push({
          country: $(cells[0]).text().trim(),
          currency: $(cells[1]).text().trim(),
          code: $(cells[2]).text().trim(),
          number: $(cells[3]).text().trim(),
        });
      }
    });
  }

  console.log(`  Found ${results.length} currency codes`);
  return results;
}

// -------------------------------------------------------------------
// 3. IBAN Structures / Formats
// -------------------------------------------------------------------
interface IbanStructure {
  country: string;
  code: string;
  sepa: boolean;
  length: number;
  accountCheck: boolean;
  branchCode: boolean;
  ibanExample: string;
}

async function scrapeIbanStructures(): Promise<IbanStructure[]> {
  console.log("\n[3/7] Scraping IBAN structures...");
  const html = await fetchPage(`${BASE_URL}/structure`);
  const $ = cheerio.load(html);
  const results: IbanStructure[] = [];

  $("table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 7) {
      results.push({
        country: $(cells[0]).text().trim(),
        code: $(cells[1]).text().trim(),
        sepa: $(cells[2]).text().trim().toLowerCase() === "yes",
        length: parseInt($(cells[3]).text().trim(), 10) || 0,
        accountCheck: $(cells[4]).find("i, svg, span").length > 0 || $(cells[4]).text().trim() !== "",
        branchCode: $(cells[5]).find("i, svg, span").length > 0 || $(cells[5]).text().trim() !== "",
        ibanExample: $(cells[6]).text().trim(),
      });
    }
  });

  console.log(`  Found ${results.length} IBAN structures`);
  return results;
}

// -------------------------------------------------------------------
// 4. Exchange Rates (EUR-based from ECB)
// -------------------------------------------------------------------
interface ExchangeRate {
  currencyCode: string;
  currencyName: string;
  ratePerEur: number;
}

async function scrapeExchangeRates(): Promise<ExchangeRate[]> {
  console.log("\n[4/7] Scraping exchange rates...");
  const html = await fetchPage(`${BASE_URL}/exchange-rates`);
  const $ = cheerio.load(html);
  const results: ExchangeRate[] = [];

  $("table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 3) {
      const code = $(cells[0]).text().trim();
      const name = $(cells[1]).text().trim();
      const rateText = $(cells[2]).text().trim();
      const rate = parseFloat(rateText);

      if (code && !isNaN(rate)) {
        results.push({
          currencyCode: code,
          currencyName: name,
          ratePerEur: rate,
        });
      }
    }
  });

  console.log(`  Found ${results.length} exchange rates`);
  return results;
}

// -------------------------------------------------------------------
// 5. Bank Details (from country pages + localized sites)
// -------------------------------------------------------------------
interface BankInfo {
  country: string;
  countryCode: string;
  bic: string;
  bankName: string;
  sepaCredit: boolean;
  sepaDebit: boolean;
}

// Only Germany and UK have public country pages with BIC/bank tables.
// Other countries' bank data is behind iban.com's paid API.
const COUNTRY_PAGES: { name: string; code: string; url: string }[] = [
  { name: "Germany", code: "DE", url: `${BASE_URL}/country/germany` },
  { name: "United Kingdom", code: "GB", url: `${BASE_URL}/country/united-kingdom` },
];

function extractBanksFromPage(
  html: string,
  country: { name: string; code: string }
): BankInfo[] {
  const page$ = cheerio.load(html);
  const banks: BankInfo[] = [];

  const tables = page$("table");
  tables.each((_, table) => {
    const headers = page$(table)
      .find("thead th, thead td")
      .map((__, el) => page$(el).text().trim().toLowerCase())
      .get();

    // Match tables with BIC/SWIFT + BANK columns (multi-language support)
    const hasBicCol = headers.some(
      (h) => h.includes("bic") || h.includes("swift")
    );
    const hasBankCol = headers.some(
      (h) => h.includes("bank") || h.includes("banque") || h.includes("banca") || h.includes("nombre")
    );
    if (!hasBicCol || !hasBankCol) return;

    // Determine column positions from headers
    const bicIdx = headers.findIndex((h) => h.includes("bic") || h.includes("swift"));
    const bankIdx = headers.findIndex(
      (h) => h.includes("bank") || h.includes("banque") || h.includes("banca") || h.includes("nombre")
    );
    const sepaCreditIdx = headers.findIndex((h) => h.includes("credit"));
    const sepaDebitIdx = headers.findIndex((h) => h.includes("debit") || h.includes("débit"));

    page$(table)
      .find("tbody tr")
      .each((__, row) => {
        const cells = page$(row).find("td");
        if (cells.length < 2) return;

        const bic = page$(cells[bicIdx >= 0 ? bicIdx : 0]).text().trim();
        const bankName = page$(cells[bankIdx >= 0 ? bankIdx : 1]).text().trim();
        const sepaCredit =
          sepaCreditIdx >= 0
            ? page$(cells[sepaCreditIdx]).text().trim().toUpperCase() === "YES"
            : false;
        const sepaDebit =
          sepaDebitIdx >= 0
            ? page$(cells[sepaDebitIdx]).text().trim().toUpperCase() === "YES"
            : false;

        // BIC codes are 8 or 11 characters, alphanumeric
        if (!bic || !/^[A-Z0-9]{8,11}$/i.test(bic)) return;

        banks.push({
          country: country.name,
          countryCode: country.code,
          bic,
          bankName,
          sepaCredit,
          sepaDebit,
        });
      });
  });

  return banks;
}

async function scrapeBankDetails(): Promise<BankInfo[]> {
  console.log("\n[5/7] Scraping bank details from country pages...");
  console.log(`  ${COUNTRY_PAGES.length} countries with public bank data`);

  const allBanks: BankInfo[] = [];
  const seenBics = new Set<string>();

  for (const country of COUNTRY_PAGES) {
    await delay(DELAY_MS);
    const html = await tryFetchPage(country.url);
    if (!html) {
      console.log(`    ${country.name} (${country.code}): failed to fetch`);
      continue;
    }

    const banks = extractBanksFromPage(html, country);
    let added = 0;
    for (const bank of banks) {
      if (!seenBics.has(bank.bic)) {
        seenBics.add(bank.bic);
        allBanks.push(bank);
        added++;
      }
    }
    console.log(`    ${country.name} (${country.code}): ${added} banks`);
  }

  console.log(`  Found ${allBanks.length} unique bank entries total`);
  return allBanks;
}

// -------------------------------------------------------------------
// 6. Dialing Codes
// -------------------------------------------------------------------
interface DialingCode {
  country: string;
  countryCode: string;
  internationalPrefix: string;
  nationalPrefix: string;
  nationalNumber: string;
  utcDst: string;
}

async function scrapeDialingCodes(): Promise<DialingCode[]> {
  console.log("\n[6/7] Scraping dialing codes...");
  const html = await fetchPage(`${BASE_URL}/dialing-codes`);
  const $ = cheerio.load(html);
  const results: DialingCode[] = [];

  $("table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 6) {
      results.push({
        country: $(cells[0]).text().trim(),
        countryCode: $(cells[1]).text().trim(),
        internationalPrefix: $(cells[2]).text().trim(),
        nationalPrefix: $(cells[3]).text().trim(),
        nationalNumber: $(cells[4]).text().trim(),
        utcDst: $(cells[5]).text().trim(),
      });
    }
  });

  console.log(`  Found ${results.length} dialing codes`);
  return results;
}

// -------------------------------------------------------------------
// 7. Test IBANs
// -------------------------------------------------------------------
interface TestIban {
  iban: string;
  valid: boolean;
  reason: string;
}

async function scrapeTestIbans(): Promise<TestIban[]> {
  console.log("\n[7/7] Scraping test IBANs...");
  const html = await fetchPage(`${BASE_URL}/testibans`);
  const $ = cheerio.load(html);
  const results: TestIban[] = [];

  $("table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 3) {
      const iban = $(cells[0]).text().trim();
      const validText = $(cells[1]).text().trim().toLowerCase();
      const reason = $(cells[2]).text().trim();

      if (iban && iban.length > 5) {
        results.push({
          iban,
          valid: validText === "valid" || validText === "yes",
          reason,
        });
      }
    }
  });

  console.log(`  Found ${results.length} test IBANs`);
  return results;
}

// -------------------------------------------------------------------
// Main
// -------------------------------------------------------------------
async function main() {
  console.log("=== IBAN.com Extended Data Scraper ===");
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Run scrapers sequentially (be polite to the server)
  const countryCodes = await scrapeCountryCodes();
  await delay(DELAY_MS);

  const currencyCodes = await scrapeCurrencyCodes();
  await delay(DELAY_MS);

  const ibanStructures = await scrapeIbanStructures();
  await delay(DELAY_MS);

  const exchangeRates = await scrapeExchangeRates();
  await delay(DELAY_MS);

  const bankDetails = await scrapeBankDetails();
  await delay(DELAY_MS);

  const dialingCodes = await scrapeDialingCodes();
  await delay(DELAY_MS);

  const testIbans = await scrapeTestIbans();

  // Write output files
  const files = [
    { name: "country-codes.json", data: countryCodes },
    { name: "currency-codes.json", data: currencyCodes },
    { name: "iban-structures.json", data: ibanStructures },
    { name: "exchange-rates.json", data: exchangeRates },
    { name: "bank-details.json", data: bankDetails },
    { name: "dialing-codes.json", data: dialingCodes },
    { name: "test-ibans.json", data: testIbans },
  ];

  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file.name);
    fs.writeFileSync(filePath, JSON.stringify(file.data, null, 2));
    console.log(`\nWrote ${filePath} (${(file.data as unknown[]).length} entries)`);
  }

  const summary = {
    scrapedAt: new Date().toISOString(),
    source: "https://www.iban.com",
    counts: {
      countryCodes: countryCodes.length,
      currencyCodes: currencyCodes.length,
      ibanStructures: ibanStructures.length,
      exchangeRates: exchangeRates.length,
      bankDetails: bankDetails.length,
      dialingCodes: dialingCodes.length,
      testIbans: testIbans.length,
    },
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));

  console.log("\n=== Scraping Complete ===");
  console.log(JSON.stringify(summary.counts, null, 2));
}

main().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
