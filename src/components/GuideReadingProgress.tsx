"use client";

import { useEffect, useRef } from "react";

export default function GuideReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = document.getElementById("guide-article");
      if (!article || !bar.current) return;
      const rect = article.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const distance = Math.max(1, rect.height - window.innerHeight + 120);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start + 120) / distance));
      bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    const article = document.getElementById("guide-article");
    if (article) observer.observe(article);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <div ref={bar} className="guide-reading-progress" aria-hidden="true" />;
}
