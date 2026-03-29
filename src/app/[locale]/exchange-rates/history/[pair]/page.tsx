import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/Container";
import CircleFlag from "@/components/CircleFlag";
import CrossLinks from "@/components/CrossLinks";
import { RateInsightBanner, RateHistorySection } from "@/components/RateInsight";
import HistoricalRateChart from "@/components/HistoricalRateChart";
import {
  getAllInsights,
  getInsightBySlug,
  corridorToSlug,
  rateLevelConfig,
} from "@/lib/rate-history";
import { currencies, getProviderName } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import { getAlternates } from "@/lib/i18n-metadata";
import { setRequestLocale } from "next-intl/server";

function getCurrencyInfo(code: string) {
  return currencies.find((c) => c.code === code);
}

// ── Static params ─────────────────────────────────────────────
export function generateStaticParams() {
  return getAllInsights(2).map((i) => ({ pair: corridorToSlug(i.corridor) }));
}

// ── Metadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ pair: string; locale: string }> }): Promise<Metadata> {
  const { pair, locale } = await params;
  const insight = getInsightBySlug(pair);
  if (!insight) return {};

  const [from, to] = insight.corridor.split("-");
  const fromInfo = getCurrencyInfo(from);
  const toInfo = getCurrencyInfo(to);
  const year = new Date().getFullYear();
  const month = new Date().toLocaleDateString("en-US", { month: "long" });

  const title = `${from} to ${to} Exchange Rate History — Provider Rate Trends (${month} ${year})`;
  const description = `Track ${fromInfo?.name || from} to ${toInfo?.name || to} exchange rate history. Compare daily rates from ${Object.keys(insight.sparklines).length}+ providers over ${insight.totalDays} days. Find the best time to send ${from} to ${to}.`;

  return {
    title,
    description,
    alternates: getAlternates(`exchange-rates/history/${pair}`, locale),
    openGraph: { title, description, url: `https://sendmoneycompare.com/exchange-rates/history/${pair}` },
    keywords: `${from} to ${to} rate history, ${from} ${to} exchange rate, ${fromInfo?.name} to ${toInfo?.name} rate trend, best time to send ${from} to ${to}, ${from} ${to} chart`,
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
  const lvl = rateLevelConfig(insight.level);

  const bestProviderUrl = getGoUrl(insight.today.bestProvider, {
    sourceCurrency: from,
    targetCurrency: to,
    sourceAmount: 1000,
  });

  // Related corridors (same source or same target)
  const allInsights = getAllInsights(2);
  const sameSource = allInsights
    .filter((i) => i.corridor.startsWith(from + "-") && i.corridor !== insight.corridor)
    .slice(0, 6);
  const sameTarget = allInsights
    .filter((i) => i.corridor.endsWith("-" + to) && i.corridor !== insight.corridor)
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the average ${from} to ${to} exchange rate?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The average ${from} to ${to} exchange rate over the last ${insight.totalDays} days is ${insight.stats.avgRate.toFixed(4)} ${to}. The best rate recorded was ${insight.stats.bestRate.toFixed(4)} on ${insight.stats.bestRateDate} via ${getProviderName(insight.stats.bestRateProvider)}.`,
        },
      },
      {
        "@type": "Question",
        name: `Which provider gives the best ${from} to ${to} rate?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Today, ${getProviderName(insight.today.bestProvider)} offers the best ${from} to ${to} rate at ${insight.today.bestRate.toFixed(4)}. Over the last ${insight.totalDays} days, ${insight.providerBadges.find((b) => b.type === "best-rate")?.label || "providers have varied"}.`,
        },
      },
      {
        "@type": "Question",
        name: `Is it a good time to send ${from} to ${to}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${from} to ${to} rates are currently ${lvl.label.toLowerCase()} — in the ${insight.levelPct}th percentile compared to the last ${insight.totalDays} days. ${insight.level === "great" || insight.level === "good" ? "This is a favorable time to send." : "You may want to monitor rates for improvement."}`,
        },
      },
    ],
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

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <CircleFlag code={from} size={32} />
              <span className="text-lg text-[var(--color-on-surface-muted)]">→</span>
              <CircleFlag code={to} size={32} />
            </div>
            <div>
              <h1 className="text-h3 md:text-h2 font-normal text-[var(--color-on-surface)] leading-tight">
                {fromInfo?.name || from} to {toInfo?.name || to} Rate History
              </h1>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
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
              <a
                href={bestProviderUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 h-10 px-6 text-2sm font-semibold rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm transition-all"
              >
                Send with {getProviderName(insight.today.bestProvider)}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
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
              <details className="group py-4" open>
                <summary className="flex items-center justify-between cursor-pointer list-none text-md font-medium text-[var(--color-on-surface)]">
                  What is the average {from} to {to} exchange rate?
                  <svg className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  Over the last {insight.totalDays} days, the average best exchange rate for {from} to {to} has been {insight.stats.avgRate.toFixed(4)} {to} per 1 {from}. The highest rate recorded was {insight.stats.bestRate.toFixed(4)} on {insight.stats.bestRateDate} via {getProviderName(insight.stats.bestRateProvider)}, while the lowest was {insight.stats.worstRate.toFixed(4)} on {insight.stats.worstRateDate}.
                </p>
              </details>
              <details className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none text-md font-medium text-[var(--color-on-surface)]">
                  Which provider consistently has the best {from} to {to} rate?
                  <svg className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  Based on our {insight.totalDays}-day tracking, {insight.providerBadges.find((b) => b.type === "best-rate")?.detail || `${getProviderName(insight.today.bestProvider)} frequently offers the best rate`}. Today, {getProviderName(insight.today.bestProvider)} leads with a rate of {insight.today.bestRate.toFixed(4)} {to}.
                </p>
              </details>
              <details className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none text-md font-medium text-[var(--color-on-surface)]">
                  Is it a good time to send {from} to {to}?
                  <svg className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  Current {from} to {to} rates are {lvl.label.toLowerCase()} — sitting in the {insight.levelPct}th percentile over the last {insight.totalDays} days. {insight.level === "great" ? "This is an excellent time to send money." : insight.level === "good" ? "Rates are above average — a good time to transfer." : insight.level === "typical" ? "Rates are near average. Consider setting a rate alert for improvements." : "Rates are below average. You may want to wait for improvement or lock in a forward contract."}
                </p>
              </details>
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
                  links: sameSource.map((i) => ({
                    href: `/exchange-rates/history/${corridorToSlug(i.corridor)}`,
                    label: `${i.corridor.split("-")[0]} → ${i.corridor.split("-")[1]} history`,
                  })),
                }]
              : []),
            ...(sameTarget.length > 0
              ? [{
                  title: `More ${to} corridors`,
                  links: sameTarget.map((i) => ({
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
