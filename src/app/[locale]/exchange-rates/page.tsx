import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import LiveRatesBoard from "./LiveRatesBoard";
import TodayRates from "./TodayRates";
import LazyHistoricalRateWidget from "@/components/LazyHistoricalRateWidget";
import LiveTimestamp from "@/components/LiveTimestamp";
import SendVerdictHero, { type VerdictData } from "@/components/SendVerdictHero";
import { fetchExchangeRates } from "@/lib/exchange-rates";
import { getAlternates } from "@/lib/i18n-metadata";
import { getPairRate, formatRate, getSendVerdict, RATES_AS_OF } from "@/lib/exchange-rates-today";

// Revalidate hourly so "today's rate" + the as-of date stay fresh while the
// page stays fully prerendered (no per-request no-store — the May deindex
// root cause). The mid-market history dataset only changes daily.
export const revalidate = 3600;

const AS_OF = RATES_AS_OF
  ? new Date(RATES_AS_OF + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
  : "today";

// Curated corridor picker — popular send currencies → top diaspora destinations
// (kept short on purpose; the full list lives in the rate table below).
const HERO_CORRIDORS = [
  { from: "USD", to: "INR", label: "USD → INR" },
  { from: "USD", to: "PHP", label: "USD → PHP" },
  { from: "USD", to: "MXN", label: "USD → MXN" },
  { from: "USD", to: "PKR", label: "USD → PKR" },
  { from: "USD", to: "NGN", label: "USD → NGN" },
  { from: "USD", to: "EUR", label: "USD → EUR" },
  { from: "USD", to: "GBP", label: "USD → GBP" },
  { from: "USD", to: "CAD", label: "USD → CAD" },
  { from: "GBP", to: "INR", label: "GBP → INR" },
  { from: "GBP", to: "PKR", label: "GBP → PKR" },
  { from: "GBP", to: "EUR", label: "GBP → EUR" },
  { from: "GBP", to: "NGN", label: "GBP → NGN" },
  { from: "EUR", to: "INR", label: "EUR → INR" },
  { from: "EUR", to: "USD", label: "EUR → USD" },
  { from: "CAD", to: "INR", label: "CAD → INR" },
  { from: "AUD", to: "INR", label: "AUD → INR" },
  { from: "AED", to: "INR", label: "AED → INR" },
  { from: "AED", to: "PKR", label: "AED → PKR" },
  { from: "AED", to: "PHP", label: "AED → PHP" },
  { from: "SAR", to: "INR", label: "SAR → INR" },
];

const leadVerdict = getSendVerdict("USD", "INR", 1000);
const leadRate = getPairRate("USD", "INR");

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
    question: "Is now a good time to send money abroad?",
    answer:
      leadVerdict
        ? `It depends on the corridor. Right now ${leadVerdict.from}→${leadVerdict.to} rates are ${leadVerdict.level} — today's best rate beats ${leadVerdict.levelPct}% of the last ${leadVerdict.daysTracked} days we've tracked. Use the tool at the top of this page to check your own corridor: it shows whether today is a good or weak day to send and how much your recipient receives.`
        : "Use the tool at the top of this page: it compares today's rate against the last 2–3 months we've tracked for your corridor and tells you whether it's a good or weak day to send.",
  },
  {
    question: "What is today's exchange rate?",
    answer:
      `As of ${AS_OF}, ` + (leadRate ? `1 USD = ${formatRate(leadRate.rate)} INR. ` : "") +
      "These are mid-market (interbank) rates — the fairest reference rate, before any provider adds a markup. The rate your bank or transfer service offers will be slightly lower. See the full table on this page for 60+ currencies.",
  },
  {
    question: "What is the mid-market exchange rate?",
    answer:
      "The mid-market rate (also called the interbank rate) is the midpoint between the buy and sell prices of two currencies on the global market. It's the fairest exchange rate available and the one you'll see on Google or Reuters. Banks and money transfer services typically add a markup on top of this rate — that markup is their profit.",
  },
  {
    question: "Why is my bank's exchange rate different from the mid-market rate?",
    answer:
      "Banks and transfer services add a margin (markup) to the mid-market rate. This is one of the main ways they make money on international transfers. The markup ranges from 0.5% to 5% or more depending on the provider and corridor. Use the tool above to find the provider offering the rate closest to mid-market for your route.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Exchange Rates Today — Is Now a Good Time to Send?",
  description: "Check whether today is a good time to send money abroad: today's mid-market rate vs the last 3 months, the best provider, and live trend charts for 60+ currencies.",
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

const rateSpecSchema = leadRate ? {
  "@context": "https://schema.org",
  "@type": "ExchangeRateSpecification",
  currency: "USD",
  currentExchangeRate: {
    "@type": "UnitPriceSpecification",
    price: formatRate(leadRate.rate),
    priceCurrency: "INR",
    unitText: `1 USD = ${formatRate(leadRate.rate)} INR`,
  },
} : null;

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Live mid-market exchange rates with send-timing insight",
  description: "Daily mid-market exchange rates for 60+ currencies with 12-month history and a 'good time to send' score per corridor, aggregated from independent sources.",
  url: "https://sendmoneycompare.com/exchange-rates",
  temporalCoverage: RATES_AS_OF ? `2025-06-08/${RATES_AS_OF}` : undefined,
  dateModified: RATES_AS_OF || undefined,
  creator: { "@type": "Organization", name: "SendMoneyCompare", url: "https://sendmoneycompare.com" },
  variableMeasured: "Mid-market exchange rate",
  isAccessibleForFree: true,
};

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
      images: [{ url: "https://sendmoneycompare.com/opengraph-image", width: 1200, height: 630, alt: "Exchange Rates Today — SendMoneyCompare" }],
    },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function ExchangeRatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const rates = await fetchExchangeRates();

  const initialVerdict: VerdictData | null = leadVerdict
    ? {
        from: leadVerdict.from, to: leadVerdict.to, amount: leadVerdict.amount,
        level: leadVerdict.level, levelPct: leadVerdict.levelPct, daysTracked: leadVerdict.daysTracked,
        bestProviderSlug: leadVerdict.bestProviderSlug, bestRate: leadVerdict.bestRate,
        receiveNow: leadVerdict.receiveNow, receiveBest: leadVerdict.receiveBest, receiveWorst: leadVerdict.receiveWorst,
        rangePos: leadVerdict.rangePos,
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {rateSpecSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rateSpecSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <div className="bg-[var(--color-surface)]">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── Hero ── */}
          <header className="mb-8">
            <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-on-surface-muted)] mb-3">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[var(--color-on-surface-variant)]">Exchange Rates</span>
            </nav>
            <h1 className="text-3xl sm:text-[2.6rem] font-bold text-[var(--color-on-surface)] tracking-tight leading-[1.1]">
              Is now a good time to send?
            </h1>
            <p className="mt-3 text-[15px] sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              We track exchange rates daily across 800+ corridors. Pick yours and we&apos;ll tell you if today beats
              the last few months — and exactly how much your recipient gets.
            </p>
          </header>

          {/* ── The one thing: send verdict ── */}
          {initialVerdict ? (
            <SendVerdictHero initial={initialVerdict} corridors={HERO_CORRIDORS} />
          ) : (
            <div className="rounded-2xl border border-[var(--color-outline)] p-6 text-center text-[var(--color-on-surface-variant)]">
              Live rate insight is warming up — check the rates below.
            </div>
          )}

          <p className="text-center text-xs text-[var(--color-on-surface-muted)] mt-3">
            <LiveTimestamp iso={`${RATES_AS_OF}T00:00:00Z`} prefix="Updated" /> · mid-market, median of 4 sources
          </p>

          {/* ── Trend chart ── */}
          <section className="mt-12" aria-labelledby="trends-heading">
            <h2 id="trends-heading" className="text-xl font-semibold text-[var(--color-on-surface)] mb-4">
              How the rate has moved
            </h2>
            <LazyHistoricalRateWidget defaultCorridor="USD-INR" />
          </section>

          {/* ── Compact rates ── */}
          <section className="mt-12" aria-labelledby="rates-heading">
            <h2 id="rates-heading" className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">
              Today&apos;s rates
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              Mid-market rates as of {AS_OF}. Tap a corridor to compare providers.
            </p>
            <TodayRates />
          </section>

          {/* ── Everything else: progressive disclosure ── */}
          <section className="mt-12 space-y-3">
            {/* Popular corridors */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                Compare popular corridors
                <Chevron />
              </summary>
              <div className="px-5 pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {popularCorridors.map((c) => (
                  <Link key={c.slug} href={`/send-money/${c.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all group/c">
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-on-surface)] group-hover/c:text-[var(--color-primary)]">{c.label}</div>
                      <div className="text-xs text-[var(--color-on-surface-variant)]">{c.from} &rarr; {c.to}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </details>

            {/* Popular rate pairs */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                Rate history by currency pair
                <Chevron />
              </summary>
              <div className="px-5 pb-5 pt-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {topRatePairs.map((pair) => {
                  const r = getPairRate(pair.from, pair.to);
                  return (
                    <Link key={pair.slug} href={`/exchange-rates/${pair.slug}`}
                      className="flex flex-col gap-0.5 px-3.5 py-3 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all group/p">
                      <span className="text-sm font-medium text-[var(--color-on-surface)] group-hover/p:text-[var(--color-primary)]">{pair.label}</span>
                      {r && <span className="text-xs text-[var(--color-on-surface-variant)] tabular-nums">{formatRate(r.rate)}</span>}
                    </Link>
                  );
                })}
              </div>
              <div className="px-5 pb-5">
                <Link href="/exchange-rates/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline">
                  See rate history for 90+ corridors
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </details>

            {/* How it works / understanding */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                How mid-market rates work
                <Chevron />
              </summary>
              <div className="px-5 pb-5 pt-1 space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  <strong className="text-[var(--color-on-surface)]">Mid-market rate vs. transfer rate.</strong> The mid-market
                  rate is the &ldquo;real&rdquo; rate — the midpoint of global currency markets. Providers add a markup on top; that
                  markup is their profit and varies widely. Always compare a provider&apos;s rate against mid-market.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">How we calculate this.</strong> Headline rates and charts use a
                  daily mid-market history for 60+ currencies. The &ldquo;good time to send&rdquo; score compares today&apos;s best
                  provider rate against every day we&apos;ve tracked for that corridor. The live ticker takes the median of 4
                  independent feeds to remove outliers.
                </p>
                <p>
                  Need to convert a specific amount? Try our{" "}
                  <Link href="/currency-converter" className="text-[var(--color-primary)] hover:underline font-medium">currency converter</Link>, or{" "}
                  <Link href="/send-money" className="text-[var(--color-primary)] hover:underline font-medium">compare every provider</Link>.
                </p>
              </div>
            </details>

            {/* FAQ */}
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                  {faq.question}
                  <Chevron />
                </summary>
                <div className="px-5 pb-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{faq.answer}</div>
              </details>
            ))}

            {/* Retro forex board */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden bg-[var(--color-surface-dim)]">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 select-none">
                <div>
                  <span className="text-[15px] font-medium text-[var(--color-on-surface)]">Live forex trading board</span>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-0.5">Retro airport-style ticker — TT/CHQ/Note rates, refreshing every 60s.</p>
                </div>
                <Chevron />
              </summary>
              <div className="border-t border-[var(--color-outline)]">
                <LiveRatesBoard initialRates={rates} />
              </div>
            </details>
          </section>

          {/* ── Disclaimer ── */}
          <p className="text-[12px] text-[var(--color-on-surface-muted)] mt-8 leading-relaxed">
            Rates shown are mid-market rates aggregated from independent sources for informational purposes only. Provider
            payouts are indicative and based on recent tracking — confirm the live quote before sending. Not financial advice.
          </p>
        </div>
      </div>
    </>
  );
}

function Chevron() {
  return (
    <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
