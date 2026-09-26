/**
 * Per-bank international-transfer-cost page.
 *
 * Marketing surface for the Bank Comparison play: captures branded
 * high-intent transactional queries ("hsbc international transfer fee",
 * "wells fargo wire transfer cost", "lloyds international payment")
 * with live data showing how much the bank costs customers vs the best
 * digital provider on the same corridor and amount.
 *
 * The play depends on unique data: sendmoneycompare is the only site
 * continuously scraping both bank and digital-provider quotes on the
 * same corridor for the same amount, so the "you lose X on Y transfer"
 * claim is verifiable and freshly dated — exactly the E-E-A-T signal
 * Google rewards.
 */
import Image from "next/image";
import { robotsFor } from "@/lib/seo-indexing";
import { getDataUpdatedISO, getDataUpdatedInstant } from "@/lib/data-freshness";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AlertCircle, TrendingDown } from "lucide-react";
import Container from "@/components/Container";
import { corridorPageRenders } from "@/lib/route-map";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import Breadcrumb from "@/components/Breadcrumb";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import CrossLinks from "@/components/CrossLinks";
import LiveTimestamp from "@/components/LiveTimestamp";
import { getGoUrl } from "@/lib/affiliate";
import {
  PILOT_BANKS,
  getBankMeta,
  getBankCorridorQuotes,
  getBankAggregateStats,
  getAllPilotBankSlugs,
  INDEXED_BANK_SLUGS,
} from "@/lib/bank-comparisons";
import { assignTableAmounts } from "@/lib/table-amounts";
import { getCorridorSlug } from "@/data/corridors";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import { providers, getProviderName, currencies } from "@/data/providers";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { seoTitle, seoDescription } from "@/lib/seo-title";
import { providerLogo } from "@/lib/provider-logo";
import { getBankEditorial } from "@/data/bank-editorial";
import { renderDataTokens } from "@/lib/ratings-tokens";
import { PageByline } from "@/components/PageByline";

/** Distinct table amount per bank page — see table-amounts.ts. */
const BANK_TABLE_AMOUNTS = assignTableAmounts(getAllPilotBankSlugs(), (b) => b, () => "bank", "banks");

// Revalidate every 6 hours to match scraper cadence — these pages are
// only valuable while the data is fresh.
export const revalidate = 21600;

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

// Without this, an unknown slug is rendered on demand and notFound() comes back
// as HTTP 200 carrying `robots: index, follow` — a soft 404, and an unbounded
// indexable URL space of them. Verified 2026-09-03: /banks/zzz-bogus answered 200
// while /send-money and /compare, which already set this, answered a correct 404.
// Every slug in the sitemap and seo-indexing allowlists is covered by
// generateStaticParams (the pilot bank list), so nothing that should render starts 404ing.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPilotBankSlugs().map((slug) => ({ slug }));
}

function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const bank = getBankMeta(slug);
  if (!bank) return {};
  const stats = getBankAggregateStats(slug);
  const year = new Date().getFullYear();
  const lossLine =
    stats.largestLossExample && stats.largestLossExample.lossPct > 0
      ? ` Real example: on ${getCurrencySymbol(stats.largestLossExample.sendCurrency)}${stats.largestLossExample.sendAmount.toLocaleString()} ${bank.name} delivers ${stats.largestLossExample.lossPct.toFixed(1)}% less than ${stats.largestLossExample.bestDigitalProvider}.`
      : "";
  const description = `${bank.name} international transfer fees (${year}) — live data scraped daily from ${stats.corridorCount} currency corridors.${lossLine} Compare against Wise, Remitly and 30+ specialist providers.`;
  return {
    // bank.headline is the visible <h1>; seoTitle keeps the <title> distinct
    // and inside 70 chars (chase/hsbc were 79 and 74).
    title: seoTitle(bank.headline),
    description: seoDescription(description),
    keywords: `${bank.name} international transfer fee, ${bank.name} wire transfer cost, ${bank.name} exchange rate, ${bank.name} vs wise, send money abroad ${bank.name}`,
    openGraph: {
      title: bank.headline,
      description,
      type: "article",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title: bank.headline, description },
    alternates: getAlternates(`banks/${slug}`, locale),
    // Noindex zero-traction pilots (off-sitemap) to match the sitemap and
    // avoid the index:yes/sitemap:no contradiction. Page still renders.
    ...(locale === "en" && !INDEXED_BANK_SLUGS.has(slug) && { robots: { index: false, follow: true } }),
    // 2026-09-20: indexability is measured, not assumed — robotsFor()
    // consults the duplication-derived allowlist. See
    // scripts/build-indexable-routes.ts.
    robots: robotsFor(`/banks/${slug}`),
  };
}

export default async function BankPage({ params }: Props) {
  const { slug } = await params;
  const bank = getBankMeta(slug);
  if (!bank) notFound();

  const quotes = getBankCorridorQuotes(slug);
  const stats = getBankAggregateStats(slug);
  const editorial = getBankEditorial(slug);
  const recommendedProvider = providers.find((p) => p.slug === bank.recommendedAlternative.slug);
  const dataFreshness = getDataUpdatedISO();

  // Pick the most "headline-worthy" loss row for the hero callout
  const heroExample = stats.largestLossExample;

  // Group quotes by corridor for the table (show one row per corridor, default $1000 amount)
  const corridorMap = new Map<string, ReturnType<typeof getBankCorridorQuotes>[number]>();
  for (const q of quotes) {
    const key = `${q.sendCurrency}-${q.receiveCurrency}`;
    const existing = corridorMap.get(key);
    // Prefer $1000 (or equivalent) for the headline display row
    if (!existing || Math.abs(q.sendAmount - 1000) < Math.abs(existing.sendAmount - 1000)) {
      corridorMap.set(key, q);
    }
  }
  const corridorRows = [...corridorMap.values()].sort((a, b) => b.lossPct - a.lossPct);

  // JSON-LD: Article + AggregateRating signals + named entities
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: bank.headline,
    datePublished: dataFreshness,
    dateModified: dataFreshness,
    author: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      url: "https://sendmoneycompare.com",
    },
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      url: "https://sendmoneycompare.com",
    },
    about: {
      "@type": "BankOrCreditUnion",
      name: bank.legalName,
      foundingDate: String(bank.founded),
      address: { "@type": "PostalAddress", addressCountry: bank.countryCode },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "Banks", href: "/banks" },
          { label: bank.name },
        ]}
      />

      {/* ─── Hero ─── */}
      <section className="py-12 bg-gradient-to-b from-[var(--color-primary-surface)] to-[var(--color-surface)]">
        <Container>
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 bg-white rounded-2xl border border-[var(--color-outline)] p-2 shrink-0">
                <Image
                  src={providerLogo(bank.slug)}
                  alt={`${bank.name} logo`}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight">
                  {bank.headline}
                </h1>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">
                  {bank.country} · Founded {bank.founded} · Live data
                  {" · "}
                  <LiveTimestamp iso={getDataUpdatedInstant()} />
                </p>
              </div>
            </div>

            {/* The dollar-and-cents hero callout — the marketing hook */}
            {heroExample && (
              <Card className="border-l-4 border-l-[var(--color-error)] bg-white">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[var(--color-error)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-1">
                      On a real {getCurrencySymbol(heroExample.sendCurrency)}
                      {heroExample.sendAmount.toLocaleString()} transfer to{" "}
                      {heroExample.receiveCurrency}
                    </p>
                    <p className="text-h3 font-medium text-[var(--color-on-surface)]">
                      {bank.name} loses you {getCurrencySymbol(heroExample.receiveCurrency)}
                      {heroExample.lossInReceiveCurrency.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ({heroExample.lossPct.toFixed(2)}%)
                    </p>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">
                      vs {heroExample.bestDigitalProvider}, the cheapest app on the same quote.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {recommendedProvider && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <PrimaryButton
                  href={getGoUrl(recommendedProvider.slug, { clickref: `banks-${bank.slug}-hero` })}
                  external
                  size="lg"
                >
                  Try {recommendedProvider.name} instead{" "}
                  <ArrowRight className="inline w-4 h-4 ml-1" />
                </PrimaryButton>
                {/* Was the hand-typed "typically saves $25-80" label; the measured
                    median below is ours, per bank, and cannot drift. */}
                <p className="text-2sm text-[var(--color-on-surface-variant)]">
                  {/* BANK_MEDIAN is the median payout shortfall against the best
                      digital quote (medianLossPct), not an all-in cost. */}
                  {bank.name}&rsquo;s median shortfall against the best app in our data: {renderDataTokens(`{{BANK_MEDIAN:${bank.slug}}}`)}.
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      <AffiliateDisclosure />

      {/* ─── How the bank's fees work ─── */}
      <section className="py-12 bg-[var(--color-surface)]">
        <Container>
          <div className="max-w-3xl">
            {/* Named editor + review date — flagged as missing on the two
                brief-listed bank pages by the second validation pass. */}
            <div className="mb-6">
              <PageByline updated={dataFreshness.slice(0, 10)} cadence={null} />
            </div>
            <h2 className="text-h3 font-normal text-[var(--color-on-surface)] mb-4">
              How {bank.name} charges for international transfers
            </h2>
            {editorial ? (
              <p
                className="text-md text-[var(--color-on-surface)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.theProduct) }}
              />
            ) : (
              <p className="text-md text-[var(--color-on-surface)] leading-relaxed">
                {bank.productNote}
              </p>
            )}
            {bank.sourcePage && (
              <p className="text-2sm text-[var(--color-on-surface-variant)] mt-4">
                Source:{" "}
                <a
                  href={bank.sourcePage}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  {bank.name} international transfers
                </a>
                {" · "}
                quotes: Wise comparison feed.
              </p>
            )}
            {editorial && (
              <div className="mt-8 space-y-6">
                <p
                  className="text-md text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.measuredRecord) }}
                />
                <div>
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                    When a {bank.name} wire genuinely makes sense
                  </h3>
                  <p
                    className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.whenItMakesSense) }}
                  />
                </div>
                <div>
                  <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                    Before you send
                  </h3>
                  <p
                    className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.watchOut) }}
                  />
                  {editorial.namedWins && (
                    <p
                      className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mt-3 pt-3 border-t border-[var(--color-outline)]"
                      dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.namedWins) }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ─── Live comparison table ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-5xl">
            <h2 className="text-h3 font-normal text-[var(--color-on-surface)] mb-2">
              {bank.name} vs cheapest digital provider — by corridor
            </h2>
            <div className="mb-8" />

            {corridorRows.length === 0 ? (
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                No live comparison data is currently available for {bank.name}. The scraped quote
                feed updates every 6 hours — please check back.
              </p>
            ) : (
              <Card>
                <div className="overflow-x-auto -mx-6 -my-6">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
                      <tr>
                        <th className="text-left p-4 font-medium text-[var(--color-on-surface-variant)]">
                          Corridor
                        </th>
                        <th className="text-right p-4 font-medium text-[var(--color-on-surface-variant)]">
                          Sending
                        </th>
                        <th className="text-right p-4 font-medium text-[var(--color-on-surface-variant)]">
                          {bank.name} delivers
                        </th>
                        <th className="text-right p-4 font-medium text-[var(--color-on-surface-variant)]">
                          Best digital delivers
                        </th>
                        <th className="text-right p-4 font-medium text-[var(--color-on-surface-variant)]">
                          You lose
                        </th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {corridorRows.map((q) => {
                        const corridorSlug = getCorridorSlug(q.sendCurrency, q.receiveCurrency);
                        return (
                          <tr
                            key={`${q.sendCurrency}-${q.receiveCurrency}`}
                            className="border-b border-[var(--color-outline)] hover:bg-[var(--color-surface-dim)]"
                          >
                            <td className="p-4 font-medium">
                              {q.sendCurrency} → {q.receiveCurrency}
                            </td>
                            <td className="p-4 text-right">
                              {getCurrencySymbol(q.sendCurrency)}
                              {q.sendAmount.toLocaleString()}
                            </td>
                            <td className="p-4 text-right">
                              {getCurrencySymbol(q.receiveCurrency)}
                              {q.bankReceive.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="p-4 text-right text-[var(--color-on-surface-variant)]">
                              <div>
                                {getCurrencySymbol(q.receiveCurrency)}
                                {q.bestDigitalReceive.toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}
                              </div>
                              <div className="text-2xs">via {q.bestDigitalProvider}</div>
                            </td>
                            <td className="p-4 text-right">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-700 text-2xs font-medium">
                                <TrendingDown className="w-3 h-3" />
                                {getCurrencySymbol(q.receiveCurrency)}
                                {q.lossInReceiveCurrency.toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}{" "}
                                · {q.lossPct.toFixed(1)}%
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {corridorPageRenders(corridorSlug) && (
                                <Link
                                  href={`/send-money/${corridorSlug}`}
                                  className="text-[var(--color-primary)] text-2sm hover:underline whitespace-nowrap"
                                >
                                  Compare all →
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {stats.medianLossPct !== 0 && (
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-6">
                {/* Median, not mean — CLAUDE.md: a single outlier corridor
                    distorts an average across this few rows. HSBC's mean reads
                    2.20% against a 1.36% median because one AUD->THB row sits at
                    31.5%. */}
                Median {bank.name} shortfall across {stats.corridorCount} live corridors:{" "}
                <strong>{stats.medianLossPct.toFixed(2)}% less</strong> than the best app on each
                {stats.winCount > 0
                  ? ` — though on ${stats.winCount} of the corridors we compare, ${bank.name} matched or beat every digital provider we track.`
                  : "."}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ─── Live alternative on the bank's worst corridor ───
           The page spends its length proving this bank loses the reader money,
           then offered no way to act on it: /banks/* carried a single /go link
           and no comparison at all, while /iban and /swift-codes both carry a
           full provider block. corridorRows is already sorted by loss, so row 0
           is the corridor where the argument is strongest. */}
      {corridorRows.length > 0 && (
        <section className="py-12 bg-[var(--color-surface)]">
          <Container>
            <div className="max-w-3xl">
              <InlineProviderQuotes
                from={corridorRows[0].sendCurrency}
                to={corridorRows[0].receiveCurrency}
                amount={BANK_TABLE_AMOUNTS.get(bank.slug) ?? 1075}
                heading={`Live ${corridorRows[0].sendCurrency} → ${corridorRows[0].receiveCurrency} rates — what ${bank.name} is costing you`}
                source={`bank:${slug}`}
                // The page already carries the partner card; a second one here
                // repeated it (2026-09-25).
                crossSell={false}
              />
            </div>
          </Container>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section className="py-12 bg-[var(--color-surface)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Common questions about {bank.name} international transfers
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {/* Answered from this bank's own measured quotes (2026-09-25). The
                  five fixed answers these replaced read the same on every bank
                  page bar the name, and carried hand-typed fee and margin
                  ranges we did not measure. */}
              {[
                {
                  q: `How does ${bank.name} compare with the best digital quote?`,
                  a: renderDataTokens(`{{BANK_MEDIAN:${bank.slug}}}: ${bank.name}'s median payout shortfall against the best digital alternative, over {{BANK_CORRIDORS:${bank.slug}}} priced corridors. Its worst: {{BANK_WORST:${bank.slug}}}.`),
                },
                {
                  q: `Is ${bank.name} ever the cheapest option for international transfers?`,
                  a: (() => {
                    const wins = renderDataTokens(`{{BANK_WINS:${bank.slug}}}`);
                    const record = wins === "0"
                      ? renderDataTokens(`Not once in {{BANK_CORRIDORS:${bank.slug}}} priced corridors did ${bank.name} beat every app; {{BANK_WORST:${bank.slug}}} is its widest gap.`)
                      : renderDataTokens(`In ${wins} of the corridor-and-amount combinations we price, ${bank.name} beat every digital provider: {{BANK_WIN_LIST:${bank.slug}}}.`);
                    return bank.slug === "hsbc"
                      ? `${record} HSBC Premier and Advance customers should also price Global Money, which HSBC offers without a transfer fee on many currency pairs.`
                      : record;
                  })(),
                },
                ...(bank.slug === "hsbc" ? [{
                  q: `Why don't ${bank.name} customers just switch?`,
                  a: `For Premier and Advance account holders, staying isn't just inertia — Global Money genuinely offers free transfers on many currency pairs, competitive with specialist pricing. For a standard HSBC account, the reasons are the same as at most banks: the FX margin is baked into the rate rather than shown as a fee, transfers are bundled with an existing relationship, and recipient-side requirements historically meant the sender's own bank was the path of least resistance.`,
                }] : []),
              ].map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 9l-7 7-7-7"
                      />
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

      {/* ─── Cross-links ─── */}
      <CrossLinks
        sections={[
          {
            title: "Other banks compared",
            links: Object.values(PILOT_BANKS)
              .filter((b) => b.slug !== bank.slug)
              // Names only: the same four "<bank> international transfers"
              // labels, in the same order, closed every bank page.
              .map((b) => ({ href: `/banks/${b.slug}`, label: b.name })),
          },
          {
            title: `${bank.name}'s widest gaps`,
            links: corridorRows.slice(0, 5).map((q) => {
              const cs = getCorridorSlug(q.sendCurrency, q.receiveCurrency);
              return {
                href: corridorPageRenders(cs) ? `/send-money/${cs}` : "/send-money",
                label: `${q.sendCurrency} → ${q.receiveCurrency}`,
              };
            }),
          },
          // "Better alternatives" was a fixed five-link list (the same three
          // reviews and two guides on every bank page); removed 2026-09-25. The
          // table names the provider that beats this bank on each corridor.
        ]}
      />

      {/* The closing "Compare {bank} against every provider" box linked to
          /send-money and read the same on every bank page; removed 2026-09-25.
          The page-end partner module and the table's own links remain. */}
    </>
  );
}
