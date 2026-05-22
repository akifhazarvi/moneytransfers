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
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AlertCircle, TrendingDown } from "lucide-react";
import Container from "@/components/Container";
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
} from "@/lib/bank-comparisons";
import { getCorridorSlug } from "@/data/corridors";
import { providers, getProviderName, currencies } from "@/data/providers";
import { getAlternates } from "@/lib/i18n-metadata";
import { statSync, readdirSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";

// Revalidate every 6 hours to match scraper cadence — these pages are
// only valuable while the data is fresh.
export const revalidate = 21600;

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return getAllPilotBankSlugs().map((slug) => ({ slug }));
}

function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}

function getDataFreshnessISO(): string {
  const VERCEL_SENTINEL = new Date("2018-10-20").getTime();
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  let latest = new Date(0);
  try {
    const files = readdirSync(scrapedDir);
    for (const file of files) {
      if (!/(quotes|rates)\.json$/.test(file)) continue;
      try {
        const mtime = statSync(join(scrapedDir, file)).mtime;
        if (mtime > latest) latest = mtime;
      } catch {
        /* skip */
      }
    }
  } catch {
    /* dir may be missing in dev */
  }
  if (latest.getTime() <= VERCEL_SENTINEL) {
    return process.env.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString();
  }
  return latest.toISOString();
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
    title: bank.headline,
    description,
    keywords: `${bank.name} international transfer fee, ${bank.name} wire transfer cost, ${bank.name} exchange rate, ${bank.name} vs wise, send money abroad ${bank.name}`,
    openGraph: {
      title: bank.headline,
      description,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: bank.headline, description },
    alternates: getAlternates(`banks/${slug}`, locale),
  };
}

export default async function BankPage({ params }: Props) {
  const { slug } = await params;
  const bank = getBankMeta(slug);
  if (!bank) notFound();

  const quotes = getBankCorridorQuotes(slug);
  const stats = getBankAggregateStats(slug);
  const recommendedProvider = providers.find((p) => p.slug === bank.recommendedAlternative.slug);
  const dataFreshness = getDataFreshnessISO();

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
                  src={`/logos/${bank.slug}.png`}
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
                  <LiveTimestamp iso={dataFreshness} />
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
                      vs {heroExample.bestDigitalProvider}, the cheapest digital provider on this
                      corridor on a like-for-like quote.
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
                <p className="text-2sm text-[var(--color-on-surface-variant)]">
                  {bank.recommendedAlternative.label}
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
            <h2 className="text-h3 font-normal text-[var(--color-on-surface)] mb-4">
              How {bank.name} charges for international transfers
            </h2>
            <p className="text-md text-[var(--color-on-surface)] leading-relaxed">
              {bank.productNote}
            </p>
            {bank.sourcePage && (
              <p className="text-2sm text-[var(--color-on-surface-variant)] mt-4">
                Source:{" "}
                <a
                  href={bank.sourcePage}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  {bank.name}'s own international transfer page
                </a>
                {" · "}
                Quotes scraped via the Wise comparison feed (a regulated, public price-comparison
                API).
              </p>
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
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">
              Each row is a real, comparable quote. {bank.name} delivery amount on the left, best
              digital provider on the right, dollar-and-cents difference in the middle. Updated
              every 6 hours.
            </p>

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
                              {corridorSlug && (
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

            {stats.averageLossPct > 0 && (
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-6">
                Across {stats.corridorCount} live corridors, {bank.name} customers receive an
                average of <strong>{stats.averageLossPct.toFixed(2)}% less</strong> than the
                cheapest digital provider on the same transfer.
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-12 bg-[var(--color-surface)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Common questions about {bank.name} international transfers
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {[
                {
                  q: `How much does ${bank.name} actually charge for an international transfer?`,
                  a: `${bank.name}'s total cost has two parts: a visible transfer fee, and an exchange-rate margin that is rarely disclosed up front. The transfer fee is whatever the bank publishes (£9–£40 typical for UK banks; $30–$50 for US banks). The exchange-rate margin is the hidden cost — typically 1.5–4% above the mid-market rate, which on a ${bank.primaryCurrency === "GBP" ? "£1,000" : "$1,000"} transfer can mean ${bank.primaryCurrency === "GBP" ? "£15–£45" : "$15–$45"} more in real-world cost than the headline fee suggests. The live comparison table above shows the actual end-to-end delivery amount, which is the only number that matters.`,
                },
                {
                  q: `Is ${bank.name} ever the cheapest option for international transfers?`,
                  a: `Rarely on a like-for-like basis. ${bank.name} is competitive when (a) the transfer is between two of the bank's own branches in different countries, (b) you have a Premier/Private banking relationship that waives fees and tightens the FX margin, or (c) the destination currency is one the bank holds in its own treasury (typically USD, EUR, GBP). For most retail customers sending money abroad, a specialist provider like ${bank.recommendedAlternative.label.split(" — ")[0]} will deliver a meaningfully larger receive amount — the live table above shows the exact difference per corridor.`,
                },
                {
                  q: `Why don't ${bank.name} customers just switch?`,
                  a: `Three reasons account for most retention: (1) most customers never see the FX margin because it's baked into the rate, so the "fee" appears smaller than it actually is; (2) banks bundle international transfers with checking accounts, payroll, and existing relationships; (3) recipient KYC at the foreign-currency end can require a bank account, which historically meant the sender's bank was the path of least resistance. Specialist providers like Wise, Remitly, and OFX have closed all three gaps — most now offer recipient delivery to bank accounts, mobile wallets, or cash pickup with no requirement to bank with the provider.`,
                },
                {
                  q: `Is the data on this page real?`,
                  a: `Yes. The quotes shown here are scraped continuously from the Wise comparison feed (a public, regulated price-comparison API that Wise publishes alongside its competitors), plus our own direct provider scrapes. Bank quotes are sourced from the same feed and represent live published rates at the time of scrape — the timestamp above the comparison table shows freshness. We do not edit, smooth, or selectively present the numbers. If a corridor isn't shown, it's because we don't have a live bank quote for that pair yet.`,
                },
                {
                  q: `What's the best alternative to ${bank.name} for sending money abroad?`,
                  a: `It depends on the corridor, amount, and delivery method. ${bank.recommendedAlternative.label.split(" — ")[0]} is the most consistent generalist — mid-market exchange rate, 0% markup, transparent fees, 70+ currencies supported. For amounts above ${bank.primaryCurrency === "GBP" ? "£10,000" : "$10,000"} OFX and CurrenciesDirect offer dedicated dealers and forward contracts. For cash pickup or mobile-wallet delivery to developing markets, Remitly, WorldRemit, and TapTap Send beat the banks on both price and delivery speed. The live comparison above shows the cheapest digital provider per corridor against ${bank.name}'s quote.`,
                },
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
              .map((b) => ({ href: `/banks/${b.slug}`, label: `${b.name} international transfers` })),
          },
          {
            title: "Top corridors for this bank",
            links: corridorRows.slice(0, 5).map((q) => {
              const cs = getCorridorSlug(q.sendCurrency, q.receiveCurrency);
              return {
                href: cs ? `/send-money/${cs}` : "/send-money",
                label: `${q.sendCurrency} → ${q.receiveCurrency} compared`,
              };
            }),
          },
          {
            title: "Better alternatives",
            links: [
              ...(recommendedProvider
                ? [{ href: `/companies/${recommendedProvider.slug}`, label: `${recommendedProvider.name} review` }]
                : []),
              { href: "/companies/remitly", label: "Remitly review" },
              { href: "/companies/ofx", label: "OFX review (for large transfers)" },
              { href: "/guides/cheapest-way-to-send-money-internationally", label: "Cheapest way to send money" },
              { href: "/guides/exchange-rate-markup-explained", label: "Exchange rate markup explained" },
            ],
          },
        ]}
      />

      {/* ─── CTA ─── */}
      <section className="py-14 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-h3 font-normal text-[var(--color-on-surface)] mb-3">
              Compare {bank.name} against every provider for your exact transfer
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Enter your amount and destination to see live quotes from {bank.name}, Wise, Remitly,
              OFX, and 30+ others — sorted by what your recipient actually gets.
            </p>
            <PrimaryButton href="/send-money" size="lg">
              Compare live quotes
            </PrimaryButton>
          </div>
        </Container>
      </section>
    </>
  );
}
