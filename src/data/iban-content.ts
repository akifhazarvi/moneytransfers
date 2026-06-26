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

// Single-locale site (en only). The es/fr content modules were removed
// 2026-06-25 along with the retired /es /fr /pt locale routes.
export function getIbanEditorial(_locale: string, slug: string): EditorialNote | undefined {
  return ibanContentEn.editorial[slug];
}

export function getIbanFaqs(_locale: string, slug: string): FaqItem[] | undefined {
  return ibanContentEn.faqs[slug];
}
