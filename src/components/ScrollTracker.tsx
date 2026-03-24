"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth, trackContentView } from "@/lib/analytics";

/**
 * Tracks scroll depth (25%, 50%, 75%, 100%) and content view on mount.
 * Drop this into any page that has long-form content (guides, reviews, news).
 */
export function ScrollTracker({ slug, contentType }: { slug: string; contentType: string }) {
  const tracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    trackContentView(contentType, slug);

    const thresholds = [25, 50, 75, 100];

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (percent >= t && !tracked.current.has(t)) {
          tracked.current.add(t);
          trackScrollDepth(slug, t);
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, contentType]);

  return null;
}
