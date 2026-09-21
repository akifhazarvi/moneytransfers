"use client";
import { useEffect, useRef } from "react";
import { trackCrossSellViewed, trackCrossSellNavigation } from "@/lib/analytics";

export default function ConversionImpression({ source, corridor }: { source: string; corridor: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current?.parentElement;
    if (!element) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (target?.getAttribute("href") === "/companies/taptap-send") {
        trackCrossSellNavigation("review", source, "spotlight", "taptap-send", corridor);
      }
    };
    element.addEventListener("click", onClick);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        trackCrossSellViewed(source, "spotlight", "taptap-send", corridor);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => { observer.disconnect(); element.removeEventListener("click", onClick); };
  }, [source, corridor]);
  return <span ref={ref} hidden />;
}
