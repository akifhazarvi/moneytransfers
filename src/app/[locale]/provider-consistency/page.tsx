import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { seoDescription } from "@/lib/seo-title";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { companyPageRenders } from "@/lib/route-map";
import { providerLogo, hasProviderLogo } from "@/lib/provider-logo";
import { formatLocalDate } from "@/lib/format-date";
import {
  CONSISTENCY_INDEX,
  CONSISTENCY_ROWS,
  TOP_LEADER,
  TOP_LEADER_SHARE,
  ROTATION_RATE,
  HIGH_HIT_RATE_SPECIALISTS,
  COSTLIEST_WHEN_LOSING,
  MIN_CORRIDORS_FOR_RATE_CLAIM,
} from "@/lib/consistency-index";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providerConsistency" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    keywords: t("metaKeywords"),
    alternates: getAlternates("provider-consistency", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/provider-consistency",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

const idx = CONSISTENCY_INDEX;
const dataAsOfLabel = formatLocalDate(idx.dataAsOf);
const CSV_URL = "/api/data/provider-consistency";

/** Shown in the main table. The tail is in the CSV rather than truncated silently. */
const TABLE_LIMIT = 20;

/** Providers ranked in the table but quoting too few corridors for a rate claim. */
const RANKED = CONSISTENCY_ROWS.slice(0, TABLE_LIMIT);

const nf = (n: number) => n.toLocaleString("en-US");

function ProviderCell({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      {hasProviderLogo(slug) && (
        <Image
          src={providerLogo(slug)}
          alt={`${name} logo`}
          width={28}
          height={28}
          className="rounded-full shrink-0 bg-white object-contain p-0.5 border border-[var(--color-outline)]/40"
        />
      )}
      <div className="min-w-0">
        {companyPageRenders(slug) ? (
          <Link
            href={`/companies/${slug}`}
            className="text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
          >
            {name}
          </Link>
        ) : (
          <span className="text-sm font-semibold text-[var(--color-on-surface)]">{name}</span>
        )}
      </div>
    </div>
  );
}

const GRID = "grid-cols-[40px_1fr_92px_96px_104px_104px]";

export default async function ProviderConsistencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Hero — the direct answer sits above the fold, in the first two
          sentences, because that is the passage a retrieval system quotes. */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-16 pb-14">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              Data refreshed <time dateTime={idx.dataAsOf}>{dataAsOfLabel}</time>
            </span>
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              Which provider is cheapest{" "}
              <span className="text-[var(--color-primary)]">most often</span>?
            </h1>
            <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 max-w-2xl mx-auto leading-relaxed">
              No provider is cheapest everywhere. Across{" "}
              <strong className="text-[var(--color-on-surface)]">{nf(idx.providerDayObservations)}</strong> provider-day
              observations on {idx.comparableCorridors} corridors,{" "}
              <strong className="text-[var(--color-on-surface)]">{TOP_LEADER.providerName}</strong> is the most frequent
              winner on {TOP_LEADER.corridorsLed} of them — {TOP_LEADER_SHARE}%, the largest share of any provider and
              nowhere near a majority. On {ROTATION_RATE}% of corridors, the provider that is cheapest today is not the
              one that usually wins.
            </p>
          </div>
        </Container>
      </section>

      {/* Key stats */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                label: "Provider-day observations",
                value: nf(idx.providerDayObservations),
                sub: `over ${idx.maxWindowDays} days`,
              },
              {
                label: "Corridors measured",
                value: `${idx.comparableCorridors}`,
                sub: `of ${nf(idx.pairsTracked)} pairs tracked`,
              },
              { label: "Providers ranked", value: `${CONSISTENCY_ROWS.length}`, sub: "30+ contested days each" },
              { label: "Corridors that rotate", value: `${ROTATION_RATE}%`, sub: "today's best ≠ usual best" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-h3 md:text-4xl font-bold text-[var(--color-primary)] tabular-nums">{stat.value}</div>
                <div className="text-2sm text-[var(--color-on-surface-variant)] mt-1">{stat.label}</div>
                <div className="text-2xs text-[var(--color-on-surface-muted)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Ranking */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-2">
              Provider Consistency Index — {idx.dataAsOf}
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
              Ranked by the number of corridors where the provider is the most frequent winner. A win only counts on a
              day when at least two providers quoted, so winning unopposed earns nothing. &ldquo;Loses by&rdquo; is the
              average shortfall against the day&rsquo;s winner — the cost of choosing that provider on a day it does not
              lead.
            </p>

            {/* Desktop */}
            <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl overflow-hidden shadow-[var(--shadow-sm)]">
              <div
                className={`grid ${GRID} gap-2 px-6 py-3 bg-[var(--color-surface-dim)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide`}
              >
                <span>#</span>
                <span>Provider</span>
                <span className="text-right">Leads</span>
                <span className="text-right">Of which</span>
                <span className="text-right">Days won</span>
                <span className="text-right">Loses by</span>
              </div>
              {RANKED.map((r, i) => (
                <div
                  key={r.providerSlug}
                  className={`grid ${GRID} gap-2 items-center px-6 py-3 border-t border-[var(--color-outline)] ${
                    i < 3 ? "bg-[var(--color-primary-surface)]/30" : ""
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${i < 3 ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}
                  >
                    {i + 1}
                  </span>
                  <ProviderCell slug={r.providerSlug} name={r.providerName} />
                  <span className="text-sm font-semibold text-[var(--color-on-surface)] text-right tabular-nums">
                    {r.corridorsLed}
                  </span>
                  <span className="text-sm text-[var(--color-on-surface-variant)] text-right tabular-nums">
                    {r.corridorsQuoted}
                  </span>
                  <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                    {r.winRate.toFixed(1)}%
                  </span>
                  <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                    {r.avgShortfallPct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {RANKED.map((r, i) => (
                <div
                  key={r.providerSlug}
                  className={`rounded-2xl border border-[var(--color-outline)] p-4 ${
                    i < 3 ? "bg-[var(--color-primary-surface)]/30" : "bg-[var(--color-surface)]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-lg font-bold w-7 ${i < 3 ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}
                    >
                      {i + 1}
                    </span>
                    <ProviderCell slug={r.providerSlug} name={r.providerName} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">Leads</div>
                      <div className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                        {r.corridorsLed}/{r.corridorsQuoted}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">Days won</div>
                      <div className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                        {r.winRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">Loses by</div>
                      <div className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                        {r.avgShortfallPct.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-2xs text-[var(--color-on-surface-muted)] mt-4">
              Showing the top {RANKED.length} of {CONSISTENCY_ROWS.length} ranked providers.{" "}
              <a href={CSV_URL} className="text-[var(--color-primary)] hover:underline">
                Download the full index as CSV
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* The finding that matters most */}
      <section className="py-10 bg-[var(--color-primary-surface)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-3">
              Breadth and hit rate are different things
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed">
              {TOP_LEADER.providerName} leads the most corridors, but only {TOP_LEADER.leadRate.toFixed(0)}% of the{" "}
              {TOP_LEADER.corridorsQuoted} it quotes on.
              {HIGH_HIT_RATE_SPECIALISTS.length > 0 && (
                <>
                  {" "}
                  {HIGH_HIT_RATE_SPECIALISTS.slice(0, 2).map((r, i) => (
                    <span key={r.providerSlug}>
                      {i > 0 && ", and "}
                      <strong className="text-[var(--color-on-surface)]">{r.providerName}</strong> quotes on only{" "}
                      {r.corridorsQuoted} corridors but leads {r.leadRate.toFixed(0)}% of them
                    </span>
                  ))}
                  . A table sorted by total wins names the broadest provider, not the one most likely to be cheapest on
                  the corridor you are actually sending on — which is why this index publishes both columns.
                </>
              )}
            </p>
          </div>
        </Container>
      </section>

      {/* Cost of choosing wrong */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-2">
              What it costs to pick a provider that does not lead
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-5 leading-relaxed">
              Average shortfall against the day&rsquo;s winner, among providers quoting on at least{" "}
              {MIN_CORRIDORS_FOR_RATE_CLAIM} corridors. A provider can lead rarely and still be a reasonable choice if
              it loses by very little; these are the ones where it costs real money.
            </p>
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl divide-y divide-[var(--color-outline)]">
              {COSTLIEST_WHEN_LOSING.map((r) => (
                <div key={r.providerSlug} className="flex items-center justify-between gap-4 px-5 py-3">
                  <ProviderCell slug={r.providerSlug} name={r.providerName} />
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                      −{r.avgShortfallPct.toFixed(2)}%
                    </div>
                    <div className="text-2xs text-[var(--color-on-surface-variant)]">
                      leads {r.leadRate.toFixed(0)}% of {r.corridorsQuoted} corridors
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mt-5 leading-relaxed">
              On a $1,000 transfer, a {COSTLIEST_WHEN_LOSING[0]?.avgShortfallPct.toFixed(2)}% shortfall is about $
              {((COSTLIEST_WHEN_LOSING[0]?.avgShortfallPct ?? 0) * 10).toFixed(0)} less reaching the recipient than the
              day&rsquo;s best provider would have delivered.
            </p>
          </div>
        </Container>
      </section>

      {/* Methodology — its own anchor so a citation can point at it. */}
      <section id="methodology" className="py-12 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-4">Methodology</h2>
            <div className="space-y-4 text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                <strong className="text-[var(--color-on-surface)]">What is measured.</strong> Every six hours we record
                what each provider would actually deliver to the recipient on each corridor we track. For each corridor
                and each day, the provider delivering the most is that day&rsquo;s winner. This index counts winners
                over the trailing {idx.maxWindowDays} days.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Contested days only.</strong> A day counts as evidence
                only when at least two providers quoted that corridor. Winning unopposed is not a win. That reduces{" "}
                {nf(idx.pairsTracked)} tracked currency pairs to {idx.comparableCorridors} with a genuine contested
                record — the rest carry a single provider, where no comparison exists.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Thresholds.</strong> A provider is ranked once it has
                quoted on 30 or more contested days. Claims about the <em>share</em> of corridors a provider leads are made only
                for providers quoting on at least {MIN_CORRIDORS_FOR_RATE_CLAIM} corridors, because a provider leading
                three of its five corridors would otherwise top a table sorted on hit rate.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Ties and gaps.</strong> Only one provider wins a day;
                where a provider does not quote on a day, that day is not counted against it. Coverage is therefore
                reported separately (&ldquo;of which&rdquo;) rather than folded into the win rate, so a provider that
                appears rarely and wins often is visible instead of averaged away.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Limitations.</strong> Amounts are the corridor&rsquo;s
                headline sample amount; a different amount can change the leader where fee structures differ. Quotes are
                the advertised rate at the moment of collection and exclude promotional first-transfer rates. Delivery
                speed is not measured and is not part of this index. Providers may be cheapest on corridors we do not
                yet track.
              </p>
              <p>
                The full per-provider table, including the {CONSISTENCY_ROWS.length - RANKED.length} providers below the
                displayed rows, is available as{" "}
                <a href={CSV_URL} className="text-[var(--color-primary)] hover:underline">
                  CSV
                </a>
                . Figures on this page and the &ldquo;usually cheapest&rdquo; line on each{" "}
                <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
                  corridor page
                </Link>{" "}
                are produced by the same calculation, so they cannot disagree. See also our{" "}
                <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
                  site-wide methodology
                </Link>{" "}
                and the{" "}
                <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
                  Remittance Cost Index
                </Link>
                , which ranks providers by cost rather than by how often they win.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Dataset JSON-LD. Service/Dataset rather than a LocalBusiness subclass —
          this page is a dataset, and FinancialService would require an address. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "SendMoneyCompare Provider Consistency Index",
            description: `How often each money transfer provider actually delivers the most money, measured across ${idx.providerDayObservations} provider-day observations on ${idx.comparableCorridors} currency corridors over ${idx.maxWindowDays} days.`,
            url: "https://sendmoneycompare.com/provider-consistency",
            license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            creator: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              url: "https://sendmoneycompare.com",
            },
            dateModified: idx.dataAsOf,
            variableMeasured: [
              "Corridors led",
              "Contested-day win rate",
              "Average shortfall against the day's winner",
            ],
            distribution: {
              "@type": "DataDownload",
              encodingFormat: "text/csv",
              contentUrl: `https://sendmoneycompare.com${CSV_URL}`,
            },
          }),
        }}
      />
    </>
  );
}
