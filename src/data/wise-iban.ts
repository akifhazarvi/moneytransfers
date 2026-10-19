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
/**
 * Countries the scraped Wise flag still marks non-SEPA although the EPC's list
 * of countries in the SEPA schemes' geographical scope (EPC409-09 v8.0, 24
 * December 2025) includes them: Andorra from 1 March 2019 (its five banks
 * adhered that week, per Andorran Banking); Montenegro and Albania (EPC Board,
 * 21 November 2024) and North Macedonia and Moldova (6 March 2025), live from
 * October 2025, when the Commission counted 40 of their banks in the schemes;
 * Serbia (22 May 2025), where the NBS said on 15 July 2026 that 18 of its 19
 * banks had adhered to SEPA Credit Transfer. /iban/serbia answered "Is Serbia
 * part of SEPA? No." until 2026-10-18. Iceland, an EEA member on the same list
 * since SEPA began, carried the same wrong flag. iban-structures.json already
 * agrees.
 */
const EPC_SEPA_SCOPE_ADDED = new Set(["AD", "AL", "ME", "MK", "MD", "RS", "IS"]);

/**
 * The account currency where the scrape kept a retired one: El Salvador's
 * Monetary Integration Law (2001) put accounts in US dollars, so the page said
 * transfers "arrive in SVC" and its comparison asked for a USD→SVC route.
 */
const ACCOUNT_CURRENCY: Record<string, string> = { SV: "USD" };

export const wiseCountries: WiseCountryIban[] = (ibanData as WiseCountryIban[]).map((c) => ({
  ...c,
  sepa: c.sepa || EPC_SEPA_SCOPE_ADDED.has(c.countryCode.toUpperCase()),
  currency: ACCOUNT_CURRENCY[c.countryCode.toUpperCase()] ?? c.currency,
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
