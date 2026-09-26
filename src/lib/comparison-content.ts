/**
 * Generates unique, data-driven content for auto-generated comparison pages.
 * Each provider pair produces genuinely differentiated narratives, verdicts,
 * and FAQs based on real provider attributes and scraped quote data.
 */

import { type Provider, type TransferQuote } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";

// ── Types ──

export interface CorridorComparison {
  from: string;
  to: string;
  label: string;
  amount: number;
  symbol: string;
  currencySymbol: string;
  quoteA?: TransferQuote;
  quoteB?: TransferQuote;
  winner: "a" | "b" | "tie" | "na";
  savings?: number;
}

export interface ComparisonVerdict {
  costWinner: "a" | "b" | "tie";
  speedWinner: "a" | "b" | "tie";
  coverageWinner: "a" | "b" | "tie";
  overallWinner: "a" | "b" | "tie";
  costExplanation: string;
  speedExplanation: string;
  coverageExplanation: string;
  overallSummary: string;
}

export interface ComparisonFAQ {
  q: string;
  a: string;
}

export interface ComparisonContent {
  intro: string;
  corridorData: CorridorComparison[];
  verdict: ComparisonVerdict;
  faqs: ComparisonFAQ[];
  keyDifferences: string[];
}

// ── Corridor config ──

const COMPARISON_CORRIDORS = [
  { from: "USD", to: "INR", label: "USD → INR", amount: 1000, symbol: "₹", currencySymbol: "$" },
  { from: "GBP", to: "EUR", label: "GBP → EUR", amount: 1000, symbol: "€", currencySymbol: "£" },
  { from: "USD", to: "PHP", label: "USD → PHP", amount: 500, symbol: "₱", currencySymbol: "$" },
  { from: "USD", to: "MXN", label: "USD → MXN", amount: 1000, symbol: "MX$", currencySymbol: "$" },
  { from: "GBP", to: "PKR", label: "GBP → PKR", amount: 500, symbol: "₨", currencySymbol: "£" },
  { from: "USD", to: "NGN", label: "USD → NGN", amount: 200, symbol: "₦", currencySymbol: "$" },
];

// ── Helpers ──

function hasFeature(p: Provider, keyword: string): boolean {
  const all = [...p.features, ...p.deliveryMethods, ...p.paymentMethods].map((s) => s.toLowerCase());
  return all.some((f) => f.includes(keyword.toLowerCase()));
}

/**
 * Whether a provider prices at the mid-market rate, i.e. its advertised markup
 * is exactly zero.
 *
 * Parses the leading number instead of substring-matching. Every provider's
 * `exchangeRateMarkup` ends in "above mid-market" ("0.5% - 2% above
 * mid-market"), so `includes("mid-market")` was true for all of them — which
 * is how /compare/wise-vs-remitly told readers to choose Remitly for "the real
 * mid-market exchange rate with no hidden markup" directly beneath a table
 * giving Remitly a 0.5%–2% markup. Only Wise's "0% (mid-market rate)" passes.
 */
export function usesMidMarketRate(p: Provider): boolean {
  // A single "0%" value, not the low end of a range or tier: LemFi's "0% - 2%
  // above mid-market", Koho's "0% - 0.5%" and HSBC's "0% (Premier) to 2.5%
  // (standard)" all open with 0% and none of them is it. Exactly one
  // percentage in the string, and it is zero.
  const s = p.exchangeRateMarkup.trim();
  return /^0(\.0+)?%/.test(s) && (s.match(/%/g) ?? []).length === 1;
}

// ── Measured helpers ──
//
// Everything below states what THIS pair did on the routes we price. The
// generator used to restate each provider's published fee, markup, speed,
// limits and regulators in the intro, key differences, "when to choose", the
// verdict and five FAQs — the same sentences on every comparison featuring
// that provider, which is why SiteLiner (2026-09-26) scored 17 generated
// comparisons at 32–58% duplicate with 90–99% including common content. The
// feature table states those specifications once; prose here carries only the
// pair's own numbers.

/**
 * Median of a list. Medians, not means, throughout this file: a single corridor
 * where our own mid-market benchmark is unreliable (USD->NGN reads -3.16%) is
 * enough to move a mean far enough to misdescribe a provider.
 */
function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function gapPct(c: CorridorComparison): number {
  return Math.abs((c.quoteA!.receiveAmount - c.quoteB!.receiveAmount) / c.quoteB!.receiveAmount) * 100;
}

function money(c: CorridorComparison, value: number): string {
  return `${c.symbol}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function sent(c: CorridorComparison): string {
  return `${c.currencySymbol}${c.amount.toLocaleString("en-US")}`;
}

function labels(cs: CorridorComparison[]): string {
  return cs.map((c) => c.label).join(", ");
}

/** What this pair measured, shared by every block that quotes it. */
export function measurePair(corridorData: CorridorComparison[]) {
  const priced = corridorData.filter((c) => c.quoteA && c.quoteB);
  const winsA = priced.filter((c) => c.winner === "a");
  const winsB = priced.filter((c) => c.winner === "b");
  const byGap = [...priced].sort((x, y) => gapPct(y) - gapPct(x));
  const widest = byGap[0];
  const closest = byGap.length > 1 ? byGap[byGap.length - 1] : undefined;
  const medGap = median(priced.map(gapPct));
  const zeroFeeA = priced.filter((c) => c.quoteA!.fee === 0).length;
  const zeroFeeB = priced.filter((c) => c.quoteB!.fee === 0).length;
  return { priced, winsA, winsB, widest, closest, medGap, zeroFeeA, zeroFeeB };
}

/** Delivery features one provider has and the other lacks. */
function onlyFeatures(primary: Provider, other: Provider): string[] {
  const out: string[] = [];
  const checks: [string, string][] = [
    ["cash pickup", "cash pickup"],
    ["mobile money", "mobile money"],
    ["multi-currency", "a multi-currency account"],
    ["forward contract", "forward contracts"],
    ["business", "a business account"],
  ];
  for (const [kw, label] of checks) {
    if (hasFeature(primary, kw) && !hasFeature(other, kw)) out.push(label);
  }
  return out;
}

// ── Main generator ──

export function generateComparisonContent(a: Provider, b: Provider): ComparisonContent {
  const corridorData: CorridorComparison[] = COMPARISON_CORRIDORS.map((c) => {
    const quotes = generateQuotes(c.amount, c.from, c.to);
    const quoteA = quotes.find((q) => q.providerSlug === a.slug);
    const quoteB = quotes.find((q) => q.providerSlug === b.slug);

    let winner: CorridorComparison["winner"] = "na";
    let savings: number | undefined;
    if (quoteA && quoteB) {
      if (quoteA.receiveAmount > quoteB.receiveAmount) {
        winner = "a";
        savings = quoteA.receiveAmount - quoteB.receiveAmount;
      } else if (quoteB.receiveAmount > quoteA.receiveAmount) {
        winner = "b";
        savings = quoteB.receiveAmount - quoteA.receiveAmount;
      } else {
        winner = "tie";
      }
    }

    return { ...c, quoteA, quoteB, winner, savings };
  });

  const m = measurePair(corridorData);
  const costWinner: "a" | "b" | "tie" =
    m.winsA.length > m.winsB.length ? "a" : m.winsB.length > m.winsA.length ? "b" : "tie";

  const aHasExpress = a.transferSpeed.toLowerCase().includes("minute") || a.transferSpeed.toLowerCase().includes("instant");
  const bHasExpress = b.transferSpeed.toLowerCase().includes("minute") || b.transferSpeed.toLowerCase().includes("instant");
  const speedWinner: "a" | "b" | "tie" =
    aHasExpress && !bHasExpress ? "a" : bHasExpress && !aHasExpress ? "b" : "tie";

  const aCoverage = a.supportedCountries + a.supportedCurrencies + a.deliveryMethods.length;
  const bCoverage = b.supportedCountries + b.supportedCurrencies + b.deliveryMethods.length;
  const coverageWinner: "a" | "b" | "tie" =
    aCoverage > bCoverage * 1.1 ? "a" : bCoverage > aCoverage * 1.1 ? "b" : "tie";

  const scoreA = (costWinner === "a" ? 2 : 0) + (speedWinner === "a" ? 1 : 0) + (coverageWinner === "a" ? 1 : 0) + (a.rating > b.rating ? 1 : 0);
  const scoreB = (costWinner === "b" ? 2 : 0) + (speedWinner === "b" ? 1 : 0) + (coverageWinner === "b" ? 1 : 0) + (b.rating > a.rating ? 1 : 0);
  const overallWinner: "a" | "b" | "tie" = scoreA > scoreB ? "a" : scoreB > scoreA ? "b" : "tie";

  const n = m.priced.length;
  const W = costWinner === "a" ? a : b;
  const L = costWinner === "a" ? b : a;
  const wWins = costWinner === "a" ? m.winsA : m.winsB;
  const lWins = costWinner === "a" ? m.winsB : m.winsA;
  const bestWin = [...wWins].sort((x, y) => (y.savings ?? 0) - (x.savings ?? 0))[0];

  const costExplanation = !n
    ? `No route in our sample has quotes from both ${a.name} and ${b.name} yet.`
    : costWinner === "tie"
    ? `Split ${m.winsA.length}–${m.winsB.length} across ${n} routes${m.medGap !== null ? `, median gap ${m.medGap.toFixed(2)}%` : ""}. ${a.name} led on ${labels(m.winsA) || "none"}; ${b.name} on ${labels(m.winsB) || "none"}.`
    : `${bestWin?.savings ? `Largest margin ${money(bestWin, bestWin.savings)}, ${bestWin.label} at ${sent(bestWin)}` : `${W.name} ahead`}${m.medGap !== null ? `; median ${m.medGap.toFixed(2)}%` : ""}.`;

  const speedExplanation = `Advertised, not measured: ${a.name} ${a.transferSpeed}; ${b.name} ${b.transferSpeed}.`;

  const coverageExplanation = `${a.name} lists ${a.supportedCountries}+ countries and ${a.supportedCurrencies}+ currencies; ${b.name}, ${b.supportedCountries}+ and ${b.supportedCurrencies}+.`;

  const lOnly = onlyFeatures(L, W);
  const overallSummary = !n
    ? `Without a shared route to price, choose on the terms in the table: ${a.name} or ${b.name} by fee model, delivery method and limit.`
    : costWinner === "tie"
    ? `Pick by route: ${a.name} on ${labels(m.winsA) || "none of ours"}, ${b.name} on ${labels(m.winsB) || "none of ours"}.`
    : lWins.length
    ? `On price, ${W.name} (${wWins.length}/${n}); ${L.name} for ${labels(lWins)}.`
    : `On price, ${W.name} on all ${n}${lOnly.length ? `; ${L.name} only for what it alone offers` : ""}.`;

  return {
    intro: generateIntro(a, b, corridorData),
    corridorData,
    verdict: {
      costWinner,
      speedWinner,
      coverageWinner,
      overallWinner,
      costExplanation,
      speedExplanation,
      coverageExplanation,
      overallSummary,
    },
    faqs: generateFAQs(a, b, corridorData, costWinner),
    keyDifferences: generateKeyDifferences(a, b, corridorData),
  };
}

// ── Intro ──

function generateIntro(a: Provider, b: Provider, corridorData: CorridorComparison[]): string {
  const m = measurePair(corridorData);
  if (!m.priced.length) {
    return `We hold no route where both ${a.name} and ${b.name} quote, so this page sets their published terms side by side.`;
  }
  const w = m.widest!;
  const wName = w.winner === "a" ? a.name : b.name;
  const parts = [
    `${a.name} and ${b.name} both quote ${m.priced.length} of our sample routes.`,
    w.savings ? `Widest: ${w.label} at ${sent(w)}, where ${wName} pays ${money(w, w.savings)} more (${gapPct(w).toFixed(2)}%).` : "",
    m.closest ? `Closest: ${m.closest.label}, ${gapPct(m.closest).toFixed(2)}% apart.` : "",
  ];
  return parts.filter(Boolean).join(" ");
}

// ── Key differences ──

function generateKeyDifferences(a: Provider, b: Provider, corridorData: CorridorComparison[]): string[] {
  const m = measurePair(corridorData);
  const diffs: string[] = [];
  if (m.priced.length) {
    diffs.push(
      `**Measured on ${m.priced.length} routes**: ${a.name} paid more on ${labels(m.winsA) || "none"}; ` +
        `${b.name} on ${labels(m.winsB) || "none"}` +
        (m.medGap !== null ? `. Median gap ${m.medGap.toFixed(2)}%` : "") +
        ".",
    );
  }
  const aOnly = onlyFeatures(a, b);
  const bOnly = onlyFeatures(b, a);
  if (aOnly.length || bOnly.length) {
    diffs.push(
      `**Only one offers**: ${[
        aOnly.length ? `${a.name} — ${aOnly.join(", ")}` : "",
        bOnly.length ? `${b.name} — ${bOnly.join(", ")}` : "",
      ].filter(Boolean).join("; ")}.`,
    );
  }
  return diffs;
}

// ── FAQs ──

function generateFAQs(
  a: Provider,
  b: Provider,
  corridorData: CorridorComparison[],
  costWinner: "a" | "b" | "tie",
): ComparisonFAQ[] {
  const m = measurePair(corridorData);
  const n = m.priced.length;
  if (!n) return [];
  const faqs: ComparisonFAQ[] = [];
  const W = costWinner === "b" ? b : a;
  const L = costWinner === "b" ? a : b;
  const wWins = costWinner === "b" ? m.winsB : m.winsA;
  const lWins = costWinner === "b" ? m.winsA : m.winsB;
  const bestWin = [...wWins].sort((x, y) => (y.savings ?? 0) - (x.savings ?? 0))[0];

  faqs.push({
    q: `Is ${a.name} or ${b.name} cheaper for international transfers?`,
    a: costWinner === "tie"
      ? `Neither overall: ${a.name} ${m.winsA.length}, ${b.name} ${m.winsB.length} of ${n} routes. It turns on the corridor.`
      : `${W.name}, on ${wWins.length} of ${n} routes${bestWin?.savings ? ` — ${money(bestWin, bestWin.savings)} more on a ${sent(bestWin)} ${bestWin.label} transfer` : ""}. ${L.name} led on ${labels(lWins) || "none"}.`,
  });

  if (m.widest && m.closest) {
    faqs.push({
      q: `Where do ${a.name} and ${b.name} differ most?`,
      a: `${m.widest.label}: ${gapPct(m.widest).toFixed(2)}% apart. The narrowest is ${m.closest.label} at ${gapPct(m.closest).toFixed(2)}%.`,
    });
  }

  faqs.push({
    q: `Does ${a.name} or ${b.name} charge a transfer fee?`,
    a: `Margins aside, ${a.name} quoted no fee on ${m.zeroFeeA} of ${n} routes and ${b.name} on ${m.zeroFeeB}.`,
  });

  return faqs;
}
