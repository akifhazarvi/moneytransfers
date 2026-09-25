import Link from "next/link";
import { robotsFor } from "@/lib/seo-indexing";
import { postalAddress } from "@/lib/postal-address";
import { quoteDataDate } from "@/lib/unified-quotes";
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
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import { sanitizeHtml } from "@/lib/sanitize";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { getCompareCanonicalSlug, EDITORIAL_COMPARE_SLUGS } from "@/lib/compare-canonical";
import { SITEMAP_COMPARISON_SLUGS } from "@/lib/sitemap-allowlists";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ScrollTracker } from "@/components/ScrollTracker";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import PartnerFeatureBlock from "@/components/PartnerFeatureBlock";
import { getCompareEditorial } from "@/data/compare-editorial";
import { renderDataTokens } from "@/lib/ratings-tokens";


interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

/**
 * The date our quote data was actually collected — an E-E-A-T freshness signal.
 *
 * Derived from the quotes themselves. This used to stat() three filenames, one of
 * which does not exist and two of which were last written in March, so the page
 * told readers the data was five months stale while the quotes were same-day.
 */
function getDataFreshnessDate(): string {
  return quoteDataDate ?? new Date().toISOString().split("T")[0];
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
// Scaled-content cleanup (2026-06-25): the /compare/[slug] route is combinatorial
// — C(61,2) ≈ 1,830 provider pairs all resolved to 200+noindex via on-demand ISR.
// Google still CRAWLS every noindex page, so ~1,800 thin templated URLs were
// burning crawl budget and dragging the site's quality average (a contributor to
// the Mar 20 scaled-content suppression). dynamicParams=false collapses the route
// to exactly the pages that earn/are indexable: any pair NOT pre-rendered below
// now returns a real 404 instead of an endlessly-recrawled noindex shell.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params = new Set<string>();

  // The ONLY compare pages that should exist: editorial (hand-written) + the
  // GSC/Bing-validated sitemap allowlist. Everything else 404s.
  for (const slug of EDITORIAL_COMPARE_SLUGS) params.add(slug);
  for (const slug of SITEMAP_COMPARISON_SLUGS) params.add(slug);

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
  const title = `${a.name} vs ${b.name} — Fees & Rates (${year})`;
  // Kept under 160 chars so the SERP shows the whole line. The previous wording
  // ran 168-180 depending on provider names, so every compare page was truncated
  // mid-sentence — 33 of 32 indexable pages flagged over-length.
  const desc = `Compare ${a.name} vs ${b.name} on fees, rate and speed. We tested real transfers across 6 corridors — see which delivers more in ${year}.`;

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
  // Indexability gates on SITEMAP MEMBERSHIP ALONE. It used to also accept
  // EDITORIAL_COMPARE_SLUGS, which quietly defeated the rule sitemap-allowlists.ts
  // documents ("compare/[slug] gates indexability on SITEMAP_COMPARISON_SLUGS"):
  // that set has 43 entries against the sitemap's 23, so 29 pages emitted
  // `index, follow` while absent from the sitemap — the same contradictory signal
  // this guard exists to prevent. Gating on one set makes the contradiction
  // structurally impossible rather than something to re-fix when the lists drift.
  //
  // EDITORIAL_COMPARE_SLUGS still drives generateStaticParams and canonical
  // direction, so these pages keep building and keep their inbound internal
  // links — they are noindexed, not removed. Promote into the sitemap allowlist
  // to make one indexable.
  const isAllowlisted = SITEMAP_COMPARISON_SLUGS.has(canonicalSlug);
  const shouldNoindexThin = !isAllowlisted;

  return {
    title,
    description: desc,
    alternates: getAlternates(`compare/${canonicalSlug}`, locale),
    // Comparison content is English-only; noindex locale variants to avoid diluting the English page
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    // Non-allowlisted pages: noindex to match sitemap absence
    ...(locale === "en" && shouldNoindexThin && { robots: { index: false, follow: true } }),
    // 2026-09-20: indexability is measured, not assumed — robotsFor()
    // consults the duplication-derived allowlist. See
    // scripts/build-indexable-routes.ts.
    robots: robotsFor(`/compare/${slug}`),
    openGraph: {
      title: `${a.name} vs ${b.name}: Which Gives You More Money?`,
      description: `We tested ${a.name} and ${b.name} side by side across 6 corridors. See which delivers more in ${year}.`,
      // og:url must match the canonical, not the request slug. Bing and AI
      // crawlers treat og:url as a secondary canonical hint; mismatching it
      // with <link rel="canonical"> weakens both signals.
      url: `https://sendmoneycompare.com/compare/${canonicalSlug}`,
      images: DEFAULT_OG_IMAGES,
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
  // Deduplicate, drop links to pages that no longer exist (dynamicParams=false
  // means only editorial + sitemap-allowlisted pairs resolve — everything else
  // 404s, so don't surface internal links to them), and limit.
  const seen = new Set<string>();
  const eligible = related.filter((r) => {
    if (seen.has(r.slug)) return false;
    seen.add(r.slug);
    return EDITORIAL_COMPARE_SLUGS.has(r.slug) || SITEMAP_COMPARISON_SLUGS.has(r.slug);
  });
  if (eligible.length <= 8) return eligible;
  // Taking the head of the list meant 48 of the 52 rendered compare pages
  // showed the same first eight, and pairs sitting low in provider order were
  // linked from nowhere — moneygram-vs-xoom was eligible on 18 pages and cut on
  // all 18. Rotate the eight-slot window by this pair's own position so the
  // slots reach the whole eligible set, deterministically per pair.
  const offset =
    (providers.findIndex((p) => p.slug === a.slug) * providers.length +
      providers.findIndex((p) => p.slug === b.slug)) %
    eligible.length;
  return Array.from({ length: 8 }, (_, i) => eligible[(offset + i) % eligible.length]);
}

// ── Default (auto-generated) comparison page ──

function DefaultComparison({
  a,
  b,
}: {
  a: (typeof providers)[number];
  b: (typeof providers)[number];
}) {
  // Editorial is keyed on the canonical pair order; try both so a reversed
  // slug (wise-vs-remitly / remitly-vs-wise) resolves to the same entry.
  const editorial =
    getCompareEditorial(`${a.slug}-vs-${b.slug}`) ?? getCompareEditorial(`${b.slug}-vs-${a.slug}`);
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
            // Reference the two FinancialService nodes declared below by @id
            // rather than re-typing them here. A typed-but-name-only
            // FinancialService is a LocalBusiness with no address, which is
            // exactly what the Sep 2 2026 audit flagged (4 invalid items per
            // compare page); an @id reference carries the same graph edge.
            about: [
              { "@id": `https://sendmoneycompare.com/companies/${a.slug}#financialservice` },
              { "@id": `https://sendmoneycompare.com/companies/${b.slug}#financialservice` },
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
      {/* Provider entities. Third-party ratings stay in visible content only. */}
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
              url: `https://sendmoneycompare.com/companies/${provider.slug}`,
              // FinancialService is a LocalBusiness subclass, so validators
              // require an address. Same headquarters value the canonical node
              // on /companies/[slug] uses, keeping the two copies consistent.
              ...(postalAddress(provider.headquarters) && { address: postalAddress(provider.headquarters) }),
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
            mainEntity: (editorial ? editorial.faqs.map((f) => ({ q: f.q, a: renderDataTokens(f.a) })) : faqs).map((faq) => ({
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
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.18] tracking-tight text-[var(--color-on-surface)] mb-4">
              {a.name} vs {b.name}: Fees, Rates &amp; Speed Compared
            </h1>
            {/* The measured result, stated up front. Specific to the pair, so it
                also breaks the header this template otherwise shares with
                every comparison of the same provider (2026-09-25). */}
            {(() => {
              const priced = corridorData.filter((c) => c.winner === "a" || c.winner === "b" || c.winner === "tie");
              if (priced.length === 0) return null;
              const winsA = priced.filter((c) => c.winner === "a").length;
              const winsB = priced.filter((c) => c.winner === "b").length;
              return (
                <p className="text-md text-[var(--color-on-surface-variant)] mb-4">
                  On the {priced.length} routes we price for both, {a.name} paid the recipient more on {winsA} and {b.name} on {winsB}{priced.length - winsA - winsB > 0 ? `, with ${priced.length - winsA - winsB} tied` : ""}.
                </p>
              );
            })()}
            <div className="flex flex-wrap items-center gap-4 text-2sm text-[var(--color-on-surface-variant)]">
              <span>
                Reviewed by{" "}
                <Link href="/about/awais-imran" className="text-[var(--color-primary)] hover:underline">Awais Imran</Link>
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <time dateTime={dataUpdatedDate}>
                Updated {new Date(dataUpdatedDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
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
                {/* No stock description: the same sentence printed on the /companies
                    hub, the provider's profile and every one of its comparisons. */}
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

          {/* Introduction. Where a pair has hand-written editorial, that is the
              intro: the generated one is assembled from shared phrases ("this
              comparison uses real transfer data collected from both providers
              across 6 popular corridors") that recur on 51 other pages, which is
              the boilerplate the content brief asks to remove rather than
              supplement. */}
          <p
            className="text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-8"
            {...(editorial
              ? { dangerouslySetInnerHTML: { __html: renderDataTokens(editorial.theDecision) } }
              : { children: content.intro })}
          />

          {/* The "In this comparison" contents list was removed 2026-09-25:
              the same seven entries on all 52 comparisons, and the sections it
              listed sit directly below it. */}

          {/* Live rate comparison across corridors */}
          <section id="live-rates" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Live comparison: {a.name} vs {b.name} across popular corridors
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              What the recipient receives through {a.name} and through {b.name} on the {corridorData.length} routes we price for both.
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
            </div>
          </section>

          {/* Key Differences */}
          <section id="key-differences" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
              Key differences between {a.name} and {b.name}
            </h2>
            <div className="space-y-3">
              {(editorial ? editorial.keyDifferences : keyDifferences).map((diff, i) => (
                <div key={i} className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: editorial ? renderDataTokens(diff) : sanitizeHtml(diff) }}
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

          {/* Hand-written editorial for this pair — content brief §4.
              Rendered INSTEAD of the generated pros/cons and "when to choose"
              blocks, not alongside them: those read identically on every page
              featuring the same provider, and the brief asks for boilerplate to
              be removed rather than buried under more text. Pairs without an
              entry keep the generated blocks. */}
          {editorial ? (
            <>
              <section id="the-decision" className="mb-10">
                <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                  What our measurements show for this pair
                </h2>
                <p
                  className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.measuredRecord) }}
                />
              </section>

              <section id="worked-example" className="mb-10">
                <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                  {editorial.workedExample.heading}
                </h2>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <p
                    className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.workedExample.body) }}
                  />
                </div>
                {editorial.secondExample && (
                  <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 mt-4">
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      {editorial.secondExample.heading}
                    </h3>
                    <p
                      className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.secondExample.body) }}
                    />
                  </div>
                )}
              </section>

              <section id="when-to-use" className="mb-10">
                <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                  When to choose {a.name} vs {b.name}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { provider: a, section: editorial.pickA },
                    { provider: b, section: editorial.pickB },
                  ].map(({ provider, section }) => (
                    <div key={provider.slug} className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <Image src={provider.logo} alt={provider.name} width={32} height={32} className="w-full h-full object-contain p-1" />
                        </div>
                        <h3 className="text-md font-medium text-[var(--color-on-surface)]">{section.heading}</h3>
                      </div>
                      <p
                        className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderDataTokens(section.body) }}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section id="limits" className="mb-10">
                <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                  What this comparison does not settle
                </h2>
                <p
                  className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.limits) }}
                />
              </section>
            </>
          ) : (
            <>
          {/* Pros / Cons — linked, not reprinted (2026-09-25). The lists are
              each provider's own, word for word, so printing them here
              repeated the profile and every other comparison of that provider. */}
          <section id="pros-cons" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-2">
              Pros and cons
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {[a, b].map((provider, i) => (
                <span key={provider.slug}>
                  {i > 0 && " · "}
                  <Link href={`/companies/${provider.slug}`} className="text-[var(--color-primary)] hover:underline">
                    {provider.name}: {provider.pros.length} pros, {provider.cons.length} cons
                  </Link>
                </span>
              ))}
            </p>
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
            </>
          )}

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
                {editorial ? (
                  <p
                    className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.verdict.costExplanation) }}
                  />
                ) : (
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{verdict.costExplanation}</p>
                )}
              </div>
              {/* Speed verdict */}
              <div className={`rounded-xl p-5 ${verdict.speedWinner === "tie" ? "bg-[var(--color-surface-dim)]" : "bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20"}`}>
                <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {verdict.speedWinner === "tie" ? "Speed: Similar delivery times" : `Faster: ${verdict.speedWinner === "a" ? a.name : b.name}`}
                </h3>
                {editorial ? (
                  <p
                    className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.verdict.speedExplanation) }}
                  />
                ) : (
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{verdict.speedExplanation}</p>
                )}
              </div>
              {/* Coverage verdict */}
              <div className={`rounded-xl p-5 ${verdict.coverageWinner === "tie" ? "bg-[var(--color-surface-dim)]" : "bg-[var(--color-surface-dim)]"}`}>
                <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                  {verdict.coverageWinner === "tie" ? "Coverage: Comparable reach" : `Wider coverage: ${verdict.coverageWinner === "a" ? a.name : b.name}`}
                </h3>
                {editorial ? (
                  <p
                    className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.verdict.coverageExplanation) }}
                  />
                ) : (
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{verdict.coverageExplanation}</p>
                )}
              </div>
            </div>
            {/* Overall */}
            <div className="bg-gradient-to-r from-[var(--color-primary-surface)] to-[var(--color-surface-dim)] rounded-xl p-6">
              <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-2">Bottom line</h3>
              {editorial ? (
                <p
                  className="text-md text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderDataTokens(editorial.verdict.bottomLine) }}
                />
              ) : (
                <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed">{verdict.overallSummary}</p>
              )}
            </div>
          </section>

          {/* FAQs */}
          <section id="faqs" className="mb-10">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-6">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {(editorial ? editorial.faqs : faqs).map((faq) => (
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
                  {editorial ? (
                    <p
                      className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8"
                      dangerouslySetInnerHTML={{ __html: renderDataTokens(faq.a) }}
                    />
                  ) : (
                    <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  )}
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

            {/* The "Compare All Providers" box (a link to /send-money, not a
                provider click) was removed 2026-09-25: the same three lines on
                all 52 comparisons. */}

            {/* The "Rate history" card listed the same five corridors on all 52
                comparisons (removed 2026-09-25); /exchange-rates/history has them. */}

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
                {/* The fixed "Explore" card that followed (five links, the
                    same on all 52 comparisons) was removed 2026-09-24 as
                    repeated furniture; its hub link lives on here. */}
                <li><Link href="/compare" className="text-2sm font-medium text-[var(--color-primary)] hover:underline">All comparisons →</Link></li>
              </ul>
            </Card>
          </div>
        </aside>
      </div>


      {/* Paid partner spotlight. Missed by the Sep 18 rollout, which covered
          guides and corridors only. Suppressed where TapTap is one of the two
          providers under comparison: there the page is already about them, and
          a paid card beside an editorial head-to-head on the same name would
          read as the comparison being bought. No corridor is in scope, so the
          no-quote variant renders. */}
      {a.slug !== "taptap-send" && b.slug !== "taptap-send" && (
        <PartnerFeatureBlock source="taptap_spotlight:compare-slug" variant="card" />
      )}
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
