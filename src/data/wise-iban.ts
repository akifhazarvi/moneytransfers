// Scraped from Wise IBAN pages (npm run scrape:wise)
// Source: https://wise.com/gb/iban/{country}

export interface WiseBankInfo {
  name: string;
  slug: string;
  logo: string;
}

export interface WiseBbanField {
  label: string;
  regex: string;
  length: number;
  type: string;
}

export interface WiseCountryIban {
  slug: string;
  countryCode: string;
  countryName: string;
  sepa: boolean;
  ibanLength: number;
  currency: string;
  exampleIban: string;
  bbanFields: WiseBbanField[];
  banks: WiseBankInfo[];
}

export interface WiseCountryPage {
  slug: string;
  countryCode: string;
  title: string;
  description: string;
  sections: { heading: string; content: string }[];
  faqs: { question: string; answer: string }[];
}

import ibanData from "./scraped/wise-iban-data.json";
import pageData from "./scraped/wise-country-pages.json";
import { displayBankList } from "@/lib/bank-display-name";

/**
 * Bank names are cleaned on read, not in the scraped file (CLAUDE.md rule 9):
 * the registry's "Ing Belgium Nv/Sa, Brussels" and "Sparkasse Kolnbonn" become
 * "ING Belgium" and "Sparkasse KölnBonn", non-banks and duplicate spellings
 * drop out (round-3 brief §4.3). Every consumer — the IBAN page's bank card,
 * its FAQ, its meta description's bank count and the /iban hub total — reads
 * this list, so they agree with each other.
 */
export const wiseCountries: WiseCountryIban[] = (ibanData as WiseCountryIban[]).map((c) => ({
  ...c,
  banks: displayBankList(c.slug, c.banks),
}));
export const wiseCountryPages: WiseCountryPage[] = pageData as WiseCountryPage[];

export function getWiseCountry(code: string): WiseCountryIban | undefined {
  return wiseCountries.find(
    (c) => c.countryCode.toUpperCase() === code.toUpperCase()
  );
}

export function getWiseCountryBySlug(slug: string): WiseCountryIban | undefined {
  return wiseCountries.find((c) => c.slug === slug);
}

export function getWiseCountryPage(slug: string): WiseCountryPage | undefined {
  return wiseCountryPages.find((p) => p.slug === slug);
}

export function getWiseBanksByCountry(code: string): WiseBankInfo[] {
  return getWiseCountry(code)?.banks || [];
}

export function getSepaCountries(): WiseCountryIban[] {
  return wiseCountries.filter((c) => c.sepa);
}

export function getAllWiseBanks(): (WiseBankInfo & { countryCode: string })[] {
  return wiseCountries.flatMap((c) =>
    c.banks.map((b) => ({ ...b, countryCode: c.countryCode }))
  );
}
