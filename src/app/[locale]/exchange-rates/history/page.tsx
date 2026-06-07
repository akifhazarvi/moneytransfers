import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import { Sparkline } from "@/components/RateInsight";
import CircleFlag from "@/components/CircleFlag";
import CrossLinks from "@/components/CrossLinks";
import {
  getAllInsights,
  corridorToSlug,
  rateLevelConfig,
  type RateInsight,
} from "@/lib/rate-history";
import { currencies } from "@/data/providers";
import { getAlternates } from "@/lib/i18n-metadata";
import { setRequestLocale } from "next-intl/server";

// ── Tier 1 corridors (highest search volume) ──────────────────
const TIER1 = [
  "USD-INR", "USD-PHP", "USD-MXN", "USD-PKR", "USD-NGN", "USD-EUR",
  "GBP-EUR", "GBP-INR", "GBP-USD", "GBP-PKR", "EUR-USD", "CAD-INR",
];

// Map a corridor → an INDEXABLE destination (a real /send-money corridor page
// that's in the sitemap). The history/[pair] pages themselves are noindex, so
// we never link to them; instead the curated cards point to a page that earns
// its crawl. Corridors without a send-money page render as non-linked cards.
const CORRIDOR_TO_SENDMONEY: Record<string, string> = {
  "USD-INR": "usa-to-india", "USD-PHP": "usa-to-philippines", "USD-MXN": "usa-to-mexico",
  "USD-PKR": "usa-to-pakistan", "USD-NGN": "usa-to-nigeria", "GBP-EUR": "uk-to-europe",
  "GBP-INR": "uk-to-india", "GBP-PKR": "uk-to-pakistan", "CAD-INR": "canada-to-india",
};

function getCurrencyInfo(code: string) {
  return currencies.find((c) => c.code === code);
}

// ── Metadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const year = new Date().getFullYear();
  return {
    title: `Historical Exchange Rates — Rate Trends for 90+ Currency Corridors (${year})`,
    description: `Track exchange rate history across 90+ currency corridors. Compare how provider rates have changed over time and find the best time to send money abroad.`,
    alternates: getAlternates("exchange-rates/history", locale),
    openGraph: {
      title: `Historical Exchange Rates — Currency Rate Trends (${year})`,
      description: "Track exchange rate trends, compare providers over time, and find the best time to send money.",
      url: "https://sendmoneycompare.com/exchange-rates/history",
    },
  };
}

// ── Page ──────────────────────────────────────────────────────
export default async function HistoryHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allInsights = getAllInsights(2);
  const tier1Insights = TIER1
    .map((key) => allInsights.find((i) => i.corridor === key))
    .filter(Boolean) as RateInsight[];

  // Group remaining by source currency
  const grouped: Record<string, RateInsight[]> = {};
  for (const insight of allInsights) {
    const from = insight.corridor.split("-")[0];
    if (!grouped[from]) grouped[from] = [];
    grouped[from].push(insight);
  }
  // Sort groups by count desc
  const sortedGroups = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Exchange Rates", item: "https://sendmoneycompare.com/exchange-rates" },
      { "@type": "ListItem", position: 3, name: "Rate History", item: "https://sendmoneycompare.com/exchange-rates/history" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-[var(--color-surface)] pt-8 pb-6">
        <Container>
          <div className="flex items-center gap-2 text-2sm text-[var(--color-on-surface-variant)] mb-4">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <span>/</span>
            <Link href="/exchange-rates" className="hover:text-[var(--color-primary)]">Exchange Rates</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface)]">Rate History</span>
          </div>
          <h1 className="text-h3 md:text-h1-plus font-normal text-[var(--color-on-surface)] leading-tight">
            Historical Exchange Rates
          </h1>
          <p className="mt-2 text-sm md:text-md text-[var(--color-on-surface-variant)] max-w-2xl">
            Track how exchange rates have changed over time across {allInsights.length}+ currency corridors.
            Compare provider rates day by day and find the best time to send money abroad.
          </p>
        </Container>
      </section>

      {/* Featured corridors (Tier 1) */}
      <section className="py-8 bg-[var(--color-surface-dim)]">
        <Container>
          <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
            Most tracked corridors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tier1Insights.map((insight) => {
              const [from, to] = insight.corridor.split("-");
              const fromInfo = getCurrencyInfo(from);
              const toInfo = getCurrencyInfo(to);
              const lvl = rateLevelConfig(insight.level);
              const sendMoneySlug = CORRIDOR_TO_SENDMONEY[insight.corridor];
              // Build overall sparkline from best daily rate
              const bestDaily = Object.values(insight.sparklines)
                .flat()
                .reduce<Record<string, { date: string; rate: number; receiveAmount: number }>>((acc, p) => {
                  if (!acc[p.date] || p.rate > acc[p.date].rate) acc[p.date] = p;
                  return acc;
                }, {});
              const overallSparkline = Object.values(bestDaily).sort((a, b) => a.date.localeCompare(b.date));

              // Link only to an indexable /send-money corridor; otherwise a
              // plain card (never to the noindex history/[pair] page).
              const cardClass = "flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline)] transition-all";
              const inner = (
                <>
                  <div className="flex items-center gap-1 shrink-0">
                    <CircleFlag code={from} size={24} />
                    <span className="text-xs text-[var(--color-on-surface-muted)]">→</span>
                    <CircleFlag code={to} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                      {from} → {to}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xs font-medium" style={{ color: lvl.color }}>
                        {lvl.icon} {lvl.label}
                      </span>
                      <span className="text-2xs text-[var(--color-on-surface-muted)]">
                        {insight.stats.avgRate.toFixed(2)} avg
                      </span>
                    </div>
                  </div>
                  {overallSparkline.length >= 2 && (
                    <Sparkline data={overallSparkline} width={64} height={24} />
                  )}
                </>
              );

              return sendMoneySlug ? (
                <Link
                  key={insight.corridor}
                  href={`/send-money/${sendMoneySlug}`}
                  className={`${cardClass} hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)]`}
                >
                  {inner}
                </Link>
              ) : (
                <div key={insight.corridor} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* All corridors by source currency — a DATA showcase, not a link farm.
          Rows are plain text (no <a>): the per-corridor history pages are
          noindex and absent from the sitemap, so linking 800+ of them would
          burn crawl budget on dead ends. The table's value is the data itself
          (current best, avg, trend, level), which crawlers read inline. */}
      <section className="py-10 bg-[var(--color-surface)]">
        <Container>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none text-h4 font-normal text-[var(--color-on-surface)] mb-6 hover:text-[var(--color-primary)] transition-colors">
              <span>All currency corridors with rate history</span>
              <svg className="w-5 h-5 shrink-0 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
          <div className="space-y-8">
            {sortedGroups.map(([from, insights]) => {
              const fromInfo = getCurrencyInfo(from);
              return (
                <div key={from}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-surface)] mb-3">
                    <CircleFlag code={from} size={20} />
                    {fromInfo?.name || from} ({from}) — {insights.length} corridors
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-[var(--color-outline)]">
                    <table className="w-full text-2sm">
                      <thead>
                        <tr className="bg-[var(--color-surface-dim)]">
                          <th className="px-4 py-2.5 text-left font-medium text-[var(--color-on-surface-variant)]">Corridor</th>
                          <th className="px-4 py-2.5 text-right font-medium text-[var(--color-on-surface-variant)]">Current Best</th>
                          <th className="px-4 py-2.5 text-right font-medium text-[var(--color-on-surface-variant)]">Avg</th>
                          <th className="px-4 py-2.5 text-center font-medium text-[var(--color-on-surface-variant)]">Trend</th>
                          <th className="px-4 py-2.5 text-center font-medium text-[var(--color-on-surface-variant)]">Level</th>
                          <th className="px-4 py-2.5 text-right font-medium text-[var(--color-on-surface-variant)]">Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insights
                          .sort((a, b) => b.totalDays - a.totalDays)
                          .map((insight) => {
                            const to = insight.corridor.split("-")[1];
                            const toInfo = getCurrencyInfo(to);
                            const lvl = rateLevelConfig(insight.level);
                            const slug = corridorToSlug(insight.corridor);
                            const bestDaily = Object.values(insight.sparklines)
                              .flat()
                              .reduce<Record<string, { date: string; rate: number; receiveAmount: number }>>((acc, p) => {
                                if (!acc[p.date] || p.rate > acc[p.date].rate) acc[p.date] = p;
                                return acc;
                              }, {});
                            const sparkline = Object.values(bestDaily).sort((a, b) => a.date.localeCompare(b.date));

                            return (
                              <tr key={insight.corridor} className="border-t border-[var(--color-outline)] hover:bg-[var(--color-surface-dim)] transition-colors">
                                {/* Plain text, NOT a link: these history/[pair] pages
                                    are noindex + absent from the sitemap, so linking
                                    all 800+ would flood crawl budget with dead-end
                                    paths. The data in this row IS the value. */}
                                <td className="px-4 py-2.5">
                                  <span className="flex items-center gap-2 font-medium text-[var(--color-on-surface)]">
                                    <CircleFlag code={to} size={18} />
                                    {from} → {to}
                                    {toInfo && <span className="text-2xs text-[var(--color-on-surface-muted)] font-normal hidden sm:inline">({toInfo.name})</span>}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right tabular-nums text-[var(--color-on-surface)]">
                                  {insight.today.bestRate.toFixed(4)}
                                </td>
                                <td className="px-4 py-2.5 text-right tabular-nums text-[var(--color-on-surface-variant)]">
                                  {insight.stats.avgRate.toFixed(4)}
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  {sparkline.length >= 2 && (
                                    <Sparkline data={sparkline} width={56} height={18} />
                                  )}
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  <span className="text-2xs font-medium px-2 py-0.5 rounded-full" style={{ color: lvl.color, backgroundColor: lvl.bg }}>
                                    {lvl.label}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right text-[var(--color-on-surface-variant)]">
                                  {insight.totalDays}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
          </details>
        </Container>
      </section>

      {/* SEO Content */}
      <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl space-y-6 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)]">
              How to use exchange rate history to save on transfers
            </h2>
            <p>
              Exchange rates fluctuate daily based on market conditions, central bank decisions, and economic data.
              By tracking historical rates for your corridor, you can identify whether current rates are above
              or below average — and time your transfer to get more money delivered.
            </p>
            <p>
              Our rate history is unique because we track <strong>actual provider rates</strong>, not just
              mid-market rates. The rate you get from Wise, Remitly, or Western Union can differ significantly
              from the mid-market rate shown on Google. We show you the real rates each provider offered on
              each day, so you can compare who consistently gives the best deal.
            </p>
            <h3 className="text-md font-medium text-[var(--color-on-surface)] !mt-6">What to look for</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rate level</strong> — We label each corridor as Great, Good, Typical, or Low based on where today&apos;s rate sits in its historical range.</li>
              <li><strong>Provider consistency</strong> — Some providers are cheapest most days; others fluctuate. Check the &quot;Best rate X of Y days&quot; badge.</li>
              <li><strong>Trend direction</strong> — An upward trend means rates are improving; a downward trend means the receiving currency is weakening.</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Cross-links */}
      <CrossLinks sections={[
        {
          title: "Popular corridors",
          links: [
            { href: "/send-money/usa-to-india", label: "USA to India" },
            { href: "/send-money/usa-to-philippines", label: "USA to Philippines" },
            { href: "/send-money/uk-to-india", label: "UK to India" },
            { href: "/send-money/usa-to-mexico", label: "USA to Mexico" },
            { href: "/send-money/uk-to-pakistan", label: "UK to Pakistan" },
            { href: "/send-money/usa-to-nigeria", label: "USA to Nigeria" },
          ],
        },
        {
          title: "Live exchange rates",
          links: [
            { href: "/exchange-rates/usd-to-inr", label: "USD to INR" },
            { href: "/exchange-rates/gbp-to-eur", label: "GBP to EUR" },
            { href: "/exchange-rates/usd-to-php", label: "USD to PHP" },
            { href: "/exchange-rates/usd-to-eur", label: "USD to EUR" },
            { href: "/exchange-rates/gbp-to-inr", label: "GBP to INR" },
            { href: "/exchange-rates/usd-to-gbp", label: "USD to GBP" },
          ],
        },
        {
          title: "Tools",
          links: [
            { href: "/exchange-rates", label: "Exchange Rates" },
            { href: "/currency-converter", label: "Currency Converter" },
            { href: "/send-money", label: "Compare Providers" },
            { href: "/remittance-cost-index", label: "Remittance Cost Index" },
          ],
        },
      ]} />
    </>
  );
}
