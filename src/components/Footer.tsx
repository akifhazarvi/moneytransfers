import Link from "next/link";
import Container from "@/components/Container";

const footerSections = [
  {
    title: "Products",
    links: [
      { href: "/send-money", label: "Send Money" },
      { href: "/compare", label: "Compare Providers" },
      { href: "/currency-converter", label: "Currency Converter" },
      { href: "/companies", label: "All Reviews" },
    ],
  },
  {
    title: "Popular Routes",
    links: [
      { href: "/send-money/usa-to-india", label: "USA to India" },
      { href: "/send-money/uk-to-europe", label: "UK to Europe" },
      { href: "/send-money/usa-to-philippines", label: "USA to Philippines" },
      { href: "/send-money/usa-to-mexico", label: "USA to Mexico" },
      { href: "/send-money/usa-to-pakistan", label: "USA to Pakistan" },
      { href: "/send-money/usa-to-nigeria", label: "USA to Nigeria" },
    ],
  },
  {
    title: "Top Providers",
    links: [
      { href: "/companies/wise", label: "Wise Review" },
      { href: "/companies/remitly", label: "Remitly Review" },
      { href: "/companies/ofx", label: "OFX Review" },
      { href: "/companies/xe", label: "XE Review" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/methodology", label: "Methodology" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/news", label: "News" },
      { href: "/iban", label: "IBAN by Country" },
      { href: "/swift-codes", label: "SWIFT/BIC Codes" },
      { href: "/exchange-rates", label: "Live Exchange Rates" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
      <Container className="py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {link.label}
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
            SendMoneyCompare is a comparison site. We may receive compensation when you click links to providers. This does not affect our editorial independence.
          </p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]">
            &copy; {new Date().getFullYear()} SendMoneyCompare
          </p>
        </div>
      </Container>
    </footer>
  );
}
