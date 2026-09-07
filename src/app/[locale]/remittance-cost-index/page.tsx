import { seoDescription } from "@/lib/seo-title";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import trustpilotData from "@/data/scraped/trustpilot-ratings.json";
import { corridors } from "@/data/corridors";
import { providers } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import CryptoVsBankIndexSection from "@/components/CryptoVsBankIndexSection";
import { companyPageRenders, corridorPageRenders } from "@/lib/route-map";
import { COVERAGE, SITE_STATS } from "@/lib/site-stats";
import { REMITTANCE_INDEX, CORRIDOR_SPREAD, type IndexRow } from "@/lib/remittance-cost-index";
import { formatLocalDate } from "@/lib/format-date";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "remittanceCostIndex" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    keywords: t("metaKeywords"),
    alternates: getAlternates("remittance-cost-index", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/remittance-cost-index",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

// Types
interface TrustpilotRating {
  slug: string;
  name: string;
  score: number | null;
  totalReviews: number | null;
  ratingLabel: string | null;
}

interface CorridorCost {
  slug: string;
  fromCountry: string;
  toCountry: string;
  fromFlag: string;
  toFlag: string;
  fromCurrency: string;
  toCurrency: string;
  cheapestProvider: string;
  cheapestCost: number;
  avgCost: number;
  providerCount: number;
}

// ── Data ──────────────────────────────────────────────────────────────────
// Every number on this page comes from REMITTANCE_INDEX, computed at build time
// from the same live quote set as every comparison table. The page used to read
// provider-summary.json — a file no scraper regenerated after 2026-03-17 —
// while its FAQ promised a recalculation on every rebuild. Now the "as of" date
// is the date of the quotes behind the ranking, and the same figures feed the
// "measured markup" line on /companies pages.
const idx = REMITTANCE_INDEX;
const trustpilot = trustpilotData as TrustpilotRating[];
const trustpilotMap = new Map(trustpilot.map((t) => [t.slug, t]));

const dataAsOfLabel = formatLocalDate(idx.dataAsOf);
const savingsVsBanks =
  idx.avgBankCost > 0 ? Math.round(((idx.avgBankCost - idx.avgSpecialistCost) / idx.avgBankCost) * 100) : 0;
const cheapestSpecialist = idx.specialists[0];
const cheapestBank = idx.banks[0];
const monthYear = new Date(`${idx.dataAsOf}T00:00:00Z`).toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// Corridor costs — compute for editorial (non-currency) corridors
const SAMPLE_CORRIDORS = corridors
  .filter((c) => !c.isCurrencyCorridor)
  .slice(0, 20);

function getCorridorCosts(): CorridorCost[] {
  return SAMPLE_CORRIDORS.map((c) => {
    const quotes = generateQuotes(c.sampleAmount, c.fromCurrency, c.toCurrency);
    if (quotes.length === 0) {
      return {
        slug: c.slug,
        fromCountry: c.fromCountry,
        toCountry: c.toCountry,
        fromFlag: c.fromFlag,
        toFlag: c.toFlag,
        fromCurrency: c.fromCurrency,
        toCurrency: c.toCurrency,
        cheapestProvider: "N/A",
        cheapestCost: 0,
        avgCost: 0,
        providerCount: 0,
      };
    }

    // Best quote = highest receiveAmount
    const best = quotes[0];
    const midRate = best.exchangeRate > 0 ? best.sendAmount * best.exchangeRate : 0;

    const costs = quotes.map((q) => {
      const impliedMarkupLoss = midRate > 0 ? midRate - q.receiveAmount : 0;
      return q.fee + Math.max(0, impliedMarkupLoss);
    });

    const avgCost = costs.length > 0
      ? Math.round((costs.reduce((s, c) => s + c, 0) / costs.length) * 100) / 100
      : 0;

    const bestProvider = providers.find((p) => p.slug === best.providerSlug);

    return {
      slug: c.slug,
      fromCountry: c.fromCountry,
      toCountry: c.toCountry,
      fromFlag: c.fromFlag,
      toFlag: c.toFlag,
      fromCurrency: c.fromCurrency,
      toCurrency: c.toCurrency,
      cheapestProvider: bestProvider?.name ?? best.providerSlug,
      cheapestCost: Math.round(best.fee * 100) / 100,
      avgCost,
      providerCount: quotes.length,
    };
  }).filter((c) => c.providerCount > 0);
}

const corridorCosts = getCorridorCosts();

// ── Where comparing matters most ──────────────────────────────────────────
// The aggregate median gap is taken over every corridor with 3+ providers, but
// the TABLE only shows corridors with 5+. With four providers the median is the
// mean of two quotes, and leading the table with one of those would repeat the
// mistake the provider ranking already corrects for — a thin sample outranking
// a deep one on a technicality.
const SPREAD_TABLE_MIN_PROVIDERS = 5;
const spreadRowsShown = CORRIDOR_SPREAD.rows
  .filter((r) => r.providers >= SPREAD_TABLE_MIN_PROVIDERS)
  .slice(0, 10);

const faqs = [
  {
    q: "What does the Remittance Cost Index measure?",
    a: `The Remittance Cost Index measures the true total cost of sending $1,000 internationally through each provider: the transfer fee plus the exchange rate markup (the gap between the provider's rate and the mid-market rate), expressed as what the recipient loses against a transfer at the mid-market rate. A lower total cost means more money reaches your recipient.`,
  },
  {
    q: "How is the data collected?",
    a: `We collect live quotes from provider APIs and websites every ${SITE_STATS.refreshHours} hours using automated scrapers. Not every provider quotes every corridor, so the number ranked here (${idx.providers.length}, each with quotes on at least ${idx.minCorridors} corridors at $1,000) is smaller than the ${COVERAGE.providers} we track. Each quote includes the exact fee, exchange rate and receive amount; the markup is the distance from the mid-market rate published by XE at the time of the quote.`,
  },
  {
    q: "Why are specialist providers cheaper than banks on average?",
    a: `Specialist money transfer providers operate with lower overhead than traditional banks and price much closer to the mid-market rate — some, like Wise, at the mid-market rate itself with a visible fee. On our data that gap is $${idx.avgSpecialistCost.toFixed(2)} against $${idx.avgBankCost.toFixed(2)} per $1,000. It is an average across each group: the cheapest banks we measure undercut many specialists, and the two rankings above are kept separate so you can see both.`,
  },
  {
    q: "How often is the index updated?",
    a: `The index is recalculated from the latest quotes every time the site is rebuilt, and the scrapers behind those quotes run every ${SITE_STATS.refreshHours} hours. The figures on this page are from quotes collected on ${dataAsOfLabel}. The methodology has not changed since it was published in March 2026.`,
  },
  {
    q: "Can I use this data in my research or article?",
    a: "Yes. You are welcome to cite data from the SendMoneyCompare Remittance Cost Index in your research, articles, or reports. Please credit SendMoneyCompare and link back to this page (sendmoneycompare.com/remittance-cost-index) as the source.",
  },
];

// ── Ranking table ─────────────────────────────────────────────────────────
// One component for both groups. The old page ranked banks and specialists in
// a single list beneath a headline saying specialists are cheaper — and then
// showed three banks at #1–#3 (each priced on exactly five corridors), which
// read as a manufactured conclusion. Separate tables make the type averages
// intuitive and stop a five-corridor bank outranking a 300-corridor specialist
// on a technicality.
function costTone(cost: number): string {
  return cost < 15 ? "text-green-600" : cost < 30 ? "text-[var(--color-on-surface)]" : "text-orange-600";
}

function RankingTable({ rows, limit }: { rows: IndexRow[]; limit: number }) {
  const shown = rows.slice(0, limit);
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="grid grid-cols-[40px_1fr_100px_100px_110px_90px] gap-2 px-6 py-3 bg-[var(--color-surface-dim)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
          <span>#</span>
          <span>Provider</span>
          <span className="text-right">Avg fee</span>
          <span className="text-right">Avg markup</span>
          <span className="text-right">Cost per $1,000</span>
          <span className="text-right">Corridors</span>
        </div>
        {shown.map((p, i) => {
          const tp = trustpilotMap.get(p.slug);
          return (
            <div
              key={p.slug}
              className={`grid grid-cols-[40px_1fr_100px_100px_110px_90px] gap-2 items-center px-6 py-3 border-t border-[var(--color-outline)] ${
                i < 3 ? "bg-[var(--color-primary-surface)]/30" : ""
              }`}
            >
              <span className={`text-sm font-bold ${i < 3 ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
                {i + 1}
              </span>
              <div className="flex items-center gap-3 min-w-0">
                {p.logo && (
                  <Image src={p.logo} alt={`${p.name} logo`} width={28} height={28} className="rounded-full shrink-0 bg-white object-contain p-0.5 border border-[var(--color-outline)]/40" />
                )}
                <div className="min-w-0">
                  {companyPageRenders(p.slug) ? (
                    <Link href={`/companies/${p.slug}`} className="text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {p.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-[var(--color-on-surface)]">{p.name}</span>
                  )}
                  {tp?.score && (
                    <div className="text-2xs text-[var(--color-on-surface-variant)]">
                      {tp.score}/5 ({tp.totalReviews?.toLocaleString()} reviews)
                    </div>
                  )}
                </div>
              </div>
              <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">{p.avgFeePct.toFixed(2)}%</span>
              <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">{p.avgMarkupPct.toFixed(2)}%</span>
              <span className={`text-sm font-semibold text-right tabular-nums ${costTone(p.costPerAmount)}`}>
                ${p.costPerAmount.toFixed(2)}
              </span>
              <span className="text-2sm text-[var(--color-on-surface-variant)] text-right tabular-nums">{p.corridors}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {shown.map((p, i) => (
          <div
            key={p.slug}
            className={`rounded-2xl border border-[var(--color-outline)] p-4 ${
              i < 3 ? "bg-[var(--color-primary-surface)]/30" : "bg-[var(--color-surface)]"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-lg font-bold w-7 ${i < 3 ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}>
                {i + 1}
              </span>
              {p.logo && (
                <Image src={p.logo} alt={p.name} width={32} height={32} className="rounded-full bg-white object-contain p-0.5 border border-[var(--color-outline)]/40" />
              )}
              <div>
                {companyPageRenders(p.slug) ? (
                  <Link href={`/companies/${p.slug}`} className="text-md font-semibold text-[var(--color-on-surface)]">
                    {p.name}
                  </Link>
                ) : (
                  <span className="text-md font-semibold text-[var(--color-on-surface)]">{p.name}</span>
                )}
                <div className="text-2xs text-[var(--color-on-surface-variant)]">{p.corridors} corridors</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[var(--color-surface-dim)] rounded-lg px-2 py-2">
                <div className="text-2xs text-[var(--color-on-surface-variant)]">Fee</div>
                <div className="text-sm font-semibold text-[var(--color-on-surface)]">{p.avgFeePct.toFixed(2)}%</div>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-lg px-2 py-2">
                <div className="text-2xs text-[var(--color-on-surface-variant)]">Markup</div>
                <div className="text-sm font-semibold text-[var(--color-on-surface)]">{p.avgMarkupPct.toFixed(2)}%</div>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-lg px-2 py-2">
                <div className="text-2xs text-[var(--color-on-surface-variant)]">Per $1,000</div>
                <div className={`text-sm font-bold ${costTone(p.costPerAmount)}`}>${p.costPerAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TypeCard({
  title,
  count,
  feePct,
  markupPct,
  cost,
  tone,
}: {
  title: string;
  count: number;
  feePct: number;
  markupPct: number;
  cost: number;
  tone: "green" | "orange";
}) {
  const ring = tone === "green" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600";
  const costColor = tone === "green" ? "text-green-600" : "text-orange-600";
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ring}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {tone === "green" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            )}
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--color-on-surface)]">{title}</h3>
          <p className="text-xs text-[var(--color-on-surface-variant)]">{count} ranked</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-2sm text-[var(--color-on-surface-variant)]">Average fee (% of amount)</span>
          <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">{feePct.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2sm text-[var(--color-on-surface-variant)]">Average markup</span>
          <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">{markupPct.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[var(--color-outline)]">
          <span className="text-sm font-semibold text-[var(--color-on-surface)]">Total cost per $1,000</span>
          <span className={`text-lg font-bold tabular-nums ${costColor}`}>${cost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default async function RemittanceCostIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "remittanceCostIndex" });
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-16 pb-14">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {/* Two dates, named. "Updated March 2026" on a page of live data read
                as stale; the methodology IS from March, the numbers are from the
                latest scrape, and readers need to know which is which. */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                Data refreshed <time dateTime={idx.dataAsOf}>{dataAsOfLabel}</time>
              </span>
              <span className="inline-block bg-[var(--color-surface)] border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                {t("updatedDate")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              The 2026 Global{" "}
              <span className="text-[var(--color-primary)]">Remittance Cost Index</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 max-w-2xl mx-auto leading-relaxed">
              Of the {COVERAGE.providers} we track, {idx.providers.length} quoted a $1,000 transfer on at least{" "}
              {idx.minCorridors} corridors and are ranked here — {idx.specialists.length} specialists and {idx.banks.length} banks
              across {idx.corridorCount} corridors — by the true cost of the transfer: the fee plus the hidden exchange rate markup.
            </p>
          </div>
        </Container>
      </section>

      {/* Key Stats */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Providers ranked", value: `${idx.providers.length}`, sub: `of ${COVERAGE.providers} tracked` },
              { label: "Avg specialist cost", value: `$${idx.avgSpecialistCost.toFixed(2)}`, sub: `${idx.specialists.length} providers` },
              { label: "Avg bank cost", value: `$${idx.avgBankCost.toFixed(2)}`, sub: `${idx.banks.length} banks` },
              { label: "Savings vs banks", value: `${savingsVsBanks}%`, sub: "on a $1,000 transfer" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-h3 md:text-4xl font-bold text-[var(--color-primary)] tabular-nums">
                  {stat.value}
                </div>
                <div className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
                  {stat.label}
                </div>
                <div className="text-2xs text-[var(--color-on-surface-muted)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Finding */}
      <section className="py-10 bg-[var(--color-primary-surface)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-3">
              {t("keyFinding")}
            </h2>
            <p className="text-md md:text-md text-[var(--color-on-surface-variant)] leading-relaxed">
              On a $1,000 transfer, specialist providers cost an average of{" "}
              <strong className="text-[var(--color-on-surface)]">${idx.avgSpecialistCost.toFixed(2)}</strong> in total fees and markup, while banks charge{" "}
              <strong className="text-[var(--color-on-surface)]">${idx.avgBankCost.toFixed(2)}</strong> — a difference of{" "}
              <strong className="text-[var(--color-primary)]">${(idx.avgBankCost - idx.avgSpecialistCost).toFixed(2)}</strong> per transfer. Over 12 monthly transfers, that is{" "}
              <strong className="text-[var(--color-primary)]">${((idx.avgBankCost - idx.avgSpecialistCost) * 12).toFixed(0)}</strong> saved per year.
              {cheapestSpecialist && cheapestBank && (
                <>
                  {" "}
                  The averages hide a wide spread inside each group: the cheapest bank we measure ({cheapestBank.name}, ${cheapestBank.costPerAmount.toFixed(2)}) beats most specialists, and the cheapest specialist ({cheapestSpecialist.name}, ${cheapestSpecialist.costPerAmount.toFixed(2)}) beats every bank.
                </>
              )}
            </p>
          </div>
        </Container>
      </section>

      {/* Specialist rankings */}
      <section className="py-14">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-2">
              Cheapest specialist providers
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mb-8">
              Money transfer specialists ranked by average true cost to send $1,000 (fee + exchange rate markup, as a share of the amount sent). Lower is better. Averages are taken over every corridor the provider quoted at $1,000 on {dataAsOfLabel}.
            </p>
            <RankingTable rows={idx.specialists} limit={25} />
          </div>
        </Container>
      </section>

      {/* Bank rankings */}
      <section className="py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-2">
              Cheapest banks
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mb-8">
              Banks and bank-owned remittance products, same method. Bank fees are often quoted in the sender&apos;s currency, so they are shown here as a percentage of the amount sent to make them comparable.
            </p>
            <RankingTable rows={idx.banks} limit={20} />
          </div>
        </Container>
      </section>

      {/* Specialists vs Banks */}
      <section className="py-14">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-2">
              {t("specialistsVsBanks")}
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mb-8">
              Average cost by provider type on a $1,000 transfer, across every ranked provider in each group.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <TypeCard
                title="Specialist providers"
                count={idx.specialists.length}
                feePct={idx.avgSpecialistFeePct}
                markupPct={idx.avgSpecialistMarkupPct}
                cost={idx.avgSpecialistCost}
                tone="green"
              />
              <TypeCard
                title="Traditional banks"
                count={idx.banks.length}
                feePct={idx.avgBankFeePct}
                markupPct={idx.avgBankMarkupPct}
                cost={idx.avgBankCost}
                tone="orange"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Corridor Cost Table */}
      {corridorCosts.length > 0 && (
        <section className="py-14 bg-[var(--color-surface-dim)]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-2">
                {t("costByCorridor")}
              </h2>
              <p className="text-md text-[var(--color-on-surface-variant)] mb-8">
                The cheapest provider and number of options for the most popular transfer corridors.
              </p>

              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl overflow-hidden shadow-[var(--shadow-sm)]">
                <div className="hidden sm:grid grid-cols-[1fr_140px_100px_80px] gap-2 px-6 py-3 bg-[var(--color-surface-dim)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                  <span>Corridor</span>
                  <span>Cheapest Provider</span>
                  <span className="text-right">Lowest Fee</span>
                  <span className="text-right">Providers</span>
                </div>
                {corridorCosts.map((c) => (
                  <Link
                    key={c.slug}
                    href={corridorPageRenders(c.slug) ? `/send-money/${c.slug}` : "/send-money"}
                    className="grid sm:grid-cols-[1fr_140px_100px_80px] gap-1 sm:gap-2 items-center px-6 py-3 border-t border-[var(--color-outline)] hover:bg-[var(--color-surface-dim)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.fromFlag}</span>
                      <span className="text-2sm text-[var(--color-on-surface-variant)]">&rarr;</span>
                      <span className="text-base">{c.toFlag}</span>
                      <span className="text-sm font-medium text-[var(--color-on-surface)]">
                        {c.fromCountry} to {c.toCountry}
                      </span>
                    </div>
                    <span className="text-2sm text-[var(--color-primary)] font-medium">
                      {c.cheapestProvider}
                    </span>
                    <span className="text-sm font-semibold text-green-600 sm:text-right tabular-nums">
                      ${c.cheapestCost.toFixed(2)}
                    </span>
                    <span className="text-2sm text-[var(--color-on-surface-variant)] sm:text-right">
                      {c.providerCount}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
                <Link href="/send-money" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                  Compare all corridors &rarr;
                </Link>
                {/* Sibling index. This one ranks providers by cost; that one by
                    how often they actually win. Readers arriving on either
                    should be able to reach the other. */}
                <Link href="/provider-consistency" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                  Which provider wins most often? &rarr;
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Where comparing matters most — the corridor cut of this index. The
          provider tables above answer "who is dearest"; nothing answered "on
          which corridors does the choice cost the most", which is the question
          a comparison table exists to settle. */}
      <section id="comparison-gap" className="py-14 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-3">
              Where comparing matters most
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
              Across the {CORRIDOR_SPREAD.corridorsMeasured} corridors where at least{" "}
              {CORRIDOR_SPREAD.minProviders} providers quote a ${idx.amount.toLocaleString("en-US")} transfer, the
              median corridor costs{" "}
              <strong className="text-[var(--color-on-surface)]">{CORRIDOR_SPREAD.medianGapPct.toFixed(2)}%</strong>{" "}
              more through the middle-ranked provider than through the cheapest — about{" "}
              <strong className="text-[var(--color-primary)]">
                ${((CORRIDOR_SPREAD.medianGapPct / 100) * idx.amount).toFixed(0)}
              </strong>{" "}
              per ${idx.amount.toLocaleString("en-US")} sent. The gap is measured against the median provider rather
              than the dearest, because the dearest is often a single outlying bank and the median is what a sender who
              does not compare actually lands on.
            </p>

            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl overflow-hidden shadow-[var(--shadow-sm)]">
              <div className="grid grid-cols-[1fr_60px_78px_78px_92px] gap-2 px-5 py-3 bg-[var(--color-surface-dim)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                <span>Corridor</span>
                <span className="text-right">Quotes</span>
                <span className="text-right">Cheapest</span>
                <span className="text-right">Median</span>
                <span className="text-right">Gap</span>
              </div>
              {spreadRowsShown.map((r) => (
                <div
                  key={r.corridor}
                  className="grid grid-cols-[1fr_60px_78px_78px_92px] gap-2 items-center px-5 py-3 border-t border-[var(--color-outline)]"
                >
                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {r.sendCurrency} &rarr; {r.receiveCurrency}
                  </span>
                  <span className="text-2sm text-[var(--color-on-surface-variant)] text-right tabular-nums">
                    {r.providers}
                  </span>
                  <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                    {r.bestCostPct.toFixed(2)}%
                  </span>
                  <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                    {r.medianCostPct.toFixed(2)}%
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-primary)] text-right tabular-nums">
                    ${r.gapPerAmount.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-2xs text-[var(--color-on-surface-muted)] mt-3">
              Widest gaps among corridors with {SPREAD_TABLE_MIN_PROVIDERS} or more providers quoting, so the median is
              taken over a real field. Cost is fee plus exchange-rate markup, as a share of the amount sent.{" "}
              <Link href="/provider-consistency" className="text-[var(--color-primary)] hover:underline">
                Which provider wins most often
              </Link>{" "}
              answers who to pick once you know the gap is worth closing, and{" "}
              <Link href="/transfer-cost-by-amount" className="text-[var(--color-primary)] hover:underline">
                transfer cost by amount
              </Link>{" "}
              shows how this ranking changes below $1,000.
            </p>
          </div>
        </Container>
      </section>

      {/* Methodology */}
      <section className="py-14 bg-[var(--color-surface)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-6">
              {t("methodology")}
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                The SendMoneyCompare Remittance Cost Index is calculated from live quotes collected directly from provider APIs and websites. Our automated scrapers run every {SITE_STATS.refreshHours} hours across {COVERAGE.providers}; {idx.providersPriced} of them quoted a $1,000 transfer in the current dataset and {idx.providers.length} did so on at least {idx.minCorridors} corridors, the threshold for a ranking. The figures on this page are from quotes collected on {dataAsOfLabel}.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">True total cost</strong> is what the recipient loses against a transfer at the mid-market rate: (amount × mid-market rate − amount received) ÷ (amount × mid-market rate). It captures the transfer fee and the exchange rate markup in one figure, because the amount received is what lands after both. We report it per $1,000 sent. Fee and markup are also shown separately as percentages of the amount sent — the only way to compare a fee quoted in yen with one quoted in dollars.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Provider averages</strong> are computed across every corridor where a provider quoted $1,000 (or 1,000 units of its send currency). Providers with fewer than {idx.minCorridors} such corridors are excluded, and specialists and banks are ranked separately so a bank priced on five corridors is not read against a specialist priced on three hundred. Quotes implying a cost below −2% or above 40% are treated as scrape artifacts and dropped.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Data priority:</strong> when multiple sources exist for the same provider-corridor pair, a first-party API or browser scrape wins over a third-party comparison aggregator. The same dataset, priority and mid-market baseline feed every comparison table on this site and the measured markup shown on each provider review, so no two pages can disagree about a provider&apos;s cost.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Crypto rails vs banks — live "beats mid-market" league table */}
      <CryptoVsBankIndexSection />

      {/* CTA */}
      <section className="py-14 bg-[var(--color-primary)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-h2 font-bold text-white mb-3">
              Find the cheapest transfer for your corridor
            </h2>
            <p className="text-md text-white/80 mb-6">
              The index shows averages — your specific corridor may be cheaper. Compare live quotes now.
            </p>
            <Link
              href="/send-money"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-semibold text-md px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Compare providers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] text-center mb-10">
              {t("faq")}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-md font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Citation block */}
      <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-2">{t("citeThisIndex")}</h3>
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl px-5 py-4">
              <p className="text-2sm text-[var(--color-on-surface-variant)] font-mono leading-relaxed">
                SendMoneyCompare. &ldquo;The 2026 Global Remittance Cost Index.&rdquo; SendMoneyCompare.com, data as of {monthYear}. https://sendmoneycompare.com/remittance-cost-index
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQPage rich results restricted to government/healthcare since Aug 2023. FAQ content still rendered on page. */}
      {/* Dataset JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "2026 Global Remittance Cost Index",
            description: `True total cost (fee plus exchange rate markup) of sending $1,000 abroad for ${idx.providers.length} money transfer providers and banks across ${idx.corridorCount} currency corridors, from live quotes.`,
            url: "https://sendmoneycompare.com/remittance-cost-index",
            license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            creator: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              url: "https://sendmoneycompare.com",
            },
            datePublished: "2026-03-17",
            dateModified: idx.dataAsOf,
            temporalCoverage: `2026-03-17/${idx.dataAsOf}`,
            distribution: {
              "@type": "DataDownload",
              encodingFormat: "text/html",
              contentUrl: "https://sendmoneycompare.com/remittance-cost-index",
            },
          }),
        }}
      />
    </>
  );
}
