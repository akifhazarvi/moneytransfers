import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/data/blog-posts";
import { formatLocalDate } from "@/lib/format-date";
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
    alternates: {
      canonical: `https://sendmoneycompare.com/guides/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guidesSlug");
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug);

  // FAQ JSON-LD for SEO
  const faqSchema = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  // HowTo JSON-LD for step-by-step guides
  const howToSchema = post.howToSteps?.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.title,
        description: post.metaDescription,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        step: post.howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      }
    : null;

  // Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(post.featuredImage && { image: `https://sendmoneycompare.com${post.featuredImage}` }),
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      <Container className="py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[13px] text-[var(--color-on-surface-variant)] mb-6">
          <Link href="/" className="hover:text-[var(--color-primary)]">
            Home
          </Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-[var(--color-primary)]">
            Guides
          </Link>
          <span>/</span>
          <span className="text-[var(--color-on-surface)] truncate max-w-[300px]">
            {post.title}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full h-[240px] md:h-[340px] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2.5 py-1 rounded-full">
                {post.category}
              </span>
              <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mt-4 mb-3 leading-tight">
                {post.title}
              </h1>
              <p className="text-[15px] text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-[var(--color-on-surface-variant)]">
                <span>{post.author}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                <time dateTime={post.updatedAt}>
                  Updated{" "}
                  {formatLocalDate(post.updatedAt)}
                </time>
                <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 mb-8">
              <h2 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-3">
                In this article
              </h2>
              <ol className="space-y-1.5">
                {post.sections.map((section, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="text-[13px] text-[var(--color-primary)] hover:underline"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
                {post.faqs?.length ? (
                  <li>
                    <a
                      href="#faqs"
                      className="text-[13px] text-[var(--color-primary)] hover:underline"
                    >
                      Frequently Asked Questions
                    </a>
                  </li>
                ) : null}
              </ol>
            </div>

            {/* Sections */}
            {post.sections.map((section, i) => (
              <section key={i} id={`section-${i}`} className="mb-10">
                <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                  {section.heading}
                </h2>
                <div
                  className="prose-custom text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}

            {/* FAQs */}
            {post.faqs?.length ? (
              <section id="faqs" className="mb-10">
                <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group border border-[var(--color-outline)] rounded-xl"
                    >
                      <summary className="flex items-center justify-between cursor-pointer p-5 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] rounded-xl transition-colors">
                        {faq.question}
                        <span className="text-[var(--color-on-surface-variant)] transition-transform group-open:rotate-180 ml-4 shrink-0">
                          &#9662;
                        </span>
                      </summary>
                      <div className="px-5 pb-5 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
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
                  className="text-[12px] text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[300px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-4">
                    Related Guides
                  </h3>
                  <div className="space-y-3">
                    {relatedPosts.map((related) => (
                      <Card
                        key={related.slug}
                        href={`/guides/${related.slug}`}
                        className="!p-4"
                      >
                        <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                          {related.category}
                        </span>
                        <h4 className="text-[14px] font-medium text-[var(--color-on-surface)] mt-2 leading-snug">
                          {related.title}
                        </h4>
                        <span className="text-[12px] text-[var(--color-on-surface-variant)] mt-1 block">
                          {related.readTime}
                        </span>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#3a5ba6] rounded-xl p-5 text-white">
                <h3 className="text-[15px] font-medium mb-2">
                  Compare Providers Now
                </h3>
                <p className="text-[13px] text-white/80 mb-4">
                  Find the cheapest way to send money with our real-time
                  comparison tool.
                </p>
                <Link
                  href="/send-money"
                  className="block text-center bg-[var(--color-surface)] text-[var(--color-primary)] px-4 py-2.5 rounded-full text-[13px] font-medium hover:bg-[var(--color-primary-surface)] transition-colors"
                >
                  Compare Rates
                </Link>
              </div>

              {/* Explore more */}
              <div>
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-4">
                  Explore
                </h3>
                <ul className="space-y-2">
                  <li><Link href="/companies" className="text-[13px] text-[var(--color-primary)] hover:underline">Provider reviews</Link></li>
                  <li><Link href="/compare" className="text-[13px] text-[var(--color-primary)] hover:underline">Head-to-head comparisons</Link></li>
                  <li><Link href="/send-money/usa-to-india" className="text-[13px] text-[var(--color-primary)] hover:underline">USA to India transfers</Link></li>
                  <li><Link href="/send-money/usa-to-pakistan" className="text-[13px] text-[var(--color-primary)] hover:underline">USA to Pakistan transfers</Link></li>
                  <li><Link href="/send-money/uk-to-europe" className="text-[13px] text-[var(--color-primary)] hover:underline">UK to Europe transfers</Link></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
