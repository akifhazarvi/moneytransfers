"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
}

export default function MobileScrollNav({ sections }: Props) {
  const [visible, setVisible] = useState(false);
  const [activeLabel, setActiveLabel] = useState("");
  const ticking = useRef(false);

  const update = useCallback(() => {
    const y = window.scrollY;
    setVisible(y > 500);

    let current = "";
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        current = s.label;
      }
    }
    setActiveLabel(current);
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

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Back to top — currently viewing ${activeLabel}`}
      className="fixed bottom-[46px] right-3 z-50 sm:hidden flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full bg-black/75 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.25)] active:scale-95 transition-transform duration-150"
    >
      <svg className="w-3.5 h-3.5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
      {activeLabel && (
        <span className="text-[11px] font-medium text-white/80 leading-none">{activeLabel}</span>
      )}
    </button>
  );
}
