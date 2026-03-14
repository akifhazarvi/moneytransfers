import Link from "next/link";
import Container from "@/components/Container";

const footerSections = [
  {
    title: "Products",
    links: [
      { href: "/send-money", label: "Send Money" },
      { href: "/comparison", label: "Compare Providers" },
      { href: "/currency-converter", label: "Currency Converter" },
      { href: "/companies", label: "All Reviews" },
    ],
  },
  {
    title: "Popular Routes",
    links: [
      { href: "/send-money?from=USD&to=INR", label: "USA to India" },
      { href: "/send-money?from=GBP&to=EUR", label: "UK to Europe" },
      { href: "/send-money?from=USD&to=PHP", label: "USA to Philippines" },
      { href: "/send-money?from=USD&to=MXN", label: "USA to Mexico" },
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
    title: "IBAN & SWIFT",
    links: [
      { href: "/iban", label: "IBAN by Country" },
      { href: "/swift-codes", label: "SWIFT/BIC Codes" },
      { href: "/iban/germany", label: "Germany IBAN" },
      { href: "/swift-codes/pakistan", label: "Pakistan SWIFT" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/guides", label: "How We Review" },
      { href: "/guides", label: "About" },
      { href: "/guides", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
      <Container className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
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
          <div className="flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#1a73e8" />
              <path d="M8 14l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[14px] text-[var(--color-on-surface-variant)]">MoneyTransfers</span>
          </div>
          <p className="text-[12px] text-[var(--color-on-surface-variant)] text-center max-w-xl">
            MoneyTransfers is a comparison site. We may receive compensation when you click links to providers. This does not affect our editorial independence.
          </p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]">
            &copy; {new Date().getFullYear()} MoneyTransfers
          </p>
        </div>
      </Container>
    </footer>
  );
}
