import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { providers } from "@/data/providers";

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;
import { getGoUrl } from "@/lib/affiliate";
import ProviderLink from "@/components/ProviderLink";
import { generateComparisonContent } from "@/lib/comparison-content";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ProsConsList from "@/components/ProsConsList";
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import { sanitizeHtml } from "@/lib/sanitize";
import { trustpilotIndex } from "@/lib/unified-quotes";
import { corridorToSlug } from "@/lib/rate-history";
import { getAlternates } from "@/lib/i18n-metadata";
import { getCompareCanonicalSlug, EDITORIAL_COMPARE_SLUGS } from "@/lib/compare-canonical";
import { SITEMAP_COMPARISON_SLUGS } from "@/lib/sitemap-allowlists";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ScrollTracker } from "@/components/ScrollTracker";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";

import { statSync } from "fs";
import { join } from "path";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

/** Returns the most recent mtime of scraped quote files as an ISO date string. */
function getDataFreshnessDate(): string {
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  const quoteFiles = ["provider-quotes.json", "mid-market-rates.json", "exchange-rates.json"];
  let latest = new Date(0);
  for (const file of quoteFiles) {
    try {
      const mtime = statSync(join(scrapedDir, file)).mtime;
      if (mtime > latest) latest = mtime;
    } catch { /* file may not exist */ }
  }
  return latest.getTime() > 0 ? latest.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
}

function parseSlug(slug: string) {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const a = providers.find((p) => p.slug === parts[0]);
  const b = providers.find((p) => p.slug === parts[1]);
  if (!a || !b) return null;
  return { a, b };
}

// Only pre-render former-editorial pairs + top provider pairs.
// All other valid pairs still work at runtime via ISR (dynamicParams = true by default).
const TOP_PROVIDERS = ["wise", "remitly", "western-union", "moneygram", "revolut", "xe", "worldremit", "paypal", "xoom"];

export async function generateStaticParams() {
  const params = new Set<string>();

  // 1. Former editorial slugs (high-traffic pairs — always pre-render)
  for (const slug of EDITORIAL_COMPARE_SLUGS) {
    params.add(slug);
  }

  // 2. Top provider pairs (high-traffic comparisons)
  for (let i = 0; i < TOP_PROVIDERS.length; i++) {
    for (let j = i + 1; j < TOP_PROVIDERS.length; j++) {
      const a = providers.find((p) => p.slug === TOP_PROVIDERS[i]);
      const b = providers.find((p) => p.slug === TOP_PROVIDERS[j]);
      if (a && b) params.add(`${a.slug}-vs-${b.slug}`);
    }
  }

  return Array.from(params).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;

  const pair = parseSlug(slug);
  if (!pair) return {};
  const { a, b } = pair;
  const year = new Date().getFullYear();

  // Uniform meta formula across the whole /compare category — same title and
  // description shape as paysend-vs-xoom, the page Google validated. Per-slug
  // custom titles and editorial article meta were removed when the category
  // was unified on the auto-generated template.
  const title = `${a.name} vs ${b.name} ${year}: Fees, Rates & Which Sends More Money`;
  const desc = `Compare ${a.name} vs ${b.name} fees, exchange rates, and delivery speed. We tested real transfers across 6 corridors — see which provider delivers more to your recipient in ${year}.`;

  // Comparison pages emit a canonical pointing at the editorial/GSC-winning
  // direction for the pair (or alphabetical if no signal yet). Without this,
  // /compare/wise-vs-ofx and /compare/ofx-vs-wise both self-canonical, and
  // Google clusters them and picks a canonical itself.
  // See src/lib/compare-canonical.ts.
  const canonicalSlug = getCompareCanonicalSlug(slug);

  // Thin-page guard: compare pages outside the sitemap allowlist were emitting
  // `index, follow` while sitting OFF the sitemap — the textbook contradictory
  // signal that contributed to the May 8 deindex collapse. Most combinatorial
  // pairs earn 0-2 impressions in 90d. Former editorial slugs keep the
  // indexability they had before the template unification; other pages must
  // EARN indexability by being promoted into SITEMAP_COMPARISON_SLUGS once
  // they show GSC signal.
  const isAllowlisted =
    SITEMAP_COMPARISON_SLUGS.has(canonicalSlug) || EDITORIAL_COMPARE_SLUGS.has(canonicalSlug);
  const shouldNoindexThin = !isAllowlisted;

  return {
    title,
    description: desc,
    alternates: getAlternates(`compare/${canonicalSlug}`, locale),
    // Comparison content is English-only; noindex locale variants to avoid diluting the English page
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    // Non-allowlisted pages: noindex to match sitemap absence
    ...(locale === "en" && shouldNoindexThin && { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${a.name} vs ${b.name}: Which Gives You More Money?`,
      description: `We tested ${a.name} and ${b.name} side by side across 6 corridors. See which delivers more in ${year}.`,
      // og:url must match the canonical, not the request slug. Bing and AI
      // crawlers treat og:url as a secondary canonical hint; mismatching it
      // with <link rel="canonical"> weakens both signals.
      url: `https://sendmoneycompare.com/compare/${canonicalSlug}`,
    },
  };
}

// ── Helper: get related comparisons for a provider pair ──

function getRelatedComparisons(a: (typeof providers)[number], b: (typeof providers)[number]) {
  const related: { slug: string; label: string }[] = [];
  for (const p of providers) {
    if (p.slug === a.slug || p.slug === b.slug) continue;
    // Route through getCompareCanonicalSlug so related-link slugs match the
    // editorial/GSC-winning direction, not just alphabetical. Otherwise
    // these links 301 on click and weaken the internal-link signal.
    const slugA = getCompareCanonicalSlug(`${a.slug}-vs-${p.slug}`);
    related.push({ slug: slugA, label: `${a.name} vs ${p.name}` });
    const slugB = getCompareCanonicalSlug(`${b.slug}-vs-${p.slug}`);
    related.push({ slug: slugB, label: `${b.name} vs ${p.name}` });
  }
  // Deduplicate and limit
  const seen = new Set<string>();
  return related.filter((r) => {
    if (seen.has(r.slug)) return false;
    seen.add(r.slug);
    return true;
  }).slice(0, 8);
}

// ── Default (auto-generated) comparison page ──

function DefaultComparison({
  a,
  b,
}: {
  a: (typeof providers)[number];
  b: (typeof providers)[number];
}) {
  const content = generateComparisonContent(a, b);
  const { corridorData, verdict, faqs, whenToUseA, whenToUseB, keyDifferences } = content;
  const relatedComparisons = getRelatedComparisons(a, b);
  const dataUpdatedDate = getDataFreshnessDate();

  const comparisonRows = [
    { label: "Overall rating", valueA: `${a.rating.toFixed(1)}/5 (${a.ratingLabel})`, valueB: `${b.rating.toFixed(1)}/5 (${b.ratingLabel})`, winner: a.rating > b.rating ? "a" : a.rating < b.rating ? "b" : "tie" },
    { label: "Fee structure", valueA: a.feeStructure, valueB: b.feeStructure, winner: "tie" as const },
    { label: "Exchange rate markup", valueA: a.exchangeRateMarkup, valueB: b.exchangeRateMarkup, winner: a.exchangeRateMarkup.includes("0%") ? "a" : b.exchangeRateMarkup.includes("0%") ? "b" : "tie" as const },
    { label: "Transfer speed", valueA: a.transferSpeed, valueB: b.transferSpeed, winner: "tie" as const },
    { label: "Supported countries", valueA: `${a.supportedCountries}+`, valueB: `${b.supportedCountries}+`, winner: a.supportedCountries > b.supportedCountries ? "a" : a.supportedCountries < b.supportedCountries ? "b" : "tie" },
    { label: "Supported currencies", valueA: `${a.supportedCurrencies}+`, valueB: `${b.supportedCurrencies}+`, winner: a.supportedCurrencies > b.supportedCurrencies ? "a" : a.supportedCurrencies < b.supportedCurrencies ? "b" : "tie" },
    { label: "Max transfer", valueA: a.maxTransfer ? `$${a.maxTransfer.toLocaleString()}` : "No limit", valueB: b.maxTransfer ? `$${b.maxTransfer.toLocaleString()}` : "No limit", winner: (a.maxTransfer || Infinity) > (b.maxTransfer || Infinity) ? "a" : (b.maxTransfer || Infinity) > (a.maxTransfer || Infinity) ? "b" : "tie" },
    { label: "Payment methods", valueA: a.paymentMethods.join(", "), valueB: b.paymentMethods.join(", "), winner: a.paymentMethods.length > b.paymentMethods.length ? "a" : a.paymentMethods.length < b.paymentMethods.length ? "b" : "tie" },
    { label: "Delivery methods", valueA: a.deliveryMethods.join(", "), valueB: b.deliveryMethods.join(", "), winner: a.deliveryMethods.length > b.deliveryMethods.length ? "a" : a.deliveryMethods.length < b.deliveryMethods.length ? "b" : "tie" },
    { label: "Regulators", valueA: a.regulators.join(", "), valueB: b.regulators.join(", "), winner: "tie" as const },
    { label: "Founded", valueA: String(a.founded), valueB: String(b.founded), winner: "tie" as const },
  ];

  // Middleware 301s any non-canonical /compare/X-vs-Y to the canonical
  // direction, so the slug we render here is always the canonical one.
  const canonicalUrl = `https://sendmoneycompare.com/compare/${a.slug}-vs-${b.slug}`;

  return (
    <>
      <ScrollTracker slug={`${a.slug}-vs-${b.slug}`} contentType="comparison" />
      {/* JSON-LD: WebPage with explicit canonical — reinforces <link rel="canonical">
          for AI grounding (Bing/Copilot/Perplexity use schema as a secondary signal). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": canonicalUrl,
            url: canonicalUrl,
            name: `${a.name} vs ${b.name}`,
            isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
            primaryImageOfPage: { "@type": "ImageObject", url: "https://sendmoneycompare.com/opengraph-image" },
            about: [
              { "@type": "FinancialService", name: a.name },
              { "@type": "FinancialService", name: b.name },
            ],
          }),
        }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
              { "@type": "ListItem", position: 2, name: "Compare", item: "https://sendmoneycompare.com/compare" },
              { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: canonicalUrl },
            ],
          }),
        }}
      />
      {/* FinancialService schema with AggregateRating for each provider */}
      {[a, b].map((provider) => (
        <script
          key={`fs-${provider.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "@id": `https://sendmoneycompare.com/companies/${provider.slug}#financialservice`,
              name: provider.name,
              description: provider.description,
              ...(provider.rating > 0 && trustpilotIndex[provider.slug]?.totalReviews && {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: Number(provider.rating.toFixed(1)),
                  bestRating: 5,
                  worstRating: 1,
                  ratingCount: trustpilotIndex[provider.slug].totalReviews,
                },
              }),
            }),
          }}
        />
      ))}
      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-[var(--color-primary)] transition-colors">Compare</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)] truncate">{a.name} vs {b.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-overline text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-3 py-1.5 rounded-full mb-5">
              Comparison
            </div>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-normal leading-[1.18] tracking-[-0.02em] text-[var(--color-on-surface)] mb-4">
              {a.name} vs {b.name}: Fees, Rates &amp; Speed Compared
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-2sm text-[var(--color-on-surface-variant)]">
              <span>SendMoneyCompare Editorial</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <time dateTime={dataUpdatedDate}>
                Updated {new Date(dataUpdatedDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <span>Data updated every 6 hours</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">Our methodology</Link>
            </div>
          </div>

          <div className="mb-6">
            <AffiliateDisclosure />
          </div>

          {/* Provider summary cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[a, b].map((provider) => (
              <Card key={provider.slug}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image src={provider.logo} alt={provider.name} width={56} height={56} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <h2 className="text-md font-medium text-[var(--color-on-surface)]">{provider.name}</h2>
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                  </div>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{provider.description}</p>
                <div className="flex gap-4 text-xs text-[var(--color-on-surface-variant)] mb-3">
                  <span>{provider.supportedCountries}+ countries</span>
                  <span>{provider.supportedCurrencies}+ currencies</span>
                  <span>Since {provider.founded}</span>
                </div>
                <div className="flex gap-3">
                  <Link href={`/companies/${provider.slug}`} className="text-2sm text-[var(--color-primary)] font-medium hover:underline">
                    Full review
                  </Link>
                  <ProviderLink
                    href={getGoUrl(provider.slug)}
                    provider={provider.slug}
                    source="compare_provider_card"
                    className="text-2sm text-[var(--color-primary)] font-medium hover:underline"
                  >
                    Visit site
                  </ProviderLink>
                </div>
              </Card>
            ))}
          </div>

          {/* Introduction — unique per pair */}
          <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
            {content.intro}
          </p>

          {/* Table of Contents */}
          <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 mb-8">
            <h2 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">In this comparison</h2>
            <ol className="space-y-1.5">
              <li><a href="#live-rates" className="text-2sm text-[var(--color-primary)] hover:underline">Live rate comparison across {corridorData.length} corridors</a></li>
              <li><a href="#key-differences" className="text-2sm text-[var(--color-primary)] hover:underline">Key differences</a></li>
              <li><a href="#feature-table" className="text-2sm text-[var(--color-primary)] hover:underline">Feature-by-feature comparison</a></li>
              <li><a href="#pros-cons" className="text-2sm text-[var(--color-primary)] hover:underline">Pros and cons</a></li>
              <li><a href="#when-to-use" className="text-2sm text-[var(--color-primary)] hover:underline">When to choose each provider</a></li>
              <li><a href="#verdict" className="text-2sm text-[var(--color-primary)] hover:underline">Verdict</a></li>
              <li><a href="#faqs" className="text-2sm text-[var(--color-primary)] hover:underline">Frequently asked questions</a></li>
            </ol>
          </div>

          {/* Live rate comparison across corridors */}
          <section id="live-rates" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Live comparison: {a.name} vs {b.name} across popular corridors
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              The table below shows how much the recipient receives when sending through {a.name} vs {b.name} on {corridorData.length} popular corridors. Data is refreshed every 6 hours from provider APIs and websites.
            </p>
            <div className="bg-[var(--color-primary-surface)] rounded-xl p-6">
              <div className="bg-[var(--color-surface)] rounded-lg overflow-hidden border border-[var(--color-outline)]">
                <table className="w-full text-2sm">
                  <thead className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">Corridor</th>
                      <th className="px-4 py-2.5 text-right text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">{a.name}</th>
                      <th className="px-4 py-2.5 text-right text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">{b.name}</th>
                      <th className="px-4 py-2.5 text-right text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline)]">
                    {corridorData.map((c) => {
                      const amtA = c.quoteA?.receiveAmount;
                      const amtB = c.quoteB?.receiveAmount;
                      const winnerName = c.winner === "a" ? a.name : c.winner === "b" ? b.name : c.winner === "tie" ? "Tie" : "N/A";

                      return (
                        <tr key={c.label}>
                          <td className="px-4 py-2.5 text-[var(--color-on-surface)]">
                            {c.label}
                            <span className="text-2xs text-[var(--color-on-surface-variant)] ml-1">
                              ({c.currencySymbol}{c.amount.toLocaleString()})
                            </span>
                          </td>
                          <td className={`px-4 py-2.5 text-right tabular-nums ${c.winner === "a" ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {amtA ? `${c.symbol}${amtA.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </td>
                          <td className={`px-4 py-2.5 text-right tabular-nums ${c.winner === "b" ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {amtB ? `${c.symbol}${amtB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-medium ${c.winner === "a" || c.winner === "b" ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                            {winnerName}
                            {c.savings ? ` (+${c.symbol}${c.savings.toFixed(2)})` : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-2xs text-[var(--color-on-surface-variant)] mt-2">
                Amounts shown are what the recipient receives. Based on current scraped data, updated every 6 hours.
              </p>
            </div>
          </section>

          {/* Key Differences */}
          <section id="key-differences" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Key differences between {a.name} and {b.name}
            </h2>
            <div className="space-y-3">
              {keyDifferences.map((diff, i) => (
                <div key={i} className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(diff) }}
                />
              ))}
            </div>
          </section>

          {/* Feature-by-feature comparison table */}
          <section id="feature-table" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              {a.name} vs {b.name}: Feature comparison
            </h2>
            <ComparisonTable headers={["Feature", a.name, b.name]}>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)] font-medium">{row.label}</td>
                  <td className={`px-4 py-3 text-sm ${row.winner === "a" ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                    {row.valueA}
                  </td>
                  <td className={`px-4 py-3 text-sm ${row.winner === "b" ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                    {row.valueB}
                  </td>
                </tr>
              ))}
            </ComparisonTable>
          </section>

          {/* Pros / Cons */}
          <section id="pros-cons" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Pros and cons
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[a, b].map((provider) => (
                <div key={provider.slug} className="space-y-4">
                  <h3 className="text-base font-medium text-[var(--color-on-surface)]">{provider.name}</h3>
                  <ProsConsList type="pros" items={provider.pros} />
                  <ProsConsList type="cons" items={provider.cons} />
                </div>
              ))}
            </div>
          </section>

          {/* When to choose each */}
          <section id="when-to-use" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              When to choose {a.name} vs {b.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <Image src={a.logo} alt={a.name} width={32} height={32} className="w-full h-full object-contain p-1" />
                  </div>
                  <h3 className="text-md font-medium text-[var(--color-on-surface)]">Choose {a.name} if:</h3>
                </div>
                <ul className="space-y-2">
                  {whenToUseA.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-2sm text-[var(--color-on-surface-variant)]">
                      <svg className="w-4 h-4 text-[var(--color-success-dark)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <Image src={b.logo} alt={b.name} width={32} height={32} className="w-full h-full object-contain p-1" />
                  </div>
                  <h3 className="text-md font-medium text-[var(--color-on-surface)]">Choose {b.name} if:</h3>
                </div>
                <ul className="space-y-2">
                  {whenToUseB.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-2sm text-[var(--color-on-surface-variant)]">
                      <svg className="w-4 h-4 text-[var(--color-success-dark)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Verdict */}
          <section id="verdict" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Verdict: {a.name} or {b.name}?
            </h2>
            <div className="space-y-4 mb-6">
              {/* Cost verdict */}
              <div className={`rounded-xl p-5 ${verdict.costWinner === "tie" ? "bg-[var(--color-surface-dim)]" : "bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/20"}`}>
                <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {verdict.costWinner === "tie" ? "Cost: Too close to call" : `Cost winner: ${verdict.costWinner === "a" ? a.name : b.name}`}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {verdict.costExplanation}
                </p>
              </div>
              {/* Speed verdict */}
              <div className={`rounded-xl p-5 ${verdict.speedWinner === "tie" ? "bg-[var(--color-surface-dim)]" : "bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20"}`}>
                <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {verdict.speedWinner === "tie" ? "Speed: Similar delivery times" : `Faster: ${verdict.speedWinner === "a" ? a.name : b.name}`}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {verdict.speedExplanation}
                </p>
              </div>
              {/* Coverage verdict */}
              <div className={`rounded-xl p-5 ${verdict.coverageWinner === "tie" ? "bg-[var(--color-surface-dim)]" : "bg-[var(--color-surface-dim)]"}`}>
                <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {verdict.coverageWinner === "tie" ? "Coverage: Comparable reach" : `Wider coverage: ${verdict.coverageWinner === "a" ? a.name : b.name}`}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {verdict.coverageExplanation}
                </p>
              </div>
            </div>
            {/* Overall */}
            <div className="bg-gradient-to-r from-[var(--color-primary-surface)] to-[var(--color-surface-dim)] rounded-xl p-6">
              <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-2">Bottom line</h3>
              <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed">
                {verdict.overallSummary}
              </p>
            </div>
          </section>

          {/* FAQs */}
          <section id="faqs" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-6">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
          </section>

          {/* CTA */}
          <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
            <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-4">Compare rates for your transfer</h3>
            <ComparisonWidget compact />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-[300px] shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Quick links */}
            {[a, b].map((provider) => (
              <Card key={provider.slug} className="!p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={provider.logo} alt={provider.name} width={56} height={56} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-on-surface)]">{provider.name}</p>
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/companies/${provider.slug}`}
                    className="text-xs text-[var(--color-primary)] font-medium hover:underline"
                  >
                    Full review
                  </Link>
                  <span className="text-[var(--color-outline)]">|</span>
                  <ProviderLink
                    href={getGoUrl(provider.slug)}
                    provider={provider.slug}
                    source="compare_provider_table"
                    className="text-xs text-[var(--color-primary)] font-medium hover:underline"
                  >
                    Visit site
                  </ProviderLink>
                </div>
              </Card>
            ))}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#3a5ba6] rounded-xl p-5 text-white">
              <h3 className="text-md font-medium mb-2">Compare All Providers</h3>
              <p className="text-2sm text-white/80 mb-4">
                See how {a.name} and {b.name} stack up against 50+ other providers on your corridor.
              </p>
              <Link
                href="/send-money"
                className="block text-center bg-[var(--color-surface)] text-[var(--color-primary)] px-4 py-2.5 rounded-full text-2sm font-medium hover:bg-[var(--color-primary-surface)] transition-colors"
              >
                Compare Rates
              </Link>
            </div>

            {/* Rate History */}
            <Card className="!p-4">
              <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Rate history</h3>
              <p className="text-2sm text-[var(--color-on-surface-variant)] mb-3">
                See how {a.name} and {b.name} rates have changed over time on popular corridors.
              </p>
              <ul className="space-y-2">
                {[
                  { corridor: "USD-INR", label: "USD → INR history" },
                  { corridor: "GBP-EUR", label: "GBP → EUR history" },
                  { corridor: "USD-PHP", label: "USD → PHP history" },
                  { corridor: "USD-MXN", label: "USD → MXN history" },
                  { corridor: "GBP-PKR", label: "GBP → PKR history" },
                ].map((c) => (
                  <li key={c.corridor}>
                    <Link href={`/exchange-rates/history/${corridorToSlug(c.corridor)}`} className="text-2sm text-[var(--color-primary)] hover:underline">
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/exchange-rates/history" className="text-2sm font-medium text-[var(--color-primary)] hover:underline">
                    All 90+ corridors →
                  </Link>
                </li>
              </ul>
            </Card>

            {/* Related Comparisons */}
            <Card className="!p-4">
              <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Related comparisons</h3>
              <ul className="space-y-2">
                {relatedComparisons.slice(0, 6).map((rc) => (
                  <li key={rc.slug}>
                    <Link href={`/compare/${rc.slug}`} className="text-2sm text-[var(--color-primary)] hover:underline">
                      {rc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Explore more */}
            <Card className="!p-4">
              <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money/usa-to-india" className="text-2sm text-[var(--color-primary)] hover:underline">USA to India transfers</Link></li>
                <li><Link href="/send-money/usa-to-pakistan" className="text-2sm text-[var(--color-primary)] hover:underline">USA to Pakistan transfers</Link></li>
                <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-2sm text-[var(--color-primary)] hover:underline">Cheapest way to send money</Link></li>
                <li><Link href="/guides/exchange-rate-markup-explained" className="text-2sm text-[var(--color-primary)] hover:underline">Exchange rates explained</Link></li>
                <li><Link href="/compare" className="text-2sm text-[var(--color-primary)] hover:underline">All comparisons</Link></li>
              </ul>
            </Card>
          </div>
        </aside>
      </div>
    </Container>
    </>
  );
}

// ── Page component ──

export default async function ComparisonPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const pair = parseSlug(slug);
  if (!pair) notFound();

  const { a, b } = pair;

  // Note: an earlier version redirected non-alphabetical X-vs-Y URLs to their
  // alphabetical canonical to avoid "Duplicate, Google chose different
  // canonical" warnings. That redirect was buggy — Next.js App Router's
  // `redirect()` doesn't always emit a real 30X here (sometimes serves a 200
  // with an empty streaming shell, observed in the May 20 sitemap audit
  // where 7 GSC-indexed slugs rendered as 248-word "Loading..." pages
  // instead of the actual comparison content).
  //
  // Removed because the duplicate-content risk is mostly theoretical: the
  // sitemap only submits the GSC-winning direction per pair, no internal
  // links point at the alphabetical reverse, and the 90d GSC pull shows
  // only 3 pairs ever had any signal in both directions (max 8 impressions).
  // Letting both directions render the same content means the URLs Google
  // has actually indexed serve their content instead of a redirect that
  // doesn't fire.

  // Every pair renders the same auto-generated template — the format Google
  // validated on paysend-vs-xoom. The former editorial ArticleComparison
  // layout was retired when the category was unified (its content lives on
  // in src/data/comparison-articles.ts, no longer rendered).
  return <DefaultComparison a={a} b={b} />;
}
