import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import LiveRatesBoard from "./LiveRatesBoard";
import { fetchExchangeRates } from "@/lib/exchange-rates";
import { getAlternates } from "@/lib/i18n-metadata";

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
  { slug: "usa-to-india", from: "USD", to: "INR", label: "USA to India", flag: "\u{1F1EE}\u{1F1F3}", ratePair: "usd-to-inr" },
  { slug: "usa-to-pakistan", from: "USD", to: "PKR", label: "USA to Pakistan", flag: "\u{1F1F5}\u{1F1F0}", ratePair: "usd-to-pkr" },
  { slug: "usa-to-philippines", from: "USD", to: "PHP", label: "USA to Philippines", flag: "\u{1F1F5}\u{1F1ED}", ratePair: "usd-to-php" },
  { slug: "usa-to-mexico", from: "USD", to: "MXN", label: "USA to Mexico", flag: "\u{1F1F2}\u{1F1FD}", ratePair: "usd-to-mxn" },
  { slug: "usa-to-nigeria", from: "USD", to: "NGN", label: "USA to Nigeria", flag: "\u{1F1F3}\u{1F1EC}", ratePair: "usd-to-ngn" },
  { slug: "uk-to-india", from: "GBP", to: "INR", label: "UK to India", flag: "\u{1F1EE}\u{1F1F3}", ratePair: "gbp-to-inr" },
  { slug: "uk-to-europe", from: "GBP", to: "EUR", label: "UK to Europe", flag: "\u{1F1EA}\u{1F1FA}", ratePair: "gbp-to-eur" },
  { slug: "canada-to-india", from: "CAD", to: "INR", label: "Canada to India", flag: "\u{1F1EE}\u{1F1F3}", ratePair: "cad-to-inr" },
];

const topRatePairs = [
  { slug: "usd-to-inr", from: "USD", to: "INR", label: "USD to INR" },
  { slug: "usd-to-eur", from: "USD", to: "EUR", label: "USD to EUR" },
  { slug: "gbp-to-eur", from: "GBP", to: "EUR", label: "GBP to EUR" },
  { slug: "gbp-to-usd", from: "GBP", to: "USD", label: "GBP to USD" },
  { slug: "usd-to-gbp", from: "USD", to: "GBP", label: "USD to GBP" },
  { slug: "eur-to-usd", from: "EUR", to: "USD", label: "EUR to USD" },
  { slug: "usd-to-jpy", from: "USD", to: "JPY", label: "USD to JPY" },
  { slug: "usd-to-cad", from: "USD", to: "CAD", label: "USD to CAD" },
  { slug: "usd-to-mxn", from: "USD", to: "MXN", label: "USD to MXN" },
  { slug: "usd-to-pkr", from: "USD", to: "PKR", label: "USD to PKR" },
  { slug: "gbp-to-inr", from: "GBP", to: "INR", label: "GBP to INR" },
  { slug: "cad-to-inr", from: "CAD", to: "INR", label: "CAD to INR" },
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

// FAQPage schema removed — Google restricted FAQ rich results to gov/health sites since Aug 2023.
// FAQ content is still rendered on the page for users.

const SSR_CURRENCIES = [
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "Pound Sterling" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "INR", name: "Indian Rupee" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "KRW", name: "Korean Won" },
  { code: "ZAR", name: "South African Rand" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "AED", name: "UAE Dirham" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "THB", name: "Thai Baht" },
];

export default async function ExchangeRatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("exchangeRates");

  const rates = await fetchExchangeRates();

  // Build server-rendered rate rows for crawlers
  const ssrRates = SSR_CURRENCIES
    .map((c) => ({ ...c, rate: rates[c.code] }))
    .filter((c) => c.rate && c.rate > 0);

  // WebPage + BreadcrumbList schema
  const today = new Date().toISOString().split("T")[0];
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Exchange Rates Today — Live Mid-Market Rates",
    description: "Live exchange rates from 4 independent sources, updated every 60 seconds. Compare mid-market rates for 150+ currencies.",
    url: "https://sendmoneycompare.com/exchange-rates",
    dateModified: today,
    isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
        { "@type": "ListItem", position: 2, name: "Exchange Rates", item: "https://sendmoneycompare.com/exchange-rates" },
      ],
    },
  };

  // ExchangeRateSpecification JSON-LD for top 10 currencies
  const rateSchemas = ssrRates.slice(0, 10).map((c) => ({
    "@type": "ExchangeRateSpecification",
    currency: "USD",
    currentExchangeRate: {
      "@type": "UnitPriceSpecification",
      price: c.rate,
      priceCurrency: c.code,
      unitText: `1 USD = ${c.rate} ${c.code}`,
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": rateSchemas }) }}
      />

      {/* Server-rendered H1 for crawlers — LiveRatesBoard has a visual H1 but it's client-only */}
      <h1 className="sr-only">{t("title")}</h1>

      {/* Live Rates Board — pre-rendered with server-fetched rates for SEO */}
      <LiveRatesBoard initialRates={rates} />

      {/* Server-rendered rate table — visible to crawlers even without JS */}
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-outline)]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-2">
            {t("todaysRatesHeading")}
          </h2>
          <p className="text-[var(--color-on-surface-variant)] text-md mb-6">
            {t("todaysRatesDesc")}
          </p>
          <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_140px] sm:grid-cols-[1fr_120px_160px] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-2xs sm:text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
              <span>{t("colCurrency")}</span>
              <span className="text-right">{t("colCode")}</span>
              <span className="text-right">{t("colRate")}</span>
            </div>
            {ssrRates.map((c) => (
              <div
                key={c.code}
                className="grid grid-cols-[1fr_100px_140px] sm:grid-cols-[1fr_120px_160px] gap-2 items-center px-4 sm:px-6 py-2.5 border-t border-[var(--color-outline)]"
              >
                <span className="text-sm text-[var(--color-on-surface)]">{c.name}</span>
                <span className="text-sm font-medium text-[var(--color-on-surface)] text-right">{c.code}</span>
                <span className="text-sm font-medium text-[var(--color-on-surface)] text-right tabular-nums">
                  {c.rate >= 1000 ? c.rate.toFixed(2) : c.rate >= 100 ? c.rate.toFixed(3) : c.rate.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-3">
            {t("ssrTableNote")}
          </p>
        </div>
      </section>

      {/* SEO Content Sections */}
      <div className="bg-[var(--color-surface)] py-12 sm:py-16">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

          {/* Popular Corridors */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-2">
              {t("compareTransferRates")}
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-md mb-6">
              {t("compareTransferRatesDesc")}
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
                    <div className="text-sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                      {c.label}
                    </div>
                    <div className="text-xs text-[var(--color-on-surface-variant)]">
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
              {t("understandingExchangeRates")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[var(--color-surface-dim)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">
                  {t("midMarketVsTransferRate")}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {t("midMarketVsTransferRateDesc")}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-dim)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-2">
                  {t("howWeCalculateTheseRates")}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {t("howWeCalculateTheseRatesDesc")}
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-4">
              Need to convert a specific amount? Try our{" "}
              <Link href="/currency-converter" className="text-[var(--color-primary)] hover:underline font-medium">
                currency converter
              </Link>{" "}
              with live mid-market rates, or{" "}
              <Link href="/send-money" className="text-[var(--color-primary)] hover:underline font-medium">
                compare transfer providers
              </Link>{" "}
              to find the cheapest way to send money abroad.
            </p>
          </section>

          {/* Popular Exchange Rate Pairs */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-2">
              {t("popularExchangeRates")}
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-md mb-6">
              {t("popularExchangeRatesDesc")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {topRatePairs.map((pair) => {
                const pairRate = rates[pair.to] && rates[pair.from]
                  ? (pair.from === "USD" ? rates[pair.to] : rates[pair.to] / rates[pair.from])
                  : rates[pair.to]; // fallback for USD base
                return (
                  <Link
                    key={pair.slug}
                    href={`/exchange-rates/${pair.slug}`}
                    className="flex flex-col gap-1 px-4 py-3.5 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all group"
                  >
                    <span className="text-sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                      {pair.label}
                    </span>
                    {pairRate && pairRate > 0 && (
                      <span className="text-2sm text-[var(--color-on-surface-variant)] tabular-nums">
                        1 {pair.from} = {pairRate >= 1000 ? pairRate.toFixed(2) : pairRate >= 100 ? pairRate.toFixed(3) : pairRate.toFixed(4)} {pair.to}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] mb-6">
              {t("faqHeading")}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-[var(--color-outline)] overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-md font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
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
                  <div className="px-5 pb-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Rate history link */}
          <section className="mt-10 bg-[var(--color-primary-surface)] rounded-2xl border border-[var(--color-primary)] border-opacity-20 p-6 md:p-8">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-2">Historical Exchange Rates</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              Track how provider exchange rates have changed over time across 90+ currency corridors. See which providers consistently offer the best rates and find the optimal time to send.
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

          {/* Disclaimer */}
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-10 leading-relaxed">
            {t("disclaimerFull")}
          </p>
        </div>
      </div>
    </>
  );
}
