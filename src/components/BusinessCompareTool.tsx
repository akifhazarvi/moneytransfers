"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  BUSINESS_PROVIDERS,
  BUSINESS_FEATURES,
  type Support,
} from "@/data/business-providers";
import { trackProviderClicked, trackFilterApplied } from "@/lib/analytics";

/** Live cost per provider, passed from the server (keeps the quote engine off the client bundle). */
export interface LiveCost {
  slug: string;
  avgCostPct: number;
  corridorCount: number;
}

const SUPPORT_MARK: Record<Support, { mark: string; cls: string; label: string }> = {
  full: { mark: "●", cls: "text-[var(--color-success,green)]", label: "Full support" },
  partial: { mark: "◐", cls: "text-[var(--color-on-surface-variant)]", label: "Partial / plan-gated" },
  none: { mark: "—", cls: "text-[var(--color-on-surface-muted)]", label: "Not offered" },
};

type SortKey = "match" | "cost" | "name";

export default function BusinessCompareTool({ liveCosts, amountLabel }: { liveCosts: LiveCost[]; amountLabel: string }) {
  const costBySlug = useMemo(() => new Map(liveCosts.map((c) => [c.slug, c])), [liveCosts]);

  // Selected required features (matrix keys) + special needs.
  const [needs, setNeeds] = useState<Set<string>>(new Set());
  const [nonUsOnly, setNonUsOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("match");

  const toggleNeed = useCallback((key: string, label: string) => {
    setNeeds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else {
        next.add(key);
        trackFilterApplied("business_need", label);
      }
      return next;
    });
  }, []);

  // Score each provider: how many of the selected needs it fully meets.
  const ranked = useMemo(() => {
    const list = BUSINESS_PROVIDERS.filter((p) => !(nonUsOnly && p.slug === "mercury")).map((p) => {
      const met = [...needs].filter((k) => p.features[k]?.level === "full").length;
      const partial = [...needs].filter((k) => p.features[k]?.level === "partial").length;
      const cost = costBySlug.get(p.slug)?.avgCostPct ?? 99;
      // matchScore: full need = 1.0, partial = 0.5; ties broken by lower cost.
      const matchScore = needs.size ? (met + partial * 0.5) / needs.size : 1;
      const meetsAll = needs.size === 0 || met === needs.size;
      return { p, met, partial, cost, matchScore, meetsAll };
    });
    list.sort((a, b) => {
      if (sort === "cost") return a.cost - b.cost;
      if (sort === "name") return a.p.name.localeCompare(b.p.name);
      // match: by score desc, then cost asc
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return a.cost - b.cost;
    });
    return list;
  }, [needs, nonUsOnly, sort, costBySlug]);

  const topPick = needs.size > 0 ? ranked.find((r) => r.meetsAll) : null;
  const noneMeetAll = needs.size > 0 && !topPick;

  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-5 sm:p-6">
      <h2 className="text-xl font-medium text-[var(--color-on-surface)]">Find your business payment provider</h2>
      <p className="mt-1.5 text-sm text-[var(--color-on-surface-variant)]">
        Tick what your business needs. We rank the {BUSINESS_PROVIDERS.length} providers live by how well they fit and the
        cost to send {amountLabel}.
      </p>

      {/* Need chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {BUSINESS_FEATURES.map((f) => {
          const on = needs.has(f.key);
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => toggleNeed(f.key, f.label)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                on
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
                  : "border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"
              }`}
            >
              {on ? "✓ " : "+ "}
              {f.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => { setNonUsOnly((v) => !v); trackFilterApplied("business_need", "Non-US company"); }}
          aria-pressed={nonUsOnly}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            nonUsOnly
              ? "border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-medium"
              : "border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"
          }`}
        >
          {nonUsOnly ? "✓ " : "+ "}Non-US company
        </button>
        {(needs.size > 0 || nonUsOnly) && (
          <button
            type="button"
            onClick={() => { setNeeds(new Set()); setNonUsOnly(false); }}
            className="rounded-full px-3 py-1.5 text-sm text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Recommendation banner */}
      {topPick && (
        <div className="mt-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary-surface)] p-4">
          <p className="text-sm text-[var(--color-on-surface)]">
            <strong>{topPick.p.name}</strong> fits all {needs.size} of your needs
            {costBySlug.get(topPick.p.slug) ? ` and costs ${costBySlug.get(topPick.p.slug)!.avgCostPct}% on ${amountLabel}.` : "."}{" "}
            <span className="text-[var(--color-on-surface-variant)]">{topPick.p.bestFor}</span>
          </p>
        </div>
      )}
      {noneMeetAll && (
        <div className="mt-4 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-4">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            No single provider fully covers all {needs.size} needs — the closest matches are ranked first below. Consider
            pairing two (e.g. a banking hub plus a specialist FX broker).
          </p>
        </div>
      )}

      {/* Sort */}
      <div className="mt-5 flex items-center gap-2 text-sm">
        <span className="text-[var(--color-on-surface-variant)]">Sort by</span>
        {([["match", "Best fit"], ["cost", "Lowest FX cost"], ["name", "Name"]] as [SortKey, string][]).map(([k, lbl]) => (
          <button
            key={k}
            type="button"
            onClick={() => setSort(k)}
            className={`rounded-full px-3 py-1 transition-colors ${
              sort === k ? "bg-[var(--color-on-surface)] text-[var(--color-surface)]" : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-dim)]"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Ranked result cards */}
      <div className="mt-4 space-y-3">
        {ranked.map(({ p, met, meetsAll }, i) => {
          const cost = costBySlug.get(p.slug);
          return (
            <div
              key={p.slug}
              className={`rounded-xl border p-4 transition-colors ${
                needs.size > 0 && meetsAll ? "border-[var(--color-primary)]" : "border-[var(--color-outline)]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-on-surface-muted)] w-5">{i + 1}</span>
                  <a href={`#${p.slug}`} className="font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">{p.name}</a>
                  {needs.size > 0 && (
                    <span className="text-xs rounded-full bg-[var(--color-surface-dim)] px-2 py-0.5 text-[var(--color-on-surface-variant)]">
                      {met}/{needs.size} needs
                    </span>
                  )}
                  {cost && <span className="text-xs text-[var(--color-on-surface-variant)]">· {cost.avgCostPct}% FX</span>}
                </div>
                <Link
                  href={`/go/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => trackProviderClicked(p.slug, "business_compare", i + 1, "business_tool")}
                  className="rounded-full bg-[var(--color-cta)] px-4 py-1.5 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] transition-all"
                >
                  Visit →
                </Link>
              </div>
              {/* Show which selected needs this provider meets */}
              {needs.size > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-7">
                  {[...needs].map((k) => {
                    const f = BUSINESS_FEATURES.find((x) => x.key === k)!;
                    const lvl = p.features[k]?.level ?? "none";
                    const s = SUPPORT_MARK[lvl];
                    return (
                      <span key={k} className="inline-flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)]">
                        <span className={s.cls}>{s.mark}</span>{f.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
