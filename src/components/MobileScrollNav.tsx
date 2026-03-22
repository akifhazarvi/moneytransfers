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
      className="fixed bottom-[44px] left-0 right-0 z-50 sm:hidden pointer-events-none"
    >
      <div className="flex justify-center px-3">
        <div
          className="pointer-events-auto inline-flex items-center gap-px rounded-full p-[3px] max-w-full overflow-x-auto scrollbar-hide"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="shrink-0 w-[28px] h-[28px] rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)" }}
            aria-label="Back to top"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="white" strokeOpacity={0.7} viewBox="0 0 24 24">
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
                className="shrink-0 rounded-full leading-none transition-all duration-150"
                style={{
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 500,
                  padding: "6px 8px",
                  color: isActive ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.45)",
                  background: isActive ? "white" : "transparent",
                }}
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
