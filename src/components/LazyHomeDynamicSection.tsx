"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

// HomeDynamicSection statically imports generateQuotes from @/data/providers,
// which transitively bundles the full set of scraped quote JSON (taptapsend
// alone is ~4 MB). When that lived in the homepage's initial client chunk it
// parsed/executed as a ~250 ms long task on the main thread (Lighthouse trace),
// delaying the H1 LCP paint (4.2 s) and inflating TBT (350 ms).
//
// The section sits below the fold (after the hero + comparison widget), so we
// defer importing it — and its dataset — until the user scrolls within 400 px.
// Matches the IntersectionObserver pattern in LazyNewsTicker. The wrapper stays
// inside HomeSelectionProvider so the real component still reads the widget's
// currency/amount selection via useHomeSelection().
export default function LazyHomeDynamicSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [Section, setSection] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (Section || !ref.current) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          import("./HomeDynamicSection").then((mod) => {
            if (!cancelled) setSection(() => mod.default);
          });
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(ref.current);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [Section]);

  // Reserve vertical space so the scroll position and CLS stay stable while the
  // section's chunk loads in.
  return (
    <div ref={ref} style={Section ? undefined : { minHeight: 360 }}>
      {Section ? <Section /> : null}
    </div>
  );
}
