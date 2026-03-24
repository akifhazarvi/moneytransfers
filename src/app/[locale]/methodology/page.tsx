import Container from "@/components/Container";
import Link from "next/link";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("methodology", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/methodology",
    },
  };
}

const trackedProviders = [
  "Wise",
  "Remitly",
  "Western Union",
  "MoneyGram",
  "OFX",
  "XE",
  "TapTap Send",
  "ACE Money Transfer",
  "WorldRemit",
  "Revolut",
  "PayPal",
  "Xoom (PayPal)",
  "TorFX",
  "InstaReM",
];

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("methodology");

  const lastUpdated = "March 2026";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Methodology — How We Collect Data & Rank Providers",
            description:
              "A detailed explanation of how SendMoneyCompare collects exchange rate data, calculates total transfer costs, and ranks providers in our comparison tables.",
            author: {
              "@type": "Person",
              name: "Daniel Rowe",
              url: "https://sendmoneycompare.com/about/daniel-rowe",
              jobTitle:
                "Product Manager – Fintech & International Payments",
            },
            publisher: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              url: "https://sendmoneycompare.com",
            },
            datePublished: "2024-06-01",
            dateModified: "2026-03-14",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://sendmoneycompare.com/methodology",
            },
          }),
        }}
      />

      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("title")}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              How we collect data, calculate costs, and rank providers — in full
              detail.
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">
              Last updated: {lastUpdated} · Data refresh frequency: every 6
              hours
            </p>
          </div>
        </Container>
      </section>

      {/* Data Transparency Widget */}
      <section className="bg-[var(--color-surface-dim)] py-6 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-medium text-[var(--color-primary)]">
                  60+
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                  Providers tracked
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-[var(--color-primary)]">
                  64+
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                  Currency corridors
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-[var(--color-primary)]">
                  6 hrs
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                  Data refresh cycle
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-[var(--color-primary)]">
                  20+
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                  Currencies supported
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Introduction */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("ourMission")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our mission is to provide transparent, data-driven comparisons
                  of international money transfer services. We believe people
                  sending money abroad deserve to see the true cost of every
                  transfer — including hidden exchange rate markups — so they can
                  make informed choices.
                </p>
                <p>
                  This page explains exactly how we collect data, calculate
                  costs, rank providers, and maintain editorial independence.
                </p>
              </div>
            </div>

            {/* Data Collection */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("dataCollection")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We collect exchange rate and fee data from 60+ money transfer
                  providers every 6 hours using a combination of:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Provider APIs:</strong> Where available, we use
                    official APIs to pull live exchange rates and fee schedules
                    programmatically. This is the most reliable and up-to-date
                    source.
                  </li>
                  <li>
                    <strong>Website scraping:</strong> For providers without
                    public APIs, we use automated tools to extract quote data
                    from their pricing pages and transfer calculators. We
                    simulate real transfer requests to capture the rates a
                    customer would actually see.
                  </li>
                  <li>
                    <strong>Comparison aggregation:</strong> We cross-reference
                    data from established comparison platforms to fill coverage
                    gaps and validate our own findings.
                  </li>
                </ul>

                {/* Data Pipeline Detail */}
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 mt-4">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                    Data pipeline
                  </h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                    Our automated pipeline runs via GitHub Actions on a 6-hour
                    schedule. Each cycle executes API integrations and automated
                    quote simulations across all tracked providers and corridors.
                    Data is validated, deduplicated, and merged with source
                    priority weighting before being served to users.
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    <strong>Source priority:</strong> Direct provider API &gt;
                    Comparison aggregator &gt; Third-party API &gt; Fallback
                    estimates
                  </p>
                </div>

                <p>
                  Every data point includes a timestamp so you can see exactly
                  when it was last updated. If a provider&apos;s data is stale or
                  unavailable, we flag it clearly rather than showing potentially
                  outdated figures.
                </p>
              </div>
            </div>

            {/* Providers Tracked */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("providersWeTrack")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We currently track quotes and fees from the following
                  providers, among others:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
                  {trackedProviders.map((provider) => (
                    <div
                      key={provider}
                      className="bg-[var(--color-surface-dim)] rounded-lg px-3 py-2 text-2sm text-[var(--color-on-surface)]"
                    >
                      {provider}
                    </div>
                  ))}
                </div>
                <p className="text-2sm">
                  This list represents our core tracked providers. In total, we
                  aggregate data from 60+ providers across 64+ currency
                  corridors including many regional and corridor-specific
                  services. See our full{" "}
                  <Link
                    href="/companies"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    provider directory
                  </Link>{" "}
                  for the complete list.
                </p>
              </div>
            </div>

            {/* Exchange Rate Benchmark */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("exchangeRateBenchmark")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  To calculate a provider&apos;s exchange rate markup, we compare
                  their offered rate against the <strong>mid-market rate</strong>{" "}
                  — the midpoint between buy and sell rates on global currency
                  markets. This is widely considered the &quot;real&quot;
                  exchange rate.
                </p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                    Mid-market rate sources
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-2sm text-[var(--color-on-surface-variant)]">
                    <li>
                      <strong>European Central Bank (ECB)</strong> — official
                      reference rates published daily
                    </li>
                    <li>
                      <strong>ExchangeRate.host</strong> — aggregated
                      mid-market rate API
                    </li>
                    <li>
                      <strong>Open Exchange Rates</strong> — widely used FX
                      data provider
                    </li>
                  </ul>
                </div>
                <p>
                  By cross-referencing multiple sources, we ensure our benchmark
                  rate is accurate and resilient to any single data feed
                  experiencing outages or delays.
                </p>
              </div>
            </div>

            {/* Cost Calculation */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("howWeCalculateTotalCost")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  The cost of an international transfer has two components, and
                  looking at either one in isolation is misleading:
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 my-4">
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                    1. Transfer fee
                  </h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    The flat or percentage-based fee a provider charges to
                    process your transfer. This is usually stated upfront —
                    e.g., &quot;$2.99 fee&quot; or &quot;1% of send amount.&quot;
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                    2. Exchange rate markup
                  </h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    The difference between the provider&apos;s exchange rate and
                    the mid-market rate. This is often the larger cost, but many
                    providers don&apos;t disclose it explicitly.
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>Our formula for ranking is straightforward:</p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 font-mono text-2sm text-[var(--color-on-surface)]">
                  <p>
                    Receive amount = (Send amount − Transfer fee) × Provider
                    exchange rate
                  </p>
                  <p className="mt-2 text-[var(--color-on-surface-variant)]">
                    The provider that produces the highest receive amount ranks
                    #1.
                  </p>
                </div>

                {/* Example Transfer */}
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                    Example: Sending $1,000 USD to India (INR)
                  </h3>
                  <div className="space-y-2 text-2sm text-[var(--color-on-surface-variant)]">
                    <p>
                      <strong>Provider A:</strong> $4.99 fee, rate of 83.20
                      INR/USD → Recipient gets ($1,000 − $4.99) × 83.20 ={" "}
                      <strong className="text-[var(--color-success)]">
                        ₹82,784.97
                      </strong>
                    </p>
                    <p>
                      <strong>Provider B:</strong> $0 fee, rate of 82.50
                      INR/USD → Recipient gets ($1,000 − $0) × 82.50 ={" "}
                      <strong>₹82,500.00</strong>
                    </p>
                    <p className="mt-2">
                      Despite charging a fee, Provider A delivers more money
                      because their exchange rate is closer to the mid-market
                      rate. This is why we rank by receive amount, not fees
                      alone.
                    </p>
                  </div>
                </div>

                <p>
                  This approach captures the full cost of the transfer in a
                  single, comparable number. A provider with &quot;zero fees&quot;
                  but a poor exchange rate will correctly rank below a provider
                  that charges a small fee but uses the mid-market rate.
                </p>
              </div>
            </div>

            {/* Ranking Logic */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("howProvidersAreRanked")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  In our comparison tables, providers are ranked by{" "}
                  <strong>receive amount</strong> — the total amount your
                  recipient gets in the destination currency after all fees and
                  exchange rate markups.
                </p>
                <p>This ranking is:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Corridor-specific:</strong> A provider that&apos;s
                    cheapest for USD → INR may not be cheapest for GBP → EUR.
                    Rankings change based on the currencies involved.
                  </li>
                  <li>
                    <strong>Amount-specific:</strong> Some providers offer better
                    rates for larger transfers. Rankings can shift based on the
                    send amount.
                  </li>
                  <li>
                    <strong>Time-specific:</strong> Exchange rates fluctuate
                    throughout the day. Our data refreshes every 6 hours to keep
                    rankings current.
                  </li>
                  <li>
                    <strong>Not influenced by affiliate status:</strong> Whether
                    or not a provider has a commercial relationship with us has
                    zero effect on its ranking position.
                  </li>
                </ul>
              </div>
            </div>

            {/* Provider Evaluation */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Provider evaluation criteria
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Beyond cost rankings, we evaluate providers across additional
                  criteria to give users a complete picture:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 my-4">
                  <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      Regulation
                    </h3>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      We verify each provider&apos;s regulatory status with
                      bodies such as the FCA (UK), FinCEN (US), ASIC
                      (Australia), and others.
                    </p>
                  </div>
                  <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      Transfer speed
                    </h3>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      We track estimated delivery times for each corridor and
                      payment method, sourced directly from providers.
                    </p>
                  </div>
                  <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      Coverage
                    </h3>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      We record the number of supported countries, currencies,
                      and delivery methods (bank transfer, mobile wallet, cash
                      pickup).
                    </p>
                  </div>
                  <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      Customer reviews
                    </h3>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      We scrape Trustpilot ratings daily and display them
                      alongside our data to reflect real customer experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Articles */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                How comparisons are made
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our side-by-side comparison articles (e.g., &quot;Wise vs
                  Remitly&quot;) evaluate two providers across multiple
                  dimensions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Cost comparison:</strong> We run the same transfer
                    amount through both providers across multiple corridors and
                    compare receive amounts.
                  </li>
                  <li>
                    <strong>Feature comparison:</strong> We compare supported
                    countries, delivery methods, transfer speed, payment options,
                    and app experience.
                  </li>
                  <li>
                    <strong>Regulation:</strong> We verify and compare the
                    regulatory status of both providers.
                  </li>
                  <li>
                    <strong>Best-for verdict:</strong> Rather than declaring a
                    single winner, we identify which provider is better for
                    specific use cases (e.g., &quot;better for small
                    transfers,&quot; &quot;better for cash pickup,&quot;
                    &quot;better for business payments&quot;).
                  </li>
                </ul>
              </div>
            </div>

            {/* Limitations */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Limitations
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We aim for accuracy, but we want to be transparent about the
                  inherent limitations of our data:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Exchange rates change continuously. Our 6-hour refresh cycle
                    means there may be brief windows where the live rate on a
                    provider&apos;s site differs from what we show.
                  </li>
                  <li>
                    Some providers offer promotional rates, first-transfer
                    discounts, or volume-based pricing that may not be reflected
                    in our standard data collection.
                  </li>
                  <li>
                    Delivery times are estimates provided by providers and may
                    vary based on compliance checks, weekends, holidays, and
                    payment methods.
                  </li>
                  <li>
                    We cannot cover every provider in every country. If a
                    provider is missing from our comparison, it may be because we
                    have not yet added it to our data pipeline.
                  </li>
                </ul>
                <p>
                  If you notice a discrepancy between our data and a
                  provider&apos;s current pricing, please{" "}
                  <Link
                    href="/contact"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    let us know
                  </Link>{" "}
                  so we can investigate and correct it.
                </p>
              </div>
            </div>

            {/* Editorial Independence */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Editorial independence
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We may earn a referral fee if you open an account with a
                  provider through our links. This does not influence our
                  rankings or comparisons. Providers cannot pay for higher
                  placement, and affiliate relationships are never a factor in
                  our data-driven rankings.
                </p>
                <p>
                  Our comparison tables are generated algorithmically based on
                  the receive amount calculation described above. Editorial
                  content such as reviews and guides is researched independently
                  and reflects our honest assessment.
                </p>
                <p>
                  For full details, see our{" "}
                  <Link
                    href="/editorial-policy"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Editorial Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Author / Reviewer */}
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                Methodology reviewed by
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center text-lg font-medium text-[var(--color-primary)] shrink-0">
                  SMC
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">
                    SendMoneyCompare Editorial Team
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
                    Our team oversees data collection methodology, provider
                    evaluation criteria, and editorial standards to ensure
                    accurate and unbiased comparisons.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <strong className="text-[var(--color-on-surface)]">
                  Related:
                </strong>{" "}
                <Link
                  href="/how-we-review"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  How We Review Providers
                </Link>{" "}
                — our scoring criteria and rating scale.{" "}
                <Link
                  href="/editorial-policy"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Editorial Policy
                </Link>{" "}
                — how we maintain independence.{" "}
                <Link
                  href="/companies"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Provider Directory
                </Link>{" "}
                — all tracked providers.{" "}
                <Link
                  href="/send-money"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Compare Rates
                </Link>{" "}
                — see live comparisons.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
