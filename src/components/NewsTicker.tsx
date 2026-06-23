"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface NewsTickerItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

// Themed pastel chips (respect light/dark + the brand palette) instead of
// hardcoded Tailwind colors that ignored the design tokens.
const categoryColor: Record<string, string> = {
  Regulatory: "bg-[var(--tile-butter-bg)] text-[var(--tile-butter-ink)]",
  "Industry News": "bg-[var(--tile-sky-bg)] text-[var(--tile-sky-ink)]",
  Announcement: "bg-[var(--tile-mint-bg)] text-[var(--tile-mint-ink)]",
  "Provider Update": "bg-[var(--tile-lavender-bg)] text-[var(--tile-lavender-ink)]",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PAGE_SIZE = 3;

export default function NewsTicker({ items }: { items: NewsTickerItem[] }) {
  const t = useTranslations("newsTicker");
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  const prev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  const next = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

  if (items.length === 0) return null;

  const visible = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)] py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-2sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
              {t("latestNews")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/news"
              className="text-2sm font-medium text-[var(--color-primary)] hover:underline"
            >
              {t("allNews")} &rarr;
            </Link>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prev}
                  aria-label={t("previousNews")}
                  className="w-8 h-8 rounded-full border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] transition-colors"
                >
                  <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  aria-label={t("nextNews")}
                  className="w-8 h-8 rounded-full border border-[var(--color-outline)] flex items-center justify-center hover:bg-[var(--color-surface-dim)] transition-colors"
                >
                  <svg className="w-4 h-4 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3-card grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="flex flex-col bg-[var(--color-surface)] rounded-[20px] p-6 ring-1 ring-[var(--color-outline)]/70 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-2xs font-medium px-2 py-0.5 rounded-full ${categoryColor[item.category] || "bg-gray-100 text-gray-700"}`}
                >
                  {item.category}
                </span>
                <span className="text-2xs text-[var(--color-on-surface-variant)]">
                  {formatDate(item.publishedAt)}
                </span>
              </div>
              <h3 className="text-md sm:text-base font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2 flex-1">
                {item.excerpt}
              </p>
              <span className="inline-block mt-3 text-2sm font-medium text-[var(--color-primary)]">
                {t("readMore")} &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-0.5 mt-5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className="flex items-center justify-center w-6 h-6"
              >
                <span className={`block w-2 h-2 rounded-full transition-colors ${
                  i === page
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-outline)] hover:bg-[var(--color-on-surface-variant)]"
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
