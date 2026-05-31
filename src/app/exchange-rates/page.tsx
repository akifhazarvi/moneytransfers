import type { Metadata } from "next";
import Link from "next/link";
import LiveRatesBoard from "./LiveRatesBoard";

export const metadata: Metadata = {
  title: "Live Exchange Rates Today — Real-Time Currency Rates (Updated Every 60s)",
  description:
    "Live mid-market rates for 20+ currencies updated every 60 seconds. See how much banks mark up the real rate and find the cheapest provider for your transfer.",
  keywords:
    "live exchange rates, exchange rates today, currency rates, forex rates, USD to INR, GBP to USD, mid-market rate, real exchange rate",
  alternates: {
    canonical: "https://sendmoneycompare.com/exchange-rates",
  },
  openGraph: {
    title: "Exchange Rates Today — Real Rate vs. What Providers Charge",
    description:
      "Live mid-market rates for 20+ currencies from 4 independent sources. See how much providers mark up the real rate.",
    url: "https://sendmoneycompare.com/exchange-rates",
  },
};

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

const faqs = [
  {
    question: "What is the mid-market exchange rate?",
    answer:
      "The mid-market rate (also called the interbank rate) is the midpoint between the buy and sell prices of two currencies on the global market. It's the fairest exchange rate available and the one you'll see on Google or Reuters. Banks and money transfer services typically add a markup on top of this rate — that markup is their profit.",
  },
  {
    question: "How often are these exchange rates updated?",
    answer:
      "Our rates are aggregated from 4 independent sources and refreshed every 60 seconds while you're on this page. The sources include ExchangeRate-API, Fawaz Ahmed CDN, FloatRates, and Currency-API Pages. We take the median value across all sources to ensure accuracy.",
  },
  {
    question: "Why is my bank's exchange rate different from the mid-market rate?",
    answer:
      "Banks and transfer services add a margin (markup) to the mid-market rate. This is one of the ways they make money on international transfers. The markup can range from 0.5% to 5% or more depending on the provider and currency corridor. Use our comparison tool to find providers offering rates closest to the mid-market rate.",
  },
  {
    question: "What is the difference between buy and sell rates?",
    answer:
      "The buy rate is what a bank pays you when you sell foreign currency to them. The sell rate is what the bank charges you when you buy foreign currency. The difference between these two rates is called the spread, and it represents the bank's profit margin on currency exchange.",
  },
  {
    question: "Which currency pairs are most traded globally?",
    answer:
      "The most traded currency pairs are EUR/USD (Euro/US Dollar), USD/JPY (US Dollar/Japanese Yen), GBP/USD (British Pound/US Dollar), and USD/CHF (US Dollar/Swiss Franc). These are known as the 'major pairs' and account for the majority of forex trading volume worldwide.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ExchangeRatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Live Rates Board */}
      <LiveRatesBoard />

      {/* SEO Content Sections */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

          {/* Popular Corridors */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-2">
              Compare Transfer Rates
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-[15px] mb-6">
              The mid-market rate above is the fairest rate — but providers add markups. Compare actual rates from 50+ apps on these popular corridors.
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

          {/* Understanding Exchange Rates */}
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
                  The mid-market rate you see on this page is the &ldquo;real&rdquo; exchange rate — the midpoint between buy and sell prices on global currency markets. When you send money internationally, providers add a markup to this rate. That markup is their profit margin, and it can vary widely between services. Always compare the rate a provider offers against the mid-market rate to see the true cost.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-dim)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">
                  How We Calculate These Rates
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  We aggregate exchange rate data from 4 independent sources in real-time and take the median value. This approach eliminates outliers and provides a more reliable rate than relying on any single source. Rates refresh every 60 seconds while you&apos;re on this page. The buy/sell spreads shown are simulated based on typical banking margins for each currency.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-[var(--color-outline)] overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                    {faq.question}
                    <svg
                      className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0 ml-4 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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

          {/* Disclaimer */}
          <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-10 leading-relaxed">
            Exchange rates shown are mid-market rates aggregated from multiple independent sources for informational purposes only.
            Actual rates offered by money transfer providers, banks, and currency exchange services will differ.
            These rates do not constitute financial advice and should not be relied upon for trading decisions.
            Last updated in real-time from 4 independent data feeds.
          </p>
        </div>
      </div>
    </>
  );
}
