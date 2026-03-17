import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { authors, getAuthor } from "@/data/authors";
import { blogPosts } from "@/data/blog-posts";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ author: string; locale: string }>;
}

export async function generateStaticParams() {
  return authors.map((a) => ({ author: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author: slug, locale } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: "Not Found" };

  return {
    title: `${author.name} — ${author.role} at SendMoneyCompare`,
    description: author.byline,
    openGraph: {
      title: `${author.name} — ${author.role}`,
      description: author.byline,
      type: "profile",
    },
    alternates: getAlternates(`about/${slug}`, locale),
  };
}

export default async function AuthorPage({ params }: Props) {
  const { author: slug, locale } = await params;
  setRequestLocale(locale);
  const author = getAuthor(slug);
  if (!author) notFound();

  const authorPosts = blogPosts
    .filter((p) => p.author === author.name)
    .slice(0, 10);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `https://sendmoneycompare.com/about/${slug}#person`,
    name: author.name,
    url: `https://sendmoneycompare.com/about/${slug}`,
    jobTitle: author.role,
    worksFor: {
      "@type": "Organization",
      "@id": "https://sendmoneycompare.com/#organization",
      name: "SendMoneyCompare",
    },
    description: author.byline,
    knowsAbout: author.expertise,
    ...(author.linkedin && { sameAs: [author.linkedin] }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://sendmoneycompare.com/about" },
      { "@type": "ListItem", position: 3, name: author.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            {" / "}
            <Link href="/about" className="hover:text-[var(--color-primary)]">About</Link>
            {" / "}
            <span className="text-[var(--color-on-surface)]">{author.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center text-[24px] font-medium text-[var(--color-primary)] shrink-0">
                {author.initials}
              </div>
              <div>
                <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] leading-tight">
                  {author.name}
                </h1>
                <p className="text-[15px] text-[var(--color-primary)] mt-1">{author.role}</p>
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] mt-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl space-y-10">
            {/* Bio */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">About</h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                {author.bio.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Expertise */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">Areas of expertise</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {author.expertise.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[14px] text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] rounded-lg p-3">
                    <span className="text-[var(--color-primary)]">&#10003;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">Credentials</h2>
              <ul className="space-y-2">
                {author.credentials.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] text-[var(--color-on-surface-variant)]">
                    <span className="text-[var(--color-primary)] mt-0.5 shrink-0">&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Published articles */}
            {authorPosts.length > 0 && (
              <div>
                <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                  Published articles ({author.articlesWritten})
                </h2>
                <div className="space-y-3">
                  {authorPosts.map((post) => (
                    <Card key={post.slug} href={`/guides/${post.slug}`} className="!p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-[var(--color-on-surface-variant)]">{post.readTime}</span>
                      </div>
                      <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] leading-snug">
                        {post.title}
                      </h3>
                    </Card>
                  ))}
                </div>
                {author.articlesWritten > 10 && (
                  <Link href="/guides" className="text-[14px] text-[var(--color-primary)] hover:underline mt-4 inline-block">
                    View all guides &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
