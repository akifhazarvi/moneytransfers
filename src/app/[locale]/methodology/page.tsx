import Container from "@/components/Container";
import PolicyLinks from "@/components/PolicyLinks";
import Link from "@/components/EligibleLink";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { COVERAGE, SITE_STATS, atLeast } from "@/lib/site-stats";
import { CONSISTENCY_INDEX } from "@/lib/consistency-index";
import { SENDSCORE_SUMMARY } from "@/lib/sendscore-summary";
import { PageByline } from "@/components/PageByline";
import { METHODOLOGY_AUTHOR_SLUG, pageUpdated } from "@/lib/content-dates";
import { providerReviews } from "@/data/provider-reviews";
import { companyPageRenders } from "@/lib/company-route";

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
      images: DEFAULT_OG_IMAGES,
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
  const t = await getTranslations({ locale, namespace: "methodology" });

  // Revision date of this page's text (the three named provider counts were
  // defined here on 2026-10-09), not of the data. Shared with sitemap.ts.
  const lastUpdated = pageUpdated("/methodology");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Methodology \u2014 How We Collect Data & Rank Providers",
            description:
              "A detailed explanation of how SendMoneyCompare collects exchange rate data, calculates total transfer costs, and ranks providers in our comparison tables.",
            author: {
              "@type": "Person",
              name: "Ahsan Mukhtar",
              url: "https://sendmoneycompare.com/about/ahsan-mukhtar",
              jobTitle: "Founder & CEO",
            },
            publisher: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              url: "https://sendmoneycompare.com",
            },
            datePublished: "2024-06-01",
            // The page's revision date, the one its byline shows and the
            // sitemap submits. A dateModified that moved with every scrape
            // (getDataUpdatedDate, until 2026-10-09) disagreed with both, and
            // a date that changes every day reads as automated (round-3 brief
            // \u00a74.4D). The figures' own freshness is stated in the text.
            dateModified: lastUpdated,
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
              How we collect data, calculate costs, and rank providers \u2014 in full
              detail.
            </p>
            {/* Round-3 QA item 7: the author was named only in JSON-LD and the
                date was month-only ("September 2026") against a sitemap
                lastmod of October 9. One constant now feeds the byline, the
                JSON-LD dateModified and the sitemap. */}
            <div className="mt-3">
              <PageByline
                authorSlug={METHODOLOGY_AUTHOR_SLUG}
                updated={lastUpdated}
                sourcesHref="/editorial-policy"
                sourcesLabel="Editorial policy"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Data Transparency Widget */}
      <section className="bg-[var(--color-surface-dim)] py-6 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: atLeast(SITE_STATS.trackedProviders), label: "Providers tracked" },
                { value: atLeast(SITE_STATS.comparableCorridors), label: "Corridors compared (2+ providers)" },
                { value: `${SITE_STATS.refreshHours} hrs`, label: "Data refresh cycle" },
                { value: atLeast(SITE_STATS.currencies), label: "Currencies supported" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-medium text-[var(--color-primary)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            {/* One definition per number. The site used to describe itself with
                four incompatible provider counts and two corridor counts because
                each page picked its own denominator; every count we publish now
                has a name here and is computed in src/lib/site-stats.ts. */}
            <dl className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-xs text-[var(--color-on-surface-variant)]">
              {/* The three provider counts (site-stats.ts, THE THREE PROVIDER
                  COUNTS). Every provider count on the site is one of them and
                  says which: tracked, compared for a route, or reviewed. */}
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">1. Providers tracked \u2014 {SITE_STATS.trackedProviders}</dt>
                <dd>Distinct providers with a live quote anywhere in our data, including banks quoted through comparison feeds. Elsewhere on the site this is rounded down to {atLeast(SITE_STATS.trackedProviders)} (&ldquo;we track {atLeast(SITE_STATS.trackedProviders)}{" "}providers&rdquo;), so the claim survives a provider dropping out between scrapes. Our indexes rank subsets of it and say so: the Provider Consistency Index ranks the {CONSISTENCY_INDEX.rows.length}{" "}with enough contested days.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">2. Providers compared \u2014 per route</dt>
                <dd>The providers with a comparable estimate for the route and amount a page is about: the rows its comparison prints (&ldquo;14 providers quote this route&rdquo;). It changes from page to page and with every refresh, so it is never quoted as a site-wide figure.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">3. Providers reviewed \u2014 {SITE_STATS.reviewedProviders}</dt>
                <dd>Providers with a review page at /companies that we list: regulation, fees, limits and features, recorded by our editors from each provider&rsquo;s published terms.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">Full editorial reviews \u2014 {providerReviews.filter((r) => companyPageRenders(r.slug)).length}</dt>
                <dd>Reviewed providers whose page also carries a written verdict, who the service suits and the alternatives worth comparing \u2014 a subset of the providers reviewed.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">Providers we sent test transfers with \u2014 {providerReviews.filter((r) => /\b(sent|conducted)\b[^.]*\btest transfers\b/i.test(r.howWeTested)).length}</dt>
                <dd>Reviewed providers whose review documents our own test transfers: corridors, dates and funding methods. The other reviews are based on collected quotes and, for LemFi and Unplex, the providers&rsquo; public rate APIs.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">Corridors compared \u2014 {SITE_STATS.comparableCorridors}</dt>
                <dd>Currency pairs where two or more providers quote, so a comparison actually exists. This is the number our copy uses.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">Corridors tracked \u2014 {SITE_STATS.corridorsWithData}</dt>
                <dd>Currency pairs with at least one quote. Describes the size of the dataset, never how many routes we compare.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">Rate-history pairs \u2014 {SITE_STATS.historyPairs}</dt>
                <dd>Currency pairs with a published daily rate history page.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-on-surface)]">Currencies supported \u2014 {SITE_STATS.currencies}</dt>
                <dd>Currencies selectable anywhere in the comparison tool.</dd>
              </div>
            </dl>
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
                  transfer \u2014 including hidden exchange rate markups \u2014 so they can
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
                  We collect exchange rate and fee data from {COVERAGE.providers}{" "}
                  every {SITE_STATS.refreshHours} hours using a combination of:
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
                    Data pipeline and source priority
                  </h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                    Our automated pipeline runs via GitHub Actions on a 6-hour
                    schedule. Each cycle executes API integrations and automated
                    quote simulations across all tracked providers and corridors.
                    Data is validated, deduplicated, and merged with source
                    priority weighting before being served to users.
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                    When two sources quote the same provider on the same corridor,
                    the higher-priority source wins \u2014 unless the lower-priority
                    source is more than 24 hours fresher, in which case the
                    fresher data takes precedence. This prevents a stale API
                    integration from being preferred over a more recently scraped
                    figure.
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    <strong>Source priority (highest to lowest):</strong> Direct
                    provider API &gt; Partner comparison API &gt; Third-party
                    aggregator &gt; Automated browser quote &gt; Gap-fill
                    estimates. Gap-fill rows are used only on corridors where no
                    higher-priority source covers the provider, and they are never
                    used for the providers whose own APIs or scrapers already
                    supply us with data on any corridor.
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

            {/* Data Integrity */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Data integrity checks
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Every incoming quote passes a set of automated integrity checks
                  before it can influence a comparison ranking. Rows that fail a
                  check are quarantined \u2014 retained in the raw dataset for auditing
                  but excluded from the rankings shown to users.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Beating the interbank rate:</strong>{" "}
                  No legitimate retail money transfer provider can consistently
                  offer a recipient more than the mid-market rate \u2014 doing so would
                  mean the provider absorbs a loss on every transaction. If a
                  quote&apos;s implied exchange rate exceeds our mid-market
                  benchmark by more than a defined tolerance, the row is
                  quarantined as a probable promotional or error rate. We maintain
                  a separate list of currencies where official and market rates
                  legitimately diverge (for example, currencies with capital
                  controls); quotes on those corridors are evaluated against the
                  parallel market rate instead.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Stale data:</strong>{" "}
                  Each quote row carries the UTC timestamp of its most recent
                  fetch. If a row falls more than 72 hours behind the freshest
                  data for the same provider on the same corridor, it is
                  quarantined as stale. The provider will appear as unavailable
                  for that route rather than showing an outdated rate, because an
                  old rate can be worse for the user than no rate at all.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Promotional and first-transfer rates:</strong>{" "}
                  Some providers offer a significantly better rate for a new
                  customer&apos;s first transfer, or for a limited promotional
                  window. We identify these rows and store them separately. The
                  headline rate shown in comparison tables is always the standard
                  rate; promotional rates are labelled as such and displayed
                  alongside the standard rate where they apply.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Placeholder quotes:</strong>{" "}
                  A scraper that cannot retrieve a live quote for a given corridor
                  records nothing \u2014 it does not insert a fallback figure. A
                  provider that gives no quote is absent from the comparison for
                  that route, rather than appearing with a mid-market rate and a
                  zero fee, which would misrepresent its true cost.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Fee shape validation:</strong>{" "}
                  Some providers publish tiered fee schedules where the fee
                  depends on the send amount, while others charge a flat fee
                  regardless of amount. Our scrapers and parsers are built to
                  read both structures. A fee of zero from a provider that
                  publishes non-zero fees in its own documentation is flagged as
                  a parse gap and logged for review, rather than being accepted
                  silently.
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
                  aggregate data from {COVERAGE.providers} across {COVERAGE.corridors} currency
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
                  \u2014 the midpoint between buy and sell rates on global currency
                  markets. This is widely considered the &quot;real&quot;
                  exchange rate, and it is the same benchmark that EU law
                  (Regulation 2019/518) requires providers to use when disclosing
                  their currency conversion charges to customers.
                </p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                    Mid-market rate sources
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-2sm text-[var(--color-on-surface-variant)]">
                    <li>
                      <strong>European Central Bank (ECB)</strong> \u2014 official
                      reference rates published daily at approximately 16:00 CET.
                      The ECB rate is our primary reference for EUR-based pairs
                      and is the benchmark EU law specifies for markup disclosure.
                    </li>
                    <li>
                      <strong>ExchangeRate.host</strong> \u2014 aggregated
                      mid-market rate API used for near-real-time rates outside
                      ECB publishing hours and for currency pairs the ECB does
                      not cover.
                    </li>
                    <li>
                      <strong>Open Exchange Rates</strong> \u2014 widely used FX
                      data provider, used as a cross-check and fallback where
                      the primary sources diverge by more than a defined
                      tolerance.
                    </li>
                  </ul>
                </div>
                <p>
                  By cross-referencing multiple sources, we ensure our benchmark
                  rate is accurate and resilient to any single data feed
                  experiencing outages or delays. The markup percentage we
                  publish for a provider on a given corridor is always the
                  provider&apos;s rate measured against the mid-market rate, never
                  against another provider&apos;s rate \u2014 comparing two retail
                  rates against each other would obscure how much both deviate
                  from the true market price.
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
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Transfer fee:</strong> The flat or percentage-based
                    fee a provider charges to process your transfer. This is
                    usually stated upfront \u2014 e.g., &quot;$2.99 fee&quot; or
                    &quot;1% of send amount.&quot;
                  </li>
                  <li>
                    <strong>Exchange rate markup:</strong> The difference between
                    the provider&apos;s exchange rate and the mid-market rate.
                    This is often the larger cost, but many providers don&apos;t
                    disclose it explicitly.
                  </li>
                </ul>
              </div>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed mt-4">
                <p>Our formula for ranking is straightforward:</p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 font-mono text-2sm text-[var(--color-on-surface)]">
                  <p>
                    Receive amount = (Send amount \u2212 Transfer fee) \u00d7 Provider
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
                      INR/USD \u2192 Recipient gets ($1,000 \u2212 $4.99) \u00d7 83.20 ={" "}
                      <strong className="text-[var(--color-success)]">
                        \u20b982,784.97
                      </strong>
                    </p>
                    <p>
                      <strong>Provider B:</strong> $0 fee, rate of 82.50
                      INR/USD \u2192 Recipient gets ($1,000 \u2212 $0) \u00d7 82.50 ={" "}
                      <strong>\u20b982,500.00</strong>
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
                  <strong>receive amount</strong> \u2014 the total amount your
                  recipient gets in the destination currency after all fees and
                  exchange rate markups.
                </p>
                <p>This ranking is:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Corridor-specific:</strong> A provider that&apos;s
                    cheapest for USD \u2192 INR may not be cheapest for GBP \u2192 EUR.
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
                <p>
                  Where two providers deliver receive amounts within 0.1% of each
                  other \u2014 a difference that is within normal rate-movement noise
                  \u2014 their relative order is decided by SendScore on that corridor,
                  which reflects consistency of value over time rather than a
                  single snapshot. Indicative quotes (where a provider has
                  published a rate but not confirmed it for the specific transfer)
                  are displayed but not ranked; they do not compete for the top
                  position.
                </p>
              </div>
            </div>

            {/* The disclosure standard we rank against \u2014 added 2026-09-20.
                This page explained our formula but never named the standard it
                implements, so the ranking read as a house rule rather than as
                the figure two regulators already require a provider to state.
                The AI-citation trial on the same date showed the engines citing
                CFPB alongside every ranking question while we held 0% share of
                that topic: we had the method and none of the grounding. Both
                citations were verified by GET and each substantiates the
                specific sentence it sits next to. */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                The disclosure standard we rank against
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  The receive amount is not a metric we invented. Two regulators
                  already define the cost of a transfer the same way, and our
                  tables compute what they require each provider to state.
                </p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 space-y-4">
                  <div>
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      United States \u2014 CFPB Remittance Transfer Rule
                    </h3>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      Regulation E requires a provider to disclose, before you
                      pay, the exchange rate it will apply (
                      <a
                        href="https://www.consumerfinance.gov/rules-policy/regulations/1005/31/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline"
                      >
                        &sect;&nbsp;1005.31(b)(1)(iv)
                      </a>
                      ), each fee, and the amount that will be received
                      (&sect;&nbsp;1005.31(b)(1)(vii)). That last figure &mdash;
                      the amount received &mdash; is the one our tables sort on.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      European Union &mdash; Regulation (EU) 2019/518
                    </h3>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      EU law is explicit about the markup in particular. It
                      requires currency conversion charges to be expressed{" "}
                      <a
                        href="https://eur-lex.europa.eu/eli/reg/2019/518/oj"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline"
                      >
                        &quot;as a percentage mark-up over the latest available
                        euro foreign exchange reference rates issued by the
                        European Central Bank&quot;
                      </a>
                      , disclosed before the payment is initiated. That is the
                      same calculation behind every markup percentage on this
                      site: provider rate measured against the ECB reference
                      rate, never against another provider&apos;s rate.
                    </p>
                  </div>
                </div>
                <p>
                  <strong className="text-[var(--color-on-surface)]">
                    Where those rules stop.
                  </strong>{" "}
                  Both govern what a provider must tell you about its own quote.
                  Neither requires anyone to show you what a competitor would
                  have delivered on the same transfer, so a fully compliant
                  disclosure can still be the most expensive option on the
                  corridor. Closing that gap is the whole job of this site: we
                  take the figure the law already makes each provider state, and
                  compute it across {atLeast(SITE_STATS.liveProviders)} providers
                  on the same corridor, at the same amount, at the same moment.
                </p>
              </div>
            </div>

            {/* Metrics we publish \u2014 added 2026-09-06. This page described how
                costs are calculated and ranked, but never mentioned the two
                named metrics the site actually publishes, so neither had a
                definition a reader could reach from here. */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Metrics we publish
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Two named measurements appear across the site. Both are computed from our own recorded provider
                  quotes rather than from mid-market rates, and each has a page setting out its method and its limits.
                </p>
                <p>
                  <Link href="/sendscore" className="text-[var(--color-primary)] hover:underline">
                    <strong>SendScore</strong>
                  </Link>{" "}
                  rates 0&ndash;100 whether today is a good day to send on a corridor, from four weighted components.
                  It is backward-looking and is not a forecast. It is available on the{" "}
                  {SENDSCORE_SUMMARY.corridorsScored} corridors where enough providers compete to make a comparison
                  meaningful; on single-provider corridors it is clamped and labelled as a reading rather than a
                  comparison.
                </p>
                <p>
                  The{" "}
                  <Link href="/provider-consistency" className="text-[var(--color-primary)] hover:underline">
                    <strong>Provider Consistency Index</strong>
                  </Link>{" "}
                  measures how often each provider actually delivers the most, across{" "}
                  {CONSISTENCY_INDEX.providerDayObservations.toLocaleString("en-US")} provider-day observations on{" "}
                  {CONSISTENCY_INDEX.comparableCorridors}{" "}corridors. A day counts only when at least two providers
                  quoted &mdash; winning unopposed is not evidence.
                </p>
                <p>
                  Every dataset we publish, with its method and its limits, is indexed on{" "}
                  <Link href="/research" className="text-[var(--color-primary)] hover:underline">
                    the research hub
                  </Link>
                  . Provider-level cost averages are published separately as the{" "}
                  <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
                    Remittance Cost Index
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Provider Evaluation */}
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Provider evaluation criteria
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Beyond cost rankings, we evaluate providers across four
                  additional dimensions to give users a complete picture of each
                  service.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Regulation:</strong>{" "}
                  We verify each provider&apos;s regulatory status with the bodies
                  that govern money transmission in their key markets: the
                  Financial Conduct Authority (FCA) in the UK, FinCEN and state
                  money transmitter licences in the US, ASIC in Australia, and
                  the relevant authority in each jurisdiction where the provider
                  operates. We check both that a licence exists and that it
                  covers the specific activity \u2014 transmitting funds \u2014 rather than
                  a related but distinct activity such as holding electronic
                  money.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Transfer speed:</strong>{" "}
                  We record the delivery window a provider publishes for each
                  payment method on each corridor \u2014 same-day, next-day, or
                  2\u20135 business days \u2014 taken directly from the provider&apos;s
                  own disclosure. Where we have conducted our own test transfers,
                  documented on each provider&apos;s review page, we record the
                  actual elapsed time from payment confirmation to recipient
                  credit. We do not publish a delivery estimate where the
                  provider has not disclosed one.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Coverage:</strong>{" "}
                  We record the number of supported source countries, destination
                  countries, currencies, and delivery methods \u2014 bank transfer,
                  mobile wallet, and cash pickup \u2014 for each provider. Coverage
                  data comes from each provider&apos;s publicly stated supported
                  markets and is updated when we detect changes during our
                  regular review cycle.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">Customer reviews:</strong>{" "}
                  We collect Trustpilot review scores automatically for each
                  reviewed provider and display them alongside our data. We never
                  hand-type a rating \u2014 only scores fetched programmatically from
                  the platform are shown, and the fetch timestamp is recorded so
                  the score&apos;s age is transparent to the reader.
                </p>
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
                    &quot;better for business payments&quot;). A verdict labels
                    an editorial pick, not a data rank \u2014 the two are always
                    presented separately so the reader can see both the measured
                    cost outcome and the editorial judgement.
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

            {/* Who maintains it. An anonymous "reviewed by the Editorial Team"
                box claimed a review no named person signed (round-3 brief
                \u00a74.3: name an independent reviewer or drop the claim). The
                byline above names the author; this names the owner. */}
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <p className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                Who maintains this methodology
              </p>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center text-lg font-medium text-[var(--color-primary)] shrink-0">
                  AM
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">
                    <Link href="/about/ahsan-mukhtar" className="text-[var(--color-primary)] hover:underline">
                      Ahsan Mukhtar
                    </Link>
                    , Founder &amp; CEO
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
                    Maintains the data collection method and the provider
                    evaluation criteria. Questions or errors:{" "}
                    <Link href="/contact" className="text-[var(--color-primary)] hover:underline">
                      contact us
                    </Link>
                    .
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
                \u2014 our scoring criteria and rating scale.{" "}
                <Link
                  href="/editorial-policy"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Editorial Policy
                </Link>{" "}
                \u2014 how we maintain independence.{" "}
                <Link
                  href="/companies"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Provider Directory
                </Link>{" "}
                \u2014 all tracked providers.{" "}
                <Link
                  href="/send-money"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Compare Rates
                </Link>{" "}
                \u2014 see live comparisons.
              </p>
            </div>
          </div>
          <PolicyLinks current="/methodology" />
        </Container>
      </section>
    </>
  );
}
