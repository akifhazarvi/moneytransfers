import { seoDescription } from "@/lib/seo-title";
import Link from "@/components/EligibleLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Revalidate every 6 hours — matches scraper cadence

/** Currency outlook guides, linked from the rate history of their currency. */
const FORECAST_GUIDES: Record<string, string> = {
  GBP: "/guides/gbp-forecast-2026",
  EUR: "/guides/euro-forecast-2026",
  USD: "/guides/us-dollar-forecast-2026",
};

export const revalidate = 21600;
import Container from "@/components/Container";
import CircleFlag from "@/components/CircleFlag";
import CrossLinks from "@/components/CrossLinks";
import { linkableCorridorsFor } from "@/lib/corridor-links";
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
import {
  summariseSeries,
  reactionAround,
  rateDecimals,
  monthLabel,
  dayLabel,
  signedPct,
} from "@/lib/rate-history-summary";
import { centralBankFor } from "@/data/central-bank-decisions";
import { PageByline } from "@/components/PageByline";
import { EDITORIAL_AUTHOR_SLUG, RATE_HISTORY_CONTENT_DATE, longDay } from "@/lib/content-dates";


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

  // Month-by-month ranges and the largest one-day moves of the mid-market
  // series, computed per pair (src/lib/rate-history-summary.ts). Round-3
  // freelance brief §4.2: history pages need "page-specific data: ranges,
  // events, and explanations of exchange-rate movements".
  const summary = summariseSeries(insight.sparklines["__mid-market__"]);
  const dp = rateDecimals(insight.stats.avgRate);
  const fmt = (r: number) => r.toFixed(dp);
  const widestMonth = summary?.months.reduce<(typeof summary.months)[number] | null>(
    (best, m) => (!best || Math.abs(m.changePct) > Math.abs(best.changePct) ? m : best),
    null,
  );

  // Both central banks' decisions inside the recorded window, each beside the
  // pair's mid-market move from the day before to a week after. Descriptive:
  // the table does not attribute the move to the decision.
  const banks = [centralBankFor(from), centralBankFor(to)].filter(
    (b): b is NonNullable<ReturnType<typeof centralBankFor>> => Boolean(b),
  );
  const decisions = banks
    .flatMap((bank) =>
      bank.decisions
        .filter((d) => d.date >= insight.dateRange.from && d.date <= insight.dateRange.to)
        .map((d) => ({ bank, d, move: reactionAround(insight.sparklines["__mid-market__"], d.date) })),
    )
    .sort((a, b) => a.d.date.localeCompare(b.d.date));

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
      answer: `Provider rates ran from ${insight.stats.worstRate.toFixed(4)} (${getProviderName(insight.stats.worstRateProvider)}, ${dayLabel(insight.stats.worstRateDate, true)}) to ${insight.stats.bestRate.toFixed(4)} (${getProviderName(insight.stats.bestRateProvider)}, ${dayLabel(insight.stats.bestRateDate, true)}) ${to} per ${from} over ${insight.totalDays} days, averaging ${insight.stats.avgRate.toFixed(4)}.`,
    },
    ...(summary && widestMonth
      ? [{
          question: `Which month moved ${from}/${to} the most?`,
          answer: `${monthLabel(widestMonth.month)}, when ${from}/${to} closed at ${fmt(widestMonth.close)} (${signedPct(widestMonth.changePct)} on the month), between ${fmt(widestMonth.low)} on ${dayLabel(widestMonth.lowDate)} and ${fmt(widestMonth.high)} on ${dayLabel(widestMonth.highDate)}. Over the series: ${fmt(summary.first.rate)} to ${fmt(summary.last.rate)} (${signedPct(summary.changePct)}).`,
        }]
      : [{
          question: `What does the ${from}/${to} percentile tell me?`,
          answer: `The latest observation sits at percentile ${insight.levelPct} within this series. It describes the past sample; it does not predict the next rate.`,
        }]),
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
              {/* Round-3 QA item 7: author and the template's content date
                  (also its sitemap lastmod); the series' last day is the data
                  line. The pair sits inside it and the pair line follows, so
                  the byline adds no text run shared across the family (rule 3). */}
              <div className="mt-2">
                <PageByline
                  authorSlug={EDITORIAL_AUTHOR_SLUG}
                  updated={RATE_HISTORY_CONTENT_DATE}
                  cadence={`${from}→${to} rates recorded through ${longDay(insight.dateRange.to)}`}
                />
              </div>
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
                {receiveSymbol}{insight.today.bestReceiveAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} received per 100 {from} sent
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

      {/* Month-by-month mid-market ranges and the policy decisions in the
          window, added for the round-3 brief (§4.2: "ranges, events, and
          explanations"). Every run of fixed wording here stays under ten
          words between pair-specific values: these sections appear on all
          ten history pages, and a longer shared sentence counts against each
          of them in check:duplication. */}
      {summary && summary.months.length > 0 && (
        <section className="py-10 bg-[var(--color-surface)]">
          <Container>
            <h2 className="mb-1 text-h4 font-bold text-[var(--color-on-surface)]">
              Month by month: {from}/{to} since {monthLabel(summary.months[0].month)}
            </h2>
            <p className="mb-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed max-w-3xl">
              {from}/{to} mid-market: {fmt(summary.first.rate)} on {dayLabel(summary.first.date, true)}, {fmt(summary.last.rate)} on {dayLabel(summary.last.date, true)} ({signedPct(summary.changePct)}).
              {summary.biggestRise && (
                <>{" "}Largest one-day rise: {dayLabel(summary.biggestRise.date)}, {fmt(summary.biggestRise.from)} to {fmt(summary.biggestRise.to)} ({signedPct(summary.biggestRise.pct)}).</>
              )}
              {summary.biggestFall && (
                <>{" "}Largest one-day fall: {dayLabel(summary.biggestFall.date)}, {fmt(summary.biggestFall.from)} to {fmt(summary.biggestFall.to)} ({signedPct(summary.biggestFall.pct)}).</>
              )}
            </p>
            <div className="overflow-x-auto rounded-xl border border-[var(--color-outline)] max-w-3xl">
              <table className="w-full text-2sm">
                <thead>
                  <tr className="bg-[var(--color-surface-dim)]">
                    <th className="px-3 py-2.5 text-left font-semibold text-[var(--color-on-surface-variant)]">{from}/{to}</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]">Low</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]">High</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]">Close</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]">Change</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]" title="Fresh daily readings; values carried forward unchanged past a weekend are left out">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.months.map((m) => (
                    <tr key={m.month} className="border-b border-[var(--color-outline)] last:border-0">
                      <td className="px-3 py-2 font-medium text-[var(--color-on-surface)]">{monthLabel(m.month)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmt(m.low)} <span className="text-2xs text-[var(--color-on-surface-muted)]">{dayLabel(m.lowDate)}</span></td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmt(m.high)} <span className="text-2xs text-[var(--color-on-surface-muted)]">{dayLabel(m.highDate)}</span></td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmt(m.close)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{signedPct(m.changePct)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-[var(--color-on-surface-muted)]">{m.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
      )}

      {/* Policy decisions in the window, from src/data/central-bank-decisions.ts.
          A compact row per decision: the bank's short tag, then this pair's
          own rates the day before and a week after (descriptive, not causal). */}
      {decisions.length > 0 && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <h2 className="mb-1 text-h4 font-bold text-[var(--color-on-surface)]">
              {banks.map((b) => b.short).join(" and ")} decisions against {from}/{to}
            </h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-outline)] max-w-3xl">
              <table className="w-full text-2sm">
                <thead>
                  <tr className="bg-[var(--color-surface-dim)]">
                    <th className="px-3 py-2.5 text-left font-semibold text-[var(--color-on-surface-variant)]" title="What the rate did around each decision, not a claim that the decision caused it">Decision</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]">{from}/{to} before</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]">A week on</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-[var(--color-on-surface-variant)]">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map(({ bank, d, move }) => (
                    <tr key={`${bank.short}-${d.date}`} className="border-b border-[var(--color-outline)] last:border-0">
                      <td className="px-3 py-2 text-[var(--color-on-surface)]">
                        {dayLabel(d.date)}{" "}
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-primary)] hover:underline">{bank.short}</a>
                        {" "}{d.tag}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{move ? fmt(move.before.rate) : "—"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{move ? fmt(move.after.rate) : "—"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{move ? signedPct(move.pct) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
      )}

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
              {from} to {to} rate history questions
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
            // Corridor pages that pay in or out in this pair's currencies and
            // that Google may index (round-3 brief §5.3, rule 14).
            {
              title: `Send ${from} or ${to}`,
              links: linkableCorridorsFor({ currencies: [to, from], seed: `${from}-${to}` }, 4).map((c) => ({ href: c.href, label: c.label })),
            },
            {
              title: "Related",
              links: [
                { href: `/exchange-rates`, label: "Live Exchange Rates" },
                { href: "/send-money", label: "Compare Providers" },
                { href: "/exchange-rates/history", label: "All Rate History" },
                // The reverse pair and the outlook for either currency, where
                // Google may index them (brief §5.3; CrossLinks drops the rest).
                { href: `/exchange-rates/history/${to.toLowerCase()}-to-${from.toLowerCase()}`, label: `${to} → ${from} history` },
                ...[from, to].flatMap((c) => FORECAST_GUIDES[c] ? [{ href: FORECAST_GUIDES[c], label: `${c} outlook` }] : []),
              ],
            },
          ]}
        />
      )}
    </>
  );
}
