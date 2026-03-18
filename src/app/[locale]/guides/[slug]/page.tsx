import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/data/blog-posts";
import Breadcrumb from "@/components/Breadcrumb";
import { formatLocalDate } from "@/lib/format-date";
import { sanitizeHtml } from "@/lib/sanitize";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "guidesSlug" });
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.featuredImage && { images: [{ url: post.featuredImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
    alternates: getAlternates(`guides/${slug}`, locale),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guidesSlug");
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(post.featuredImage && { image: `https://sendmoneycompare.com${post.featuredImage}` }),
    author: { "@type": "Person", name: post.author, url: `https://sendmoneycompare.com/about/${post.author.toLowerCase().replace(/\s+/g, "-")}` },
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      "@id": "https://sendmoneycompare.com/#organization",
      logo: "https://sendmoneycompare.com/logos/sendmoneycompare-logo.png",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://sendmoneycompare.com/guides" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://sendmoneycompare.com/guides/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Article Hero ── */}
      <div className="border-b border-[var(--color-outline)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">

          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: post.title }]} />

          <div className="max-w-[720px]">
            {/* Category badge */}
            <div className="inline-flex items-center gap-1.5 text-overline text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-3 py-1.5 rounded-full mb-5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              {post.category}
            </div>

            {/* H1 — Instrument Serif for editorial authority */}
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.18] tracking-[-0.02em] text-[var(--color-on-surface)] mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-md md:text-lg text-[var(--color-on-surface-variant)] leading-[1.7] mb-7 max-w-[620px]">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[var(--color-outline)]">
              <Link href="/about/akif-hazarvi" className="flex items-center gap-2 text-2sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] border border-[var(--color-primary-light)] flex items-center justify-center text-2xs font-bold text-[var(--color-primary)]">
                  {post.author.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                {post.author}
              </Link>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <time dateTime={post.updatedAt} className="text-2sm text-[var(--color-on-surface-variant)]">
                Updated {formatLocalDate(post.updatedAt)}
              </time>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <span className="text-2sm text-[var(--color-on-surface-variant)]">{post.readTime}</span>
              {/* Fact-checked badge */}
              <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-3 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Fact Checked
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured Image ── */}
      {post.featuredImage && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -mt-1">
          <div className="relative w-full h-[220px] md:h-[380px] rounded-b-2xl overflow-hidden">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <Container className="py-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Article ── */}
          <article className="flex-1 min-w-0">

            {/* Key Takeaway */}
            {post.excerpt && (
              <div className="callout-key-takeaway mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-overline text-[var(--color-primary)] mb-1">Key Takeaway</p>
                    <p className="text-md text-[var(--color-on-surface)] leading-relaxed font-medium">{post.excerpt}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile TOC — collapsible */}
            {post.sections.length > 0 && (
              <details className="lg:hidden mb-8 border border-[var(--color-outline)] rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 bg-[var(--color-surface-dim)] text-sm font-semibold text-[var(--color-on-surface)] select-none">
                  <span>In this guide ({post.sections.length + (post.faqs?.length ? 1 : 0)} sections)</span>
                  <svg className="w-4 h-4 text-[var(--color-on-surface-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <ol className="divide-y divide-[var(--color-outline)]">
                  {post.sections.map((section, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`} className="block px-5 py-3 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors">
                        {section.heading}
                      </a>
                    </li>
                  ))}
                  {post.faqs?.length ? (
                    <li>
                      <a href="#faqs" className="block px-5 py-3 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors">
                        Frequently Asked Questions
                      </a>
                    </li>
                  ) : null}
                </ol>
              </details>
            )}

            {/* Desktop TOC — inside article on small-medium screens, hidden when sidebar TOC shows */}
            {post.sections.length > 0 && (
              <div className="hidden lg:block xl:hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-5 mb-8">
                <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">In this guide</p>
                <ol className="space-y-1.5">
                  {post.sections.map((section, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`} className="text-2sm text-[var(--color-primary)] hover:underline leading-snug block">
                        {section.heading}
                      </a>
                    </li>
                  ))}
                  {post.faqs?.length ? (
                    <li>
                      <a href="#faqs" className="text-2sm text-[var(--color-primary)] hover:underline">Frequently Asked Questions</a>
                    </li>
                  ) : null}
                </ol>
              </div>
            )}

            {/* Article Sections */}
            {post.sections.map((section, i) => (
              <section key={i} id={`section-${i}`} className="mb-12">
                <h2 className="font-display text-[clamp(1.375rem,3vw,1.625rem)] font-normal leading-[1.28] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5">
                  {section.heading}
                </h2>
                <div
                  className="prose-content prose-custom"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
                />
              </section>
            ))}

            {/* FAQs */}
            {post.faqs?.length ? (
              <section id="faqs" className="mb-12">
                <h2 className="text-h3 font-semibold text-[var(--color-on-surface)] mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {post.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group border border-[var(--color-outline)] rounded-xl overflow-hidden"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-md font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors select-none">
                        {faq.question}
                        <svg
                          className="w-4 h-4 text-[var(--color-on-surface-muted)] transition-transform group-open:rotate-180 shrink-0 ml-4"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 pt-1 text-md text-[var(--color-on-surface-variant)] leading-relaxed border-t border-[var(--color-outline)]">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--color-outline)]">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] border border-[var(--color-outline)] px-3 py-1 rounded-full hover:border-[var(--color-primary-light)] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:w-[300px] xl:w-[320px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Desktop TOC — sticky in sidebar */}
              {post.sections.length > 0 && (
                <div className="hidden xl:block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-[var(--shadow-xs)] p-5">
                  <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">In this guide</p>
                  <ol className="space-y-0.5">
                    {post.sections.map((section, i) => (
                      <li key={i}>
                        <a
                          href={`#section-${i}`}
                          className="block text-2sm text-[var(--color-on-surface-variant)] py-1.5 px-3 rounded-lg hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all leading-snug"
                        >
                          {section.heading}
                        </a>
                      </li>
                    ))}
                    {post.faqs?.length ? (
                      <li>
                        <a href="#faqs" className="block text-2sm text-[var(--color-on-surface-variant)] py-1.5 px-3 rounded-lg hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all">
                          Frequently Asked Questions
                        </a>
                      </li>
                    ) : null}
                  </ol>
                </div>
              )}

              {/* Comparison CTA */}
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--color-outline)]">
                <div className="bg-[var(--color-primary)] px-5 py-4">
                  <p className="text-md font-semibold text-white mb-1">Find the best rate today</p>
                  <p className="text-2sm text-white/70">Compare 60+ providers in seconds</p>
                </div>
                <div className="bg-[var(--color-surface)] px-5 py-4 space-y-3">
                  <Link
                    href="/send-money"
                    className="flex items-center justify-center w-full h-10 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Compare Rates →
                  </Link>
                  <div className="flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1 text-2xs text-[var(--color-on-surface-muted)]">
                      <svg className="w-3 h-3 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      60+ providers
                    </span>
                    <span className="flex items-center gap-1 text-2xs text-[var(--color-on-surface-muted)]">
                      <svg className="w-3 h-3 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      Live rates
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Guides */}
              {relatedPosts.length > 0 && (
                <div>
                  <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">Related Guides</p>
                  <div className="space-y-2.5">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/guides/${related.slug}`}
                        className="group block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-4 hover:shadow-[var(--shadow-sm)] hover:border-[var(--color-primary-light)] transition-all"
                      >
                        <span className="text-overline text-[var(--color-primary)] mb-2 block">
                          {related.category}
                        </span>
                        <h4 className="text-2sm font-semibold text-[var(--color-on-surface)] leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                          {related.title}
                        </h4>
                        <span className="text-2xs text-[var(--color-on-surface-muted)] mt-1.5 block">{related.readTime}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Explore more */}
              <div>
                <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">Explore</p>
                <ul className="space-y-1">
                  {[
                    { href: "/companies", label: "Provider reviews" },
                    { href: "/compare", label: "Head-to-head comparisons" },
                    { href: "/send-money/uk-to-india", label: "UK to India transfers" },
                    { href: "/send-money/usa-to-india", label: "USA to India transfers" },
                    { href: "/send-money/usa-to-pakistan", label: "USA to Pakistan transfers" },
                    { href: "/send-money/usa-to-mexico", label: "USA to Mexico transfers" },
                    { href: "/send-money/uk-to-europe", label: "UK to Europe transfers" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-1.5 text-2sm text-[var(--color-primary)] py-1 hover:underline"
                      >
                        <span className="text-[var(--color-primary-light)]">›</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
