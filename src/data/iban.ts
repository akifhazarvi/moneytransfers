// Auto-generated from scraped data (npm run scrape && npm run generate-data)
// Source: https://www.iban.com/structure

export interface IbanStructure {
  country: string;
  code: string;
  sepa: boolean;
  length: number;
  accountCheck: boolean;
  branchCode: boolean;
  ibanExample: string;
}

import rawData from "./scraped/iban-structures.json";

export const ibanStructures: IbanStructure[] = rawData;

export function getIbanStructure(countryCode: string): IbanStructure | undefined {
  return ibanStructures.find(
    (s) => s.code.toUpperCase() === countryCode.toUpperCase()
  );
}

export function getSepaCountries(): IbanStructure[] {
  return ibanStructures.filter((s) => s.sepa);
}

export function getNonSepaCountries(): IbanStructure[] {
  return ibanStructures.filter((s) => !s.sepa);
}

/** Basic IBAN length validation for a given country */
export function validateIbanLength(iban: string): boolean {
  const code = iban.substring(0, 2).toUpperCase();
  const structure = getIbanStructure(code);
  if (!structure) return false;
  return iban.replace(/\s/g, "").length === structure.length;
}
