import { seoDescription } from "@/lib/seo-title";
import Badge from "@/components/Badge";
import Link from "@/components/EligibleLink";
import Image from "next/image";
import Container from "@/components/Container";
import { getLatestNews, newsItems } from "@/data/news";
import { newsIsIndexable } from "@/lib/seo-indexing";
import { isLinkEligible } from "@/lib/link-eligibility";
import { formatLocalDate } from "@/lib/format-date";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageByline } from "@/components/PageByline";
import { EDITORIAL_AUTHOR_SLUG, pageUpdated } from "@/lib/content-dates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    alternates: getAlternates("news", locale),
    keywords: t("metaKeywords"),
    openGraph: {
      title: t("heading"),
      description: t("subheading"),
      url: "https://sendmoneycompare.com/news",
      images: DEFAULT_OG_IMAGES,
    },
  };
}


export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "news" });
  // Only items open to Google are listed (round-4 brief §0.1 withdrew nine
  // short items; a listed title with no link is an empty block). Withdrawn
  // items still render and stay in sitemap.xml for Bing.
  const latest = getLatestNews(40).filter((i) => isLinkEligible(`/news/${i.slug}`)).slice(0, 20);
  const featured = latest[0];
  const rest = latest.slice(1);

  // Submitted articles that fall outside the 20 most recent. The grid above is
  // capped at 20, so three sitemap-listed articles had no incoming internal
  // link at all — reachable only via sitemap.xml. An archive strip is cheaper
  // than raising the cap and keeps the visual hierarchy of the hub intact.
  const shownSlugs = new Set(latest.map((i) => i.slug));
  const archive = newsItems
    .filter((i) => newsIsIndexable(i.slug) && isLinkEligible(`/news/${i.slug}`) && !shownSlugs.has(i.slug))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] mb-2">
            {t("heading")}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] max-w-2xl">
            {t("subheading")}
          </p>
          {/* Round-3 QA item 7: a named editor and the hub's content date (its
              sitemap lastmod). Each story carries its own. */}
          <div className="mt-3">
            <PageByline authorSlug={EDITORIAL_AUTHOR_SLUG} updated={pageUpdated("/news")} cadence={null} sourcesHref="/editorial-policy" sourcesLabel="Editorial policy" />
          </div>
        </div>

        <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3 max-w-3xl mb-8">
          <p>
            The international money transfer industry is evolving rapidly — new regulations, provider launches, and technology shifts can directly affect how much you pay to send money abroad. We track the developments that matter most to consumers and businesses making cross-border payments.
          </p>
          <p>
            From central bank policy changes that move exchange rates, to new instant payment mandates that speed up delivery times, to provider-specific updates on fees and coverage — our news coverage focuses on the practical impact for people who send money internationally.
          </p>
          {/* Section policy — round-4 brief worksheet 04 ("what is published, sources"). */}
          <p>
            <strong className="text-[var(--color-on-surface)]">What we publish and where it comes from.</strong> An item runs
            when something changes what sending money abroad costs, how long it takes or which rules apply: a law or
            regulation, a central bank decision, a change to a payment system, or a provider changing its fees, limits or
            coverage. Each item links the primary source, meaning the regulator&rsquo;s notice, the central bank&rsquo;s statement
            or the company&rsquo;s own announcement, and where our quote data shows the effect, it says what the data shows. We
            do not publish paid or sponsored news.
          </p>
          <p>
            When the facts behind an item change, the item gets an update note; an item we can no longer stand behind is
            withdrawn rather than left up. Corrections are listed on our{" "}
            <Link href="/corrections" className="text-[var(--color-primary)] hover:underline">corrections page</Link>, and the
            standards are in our{" "}
            <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">editorial policy</Link>.
          </p>
        </div>

        {/* Featured article */}
        {featured && (
          <Link href={`/news/${featured.slug}`} className="block mb-8">
            <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl overflow-hidden hover:shadow-md transition-shadow md:flex">
              {featured.image && (
                <div
                  className={`relative w-full md:w-[400px] h-[200px] md:h-auto shrink-0 ${
                    featured.image.endsWith(".svg") ? "bg-[#05101f]" : ""
                  }`}
                >
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt || featured.title}
                    fill
                    className={featured.image.endsWith(".svg") ? "object-contain" : "object-cover"}
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <Badge label={featured.category} category={featured.category} />
                  <time className="text-xs text-[var(--color-on-surface-variant)]" dateTime={featured.publishedAt}>
                    {formatLocalDate(featured.publishedAt)}
                  </time>
                </div>
                <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-3 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed max-w-3xl">
                  {featured.excerpt}
                </p>
                <span className="inline-block mt-4 text-sm font-medium text-[var(--color-primary)]">
                  Read more &rarr;
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* News grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="group">
              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden h-full hover:shadow-md transition-shadow flex flex-col">
                {item.image && (
                  <div
                    className={`relative w-full h-[160px] ${
                      item.image.endsWith(".svg") ? "bg-[#05101f]" : ""
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      fill
                      className={item.image.endsWith(".svg") ? "object-contain" : "object-cover"}
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge label={item.category} category={item.category} />
                    <time className="text-2xs text-[var(--color-on-surface-variant)]" dateTime={item.publishedAt}>
                      {formatLocalDate(item.publishedAt, { month: "short", day: "numeric" })}
                    </time>
                  </div>
                  <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                    {item.title.replace(/\s*\((?:[A-Za-z]+\s+)?20\d\d\)\s*$/, "").replace(/\s+20\d\d\s*$/, "")}
                  </h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed flex-1">
                    {item.excerpt}
                  </p>
                  <span className="inline-block mt-3 text-2sm font-medium text-[var(--color-primary)]">
                    Read more &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Guides link */}
        <div className="mt-12 pt-8 border-t border-[var(--color-outline)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-normal text-[var(--color-on-surface)] mb-1">
                {t("lookingForGuides")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                {t("guidesDescription")}
              </p>
            </div>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 h-10 px-6 text-2sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-surface)] transition-colors shrink-0"
            >
              {t("browseGuides")} &rarr;
            </Link>
          </div>
        </div>
        {archive.length > 0 && (
          // A section, not a nav: the archive is this hub's content — the
          // index of its children — not site navigation (brief §5.3 counts
          // in-content links outside nav/aside).
          <section aria-label="News archive" className="mt-12 border-t border-[var(--color-outline)] pt-8">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-4">Archive</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {archive.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    {item.title.replace(/\s*\((?:[A-Za-z]+\s+)?20\d\d\)\s*$/, "").replace(/\s+20\d\d\s*$/, "")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </div>
  );
}
