/**
 * Generates a concise (~300–500 word) data-driven profile description for each
 * provider's /companies/[slug] page. The prose is composed from the provider's
 * own maintained fields (fees, markup, speed, coverage, regulation, pros/cons),
 * so the "details" stay current as the underlying data is updated — rather than
 * drifting out of date the way hand-written marketing copy does.
 *
 * Mirrors the established data-driven pattern in src/lib/comparison-content.ts.
 * Sentence variants are selected deterministically from the slug so each
 * provider reads differently but the output is stable across builds.
 *
 * 2026-09-01 — de-duplication pass, after AdSense flagged "Low value content".
 * Any two /companies pages shared a median 44% of their 10-grams. Three fixes,
 * in descending order of how much identical text they removed:
 *
 *   1. The overview no longer re-prints p.description. The page renders it in
 *      the header card already, so it appeared verbatim twice on every page.
 *   2. The verdict's fixed closing CTA sentence is gone (55/55 identical).
 *   3. Where our scrapers cover the provider, the generic pricing takeaway
 *      (one of two fixed strings) is replaced by the markup we actually
 *      measured, over a named corridor count — see src/lib/provider-measured.ts.
 *
 * Note the deliberate non-fix: no new sentence variants were added. More
 * skeletons filled from the same fields is the same scaled-content signal in a
 * different costume, which is what the site's own SEO action plan warns against.
 * Only (3) adds text, and only because it is a fact nobody else has.
 */

import { type Provider } from "@/data/providers";
import { getMeasuredMarkup } from "@/lib/provider-measured";

export interface ProviderProfile {
  /** 4 paragraphs, ~300–500 words total, ready to render one <p> each. */
  paragraphs: string[];
  /** Short one-line summary for use under the H1 / in cards. */
  summary: string;
}

// ── Deterministic variant picker ──

function hashSlug(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(slug: string, salt: string, options: T[]): T {
  return options[hashSlug(slug + salt) % options.length];
}

// ── Helpers ──

function hasFeature(p: Provider, keyword: string): boolean {
  const all = [...p.features, ...p.deliveryMethods, ...p.paymentMethods].map((s) => s.toLowerCase());
  return all.some((f) => f.includes(keyword.toLowerCase()));
}

const BANK_HINTS = [
  "bank", "chase", "hsbc", "barclays", "lloyds", "nationwide", "santander",
  "natwest", "anz", "westpac", "scotiabank", "rbs", "deutsche", "uob",
  "commonwealth", "wells-fargo", "sbi", "pnb",
];

function isBank(p: Provider): boolean {
  const hay = `${p.slug} ${p.name}`.toLowerCase();
  return BANK_HINTS.some((h) => hay.includes(h));
}

function usesMidMarket(p: Provider): boolean {
  const m = p.exchangeRateMarkup.toLowerCase();
  // "X% above mid-market" still carries a markup — only treat as true
  // mid-market when there is no "above" qualifier and the rate is the
  // interbank/mid-market rate itself (e.g. "0% (mid-market rate)").
  if (m.includes("above")) return false;
  if (m.includes("mid-market rate") || m.includes("interbank")) return true;
  // Pure zero only — not a "0% - 2%" range.
  return /^0%\s*(\(|$)/.test(m.trim());
}

/** A short noun phrase describing what kind of service this is. */
function providerType(p: Provider): string {
  if (isBank(p)) return "high-street bank";
  if (hasFeature(p, "forward contract")) return "specialist currency broker";
  if (usesMidMarket(p)) return "low-cost digital money transfer service";
  if (hasFeature(p, "cash pickup") && p.supportedCountries >= 100) return "global money transfer network";
  if (hasFeature(p, "mobile money") || hasFeature(p, "mobile wallet")) return "digital remittance app";
  if (hasFeature(p, "multi-currency")) return "multi-currency fintech";
  return "money transfer provider";
}

// ── Paragraph builders ──
//
// 2026-09-26 — second pass, after SiteLiner scored /companies/ria 45% and
// /companies/sendwave 41% duplicate. What was left of the four paragraphs
// restated the page's own stat boxes, Transfer Details card and pros/cons list
// through sentence skeletons shared across every profile ("…holding client
// funds under the safeguarding rules those regulators require", "…the bigger
// cost is usually the exchange-rate markup of…", "That combination of speed
// and reach…", "That makes it a sensible choice for…"). Only what the rest of
// the page does not already say stays: who the company is, its Trustpilot
// standing, and the markup we measured ourselves.

function overviewParagraph(p: Provider, tp?: { score?: number; reviews?: number }): string {
  const type = providerType(p);
  const article = /^[aeiou]/i.test(type) ? "an" : "a";
  const hq = p.headquarters ? ` and based in ${p.headquarters}` : "";
  const context = pick(p.slug, "ctx", [
    `Founded in ${p.founded}${hq}, ${p.name} is ${article} ${type}.`,
    `${p.name} is ${article} ${type}, founded in ${p.founded}${hq}.`,
  ]);
  const reg = p.regulated && p.regulators.length
    ? ` ${p.name}'s regulators: ${p.regulators.slice(0, 3).join(", ")}.`
    : "";
  const ratingSentence = tp?.score
    ? ` Trustpilot: ${tp.score.toFixed(1)}/5${tp.reviews ? ` across roughly ${tp.reviews.toLocaleString()} reviews` : ""}, which we rate ${p.ratingLabel.toLowerCase()}.`
    : "";
  return `${context}${reg}${ratingSentence}`;
}

/** The one fact on this page that is ours rather than the provider's. */
function measuredParagraph(p: Provider): string {
  const m = getMeasuredMarkup(p.slug);
  if (!m) return "";
  const corridors = `${m.corridors.toLocaleString()} corridor${m.corridors === 1 ? "" : "s"}`;
  // Mid-market pricing lands fractionally either side of zero; printing
  // "-0.00%" would be false precision.
  // Median, not mean: the mean is dragged by corridors where our own
  // mid-market benchmark is wrong (see MeasuredMarkup.markupMedianPct).
  if (Math.abs(m.markupMedianPct) < 0.05) {
    return `Across the ${corridors} we track for ${p.name}, its rate has sat effectively at mid-market.`;
  }
  return `Across the ${corridors} we track for ${p.name}, its median rate sits ${m.markupMedianPct.toFixed(2)}% from mid-market${usesMidMarket(p) ? "" : ` — compare that with the ${p.exchangeRateMarkup.toLowerCase()} it publishes`}.`;
}

// ── Public API ──

export function generateProviderProfile(
  p: Provider,
  tp?: { score?: number; reviews?: number },
): ProviderProfile {
  const paragraphs = [overviewParagraph(p, tp), measuredParagraph(p)].filter(Boolean);
  const summary = p.description.trim();
  return { paragraphs, summary };
}
