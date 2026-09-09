"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3, Flame, Newspaper } from "lucide-react";
import { CATEGORY_ICONS, type GuideCard } from "@/components/GuidePreview";
import { formatLocalDate } from "@/lib/format-date";
import type { ReactNode } from "react";

export interface NewsCard {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
}

export interface CategorySection {
  category: string;
  /** How many guides the topic filter would show — not how many are listed here. */
  total: number;
  slugs: string[];
}

interface Props {
  /** Demand-ranked, most read first. Lead card plus the rail beside it. */
  topRead: GuideCard[];
  /** Newest first, dated on whichever of published/updated is later. */
  latest: GuideCard[];
  news: NewsCard[];
  categories: CategorySection[];
  bySlug: Map<string, GuideCard>;
  researchDesk: ReactNode;
  onSelectCategory: (category: string) => void;
}

/** The later of the two dates, and whether it was a revision rather than a launch. */
function lastTouched(post: GuideCard) {
  const revised = post.updatedAt > post.publishedAt;
  return { date: revised ? post.updatedAt : post.publishedAt, revised };
}

function shortDate(value: string) {
  return formatLocalDate(value, { month: "short", day: "numeric" });
}

function CategoryChip({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
  return (
    <span className="guide-category" data-category={category}>
      {Icon && <Icon size={14} aria-hidden="true" />}{category}
    </span>
  );
}

export default function GuidesHome({ topRead, latest, news, categories, bySlug, researchDesk, onSelectCategory }: Props) {
  const [lead, ...runnersUp] = topRead;

  return (
    <div className="guide-home">
      {lead && (
        <section className="guide-home-section" aria-labelledby="guide-top-read-title">
          <div className="guide-section-head">
            <div>
              <p className="guide-eyebrow"><Flame size={15} aria-hidden="true" />Top performing</p>
              <h2 id="guide-top-read-title">What readers open most</h2>
            </div>
            {/* Say what the order is, because "most read" is a claim. */}
            <p className="guide-section-note">Ordered by measured search traffic across Bing and Google — not an editor&rsquo;s pick.</p>
          </div>

          <div className="guide-top-grid">
            <Link href={`/guides/${lead.slug}`} className="guide-lead">
              <div className="guide-lead-topline">
                <span className="guide-eyebrow">Most read</span>
                <span>{lead.category}</span>
              </div>
              <div className="guide-lead-symbol" aria-hidden="true"><ArrowUpRight strokeWidth={1} /></div>
              <div className="guide-lead-copy">
                <span className="guide-lead-rank" aria-hidden="true">01</span>
                <h3>{lead.title}</h3>
                <p>{lead.excerpt}</p>
                <span className="guide-lead-link">Read guide <ArrowRight size={18} aria-hidden="true" /></span>
              </div>
            </Link>

            <ol className="guide-rank-list">
              {runnersUp.map((post, index) => (
                <li key={post.slug}>
                  <Link href={`/guides/${post.slug}`}>
                    <span className="guide-rank-number" aria-hidden="true">{String(index + 2).padStart(2, "0")}</span>
                    <div>
                      <h3>{post.title}</h3>
                      <p><CategoryChip category={post.category} />{post.readTime && <span className="guide-inline-meta"><Clock3 size={12} aria-hidden="true" />{post.readTime}</span>}</p>
                    </div>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="guide-home-section" aria-labelledby="guide-latest-title">
        <div className="guide-section-head">
          <div>
            <p className="guide-eyebrow"><Newspaper size={15} aria-hidden="true" />Latest</p>
            <h2 id="guide-latest-title">Just published and updated</h2>
          </div>
          <p className="guide-section-note">Newest first, dated on the last revision we made.</p>
        </div>

        <div className="guide-latest-grid">
          <ol className="guide-river">
            {latest.map((post) => {
              const { date, revised } = lastTouched(post);
              return (
                <li key={post.slug}>
                  <Link href={`/guides/${post.slug}`}>
                    <time dateTime={date}>{revised && <span>Updated</span>}{shortDate(date)}</time>
                    <div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <CategoryChip category={post.category} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          <aside className="guide-newsroom" aria-labelledby="guide-newsroom-title">
            <div className="guide-newsroom-head">
              <p className="guide-eyebrow" id="guide-newsroom-title">In the news</p>
              <span className="guide-live-dot" aria-hidden="true" />
            </div>
            <ul>
              {news.map((item) => (
                <li key={item.slug}>
                  <Link href={`/news/${item.slug}`}>
                    <span className="guide-newsroom-meta">{item.category}<time dateTime={item.publishedAt}>{shortDate(item.publishedAt)}</time></span>
                    <h3>{item.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/news" className="guide-newsroom-all">All news <ArrowRight size={15} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <section className="guide-home-section" aria-labelledby="guide-research-title">
        <div className="guide-section-head">
          <div>
            <p className="guide-eyebrow">Original research</p>
            <h2 id="guide-research-title">Built on our own transfer data</h2>
          </div>
        </div>
        {researchDesk}
      </section>

      <section className="guide-home-section" aria-labelledby="guide-topics-title">
        <div className="guide-section-head">
          <div>
            <p className="guide-eyebrow">Browse by topic</p>
            <h2 id="guide-topics-title">Pick where you&rsquo;re sending from</h2>
          </div>
        </div>

        <div className="guide-category-blocks">
          {categories.map((section) => {
            const Icon = CATEGORY_ICONS[section.category as keyof typeof CATEGORY_ICONS];
            return (
              <section key={section.category} className="guide-category-block" aria-labelledby={`guide-topic-${section.category}`}>
                <div className="guide-category-head">
                  <h3 id={`guide-topic-${section.category}`}>
                    {Icon && <Icon size={17} aria-hidden="true" />}{section.category}
                  </h3>
                  <button type="button" onClick={() => onSelectCategory(section.category)}>
                    See all {section.total} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
                <ul className="guide-category-grid">
                  {section.slugs.map((slug) => {
                    const post = bySlug.get(slug);
                    if (!post) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/guides/${slug}`}>
                          <h4>{post.title}</h4>
                          <p>{post.excerpt}</p>
                          {post.readTime && <span className="guide-inline-meta"><Clock3 size={12} aria-hidden="true" />{post.readTime}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
