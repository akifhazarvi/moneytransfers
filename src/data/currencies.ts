// Auto-generated from scraped data (npm run scrape && npm run generate-data)
// Source: https://www.iban.com/currency-codes (ISO 4217)

export interface CurrencyCode {
  country: string;
  currency: string;
  code: string;
  number: string;
}

import rawData from "./scraped/currency-codes.json";

export const currencyCodes: CurrencyCode[] = rawData;

/** Get all unique currency codes with their names */
export function getUniqueCurrencies(): { code: string; currency: string }[] {
  const seen = new Map<string, string>();
  for (const entry of currencyCodes) {
    if (entry.code && !seen.has(entry.code)) {
      seen.set(entry.code, entry.currency);
    }
  }
  return Array.from(seen.entries()).map(([code, currency]) => ({
    code,
    currency,
  }));
}

/** Get all currencies used by a specific country */
export function getCurrenciesByCountry(country: string): CurrencyCode[] {
  const q = country.toLowerCase();
  return currencyCodes.filter((c) => c.country.toLowerCase().includes(q));
}

/** Get all countries that use a specific currency code */
export function getCountriesByCurrency(code: string): CurrencyCode[] {
  return currencyCodes.filter(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );
}
