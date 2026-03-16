// SWIFT editorial content and FAQs with locale support
// Used by src/app/[locale]/swift-codes/[country]/page.tsx

export interface EditorialNote {
  title: string;
  intro: string;
  bullets: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SwiftContent {
  editorial: Record<string, EditorialNote>;
  faqs: Record<string, FaqItem[]>;
}

import { swiftContentEn } from "./swift-content-en";
import { swiftContentEs } from "./swift-content-es";
import { swiftContentFr } from "./swift-content-fr";

const localeMap: Record<string, SwiftContent> = {
  en: swiftContentEn,
  es: swiftContentEs,
  fr: swiftContentFr,
};

export function getSwiftEditorial(locale: string, slug: string): EditorialNote | undefined {
  return localeMap[locale]?.editorial[slug] || localeMap.en.editorial[slug];
}

export function getSwiftFaqs(locale: string, slug: string): FaqItem[] | undefined {
  return localeMap[locale]?.faqs[slug] || localeMap.en.faqs[slug];
}
