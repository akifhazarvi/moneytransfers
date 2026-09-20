const SITE_URL = "https://sendmoneycompare.com";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
    })),
  };
}

// aggregateRatingSchema() was removed 2026-09-19. It emitted a FinancialService
// node with no `address`, and FinancialService is a LocalBusiness subclass, so
// every node it produced was invalid — the exact defect fixed across 80 nodes on
// 2026-09-02 and the reason src/lib/postal-address.ts exists. It had zero call
// sites, so nothing shipped it, but leaving it exported invited a future caller
// to reintroduce the bug.
//
// If provider rating markup is needed again, build it where the headquarters is
// in scope and pass postalAddress(provider.headquarters) — as
// /companies/[slug] and /compare/[slug] already do. Note also that the ratings
// overlaid here are Trustpilot's, and third-party ratings are not eligible for
// review rich results.

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
