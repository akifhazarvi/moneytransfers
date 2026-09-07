import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Container from "@/components/Container";
import { seoDescription } from "@/lib/seo-title";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { formatLocalDate } from "@/lib/format-date";
import {
  SENDSCORE_SUMMARY,
  SENDSCORE_WEIGHTS,
  BAND_ORDER,
  BAND_LABELS,
} from "@/lib/sendscore-summary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sendscore" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    keywords: t("metaKeywords"),
    alternates: getAlternates("sendscore", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/sendscore",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

const s = SENDSCORE_SUMMARY;
const dataAsOfLabel = formatLocalDate(s.dataAsOf);
const example = s.example;
const maxBand = Math.max(...BAND_ORDER.map((b) => s.bands[b]), 1);

export default async function SendScorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Hero — the definition first, in one sentence, because that is what a
          reader or a retrieval system is here for. */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-16 pb-14">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              Scores refreshed <time dateTime={s.dataAsOf}>{dataAsOfLabel}</time>
            </span>
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              What is <span className="text-[var(--color-primary)]">SendScore</span>?
            </h1>
            <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 max-w-2xl mx-auto leading-relaxed">
              SendScore is a 0–100 rating of whether today is a good day to send money on a given corridor, built from
              our own recorded provider rates rather than mid-market history. It combines four measurements — where
              today sits in the 90-day range, how it compares with the 30-day average, how far the best provider beats
              the field, and which way the market moved this week. Today, {s.goodOrBetterPct}% of the{" "}
              {s.corridorsScored} corridors we can score read &ldquo;good&rdquo; or better.
            </p>
          </div>
        </Container>
      </section>

      {/* Why it needs our data */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-10">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-3">
              Why nobody else publishes this
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
              &ldquo;Who is cheapest right now&rdquo; is a snapshot anyone can take. &ldquo;Is now a good time&rdquo;
              needs months of <em>provider</em> rate history — not mid-market history, which is freely available and
              tells you nothing about what a provider will actually give you. We have been recording what each provider
              would deliver, every six hours, for a median of {s.medianDaysObserved} days per scored corridor. A
              competitor would have to start collecting today and wait a quarter to answer the same question.
            </p>
          </div>
        </Container>
      </section>

      {/* How it is calculated */}
      <section id="how-it-works" className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-2">
              How the score is calculated
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
              Four components, each scored 0–100 and then weighted. The weights are deliberately round numbers: they are
              a judgement about what a sender cares about, not a fitted model, and presenting them as anything more
              precise would be false precision.
            </p>
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl divide-y divide-[var(--color-outline)]">
              {SENDSCORE_WEIGHTS.map((c) => (
                <div key={c.key} className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">{c.label}</h3>
                    <span className="text-sm font-bold text-[var(--color-primary)] tabular-nums shrink-0">
                      {c.weight}%
                    </span>
                  </div>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{c.what}</p>
                </div>
              ))}
            </div>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mt-5 leading-relaxed">
              If a component cannot be computed honestly it is dropped and the remaining weights are renormalised — the
              score never invents a factor to look precise. The sentence shown under every score is assembled from these
              same component figures, which is what stops a &ldquo;great time to send&rdquo; headline appearing above a
              falling market.
            </p>
          </div>
        </Container>
      </section>

      {/* Worked example */}
      {example && (
        <section className="py-12 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-2">
                A worked example: {example.pair.replace("-", " → ")}
              </h2>
              <p className="text-2sm text-[var(--color-on-surface-variant)] mb-5 leading-relaxed">
                Every number below is the one behind today&rsquo;s published score for this corridor.
              </p>
              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold text-[var(--color-primary)] tabular-nums">
                    {example.score.score}
                  </div>
                  <div>
                    <div className="text-md font-semibold text-[var(--color-on-surface)]">
                      {example.score.headline}
                    </div>
                    <div className="text-2xs text-[var(--color-on-surface-variant)]">
                      {example.score.daysObserved} days of recorded rates · {example.score.confidence} confidence
                    </div>
                  </div>
                </div>
                <table className="w-full text-2sm">
                  <thead>
                    <tr className="text-left text-[var(--color-on-surface-variant)]">
                      <th className="font-medium pb-2">Component</th>
                      <th className="font-medium pb-2 text-right">Weight</th>
                      <th className="font-medium pb-2 text-right">Scored</th>
                    </tr>
                  </thead>
                  <tbody>
                    {example.score.components.map((c) => (
                      <tr key={c.key} className="border-t border-[var(--color-outline)]">
                        <td className="py-2 pr-3 text-[var(--color-on-surface)]">
                          {c.label}
                          <span className="block text-2xs text-[var(--color-on-surface-variant)]">{c.detail}</span>
                        </td>
                        <td className="py-2 text-right tabular-nums text-[var(--color-on-surface-variant)]">
                          {c.weight}%
                        </td>
                        <td className="py-2 text-right tabular-nums text-[var(--color-on-surface)]">
                          {Math.round(c.score)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-2sm text-[var(--color-on-surface-variant)] mt-4 leading-relaxed border-t border-[var(--color-outline)] pt-4">
                  {example.score.explanation}
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Distribution */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-2">
              How scores are distributed today
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
              Across the {s.corridorsScored} corridors with a genuine comparison behind them. A score is not a
              prediction — it says where today sits against what we have recorded, not where rates go next.
            </p>
            <div className="space-y-2">
              {BAND_ORDER.map((band) => {
                const n = s.bands[band];
                return (
                  <div key={band} className="flex items-center gap-3">
                    <span className="text-2sm text-[var(--color-on-surface-variant)] w-52 shrink-0">
                      {BAND_LABELS[band]}
                    </span>
                    <span
                      className="h-5 rounded bg-[var(--color-primary)]/70 shrink-0"
                      style={{ width: `${Math.max(2, (n / maxBand) * 100)}%` }}
                      aria-hidden="true"
                    />
                    <span className="text-2sm font-semibold text-[var(--color-on-surface)] tabular-nums">{n}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Limits — its own anchor, because this is the part a careful citation needs. */}
      <section id="limitations" className="py-12 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-4">What SendScore is not</h2>
            <div className="space-y-4 text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                <strong className="text-[var(--color-on-surface)]">It is not a forecast.</strong> Every component is
                backward-looking. A &ldquo;poor&rdquo; score means today is weak against the past 90 days, not that
                waiting will be better.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">It is not available everywhere.</strong> Of{" "}
                {s.corridorsWithAnyScore.toLocaleString("en-US")} corridors carrying a score,{" "}
                {s.singleProviderReadings.toLocaleString("en-US")} have only one provider quoting. There is no field to
                beat on those, so the score is clamped to the neutral band and labelled a single-provider reading rather
                than presented as a comparison. The distribution above excludes them — including them would publish the
                clamp as though it were a finding about exchange rates.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">It needs history.</strong> Below seven days of
                recorded rates no score is produced at all. Below 30 days it is marked low confidence and says so on the
                page. All {s.corridorsScored} corridors in the distribution above are high confidence.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">It says nothing about speed or safety.</strong>{" "}
                Delivery time is not a component. Neither is regulatory standing — see{" "}
                <Link href="/how-we-review" className="text-[var(--color-primary)] hover:underline">
                  how we review providers
                </Link>{" "}
                for those.
              </p>
              <p>
                SendScore answers <em>when</em>. For <em>who</em>, the{" "}
                <Link href="/provider-consistency" className="text-[var(--color-primary)] hover:underline">
                  Provider Consistency Index
                </Link>{" "}
                measures how often each provider actually delivers the most, and the{" "}
                <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
                  Remittance Cost Index
                </Link>{" "}
                ranks them by true total cost. Scores appear on each{" "}
                <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
                  corridor page
                </Link>
                , and our{" "}
                <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
                  site-wide methodology
                </Link>{" "}
                covers data collection. Every dataset we publish is indexed on{" "}
                <Link href="/research" className="text-[var(--color-primary)] hover:underline">
                  the research hub
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Defining the metric as a named thing, so it can be referenced. Dataset
          rather than a LocalBusiness subclass, and no aggregateRating claimed. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "SendMoneyCompare SendScore",
            description:
              "A 0-100 rating of whether today is a good day to send money on a given currency corridor, computed from recorded provider rates across four weighted components: position in the 90-day range (40%), versus the 30-day average (25%), best provider versus the field (20%), and week-on-week trend (15%).",
            url: "https://sendmoneycompare.com/sendscore",
            license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            creator: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              url: "https://sendmoneycompare.com",
            },
            dateModified: s.dataAsOf,
            variableMeasured: SENDSCORE_WEIGHTS.map((c) => c.label),
          }),
        }}
      />
    </>
  );
}
