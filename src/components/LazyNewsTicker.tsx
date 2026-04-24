"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

type TickerProps = { items: NewsItem[] };

export default function LazyNewsTicker(props: TickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [Ticker, setTicker] = useState<ComponentType<TickerProps> | null>(null);

  useEffect(() => {
    if (Ticker || !ref.current) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          import("./NewsTicker").then((mod) => {
            if (!cancelled) setTicker(() => mod.default);
          });
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(ref.current);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [Ticker]);

  return (
    <div ref={ref} style={Ticker ? undefined : { minHeight: 200 }}>
      {Ticker ? <Ticker {...props} /> : null}
    </div>
  );
}
