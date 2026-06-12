/**
 * Fill Missing SWIFT Codes
 *
 * Backfills countries in src/data/scraped/swift-codes.json that have a bank
 * list but zero branches (no actual SWIFT/BIC codes). The original Wise
 * scraper never returned branch data for these ~27 countries, so their
 * /swift-codes/[country] pages render without any codes.
 *
 * Source: PeterNotenboom/SwiftCodes public dataset (per-country JSON of
 * bank name, city, branch and SWIFT code, compiled from public registries).
 * https://github.com/PeterNotenboom/SwiftCodes
 *
 * Only countries with branches.length === 0 are touched; everything else is
 * left exactly as scraped. Run: npx tsx scripts/fill-missing-swift-codes.ts
 */
import * as fs from "fs";
import * as path from "path";

const DATA_FILE = path.join(__dirname, "..", "src", "data", "scraped", "swift-codes.json");
const SOURCE_BASE = "https://raw.githubusercontent.com/PeterNotenboom/SwiftCodes/master/AllCountries";
const DELAY_MS = 500;

// 8 chars = bank + country + location, optional 3-char branch suffix
const BIC_RE = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

interface SourceEntry {
  id: number;
  bank: string | null;
  city: string | null;
  branch: string | null;
  swift_code: string | null;
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

interface SwiftCountry {
  slug: string;
  name: string;
  countryCode: string;
  currencyCode: string;
  bankCount: number;
  banks: { name: string; slug: string }[];
  branches: SwiftBranch[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toBranch(entry: SourceEntry, countryCode: string): SwiftBranch | null {
  const code = (entry.swift_code || "").toUpperCase().trim();
  if (!BIC_RE.test(code)) return null;
  if (code.slice(4, 6) !== countryCode.toUpperCase()) return null;
  const bankName = (entry.bank || "").trim();
  if (!bankName) return null;

  // An 8-char BIC is the head office; XXX is its canonical 11-char form
  const bic11 = code.length === 11 ? code : `${code}XXX`;
  const branchCode = bic11.slice(8);
  // Source has no street addresses; surface the branch descriptor instead
  // so users can tell which branch a code belongs to.
  const branchNote = (entry.branch || "").trim().replace(/^\(|\)$/g, "").trim();

  return {
    bankName,
    bankSlug: slugify(bankName),
    city: (entry.city || "").trim(),
    bic11,
    bic8: bic11.slice(0, 8),
    bankCode: bic11.slice(0, 4),
    countryCode: bic11.slice(4, 6),
    locationCode: bic11.slice(6, 8),
    branchCode,
    headOffice: branchCode === "XXX",
    address: branchNote,
  };
}

async function fetchCountry(countryCode: string): Promise<SourceEntry[] | null> {
  const url = `${SOURCE_BASE}/${countryCode.toUpperCase()}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ✗ ${url} -> HTTP ${res.status}`);
    return null;
  }
  const json = (await res.json()) as { list?: SourceEntry[] };
  return json.list ?? null;
}

async function main() {
  const countries = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as SwiftCountry[];
  const missing = countries.filter((c) => c.branches.length === 0);
  console.log(`${countries.length} countries total, ${missing.length} without branch data\n`);

  let filled = 0;
  for (const country of missing) {
    console.log(`${country.name} (${country.countryCode})`);
    const list = await fetchCountry(country.countryCode);
    await delay(DELAY_MS);
    if (!list || list.length === 0) {
      console.warn(`  ✗ no source data, leaving as-is`);
      continue;
    }

    const seen = new Set<string>();
    const branches: SwiftBranch[] = [];
    for (const entry of list) {
      const branch = toBranch(entry, country.countryCode);
      if (!branch || seen.has(branch.bic11)) continue;
      seen.add(branch.bic11);
      branches.push(branch);
    }
    if (branches.length === 0) {
      console.warn(`  ✗ no valid BICs after filtering, leaving as-is`);
      continue;
    }

    branches.sort(
      (a, b) =>
        a.bankName.localeCompare(b.bankName) ||
        Number(b.headOffice) - Number(a.headOffice) ||
        a.bic11.localeCompare(b.bic11)
    );

    // Rebuild the bank list from the branches so counts stay consistent
    const bankMap = new Map<string, string>();
    for (const b of branches) {
      if (!bankMap.has(b.bankSlug)) bankMap.set(b.bankSlug, b.bankName);
    }
    country.branches = branches;
    country.banks = Array.from(bankMap, ([slug, name]) => ({ name, slug }));
    country.bankCount = country.banks.length;
    filled++;
    console.log(`  ✓ ${branches.length} codes across ${country.bankCount} banks`);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(countries, null, 2) + "\n");
  console.log(`\nFilled ${filled}/${missing.length} countries -> ${DATA_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
