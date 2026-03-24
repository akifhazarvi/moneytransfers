import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { businessPages } from "@/data/business-pages";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const year = new Date().getFullYear();
  return {
    title:
      `International Business Payments — Compare the 4 Cheapest Providers (${year})`,
    description:
      `Compare the cheapest ways to make international business payments in ${year}. Wise Business, OFX, Revolut & XE save 80–95% vs bank wires. Compare fees, FX rates & speeds for SME payments, bulk transfers, vendor payouts & B2B transfers.`,
    keywords:
      `international business payments ${year}, small business international payments, business money transfer, business fx payments, bulk international payments, international vendor payments, B2B international money transfer, business bank transfer abroad`,
    alternates: getAlternates("business", locale),
    openGraph: {
      title:
        `International Business Payments — Compare Providers & Fees (${year})`,
      description:
        "Compare the cheapest ways to make international business payments. Specialist providers save 80–95% vs bank wire transfers.",
      url: "https://sendmoneycompare.com/business",
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
          text: "For most SMBs, Wise Business offers the lowest total cost: 0% exchange rate markup (mid-market rate) plus a transparent fee of 0.41–0.71%. For large transfers ($50,000+), OFX may offer better negotiated rates through their dealing desk. Both are 80–95% cheaper than traditional bank wire transfers.",
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
          text: "Wise Business (0% markup, 0.41–0.71% fee), Revolut Business (interbank rates during market hours), and OFX ($0 fees with negotiated rates for large transfers). All are 80–95% cheaper than traditional banks for cross-border business payments.",
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
    author: { "@type": "Person", name: "Daniel Rowe", url: "https://sendmoneycompare.com/about/daniel-rowe" },
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
              Banks charge $25–$50 per wire plus 2–5% FX markup. Specialist
              providers like Wise Business, OFX, and Revolut cut that by
              80–95%. Compare the best options for your business.
            </p>
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
              Switching from bank wires to specialist providers saves 80–95% on every
              international payment. Here&apos;s the annual impact by business size:
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
                  <tr className="border-b border-[var(--color-outline)] bg-[#e8f5e9]">
                    <td className="py-3 px-3">$5K/month (freelancer)</td>
                    <td className="py-3 px-3">~$175/mo</td>
                    <td className="py-3 px-3">~$30/mo</td>
                    <td className="py-3 px-3 font-medium text-[var(--color-success)]">$1,740/yr</td>
                    <td className="py-3 px-3">
                      <Link href="/companies/wise" className="text-[var(--color-primary)] hover:underline">Wise Business</Link>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-outline)]">
                    <td className="py-3 px-3">$25K/month (SMB)</td>
                    <td className="py-3 px-3">~$875/mo</td>
                    <td className="py-3 px-3">~$125/mo</td>
                    <td className="py-3 px-3 font-medium text-[var(--color-success)]">$9,000/yr</td>
                    <td className="py-3 px-3">
                      <Link href="/companies/wise" className="text-[var(--color-primary)] hover:underline">Wise</Link> or{" "}
                      <Link href="/companies/revolut" className="text-[var(--color-primary)] hover:underline">Revolut</Link>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-outline)]">
                    <td className="py-3 px-3">$100K/month (mid-market)</td>
                    <td className="py-3 px-3">~$3,500/mo</td>
                    <td className="py-3 px-3">~$400/mo</td>
                    <td className="py-3 px-3 font-medium text-[var(--color-success)]">$37,200/yr</td>
                    <td className="py-3 px-3">
                      <Link href="/companies/ofx" className="text-[var(--color-primary)] hover:underline">OFX</Link> (negotiated)
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-outline)]">
                    <td className="py-3 px-3">$500K+/month (enterprise)</td>
                    <td className="py-3 px-3">~$17,500/mo</td>
                    <td className="py-3 px-3">~$2,000/mo</td>
                    <td className="py-3 px-3 font-medium text-[var(--color-success)]">$186,000/yr</td>
                    <td className="py-3 px-3">
                      <Link href="/companies/ofx" className="text-[var(--color-primary)] hover:underline">OFX</Link> or{" "}
                      <Link href="/companies/xe" className="text-[var(--color-primary)] hover:underline">XE Business</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mt-3">
              Savings estimates based on 3.5% avg bank cost vs specialist provider rates. See{" "}
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
                    {page.intro.slice(0, 160)}...
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
                  80–95%
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
