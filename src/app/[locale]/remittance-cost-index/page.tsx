import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import providerSummaryData from "@/data/scraped/provider-summary.json";
import trustpilotData from "@/data/scraped/trustpilot-ratings.json";
import { corridors } from "@/data/corridors";
import { providers } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { getAlternates } from "@/lib/i18n-metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "remittanceCostIndex" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
    alternates: getAlternates("remittance-cost-index", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/remittance-cost-index",
    },
  };
}

// Types
interface ProviderSummary {
  name: string;
  slug: string;
  type: string;
  corridors: number;
  avgFee: number;
  avgMarkup: number;
}

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

// Data processing
const summaryData = providerSummaryData as ProviderSummary[];
const trustpilot = trustpilotData as TrustpilotRating[];
const trustpilotMap = new Map(trustpilot.map((t) => [t.slug, t]));

// Compute total cost (markup on $1000 + fee) for ranking
const rankedProviders = summaryData
  .filter((p) => p.corridors >= 5)
  .map((p) => {
    const markupCost = (p.avgMarkup / 100) * 1000;
    const totalCost = markupCost + p.avgFee;
    const tp = trustpilotMap.get(p.slug);
    const localProvider = providers.find((lp) => lp.slug === p.slug);
    return {
      ...p,
      markupCost: Math.round(markupCost * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      rating: tp?.score ?? null,
      ratingLabel: tp?.ratingLabel ?? null,
      reviews: tp?.totalReviews ?? null,
      logo: localProvider?.logo ?? null,
    };
  })
  .sort((a, b) => a.totalCost - b.totalCost);

// Split into specialists vs banks
const specialists = rankedProviders.filter((p) => p.type === "moneyTransferProvider");
const banks = rankedProviders.filter((p) => p.type === "bank");

// Key stats
const totalProviders = rankedProviders.length;
const totalCorridors = summaryData.reduce((max, p) => Math.max(max, p.corridors), 0);
const avgSpecialistCost = specialists.length > 0
  ? Math.round((specialists.reduce((s, p) => s + p.totalCost, 0) / specialists.length) * 100) / 100
  : 0;
const avgBankCost = banks.length > 0
  ? Math.round((banks.reduce((s, p) => s + p.totalCost, 0) / banks.length) * 100) / 100
  : 0;
const savingsVsBanks = avgBankCost > 0 ? Math.round(((avgBankCost - avgSpecialistCost) / avgBankCost) * 100) : 0;

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
      const expectedReceive = q.sendAmount * q.exchangeRate;
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

const faqs = [
  {
    q: "What does the Remittance Cost Index measure?",
    a: "The Remittance Cost Index measures the total cost of sending $1,000 internationally through each provider. It combines two components: the transfer fee charged by the provider and the exchange rate markup (the difference between the provider's rate and the mid-market rate). A lower total cost means more money reaches your recipient.",
  },
  {
    q: "How is the data collected?",
    a: "We collect live quotes from 50+ provider APIs and websites every 6 hours using automated scrapers. The data covers 300+ currency corridors. Each quote includes the exact fee, exchange rate, and receive amount. We then calculate the markup by comparing each provider's rate against the mid-market rate from XE.",
  },
  {
    q: "Why are specialist providers cheaper than banks?",
    a: "Specialist money transfer providers like Wise, Remitly, and OFX operate with lower overhead than traditional banks. They use peer-to-peer matching, local banking networks, and technology to reduce costs. Most importantly, they use exchange rates much closer to the mid-market rate — some like Wise use the exact mid-market rate with zero markup.",
  },
  {
    q: "How often is the index updated?",
    a: "The index is recalculated every time our website is rebuilt, using the most recent scraped data from all providers. Scrapers run every 6 hours via GitHub Actions. The data you see here reflects the latest available quotes across all corridors.",
  },
  {
    q: "Can I use this data in my research or article?",
    a: "Yes. You are welcome to cite data from the SendMoneyCompare Remittance Cost Index in your research, articles, or reports. Please credit SendMoneyCompare and link back to this page (sendmoneycompare.com/remittance-cost-index) as the source.",
  },
];

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
            <div className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              {t("updatedDate")}
            </div>
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              The 2026 Global{" "}
              <span className="text-[var(--color-primary)]">Remittance Cost Index</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 max-w-2xl mx-auto leading-relaxed">
              We analyzed {totalProviders} providers across {totalCorridors}+ corridors to rank the true cost of sending $1,000 abroad — including both fees and hidden exchange rate markups.
            </p>
          </div>
        </Container>
      </section>

      {/* Key Stats */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: t("providersTracked"), value: `${totalProviders}+` },
              { label: "Avg specialist cost", value: `$${avgSpecialistCost.toFixed(2)}` },
              { label: "Avg bank cost", value: `$${avgBankCost.toFixed(2)}` },
              { label: "Savings vs banks", value: `${savingsVsBanks}%` },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-h3 md:text-4xl font-bold text-[var(--color-primary)] tabular-nums">
                  {stat.value}
                </div>
                <div className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
                  {stat.label}
                </div>
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
              <strong className="text-[var(--color-on-surface)]">${avgSpecialistCost.toFixed(2)}</strong> in total fees and markup, while banks charge{" "}
              <strong className="text-[var(--color-on-surface)]">${avgBankCost.toFixed(2)}</strong> — a difference of{" "}
              <strong className="text-[var(--color-primary)]">${(avgBankCost - avgSpecialistCost).toFixed(2)}</strong> per transfer. Over 12 monthly transfers, that&apos;s{" "}
              <strong className="text-[var(--color-primary)]">${((avgBankCost - avgSpecialistCost) * 12).toFixed(0)}</strong> saved per year.
            </p>
          </div>
        </Container>
      </section>

      {/* Provider Rankings Table */}
      <section className="py-14">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-2">
              {t("providerCostRankings")}
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mb-8">
              Ranked by total cost to send $1,000 (transfer fee + exchange rate markup). Lower is better.
            </p>

            {/* Desktop table */}
            <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl overflow-hidden shadow-[var(--shadow-sm)]">
              <div className="grid grid-cols-[40px_1fr_80px_100px_100px_100px_80px] gap-2 px-6 py-3 bg-[var(--color-surface-dim)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                <span>{t("rank")}</span>
                <span>{t("provider")}</span>
                <span className="text-right">Type</span>
                <span className="text-right">Avg Fee</span>
                <span className="text-right">Avg Markup</span>
                <span className="text-right">{t("avgCost")}</span>
                <span className="text-right">{t("corridors")}</span>
              </div>
              {rankedProviders.slice(0, 30).map((p, i) => (
                <div
                  key={p.slug}
                  className={`grid grid-cols-[40px_1fr_80px_100px_100px_100px_80px] gap-2 items-center px-6 py-3 border-t border-[var(--color-outline)] ${
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
                      <Link href={`/companies/${p.slug}`} className="text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                        {p.name}
                      </Link>
                      {p.rating && (
                        <div className="text-2xs text-[var(--color-on-surface-variant)]">
                          {p.rating}/5 ({p.reviews?.toLocaleString()} reviews)
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs text-right ${
                    p.type === "bank" ? "text-orange-600" : "text-green-600"
                  }`}>
                    {p.type === "bank" ? "Bank" : "Specialist"}
                  </span>
                  <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                    ${p.avgFee.toFixed(2)}
                  </span>
                  <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                    {p.avgMarkup.toFixed(2)}%
                  </span>
                  <span className={`text-sm font-semibold text-right tabular-nums ${
                    p.totalCost < 15 ? "text-green-600" : p.totalCost < 30 ? "text-[var(--color-on-surface)]" : "text-orange-600"
                  }`}>
                    ${p.totalCost.toFixed(2)}
                  </span>
                  <span className="text-2sm text-[var(--color-on-surface-variant)] text-right tabular-nums">
                    {p.corridors}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {rankedProviders.slice(0, 20).map((p, i) => (
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
                      <Link href={`/companies/${p.slug}`} className="text-md font-semibold text-[var(--color-on-surface)]">
                        {p.name}
                      </Link>
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">
                        {p.type === "bank" ? "Bank" : "Specialist"} &middot; {p.corridors} corridors
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[var(--color-surface-dim)] rounded-lg px-2 py-2">
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">Fee</div>
                      <div className="text-sm font-semibold text-[var(--color-on-surface)]">${p.avgFee.toFixed(2)}</div>
                    </div>
                    <div className="bg-[var(--color-surface-dim)] rounded-lg px-2 py-2">
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">Markup</div>
                      <div className="text-sm font-semibold text-[var(--color-on-surface)]">{p.avgMarkup.toFixed(2)}%</div>
                    </div>
                    <div className="bg-[var(--color-surface-dim)] rounded-lg px-2 py-2">
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">Total</div>
                      <div className={`text-sm font-bold ${
                        p.totalCost < 15 ? "text-green-600" : p.totalCost < 30 ? "text-[var(--color-on-surface)]" : "text-orange-600"
                      }`}>
                        ${p.totalCost.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Specialists vs Banks */}
      <section className="py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-2">
              {t("specialistsVsBanks")}
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mb-8">
              Average cost comparison on a $1,000 transfer across all corridors.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Specialists card */}
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-on-surface)]">Specialist Providers</h3>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{specialists.length} providers analyzed</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2sm text-[var(--color-on-surface-variant)]">Average fee</span>
                    <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                      ${specialists.length > 0 ? (specialists.reduce((s, p) => s + p.avgFee, 0) / specialists.length).toFixed(2) : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2sm text-[var(--color-on-surface-variant)]">Average markup</span>
                    <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                      {specialists.length > 0 ? (specialists.reduce((s, p) => s + p.avgMarkup, 0) / specialists.length).toFixed(2) : "0"}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--color-outline)]">
                    <span className="text-sm font-semibold text-[var(--color-on-surface)]">Total cost per $1,000</span>
                    <span className="text-lg font-bold text-green-600 tabular-nums">
                      ${avgSpecialistCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Banks card */}
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-on-surface)]">Traditional Banks</h3>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{banks.length} banks analyzed</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2sm text-[var(--color-on-surface-variant)]">Average fee</span>
                    <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                      ${banks.length > 0 ? (banks.reduce((s, p) => s + p.avgFee, 0) / banks.length).toFixed(2) : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2sm text-[var(--color-on-surface-variant)]">Average markup</span>
                    <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                      {banks.length > 0 ? (banks.reduce((s, p) => s + p.avgMarkup, 0) / banks.length).toFixed(2) : "0"}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--color-outline)]">
                    <span className="text-sm font-semibold text-[var(--color-on-surface)]">Total cost per $1,000</span>
                    <span className="text-lg font-bold text-orange-600 tabular-nums">
                      ${avgBankCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Corridor Cost Table */}
      {corridorCosts.length > 0 && (
        <section className="py-14">
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
                    href={`/send-money/${c.slug}`}
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

              <div className="text-center mt-6">
                <Link href="/send-money" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                  Compare all corridors &rarr;
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Methodology */}
      <section className="py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-6">
              {t("methodology")}
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                The SendMoneyCompare Remittance Cost Index is calculated from live quotes collected directly from provider APIs and websites. Our automated scrapers run every 6 hours across {totalProviders}+ providers and {totalCorridors}+ currency corridors.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Total cost</strong> is defined as the transfer fee plus the cost of the exchange rate markup on a $1,000 transfer. The exchange rate markup is calculated by comparing each provider&apos;s offered rate against the mid-market rate from XE. For example, if the mid-market rate is 83.00 INR per USD and a provider offers 82.17 INR, the markup is 1.0% — costing the sender $10 on a $1,000 transfer.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Provider averages</strong> are computed across all corridors where a provider has available quotes. Providers with fewer than 5 corridors are excluded to ensure statistical reliability.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Data priority:</strong> When multiple data sources exist for the same provider-corridor pair, we prioritize direct API/browser scrapes over third-party comparison aggregators, ensuring the most accurate pricing.
              </p>
            </div>
          </div>
        </Container>
      </section>

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
                SendMoneyCompare. &ldquo;The 2026 Global Remittance Cost Index.&rdquo; SendMoneyCompare.com, March 2026. https://sendmoneycompare.com/remittance-cost-index
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
            description: `Average fees and exchange rate markups for ${totalProviders}+ money transfer providers across ${totalCorridors}+ currency corridors.`,
            url: "https://sendmoneycompare.com/remittance-cost-index",
            license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            creator: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              url: "https://sendmoneycompare.com",
            },
            datePublished: "2026-01-01",
            dateModified: "2026-03-17",
            temporalCoverage: "2025/2026",
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
