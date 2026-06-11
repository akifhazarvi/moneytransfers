"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import type { BlogPost } from "@/data/blog-posts";
import {
  BookOpen,
  GraduationCap,
  Star,
  Globe2,
  Briefcase,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const POSTS_PER_PAGE = 9;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Guides: BookOpen,
  Education: GraduationCap,
  Reviews: Star,
  Corridors: Globe2,
  Business: Briefcase,
  Research: BarChart3,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Guides: "How-to guides for sending money internationally",
  Education: "Exchange rates, fees, and how transfers work",
  Reviews: "In-depth reviews of money transfer providers",
  Corridors: "Country-by-country guides for popular routes",
  Business: "Guides for international business payments",
  Research: "Data-driven reports on remittances and fees",
};

interface Props {
  posts: BlogPost[];
  categories: readonly string[];
  translations: {
    featuredGuide: string;
    readGuide: string;
    readMore: string;
    browseByCategory: string;
    browseByCategoryDesc: string;
    guidesCount: string;
    previous: string;
    next: string;
    pageOf: string;
  };
}

export default function GuidesClientPage({ posts, categories, translations }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [posts]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.category] = (counts[post.category] ?? 0) + 1;
    }
    return counts;
  }, [posts]);

  const filtered =
    activeCategory === "All" ? sorted : sorted.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const totalPages = Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = rest.slice(pageStart, pageStart + POSTS_PER_PAGE);

  if (!featured) {
    return (
      <p className="text-sm text-[var(--color-on-surface-variant)] py-8 text-center">
        No guides found in this category.
      </p>
    );
  }

  const goToPage = (newPage: number) => {
    setPage(Math.min(Math.max(newPage, 1), totalPages));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-2sm font-medium whitespace-nowrap transition-colors ${
              cat === activeCategory
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-dim)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Guide */}
      {safePage === 1 && (
        <Link
          href={`/guides/${featured.slug}`}
          className="block bg-gradient-to-br from-[var(--color-primary)] to-[#3a5ba6] rounded-2xl p-8 md:p-12 mb-8 text-white hover:shadow-lg transition-shadow"
        >
          <span className="text-xs font-medium bg-[var(--color-surface)]/20 px-3 py-1 rounded-full">
            {translations.featuredGuide}
          </span>
          <h2 className="text-2xl md:text-3xl font-normal mt-4 mb-3">{featured.title}</h2>
          <p className="text-sm text-white/80 mb-6 max-w-2xl">{featured.excerpt}</p>
          <div className="flex items-center gap-4">
            <span className="text-2sm text-white/60">{featured.readTime}</span>
            <span className="bg-[var(--color-surface)] text-[var(--color-primary)] px-6 py-2 rounded-full text-2sm font-medium">
              {translations.readGuide}
            </span>
          </div>
        </Link>
      )}

      {/* Guide Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pagePosts.map((post) => (
          <Card key={post.slug} href={`/guides/${post.slug}`} className="group !p-0 overflow-hidden">
            {post.featuredImage ? (
              <div className="relative w-full h-[160px]">
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full h-[160px] bg-gradient-to-br from-[var(--color-primary-surface)] to-[var(--color-surface-container)] flex items-center justify-center">
                <span className="text-[var(--color-primary)] text-2xs font-semibold uppercase tracking-wide">
                  {post.category}
                </span>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-2sm text-[var(--color-on-surface-variant)] line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-4">
                <span className="text-2sm text-[var(--color-primary)] font-medium group-hover:underline">
                  {translations.readMore} &rarr;
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label={translations.previous}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-2sm font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] hover:bg-[var(--color-surface-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {translations.previous}
          </button>
          <span className="text-2sm text-[var(--color-on-surface-variant)] px-2 whitespace-nowrap">
            {translations.pageOf
              .replace("{current}", String(safePage))
              .replace("{total}", String(totalPages))}
          </span>
          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label={translations.next}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-2sm font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] hover:bg-[var(--color-surface-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {translations.next}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Browse by Category */}
      {activeCategory === "All" && safePage === 1 && (
        <div className="mt-12 pt-8 border-t border-[var(--color-outline)]">
          <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-1">
            {translations.browseByCategory}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            {translations.browseByCategoryDesc}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories
              .filter((cat) => cat !== "All")
              .map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setPage(1);
                      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="text-left bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-on-surface-muted)] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {Icon && (
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                      )}
                      <h3 className="text-md font-medium text-[var(--color-on-surface)]">{cat}</h3>
                    </div>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] mb-2">
                      {CATEGORY_DESCRIPTIONS[cat]}
                    </p>
                    <span className="text-2xs font-medium text-[var(--color-primary)]">
                      {translations.guidesCount.replace("{count}", String(categoryCounts[cat] ?? 0))}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
