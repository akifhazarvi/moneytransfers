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

// Single-locale site (en only). The es/fr content modules were removed
// 2026-06-25 along with the retired /es /fr /pt locale routes.
export function getSwiftEditorial(_locale: string, slug: string): EditorialNote | undefined {
  return swiftContentEn.editorial[slug];
}

export function getSwiftFaqs(_locale: string, slug: string): FaqItem[] | undefined {
  return swiftContentEn.faqs[slug];
}
