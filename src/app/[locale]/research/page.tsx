import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Container from "@/components/Container";
import { seoDescription } from "@/lib/seo-title";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { formatLocalDate } from "@/lib/format-date";
import DataProvenance from "@/components/DataProvenance";
import { CONSISTENCY_INDEX } from "@/lib/consistency-index";
import { SENDSCORE_SUMMARY } from "@/lib/sendscore-summary";
import { REMITTANCE_INDEX } from "@/lib/remittance-cost-index";
import { computeBankVsAppIndex } from "@/lib/bank-vs-app-index";
import { AMOUNT_TIER_INDEX } from "@/lib/amount-tier-index";
import weekendMarkup from "@/data/scraped/weekend-markup.json";
import pppIndex from "@/data/scraped/ppp-index.json";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "research" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    keywords: t("metaKeywords"),
    authors: [{ name: "Akif Hazarvi", url: "https://sendmoneycompare.com/about/akif-hazarvi" }],
    alternates: getAlternates("research", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/research",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

// ── Live figures ──────────────────────────────────────────────────────────
// Every headline below is read from the dataset it describes, so a study's
// entry on this hub cannot claim a number the study itself no longer shows.
// The alternative — typing the findings into this page — is the failure
// site-stats.ts was written to end.
const weekend = weekendMarkup as {
  generatedAt: string;
  dataRange: { from: string; to: string };
  observations: number;
  snapshots: number;
  weekdayMean: number;
  weekendMean: number;
  weekendDeltaPp: number;
  providers: unknown[];
};
const ppp = pppIndex as { generatedAt: string; countryCount: number; source: string };
const bankVsApp = computeBankVsAppIndex();

const nf = (n: number) => n.toLocaleString("en-US");

interface Study {
  title: string;
  href: string;
  /** The finding, with its numbers. One sentence a reader could quote. */
  finding: string;
  /** What was measured, and over what. */
  basis: string;
  dataAsOf: string;
  csv?: string;
}

const STUDIES: Study[] = [
  {
    title: "Provider Consistency Index",
    href: "/provider-consistency",
    finding: `No provider is cheapest everywhere. ${CONSISTENCY_INDEX.rows[0].providerName} is the most frequent winner on ${CONSISTENCY_INDEX.rows[0].corridorsLed} of ${CONSISTENCY_INDEX.comparableCorridors} corridors, and on ${Math.round((CONSISTENCY_INDEX.rotatingCorridors / Math.max(1, CONSISTENCY_INDEX.rotatingCorridors + CONSISTENCY_INDEX.stableCorridors)) * 100)}% of corridors the provider that is cheapest today is not the one that usually wins.`,
    basis: `${nf(CONSISTENCY_INDEX.providerDayObservations)} provider-day observations across ${CONSISTENCY_INDEX.comparableCorridors} corridors with a genuine comparison, over ${CONSISTENCY_INDEX.maxWindowDays} days. A day counts only when two or more providers quoted.`,
    dataAsOf: CONSISTENCY_INDEX.dataAsOf,
    csv: "/api/data/provider-consistency",
  },
  {
    title: "Bank vs App Transfer Cost Index",
    href: "/guides/bank-vs-app-transfer-cost-2026",
    finding: `Banks cost ${bankVsApp.bankVsAppMultiple.toFixed(2)}× what specialist apps cost on the same corridors — ${bankVsApp.bankAvgCostPct.toFixed(2)}% of the amount sent against ${bankVsApp.appAvgCostPct.toFixed(2)}%. Against the cheapest provider on the same corridor, a bank transfer loses ${bankVsApp.bankVsCheapestMeanPct.toFixed(2)}% on average.`,
    basis: `${nf(bankVsApp.bankQuoteCount)} bank quotes and ${nf(bankVsApp.appQuoteCount)} specialist quotes at $${nf(bankVsApp.amount)}, across ${bankVsApp.corridorCount} corridors and ${bankVsApp.bankCount} banks.`,
    dataAsOf: bankVsApp.dataAsOf,
    csv: "/api/data/bank-vs-app-cost",
  },
  {
    title: "Remittance Cost Index",
    href: "/remittance-cost-index",
    finding: `Specialist providers cost an average of $${REMITTANCE_INDEX.avgSpecialistCost.toFixed(2)} in fees and exchange-rate markup on a $1,000 transfer; banks cost $${REMITTANCE_INDEX.avgBankCost.toFixed(2)}.`,
    // Deliberately spells out what this corridor count is. It sits on the same
    // page as the consistency index's 212 "comparable" corridors, and two
    // different corridor totals with no explanation is the mutually-exclusive
    // self-description that site-stats.ts exists to prevent. This one counts
    // corridors carrying any quote at the headline amount; that one counts
    // corridors with two or more providers competing over time.
    basis: `${REMITTANCE_INDEX.providers.length} providers priced across ${nf(REMITTANCE_INDEX.corridorCount)} corridors carrying at least one quote at the headline amount — a wider base than the ${CONSISTENCY_INDEX.comparableCorridors} corridors with a sustained multi-provider record. True total cost = the gap between what a mid-market transfer would deliver and what the provider actually delivers, so it captures the fee and the markup together.`,
    dataAsOf: REMITTANCE_INDEX.dataAsOf,
  },
  {
    title: "Day-of-week FX markup study",
    href: "/guides/best-day-to-send-money-abroad",
    finding: `Weekends are marginally cheaper, not dearer: a mean markup of ${weekend.weekendMean.toFixed(2)}% at weekends against ${weekend.weekdayMean.toFixed(2)}% on weekdays, a difference of ${Math.abs(weekend.weekendDeltaPp).toFixed(3)} percentage points. Which provider you choose is a far larger lever than which day you send.`,
    basis: `${nf(weekend.observations)} quote observations from ${nf(weekend.snapshots)} snapshots across ${weekend.providers.length} providers, ${weekend.dataRange.from} to ${weekend.dataRange.to}, corrected for uneven sampling with outliers quarantined rather than dropped silently.`,
    dataAsOf: weekend.generatedAt,
  },
  {
    title: "Transfer cost by amount",
    href: "/transfer-cost-by-amount",
    finding: `Sending $${AMOUNT_TIER_INDEX.smallAmount} costs ${AMOUNT_TIER_INDEX.meanSmallPct.toFixed(2)}% of the amount against ${AMOUNT_TIER_INDEX.meanHeadlinePct.toFixed(2)}% at $${AMOUNT_TIER_INDEX.headlineAmount.toLocaleString("en-US")}, and the cheapest provider is not the same at both — ${AMOUNT_TIER_INDEX.cheapestSmall?.name} at the smaller amount, ${AMOUNT_TIER_INDEX.cheapestHeadline?.name} at the larger.`,
    basis: `${AMOUNT_TIER_INDEX.providersCompared} providers with ${AMOUNT_TIER_INDEX.minQuotesPerTier}+ usable quotes at both amounts. No $10,000 tier is published — only 11 providers quote at that amount, roughly one per corridor.`,
    dataAsOf: REMITTANCE_INDEX.dataAsOf,
    csv: "/api/data/transfer-cost-by-amount",
  },
  {
    title: "SendScore",
    href: "/sendscore",
    finding: `Of the ${SENDSCORE_SUMMARY.corridorsScored} corridors where enough providers compete to score one, ${SENDSCORE_SUMMARY.goodOrBetterPct}% currently read "good" or better as a time to send.`,
    basis: `A 0–100 rating from four weighted components, computed from a median of ${SENDSCORE_SUMMARY.medianDaysObserved} days of recorded provider rates per corridor. Single-provider corridors are excluded from the distribution rather than counted as neutral.`,
    dataAsOf: SENDSCORE_SUMMARY.dataAsOf,
  },
  {
    title: "Transfer cost versus purchasing power",
    href: "/guides/fx-cost-vs-purchasing-power",
    finding: `What a transfer is worth on arrival depends more on local price levels than on the fee. The study pairs our live transfer costs with World Bank PPP conversion factors across ${ppp.countryCount} countries.`,
    basis: `World Bank PPP and GNI indicators, refreshed against live quotes. The interactive version is the salary-abroad calculator.`,
    dataAsOf: ppp.generatedAt,
  },
];

const CSV_ENDPOINTS = STUDIES.filter((s) => s.csv);

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-16 pb-14">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              Original <span className="text-[var(--color-primary)]">research</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 max-w-2xl mx-auto leading-relaxed">
              Every six hours we record what each money transfer provider would actually deliver to a recipient, on
              every corridor we track. The archive behind these studies holds{" "}
              <strong className="text-[var(--color-on-surface)]">{nf(weekend.observations)}</strong> quote observations
              going back to {formatLocalDate(weekend.dataRange.from)}. These {STUDIES.length} datasets are what comes
              out of it — each with its method, its limits, and the figures it actually supports.
            </p>
          </div>
        </Container>
      </section>

      {/* Studies */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-5">
            {STUDIES.map((s) => (
              <article
                key={s.href}
                className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-6 shadow-[var(--shadow-sm)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
                  <h2 className="text-md md:text-lg font-bold text-[var(--color-on-surface)]">
                    <Link href={s.href} className="hover:text-[var(--color-primary)] transition-colors">
                      {s.title}
                    </Link>
                  </h2>
                  <span className="text-2xs text-[var(--color-on-surface-variant)] shrink-0">
                    Data as of <time dateTime={s.dataAsOf}>{formatLocalDate(s.dataAsOf)}</time>
                  </span>
                </div>
                <p className="text-2sm text-[var(--color-on-surface)] leading-relaxed mb-3">{s.finding}</p>
                <p className="text-2xs text-[var(--color-on-surface-variant)] leading-relaxed">{s.basis}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-[var(--color-outline)]">
                  <Link href={s.href} className="text-2sm font-medium text-[var(--color-primary)] hover:underline">
                    Read the study &rarr;
                  </Link>
                  {s.csv && (
                    <a href={s.csv} className="text-2sm font-medium text-[var(--color-primary)] hover:underline">
                      Download the data (CSV)
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Citation + reuse. The on-ramp for journalists and AI assistants: say
          plainly what the licence is and where the raw data is, rather than
          making anyone guess. */}
      <section id="citation" className="py-12 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-4">Using this research</h2>
            <div className="space-y-4 text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                These datasets are published under{" "}
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  className="text-[var(--color-primary)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-NC-SA 4.0
                </a>
                . Quote the figures, reproduce the tables, and cite SendMoneyCompare with a link to the study page. Each
                study states the date of the data behind it — please cite that date rather than the date you read it,
                because the figures move with the scrape.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Raw data.</strong>{" "}
                {CSV_ENDPOINTS.length} of these studies publish their underlying table as a CORS-open CSV, so a figure
                can be checked against the row that produced it:{" "}
                {CSV_ENDPOINTS.map((s, i) => (
                  <span key={s.csv}>
                    {i > 0 && ", "}
                    <a href={s.csv!} className="text-[var(--color-primary)] hover:underline">
                      {s.title}
                    </a>
                  </span>
                ))}
                . There is also a{" "}
                <Link href="/for-ai" className="text-[var(--color-primary)] hover:underline">
                  public quotes endpoint for AI assistants
                </Link>
                .
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Method and corrections.</strong> How the underlying
                quotes are collected and costs calculated is set out in our{" "}
                <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
                  methodology
                </Link>
                . Where we have got something wrong and fixed it, it is logged in{" "}
                <Link href="/corrections" className="text-[var(--color-primary)] hover:underline">
                  corrections
                </Link>
                . For questions about a dataset, or a cut of it we do not publish,{" "}
                <Link href="/contact" className="text-[var(--color-primary)] hover:underline">
                  get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      <DataProvenance
        dataAsOf={CONSISTENCY_INDEX.dataAsOf}
        computedFrom="Each dataset is recomputed from the quote archive whenever the archive refreshes. The headline on every card above is read from the dataset it describes rather than written into this page, so a card cannot outlive the finding behind it."
        sources={[
          { label: "SendMoneyCompare quote archive — every provider\u2019s live quotes, recorded every six hours", href: "/methodology" },
          { label: "World Bank PPP conversion factors and GNI indicators", href: "https://data.worldbank.org/indicator/PA.NUS.PPP", external: true },
          { label: "Our methodology and cost definitions", href: "/methodology" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "SendMoneyCompare original research",
            description: `${STUDIES.length} datasets on international money transfer cost, provider selection and timing, computed from ${weekend.observations} recorded provider quotes.`,
            url: "https://sendmoneycompare.com/research",
            license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: STUDIES.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://sendmoneycompare.com${s.href}`,
                name: s.title,
              })),
            },
          }),
        }}
      />
    </>
  );
}
