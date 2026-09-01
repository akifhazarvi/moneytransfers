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

function chargesNoFee(p: Provider): boolean {
  const f = p.feeStructure.toLowerCase();
  // "$0" must be the whole amount, not the start of a larger one. A bare
  // includes("$0") also matched "$0.99", so PayPal ("5% with $0.99 min, $4.99
  // max") and WorldRemit ("From $0.99 to $3.99") were both described as
  // charging "nothing upfront on the majority of corridors" — a false fee
  // claim on a YMYL page. Those two are the only providers this changes.
  return (
    f.includes("no transfer fee") ||
    /\$0(?![\d.])/.test(f) ||
    f.startsWith("no ") ||
    f.includes("zero")
  );
}

/**
 * Join a string list into readable prose: "a, b and c". Caps to `max` items.
 * `lower` lowercases entries for mid-sentence flow (default true) — pass false
 * for lists containing brand names like "Apple Pay" or "Mobile Money".
 */
function proseList(items: string[], max = 4, lower = true): string {
  const list = items.slice(0, max).map((s) => (lower ? s.toLowerCase() : s));
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
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

/** What kind of sender this provider suits best — derived from its attributes. */
function bestForClause(p: Provider): string {
  if (usesMidMarket(p)) return "regular transfers to bank accounts, where a transparent exchange rate matters most";
  if (hasFeature(p, "forward contract")) return "larger, planned transfers such as property purchases, tuition or business payments";
  if (hasFeature(p, "cash pickup")) return "sending to recipients who need cash in hand rather than a bank deposit";
  if (hasFeature(p, "mobile money") || hasFeature(p, "mobile wallet")) return "reaching recipients who rely on mobile wallets in emerging markets";
  if (isBank(p)) return "existing customers who value keeping the transfer inside their own bank";
  if (p.supportedCountries >= 120) return "people who send to a wide spread of countries from one account";
  return "everyday international transfers";
}

// ── Paragraph builders ──

function overviewParagraph(p: Provider, tp?: { score?: number; reviews?: number }): string {
  const type = providerType(p);
  const article = /^[aeiou]/i.test(type) ? "an" : "a";
  const hq = p.headquarters ? ` and based in ${p.headquarters}` : "";

  // Opens on company context, NOT p.description. The page already renders
  // p.description verbatim in the header card above this block, so leading with
  // it here printed the same sentence twice on all 55 pages — the single
  // largest chunk of duplicated text in the category.
  const context = pick(p.slug, "ctx", [
    `Founded in ${p.founded}${hq}, ${p.name} is ${article} ${type}.`,
    `${p.name} is ${article} ${type}, founded in ${p.founded}${hq}.`,
  ]);

  const regList = p.regulators.slice(0, 3).join(", ");
  const reg = p.regulated && p.regulators.length
    ? pick(p.slug, "reg", [
        ` It is regulated by ${regList}, holding client funds under the safeguarding rules those regulators require.`,
        ` ${p.name} is authorised and regulated by ${regList}, which means customer money is safeguarded separately from company funds.`,
      ])
    : p.regulated
      ? " It operates as a regulated, licensed money transfer business."
      : "";

  const ratingSentence = tp?.score
    ? ` It currently holds a Trustpilot score of ${tp.score.toFixed(1)} out of 5${tp.reviews ? ` from roughly ${tp.reviews.toLocaleString()} reviews` : ""}, which we rate ${p.ratingLabel.toLowerCase()}.`
    : "";

  return `${context}${reg}${ratingSentence}`;
}

function pricingParagraph(p: Provider): string {
  const feeSentence = chargesNoFee(p)
    ? pick(p.slug, "fee", [
        `${p.name} advertises no transfer fee on most routes (${p.feeStructure.toLowerCase()}),`,
        `On fees, ${p.name} charges nothing upfront on the majority of corridors (${p.feeStructure.toLowerCase()}),`,
      ])
    : pick(p.slug, "fee", [
        `${p.name}'s fees are structured as ${p.feeStructure.toLowerCase()},`,
        `On the fee side, expect ${p.feeStructure.toLowerCase()},`,
      ]);

  const rateSentence = usesMidMarket(p)
    ? " and it passes on the real mid-market exchange rate, so the headline fee is genuinely the full cost of the transfer."
    : ` but the bigger cost is usually the exchange-rate markup of ${p.exchangeRateMarkup.toLowerCase()}, which is built into the rate rather than shown as a line item.`;

  const limits = (() => {
    const min = `$${p.minTransfer.toLocaleString()}`;
    const max = p.maxTransfer ? `$${p.maxTransfer.toLocaleString()}` : null;
    if (max) return ` Transfers run from a minimum of ${min} up to ${max} per transaction.`;
    return ` The minimum transfer is ${min}, with no fixed upper limit on most corridors.`;
  })();

  // The one fact on this page that is ours rather than the provider's: what we
  // actually observed the rate doing, across a corridor count we can name. Where
  // we have it, it replaces the generic takeaway — a fixed pair of sentences that
  // otherwise printed verbatim across all 55 pages.
  const measured = (() => {
    const m = getMeasuredMarkup(p.slug);
    if (!m) return "";
    const corridors = `${m.corridors.toLocaleString()} corridor${m.corridors === 1 ? "" : "s"}`;
    // Mid-market pricing lands fractionally either side of zero; printing
    // "-0.00%" would be false precision.
    if (Math.abs(m.markupPct) < 0.05) {
      return ` In our own rate collection, across the ${corridors} we track for ${p.name}, its rate has sat effectively at the mid-market rate.`;
    }
    return ` In our own rate collection, across the ${corridors} we track for ${p.name}, its exchange rate has averaged ${m.markupPct.toFixed(2)}% from the mid-market rate.`;
  })();

  const takeaway = measured
    ? ""
    : usesMidMarket(p)
      ? " For senders that makes the true cost easy to verify against the rate you see on Google."
      : " Because that markup scales with the amount you send, it is worth comparing the final receive amount rather than the fee alone.";

  return `${feeSentence}${rateSentence}${limits}${measured}${takeaway}`;
}

function coverageParagraph(p: Provider): string {
  const speed = pick(p.slug, "speed", [
    `Delivery speed is quoted at ${p.transferSpeed.toLowerCase()}`,
    `${p.name} quotes transfer times of ${p.transferSpeed.toLowerCase()}`,
  ]);
  const reach = `, and the service reaches ${p.supportedCountries}+ countries across ${p.supportedCurrencies}+ currencies.`;
  const pay = p.paymentMethods.length
    ? ` You can fund a transfer by ${proseList(p.paymentMethods, 4, false)},`
    : "";
  const deliver = p.deliveryMethods.length
    ? ` with money delivered via ${proseList(p.deliveryMethods, 4, false)}.`
    : "";
  const positioning = pick(p.slug, "pos", [
    ` That combination of speed and reach is what shapes where ${p.name} is most competitive.`,
    ` The mix of funding and payout options is a good guide to which corridors ${p.name} handles best.`,
  ]);
  return `${speed}${reach}${pay}${deliver}${positioning}`;
}

function verdictParagraph(p: Provider): string {
  // Pros/cons are a mix of verb-, noun- and full-sentence phrases, so use a
  // colon-led list rather than "strengths are <phrase>" which can read awkwardly.
  const strengths = p.pros.length
    ? pick(p.slug, "pro", [
        `On the plus side: ${proseList(p.pros, 3)}.`,
        `Where ${p.name} stands out — ${proseList(p.pros, 3)}.`,
      ])
    : "";
  const bestFor = ` That makes it a sensible choice for ${bestForClause(p)}.`;
  const watchOut = p.cons.length
    ? pick(p.slug, "con", [
        ` The main trade-offs to weigh: ${proseList(p.cons, 2)}.`,
        ` Worth keeping in mind: ${proseList(p.cons, 2)}.`,
      ])
    : "";
  // No fixed closing line here. The previous one ("As always, run your exact
  // amount…") was a 30-word CTA printed identically on all 55 pages, and the
  // page already carries two live comparison CTAs above this block.
  return `${strengths}${bestFor}${watchOut}`;
}

// ── Public API ──

export function generateProviderProfile(
  p: Provider,
  tp?: { score?: number; reviews?: number },
): ProviderProfile {
  const paragraphs = [
    overviewParagraph(p, tp),
    pricingParagraph(p),
    coverageParagraph(p),
    verdictParagraph(p),
  ];
  const summary = p.description.trim();
  return { paragraphs, summary };
}
