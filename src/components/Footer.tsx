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
      titleKey: "resources",
      links: [
        { href: "/guides", labelKey: "guidesLink" },
        { href: "/guides/how-to-send-money-abroad", labelKey: "howToSendGuideLink" },
        { href: "/guides/cheapest-way-to-send-money-internationally", labelKey: "cheapestWayGuideLink" },
        { href: "/guides/money-transfer-safety-guide", labelKey: "safetyGuideLink" },
        { href: "/remittance-cost-index", labelKey: "remittanceCostIndexLink" },
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

  // ── Disclosure: full destinations list ──────────────────────────────────
  const sendMoneyToLinks: StaticLink[] = [
    { href: "/send-money/send-money-to-india", label: "India" },
    { href: "/send-money/send-money-to-pakistan", label: "Pakistan" },
    { href: "/send-money/send-money-to-philippines", label: "Philippines" },
    { href: "/send-money/send-money-to-mexico", label: "Mexico" },
    { href: "/send-money/send-money-to-nigeria", label: "Nigeria" },
    { href: "/send-money/send-money-to-bangladesh", label: "Bangladesh" },
    { href: "/send-money/send-money-to-kenya", label: "Kenya" },
    { href: "/send-money/send-money-to-brazil", label: "Brazil" },
    { href: "/send-money/send-money-to-ghana", label: "Ghana" },
    { href: "/send-money/send-money-to-nepal", label: "Nepal" },
    { href: "/send-money/send-money-to-uk", label: "United Kingdom" },
    { href: "/send-money/send-money-to-australia", label: "Australia" },
    { href: "/send-money/send-money-to-canada", label: "Canada" },
    { href: "/send-money/send-money-to-uae", label: "UAE" },
    { href: "/send-money/send-money-to-germany", label: "Germany" },
    { href: "/send-money/send-money-to-france", label: "France" },
    { href: "/send-money/send-money-to-colombia", label: "Colombia" },
    { href: "/send-money/send-money-to-egypt", label: "Egypt" },
    { href: "/send-money/send-money-to-vietnam", label: "Vietnam" },
    { href: "/send-money/send-money-to-indonesia", label: "Indonesia" },
    { href: "/send-money/send-money-to-sri-lanka", label: "Sri Lanka" },
    { href: "/send-money/send-money-to-morocco", label: "Morocco" },
    { href: "/send-money/send-money-to-thailand", label: "Thailand" },
    { href: "/send-money/send-money-to-romania", label: "Romania" },
    { href: "/send-money/send-money-to-turkey", label: "Turkey" },
    { href: "/send-money/send-money-to-jamaica", label: "Jamaica" },
    { href: "/send-money/send-money-to-japan", label: "Japan" },
    { href: "/send-money/send-money-to-south-africa", label: "South Africa" },
    { href: "/send-money/send-money-to-peru", label: "Peru" },
    { href: "/send-money/send-money-to-fiji", label: "Fiji" },
  ];

  // ── Disclosure: popular corridor routes ─────────────────────────────────
  const popularRoutes: StaticLink[] = [
    { href: "/send-money/usa-to-india", label: "USA → India" },
    { href: "/send-money/uk-to-india", label: "UK → India" },
    { href: "/send-money/uae-to-india", label: "UAE → India" },
    { href: "/send-money/usa-to-philippines", label: "USA → Philippines" },
    { href: "/send-money/uk-to-philippines", label: "UK → Philippines" },
    { href: "/send-money/usa-to-pakistan", label: "USA → Pakistan" },
    { href: "/send-money/usa-to-mexico", label: "USA → Mexico" },
    { href: "/send-money/usa-to-nigeria", label: "USA → Nigeria" },
    { href: "/send-money/europe-to-india", label: "Europe → India" },
    { href: "/send-money/uk-to-europe", label: "UK → Europe" },
    { href: "/send-money/usa-to-ghana", label: "USA → Ghana" },
    { href: "/send-money/usa-to-colombia", label: "USA → Colombia" },
  ];

  // ── Disclosure: provider reviews + comparisons ──────────────────────────
  const providerReviews: StaticLink[] = [
    { href: "/companies/wise", label: "Wise Review" },
    { href: "/companies/remitly", label: "Remitly Review" },
    { href: "/companies/western-union", label: "Western Union Review" },
    { href: "/companies/worldremit", label: "WorldRemit Review" },
    { href: "/companies/xoom", label: "Xoom Review" },
    { href: "/companies/revolut", label: "Revolut Review" },
    { href: "/companies/ofx", label: "OFX Review" },
    { href: "/companies/xe", label: "Xe Review" },
  ];

  const popularComparisons: StaticLink[] = [
    { href: "/compare/wise-vs-remitly", label: "Wise vs Remitly" },
    { href: "/compare/wise-vs-western-union", label: "Wise vs Western Union" },
    { href: "/compare/wise-vs-paypal", label: "Wise vs PayPal" },
    { href: "/compare/wise-vs-xe", label: "Wise vs Xe" },
    { href: "/compare/remitly-vs-western-union", label: "Remitly vs Western Union" },
    { href: "/compare/remitly-vs-xe", label: "Remitly vs Xe" },
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
        <div className="border-t border-[var(--color-outline)] pt-6 mb-10 sm:mb-12 space-y-2">
          <FooterDisclosure label={`Send money to popular countries (${sendMoneyToLinks.length})`}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-3">
              {sendMoneyToLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterDisclosure>

          <FooterDisclosure label={`Popular send-money routes (${popularRoutes.length})`}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-3">
              {popularRoutes.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterDisclosure>

          <FooterDisclosure label={`Provider reviews & comparisons (${providerReviews.length + popularComparisons.length})`}>
            <div className="pt-3 grid sm:grid-cols-2 gap-x-8 gap-y-4">
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
