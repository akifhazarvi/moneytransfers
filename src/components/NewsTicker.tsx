"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface NewsTickerItem {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
}

export default function NewsTicker({ items }: { items: NewsTickerItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let pos = 0;
    const speed = 0.5; // px per frame

    function tick() {
      if (!pausedRef.current && el) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const categoryColor: Record<string, string> = {
    Regulatory: "bg-amber-100 text-amber-800",
    "Industry News": "bg-blue-100 text-blue-800",
    Announcement: "bg-green-100 text-green-800",
    "Provider Update": "bg-purple-100 text-purple-800",
  };

  // Duplicate items for seamless loop
  const loopItems = [...items, ...items];

  return (
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-outline)] py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
          <span className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
            News
          </span>
        </div>
        <div className="h-4 w-px bg-[var(--color-outline)] shrink-0" />
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden whitespace-nowrap"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          {loopItems.map((item, i) => (
            <Link
              key={`${item.slug}-${i}`}
              href={`/news/${item.slug}`}
              className="flex items-center gap-2 shrink-0 group"
            >
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColor[item.category] || "bg-gray-100 text-gray-700"}`}
              >
                {item.category}
              </span>
              <span className="text-[13px] text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
