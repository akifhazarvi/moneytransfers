import Link from "next/link";
import Container from "@/components/Container";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  const footerSections = [
    {
      titleKey: "products" as const,
      links: [
        { href: "/send-money", labelKey: "sendMoney" as const },
        { href: "/compare", labelKey: "compareProviders" as const },
        { href: "/currency-converter", labelKey: "currencyConverter" as const },
        { href: "/companies", labelKey: "allReviews" as const },
      ],
    },
    {
      titleKey: "popularRoutes" as const,
      links: [
        { href: "/send-money/usa-to-india", labelKey: "usaToIndia" as const },
        { href: "/send-money/uk-to-europe", labelKey: "ukToEurope" as const },
        { href: "/send-money/usa-to-philippines", labelKey: "usaToPhilippines" as const },
        { href: "/send-money/usa-to-mexico", labelKey: "usaToMexico" as const },
        { href: "/send-money/usa-to-pakistan", labelKey: "usaToPakistan" as const },
        { href: "/send-money/usa-to-nigeria", labelKey: "usaToNigeria" as const },
      ],
    },
    {
      titleKey: "topProviders" as const,
      links: [
        { href: "/companies/wise", labelKey: "wiseReview" as const },
        { href: "/companies/remitly", labelKey: "remitlyReview" as const },
        { href: "/companies/ofx", labelKey: "ofxReview" as const },
        { href: "/companies/xe", labelKey: "xeReview" as const },
      ],
    },
    {
      titleKey: "company" as const,
      links: [
        { href: "/about", labelKey: "aboutLink" as const },
        { href: "/contact", labelKey: "contactLink" as const },
        { href: "/editorial-policy", labelKey: "editorialLink" as const },
        { href: "/methodology", labelKey: "methodologyLink" as const },
        { href: "/privacy-policy", labelKey: "privacyLink" as const },
        { href: "/terms", labelKey: "termsLink" as const },
        { href: "/cookies", labelKey: "cookiesLink" as const },
        { href: "/disclaimer", labelKey: "disclaimerLink" as const },
      ],
    },
    {
      titleKey: "resources" as const,
      links: [
        { href: "/guides", labelKey: "guidesLink" as const },
        { href: "/news", labelKey: "newsLink" as const },
        { href: "/iban", labelKey: "ibanLink" as const },
        { href: "/swift-codes", labelKey: "swiftLink" as const },
        { href: "/exchange-rates", labelKey: "exchangeRatesLink" as const },
        { href: "/guides/how-euribor-affects-euro-transfers", labelKey: "euriborGuideLink" as const },
      ],
    },
  ];

  return (
    <footer className="bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
      <Container className="py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 mb-12">
          {footerSections.map((section) => (
            <div key={section.titleKey}>
              <h3 className="text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-4">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-outline)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#1a73e8" />
              <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">$</text>
              <path d="M6 12h5" stroke="#81D4FA" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 12l2-2" stroke="#81D4FA" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 12l2 2" stroke="#81D4FA" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M26 20h-5" stroke="#A5D6A7" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M24 20l-2-2" stroke="#A5D6A7" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M24 20l-2 2" stroke="#A5D6A7" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] font-medium text-[var(--color-on-surface-variant)]">SendMoneyCompare</span>
          </div>
          <p className="text-[12px] text-[var(--color-on-surface-variant)] text-center max-w-xl">
            {t("footerDisclaimer")}
          </p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </Container>
    </footer>
  );
}
