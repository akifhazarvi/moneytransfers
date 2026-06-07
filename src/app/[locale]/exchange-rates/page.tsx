import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import LiveRatesBoard from "./LiveRatesBoard";
import TodayRates from "./TodayRates";
import LazyHistoricalRateWidget from "@/components/LazyHistoricalRateWidget";
import LiveTimestamp from "@/components/LiveTimestamp";
import { fetchExchangeRates } from "@/lib/exchange-rates";
import { getAlternates } from "@/lib/i18n-metadata";
import { getPairRate, formatRate, RATES_AS_OF } from "@/lib/exchange-rates-today";

// Revalidate hourly so "today's rate" + the as-of date stay fresh while the
// page stays fully prerendered (no per-request no-store — that was the May
// deindex root cause). The mid-market history dataset only changes daily.
export const revalidate = 3600;

// Human-readable "as of" date for the H1/intro, derived from the dataset.
const AS_OF = RATES_AS_OF
  ? new Date(RATES_AS_OF + "T00:00:00Z").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
  : "today";

// Answer-first lead rates — the single most citable block for AI engines.
const LEAD_PAIRS: [string, string][] = [
  ["USD", "INR"],
  ["USD", "PHP"],
  ["USD", "MXN"],
  ["GBP", "INR"],
  ["USD", "PKR"],
];
const leadRates = LEAD_PAIRS.map(([from, to]) => {
  const r = getPairRate(from, to);
  return r ? { from, to, rate: formatRate(r.rate) } : null;
}).filter((x): x is { from: string; to: string; rate: string } => x !== null);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "exchangeRates" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
    alternates: getAlternates("exchange-rates", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/exchange-rates",
      type: "website",
      images: [{ url: "https://sendmoneycompare.com/opengraph-image", width: 1200, height: 630, alt: "Live Exchange Rates — SendMoneyCompare" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

const popularCorridors = [
  { slug: "usa-to-india", from: "USD", to: "INR", label: "USA to India", flag: "\u{1F1EE}\u{1F1F3}" },
  { slug: "usa-to-pakistan", from: "USD", to: "PKR", label: "USA to Pakistan", flag: "\u{1F1F5}\u{1F1F0}" },
  { slug: "usa-to-philippines", from: "USD", to: "PHP", label: "USA to Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { slug: "usa-to-mexico", from: "USD", to: "MXN", label: "USA to Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { slug: "usa-to-nigeria", from: "USD", to: "NGN", label: "USA to Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { slug: "uk-to-india", from: "GBP", to: "INR", label: "UK to India", flag: "\u{1F1EE}\u{1F1F3}" },
  { slug: "uk-to-europe", from: "GBP", to: "EUR", label: "UK to Europe", flag: "\u{1F1EA}\u{1F1FA}" },
  { slug: "canada-to-india", from: "CAD", to: "INR", label: "Canada to India", flag: "\u{1F1EE}\u{1F1F3}" },
];

const topRatePairs = [
  { slug: "usd-to-inr", from: "USD", to: "INR", label: "USD to INR" },
  { slug: "gbp-to-inr", from: "GBP", to: "INR", label: "GBP to INR" },
  { slug: "usd-to-php", from: "USD", to: "PHP", label: "USD to PHP" },
  { slug: "usd-to-mxn", from: "USD", to: "MXN", label: "USD to MXN" },
  { slug: "usd-to-pkr", from: "USD", to: "PKR", label: "USD to PKR" },
  { slug: "usd-to-eur", from: "USD", to: "EUR", label: "USD to EUR" },
  { slug: "gbp-to-usd", from: "GBP", to: "USD", label: "GBP to USD" },
  { slug: "eur-to-usd", from: "EUR", to: "USD", label: "EUR to USD" },
  { slug: "usd-to-cad", from: "USD", to: "CAD", label: "USD to CAD" },
  { slug: "usd-to-jpy", from: "USD", to: "JPY", label: "USD to JPY" },
  { slug: "cad-to-inr", from: "CAD", to: "INR", label: "CAD to INR" },
  { slug: "usd-to-ngn", from: "USD", to: "NGN", label: "USD to NGN" },
];

const faqs = [
  {
    question: "What is today's exchange rate?",
    answer:
      `As of ${AS_OF}, the mid-market rates are` +
      (leadRates.length
        ? ` ${leadRates.map((r) => `1 ${r.from} = ${r.rate} ${r.to}`).join(", ")}. `
        : " shown live above. ") +
      "These are mid-market (interbank) rates — the fairest reference rate, before any provider adds a markup. The rate your bank or transfer service offers will be slightly lower.",
  },
  {
    question: "What is the mid-market exchange rate?",
    answer:
      "The mid-market rate (also called the interbank rate) is the midpoint between the buy and sell prices of two currencies on the global market. It's the fairest exchange rate available and the one you'll see on Google or Reuters. Banks and money transfer services typically add a markup on top of this rate — that markup is their profit.",
  },
  {
    question: "How often are these exchange rates updated?",
    answer:
      "The headline rates and 12-month charts on this page use a daily mid-market history covering 60+ currencies. The live ticker at the bottom of the page refreshes every 60 seconds and aggregates the median of 4 independent free rate feeds (ExchangeRate-API, Fawaz Ahmed CDN, FloatRates, Currency-API Pages) to remove outliers.",
  },
  {
    question: "Why is my bank's exchange rate different from the mid-market rate?",
    answer:
      "Banks and transfer services add a margin (markup) to the mid-market rate. This is one of the main ways they make money on international transfers. The markup can range from 0.5% to 5% or more depending on the provider and currency corridor. Use our comparison tool to find providers offering rates closest to the mid-market rate.",
  },
  {
    question: "Which is the best provider to send money at the real exchange rate?",
    answer:
      "Providers like Wise and Revolut advertise the mid-market rate with a transparent upfront fee, while banks and cash-payout services usually bake their profit into a worse rate. The cheapest option changes by corridor and amount, so compare live quotes for your exact route — our send-money pages rank every provider by how much the recipient actually receives.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Exchange Rates Today — Live Mid-Market Rates",
  description:
    "Live mid-market exchange rates for 60+ currencies with 12-month trend charts, plus the best provider rate and payout for popular remittance corridors.",
  url: "https://sendmoneycompare.com/exchange-rates",
  dateModified: RATES_AS_OF || undefined,
  isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Exchange Rates", item: "https://sendmoneycompare.com/exchange-rates" },
    ],
  },
};

const rateSpecSchema = {
  "@context": "https://schema.org",
  "@graph": leadRates.map((r) => ({
    "@type": "ExchangeRateSpecification",
    currency: r.from,
    currentExchangeRate: {
      "@type": "UnitPriceSpecification",
      price: r.rate,
      priceCurrency: r.to,
      unitText: `1 ${r.from} = ${r.rate} ${r.to}`,
    },
  })),
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Live mid-market exchange rates",
  description:
    "Daily mid-market (interbank) exchange rates for 60+ world currencies with 12-month history, aggregated from multiple independent sources.",
  url: "https://sendmoneycompare.com/exchange-rates",
  temporalCoverage: RATES_AS_OF ? `2025-06-08/${RATES_AS_OF}` : undefined,
  dateModified: RATES_AS_OF || undefined,
  creator: { "@type": "Organization", name: "SendMoneyCompare", url: "https://sendmoneycompare.com" },
  variableMeasured: "Mid-market exchange rate",
  isAccessibleForFree: true,
};

export default async function ExchangeRatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server-fetch live rates so the retro ticker pre-renders for crawlers too.
  const rates = await fetchExchangeRates();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rateSpecSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <div className="bg-[var(--color-surface)]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── Hero / answer-first ── */}
          <header className="mb-8 sm:mb-10">
            <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-on-surface-muted)] mb-3">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[var(--color-on-surface-variant)]">Exchange Rates</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-on-surface)] tracking-tight">
              Today&apos;s Exchange Rates
            </h1>
            <p className="mt-3 text-[15px] sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed max-w-3xl">
              Live <strong>mid-market exchange rates</strong> for 60+ currencies as of {AS_OF}.
              {leadRates.length > 0 && (
                <>
                  {" "}Right now <strong className="text-[var(--color-on-surface)] tabular-nums">
                    1 {leadRates[0].from} = {leadRates[0].rate} {leadRates[0].to}
                  </strong>{leadRates[1] && (
                    <>, <strong className="text-[var(--color-on-surface)] tabular-nums">
                      1 {leadRates[1].from} = {leadRates[1].rate} {leadRates[1].to}
                    </strong></>
                  )}.
                </>
              )}{" "}
              These are the real interbank rates — the fairest reference before banks and transfer
              services add their markup. <Link href="/send-money" className="text-[var(--color-primary)] hover:underline font-medium">Compare 50+ providers</Link> to
              see what you actually receive.
            </p>
            <p className="mt-2 text-xs text-[var(--color-on-surface-muted)]">
              <LiveTimestamp iso={`${RATES_AS_OF}T00:00:00Z`} prefix="Mid-market rates updated" /> · median of 4 independent sources
            </p>
          </header>

          {/* ── Chart at top ── */}
          <section className="mb-12 sm:mb-16" aria-labelledby="trends-heading">
            <h2 id="trends-heading" className="sr-only">Exchange rate trend chart</h2>
            <LazyHistoricalRateWidget defaultCorridor="USD-INR" />
          </section>

          {/* ── Today's rates (top 5 + expand) ── */}
          <section className="mb-12 sm:mb-16" aria-labelledby="today-heading">
            <h2 id="today-heading" className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-2">
              Today&apos;s Rates
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-[15px] mb-6 max-w-2xl">
              The five most-sent corridors first — each shows the mid-market rate, the best provider today,
              and what your recipient gets on a $1,000 send. Expand for the full list of 60+ currencies.
            </p>
            <TodayRates />
          </section>

          {/* ── Compare corridors ── */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-2">
              Compare Transfer Rates
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-[15px] mb-6">
              The mid-market rate is the fairest rate — but providers add markups. Compare actual rates from 50+ apps on these popular corridors.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popularCorridors.map((c) => (
                <Link
                  key={c.slug}
                  href={`/send-money/${c.slug}`}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all group"
                >
                  <span className="text-xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                      {c.label}
                    </div>
                    <div className="text-[12px] text-[var(--color-on-surface-variant)]">
                      {c.from} &rarr; {c.to}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Popular rate pairs (deep dives) ── */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-2">
              Popular Exchange Rate Pairs
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-[15px] mb-6">
              Full rate history, charts and provider rankings for the most-searched currency pairs.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {topRatePairs.map((pair) => {
                const r = getPairRate(pair.from, pair.to);
                return (
                  <Link
                    key={pair.slug}
                    href={`/exchange-rates/${pair.slug}`}
                    className="flex flex-col gap-1 px-4 py-3.5 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all group"
                  >
                    <span className="text-sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                      {pair.label}
                    </span>
                    {r && (
                      <span className="text-[13px] text-[var(--color-on-surface-variant)] tabular-nums">
                        1 {pair.from} = {formatRate(r.rate)} {pair.to}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Understanding exchange rates ── */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-4">
              Understanding Exchange Rates
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[var(--color-surface-dim)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">
                  Mid-Market Rate vs. Transfer Rate
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  The mid-market rate on this page is the &ldquo;real&rdquo; exchange rate — the midpoint between buy and sell prices on global currency markets. When you send money internationally, providers add a markup to this rate. That markup is their profit margin, and it can vary widely between services. Always compare the rate a provider offers against the mid-market rate to see the true cost.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-dim)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">
                  How We Calculate These Rates
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  Headline rates and charts use a daily mid-market history for 60+ currencies. The live ticker aggregates 4 independent feeds and takes the median to eliminate outliers — more reliable than any single source. Buy/sell spreads on the trading board are simulated from typical banking margins.
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-4">
              Need to convert a specific amount? Try our{" "}
              <Link href="/currency-converter" className="text-[var(--color-primary)] hover:underline font-medium">currency converter</Link>{" "}
              with live mid-market rates, or{" "}
              <Link href="/send-money" className="text-[var(--color-primary)] hover:underline font-medium">compare transfer providers</Link>{" "}
              to find the cheapest way to send money abroad.
            </p>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-[var(--color-outline)] overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                    {faq.question}
                    <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── Rate history CTA ── */}
          <section className="mb-12 bg-[var(--color-primary-surface)] rounded-2xl border border-[var(--color-primary)]/20 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">Historical Exchange Rates</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4 max-w-2xl">
              Track how provider exchange rates have moved over time across 90+ corridors. See which providers consistently offer the best rates and find the optimal time to send.
            </p>
            <Link
              href="/exchange-rates/history"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              View rate history for 90+ corridors
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </section>

          {/* ── Retro: Forex Trading Board (live ticker, demoted to bottom) ── */}
          <section aria-labelledby="board-heading">
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden bg-[var(--color-surface-dim)]">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 select-none">
                <div>
                  <h2 id="board-heading" className="text-lg font-semibold text-[var(--color-on-surface)]">
                    Live Forex Trading Board
                  </h2>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-0.5">
                    Retro airport-style ticker — TT/CHQ/Note buy &amp; sell rates, refreshing every 60s. For the curious.
                  </p>
                </div>
                <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-[var(--color-outline)]">
                <LiveRatesBoard initialRates={rates} />
              </div>
            </details>
          </section>

          {/* ── Disclaimer ── */}
          <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-10 leading-relaxed">
            Exchange rates shown are mid-market rates aggregated from multiple independent sources for informational purposes only.
            Actual rates offered by money transfer providers, banks, and currency exchange services will differ.
            These rates do not constitute financial advice and should not be relied upon for trading decisions.
          </p>
        </div>
      </div>
    </>
  );
}
