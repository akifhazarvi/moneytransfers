import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";
import { providers, generateQuotes } from "@/data/providers";

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;
import { getGoUrl } from "@/lib/affiliate";
import ProviderLink from "@/components/ProviderLink";
import { getComparisonArticle } from "@/data/comparison-articles";
import { generateComparisonContent } from "@/lib/comparison-content";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ProsConsList from "@/components/ProsConsList";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import { sanitizeHtml } from "@/lib/sanitize";
import { trustpilotIndex } from "@/lib/unified-quotes";
import { getAllInsights, corridorToSlug } from "@/lib/rate-history";
import { getAlternates } from "@/lib/i18n-metadata";
import { getCompareCanonicalSlug } from "@/lib/compare-canonical";
import { SITEMAP_COMPARISON_SLUGS } from "@/lib/sitemap-allowlists";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

// Only pre-render comparisons with editorial articles + top provider pairs.
// All other valid pairs still work at runtime via ISR (dynamicParams = true by default).
const TOP_PROVIDERS = ["wise", "remitly", "western-union", "moneygram", "revolut", "xe", "worldremit", "paypal", "xoom"];

export async function generateStaticParams() {
  const params = new Set<string>();

  // 1. All editorial article slugs (hand-written content — always pre-render)
  const { comparisonArticles } = await import("@/data/comparison-articles");
  for (const article of comparisonArticles) {
    params.add(article.slug);
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
  const t = await getTranslations({ locale, namespace: "compareSlug" });
  const article = getComparisonArticle(slug);
  if (article) {
    return {
      title: article.title,
      description: article.metaDescription,
      openGraph: {
        title: article.title,
        description: article.metaDescription,
        type: "article",
        modifiedTime: article.updatedAt,
      },
      // Editorial articles are self-canonical — the editorial owner picked
      // the slug deliberately (often the direction Google indexes).
      alternates: getAlternates(`compare/${slug}`, locale),
    };
  }

  const pair = parseSlug(slug);
  if (!pair) return {};
  const { a, b } = pair;
  const year = new Date().getFullYear();

  // Custom titles for high-impression comparisons (CTR-optimized)
  const customMeta: Record<string, { title: string; desc: string }> = {
    "wise-vs-revolut": {
      title: `Wise vs Revolut ${year} — We Sent $1,000 Through Both. Here's Who Won`,
      desc: `Wise charges 0.33–0.63% with no markup. Revolut offers free transfers on weekdays but adds a weekend surcharge. We compared real costs across 6 corridors — see which saves you more.`,
    },
    "remitly-vs-xoom": {
      title: `Remitly vs Xoom Fees Comparison ${year} — Rates, Speed & Total Cost`,
      desc: `Compare Remitly vs Xoom fees, exchange rates and delivery speed in ${year}. We tested real transfers to show which service sends more money after markup and fees.`,
    },
    "remitly-vs-taptap-send": {
      title: `Remitly vs TapTap Send ${year} — Zero Fees vs Fast Delivery Compared`,
      desc: `TapTap Send charges zero fees. Remitly offers Express delivery in minutes. We tested both on USD→INR, GBP→PKR and 4 more corridors to see who wins.`,
    },
    "remitly-vs-moneygram": {
      title: `Remitly vs MoneyGram ${year} — App Transfer vs Cash Pickup Compared`,
      desc: `Remitly is mobile-first with bank deposit. MoneyGram has 350,000+ cash pickup locations. We compared fees, rates, and total cost on 6 corridors.`,
    },
    "remitly-vs-revolut": {
      title: `Remitly vs Revolut ${year} — Which Is Cheaper for Sending Money Abroad?`,
      desc: `Remitly specialises in remittances. Revolut is a multi-currency fintech app. We compared real transfer costs across 6 corridors to find the better deal.`,
    },
    "paypal-vs-xoom": {
      title: `PayPal vs Xoom ${year} — Same Company, Very Different Fees`,
      desc: `PayPal owns Xoom but charges different fees and rates. We tested both side by side — Xoom saves up to 4% on international transfers. See the full breakdown.`,
    },
    "wise-vs-xoom": {
      title: `Wise vs Xoom ${year} — Mid-Market Rate vs PayPal's Exchange Rate`,
      desc: `Wise uses the real mid-market rate with a small fee. Xoom marks up the rate but sometimes charges no fee. We tested 6 corridors to find which delivers more.`,
    },
    "wise-vs-western-union": {
      title: `Wise vs Western Union ${year} — How Much More Does Your Family Get?`,
      desc: `Western Union has 550,000+ agent locations. Wise has the mid-market rate. On a $1,000 transfer, the difference can be $30–$60. See the real comparison.`,
    },
    "wise-vs-westpac": {
      title: `Wise vs Westpac ${year} — We Sent AU$1,000. Your Recipient Gets AU$35 More`,
      desc: `Westpac charges AU$10–$32 plus a 3.5–6% hidden FX markup. Wise uses the mid-market rate with a ~0.5% fee. On AU$1,000 to USD, GBP, INR or PHP, Wise delivers ~AU$30–$35 more.`,
    },
    "wise-vs-ofx": {
      title: `Wise vs OFX ${year} — Which Wins for Large Transfers ($10,000+)?`,
      desc: `OFX charges zero fees with a dedicated dealer who can lock the rate for 24 hours — best for $10,000+ transfers. Wise uses the mid-market rate with a 0.4–0.6% fee — best below $10,000. We tested both on 6 corridors. See which actually delivers more.`,
    },
  };

  const custom = customMeta[slug];
  const title = custom?.title ?? `${a.name} vs ${b.name} ${year}: Fees, Rates & Which Sends More Money`;
  const desc = custom?.desc ?? `Compare ${a.name} vs ${b.name} fees, exchange rates, and delivery speed. We tested real transfers across 6 corridors — see which provider delivers more to your recipient in ${year}.`;

  // Auto-generated comparison pages emit a canonical pointing at the
  // GSC-winning direction for the pair (or alphabetical if no signal yet).
  // Without this, /compare/wise-vs-ofx and /compare/ofx-vs-wise both self-
  // canonical, and Google clusters them and picks a canonical itself.
  // See src/lib/compare-canonical.ts.
  const canonicalSlug = getCompareCanonicalSlug(slug);

  // Thin-page guard: auto-generated compare pages outside the sitemap allowlist
  // were emitting `index, follow` while sitting OFF the sitemap — the textbook
  // contradictory signal that contributed to the May 8 deindex collapse. These
  // pages are auto-generated by combinatorial provider pairing and most earn
  // 0-2 impressions in 90d. Editorial pages above (caught by getComparisonArticle)
  // are always indexable; non-editorial pages must EARN indexability by being
  // promoted into SITEMAP_COMPARISON_SLUGS once they show GSC signal.
  const isAllowlisted = SITEMAP_COMPARISON_SLUGS.has(canonicalSlug);
  const shouldNoindexThin = !isAllowlisted;

  return {
    title,
    description: desc,
    alternates: getAlternates(`compare/${canonicalSlug}`, locale),
    // Comparison content is English-only; noindex locale variants to avoid diluting the English page
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    // Non-allowlisted auto-generated pages: noindex to match sitemap absence
    ...(locale === "en" && shouldNoindexThin && { robots: { index: false, follow: true } }),
    openGraph: {
      title: custom?.title ?? `${a.name} vs ${b.name}: Which Gives You More Money?`,
      description: custom?.desc ?? `We tested ${a.name} and ${b.name} side by side across 6 corridors. See which delivers more in ${year}.`,
      // og:url must match the canonical, not the request slug. Bing and AI
      // crawlers treat og:url as a secondary canonical hint; mismatching it
      // with <link rel="canonical"> weakens both signals.
      url: `https://sendmoneycompare.com/compare/${canonicalSlug}`,
    },
  };
}

// ── Article-rich comparison page ──

function ArticleComparison({
  slug,
  a,
  b,
}: {
  slug: string;
  a: (typeof providers)[number];
  b: (typeof providers)[number];
}) {
  const article = getComparisonArticle(slug)!;

  // Generate sample quotes across multiple corridors
  const sampleCorridors = [
    { from: "USD", to: "INR", label: "USD → INR", amount: 1000, symbol: "₹" },
    { from: "GBP", to: "EUR", label: "GBP → EUR", amount: 1000, symbol: "€" },
    { from: "USD", to: "PHP", label: "USD → PHP", amount: 500, symbol: "₱" },
    { from: "USD", to: "MXN", label: "USD → MXN", amount: 1000, symbol: "MX$" },
  ];

  const corridorQuotes = sampleCorridors.map((c) => {
    const quotes = generateQuotes(c.amount, c.from, c.to);
    return {
      ...c,
      quoteA: quotes.find((q) => q.providerSlug === a.slug),
      quoteB: quotes.find((q) => q.providerSlug === b.slug),
    };
  });

  // Compute who actually wins across the sample corridors — head-to-head by receive amount.
  // This becomes the hero winner callout above the provider summary cards. If both are missing
  // on every sampled corridor (rare edge case) we fall back to provider.rating.
  const winnerTally = corridorQuotes.reduce(
    (acc, c) => {
      if (c.quoteA && c.quoteB) {
        if (c.quoteA.receiveAmount > c.quoteB.receiveAmount) acc.a += 1;
        else if (c.quoteB.receiveAmount > c.quoteA.receiveAmount) acc.b += 1;
      }
      return acc;
    },
    { a: 0, b: 0 }
  );
  const totalRanked = winnerTally.a + winnerTally.b;
  const leader: "a" | "b" | null =
    totalRanked === 0
      ? a.rating >= b.rating
        ? "a"
        : "b"
      : winnerTally.a > winnerTally.b
        ? "a"
        : winnerTally.b > winnerTally.a
          ? "b"
          : null;
  const winner = leader === "a" ? a : leader === "b" ? b : null;
  const loser = leader === "a" ? b : leader === "b" ? a : null;
  const winnerWins = leader === "a" ? winnerTally.a : leader === "b" ? winnerTally.b : 0;

  return (
    <>
      <ScrollTracker slug={slug} contentType="comparison" />
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.metaDescription,
            datePublished: "2026-03-14",
            dateModified: article.updatedAt,
            author: { "@type": "Person", name: "Akif Hazarvi", url: "https://sendmoneycompare.com/about/akif-hazarvi" },
            reviewedBy: { "@type": "Person", name: "Awais Imran", url: "https://sendmoneycompare.com/about/awais-imran" },
            publisher: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              "@id": "https://sendmoneycompare.com/#organization",
              logo: { "@type": "ImageObject", url: "https://sendmoneycompare.com/logos/sendmoneycompare-logo.png", width: 512, height: 512 },
            },
            mainEntityOfPage: `https://sendmoneycompare.com/compare/${getCompareCanonicalSlug(slug)}`,
            isPartOf: { "@type": "WebPage", "@id": "https://sendmoneycompare.com/compare" },
            about: [
              { "@type": "Thing", name: "International Money Transfer" },
              { "@type": "FinancialService", name: a.name },
              { "@type": "FinancialService", name: b.name },
            ],
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["article h1", "article h2", "#verdict"],
            },
          }),
        }}
      />
      {/* Product schema with AggregateRating for each provider */}
      {[a, b].map((provider) => (
        <script
          key={`product-${provider.slug}`}
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
      {/* FAQPage — still useful for AI/LLM citation discovery even though Google restricts rich results */}
      {article.faqs && article.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: article.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      )}
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
              { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `https://sendmoneycompare.com/compare/${getCompareCanonicalSlug(slug)}` },
            ],
          }),
        }}
      />

      <Container className="py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Compare", href: "/compare" }, { label: `${a.name} vs ${b.name}` }]} />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-overline text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-3 py-1.5 rounded-full mb-5">
                Comparison
              </div>
              <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-normal leading-[1.18] tracking-[-0.02em] text-[var(--color-on-surface)] mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-2sm text-[var(--color-on-surface-variant)]">
                <span>SendMoneyCompare Editorial</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                <time dateTime={article.updatedAt}>
                  Updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Winner callout — the answer, up front. The user came to find out who wins;
                give them the verdict before the article body. */}
            {winner && loser && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-sm)] mb-6 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--color-success)]" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/60 shrink-0">
                      <Image src={winner.logo} alt={`${winner.name} logo`} width={56} height={56} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-success-dark)] uppercase tracking-wider mb-1">
                        <Trophy className="w-3 h-3" strokeWidth={2.25} />
                        Our verdict
                      </span>
                      <p className="text-lg sm:text-xl font-semibold text-[var(--color-on-surface)] tracking-[-0.01em] leading-tight">
                        {winner.name} wins
                        {winnerWins > 0 && (
                          <span className="text-[var(--color-on-surface-muted)] font-normal text-sm tabular-nums"> · {winnerWins} of {totalRanked} corridors</span>
                        )}
                      </p>
                      <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
                        Cheaper than {loser.name} on the transfers we sampled below.
                      </p>
                    </div>
                  </div>
                  <ProviderLink
                    href={getGoUrl(winner.slug, { sourceCurrency: "USD", targetCurrency: "INR", sourceAmount: 1000 })}
                    provider={winner.slug}
                    source="compare_winner_hero"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shadow-[var(--shadow-sm)] shrink-0 whitespace-nowrap"
                  >
                    Send with {winner.name}
                    <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                  </ProviderLink>
                </div>
              </div>
            )}

            {/* Provider summary cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[a, b].map((provider) => {
                const isWinner = winner?.slug === provider.slug;
                return (
                  <Card key={provider.slug} className={isWinner ? "border-[var(--color-success)]/40 bg-[var(--color-success-surface)]/30" : ""}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Image src={provider.logo} alt={provider.name} width={56} height={56} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base font-medium text-[var(--color-on-surface)] truncate">{provider.name}</h2>
                        <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                      </div>
                      {isWinner && (
                        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--color-success-dark)] bg-[var(--color-success-surface-dim)] px-2 py-1 rounded-full uppercase tracking-wider shrink-0">
                          <Trophy className="w-2.5 h-2.5" strokeWidth={2.5} />
                          Winner
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{provider.description}</p>
                    <div className="flex gap-4 text-xs text-[var(--color-on-surface-variant)]">
                      <span className="tabular-nums">{provider.supportedCountries}+ countries</span>
                      <span className="tabular-nums">{provider.supportedCurrencies}+ currencies</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Introduction */}
            <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
              {article.intro}
            </p>

            {/* AI-citable Quick Answer — top comparison slugs only */}
            {(() => {
              const quickAnswers: Record<string, string> = {
                "wise-vs-remitly": `Wise and Remitly are both among the cheapest money transfer providers, but they win on different corridors. Wise uses the mid-market rate with a transparent fee (typically 0.3–0.6% of the transfer) and is cheapest on bank-to-bank transfers to developed markets (Europe, US, UK, Canada, Australia). Remitly adds a 1–2% FX markup but offers faster cash pickup, mobile-wallet delivery, and promotional rates on first transfers to emerging-market corridors (Philippines, India, Mexico, Nigeria). For regular senders Wise tends to beat Remitly by 0.5–1.5% on the all-in cost after the first transfer.`,
                "wise-vs-western-union": `Wise is cheaper than Western Union on almost every bank-to-bank corridor — on a $1,000 transfer, Wise typically costs $4–$8 total while Western Union costs $30–$50 (1.5–3% rate markup plus upfront fees). Western Union wins only when you need cash pickup in 500,000+ agent locations worldwide or when sending to countries with weak banking access (parts of Africa, South America, and remote Asia). For standard bank-to-bank transfers, Wise uses the mid-market rate with a transparent 0.3–0.6% fee — every time.`,
                "wise-vs-revolut": `Wise and Revolut both use the mid-market rate for transfers, but they differ sharply on fees and limits. Wise charges a flat transparent fee (typically 0.3–0.6% of the amount) and has no monthly caps. Revolut is free for Standard account holders up to £1,000/month (or equivalent) and then charges 0.5% — but paid tiers (Premium £6.99/month, Metal £12.99/month) raise the free allowance to £10,000–£20,000 and skip conversion fees on weekends. Revolut only converts during market hours by default (1% weekend markup); Wise converts 24/7 at the locked rate.`,
                "revolut-vs-chase": `Revolut is significantly cheaper than Chase for international transfers. Chase charges a $40–$50 wire fee plus a 3–5% exchange rate markup on international wires — on a $1,000 USD→EUR transfer that's roughly $80–$100 total cost. Revolut is free up to £1,000/month on Standard plans (0.5% after), uses the mid-market rate during trading hours, and settles within minutes. Chase's only advantage is integration with existing US checking accounts and FDIC insurance on USD balances; Revolut US is FDIC-insured via Lead Bank partnership.`,
                "wise-vs-rbs": `Wise is dramatically cheaper than Royal Bank of Scotland (RBS) for international transfers. RBS charges £22 per non-sterling transfer via online banking (up to £40 for a branch transfer), plus an FX markup of 2.75–3.5% on top of the interbank rate. On a £2,000 transfer, RBS costs roughly £75–£90 total. Wise charges around £8–£12 on the same transfer using the mid-market rate — a real-world saving of £65–£80 per transfer. RBS is convenient if you already bank there, but for anything above £500 the Wise saving outweighs the convenience.`,
              };
              const answer = quickAnswers[slug];
              if (!answer) return null;
              return (
                <div className="bg-[var(--color-primary-surface)] border-y border-[var(--color-primary-light)] -mx-4 sm:mx-0 sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-8">
                  <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">
                    <strong className="text-[var(--color-primary)]">Quick answer:</strong> {answer}
                  </p>
                </div>
              );
            })()}

            {/* Table of Contents */}
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 mb-8">
              <h2 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">In this article</h2>
              <ol className="space-y-1.5">
                {article.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-2sm text-[var(--color-primary)] hover:underline">
                      {section.heading}
                    </a>
                  </li>
                ))}
                <li><a href="#summary-table" className="text-2sm text-[var(--color-primary)] hover:underline">Summary table</a></li>
                <li><a href="#verdict" className="text-2sm text-[var(--color-primary)] hover:underline">Verdict</a></li>
                <li><a href="#faqs" className="text-2sm text-[var(--color-primary)] hover:underline">Frequently asked questions</a></li>
              </ol>
            </div>

            {/* Live quote comparison across corridors */}
            <div className="bg-[var(--color-primary-surface)] rounded-xl p-6 mb-8">
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-4">
                Live comparison: {a.name} vs {b.name} across popular corridors
              </h3>
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
                    {corridorQuotes.map((c) => {
                      const amtA = c.quoteA?.receiveAmount;
                      const amtB = c.quoteB?.receiveAmount;
                      const winner =
                        amtA && amtB ? (amtA > amtB ? a.name : amtB > amtA ? b.name : "Tie") : "N/A";
                      const winnerColor =
                        winner === a.name ? "text-[var(--color-success-dark)]" : winner === b.name ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]";

                      return (
                        <tr key={c.label}>
                          <td className="px-4 py-2.5 text-[var(--color-on-surface)]">
                            {c.label}
                            <span className="text-2xs text-[var(--color-on-surface-variant)] ml-1">
                              ({c.from === "GBP" ? "£" : "$"}{c.amount.toLocaleString()})
                            </span>
                          </td>
                          <td className={`px-4 py-2.5 text-right tabular-nums ${amtA && amtB && amtA >= amtB ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {amtA ? `${c.symbol}${amtA.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </td>
                          <td className={`px-4 py-2.5 text-right tabular-nums ${amtA && amtB && amtB > amtA ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {amtB ? `${c.symbol}${amtB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-medium ${winnerColor}`}>
                            {winner}
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

            {/* Article sections */}
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-12">
                <h2 className="font-display text-[clamp(1.375rem,3vw,1.625rem)] font-normal leading-[1.28] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5">
                  {section.heading}
                </h2>
                <div
                  className="prose-content prose-custom"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
                />
              </section>
            ))}

            {/* Summary Table */}
            <section id="summary-table" className="mb-10">
              <h2 className="font-display text-[clamp(1.375rem,3vw,1.625rem)] font-normal leading-[1.28] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5">
                {a.name} vs {b.name}: Summary table
              </h2>
              <ComparisonTable headers={["Feature", a.name, b.name]}>
                {[
                  { label: "Overall rating", va: `${a.rating.toFixed(1)}/5 (${a.ratingLabel})`, vb: `${b.rating.toFixed(1)}/5 (${b.ratingLabel})`, w: a.rating > b.rating ? "a" : a.rating < b.rating ? "b" : "tie" },
                  { label: "Fee structure", va: a.feeStructure, vb: b.feeStructure, w: "tie" },
                  { label: "Exchange rate markup", va: a.exchangeRateMarkup, vb: b.exchangeRateMarkup, w: a.exchangeRateMarkup.includes("0%") ? "a" : "tie" },
                  { label: "Transfer speed", va: a.transferSpeed, vb: b.transferSpeed, w: "tie" },
                  { label: "Supported countries", va: `${a.supportedCountries}+`, vb: `${b.supportedCountries}+`, w: a.supportedCountries > b.supportedCountries ? "a" : b.supportedCountries > a.supportedCountries ? "b" : "tie" },
                  { label: "Supported currencies", va: `${a.supportedCurrencies}+`, vb: `${b.supportedCurrencies}+`, w: a.supportedCurrencies > b.supportedCurrencies ? "a" : b.supportedCurrencies > a.supportedCurrencies ? "b" : "tie" },
                  { label: "Max transfer", va: a.maxTransfer ? `$${(a.maxTransfer).toLocaleString()}` : "No limit", vb: b.maxTransfer ? `$${(b.maxTransfer).toLocaleString()}` : "No limit", w: (a.maxTransfer || Infinity) > (b.maxTransfer || Infinity) ? "a" : (b.maxTransfer || Infinity) > (a.maxTransfer || Infinity) ? "b" : "tie" },
                  { label: "Payment methods", va: a.paymentMethods.join(", "), vb: b.paymentMethods.join(", "), w: a.paymentMethods.length > b.paymentMethods.length ? "a" : b.paymentMethods.length > a.paymentMethods.length ? "b" : "tie" },
                  { label: "Delivery methods", va: a.deliveryMethods.join(", "), vb: b.deliveryMethods.join(", "), w: a.deliveryMethods.length > b.deliveryMethods.length ? "a" : b.deliveryMethods.length > a.deliveryMethods.length ? "b" : "tie" },
                  { label: "Regulators", va: a.regulators.join(", "), vb: b.regulators.join(", "), w: "tie" },
                  { label: "Founded", va: String(a.founded), vb: String(b.founded), w: "tie" },
                  { label: "Best for", va: "Large transfers, transparency, business", vb: "Small remittances, speed, cash pickup", w: "tie" },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)] font-medium">{row.label}</td>
                    <td className={`px-4 py-3 text-sm ${row.w === "a" ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                      {row.va}
                    </td>
                    <td className={`px-4 py-3 text-sm ${row.w === "b" ? "font-medium text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                      {row.vb}
                    </td>
                  </tr>
                ))}
              </ComparisonTable>
            </section>

            {/* Pros / Cons */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[a, b].map((provider) => (
                <div key={provider.slug} className="space-y-4">
                  <h3 className="text-base font-medium text-[var(--color-on-surface)]">{provider.name}</h3>
                  <ProsConsList type="pros" items={provider.pros} />
                  <ProsConsList type="cons" items={provider.cons} />
                </div>
              ))}
            </div>

            {/* Verdict */}
            <section id="verdict" className="mb-10">
              <h2 className="font-display text-[clamp(1.375rem,3vw,1.625rem)] font-normal leading-[1.28] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5">
                Verdict: {a.name} or {b.name}?
              </h2>
              {/* Verdict banner */}
              <div className="verdict-banner mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-white/80" strokeWidth={2} />
                  <span className="text-overline text-white/60">Our Verdict</span>
                </div>
                <p className="text-md font-semibold text-white mb-4">{article.verdict.overall}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-2sm font-semibold text-white/70 mb-1.5">
                      Choose {providers.find((p) => p.slug === article.verdict.largeTransfers.winner)?.name} if:
                    </p>
                    <p className="text-2sm text-white/60 leading-relaxed">{article.verdict.largeTransfers.explanation}</p>
                  </div>
                  <div>
                    <p className="text-2sm font-semibold text-white/70 mb-1.5">
                      Choose {providers.find((p) => p.slug === article.verdict.smallTransfers.winner)?.name} if:
                    </p>
                    <p className="text-2sm text-white/60 leading-relaxed">{article.verdict.smallTransfers.explanation}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-10">
              <h2 className="font-display text-[clamp(1.375rem,3vw,1.625rem)] font-normal leading-[1.28] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5">
                Frequently asked questions
              </h2>
              <div className="space-y-3">
                {article.faqs.map((faq) => (
                  <details key={faq.q} className="group border border-[var(--color-outline)] rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 list-none text-md font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors select-none">
                      {faq.q}
                      <svg
                        className="w-4 h-4 shrink-0 ml-4 text-[var(--color-on-surface-muted)] group-open:rotate-180 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 pt-1 text-md text-[var(--color-on-surface-variant)] leading-relaxed border-t border-[var(--color-outline)]">
                      {faq.a}
                    </div>
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
                      href={getGoUrl(provider.slug, { clickref: "compare_detail_card" })}
                      provider={provider.slug}
                      source="compare_detail_card"
                      className="text-xs text-[var(--color-primary)] font-medium hover:underline"
                    >
                      Visit site
                    </ProviderLink>
                  </div>
                </Card>
              ))}

              {/* CTA */}
              <div className="overflow-hidden rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)]">
                <div className="bg-[var(--color-primary)] px-5 py-4">
                  <h3 className="text-md font-semibold text-white mb-1">Compare All Providers</h3>
                  <p className="text-2sm text-white/70">
                    See how {a.name} and {b.name} stack up against 50+ others.
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] p-4">
                  <Link
                    href="/send-money"
                    className="flex items-center justify-center w-full h-10 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Compare Rates →
                  </Link>
                </div>
              </div>

              {/* Explore more */}
              <Card className="!p-4">
                <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/send-money/usa-to-india" className="text-2sm text-[var(--color-primary)] hover:underline">USA to India transfers</Link></li>
                  <li><Link href="/send-money/usa-to-pakistan" className="text-2sm text-[var(--color-primary)] hover:underline">USA to Pakistan transfers</Link></li>
                  <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-2sm text-[var(--color-primary)] hover:underline">Cheapest way to send money</Link></li>
                  <li><Link href="/guides" className="text-2sm text-[var(--color-primary)] hover:underline">All guides</Link></li>
                </ul>
              </Card>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
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
              <div className={`rounded-xl p-5 ${verdict.speedWinner === "tie" ? "bg-[var(--color-surface-dim)]" : "bg-[#e8f0fe] border border-[#1a73e8]/20"}`}>
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
  const t = await getTranslations("compareSlug");
  const pair = parseSlug(slug);
  if (!pair) notFound();

  const { a, b } = pair;
  const article = getComparisonArticle(slug);

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

  if (article) {
    return <ArticleComparison slug={slug} a={a} b={b} />;
  }

  return <DefaultComparison a={a} b={b} />;
}
