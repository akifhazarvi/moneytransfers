"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

type WidgetProps = { defaultCorridor: string };

export default function LazyHistoricalRateWidget(props: WidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [Widget, setWidget] = useState<ComponentType<WidgetProps> | null>(null);

  useEffect(() => {
    if (Widget || !ref.current) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          import("./HistoricalRateWidget").then((mod) => {
            if (!cancelled) setWidget(() => mod.default);
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
  }, [Widget]);

  return (
    <div ref={ref} style={Widget ? undefined : { minHeight: 360 }}>
      {Widget ? <Widget {...props} /> : (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)] min-h-[360px] animate-pulse" />
      )}
    </div>
  );
}
