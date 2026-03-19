import Link from "next/link";
import Container from "@/components/Container";
import { useTranslations } from "next-intl";

type TranslatedLink = { href: string; labelKey: string };
type StaticLink = { href: string; label: string };
type FooterLink = TranslatedLink | StaticLink;

function isStatic(l: FooterLink): l is StaticLink {
  return "label" in l;
}

export default function Footer() {
  const t = useTranslations("footer");

  const translatedSections: { titleKey: string; links: TranslatedLink[] }[] = [
    {
      titleKey: "products",
      links: [
        { href: "/send-money", labelKey: "sendMoney" },
        { href: "/compare", labelKey: "compareProviders" },
        { href: "/currency-converter", labelKey: "currencyConverter" },
        { href: "/companies", labelKey: "allReviews" },
      ],
    },
    {
      titleKey: "popularRoutes",
      links: [
        { href: "/send-money/usa-to-india", labelKey: "usaToIndia" },
        { href: "/send-money/uk-to-india", labelKey: "ukToIndia" },
        { href: "/send-money/uae-to-india", labelKey: "uaeToIndia" },
        { href: "/send-money/usa-to-philippines", labelKey: "usaToPhilippines" },
        { href: "/send-money/uk-to-philippines", labelKey: "ukToPhilippines" },
        { href: "/send-money/usa-to-pakistan", labelKey: "usaToPakistan" },
        { href: "/send-money/usa-to-mexico", labelKey: "usaToMexico" },
        { href: "/send-money/usa-to-nigeria", labelKey: "usaToNigeria" },
        { href: "/send-money/europe-to-india", labelKey: "europeToIndia" },
        { href: "/send-money/uk-to-europe", labelKey: "ukToEurope" },
        { href: "/send-money/usa-to-ghana", labelKey: "usaToGhana" },
        { href: "/send-money/usa-to-colombia", labelKey: "usaToColombia" },
      ],
    },
    {
      titleKey: "topProviders",
      links: [
        { href: "/companies/wise", labelKey: "wiseReview" },
        { href: "/companies/remitly", labelKey: "remitlyReview" },
        { href: "/companies/western-union", labelKey: "westernUnionReview" },
        { href: "/companies/worldremit", labelKey: "worldremitReview" },
        { href: "/companies/xoom", labelKey: "xoomReview" },
        { href: "/companies/revolut", labelKey: "revolutReview" },
        { href: "/companies/ofx", labelKey: "ofxReview" },
        { href: "/companies/xe", labelKey: "xeReview" },
      ],
    },
    {
      titleKey: "company",
      links: [
        { href: "/about", labelKey: "aboutLink" },
        { href: "/contact", labelKey: "contactLink" },
        { href: "/editorial-policy", labelKey: "editorialLink" },
        { href: "/methodology", labelKey: "methodologyLink" },
        { href: "/privacy-policy", labelKey: "privacyLink" },
        { href: "/terms", labelKey: "termsLink" },
        { href: "/cookies", labelKey: "cookiesLink" },
        { href: "/disclaimer", labelKey: "disclaimerLink" },
      ],
    },
    {
      titleKey: "resources",
      links: [
        { href: "/guides", labelKey: "guidesLink" },
        { href: "/business", labelKey: "businessLink" },
        { href: "/news", labelKey: "newsLink" },
        { href: "/iban", labelKey: "ibanLink" },
        { href: "/swift-codes", labelKey: "swiftLink" },
        { href: "/exchange-rates", labelKey: "exchangeRatesLink" },
        { href: "/guides/how-euribor-affects-euro-transfers", labelKey: "euriborGuideLink" },
      ],
    },
  ];

  // Popular comparisons — static, driven by GSC demand
  const comparisonsSection: { title: string; links: StaticLink[] } = {
    title: "Popular Comparisons",
    links: [
      { href: "/compare/wise-vs-remitly", label: "Wise vs Remitly" },
      { href: "/compare/wise-vs-western-union", label: "Wise vs Western Union" },
      { href: "/compare/wise-vs-paypal", label: "Wise vs PayPal" },
      { href: "/compare/wise-vs-xe", label: "Wise vs Xe" },
      { href: "/compare/remitly-vs-western-union", label: "Remitly vs Western Union" },
      { href: "/compare/remitly-vs-xe", label: "Remitly vs Xe" },
    ],
  };

  // Static "Send Money To" section — no translation keys needed
  const sendMoneyToSection: { title: string; links: StaticLink[] } = {
    title: "Send Money To",
    links: [
      { href: "/send-money/send-money-to-india", label: "Send Money to India" },
      { href: "/send-money/send-money-to-pakistan", label: "Send Money to Pakistan" },
      { href: "/send-money/send-money-to-philippines", label: "Send Money to Philippines" },
      { href: "/send-money/send-money-to-mexico", label: "Send Money to Mexico" },
      { href: "/send-money/send-money-to-nigeria", label: "Send Money to Nigeria" },
      { href: "/send-money/send-money-to-bangladesh", label: "Send Money to Bangladesh" },
      { href: "/send-money/send-money-to-kenya", label: "Send Money to Kenya" },
      { href: "/send-money/send-money-to-brazil", label: "Send Money to Brazil" },
      { href: "/send-money/send-money-to-ghana", label: "Send Money to Ghana" },
      { href: "/send-money/send-money-to-nepal", label: "Send Money to Nepal" },
      { href: "/send-money/send-money-to-uk", label: "Send Money to UK" },
      { href: "/send-money/send-money-to-australia", label: "Send Money to Australia" },
      { href: "/send-money/send-money-to-canada", label: "Send Money to Canada" },
      { href: "/send-money/send-money-to-uae", label: "Send Money to UAE" },
      { href: "/send-money/send-money-to-germany", label: "Send Money to Germany" },
      { href: "/send-money/send-money-to-france", label: "Send Money to France" },
      { href: "/send-money/send-money-to-colombia", label: "Send Money to Colombia" },
      { href: "/send-money/send-money-to-egypt", label: "Send Money to Egypt" },
      { href: "/send-money/send-money-to-vietnam", label: "Send Money to Vietnam" },
      { href: "/send-money/send-money-to-indonesia", label: "Send Money to Indonesia" },
      { href: "/send-money/send-money-to-sri-lanka", label: "Send Money to Sri Lanka" },
      { href: "/send-money/send-money-to-morocco", label: "Send Money to Morocco" },
      { href: "/send-money/send-money-to-thailand", label: "Send Money to Thailand" },
      { href: "/send-money/send-money-to-romania", label: "Send Money to Romania" },
      { href: "/send-money/send-money-to-turkey", label: "Send Money to Turkey" },
      { href: "/send-money/send-money-to-jamaica", label: "Send Money to Jamaica" },
      { href: "/send-money/send-money-to-japan", label: "Send Money to Japan" },
      { href: "/send-money/send-money-to-south-africa", label: "Send Money to South Africa" },
      { href: "/send-money/send-money-to-peru", label: "Send Money to Peru" },
      { href: "/send-money/send-money-to-fiji", label: "Send Money to Fiji" },
    ],
  };

  return (
    <footer className="bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
      <Container className="py-12">
        {/* Main link grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 mb-8">
          {translatedSections.map((section) => (
            <div key={section.titleKey}>
              <p className="text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-4">
                {t(section.titleKey)}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
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

        {/* Send Money To destinations row */}
        <div className="border-t border-[var(--color-outline)] pt-8 mb-8">
          <p className="text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-4">
            {sendMoneyToSection.title}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sendMoneyToSection.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Comparisons row */}
        <div className="border-t border-[var(--color-outline)] pt-8 mb-8">
          <p className="text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-4">
            {comparisonsSection.title}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {comparisonsSection.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
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
            <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">SendMoneyCompare</span>
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)] text-center max-w-xl">
            {t("footerDisclaimer")}
          </p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </Container>
    </footer>
  );
}
