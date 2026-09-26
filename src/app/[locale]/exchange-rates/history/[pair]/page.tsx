import { seoDescription } from "@/lib/seo-title";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;
import Container from "@/components/Container";
import CircleFlag from "@/components/CircleFlag";
import CrossLinks from "@/components/CrossLinks";
import { RateInsightBanner, RateHistorySection } from "@/components/RateInsight";
import HistoricalRateChart from "@/components/HistoricalRateChart";
import {
  getAllInsights,
  getInsightBySlug,
  corridorToSlug,
  KEEP_HISTORY_PAIRS,
} from "@/lib/rate-history";
import { currencies, getProviderName } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import ProviderLink from "@/components/ProviderLink";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { robotsFor } from "@/lib/seo-indexing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { rateHistoryPageRenders } from "@/lib/route-map-rates";

function getCurrencyInfo(code: string) {
  return currencies.find((c) => c.code === code);
}

// ── Static params ─────────────────────────────────────────────
// Scaled-content cleanup (2026-06-25): this route pre-rendered all ~851 rate-
// history pairs as 200+noindex. None are in the sitemap and only usd-to-gbp drew
// any Bing traffic (20 impr / 0 clicks / 90d) — the other 850 were pure crawl-
// budget bloat that Google keeps recrawling and counting against the site.
// Restrict to a small set of genuinely-major pairs; dynamicParams=false 404s the
// rest instead of serving an endlessly-recrawled noindex shell.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllInsights(2)
    .map((i) => corridorToSlug(i.corridor))
    .filter((slug) => KEEP_HISTORY_PAIRS.has(slug))
    .map((pair) => ({ pair }));
}

// ── Metadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ pair: string; locale: string }> }): Promise<Metadata> {
  const { pair, locale } = await params;
  const t = await getTranslations({ locale, namespace: "rateHistorySlug" });
  const insight = getInsightBySlug(pair);
  if (!insight) return {};

  const [from, to] = insight.corridor.split("-");
  const fromInfo = getCurrencyInfo(from);
  const toInfo = getCurrencyInfo(to);
  const year = new Date().getFullYear();
  const month = new Date().toLocaleDateString(locale === "en" ? "en-US" : locale, { month: "long" });

  const tplParams = {
    from,
    to,
    fromName: fromInfo?.name || from,
    toName: toInfo?.name || to,
    providerCount: Object.keys(insight.sparklines).length,
    totalDays: insight.totalDays,
    year,
    month,
  };
  const title = t("fallbackTitle", tplParams);
  const description = t("fallbackDescription", tplParams);

  return {
    title,
    description: seoDescription(description),
    alternates: getAlternates(`exchange-rates/history/${pair}`, locale),
    openGraph: { title, description, url: `https://sendmoneycompare.com/exchange-rates/history/${pair}`,
      images: DEFAULT_OG_IMAGES,
    },
    keywords: t("fallbackKeywords", tplParams),
    // 2026-09-24: opened by the round-2 freelance brief (owner decision) —
    // robots now comes from routeIsIndexable(), the same predicate that drives
    // the X-Robots-Tag header and sitemap membership.
    robots: locale === "en" ? robotsFor(`/exchange-rates/history/${pair}`) : { index: false, follow: true },
  };
}

// ── Page ──────────────────────────────────────────────────────
export default async function CorridorHistoryPage({ params }: { params: Promise<{ pair: string; locale: string }> }) {
  const { pair, locale } = await params;
  setRequestLocale(locale);
  const insight = getInsightBySlug(pair);
  if (!insight) notFound();

  const [from, to] = insight.corridor.split("-");
  const fromInfo = getCurrencyInfo(from);
  const toInfo = getCurrencyInfo(to);
  const receiveSymbol = toInfo?.symbol || "";

  const bestProviderUrl = getGoUrl(insight.today.bestProvider, {
    sourceCurrency: from,
    targetCurrency: to,
    sourceAmount: 1000,
    clickref: "exchange_rate_history",
  });

  // Related corridors (same source or same target). Only link to pairs that
  // still resolve (KEEP_HISTORY_PAIRS) — dynamicParams=false 404s the rest, so
  // surfacing links to them would create broken internal links.
  const allInsights = getAllInsights(2);
  const sameSource = allInsights
    .filter((i) => i.corridor.startsWith(from + "-") && i.corridor !== insight.corridor)
    .filter((i) => KEEP_HISTORY_PAIRS.has(corridorToSlug(i.corridor)))
    .slice(0, 6);
  const sameTarget = allInsights
    .filter((i) => i.corridor.endsWith("-" + to) && i.corridor !== insight.corridor)
    .filter((i) => KEEP_HISTORY_PAIRS.has(corridorToSlug(i.corridor)))
    .slice(0, 6);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Exchange Rates", item: "https://sendmoneycompare.com/exchange-rates" },
      { "@type": "ListItem", position: 3, name: "Rate History", item: "https://sendmoneycompare.com/exchange-rates/history" },
      { "@type": "ListItem", position: 4, name: `${from} to ${to}`, item: `https://sendmoneycompare.com/exchange-rates/history/${pair}` },
    ],
  };

  const historyFaqs = from === "EUR" && to === "JPY" ? [
    {
      question: "How can I use this series for a yen-denominated expense?",
      answer: `For an illustrative JPY 100,000 obligation, dividing by the latest recorded rate of ${insight.today.bestRate.toFixed(4)} gives about EUR ${(100000 / insight.today.bestRate).toFixed(2)} before fees. The calculation translates a fixed yen expense into euros; it is not a bookable transfer offer. Check the final EUR debit for a guaranteed JPY payout with the provider.`,
    },
    {
      question: "Does a higher EUR/JPY observation help someone buying yen?",
      answer: "A higher yen-per-euro figure buys more yen with the same euro amount. The reverse payment has the opposite objective, so do not read this chart as a JPY-to-EUR recommendation. Historical highs show what was observed, not a rate you can reserve or a forecast of the next movement.",
    },
  ] : [
    {
      question: `What range did we record for ${from}/${to}?`,
      answer: `${insight.stats.worstRate.toFixed(4)} to ${insight.stats.bestRate.toFixed(4)} ${to} per ${from}, across ${insight.totalDays} observed days. The mean was ${insight.stats.avgRate.toFixed(4)}. These are recorded provider rates, not a guaranteed quote for your payment.`,
    },
    {
      question: `What does the ${from}/${to} percentile tell me?`,
      answer: `The latest observation sits at percentile ${insight.levelPct} within this series. It describes the past sample; it does not predict the next rate or establish that delaying a payment will save money.`,
    },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: historyFaqs.map(({ question, answer }) => ({
      "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-[var(--color-surface)] pt-8 pb-6">
        <Container>
          <div className="flex items-center gap-2 text-2sm text-[var(--color-on-surface-variant)] mb-4">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <span>/</span>
            <Link href="/exchange-rates" className="hover:text-[var(--color-primary)]">Exchange Rates</Link>
            <span>/</span>
            <Link href="/exchange-rates/history" className="hover:text-[var(--color-primary)]">History</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface)]">{from} to {to}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <div className="flex items-center gap-1 shrink-0">
              <CircleFlag code={from} size={28} />
              <span className="text-base text-[var(--color-on-surface-muted)]">→</span>
              <CircleFlag code={to} size={28} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.01em]">
                {fromInfo?.name || from} to {toInfo?.name || to} Rate History
              </h1>
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                {from} → {to} · {insight.totalDays} days of data · {Object.keys(insight.sparklines).length} providers tracked
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Rate Level Banner */}
      <section className="bg-[var(--color-surface)] pb-6">
        <Container>
          <RateInsightBanner
            insight={insight}
            toCurrencySymbol={receiveSymbol}
            toCurrency={to}
          />
        </Container>
      </section>

      {/* Interactive Chart */}
      <section className="py-8 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
        <Container>
          <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
            {from} to {to} exchange rate chart
          </h2>
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-4 sm:p-6">
            <HistoricalRateChart
              sparklines={insight.sparklines}
              fromCurrency={from}
              toCurrency={to}
            />
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-6 bg-[var(--color-surface)]">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-primary-surface)] border border-[var(--color-primary-light)]">
            <div>
              <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                Best rate today: {insight.today.bestRate.toFixed(4)} {to} via {getProviderName(insight.today.bestProvider)}
              </p>
              <p className="text-2sm text-[var(--color-on-surface-variant)] mt-0.5">
                Send {receiveSymbol}{insight.today.bestReceiveAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} on a $100 transfer
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/send-money"
                className="text-2sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Compare all providers
              </Link>
              <ProviderLink
                href={bestProviderUrl}
                provider={insight.today.bestProvider}
                source="exchange_rate_history"
                className="inline-flex items-center gap-2 h-10 px-6 text-2sm font-semibold rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] shadow-sm transition-all"
              >
                Send with {getProviderName(insight.today.bestProvider)}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </ProviderLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Rate History Table */}
      <section className="py-10 bg-[var(--color-surface)]">
        <Container>
          <RateHistorySection insight={insight} fromCurrency={from} toCurrency={to} />
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-6">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {historyFaqs.map(({ question, answer }) => (
                <details key={question} className="group py-4">
                  <summary className="cursor-pointer text-md font-medium text-[var(--color-on-surface)]">{question}</summary>
                  <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Related corridors */}
      {(sameSource.length > 0 || sameTarget.length > 0) && (
        <CrossLinks
          sections={[
            ...(sameSource.length > 0
              ? [{
                  title: `More ${from} corridors`,
                  links: sameSource.filter((i) => rateHistoryPageRenders(corridorToSlug(i.corridor))).map((i) => ({
                    href: `/exchange-rates/history/${corridorToSlug(i.corridor)}`,
                    label: `${i.corridor.split("-")[0]} → ${i.corridor.split("-")[1]} history`,
                  })),
                }]
              : []),
            ...(sameTarget.length > 0
              ? [{
                  title: `More ${to} corridors`,
                  links: sameTarget.filter((i) => rateHistoryPageRenders(corridorToSlug(i.corridor))).map((i) => ({
                    href: `/exchange-rates/history/${corridorToSlug(i.corridor)}`,
                    label: `${i.corridor.split("-")[0]} → ${i.corridor.split("-")[1]} history`,
                  })),
                }]
              : []),
            {
              title: "Related",
              links: [
                { href: `/exchange-rates`, label: "Live Exchange Rates" },
                { href: "/send-money", label: "Compare Providers" },
                { href: "/exchange-rates/history", label: "All Rate History" },
              ],
            },
          ]}
        />
      )}
    </>
  );
}
