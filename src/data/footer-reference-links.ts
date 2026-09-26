/**
 * The IBAN and SWIFT pages the site footer links from every page.
 *
 * Shared by Footer.tsx and seo-indexing.ts so the two cannot drift: these are
 * indexable because the footer points at them (and Bing earns on them), so a
 * page added to or dropped from the footer changes its indexability with it.
 *
 * Chosen from Bing Webmaster data, May 26 2026: the 17 IBANs each earned
 * 100-723 Bing impressions (the /iban/* pattern ~6,000 across 32 tracked
 * pages); the 5 SWIFTs 140-273 each (1,291 across the pattern).
 */
export interface FooterReferenceLink {
  href: string;
  label: string;
}

export const FOOTER_IBAN_LINKS: readonly FooterReferenceLink[] = [
  { href: "/iban/italy", label: "Italy IBAN" },
  { href: "/iban/germany", label: "Germany IBAN" },
  { href: "/iban/spain", label: "Spain IBAN" },
  { href: "/iban/poland", label: "Poland IBAN" },
  { href: "/iban/united-arab-emirates", label: "UAE IBAN" },
  { href: "/iban/ireland", label: "Ireland IBAN" },
  { href: "/iban/belgium", label: "Belgium IBAN" },
  { href: "/iban/france", label: "France IBAN" },
  { href: "/iban/sweden", label: "Sweden IBAN" },
  { href: "/iban/netherlands", label: "Netherlands IBAN" },
  { href: "/iban/switzerland", label: "Switzerland IBAN" },
  { href: "/iban/luxembourg", label: "Luxembourg IBAN" },
  { href: "/iban/egypt", label: "Egypt IBAN" },
  { href: "/iban/saudi-arabia", label: "Saudi Arabia IBAN" },
  { href: "/iban/pakistan", label: "Pakistan IBAN" },
  { href: "/iban/portugal", label: "Portugal IBAN" },
  { href: "/iban/romania", label: "Romania IBAN" },
];

export const FOOTER_SWIFT_LINKS: readonly FooterReferenceLink[] = [
  { href: "/swift-codes/ghana", label: "Ghana SWIFT codes" },
  { href: "/swift-codes/philippines", label: "Philippines SWIFT codes" },
  { href: "/swift-codes/kenya", label: "Kenya SWIFT codes" },
  { href: "/swift-codes/united-kingdom", label: "UK SWIFT codes" },
  { href: "/swift-codes/sri-lanka", label: "Sri Lanka SWIFT codes" },
];
