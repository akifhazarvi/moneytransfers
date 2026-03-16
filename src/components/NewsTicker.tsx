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

const categoryColor: Record<string, string> = {
  Regulatory: "bg-amber-100 text-amber-800",
  "Industry News": "bg-blue-100 text-blue-800",
  Announcement: "bg-green-100 text-green-800",
  "Provider Update": "bg-purple-100 text-purple-800",
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
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-outline)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
              {t("latestNews")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/news"
              className="text-[13px] font-medium text-[var(--color-primary)] hover:underline"
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
              className="flex flex-col bg-[var(--color-surface-dim)] rounded-2xl p-5 hover:shadow-[var(--shadow-md)] transition-shadow group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColor[item.category] || "bg-gray-100 text-gray-700"}`}
                >
                  {item.category}
                </span>
                <span className="text-[11px] text-[var(--color-on-surface-variant)]">
                  {formatDate(item.publishedAt)}
                </span>
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2 flex-1">
                {item.excerpt}
              </p>
              <span className="inline-block mt-3 text-[13px] font-medium text-[var(--color-primary)]">
                {t("readMore")} &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === page
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-outline)] hover:bg-[var(--color-on-surface-variant)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
