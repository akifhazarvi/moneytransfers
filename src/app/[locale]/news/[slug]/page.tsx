import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { newsItems, getNewsItem, getLatestNews } from "@/data/news";
import { getProviderName } from "@/data/providers";
import { formatLocalDate } from "@/lib/format-date";
import { sanitizeHtml } from "@/lib/sanitize";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ScrollTracker } from "@/components/ScrollTracker";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import GuidePageNudge from "@/components/GuidePageNudge";

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

  return {
    title: item.title,
    description: item.excerpt,
    keywords: articleKeywords(item),
    openGraph: {
      title: item.title,
      description: item.excerpt,
      type: "article",
      publishedTime: item.publishedAt,
      ...(item.image && { images: [{ url: `https://sendmoneycompare.com${item.image}` }] }),
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

  const related = getLatestNews(4).filter((n) => n.slug !== slug).slice(0, 3);

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
            author: { "@type": "Person", name: "Akif Hazarvi", url: "https://sendmoneycompare.com/about/akif-hazarvi" },
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
              <div className="flex items-center gap-3 mb-4">
                <CategoryBadge category={item.category} />
                <time className="text-2sm text-[var(--color-on-surface-variant)]" dateTime={item.publishedAt}>
                  {formatLocalDate(item.publishedAt)}
                </time>
              </div>
              <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] leading-tight mb-4">
                {item.title}
              </h1>
              <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed">
                {item.excerpt}
              </p>
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

            {/* Content — split at midpoint with live quotes injected in the middle */}
            {(() => {
              const clean = sanitizeHtml(item.content);
              // Split on </p> boundaries so we never cut mid-tag
              const parts = clean.split(/(?<=<\/p>)/);
              const mid = Math.ceil(parts.length / 2);
              const firstHalf = parts.slice(0, mid).join("");
              const secondHalf = parts.slice(mid).join("");
              return (
                <>
                  <div
                    className="prose-custom text-md text-[var(--color-on-surface-variant)] leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: firstHalf }}
                  />
                  <InlineProviderQuotes
                    from="USD"
                    to="INR"
                    amount={1000}
                    source={`news:${slug}:mid`}
                    heading="Don't overpay on your next transfer"
                    subheading="Live rates from 50+ apps — see who's cheapest right now"
                  />
                  {secondHalf && (
                    <div
                      className="prose-custom text-md text-[var(--color-on-surface-variant)] leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: secondHalf }}
                    />
                  )}
                </>
              );
            })()}

            {/* Live provider quotes — at the end */}
            <InlineProviderQuotes
              from="USD"
              to="INR"
              amount={1000}
              source={`news:${slug}:end`}
              heading="Ready to send? Here's the cheapest provider today"
              subheading="Compare 50+ apps — free, no signup required"
            />

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
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Latest news */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-4">Latest News</h3>
                  <div className="space-y-3">
                    {related.map((n) => (
                      <Link key={n.slug} href={`/news/${n.slug}`} className="block group">
                        <div className="border border-[var(--color-outline)] rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                          {n.image && (
                            <div
                              className={`relative w-full h-[100px] ${
                                n.image.endsWith(".svg") ? "bg-[#05101f]" : ""
                              }`}
                            >
                              <Image
                                src={n.image}
                                alt={n.imageAlt || n.title}
                                fill
                                className={n.image.endsWith(".svg") ? "object-contain" : "object-cover"}
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <CategoryBadge category={n.category} />
                            <h4 className="text-sm font-medium text-[var(--color-on-surface)] mt-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                              {n.title}
                            </h4>
                            <time className="text-2xs text-[var(--color-on-surface-variant)] mt-1 block" dateTime={n.publishedAt}>
                              {formatLocalDate(n.publishedAt, { month: "short", day: "numeric" })}
                            </time>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Live rates CTA */}
              <div className="overflow-hidden rounded-2xl border border-[var(--color-success-dark)]/20">
                <div className="bg-[var(--color-success-dark)] px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    <p className="text-xs font-bold text-white uppercase tracking-wide">Live rates</p>
                  </div>
                  <p className="text-md font-semibold text-white">Find the cheapest provider today</p>
                  <p className="text-2sm text-white/75 mt-0.5">50+ apps compared in real time</p>
                </div>
                <div className="bg-[var(--color-surface)] px-5 py-4 space-y-3">
                  <Link
                    href="/send-money"
                    className="flex items-center justify-center w-full h-11 bg-[var(--color-success-dark)] text-white text-sm font-bold rounded-full hover:bg-[var(--color-success-hover)] transition-colors shadow-[0_2px_8px_rgba(5,150,105,0.3)]"
                  >
                    Compare Rates Now →
                  </Link>
                  <p className="text-center text-2xs text-[var(--color-on-surface-muted)]">
                    Free · No signup · Updated every 6h
                  </p>
                </div>
              </div>

              {/* Guides link */}
              <div>
                <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-4">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/guides" className="text-2sm text-[var(--color-primary)] hover:underline">Guides & tutorials</Link></li>
                  <li><Link href="/companies" className="text-2sm text-[var(--color-primary)] hover:underline">Provider reviews</Link></li>
                  <li><Link href="/compare" className="text-2sm text-[var(--color-primary)] hover:underline">Head-to-head comparisons</Link></li>
                  <li><Link href="/send-money/uk-to-india" className="text-2sm text-[var(--color-primary)] hover:underline">UK to India transfers</Link></li>
                  <li><Link href="/send-money/usa-to-india" className="text-2sm text-[var(--color-primary)] hover:underline">USA to India transfers</Link></li>
                  <li><Link href="/send-money/usa-to-mexico" className="text-2sm text-[var(--color-primary)] hover:underline">USA to Mexico transfers</Link></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
      {/* Sticky nudge — best live rate slides up after 30s or 50% scroll */}
      <GuidePageNudge from="USD" to="INR" amount={1000} slug={slug} />
    </div>
  );
}
