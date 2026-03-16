"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ComparisonWidget from "@/components/ComparisonWidget";
import HomepageConverter from "@/components/HomepageConverter";

type TabId = "compare" | "convert";

export default function HeroTabs() {
  const t = useTranslations("heroTabs");
  const [active, setActive] = useState<TabId>("compare");
  const TABS = [
    { id: "compare" as const, label: t("compareTransfers") },
    { id: "convert" as const, label: t("convert") },
  ];

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex items-center justify-center gap-1 mb-6">
        <div className="inline-flex bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-full p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all ${
                active === tab.id
                  ? "bg-[var(--color-primary)] text-white shadow-[0_1px_3px_rgba(26,115,232,0.3)]"
                  : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {active === "compare" && <ComparisonWidget />}
      {active === "convert" && <HomepageConverter />}
    </div>
  );
}
