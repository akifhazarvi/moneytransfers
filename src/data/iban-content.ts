// IBAN editorial content and FAQs with locale support
// Used by src/app/[locale]/iban/[slug]/page.tsx

export interface EditorialNote {
  title: string;
  intro: string;
  bullets: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface IbanContent {
  editorial: Record<string, EditorialNote>;
  faqs: Record<string, FaqItem[]>;
}

import { ibanContentEn } from "./iban-content-en";
import { ibanContentEs } from "./iban-content-es";
import { ibanContentFr } from "./iban-content-fr";

const localeMap: Record<string, IbanContent> = {
  en: ibanContentEn,
  es: ibanContentEs,
  fr: ibanContentFr,
};

export function getIbanEditorial(locale: string, slug: string): EditorialNote | undefined {
  return localeMap[locale]?.editorial[slug] || localeMap.en.editorial[slug];
}

export function getIbanFaqs(locale: string, slug: string): FaqItem[] | undefined {
  return localeMap[locale]?.faqs[slug] || localeMap.en.faqs[slug];
}
