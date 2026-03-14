// Auto-generated from scraped data (npm run scrape)
// Source: https://www.iban.com/testibans

export interface TestIban {
  iban: string;
  valid: boolean;
  reason: string;
}

import rawData from "./scraped/test-ibans.json";

export const testIbans: TestIban[] = rawData;

export function getValidTestIbans(): TestIban[] {
  return testIbans.filter((t) => t.valid);
}

export function getInvalidTestIbans(): TestIban[] {
  return testIbans.filter((t) => !t.valid);
}
