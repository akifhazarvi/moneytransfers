import Link from "@/components/EligibleLink";
import { isLinkEligible } from "@/lib/link-eligibility";

/**
 * A short "see also" line at the end of the trust and legal pages (and the
 * tool and provider hubs), naming the three or four pages each one actually
 * refers to.
 *
 * WHY (round-3 freelance brief §5.3, 2026-10-08): /about, /disclaimer, /terms,
 * /for-ai and the cookie and privacy policies had zero to two in-content links
 * from other Google-eligible pages — the footer is their only route, and
 * footer links do not count as content. Each page lists a different set chosen
 * for what it is about (no line is repeated across pages), and only pages
 * Google may index are linked (rule 14). Not a heading (rule 4).
 */
const SEE_ALSO: Record<string, { href: string; label: string }[]> = {
  "/about": [
    { href: "/editorial-policy", label: "how we keep our coverage independent" },
    { href: "/how-we-review", label: "how we review providers" },
    { href: "/methodology", label: "how we collect and rank quotes" },
    { href: "/for-ai", label: "our data for AI assistants" },
  ],
  "/editorial-policy": [
    { href: "/about", label: "who writes and checks our pages" },
    { href: "/corrections", label: "how we correct mistakes" },
    { href: "/disclaimer", label: "the limits of our information" },
    { href: "/how-we-review", label: "our review process" },
  ],
  "/how-we-review": [
    { href: "/methodology", label: "the quote methodology behind every ranking" },
    { href: "/about", label: "our team" },
    { href: "/disclaimer", label: "what our reviews do not cover" },
  ],
  "/methodology": [
    { href: "/how-we-review", label: "how providers are reviewed" },
    { href: "/research", label: "the datasets this method produces" },
    { href: "/for-ai", label: "the public quote API" },
    { href: "/guides/how-much-can-you-save-comparing-money-transfers", label: "what comparing saved real readers" },
    { href: "/disclaimer", label: "how to read an estimate" },
  ],
  "/corrections": [
    { href: "/editorial-policy", label: "our editorial standards" },
    { href: "/about", label: "the people accountable for them" },
    { href: "/contact", label: "how to report an error" },
  ],
  "/contact": [
    { href: "/about", label: "who we are" },
    { href: "/privacy-policy", label: "what we do with your message" },
    { href: "/terms", label: "the terms of using the site" },
    { href: "/cookies", label: "cookies and consent" },
  ],
  "/terms": [
    { href: "/privacy-policy", label: "privacy policy" },
    { href: "/cookies", label: "cookie policy" },
    { href: "/disclaimer", label: "disclaimer" },
  ],
  "/privacy-policy": [
    { href: "/cookies", label: "cookie policy" },
    { href: "/terms", label: "terms of use" },
    { href: "/contact", label: "how to contact us about your data" },
  ],
  "/cookies": [
    { href: "/privacy-policy", label: "privacy policy" },
    { href: "/terms", label: "terms of use" },
  ],
  "/disclaimer": [
    { href: "/terms", label: "terms of use" },
    { href: "/privacy-policy", label: "privacy policy" },
    { href: "/cookies", label: "cookie policy" },
    { href: "/about", label: "about SendMoneyCompare" },
  ],
  "/research": [
    { href: "/methodology", label: "how the quotes are collected" },
    { href: "/guides/how-much-can-you-save-comparing-money-transfers", label: "what comparing saved our readers" },
  ],
  "/tools": [
    { href: "/currency-converter", label: "the mid-market currency converter" },
    { href: "/exchange-rates/history", label: "exchange-rate history" },
  ],
  "/tools/fx-markup-checker": [
    { href: "/tools/salary-abroad", label: "what a salary is worth abroad" },
    { href: "/tools/us-remittance-tax", label: "the US remittance tax calculator" },
    { href: "/currency-converter", label: "today's mid-market rate" },
    { href: "/tools", label: "all free tools" },
  ],
  "/tools/salary-abroad": [
    { href: "/tools/fx-markup-checker", label: "how much a quoted rate is marked up" },
    { href: "/currency-converter", label: "the currency converter" },
    { href: "/tools", label: "all free tools" },
  ],
  "/tools/us-remittance-tax": [
    { href: "/tools/fx-markup-checker", label: "the FX markup checker" },
    { href: "/tools/salary-abroad", label: "salary purchasing power abroad" },
    { href: "/guides/best-apps-to-send-money-from-us-2026", label: "apps for sending money from the US" },
    { href: "/tools", label: "all free tools" },
  ],
  "/compare": [
    { href: "/alternatives", label: "alternatives to the largest providers" },
    { href: "/companies", label: "provider reviews" },
  ],
  "/companies": [
    { href: "/alternatives", label: "alternatives to each major provider" },
    { href: "/compare", label: "head-to-head comparisons" },
  ],
  "/guides/best-apps-to-send-money-from-us-2026": [
    { href: "/alternatives", label: "alternatives to Wise, Remitly and the other large providers" },
    { href: "/compare", label: "head-to-head provider comparisons" },
    { href: "/tools/us-remittance-tax", label: "the US remittance tax on cash transfers" },
  ],
  "/for-ai": [
    { href: "/methodology", label: "how the quotes are collected" },
    { href: "/research", label: "our original research" },
    { href: "/about", label: "who maintains this data" },
  ],
};

export default function PolicyLinks({ current, className = "" }: { current: string; className?: string }) {
  const links = (SEE_ALSO[current] ?? []).filter((l) => l.label && isLinkEligible(l.href));
  if (links.length === 0) return null;
  return (
    <p className={`mt-10 pt-6 border-t border-[var(--color-outline)] text-sm text-[var(--color-on-surface-variant)] ${className}`.trim()}>
      See also:{" "}
      {links.map((l, i) => (
        <span key={l.href}>
          {i > 0 && (i === links.length - 1 ? " and " : ", ")}
          <Link href={l.href} className="text-[var(--color-primary)] hover:underline">{l.label}</Link>
        </span>
      ))}
      .
    </p>
  );
}
