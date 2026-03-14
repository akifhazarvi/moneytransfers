// Auto-generated from scraped data (npm run scrape && npm run generate-data)
// Source: https://www.iban.com/country-codes (ISO 3166)

export interface CountryCode {
  country: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
}

import rawData from "./scraped/country-codes.json";

export const countryCodes: CountryCode[] = rawData;

export function getCountryByAlpha2(code: string): CountryCode | undefined {
  return countryCodes.find((c) => c.alpha2 === code.toUpperCase());
}

export function getCountryByAlpha3(code: string): CountryCode | undefined {
  return countryCodes.find((c) => c.alpha3 === code.toUpperCase());
}

export function searchCountries(query: string): CountryCode[] {
  const q = query.toLowerCase();
  return countryCodes.filter(
    (c) =>
      c.country.toLowerCase().includes(q) ||
      c.alpha2.toLowerCase() === q ||
      c.alpha3.toLowerCase() === q
  );
}
