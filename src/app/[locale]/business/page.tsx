import { seoDescription } from "@/lib/seo-title";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { businessPages } from "@/data/business-pages";
import { renderDataTokens } from "@/lib/ratings-tokens";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { computeBusinessFxIndex, BUSINESS_AMOUNT } from "@/lib/business-fx-index";

/**
 * Measured bank-vs-specialist gap, from the same index that powers
 * /business/compare.
 *
 * Every claim on this page used to read "80-95% cheaper than bank wires" — a
 * range nothing on the site computed. It came from the best case of a modelled
 * bank ($25-50 wire + 2-5% markup) against the cheapest specialist, then got
 * applied to every provider and every amount. Measured at $5,000 across the
 * corridors we price, banks average 4.32% and business-FX specialists 1.65%:
 * a 62% saving, with the cheapest specialist reaching the high-80s. Deriving it
 * means the page cannot drift from the tool it links to.
 */
const BFX = computeBusinessFxIndex();
const bankSavingPct = BFX.bankAvgCostPct > 0
  ? Math.round(((BFX.bankAvgCostPct - BFX.specialistAvgCostPct) / BFX.bankAvgCostPct) * 100)
  : 0;
const bestSpecialist = BFX.specialistLeaderboard[0];

/**
 * Volume bands for the annual-savings table. Costs are derived from the index
 * rather than typed: the table used to hard-code "~$175/mo" bank against
 * "~$30/mo" specialist, i.e. a 3.5% bank rate the footnote admitted was an
 * assumption, which implied an ~83% saving directly under a headline claiming
 * 80-95%. Both are now the measured rates.
 */
const BUSINESS_VOLUME_TIERS: {
  label: string;
  monthly: number;
  /** Rendered as links — these are curated /companies pages, all of which render. */
  providers: { slug: string; name: string }[];
  suffix?: string;
}[] = [
  { label: "$5K/month (freelancer)", monthly: 5_000, providers: [{ slug: "wise", name: "Wise Business" }] },
  { label: "$25K/month (SMB)", monthly: 25_000, providers: [{ slug: "wise", name: "Wise" }, { slug: "revolut", name: "Revolut" }] },
  { label: "$100K/month (mid-market)", monthly: 100_000, providers: [{ slug: "ofx", name: "OFX" }], suffix: " (negotiated)" },
  { label: "$500K+/month (enterprise)", monthly: 500_000, providers: [{ slug: "ofx", name: "OFX" }, { slug: "xe", name: "XE Business" }] },
];
const bestSavingPct = BFX.bankAvgCostPct > 0 && bestSpecialist
  ? Math.round(((BFX.bankAvgCostPct - bestSpecialist.avgCostPct) / BFX.bankAvgCostPct) * 100)
  : 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const year = new Date().getFullYear();
  return {
    // Was 77 chars: "Providers (2026)" — the qualifier that matters — fell
    // outside the rendered length.
    title:
      `B2B International Payments — Compare Providers (${year})`,
    description:
      seoDescription(`Compare the cheapest B2B international payment providers in ${year}. Wise Business, OFX, Revolut Business & Airwallex measured against bank wires. Fees, FX rates, bulk payments & API access compared.`),
    keywords:
      `b2b international payments, business international payments, business money transfer international, business fx payments, bulk international payments, international business payments ${year}, b2b money transfer, business bank transfer abroad`,
    alternates: getAlternates("business", locale),
    openGraph: {
      title:
        `International Business Payments — Compare Providers & Fees (${year})`,
      description:
        `Compare the cheapest ways to make international business payments. We measure banks at ${BFX.bankAvgCostPct.toFixed(2)}% against specialists at ${BFX.specialistAvgCostPct.toFixed(2)}% on a $${BUSINESS_AMOUNT.toLocaleString()} payment.`,
      url: "https://sendmoneycompare.com/business",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function BusinessHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // FAQPage rich results restricted to government/healthcare since Aug 2023.
  // FAQ content rendered on page for users and AI crawlers.
  const faqs = [
      {
        "@type": "Question",
        name: "What is the cheapest way to make international business payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `For most SMBs, Wise Business offers the lowest total cost: 0% exchange rate markup (mid-market rate) plus a transparent fee of 0.41-0.71%. For large transfers ($50,000+), OFX may offer better negotiated rates through their dealing desk. Measured on a $${BUSINESS_AMOUNT.toLocaleString()} payment across ${BFX.corridorCount} corridors on ${BFX.dataAsOf}, business-FX specialists average ${BFX.specialistAvgCostPct.toFixed(2)}% in total cost against ${BFX.bankAvgCostPct.toFixed(2)}% for high-street banks — about ${bankSavingPct}% cheaper, and roughly ${bestSavingPct}% for the cheapest specialist.`,
        },
      },
      {
        "@type": "Question",
        name: "How do small businesses make international payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Small businesses can use specialist providers like Wise Business (0% markup, batch payments, Xero integration), Revolut Business (multi-currency accounts, free plan), or OFX (zero fees, dedicated dealers for $10K+). All are significantly cheaper than bank wires which charge $25–$50 plus 2–5% FX markup.",
        },
      },
      {
        "@type": "Question",
        name: "How do I make bulk international payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload a CSV file with recipient details to Wise Business (up to 1,000 payments per batch) or Revolut Business. For automated payouts, use their APIs to integrate with your ERP or invoicing system. OFX's dealing desk handles high-value batch processing with negotiated rates.",
        },
      },
      {
        "@type": "Question",
        name: "What are the cheapest business FX payment options in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Wise Business (0% markup, 0.41-0.71% fee), Revolut Business (interbank rates during market hours), and OFX ($0 fees with negotiated rates for large transfers). On our $${BUSINESS_AMOUNT.toLocaleString()} benchmark, specialists average ${BFX.specialistAvgCostPct.toFixed(2)}% against ${BFX.bankAvgCostPct.toFixed(2)}% for banks — about ${bankSavingPct}% cheaper for cross-border business payments.`,
        },
      },
      {
        "@type": "Question",
        name: "How do businesses pay international vendors and suppliers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The most cost-effective approach is specialist business transfer providers. Wise Business and OFX offer multi-currency accounts, batch processing, and forward contracts to lock in exchange rates. Set up vendor bank details once, use CSV upload or API for recurring payments, and maintain invoice documentation for compliance.",
        },
      },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sendmoneycompare.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Business Payments",
        item: "https://sendmoneycompare.com/business",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "International Business Payments — Compare Providers & Fees (2026)",
    description: "Compare the cheapest ways to make international business payments. Wise Business, OFX, and Revolut Business compared for SME transfers, bulk payments, vendor payouts, and B2B cross-border payments.",
    datePublished: "2026-02-01",
    dateModified: "2026-03-18",
    author: { "@type": "Person", name: "Akif Hazarvi", url: "https://sendmoneycompare.com/about/akif-hazarvi" },
    publisher: { "@type": "Organization", name: "SendMoneyCompare", "@id": "https://sendmoneycompare.com/#organization", logo: { "@type": "ImageObject", url: "https://sendmoneycompare.com/logos/sendmoneycompare-logo.png", width: 512, height: 512 } },
    mainEntityOfPage: "https://sendmoneycompare.com/business",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* ─── HERO ─── */}
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="text-2sm text-[var(--color-on-surface-variant)] mb-4"
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            <span>Business Payments</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              International Business Payments
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed max-w-2xl">
              Banks charge $25–$50 per wire plus 2–5% FX markup. On a $
              {BUSINESS_AMOUNT.toLocaleString()} payment we measure banks at{" "}
              {BFX.bankAvgCostPct.toFixed(2)}% all-in against{" "}
              {BFX.specialistAvgCostPct.toFixed(2)}% for specialists like Wise Business
              and OFX — about {bankSavingPct}% cheaper. Compare the best options for
              your business.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/business/compare"
                className="inline-block rounded-full bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] transition-colors"
              >
                Compare 6 business providers →
              </Link>
              <Link
                href="/send-money"
                className="inline-block rounded-full border border-[var(--color-outline)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-surface)] hover:border-[var(--color-primary)]"
              >
                Get a live quote
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Quick comparison table ─── */}
      <section className="py-10">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              How much your business could save
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">
              Switching from bank wires to specialist providers saves about{" "}
              {bankSavingPct}% on the average international payment, and up to{" "}
              {bestSavingPct}% with the cheapest specialist we measure. Here&apos;s the
              annual impact by business size:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--color-outline)]">
                    <th className="text-left py-3 px-3 font-medium">
                      Monthly Volume
                    </th>
                    <th className="text-left py-3 px-3 font-medium">
                      Bank Wire Cost
                    </th>
                    <th className="text-left py-3 px-3 font-medium">
                      Specialist Cost
                    </th>
                    <th className="text-left py-3 px-3 font-medium">
                      Annual Savings
                    </th>
                    <th className="text-left py-3 px-3 font-medium">
                      Best Provider
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BUSINESS_VOLUME_TIERS.map((tier, i) => {
                    const bank = tier.monthly * (BFX.bankAvgCostPct / 100);
                    const spec = tier.monthly * ((bestSpecialist?.avgCostPct ?? 0) / 100);
                    const annual = (bank - spec) * 12;
                    const money = (n: number) =>
                      `$${Math.round(n).toLocaleString("en-US")}`;
                    return (
                      <tr
                        key={tier.label}
                        className={`border-b border-[var(--color-outline)]${
                          i === 0 ? " bg-[var(--color-success-surface)]" : ""
                        }`}
                      >
                        <td className="py-3 px-3">{tier.label}</td>
                        <td className="py-3 px-3">~{money(bank)}/mo</td>
                        <td className="py-3 px-3">~{money(spec)}/mo</td>
                        <td className="py-3 px-3 font-medium text-[var(--color-success)]">
                          {money(annual)}/yr
                        </td>
                        <td className="py-3 px-3">
                          {tier.providers.map((p, n) => (
                            <span key={p.slug}>
                              {n > 0 ? " or " : ""}
                              <Link
                                href={`/companies/${p.slug}`}
                                className="text-[var(--color-primary)] hover:underline"
                              >
                                {p.name}
                              </Link>
                            </span>
                          ))}
                          {tier.suffix}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mt-3">
              Bank cost is the {BFX.bankAvgCostPct.toFixed(2)}% average we measure across{" "}
              {BFX.corridorCount} corridors on a ${BUSINESS_AMOUNT.toLocaleString()} payment
              ({BFX.dataAsOf}); the specialist column uses{" "}
              {bestSpecialist?.name ?? "the cheapest specialist"} at{" "}
              {bestSpecialist?.avgCostPct.toFixed(2)}%, the cheapest we measure. Your own
              corridor and amount will differ — larger payments usually cost a smaller
              percentage. See{" "}
              <Link
                href="/business/small-business"
                className="text-[var(--color-primary)] hover:underline"
              >
                detailed provider comparison →
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* ─── Subpage cards ─── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <h2 className="text-2xl md:text-h3 font-normal text-[var(--color-on-surface)] mb-6 max-w-4xl mx-auto">
            Business payment guides
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {businessPages.map((page) => (
              <Card key={page.slug}>
                <Link href={`/business/${page.slug}`} className="block p-6">
                  <h3 className="text-lg font-medium text-[var(--color-on-surface)] mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {renderDataTokens(page.intro).slice(0, 160)}...
                  </p>
                  <span className="inline-block mt-3 text-sm text-[var(--color-primary)] font-medium">
                    Read guide →
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Why switch from bank section ─── */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Why businesses switch from bank wires
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-medium text-[var(--color-primary)]">
                  {bankSavingPct}%
                </div>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                  Lower costs vs bank wires
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-medium text-[var(--color-primary)]">
                  Same day
                </div>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                  Delivery vs 3–5 day bank wires
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-medium text-[var(--color-primary)]">
                  0%
                </div>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                  FX markup with Wise Business
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FAQ section ─── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-2">
                    {faq.name}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {faq.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Business corridor guides ─── */}
      <section className="py-10">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Business payment guides by corridor
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
              Costs vary significantly by corridor. These guides compare business-specific pricing for the most popular international payment routes.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: "/guides/business-payments-usa-to-uk", label: "USA → UK (USD to GBP)" },
                { href: "/guides/business-payments-usa-to-india", label: "USA → India (USD to INR)" },
                { href: "/guides/business-payments-usa-to-europe", label: "USA → Europe (USD to EUR)" },
                { href: "/guides/business-payments-usa-to-mexico", label: "USA → Mexico (USD to MXN)" },
                { href: "/guides/business-payments-usa-to-canada", label: "USA → Canada (USD to CAD)" },
                { href: "/guides/business-payments-uk-to-europe", label: "UK → Europe (GBP to EUR)" },
                { href: "/guides/business-payments-uk-to-india", label: "UK → India (GBP to INR)" },
                { href: "/guides/business-payments-usa-to-philippines", label: "USA → Philippines (USD to PHP)" },
                { href: "/guides/business-payments-usa-to-china", label: "USA → China (USD to CNY)" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors text-sm text-[var(--color-on-surface)]"
                >
                  <span className="text-[var(--color-primary)]">→</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Internal links ─── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-normal text-[var(--color-on-surface)] mb-4">
              Related guides
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/guides/business-international-payments-guide"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  International Business Payments: Complete Guide 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/exchange-rate-markup-explained"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Exchange Rate Markup Explained
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/multi-currency-accounts-exchange-rates"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Multi-Currency Accounts & Exchange Rates
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/lowest-fx-fees-business-payments-2026"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Lowest FX Fees for Business Payments 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/how-to-pay-international-suppliers"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  How to Pay International Suppliers
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/international-payroll-pay-remote-teams"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  International Payroll: How to Pay Remote Teams
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/wire-transfer-guide"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Wire Transfers: Fees, Speed & Cheaper Alternatives
                </Link>
              </li>
              <li>
                <Link
                  href="/send-money"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Compare Live Transfer Rates →
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
