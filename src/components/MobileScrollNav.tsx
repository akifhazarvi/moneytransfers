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
  const ticking = useRef(false);

  const update = useCallback(() => {
    const scrollY = window.scrollY;
    setVisible(scrollY > 400);

    let current = "";
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
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

  if (!visible) return null;

  return (
    <nav
      aria-label="Page sections"
      className="fixed bottom-[40px] left-0 right-0 z-50 sm:hidden pointer-events-none"
    >
      <div className="flex justify-center px-3">
        <div className="pointer-events-auto inline-flex items-center gap-0.5 bg-[var(--color-on-surface)] rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] p-1 max-w-full overflow-x-auto scrollbar-hide">
          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Back to top"
          >
            <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Section pills */}
          {sections.map((section) => {
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`shrink-0 rounded-full text-[11px] font-medium transition-all duration-150 leading-none ${
                  isActive
                    ? "bg-white text-[var(--color-on-surface)] px-2.5 py-1.5"
                    : "text-white/50 px-2 py-1.5 hover:text-white/80"
                }`}
                aria-label={section.label}
                aria-current={isActive ? "true" : undefined}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
