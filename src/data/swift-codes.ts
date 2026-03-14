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

function loadData(): SwiftCountry[] {
  if (_data) return _data;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _data = require("./scraped/swift-codes.json") as SwiftCountry[];
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
