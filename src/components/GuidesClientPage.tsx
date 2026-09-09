"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Search, Undo2, X } from "lucide-react";
import GuidePreview, { type GuideCard } from "@/components/GuidePreview";
import GuidesHome, { type CategorySection, type NewsCard } from "@/components/GuidesHome";

const POSTS_PER_PAGE = 12;

interface Props {
  posts: GuideCard[];
  categories: readonly string[];
  /**
   * The hub's three editorial rails, passed as slugs rather than cards: every
   * one of them is already in `posts`, and re-sending the card objects would
   * put a second copy of ~50 titles and excerpts into the flight payload for
   * nothing.
   */
  topReadSlugs: string[];
  latestSlugs: string[];
  categorySections: CategorySection[];
  news: NewsCard[];
  researchDesk: ReactNode;
}

export default function GuidesClientPage({ posts, categories, topReadSlugs, latestSlugs, categorySections, news, researchDesk }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const bySlug = useMemo(() => new Map(posts.map((post) => [post.slug, post])), [posts]);
  const resolve = (slugs: string[]) => slugs.map((slug) => bySlug.get(slug)).filter((post): post is GuideCard => Boolean(post));

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    for (const post of posts) counts[post.category] = (counts[post.category] ?? 0) + 1;
    return counts;
  }, [posts]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return posts.filter((post) => {
      const text = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
      return (activeCategory === "All" || post.category === activeCategory) && words.every((word) => text.includes(word));
    }).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) :
      (sort === "published" ? b.publishedAt.localeCompare(a.publishedAt) : b.updatedAt.localeCompare(a.updatedAt)));
  }, [posts, activeCategory, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(pageStart, pageStart + POSTS_PER_PAGE);
  // Nothing asked for yet — show the hub rather than page one of an A–Z list.
  const browsing = activeCategory === "All" && !query.trim() && safePage === 1;

  const scrollToLibrary = () => {
    topRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    topRef.current?.focus({ preventScroll: true });
  };

  const goToPage = (newPage: number) => {
    setPage(Math.min(Math.max(newPage, 1), totalPages));
    scrollToLibrary();
  };

  const selectCategory = (category: string, scroll = false) => {
    setActiveCategory(category);
    setPage(1);
    if (scroll) requestAnimationFrame(scrollToLibrary);
  };

  const resetToHub = () => {
    setQuery("");
    setActiveCategory("All");
    setPage(1);
  };

  return (
    <>
      <div className="guide-search-wrap">
        <label className="guide-search">
          <Search size={21} aria-hidden="true" />
          <span className="sr-only">Search guides</span>
          <input ref={searchRef} type="search" value={query} placeholder="Search a topic, country or provider…"
            onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
        </label>
        {query && <button type="button" className="guide-clear-search" aria-label="Clear search" onClick={() => { setQuery(""); setPage(1); searchRef.current?.focus(); }}><X size={18} /></button>}
      </div>
      <div className="guide-topics" role="group" aria-label="Filter guides by topic">
        {categories.map((category) => (
          <button key={category} type="button" aria-pressed={category === activeCategory}
            onClick={() => selectCategory(category)}>
            {category === "All" ? "All topics" : category}<span>{categoryCounts[category] ?? 0}</span>
          </button>
        ))}
      </div>

      {browsing ? (
        <GuidesHome
          topRead={resolve(topReadSlugs)}
          latest={resolve(latestSlugs)}
          news={news}
          categories={categorySections}
          bySlug={bySlug}
          researchDesk={researchDesk}
          onSelectCategory={(category) => selectCategory(category, true)}
        />
      ) : (
        <section ref={topRef} tabIndex={-1} id="guide-library" className="guide-library" aria-labelledby="guide-library-title">
          <div className="guide-library-heading">
            <div>
              <p className="guide-eyebrow">The library</p>
              <h2 id="guide-library-title">{query.trim() ? "Search results" : activeCategory === "All" ? "Find your next read" : activeCategory}</h2>
              <p role="status" aria-live="polite" className="guide-result-count">
                {filtered.length === 0 ? "No matching guides" : `${pageStart + 1}–${Math.min(pageStart + POSTS_PER_PAGE, filtered.length)} of ${filtered.length} guides`}
                {query.trim() && ` for “${query.trim()}”`}
              </p>
              <button type="button" className="guide-back-hub" onClick={resetToHub}>
                <Undo2 size={14} aria-hidden="true" />Back to the overview
              </button>
            </div>
            <label className="guide-sort">
              <span>Sort by</span>
              <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
                <option value="updated">Recently updated</option>
                <option value="published">Newest published</option>
                <option value="title">Title: A–Z</option>
              </select>
            </label>
          </div>

          {pagePosts.length ? (
            <div className="guide-preview-grid">{pagePosts.map((post) => <GuidePreview key={post.slug} post={post} />)}</div>
          ) : (
            <div className="guide-empty">
              <Search size={30} aria-hidden="true" />
              <h3>Let&rsquo;s try a different search</h3>
              <p>Try a provider like Wise, a country like India, or a topic like transfer fees.</p>
              <button type="button" onClick={() => { resetToHub(); searchRef.current?.focus(); }}>Browse all guides <ArrowRight size={16} aria-hidden="true" /></button>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="guide-pagination" aria-label="Guide pages">
              <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}><ChevronLeft size={16} aria-hidden="true" /><span>Previous</span></button>
              <div className="guide-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((number) => number === 1 || number === totalPages || Math.abs(number - safePage) <= 1)
                  .map((number, i, visible) => (
                    <span key={number} className="contents">
                      {i > 0 && number - visible[i - 1] > 1 && <span className="guide-pagination-ellipsis">…</span>}
                      <button type="button" aria-label={`Page ${number}`} aria-current={safePage === number ? "page" : undefined} onClick={() => goToPage(number)}>{number}</button>
                    </span>
                  ))}
              </div>
              <span className="guide-page-mobile">{safePage} / {totalPages}</span>
              <button type="button" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}><span>Next</span><ChevronRight size={16} aria-hidden="true" /></button>
            </nav>
          )}
        </section>
      )}
    </>
  );
}
