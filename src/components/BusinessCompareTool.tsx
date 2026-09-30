"use client";

import { useMemo, useState } from "react";
import { BUSINESS_PROVIDERS, BUSINESS_FEATURES } from "@/data/business-providers";
import { BUSINESS_JOURNEYS } from "@/data/business-journeys";
import { trackFilterApplied } from "@/lib/analytics";
import ProviderLink from "@/components/ProviderLink";
import { getGoUrl } from "@/lib/affiliate";

export interface LiveCost { slug: string; avgCostPct: number; corridorCount: number }
type SortKey = "match" | "cost" | "name";
const SUPPORT = { full: "Supported", partial: "Limited / plan-dependent", none: "Not listed as supported" };

export default function BusinessCompareTool({ liveCosts, amountLabel, initialWorkflow = "" }: {
  liveCosts: LiveCost[]; amountLabel: string; initialWorkflow?: string;
}) {
  const costBySlug = useMemo(() => new Map(liveCosts.map(c => [c.slug, c])), [liveCosts]);
  const [needs, setNeeds] = useState<Set<string>>(() => new Set(BUSINESS_JOURNEYS.find(j => j.workflow === initialWorkflow)?.needs ?? []));
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [nonUsOnly, setNonUsOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("match");
  const ranked = useMemo(() => BUSINESS_PROVIDERS.filter(p => !(nonUsOnly && p.slug === "mercury")).map(p => {
    const met = [...needs].filter(k => p.features[k]?.level === "full").length;
    const partial = [...needs].filter(k => p.features[k]?.level === "partial").length;
    return { p, met, score: met + partial * .5, cost: costBySlug.get(p.slug)?.avgCostPct ?? Infinity };
  }).sort((a, b) => sort === "name" ? a.p.name.localeCompare(b.p.name) :
    sort === "match" && a.score !== b.score ? b.score - a.score : a.cost - b.cost || a.p.name.localeCompare(b.p.name)), [needs, nonUsOnly, sort, costBySlug]);
  const fullMatches = needs.size ? ranked.filter(r => r.met === needs.size).length : 0;
  function reset() { setNeeds(new Set()); setNonUsOnly(false); setWorkflow(""); }
  return <div className="business-finder">
    <div className="business-finder-heading"><p className="business-eyebrow">Your provider shortlist</p><h2>What matters for your payments?</h2><p>Choose a starting point, then adjust the features. No sign-up needed.</p></div>
    <div className="business-workflows" role="group" aria-label="Payment workflow">
      {BUSINESS_JOURNEYS.map(j => <button type="button" key={j.workflow} aria-pressed={workflow === j.workflow} onClick={() => { setWorkflow(j.workflow); setNeeds(new Set(j.needs)); trackFilterApplied("business_workflow", j.workflow); }}>{j.title}</button>)}
    </div>
    <fieldset className="business-needs"><legend>Features you need</legend><div>
      {BUSINESS_FEATURES.map(f => <button type="button" key={f.key} aria-pressed={needs.has(f.key)} onClick={() => {
        setWorkflow(""); setNeeds(previous => { const next = new Set(previous); if (next.has(f.key)) next.delete(f.key); else next.add(f.key); return next; }); trackFilterApplied("business_need", f.label);
      }}><span aria-hidden="true">{needs.has(f.key) ? "✓" : "+"}</span>{f.label}</button>)}
    </div></fieldset>
    <div className="business-finder-options"><label><input type="checkbox" checked={nonUsOnly} onChange={e => { setNonUsOnly(e.target.checked); trackFilterApplied("business_need", "Non-US company"); }} />My company is outside the US</label><button type="button" onClick={reset} disabled={!needs.size && !nonUsOnly}>Clear selections</button></div>
    {nonUsOnly && <p className="business-small">Mercury is excluded by this filter. Check the other providers’ country eligibility before applying.</p>}
    <details className="business-feature-help"><summary>What do these features mean?</summary><dl>{BUSINESS_FEATURES.map(f => <div key={f.key}><dt>{f.label}</dt><dd>{f.why}</dd></div>)}</dl></details>
    <div className="business-results-heading"><div role="status" aria-live="polite"><h3>{ranked.length} providers to compare</h3><p>{needs.size ? `${fullMatches} fully match your ${needs.size} selected features. Partial support receives half weight.` : "Select features to compare fit. Unselected results start with the lowest measured benchmark cost."}</p></div><label>Sort by<select value={sort} onChange={e => setSort(e.target.value as SortKey)}><option value="match">Feature match</option><option value="cost">Benchmark cost</option><option value="name">Provider name</option></select></label></div>
    <p className="business-cost-note">Costs below are averages on a {amountLabel} benchmark across tracked routes, not quotes for your business. Providers without measured costs are labelled. <a href="#cost">View the evidence</a>.</p>
    <div className="business-provider-results">{ranked.map(({ p, met }, i) => {
      const cost = costBySlug.get(p.slug);
      return <article className="business-provider-result" key={p.slug} data-business-provider={p.slug}>
        <div className="business-provider-info"><div className="business-provider-title"><span className="business-rank">{String(i + 1).padStart(2,"0")}</span><h4>{p.name}</h4>{needs.size > 0 && <span className="business-match">{met}/{needs.size} fully supported</span>}</div><p>{p.tagline}</p>
          {needs.size > 0 && <ul className="business-match-list">{[...needs].map(k => <li key={k}><strong>{BUSINESS_FEATURES.find(f => f.key === k)?.label}:</strong> {SUPPORT[p.features[k]?.level ?? "none"]}</li>)}</ul>}
        </div>
        <div className="business-provider-cost"><span>Benchmark cost</span><strong>{cost ? `${cost.avgCostPct.toFixed(2)}%` : "Quote needed"}</strong><small>{cost ? `${cost.corridorCount} tracked routes` : "No measured cost in this dataset"}</small></div>
        <div className="business-provider-actions"><ProviderLink href={getGoUrl(p.slug, { clickref: "business_tool" })} provider={p.slug} source="business_tool" corridor="business_compare" rank={i + 1} className="conversion-button conversion-button--accent">Visit {p.name} <span aria-hidden="true">↗</span></ProviderLink><a href={`#${p.slug}`}>Read provider details</a></div>
      </article>;
    })}</div>
    <p className="business-small business-finder-disclosure">We may earn a commission from provider links. Feature matches and observed costs determine the displayed order, not sponsorship. Confirm current pricing, supported features and eligibility with the provider.</p>
  </div>;
}
