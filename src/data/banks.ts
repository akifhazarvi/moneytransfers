// Auto-generated from scraped data (npm run scrape && npm run generate-data)
// Source: https://www.iban.com/country/{country}

export interface BankInfo {
  country: string;
  countryCode: string;
  bic: string;
  bankName: string;
  sepaCredit: boolean;
  sepaDebit: boolean;
}

import rawData from "./scraped/bank-details.json";

export const banks: BankInfo[] = rawData;

export function getBankByBic(bic: string): BankInfo | undefined {
  return banks.find((b) => b.bic.toUpperCase() === bic.toUpperCase());
}

export function getBanksByCountry(countryCode: string): BankInfo[] {
  return banks.filter(
    (b) => b.countryCode.toUpperCase() === countryCode.toUpperCase()
  );
}

export function searchBanks(query: string): BankInfo[] {
  const q = query.toLowerCase();
  return banks.filter(
    (b) =>
      b.bankName.toLowerCase().includes(q) ||
      b.bic.toLowerCase().includes(q)
  );
}
