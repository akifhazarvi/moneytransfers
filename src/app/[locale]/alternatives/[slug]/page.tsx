/**
 * /alternatives/[slug] — "alternatives to X", priced on shared corridors.
 *
 * ALLOWLISTED, `dynamicParams = false`. Eight curated providers, not one per
 * scraped provider slug: the June 2026 pruning exists because combinatorial
 * programmatic routes are what the Mar 20 2026 scaled-content suppression hit.
 * The gate is ALTERNATIVES_SLUGS in provider-alternatives.ts, mirrored by
 * `alternativesPageRenders` in route-map.ts — change both in one commit.
 *
 * Every figure comes from provider-alternatives.ts, which compares two
 * providers only on the corridors BOTH quote at $1,000, and reports medians.
 * Nothing on this page is hand-typed.
 */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import DataProvenance from "@/components/DataProvenance";
import { seoDescription, fitTitle } from "@/lib/seo-title";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { formatLocalDate } from "@/lib/format-date";
import { providerLogo } from "@/lib/provider-logo";
import { companyPageRenders } from "@/lib/company-route";
import {
  PROVIDER_ALTERNATIVES,
  ALTERNATIVES_RENDERED_SLUGS,
  MIN_SHARED_CORRIDORS,
  type AlternativeRow,
  type AlternativesEntry,
} from "@/lib/provider-alternatives";
import { INDEX_AMOUNT } from "@/lib/remittance-cost-index";

const SITE_URL = "https://sendmoneycompare.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALTERNATIVES_RENDERED_SLUGS.map((slug) => ({ slug }));
}

/** Rows we put in the headline table: specialists only, cheaper than the subject.
 *  A bank that undercuts a transfer app on a handful of shared routes is a real
 *  measurement, but it is not what "alternatives to Remitly" means to a reader
 *  looking for a transfer service — the banks stay in the index, which is where
 *  a bank-vs-app comparison belongs. */
const headlineRows = (e: AlternativesEntry): AlternativeRow[] =>
  e.cheaper.filter((r) => r.kind === "specialist").slice(0, 8);

const pct = (n: number) => `${n.toFixed(2)}%`;
const money = (n: number) => `$${n.toFixed(2)}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const e = PROVIDER_ALTERNATIVES.get(slug);
  if (!e) return {};
  const rows = headlineRows(e);
  const top = rows[0];

  // `<title>` must differ from the <h1> ("Alternatives to X") and cap at 70.
  const title = fitTitle([
    `${e.name} Alternatives (2026): ${rows.length} Cheaper, Measured`,
    `${e.name} Alternatives: ${rows.length} Cheaper Options, Measured`,
    `${e.name} Alternatives — Cheaper Options Compared`,
  ]);

  const description = top
    ? `We priced ${e.name} against every provider quoting the same corridors. ${top.name} costs ${pct(top.costPct)} vs ${pct(top.subjectCostPct)} on ${top.sharedCorridors} shared routes — ${money(top.savingPerAmount)} per $1,000.`
    : `We priced ${e.name} against every provider quoting the same corridors, on ${e.corridors} routes at $${INDEX_AMOUNT}.`;

  return {
    title,
    description: seoDescription(description),
    alternates: getAlternates(`alternatives/${slug}`, locale),
    openGraph: {
      title,
      description: seoDescription(description),
      url: `${SITE_URL}/alternatives/${slug}`,
      images: DEFAULT_OG_IMAGES,
    },
  };
}

function ProviderCell({ row }: { row: AlternativeRow }) {
  // providerLogo(), never `/logos/${slug}.png` — a missing source makes Next's
  // image optimizer answer HTTP 400. Many rows here are scraped slugs with no
  // asset behind them, so this resolves to the placeholder instead.
  const logo = providerLogo(row.slug);
  const linkable = companyPageRenders(row.slug);
  const label = (
    <span className="inline-flex items-center gap-2 min-w-0">
      <Image src={logo} alt="" width={24} height={24} className="w-6 h-6 rounded object-contain bg-white shrink-0" />
      <span className="truncate font-medium">{row.name}</span>
    </span>
  );
  // Never interpolate a slug into an href — ask the route gate, drop the link
  // when the answer is no.
  return linkable ? (
    <Link href={`/companies/${row.slug}`} className="text-[var(--color-primary)] hover:underline">
      {label}
    </Link>
  ) : (
    label
  );
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const e = PROVIDER_ALTERNATIVES.get(slug);
  if (!e) notFound();

  const rows = headlineRows(e);
  const top = rows[0];
  const beaten = e.pricier.filter((r) => r.kind === "specialist").slice(0, 5);
  const asOf = formatLocalDate(e.dataAsOf);
  const unlinked = rows.filter((r) => !companyPageRenders(r.slug));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Cheaper alternatives to ${e.name}`,
    description: `Providers measured cheaper than ${e.name} on the corridors both quote at $${INDEX_AMOUNT}, by median true cost.`,
    numberOfItems: rows.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: rows.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.name,
      ...(companyPageRenders(r.slug) ? { url: `${SITE_URL}/companies/${r.slug}` } : {}),
    })),
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/alternatives/${slug}`,
    name: `Alternatives to ${e.name}`,
    url: `${SITE_URL}/alternatives/${slug}`,
    dateModified: e.dataAsOf,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: { "@id": `${SITE_URL}/alternatives/${slug}#list` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...itemList, "@id": `${SITE_URL}/alternatives/${slug}#list` }) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      {/* Answer first. A reader and a retrieval system both want the finding in
          the opening sentence, with the sample size attached to it. */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-14 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              Measured from live quotes · <time dateTime={e.dataAsOf}>{asOf}</time>
            </span>
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              Alternatives to {e.name}
            </h1>
            {top ? (
              <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 leading-relaxed">
                We price {e.name} against every provider that quotes the same corridors. Across the{" "}
                <strong>{e.corridors} corridors</strong> we hold a ${INDEX_AMOUNT.toLocaleString("en-US")} quote for it,{" "}
                {e.name}&rsquo;s median true cost is <strong>{pct(e.costPct)}</strong> — fee and exchange-rate markup
                combined. <strong>{rows.length}</strong> specialist{rows.length === 1 ? "" : "s"} come out cheaper on the
                routes they share with it. The largest gap is <strong>{top.name}</strong>, at {pct(top.costPct)} against{" "}
                {e.name}&rsquo;s {pct(top.subjectCostPct)} on the {top.sharedCorridors} corridors both quote — about{" "}
                <strong>{money(top.savingPerAmount)} per ${INDEX_AMOUNT.toLocaleString("en-US")}</strong> sent, and
                cheaper on {top.winRatePct}% of those corridors.
              </p>
            ) : (
              <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 leading-relaxed">
                We price {e.name} against every provider that quotes the same corridors. Across the {e.corridors}{" "}
                corridors we hold a ${INDEX_AMOUNT.toLocaleString("en-US")} quote for it, {e.name}&rsquo;s median true
                cost is <strong>{pct(e.costPct)}</strong>. No provider sharing at least {MIN_SHARED_CORRIDORS} of those
                corridors is measurably cheaper — on our data, {e.name} is the one to beat.
              </p>
            )}
          </div>
        </Container>
      </section>

      {rows.length > 0 && (
        <section className="py-12 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-3">
                Cheaper than {e.name}, on the corridors both quote
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
                Each row is a head-to-head, not a league table. &ldquo;Shared&rdquo; is the number of corridors we hold a
                ${INDEX_AMOUNT.toLocaleString("en-US")} quote for both providers on; the two cost columns are medians
                across exactly those corridors, so a provider is never credited for routes it does not serve. Win rate is
                how often it actually came out cheaper — a large saving with a win rate near 50% means a few routes are
                carrying it, not a consistent edge.
              </p>

              <div className="overflow-x-auto rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)]">
                <table className="w-full text-sm bg-[var(--color-surface)]">
                  <caption className="sr-only">
                    Providers measured cheaper than {e.name} on shared corridors at $
                    {INDEX_AMOUNT.toLocaleString("en-US")}, data as of {asOf}
                  </caption>
                  <thead>
                    <tr className="bg-[var(--color-surface-dim)] text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                      <th scope="col" className="text-left font-medium px-4 py-3">Provider</th>
                      <th scope="col" className="text-right font-medium px-4 py-3">Shared</th>
                      <th scope="col" className="text-right font-medium px-4 py-3">Their cost</th>
                      <th scope="col" className="text-right font-medium px-4 py-3">{e.name}</th>
                      <th scope="col" className="text-right font-medium px-4 py-3">Saved / ${INDEX_AMOUNT.toLocaleString("en-US")}</th>
                      <th scope="col" className="text-right font-medium px-4 py-3">Win rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline)]">
                    {rows.map((r) => (
                      <tr key={r.slug}>
                        <th scope="row" className="text-left font-normal px-4 py-3"><ProviderCell row={r} /></th>
                        <td className="text-right px-4 py-3 tabular-nums text-[var(--color-on-surface-variant)]">{r.sharedCorridors}</td>
                        <td className="text-right px-4 py-3 tabular-nums font-semibold text-green-600">{pct(r.costPct)}</td>
                        <td className="text-right px-4 py-3 tabular-nums text-[var(--color-on-surface-variant)]">{pct(r.subjectCostPct)}</td>
                        <td className="text-right px-4 py-3 tabular-nums font-semibold">{money(r.savingPerAmount)}</td>
                        <td className="text-right px-4 py-3 tabular-nums text-[var(--color-on-surface-variant)]">{r.winRatePct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {unlinked.length > 0 && (
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-4 leading-relaxed">
                  {unlinked.map((r) => r.name).join(", ")}{" "}
                  {unlinked.length === 1 ? "appears" : "appear"} in our quote data but{" "}
                  {unlinked.length === 1 ? "does" : "do"} not yet have a full review on this site, so{" "}
                  {unlinked.length === 1 ? "it is" : "they are"} listed without a link.
                </p>
              )}

              <div className="mt-7">
                <Link
                  href="/send-money"
                  className="inline-flex items-center gap-2 bg-[var(--color-cta)] text-[var(--color-cta-text)] font-semibold rounded-full px-6 py-3 text-sm hover:bg-[var(--color-cta-hover)] transition-colors"
                >
                  Compare these live on your corridor
                </Link>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-3">
                  Medians describe the typical route, not yours. The cheapest provider on a given corridor on a given day
                  is the one that matters.
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {beaten.length > 0 && (
        <section className="py-12 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-3">
                Where {e.name} still wins
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-5 leading-relaxed">
                A page called &ldquo;alternatives&rdquo; that only lists what is cheaper is a sales page. These
                specialists are measurably <em>more</em> expensive than {e.name} on the corridors they share with it.
              </p>
              <ul className="space-y-2">
                {beaten.map((r) => (
                  <li key={r.slug} className="text-sm text-[var(--color-on-surface)] flex flex-wrap items-baseline gap-x-2">
                    <ProviderCell row={r} />
                    <span className="text-[var(--color-on-surface-variant)]">
                      {pct(r.costPct)} vs {e.name}&rsquo;s {pct(r.subjectCostPct)} on {r.sharedCorridors} shared corridors
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      <section className="py-12 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="methodology" className="text-2xl md:text-h2 font-bold text-[var(--color-on-surface)] mb-4">
              How these figures are calculated
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                True total cost is <code>(mid-market receive − actual receive) ÷ mid-market receive</code>, so it captures
                the transfer fee and the exchange-rate markup in one number. Quotes are collected from provider APIs and
                websites every six hours; these are the ones at ${INDEX_AMOUNT.toLocaleString("en-US")} in the send
                currency, collected {asOf}.
              </p>
              <p>
                <strong>Comparisons are restricted to shared corridors.</strong> Ranking providers by their site-wide
                average would compare corridor mixes rather than prices — one provider in our index is measured on 793
                corridors and another on 13. A provider sharing fewer than {MIN_SHARED_CORRIDORS} corridors with{" "}
                {e.name} is left out entirely rather than given a row built on a handful of routes.
              </p>
              <p>
                <strong>All figures are medians.</strong> The mean is distorted by corridors where our own mid-market
                benchmark is unreliable, which is enough to invert the order of two close providers.
              </p>
              <p>
                Providers are ranked only on what we measure — fee and FX cost. Account features, cash-pickup networks
                and delivery speed are not in this ranking. See the{" "}
                <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">full methodology</Link>{" "}
                and the{" "}
                <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
                  Remittance Cost Index
                </Link>
                .
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {companyPageRenders(e.slug) && (
                <Link href={`/companies/${e.slug}`} className="text-[var(--color-primary)] hover:underline">
                  Read our full {e.name} review
                </Link>
              )}
              <Link href="/alternatives" className="text-[var(--color-primary)] hover:underline">
                All provider alternatives
              </Link>
              <Link href="/compare" className="text-[var(--color-primary)] hover:underline">
                Head-to-head comparisons
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <DataProvenance
        dataAsOf={e.dataAsOf}
        computedFrom={`median true total cost at $${INDEX_AMOUNT.toLocaleString("en-US")}, restricted to corridors both providers quote (src/lib/provider-alternatives.ts)`}
        sources={[
          { label: "Remittance Cost Index", href: "/remittance-cost-index" },
          { label: "Methodology", href: "/methodology" },
        ]}
      />
    </>
  );
}
