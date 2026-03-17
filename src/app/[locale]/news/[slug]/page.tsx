import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { newsItems, getNewsItem, getLatestNews } from "@/data/news";
import { getProviderName } from "@/data/providers";
import { formatLocalDate } from "@/lib/format-date";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

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
    alternates: {
      canonical: `https://sendmoneycompare.com/news/${slug}`,
    },
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
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${colorMap[category] || colorMap.Announcement}`}>
      {category}
    </span>
  );
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("newsSlug");
  const item = getNewsItem(slug);
  if (!item) notFound();

  const related = getLatestNews(4).filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
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
            ...(item.image && { image: `https://sendmoneycompare.com${item.image}` }),
            author: { "@type": "Organization", name: "SendMoneyCompare" },
            publisher: { "@type": "Organization", name: "SendMoneyCompare" },
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
              { "@type": "ListItem", position: 3, name: item.title },
            ],
          }),
        }}
      />

      <Container className="py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[13px] text-[var(--color-on-surface-variant)] mb-6">
          <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
          <span>/</span>
          <Link href="/news" className="hover:text-[var(--color-primary)]">News</Link>
          <span>/</span>
          <span className="text-[var(--color-on-surface)] truncate max-w-[300px]">{item.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Hero image */}
            {item.image && (
              <div className="relative w-full h-[240px] md:h-[340px] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={item.image}
                  alt={item.imageAlt || item.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CategoryBadge category={item.category} />
                <time className="text-[13px] text-[var(--color-on-surface-variant)]" dateTime={item.publishedAt}>
                  {formatLocalDate(item.publishedAt)}
                </time>
              </div>
              <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] leading-tight mb-4">
                {item.title}
              </h1>
              <p className="text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed">
                {item.excerpt}
              </p>
            </div>

            {/* Related providers */}
            {item.providerSlugs && item.providerSlugs.length > 0 && (
              <div className="flex items-center gap-2 mb-6 text-[12px] text-[var(--color-on-surface-variant)]">
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

            {/* Content */}
            <div
              className="prose-custom text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            {/* Source */}
            {item.source && (
              <div className="mt-6 pt-4 border-t border-[var(--color-outline)] text-[13px] text-[var(--color-on-surface-variant)]">
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
                  <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-4">Latest News</h3>
                  <div className="space-y-3">
                    {related.map((n) => (
                      <Link key={n.slug} href={`/news/${n.slug}`} className="block group">
                        <div className="border border-[var(--color-outline)] rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                          {n.image && (
                            <div className="relative w-full h-[100px]">
                              <Image
                                src={n.image}
                                alt={n.imageAlt || n.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <CategoryBadge category={n.category} />
                            <h4 className="text-[14px] font-medium text-[var(--color-on-surface)] mt-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                              {n.title}
                            </h4>
                            <time className="text-[11px] text-[var(--color-on-surface-variant)] mt-1 block" dateTime={n.publishedAt}>
                              {formatLocalDate(n.publishedAt, { month: "short", day: "numeric" })}
                            </time>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#3a5ba6] rounded-xl p-5 text-white">
                <h3 className="text-[15px] font-medium mb-2">Compare Providers Now</h3>
                <p className="text-[13px] text-white/80 mb-4">
                  Find the cheapest way to send money with our real-time comparison tool.
                </p>
                <Link
                  href="/send-money"
                  className="block text-center bg-[var(--color-surface)] text-[var(--color-primary)] px-4 py-2.5 rounded-full text-[13px] font-medium hover:bg-[var(--color-primary-surface)] transition-colors"
                >
                  Compare Rates
                </Link>
              </div>

              {/* Guides link */}
              <div>
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-4">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/guides" className="text-[13px] text-[var(--color-primary)] hover:underline">Guides & tutorials</Link></li>
                  <li><Link href="/companies" className="text-[13px] text-[var(--color-primary)] hover:underline">Provider reviews</Link></li>
                  <li><Link href="/compare" className="text-[13px] text-[var(--color-primary)] hover:underline">Head-to-head comparisons</Link></li>
                  <li><Link href="/send-money/uk-to-india" className="text-[13px] text-[var(--color-primary)] hover:underline">UK to India transfers</Link></li>
                  <li><Link href="/send-money/usa-to-india" className="text-[13px] text-[var(--color-primary)] hover:underline">USA to India transfers</Link></li>
                  <li><Link href="/send-money/usa-to-mexico" className="text-[13px] text-[var(--color-primary)] hover:underline">USA to Mexico transfers</Link></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
