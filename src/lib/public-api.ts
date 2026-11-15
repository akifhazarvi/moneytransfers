import { NextResponse } from "next/server";
import { buildExtensionComparison, buildExtensionHistory, EXT_SITE } from "@/lib/extension-api";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/**
 * The public Data API (/api/v1/*), documented on /developers.
 *
 * "Clean" means the rows /send-money ranks, not the raw scraper files: every
 * source merged by tier, stale and impossible rows quarantined, each row
 * restated to "recipient gets, for a total outlay of `amount`", hidden
 * providers and transfer limits applied. It is a projection of the browser
 * extension's comparison (buildExtensionComparison), so the API, the popup and
 * the page cannot disagree. Display-only fields (logos, sign-up offers, /go
 * links, the 10-row cap) are left out: an API consumer gets the data, not our
 * page layout.
 *
 * Like /api/ext/v1, this is a contract with whoever builds on it: add fields,
 * never change or remove one. A breaking change ships as v2 beside v1.
 */

export const API_DOCS_URL = `${EXT_SITE}/developers`;

/**
 * Requests per IP per minute on /api/v1/*. The Vercel WAF rule "Data API rate
 * limit" enforces the same number at the edge, before any function runs (so a
 * flood costs nothing); this in-memory copy is the second line behind it.
 * Generous on purpose: a person using the live demo makes a few requests a
 * minute, and the CDN answers repeats of a URL without reaching either limit's
 * function. Keep the two in step if this changes.
 */
export const API_REQUESTS_PER_MINUTE = 100;
const limiter = createRateLimiter(API_REQUESTS_PER_MINUTE, 60_000);

/** A 429 when this IP is over the limit, else null. Never cached, so one caller's 429 is never served to another. */
export function rateLimitResponse(request: Request): NextResponse | null {
  const { allowed, retryAfterSeconds } = limiter(clientIp(request));
  if (allowed) return null;
  return NextResponse.json(
    { error: `Too many requests: the free API allows ${API_REQUESTS_PER_MINUTE} a minute per IP. Cache responses on your side, or join the waitlist for a key.`, docs: API_DOCS_URL },
    {
      status: 429,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}
export const API_LICENCE = {
  name: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/",
  attribution: "Data: SendMoneyCompare (https://sendmoneycompare.com)",
} as const;

export interface PublicQuote {
  /**
   * The comparison's order: by payout, except that payouts within 0.1% of each
   * other count as tied and are ordered by rating (see aboveLargerPayout).
   * Null for a row shown but not ranked.
   */
  rank: number | null;
  /** True when this row is listed above a slightly larger payout because the two are within 0.1%. */
  aboveLargerPayout: boolean;
  provider: { slug: string; name: string };
  /** In the send currency, included in `amount`. */
  fee: number;
  /** Units of the receive currency per unit of the send currency. */
  exchangeRate: number;
  /** What the recipient gets for a total outlay of `amount`. */
  receiveAmount: number;
  /** Exchange-rate margin below mid-market, in percent; null without a mid-market rate. */
  markupPct: number | null;
  /** The provider's own published estimate; null when it publishes none. We do not time transfers here. */
  speed: string | null;
  /** Why the row is not ranked (e.g. "Indicative"); null for ranked rows. */
  note: string | null;
  /** A better rate offered on a first transfer only, and the most it applies to. */
  firstTransfer: { rate: number; limit: number } | null;
}

export interface PublicQuotes {
  query: { from: string; to: string; amount: number };
  midMarket: { rate: number | null; asOf: string };
  /** Newest collection time among ranked rows. Quotes are collected every 6 hours. */
  collectedAt: string | null;
  /** How many rows are ranked (priced and comparable). */
  comparedProviders: number;
  quotes: PublicQuote[];
  compareUrl: string;
  licence: typeof API_LICENCE;
  docs: string;
}

export function buildPublicQuotes(from: string, to: string, amount: number): PublicQuotes {
  const c = buildExtensionComparison(from, to, amount);
  let rank = 0;
  return {
    query: { from: c.from, to: c.to, amount: c.amount },
    midMarket: { rate: c.mid, asOf: c.midAsOf },
    collectedAt: c.collectedAt,
    comparedProviders: c.compared,
    quotes: c.rows.map((r) => ({
      rank: r.ranked ? ++rank : null,
      aboveLargerPayout: r.tiedAhead,
      provider: { slug: r.slug, name: r.name },
      fee: r.fee,
      exchangeRate: r.rate,
      receiveAmount: r.receive,
      markupPct: r.markupPct,
      speed: r.speed,
      note: r.note,
      firstTransfer: r.firstTransfer ? { rate: r.firstTransfer.rate, limit: r.firstTransfer.limit } : null,
    })),
    compareUrl: c.compareUrl,
    licence: API_LICENCE,
    docs: API_DOCS_URL,
  };
}

export interface PublicHistory {
  pair: { from: string; to: string };
  /** Daily mid-market rate, oldest first. */
  points: { date: string; rate: number }[];
  licence: typeof API_LICENCE;
  docs: string;
}

export function buildPublicHistory(from: string, to: string): PublicHistory {
  const h = buildExtensionHistory(from, to);
  return {
    pair: { from: h.from, to: h.to },
    points: h.points.map(([date, rate]) => ({ date, rate })),
    licence: API_LICENCE,
    docs: API_DOCS_URL,
  };
}
