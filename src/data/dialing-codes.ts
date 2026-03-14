// Auto-generated from scraped data (npm run scrape)
// Source: https://www.iban.com/dialing-codes

export interface DialingCode {
  country: string;
  countryCode: string;
  internationalPrefix: string;
  nationalPrefix: string;
  nationalNumber: string;
  utcDst: string;
}

import rawData from "./scraped/dialing-codes.json";

export const dialingCodes: DialingCode[] = rawData;

export function getDialingCode(country: string): DialingCode | undefined {
  const q = country.toLowerCase();
  return dialingCodes.find((d) => d.country.toLowerCase().includes(q));
}

export function getDialingCodeByCode(code: string): DialingCode[] {
  return dialingCodes.filter((d) => d.countryCode === code);
}
