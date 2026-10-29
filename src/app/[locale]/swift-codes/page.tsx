import { seoDescription } from "@/lib/seo-title";
import Link from "@/components/EligibleLink";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";
import PrimaryButton from "@/components/PrimaryButton";
import CircleFlag from "@/components/CircleFlag";
import { getSwiftCountries, type SwiftBranch } from "@/data/swift-codes";
import { GONE_SWIFT_SLUGS } from "@/lib/gone-swift";
import { INDEXED_SWIFT_SLUGS, robotsFor } from "@/lib/seo-indexing";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { PageByline } from "@/components/PageByline";
import { EDITORIAL_AUTHOR_SLUG, pageUpdated } from "@/lib/content-dates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "swiftCodes" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    keywords: t("metaKeywords"),
    alternates: getAlternates("swift-codes", locale),
    // 2026-09-20: indexability is measured — robotsFor() consults the
    // duplication-derived allowlist. See scripts/build-indexable-routes.ts.
    robots: robotsFor("/swift-codes"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/swift-codes",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

/**
 * When the directory (src/data/scraped/swift-codes.json) last changed — its git
 * history: scraped from Wise's SWIFT code pages in March 2026, empty countries
 * backfilled from an open dataset of public registries on 12 June 2026
 * (scripts/fill-missing-swift-codes.ts). Neither is SWIFT's own directory, and
 * the page says so (round-4 brief §0.3 asked for the source and its date).
 */
const DIRECTORY_AS_OF = "2026-06-12";
const asOfLabel = new Date(`${DIRECTORY_AS_OF}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const SOURCE_LINK = "text-[var(--color-primary)] underline underline-offset-2 hover:no-underline";

/**
 * Worked examples read from the directory, never typed (CLAUDE.md rule 8): a
 * head office (XXX), a numbered branch of the same bank, and an 8-character
 * code. A key the directory no longer holds drops its example.
 */
const EXAMPLE_KEYS: readonly { country: string; bank: string; branch?: string; eight?: boolean; note: string }[] = [
  { country: "pakistan", bank: "habib-bank-limited", branch: "XXX", note: "XXX in the branch position means the bank's head office." },
  { country: "pakistan", bank: "habib-bank-limited", branch: "004", note: "The same bank and city with a branch suffix: a payment the bank asks to go to that branch uses it." },
  { country: "germany", bank: "deutsche-bank-ag", eight: true, note: "The 8-character form names the bank's primary office; it is the same as adding XXX." },
];

function swiftExamples(countries: ReturnType<typeof getSwiftCountries>) {
  return EXAMPLE_KEYS.flatMap((k) => {
    const branches = countries.find((c) => c.slug === k.country)?.branches ?? [];
    const hit: SwiftBranch | undefined = branches.find((b) => b.bankSlug === k.bank && (k.eight || b.branchCode === k.branch));
    if (!hit) return [];
    const code = k.eight ? hit.bic8 : hit.bic11;
    return [{ code, bank: hit.bankName, city: hit.city, parts: { bank: hit.bankCode, country: hit.countryCode, location: hit.locationCode, branch: k.eight ? "" : hit.branchCode }, note: k.note }];
  });
}

export default async function SwiftCodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "swiftCodes" });
  // Retired slugs are excluded so the hub never links to a 410 (see
  // src/lib/gone-swift.ts).
  const countries = getSwiftCountries()
    .filter((c) => !GONE_SWIFT_SLUGS.has(c.slug))
    .sort((a, b) => a.name.localeCompare(b.name));
  // Split into indexed (index-worthy, surfaced prominently) vs the long tail
  // (noindex pages, collapsed). Keeps every link crawlable but stops the hub
  // from flooding 100+ equal-weight links to mostly-noindexed country pages.
  const indexedCountries = countries.filter((c) => INDEXED_SWIFT_SLUGS.has(c.slug));
  const otherCountries = countries.filter((c) => !INDEXED_SWIFT_SLUGS.has(c.slug));
  const totalBanks = countries.reduce((s, c) => s + c.bankCount, 0);
  const totalBranches = countries.reduce((s, c) => s + c.branches.length, 0);
  const examples = swiftExamples(countries);

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
    description: `SWIFT/BIC codes for ${totalBanks.toLocaleString()} banks across ${countries.length} countries, from a directory as of ${asOfLabel}.`,
    url: "https://sendmoneycompare.com/swift-codes",
    dateModified: pageUpdated("/swift-codes"),
    isPartOf: { "@id": "https://sendmoneycompare.com/#website" },
    publisher: { "@id": "https://sendmoneycompare.com/#organization" },
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
            {/* "Updated June 2026" here sat over a sitemap lastmod of March; the
                date is now the one sitemap.ts submits (check:lastmod). */}
            <div className="flex justify-center mt-2">
              <PageByline
                authorSlug={EDITORIAL_AUTHOR_SLUG}
                updated={pageUpdated("/swift-codes")}
                cadence={`Code directory as of ${asOfLabel}`}
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-2sm text-[var(--color-on-surface-variant)]">
            {[
              `${countries.length} countries`,
              `${totalBanks.toLocaleString()}+ banks`,
              `${totalBranches.toLocaleString()}+ branch codes`,
              `Directory as of ${asOfLabel}`,
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
                  { code: "123", label: "Branch code", desc: "3 letters or digits for the branch (optional; XXX is the head office)", color: "var(--color-on-surface-variant)" },
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

      {/* Round-4 brief §0.3 (worksheet 04): the code structure on real codes, and
          a server-rendered country table with the directory's source and date. */}
      {examples.length > 0 && (
        <section className="py-10" aria-labelledby="swift-examples">
          <Container>
            <div className="max-w-3xl">
              <h2 id="swift-examples" className="text-h4 font-normal text-[var(--color-on-surface)] mb-2">
                Reading a SWIFT code: three examples from our directory
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-5 leading-relaxed">
                Each code splits into a bank code, a country code, a location code and, in the 11-character form, a branch
                code. These are listed in our directory exactly as below.
              </p>
              <div className="space-y-3">
                {examples.map((ex) => (
                  <div key={ex.code} className="rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-4">
                    <p className="font-mono text-lg tracking-wider text-[var(--color-on-surface)]">{ex.code}</p>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
                      {`${ex.bank}, ${ex.city}: bank ${ex.parts.bank}, country ${ex.parts.country}, location ${ex.parts.location}${ex.parts.branch ? `, branch ${ex.parts.branch}` : ", no branch suffix"}. ${ex.note}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="py-10 bg-[var(--color-surface-dim)]" aria-labelledby="swift-country-table">
        <Container>
          <h2 id="swift-country-table" className="text-h4 font-normal text-[var(--color-on-surface)] mb-2">
            SWIFT/BIC codes by country: banks and codes in our directory
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-5 max-w-3xl leading-relaxed">
            {`${countries.length} countries, ${totalBanks.toLocaleString()} banks and ${totalBranches.toLocaleString()} individual codes. One bank can hold many codes, one for each branch or department that receives payments.`}
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)]">
            <table className="w-full text-2sm">
              <thead>
                <tr className="bg-[var(--color-surface-dim)] text-left text-[var(--color-on-surface-variant)]">
                  <th scope="col" className="px-4 py-2.5 font-medium">Country</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Currency</th>
                  <th scope="col" className="px-4 py-2.5 font-medium text-right">Banks</th>
                  <th scope="col" className="px-4 py-2.5 font-medium text-right">Codes listed</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.slug} className="border-t border-[var(--color-outline)]">
                    <td className="px-4 py-2">
                      <Link href={`/swift-codes/${c.slug}`} className="text-[var(--color-primary)] hover:underline">{c.name}</Link>
                    </td>
                    <td className="px-4 py-2 text-[var(--color-on-surface-variant)]">{c.currencyCode}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{c.bankCount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{c.branches.length.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-3 max-w-3xl leading-relaxed">
            {`Our directory was compiled from Wise's published SWIFT code pages and, for countries those left empty, an open dataset of public bank registries; our copy is as of ${asOfLabel}. `}
            SWIFT issues the codes and is the authority on them (
            <a href="https://www.swift.com/standards/data-standards/bic-business-identifier-code" target="_blank" rel="noopener" className={SOURCE_LINK}>SWIFT: Business Identifier Code</a>
            ), and a bank can retire or change one, so confirm the code with the recipient&rsquo;s bank before a large
            transfer. For a euro payment between SEPA countries you need only the IBAN: the EU&rsquo;s{" "}
            <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0260" target="_blank" rel="noopener" className={SOURCE_LINK}>SEPA Regulation (EU) No 260/2012</a>{" "}
            stopped banks requiring a BIC for those payments from 2016.
          </p>
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
                8-character vs 11-character codes
              </h3>
              <p>
                An 8-character SWIFT code (no branch suffix) refers to the bank&apos;s primary office. An
                11-character code adds a 3-character branch identifier; &ldquo;XXX&rdquo; in that position also
                means the primary office. If the recipient&apos;s bank gives no branch code, the 8-character code or
                its XXX form is the one to use — but where the bank names a specific branch code for incoming
                payments, use that.
              </p>
              <h3 className="text-base font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                What happens if you use the wrong SWIFT code?
              </h3>
              <p>
                A code that does not exist is rejected before the payment leaves. A valid code for the wrong bank is
                the costly mistake: the payment travels, the receiving bank cannot match the account, and it comes
                back — usually less the charges deducted along the way, and your own bank may add an amendment or
                recall fee. Confirm the code with the recipient&apos;s bank details before a large transfer.
              </p>
              <h3 className="text-base font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                Where to find your SWIFT code
              </h3>
              <p>
                You can find your bank&apos;s SWIFT code on your bank statement, in your online banking portal,
                or by searching our directory above. You can also contact your bank directly and ask for their
                SWIFT/BIC code for receiving international transfers. The official registry is kept by{" "}
                <a
                  href="https://www.swift.com/standards/data-standards/bic-business-identifier-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  SWIFT
                </a>
                , the authority that issues the codes.
              </p>
              <h3 className="text-base font-medium text-[var(--color-on-surface)] mt-6 mb-2">
                SWIFT codes and transfer costs
              </h3>
              <p>
                A SWIFT wire can pass through one or more correspondent banks between the two banks, and each may
                deduct a charge from the amount, so the recipient can get less than you sent before any exchange
                rate is applied. Many money transfer services pay out through the destination country&apos;s local
                payment system instead, where no correspondent sits in the chain. Use our{" "}
                <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
                  comparison tool
                </Link>{" "}
                to see what the recipient gets from each provider, fees and exchange rate included, before you send.
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
