// Scraped from Wise SWIFT/BIC code pages (npm run scrape:swift)
// Source: https://wise.com/gb/swift-codes/countries/{country}

export interface SwiftBranch {
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

export interface SwiftBank {
  name: string;
  slug: string;
}

export interface SwiftCountry {
  slug: string;
  name: string;
  countryCode: string;
  currencyCode: string;
  bankCount: number;
  banks: SwiftBank[];
  branches: SwiftBranch[];
}

let _data: SwiftCountry[] | null = null;

/**
 * Registry spellings tidied for display (round-3 QA, 2026-10-09): a name the
 * registry wraps in quotes ("'BANK MOSCOW-MINSK' JSC", 20 banks) loses the
 * quotes, and a word glued to a closing parenthesis ("ALBARAKA BANK
 * (PAKISTAN)LIMITED", 8) gets its space. Only a LEADING quoted name is
 * unwrapped, so possessives such as "PEOPLE'S BANK" keep their apostrophe.
 * Slugs and codes are untouched — URLs and BICs do not change.
 */
function tidyBankName(name: string): string {
  return name
    .replace(/^\s*['‘’"]+\s*(.+?)['‘’"]+(?=\s|,|$)/, "$1")
    .replace(/\)(?=[A-Za-z])/g, ") ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function loadData(): SwiftCountry[] {
  if (_data) return _data;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require("./scraped/swift-codes.json") as SwiftCountry[];
    _data = raw.map((c) => ({
      ...c,
      banks: c.banks.map((b) => ({ ...b, name: tidyBankName(b.name) })),
      branches: (c.branches ?? []).map((br) => ({ ...br, bankName: tidyBankName(br.bankName) })),
    }));
  } catch {
    _data = [];
  }
  return _data;
}

export function getSwiftCountries(): SwiftCountry[] {
  return loadData();
}

export function getSwiftCountryBySlug(slug: string): SwiftCountry | undefined {
  return loadData().find((c) => c.slug === slug);
}

export function getSwiftCountryByCode(code: string): SwiftCountry | undefined {
  return loadData().find(
    (c) => c.countryCode.toUpperCase() === code.toUpperCase()
  );
}

export function getSwiftBankBranches(
  countrySlug: string,
  bankSlug: string
): SwiftBranch[] {
  const country = getSwiftCountryBySlug(countrySlug);
  if (!country) return [];
  return country.branches.filter((b) => b.bankSlug === bankSlug);
}

export function searchSwiftCode(bic: string): SwiftBranch | undefined {
  const code = bic.toUpperCase().replace(/\s/g, "");
  for (const country of loadData()) {
    const branch = country.branches.find(
      (b) => b.bic11 === code || b.bic8 === code
    );
    if (branch) return branch;
  }
  return undefined;
}

export function getAllSwiftBanks(): (SwiftBank & { countrySlug: string; countryCode: string; countryName: string })[] {
  return loadData().flatMap((c) =>
    c.banks.map((b) => ({
      ...b,
      countrySlug: c.slug,
      countryCode: c.countryCode,
      countryName: c.name,
    }))
  );
}
