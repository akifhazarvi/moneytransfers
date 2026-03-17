"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import type { BlogPost } from "@/data/blog-posts";

interface Props {
  posts: BlogPost[];
  categories: readonly string[];
  translations: {
    featuredGuide: string;
    readGuide: string;
    readMore: string;
  };
}

export default function GuidesClientPage({ posts, categories, translations }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const filtered =
    activeCategory === "All"
      ? sorted
      : sorted.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (!featured) {
    return (
      <p className="text-sm text-[var(--color-on-surface-variant)] py-8 text-center">
        No guides found in this category.
      </p>
    );
  }

  return (
    <>
      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
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

      {/* Guide Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rest.map((post) => (
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
    </>
  );
}
