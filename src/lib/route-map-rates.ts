/**
 * Route predicates that need the rate-history datasets — split out of
 * route-map.ts so that module stays dataless.
 *
 * WHY THIS FILE EXISTS
 * `@/lib/rate-history` statically imports rate-insights.json (27 MB) and
 * midmarket-history.json, and says in its own header that it "must stay
 * server-side only". route-map.ts imported it for exactly one thing — the
 * renderable-history-pairs set below. But route-map.ts is the module every
 * link generator is told to ask, including client components: ProviderCard
 * imports `companyPageRenders`, a one-line Set.has(). That single import
 * dragged the whole 27 MB into the browser bundle, and on 2026-09-18
 * /send-money shipped a 3.85 MB brotli / 33.5 MB parsed chunk because of it —
 * 145x the page's 30.7 KB of HTML.
 *
 * RULE: anything here reads a dataset and is server-only. Anything a client
 * component might import belongs in route-map.ts, which must never import
 * `@/lib/rate-history`. This mirrors the existing rate-history /
 * rate-history-types split.
 */
import { KEEP_HISTORY_PAIRS, getAllInsights, corridorToSlug } from "@/lib/rate-history";
import {
  corridorPageRenders,
  comparePageRenders,
  companyPageRenders,
  guidePageRenders,
  newsPageRenders,
  ibanPageRenders,
  swiftPageRenders,
  bankPageRenders,
  businessPageRenders,
} from "@/lib/route-map";

/* ── /exchange-rates/history/[pair] ─────────────────────────────────────── */
// dynamicParams = false; a pair needs BOTH an allowlist entry and enough
// history to produce an insight.
let historyPairs: Set<string> | null = null;
function renderableHistoryPairs(): Set<string> {
  if (!historyPairs) {
    historyPairs = new Set(
      getAllInsights(2)
        .map((i) => corridorToSlug(i.corridor))
        .filter((p) => KEEP_HISTORY_PAIRS.has(p)),
    );
  }
  return historyPairs;
}

export function rateHistoryPageRenders(pair: string | undefined | null): boolean {
  return Boolean(pair) && renderableHistoryPairs().has(pair as string);
}

/** `/exchange-rates/history/<pair>` when it renders, else null. */
export function rateHistoryHref(pair: string | undefined | null): string | null {
  return rateHistoryPageRenders(pair) ? `/exchange-rates/history/${pair}` : null;
}

/**
 * Guides that are dedicated routes under src/app/[locale]/guides/ rather than
 * entries in blogPosts. Keep in sync with that directory.
 */
const STANDALONE_GUIDES = new Set([
  "bank-vs-app-transfer-cost-2026",
  "best-apps-to-send-money-from-us-2026",
  "best-day-to-send-money-abroad",
  "fx-cost-vs-purchasing-power",
  "gbp-forecast-2026",
]);

/* ── generic gate ───────────────────────────────────────────────────────── */
/**
 * True when an internal path renders. Static paths are assumed to render (they
 * are not generated from data and check:links catches a typo); every
 * data-driven family is checked against its route's gate.
 *
 * Affiliate redirects and API routes are intentionally excluded from this
 * check — /go and /out are 302 handlers, disallowed in robots.txt.
 */
export function internalPathRenders(path: string): boolean {
  const clean = path.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
  const seg = clean.split("/").filter(Boolean);
  if (seg.length === 0) return true;
  if (seg[0] === "go" || seg[0] === "out" || seg[0] === "api") return true;

  switch (seg[0]) {
    case "send-money":
      return seg.length === 1 || corridorPageRenders(seg[1]);
    case "compare":
      return seg.length === 1 || comparePageRenders(seg[1]);
    case "companies":
      return seg.length === 1 || companyPageRenders(seg[1]);
    case "guides":
      // The five flagship data-stories are their own routes rather than
      // blogPosts entries, so they are named here explicitly.
      return seg.length === 1 || guidePageRenders(seg[1]) || STANDALONE_GUIDES.has(seg[1]);
    case "news":
      return seg.length === 1 || newsPageRenders(seg[1]);
    case "iban":
      return seg.length === 1 || ibanPageRenders(seg[1]);
    case "swift-codes":
      return seg.length === 1 || swiftPageRenders(seg[1]);
    case "banks":
      return seg.length === 1 || bankPageRenders(seg[1]);
    case "business":
      return seg.length === 1 || businessPageRenders(seg[1]);
    case "exchange-rates":
      if (seg.length === 1) return true;
      if (seg[1] === "history") return seg.length === 2 || rateHistoryPageRenders(seg[2]);
      return true; // /exchange-rates/[pair] renders on demand
    default:
      return true; // static route
  }
}
