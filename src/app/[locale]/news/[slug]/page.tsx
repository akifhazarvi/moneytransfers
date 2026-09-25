import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { newsItems, getNewsItem } from "@/data/news";
import { getProviderName } from "@/data/providers";
import { formatLocalDate } from "@/lib/format-date";
import { sanitizeHtml } from "@/lib/sanitize";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { seoTitle, seoDescription } from "@/lib/seo-title";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ScrollTracker } from "@/components/ScrollTracker";
import { renderDataTokens } from "@/lib/ratings-tokens";
import { newsIsIndexable } from "@/lib/seo-indexing";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import { generateQuotes } from "@/lib/quotes-engine";

/**
 * The corridor a story is about, for its one live-quote table.
 *
 * Owner call 2026-09-25: news keeps ONE table. Before 2026-09-24 every story
 * printed the same USD → INR table twice (a China CBDC piece included), which
 * was most of the news family's duplicate share. An explicit pair in the
 * title or excerpt wins; else the most specific destination named; else a
 * topic with an obvious corridor; else USD → INR. A corridor with fewer than
 * three quoting providers falls through rather than render a thin table.
 */
const NEWS_DESTINATIONS: [RegExp, string, string][] = [
  [/south africa|\bzar\b/i, "GBP", "ZAR"],
  [/rwanda|\brwf\b/i, "USD", "RWF"],
  [/\bmtn\b|airtel|orange money|\bafrica/i, "GBP", "KES"],
  [/\bindia|\binr\b|rupee/i, "USD", "INR"],
  [/pakistan|\bpkr\b/i, "GBP", "PKR"],
  [/philippin|\bofw|\bphp\b|gcash/i, "USD", "PHP"],
  [/mexic|\bmxn\b/i, "USD", "MXN"],
  [/nigeria|naira|\bngn\b/i, "GBP", "NGN"],
  [/bangladesh|\bbdt\b/i, "GBP", "BDT"],
  [/kenya|\bkes\b|m-pesa/i, "USD", "KES"],
  [/ghana|\bghs\b/i, "GBP", "GHS"],
  [/china|yuan|\bcny\b/i, "USD", "CNY"],
  [/vietnam|\bvnd\b/i, "USD", "VND"],
  // The US remittance excise falls hardest on USD → MXN, the largest US
  // outbound route; Fed and FedNow stories are dollar stories.
  [/remittance tax|excise|\birs\b/i, "USD", "MXN"],
  [/\bfed\b|fednow|federal reserve/i, "USD", "EUR"],
  [/\beu\b|euro|sepa|\beur\b/i, "GBP", "EUR"],
  [/\buk\b|britain|sterling|\bgbp\b|\bfca\b/i, "GBP", "EUR"],
];

function topicalCorridor(item: { title: string; excerpt: string }): { from: string; to: string } | null {
  const text = `${item.title} ${item.excerpt}`;
  const ok = (from: string, to: string) => from !== to && generateQuotes(500, from, to).length >= 3;
  const pair = text.match(/\b([A-Z]{3})\s*(?:to|→|->|\/)\s*([A-Z]{3})\b/);
  if (pair && ok(pair[1], pair[2])) return { from: pair[1], to: pair[2] };
  for (const [re, from, to] of NEWS_DESTINATIONS) if (re.test(text) && ok(from, to)) return { from, to };
  return null;
}

/**
 * Stories with no corridor of their own (a listing, an acquisition) rotate
 * through busy routes, and stories that share a corridor get different
 * amounts, so no two news tables print the same figures. Assigned once, in
 * publication order, so an article's table is stable between builds.
 */
const FALLBACK_CORRIDORS: [string, string][] = [
  ["USD", "INR"], ["USD", "PHP"], ["GBP", "INR"], ["USD", "MXN"], ["GBP", "NGN"], ["EUR", "INR"],
  ["USD", "PKR"], ["GBP", "PHP"], ["CAD", "INR"], ["AUD", "INR"], ["USD", "NGN"], ["GBP", "PKR"],
];
// Disjoint from the guides' amounts (src/lib/guide-quote-corridor.ts), so a
// news table never repeats a guide's table either.
const NEWS_AMOUNTS = [450, 650, 1100, 1300, 1600, 1800, 2200, 2800];
const NEWS_TABLES: Map<string, { from: string; to: string; amount: number }> = (() => {
  const out = new Map<string, { from: string; to: string; amount: number }>();
  const used = new Map<string, number>();
  let fallback = 0;
  for (const item of [...newsItems].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))) {
    const c = topicalCorridor(item) ?? (() => {
      const [from, to] = FALLBACK_CORRIDORS[fallback++ % FALLBACK_CORRIDORS.length];
      return { from, to };
    })();
    const key = `${c.from}-${c.to}`;
    let n = used.get(key) ?? 0;
    // Skip an amount the route cannot fill with three quotes.
    while (n < NEWS_AMOUNTS.length - 1 && generateQuotes(NEWS_AMOUNTS[n], c.from, c.to).length < 3) n++;
    out.set(item.slug, { ...c, amount: NEWS_AMOUNTS[n % NEWS_AMOUNTS.length] });
    used.set(key, n + 1);
  }
  return out;
})();

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

// Generate relevant keywords from article metadata
function articleKeywords(item: { title: string; category: string; providerSlugs?: string[] }): string {
  const base = ["money transfer news", "international payments", "cross-border payments"];
  const categoryKw: Record<string, string[]> = {
    "Industry News": ["fintech news", "remittance industry"],
    "Provider Update": ["money transfer provider", "provider update"],
    Announcement: ["money transfer update", "remittance news"],
    Regulatory: ["payments regulation", "financial regulation", "compliance"],
  };
  const kws = [...base, ...(categoryKw[item.category] || [])];
  if (item.providerSlugs) {
    for (const slug of item.providerSlugs.slice(0, 3)) {
      kws.push(slug.replace(/-/g, " "));
    }
  }
  return kws.join(", ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsSlug" });
  const item = getNewsItem(slug);
  if (!item) return { title: "Not Found" };

  // Headline stays the <h1>; the <title> is the shorter SERP variant. 14 news
  // articles shipped an identical pair, 11 of them over the 70-char limit.
  return {
    title: seoTitle(item.title, item.metaTitle),
    description: seoDescription(item.excerpt),
    keywords: articleKeywords(item),
    openGraph: {
      title: item.title,
      description: item.excerpt,
      type: "article",
      publishedTime: item.publishedAt,
      images: item.image
        ? [{ url: `https://sendmoneycompare.com${item.image}` }]
        : DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt,
      ...(item.image && { images: [`https://sendmoneycompare.com${item.image}`] }),
    },
    alternates: getAlternates(`news/${slug}`, locale),
    // News content is English-only; noindex locale variants to avoid duplicate content
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    // Thin-page guard, matching /compare and /send-money: a news article is indexable
    // only if the sitemap lists it. Without this, every news article emitted
    // `index, follow` while the sitemap carried a subset — the contradictory
    // signal implicated in the May 8 deindex. Pages stay built and internally
    // linked; promote into SITEMAP_NEWS_SLUGS to make one indexable.
    // 2026-09-24: plus the articles the round-2 freelance brief opened.
    ...(locale === "en" && !newsIsIndexable(slug) && { robots: { index: false, follow: true } }),
  };
}

function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    "Industry News": "text-[var(--color-primary)] bg-[var(--color-primary-surface)]",
    "Provider Update": "text-[var(--color-success-dark)] bg-[var(--color-success-surface)]",
    Announcement: "text-[var(--color-on-surface)] bg-[var(--color-surface-container)]",
    Regulatory: "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)]",
  };
  return (
    <span className={`text-2xs font-medium px-2.5 py-1 rounded-full ${colorMap[category] || colorMap.Announcement}`}>
      {category}
    </span>
  );
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "newsSlug" });
  const item = getNewsItem(slug);
  if (!item) notFound();

  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <ScrollTracker slug={slug} contentType="news" />
      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: item.title,
            description: item.excerpt,
            datePublished: item.publishedAt,
            dateModified: item.updatedAt || item.publishedAt,
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://sendmoneycompare.com/news/${item.slug}` },
            ...(item.image && { image: `https://sendmoneycompare.com${item.image}` }),
            author: { "@type": "Person", name: "Ahsan Mukhtar", url: "https://sendmoneycompare.com/about/ahsan-mukhtar" },
            reviewedBy: { "@type": "Person", name: "Awais Imran", url: "https://sendmoneycompare.com/about/awais-imran" },
            isPartOf: { "@type": "WebPage", "@id": "https://sendmoneycompare.com/news" },
            about: { "@type": "Thing", name: "International Money Transfer" },
            publisher: {
              "@type": "Organization",
              name: "SendMoneyCompare",
              "@id": "https://sendmoneycompare.com/#organization",
              logo: { "@type": "ImageObject", url: "https://sendmoneycompare.com/logos/sendmoneycompare-logo.png", width: 512, height: 512 },
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["article h1", "article h2"],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
              { "@type": "ListItem", position: 2, name: "News", item: "https://sendmoneycompare.com/news" },
              { "@type": "ListItem", position: 3, name: item.title, item: `https://sendmoneycompare.com/news/${slug}` },
            ],
          }),
        }}
      />

      <Container className="py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: item.title }]} />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Hero image */}
            {item.image && (
              <div
                className={`relative w-full h-[240px] md:h-[340px] rounded-2xl overflow-hidden mb-8 ${
                  item.image.endsWith(".svg") ? "bg-[#05101f]" : ""
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt || item.title}
                  fill
                  className={item.image.endsWith(".svg") ? "object-contain" : "object-cover"}
                  priority
                />
              </div>
            )}

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <CategoryBadge category={item.category} />
                <Link href="/about/ahsan-mukhtar" className="text-2sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                  Ahsan Mukhtar
                </Link>
                <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                <time className="text-2sm text-[var(--color-on-surface-variant)]" dateTime={item.publishedAt}>
                  Published {formatLocalDate(item.publishedAt)}
                </time>
                {item.updatedAt && item.updatedAt !== item.publishedAt && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                    <time className="text-2sm text-[var(--color-on-surface-variant)]" dateTime={item.updatedAt}>
                      Updated {formatLocalDate(item.updatedAt)}
                    </time>
                  </>
                )}
                {/* Fact-checked badge — mirrors guide pages; reviewedBy is also in NewsArticle schema */}
                <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-3 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Fact-checked by{" "}
                  <Link href="/about/awais-imran" className="hover:underline">Awais Imran</Link>
                </div>
              </div>
              <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] leading-tight mb-4">
                {item.title}
              </h1>
              {/* No standfirst: it was the /news listing excerpt verbatim, so every
                  article repeated its own hub entry (round-2 audit, 2026-09-25).
                  The excerpt still serves as the meta description. */}
            </div>

            {/* Related providers */}
            {item.providerSlugs && item.providerSlugs.length > 0 && (
              <div className="flex items-center gap-2 mb-6 text-xs text-[var(--color-on-surface-variant)]">
                <span className="font-medium">Related:</span>
                {item.providerSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/companies/${slug}`}
                    className="text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2.5 py-0.5 rounded-full hover:underline"
                  >
                    {getProviderName(slug)}
                  </Link>
                ))}
              </div>
            )}

            {/* Keep the reporting contiguous. Generic USD/INR tables previously
                appeared twice on every story, including unrelated corridors. */}
            <div
              className="prose-custom text-md text-[var(--color-on-surface-variant)] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderDataTokens(item.content)) }}
            />

            {/* One table, after the reporting rather than inside it, on the
                corridor this story is about. The heading is the story's own,
                so the block is not a copy of every other article's; see
                NEWS_TABLES for how corridor and amount are kept distinct. Three
                rows rather than the guides' five; no inline partner card (TapTap
                stays in the page-end partner module on every news page). */}
            {(() => {
              const c = NEWS_TABLES.get(slug) ?? { from: "USD", to: "INR", amount: 500 };
              const lead = item.title.split(/[:—–(|]/)[0].trim();
              return (
                <InlineProviderQuotes
                  from={c.from}
                  to={c.to}
                  amount={c.amount}
                  source={`news:${slug}`}
                  heading={`${lead}: live ${c.from} → ${c.to} quotes`}
                  limit={3}
                  crossSell={false}
                />
              );
            })()}

            {/* Source */}
            {item.source && (
              <div className="mt-6 pt-4 border-t border-[var(--color-outline)] text-2sm text-[var(--color-on-surface-variant)]">
                Source:{" "}
                {item.sourceUrl ? (
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--color-primary)] hover:underline">
                    {item.source}
                  </a>
                ) : (
                  item.source
                )}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[300px] shrink-0">
            {/* Sticky container capped to the viewport height with internal
                scroll, so a long sidebar doesn't wait for the article to
                scroll to the bottom before its lower content is reachable. */}
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto space-y-6">
              <Link href="/news" className="block text-sm font-semibold text-[var(--color-primary)] hover:underline">
                More money transfer news →
              </Link>

              <Link
                href="/send-money"
                className="flex items-center justify-center rounded-full bg-[var(--color-success-dark)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-success-hover)]"
              >
                Compare transfer rates →
              </Link>
            </div>
          </aside>
        </div>
      </Container>
      {/* Sticky nudge — best live rate slides up after 30s or 50% scroll */}
    </div>
  );
}
