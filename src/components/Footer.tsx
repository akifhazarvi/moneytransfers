import Link from "next/link";
import Container from "@/components/Container";
import { useTranslations } from "next-intl";
import LazyTrustpilot from "@/components/LazyTrustpilot";

type TranslatedLink = { href: string; labelKey: string; noFollow?: boolean };
type StaticLink = { href: string; label: string };

export default function Footer() {
  const t = useTranslations("footer");

  // ── 4 lean columns, max 5 links each (Apple/Google pattern) ─────────────
  const primaryColumns: { titleKey: string; links: TranslatedLink[] }[] = [
    {
      titleKey: "products",
      links: [
        { href: "/compare-money-transfer", labelKey: "compareMoneyTransfer" },
        { href: "/send-money", labelKey: "sendMoney" },
        { href: "/companies", labelKey: "allReviews" },
        { href: "/currency-converter", labelKey: "currencyConverter" },
        { href: "/exchange-rates", labelKey: "exchangeRatesLink" },
      ],
    },
    {
      // Resources column rebuilt 2026-05-25 from Bing data: replaced /guides
      // hub (0 Bing impr) and /remittance-cost-index (0 Bing impr) with the
      // two highest-traffic guides on the entire site:
      //   - best-money-transfer-apps: 6,789 Bing impr
      //   - money-transfer-limits-by-provider-country: 999 Bing impr
      // Existing winning guides (cheapest-way 15 impr, safety-guide 3 impr,
      // how-to-send 83 impr) retained. This is the always-visible Resources
      // column — every additional link here costs equity from the 5 winners.
      titleKey: "resources",
      links: [
        { href: "/guides/best-money-transfer-apps", labelKey: "bestAppsGuideLink" },
        { href: "/guides/money-transfer-limits-by-provider-country", labelKey: "limitsGuideLink" },
        { href: "/guides/how-to-send-money-abroad", labelKey: "howToSendGuideLink" },
        { href: "/guides/cheapest-way-to-send-money-internationally", labelKey: "cheapestWayGuideLink" },
        { href: "/guides/money-transfer-safety-guide", labelKey: "safetyGuideLink" },
      ],
    },
    {
      titleKey: "tools",
      links: [
        { href: "/iban", labelKey: "ibanLink" },
        { href: "/swift-codes", labelKey: "swiftLink" },
        { href: "/exchange-rates/history", labelKey: "rateHistoryLink" },
        { href: "/travel", labelKey: "travelLink" },
        { href: "/business", labelKey: "businessLink" },
      ],
    },
    {
      titleKey: "company",
      links: [
        { href: "/about", labelKey: "aboutLink" },
        { href: "/methodology", labelKey: "methodologyLink" },
        { href: "/editorial-policy", labelKey: "editorialLink" },
        { href: "/how-we-review", labelKey: "howWeReview" },
        { href: "/contact", labelKey: "contactLink" },
      ],
    },
  ];

  // ── Top guides (Bing data, May 26 2026): 9 highest-traffic guides ──
  // Total Bing impressions across these 9 ≈ 12,200/90d. Replaces the dead
  // sendMoneyToLinks corridor list (42 corridors, 35 total Bing impr).
  // Concentrates link equity on pages that actually earn organic rankings.
  const topGuides: StaticLink[] = [
    { href: "/guides/best-money-transfer-apps", label: "Best money transfer apps" },
    { href: "/guides/us-dollar-forecast-2026", label: "USD forecast 2026" },
    { href: "/guides/money-transfer-limits-by-provider-country", label: "Transfer limits by provider & country" },
    { href: "/guides/iban-numbers-explained", label: "IBAN numbers explained" },
    { href: "/guides/revolut-foreign-transaction-fees-2026", label: "Revolut foreign transaction fees" },
    { href: "/guides/send-money-to-philippines-guide", label: "Send money to the Philippines" },
    { href: "/guides/wire-transfer-guide", label: "Wire transfer fees & alternatives" },
    { href: "/guides/send-money-to-china-guide", label: "Send money to China" },
    { href: "/guides/how-to-send-money-abroad", label: "How to send money abroad" },
  ];

  // ── IBAN country pages (Bing data, May 26): 17 highest-impression IBANs ──
  // Each earns 100-723 Bing impr. The /iban/* pattern accounts for ~6,000
  // Bing impressions across 32 tracked pages — concentrating footer link
  // equity here drives the proven-traffic surface.
  const ibanCountries: StaticLink[] = [
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

  // ── SWIFT country pages (Bing data, May 26): 5 highest-impression SWIFTs ─
  // Each earns 140-273 Bing impr. The /swift-codes/* pattern was barely
  // present in footer (1 sitemap entry only) but earns 1,291 total Bing impr.
  const swiftCountries: StaticLink[] = [
    { href: "/swift-codes/ghana", label: "Ghana SWIFT codes" },
    { href: "/swift-codes/philippines", label: "Philippines SWIFT codes" },
    { href: "/swift-codes/kenya", label: "Kenya SWIFT codes" },
    { href: "/swift-codes/united-kingdom", label: "UK SWIFT codes" },
    { href: "/swift-codes/sri-lanka", label: "Sri Lanka SWIFT codes" },
  ];

  // ── Provider reviews (Bing-validated): drop revolut + xe (0 Bing impr) ───
  const providerReviews: StaticLink[] = [
    { href: "/companies/remitly", label: "Remitly Review" },
    { href: "/companies/xoom", label: "Xoom Review" },
    { href: "/companies/wise", label: "Wise Review" },
    { href: "/companies/worldremit", label: "WorldRemit Review" },
    { href: "/companies/ofx", label: "OFX Review" },
    { href: "/companies/taptap-send", label: "TapTap Send Review" },
    { href: "/companies/western-union", label: "Western Union Review" },
  ];

  // ── Popular comparisons (Bing-validated): drop xe pairs, add MG vs WU ────
  const popularComparisons: StaticLink[] = [
    { href: "/compare/moneygram-vs-western-union", label: "MoneyGram vs Western Union" },
    { href: "/compare/wise-vs-remitly", label: "Wise vs Remitly" },
    { href: "/compare/wise-vs-paypal", label: "Wise vs PayPal" },
    { href: "/compare/remitly-vs-western-union", label: "Remitly vs Western Union" },
    { href: "/compare/wise-vs-western-union", label: "Wise vs Western Union" },
    { href: "/compare/paypal-vs-revolut", label: "PayPal vs Revolut" },
  ];

  const legalLinks: TranslatedLink[] = [
    { href: "/privacy-policy", labelKey: "privacyLink", noFollow: true },
    { href: "/terms", labelKey: "termsLink", noFollow: true },
    { href: "/cookies", labelKey: "cookiesLink", noFollow: true },
    { href: "/disclaimer", labelKey: "disclaimerLink", noFollow: true },
  ];

  return (
    <footer className="bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
      <Container className="py-12 sm:py-16">
        {/* ── Layer 1 — 4 lean columns ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 mb-10 sm:mb-12">
          {primaryColumns.map((section) => (
            <div key={section.titleKey}>
              <p className="text-xs font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">
                {t(section.titleKey)}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      {...(link.noFollow && { rel: "nofollow" })}
                      className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Layer 2 — collapsed disclosures (links stay in DOM for SEO) ── */}
        {/* Footer link sets rebuilt 2026-05-25 from Bing Page Traffic data:
            replaced 42 dead corridor links (35 total Bing impr) with curated
            sets of /iban/, /swift-codes/, /guides/ winners — concentrates
            link equity on the pages that actually rank organically. */}
        <div className="border-t border-[var(--color-outline)] pt-6 mb-10 sm:mb-12 grid sm:grid-cols-2 gap-x-8 sm:gap-y-0">
          <FooterDisclosure label={`Top money transfer guides (${topGuides.length})`}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-3">
              {topGuides.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterDisclosure>

          <FooterDisclosure label={`IBAN formats by country (${ibanCountries.length})`}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-3">
              {ibanCountries.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterDisclosure>

          <FooterDisclosure label={`SWIFT codes by country (${swiftCountries.length})`}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-3">
              {swiftCountries.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterDisclosure>

          <FooterDisclosure label={`Provider reviews & comparisons (${providerReviews.length + popularComparisons.length})`}>
            <div className="pt-3 grid grid-cols-1 gap-y-4">
              <div>
                <p className="text-2xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Reviews</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {providerReviews.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-2xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Head-to-head</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {popularComparisons.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FooterDisclosure>
        </div>

        {/* ── Layer 3 — brand + legal + trust ──────────────────────────── */}
        <div className="border-t border-[var(--color-outline)] pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Brand — matches Header */}
            <Link href="/" aria-label="SendMoneyCompare — Home" className="flex items-center gap-2.5 shrink-0">
              <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
                <path d="M3.5 15.8L26.5 4.5L21 27L14.5 19.5Z" fill="var(--color-primary)" />
                <path d="M14.5 19.5L26.5 4.5" stroke="var(--color-surface)" strokeWidth="0.8" opacity="0.8" />
                <path d="M14.5 19.5L21 27L18 20.5Z" fill="var(--color-primary)" opacity="0.45" />
              </svg>
              <span className="text-[17px] tracking-[-0.4px] text-[var(--color-on-surface)]">
                <span className="font-extrabold">Send</span>
                <span className="font-normal text-[var(--color-on-surface-variant)]">money</span>
              </span>
            </Link>

            {/* Legal — inline, separated by dots (Apple style) */}
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[var(--color-on-surface-variant)]">
              {legalLinks.map((link, i) => (
                <span key={link.labelKey} className="flex items-center gap-1.5">
                  <Link
                    href={link.href}
                    rel="nofollow"
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                  {i < legalLinks.length - 1 && <span aria-hidden="true">·</span>}
                </span>
              ))}
            </nav>

            {/* Trust + copyright */}
            <div className="flex items-center gap-4">
              <LazyTrustpilot />
              <span className="text-xs text-[var(--color-on-surface-variant)] whitespace-nowrap">
                {t("copyright", { year: new Date().getFullYear() })}
              </span>
            </div>
          </div>

          {/* Disclaimer — single muted line, full width */}
          <p
            className="text-2xs text-[var(--color-on-surface-variant)] leading-relaxed mt-6 max-w-3xl"
            data-nosnippet=""
          >
            {t("footerDisclaimer")}
          </p>
        </div>
      </Container>
    </footer>
  );
}

// Disclosure helper — pure HTML <details>, no JS
function FooterDisclosure({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="flex items-center justify-between cursor-pointer list-none py-2.5 text-2sm font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors min-h-[44px]">
        <span>{label}</span>
        <svg
          className="w-4 h-4 shrink-0 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  );
}
