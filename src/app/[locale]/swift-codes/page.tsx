import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";
import PrimaryButton from "@/components/PrimaryButton";
import CircleFlag from "@/components/CircleFlag";
import { getSwiftCountries } from "@/data/swift-codes";
import { INDEXED_SWIFT_SLUGS } from "@/lib/seo-indexing";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "swiftCodes" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
    alternates: getAlternates("swift-codes", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/swift-codes",
    },
  };
}

function getFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default async function SwiftCodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "swiftCodes" });
  const countries = getSwiftCountries().sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  // Split into indexed (index-worthy, surfaced prominently) vs the long tail
  // (noindex pages, collapsed). Keeps every link crawlable but stops the hub
  // from flooding 100+ equal-weight links to mostly-noindexed country pages.
  const indexedCountries = countries.filter((c) => INDEXED_SWIFT_SLUGS.has(c.slug));
  const otherCountries = countries.filter((c) => !INDEXED_SWIFT_SLUGS.has(c.slug));
  const totalBanks = countries.reduce((s, c) => s + c.bankCount, 0);
  const totalBranches = countries.reduce((s, c) => s + c.branches.length, 0);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "SWIFT Codes", item: "https://sendmoneycompare.com/swift-codes" },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SWIFT/BIC Code Lookup — Find Codes for Banks in 100+ Countries",
    description: `Search SWIFT/BIC codes for ${totalBanks.toLocaleString()}+ banks across ${countries.length} countries. Verified data updated regularly.`,
    url: "https://sendmoneycompare.com/swift-codes",
    isPartOf: { "@type": "WebSite", name: "SendMoneyCompare", url: "https://sendmoneycompare.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {/* Hero */}
      <section className="bg-[var(--color-surface)] pt-12 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-h0 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t.rich("heading", {
                highlight: (chunks) => <span className="text-[var(--color-primary)]">{chunks}</span>,
              })}
            </h1>
            <p className="text-base text-[var(--color-on-surface-variant)] mt-3 max-w-xl mx-auto">
              {t("subheading")}
            </p>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mt-2">
              By{" "}
              <Link href="/about/akif-hazarvi" className="text-[var(--color-primary)] hover:underline">
                Akif Hazarvi
              </Link>
              {" · Updated March 2026 · Data verified from official bank records"}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-2sm text-[var(--color-on-surface-variant)]">
            {[
              `${countries.length} countries`,
              `${totalBanks.toLocaleString()}+ banks`,
              `${totalBranches.toLocaleString()}+ branch codes`,
              "Verified data",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* SWIFT Code Format */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <SectionHeader title="How SWIFT/BIC codes work" centered />
          <div className="max-w-2xl mx-auto">
            <Card>
              <div className="text-center mb-6">
                <p className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                  Example SWIFT code
                </p>
                <p className="text-h3 font-mono text-[var(--color-on-surface)] tracking-widest">
                  <span className="text-[var(--color-primary)]">AAAA</span>
                  <span className="text-[var(--color-success)]">BB</span>
                  <span className="text-[var(--color-warning)]">CC</span>
                  <span className="text-[var(--color-on-surface-variant)]">123</span>
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { code: "AAAA", label: "Bank code", desc: "4 letters identifying the bank", color: "var(--color-primary)" },
                  { code: "BB", label: "Country code", desc: "2-letter ISO country code", color: "var(--color-success)" },
                  { code: "CC", label: "Location code", desc: "2 characters for the city", color: "var(--color-warning)" },
                  { code: "123", label: "Branch code", desc: "3 digits for the branch (optional)", color: "var(--color-on-surface-variant)" },
                ].map((part) => (
                  <div key={part.code} className="flex items-start gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg">
                    <span
                      className="font-mono text-base font-medium shrink-0"
                      style={{ color: part.color }}
                    >
                      {part.code}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">{part.label}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{part.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Browse by country — indexed countries surfaced; long tail collapsed */}
      <section className="py-10">
        <Container>
          <SectionHeader title="Browse SWIFT codes by country" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {indexedCountries.map((country) => (
              <Card
                key={country.slug}
                href={`/swift-codes/${country.slug}`}
                className="!p-3 flex items-center gap-3"
              >
                <CircleFlag code={country.countryCode} size={20} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                    {country.name}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    {country.bankCount} banks · {country.branches.length} codes
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {otherCountries.length > 0 && (
            <details className="group mt-6">
              <summary className="flex items-center gap-2 cursor-pointer list-none text-sm font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors py-2">
                <span>All other countries ({otherCountries.length})</span>
                <svg className="w-4 h-4 shrink-0 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-4">
                {otherCountries.map((country) => (
                  <li key={country.slug}>
                    <Link href={`/swift-codes/${country.slug}`} className="text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                      {country.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </Container>
      </section>

      {/* SEO Content */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              What is a SWIFT/BIC code?
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                A <strong className="text-[var(--color-on-surface)]">SWIFT code</strong> (also called a BIC — Bank Identifier Code)
                is an 8 to 11 character code that uniquely identifies a bank and its branch for international wire transfers.
                SWIFT stands for the Society for Worldwide Interbank Financial Telecommunication, which operates the
                messaging network used by banks to send payment instructions worldwide.
              </p>
              <p>
                Every bank that participates in international transfers has a unique SWIFT code. When you send money abroad,
                your bank uses the recipient&apos;s SWIFT code to route the payment to the correct bank and branch. Without
                the correct code, your transfer may be delayed, sent to the wrong account, or returned.
              </p>
              <h3 className="text-base font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                SWIFT code vs IBAN
              </h3>
              <p>
                A SWIFT code identifies the <em>bank</em>, while an{" "}
                <Link href="/iban" className="text-[var(--color-primary)] hover:underline">IBAN</Link>{" "}
                identifies the specific <em>account</em>. For international transfers, you typically need both —
                the SWIFT code routes payment to the right bank, and the IBAN ensures it reaches the right account.
                Some countries (like the US) don&apos;t use IBANs and rely on routing numbers instead.
              </p>
              <h3 className="text-base font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                Where to find your SWIFT code
              </h3>
              <p>
                You can find your bank&apos;s SWIFT code on your bank statement, in your online banking portal,
                or by searching our database above. You can also contact your bank directly and ask for their
                SWIFT/BIC code for receiving international transfers.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Related resources */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Related resources
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/iban" className="text-[var(--color-primary)] hover:underline">
                  IBAN Number Guide — Format, Validation & Country Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/swift-codes-explained" className="text-[var(--color-primary)] hover:underline">
                  SWIFT Codes Explained: What They Are & How to Find Yours
                </Link>
              </li>
              <li>
                <Link href="/guides/iban-numbers-explained" className="text-[var(--color-primary)] hover:underline">
                  IBAN Numbers Explained: Format, Validation & Country Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/wire-transfer-guide" className="text-[var(--color-primary)] hover:underline">
                  Wire Transfers: Fees, Speed & Cheaper Alternatives
                </Link>
              </li>
              <li>
                <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
                  Compare International Money Transfer Rates →
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[var(--color-surface)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <h2 className="text-2xl font-normal text-[var(--color-on-surface)] mb-3">
            {t("ctaHeading")}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            {t("ctaDescription")}
          </p>
          <PrimaryButton href="/send-money" size="lg">
            {t("ctaButton")}
          </PrimaryButton>
        </div>
      </section>
    </>
  );
}
