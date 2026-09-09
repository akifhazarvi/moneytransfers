"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, List } from "lucide-react";

export interface GuideSection { id: string; title: string }

export default function GuideContents({ sections, mobile = false }: { sections: GuideSection[]; mobile?: boolean }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 180) current = section.id;
      }
      setActiveId(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  if (!sections.length) return null;
  const links = (
    <ol className="guide-contents-list">
      {sections.map((section, i) => (
        <li key={section.id}>
          <a href={`#${section.id}`} aria-current={activeId === section.id ? "location" : undefined}
            onClick={() => { if (detailsRef.current) detailsRef.current.open = false; }}>
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  if (mobile) return (
    <details ref={detailsRef} className="guide-mobile-contents">
      <summary><span><List size={17} aria-hidden="true" />In this guide</span><ChevronDown size={16} aria-hidden="true" /></summary>
      <nav aria-label="In this guide">{links}</nav>
    </details>
  );
  return (
    <nav className="guide-contents" aria-label="In this guide">
      <p className="guide-eyebrow">On this page</p>
      {links}
      <a className="guide-back-top" href="#guide-top"><ArrowUp size={14} aria-hidden="true" />Back to top</a>
    </nav>
  );
}
