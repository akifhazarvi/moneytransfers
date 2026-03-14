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

export const wiseCountries: WiseCountryIban[] = ibanData as WiseCountryIban[];
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
