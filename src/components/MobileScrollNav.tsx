"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
}

export default function MobileScrollNav({ sections }: Props) {
  const [activeSection, setActiveSection] = useState("");
  const [visible, setVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const scrollY = window.scrollY;
    // Show after scrolling past ~400px (below hero)
    setVisible(scrollY > 400);
    setShowBackToTop(scrollY > 800);

    // Find current section by checking which section element is in view
    let current = "";
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      // Section is "active" if its top is above center of viewport
      if (rect.top <= window.innerHeight * 0.4) {
        current = section.id;
      }
    }
    setActiveSection(current);
    ticking.current = false;
  }, [sections]);

  useEffect(() => {
    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const currentLabel = sections.find((s) => s.id === activeSection)?.label || "";

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 sm:hidden pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 bg-[var(--color-on-surface)]/90 backdrop-blur-lg rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] px-1.5 py-1.5 max-w-[92vw]">
        {/* Section dots / pills */}
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {sections.map((section) => {
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[var(--color-on-surface)] px-3 py-1.5 rounded-full text-2xs font-semibold"
                    : "w-1.5 h-1.5 rounded-full bg-white/30 mx-0.5"
                }`}
                aria-label={section.label}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive ? section.label : ""}
              </button>
            );
          })}
        </div>

        {/* Back to top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="shrink-0 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors ml-0.5"
            aria-label="Back to top"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
