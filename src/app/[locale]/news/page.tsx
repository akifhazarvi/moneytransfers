import Badge from "@/components/Badge";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { getLatestNews } from "@/data/news";
import { formatLocalDate } from "@/lib/format-date";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("news", locale),
    keywords: t("metaKeywords"),
    openGraph: {
      title: t("heading"),
      description: t("subheading"),
      url: "https://sendmoneycompare.com/news",
    },
  };
}


export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const latest = getLatestNews(20);
  const featured = latest[0];
  const rest = latest.slice(1);

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
        </div>

        <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3 max-w-3xl mb-8">
          <p>
            The international money transfer industry is evolving rapidly — new regulations, provider launches, and technology shifts can directly affect how much you pay to send money abroad. We track the developments that matter most to consumers and businesses making cross-border payments.
          </p>
          <p>
            From central bank policy changes that move exchange rates, to new instant payment mandates that speed up delivery times, to provider-specific updates on fees and coverage — our news coverage focuses on the practical impact for people who send money internationally.
          </p>
        </div>

        {/* Featured article */}
        {featured && (
          <Link href={`/news/${featured.slug}`} className="block mb-8">
            <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl overflow-hidden hover:shadow-md transition-shadow md:flex">
              {featured.image && (
                <div className="relative w-full md:w-[400px] h-[200px] md:h-auto shrink-0">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt || featured.title}
                    fill
                    className="object-cover"
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
                  <div className="relative w-full h-[160px]">
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      fill
                      className="object-cover"
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
                    {item.title}
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
              {t("browseGuides")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
