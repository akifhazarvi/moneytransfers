import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import { businessPages, getBusinessPage } from "@/data/business-pages";
import { sanitizeHtml } from "@/lib/sanitize";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return businessPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const page = getBusinessPage(slug);
  if (!page) return { title: "Not Found" };

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: getAlternates(`business/${slug}`, locale),
    // Business content is English-only; noindex locale variants to avoid duplicate content
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://sendmoneycompare.com/business/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function BusinessSubPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const page = getBusinessPage(slug);
  if (!page) notFound();

  // FAQPage rich results restricted to government/healthcare since Aug 2023.
  // FAQ content rendered on page for users and AI crawlers.

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sendmoneycompare.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Business Payments",
        item: "https://sendmoneycompare.com/business",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: `https://sendmoneycompare.com/business/${slug}`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    author: {
      "@type": "Person",
      name: "Akif Hazarvi",
      url: "https://sendmoneycompare.com/about/akif-hazarvi",
    },
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      "@id": "https://sendmoneycompare.com/#organization",
      url: "https://sendmoneycompare.com",
      logo: { "@type": "ImageObject", url: "https://sendmoneycompare.com/logos/sendmoneycompare-logo.png", width: 512, height: 512 },
    },
    datePublished: "2026-02-15",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: `https://sendmoneycompare.com/business/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ─── HERO ─── */}
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Business Payments", href: "/business" }, { label: page.title }]} />
          <div className="max-w-3xl">
            <h1 className="text-h3 md:text-h2-plus font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {page.heading}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed max-w-2xl">
              {page.intro}
            </p>
            <div className="flex items-center gap-4 mt-4 text-2sm text-[var(--color-on-surface-variant)]">
              <span>
                By{" "}
                <Link
                  href="/about/akif-hazarvi"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Akif Hazarvi
                </Link>
              </span>
              <span>Updated March 2026</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Content sections ─── */}
      <section className="py-10">
        <Container>
          <article className="max-w-3xl mx-auto prose-custom">
            {page.sections.map((section, i) => (
              <div key={i} className="mb-10">
                <h2 className="text-h4 md:text-h4-plus font-normal text-[var(--color-on-surface)] mb-4">
                  {section.heading}
                </h2>
                <div
                  className="text-md text-[var(--color-on-surface-variant)] leading-relaxed [&_a]:text-[var(--color-primary)] [&_a]:underline [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-[var(--color-on-surface)] [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:my-4 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:pl-6 [&_li]:mb-2 [&_p]:mb-4 [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_th]:text-left [&_th]:py-2 [&_th]:px-3 [&_th]:font-medium [&_th]:border-b-2 [&_th]:border-[var(--color-outline)] [&_td]:py-2 [&_td]:px-3 [&_td]:border-b [&_td]:border-[var(--color-outline)] [&_strong]:text-[var(--color-on-surface)]"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(section.content),
                  }}
                />
              </div>
            ))}
          </article>
        </Container>
      </section>

      {/* ─── FAQ section ─── */}
      {page.faqs.length > 0 && (
        <section className="py-10 bg-[var(--color-surface-dim)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h4 md:text-h4-plus font-normal text-[var(--color-on-surface)] mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-6">
                {page.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Related guides ─── */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-normal text-[var(--color-on-surface)] mb-4">
              Related guides
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/business"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  ← All Business Payment Guides
                </Link>
              </li>
              {page.relatedGuides.map((guideSlug) => (
                <li key={guideSlug}>
                  <Link
                    href={`/guides/${guideSlug}`}
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {guideSlug
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/send-money"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Compare Live Transfer Rates →
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
