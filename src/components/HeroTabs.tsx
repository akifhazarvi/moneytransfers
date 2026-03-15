"use client";

import { useState } from "react";
import ComparisonWidget from "@/components/ComparisonWidget";
import HomepageConverter from "@/components/HomepageConverter";

const TABS = [
  { id: "send", label: "Compare Transfers", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
  { id: "convert", label: "Convert", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function HeroTabs() {
  const [active, setActive] = useState<TabId>("send");

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex items-center justify-center gap-1 mb-6">
        <div className="inline-flex bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-full p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-medium transition-all ${
                active === tab.id
                  ? "bg-[var(--color-primary)] text-white shadow-[0_1px_3px_rgba(26,115,232,0.3)]"
                  : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {active === "send" && <ComparisonWidget />}
      {active === "convert" && <HomepageConverter />}
    </div>
  );
}
