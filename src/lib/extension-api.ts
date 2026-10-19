import { NextResponse } from "next/server";
import { generateQuotes } from "@/lib/quotes-engine";
import { collapsedProviders } from "@/lib/comparison-cap";
import { tiedAboveLargerPayout } from "@/lib/rank-quotes";
import { providerLogo } from "@/lib/provider-logo";
import { getGoUrl } from "@/lib/affiliate";
import { compareHashHref } from "@/lib/link-eligibility";
import { SPEED_NOT_PUBLISHED } from "@/lib/delivery-labels";
import { unrankedLabel } from "@/lib/unranked-quotes";
import { MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE } from "@/lib/corridor-title-claims";
import { getMidMarketDay, getMidMarketHistory, getRateInsight } from "@/lib/rate-history";
import { getLiveActivity, type LiveActivity } from "@/lib/live-activity";
import { getProviderName, providers } from "@/data/providers";
import { getPromo } from "@/data/promos";
import xeRatesData from "@/data/scraped/xe-midmarket-rates.json";

/**
 * What the browser extension (extension/) reads: /api/ext/v1/*.
 *
 * The extension is a second surface for the comparison, not a second
 * comparison. Every figure it prints comes from here, and everything here comes
 * from the functions the site renders with — generateQuotes() for the rows and
 * their order, collapsedProviders() for the 10-row cap (TapTap at its real
 * rank), tiedAboveLargerPayout() for the "effectively tied" note,
 * MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE before row 1 is called "Best value",
 * unrankedLabel() for rows that are shown but not ranked. So the popup cannot
 * disagree with /send-money, and a rule tightened on the site reaches the
 * extension on the next deploy without an extension release.
 *
 * Versioned (`v1`) because installed extensions update on the store's schedule,
 * not ours: a payload change ships as v2 beside v1 until old installs age out.
 *
 * Public data only, no cookies read or set, so `Access-Control-Allow-Origin: *`
 * — the extension then needs no host permission (no "read and change your data
 * on sendmoneycompare.com" warning at install).
 */

export const EXT_SITE = "https://sendmoneycompare.com";

const xeRates = xeRatesData as { timestamp: string; rates: Record<string, number> };

type RateTable = { asOf: string; rates: Record<string, number> };

/**
 * USD-based XE mid-market rates and when they were collected (every 6 hours) —
 * the rates /send-money prices quotes with, so the comparison uses them too.
 */
export function extensionMidRates(): RateTable {
  return { asOf: xeRates.timestamp, rates: { USD: 1, ...xeRates.rates } };
}

// ── Live mid-market rates (converter, watchlist, alerts) ─────────────────

/**
 * currencyapi.com is the licensed live feed, on the same account as
 * /api/rates/currencyapi and the live rates board. How live it is depends on the
 * plan: daily on Free, hourly on Small, every 60 seconds on Medium and up. This
 * is how long one answer is reused; keep it at the plan's cadence so we never
 * ask more often than the feed changes. The latest-rates URL is built exactly as
 * /api/rates/currencyapi builds it, so one cached upstream call serves both.
 */
const LIVE_REVALIDATE_SECONDS = 1800;

async function currencyApi(path: "latest" | "historical", query: string, revalidate: number): Promise<RateTable | null> {
  const apiKey = process.env.CURRENCY_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`https://api.currencyapi.com/v3/${path}?apikey=${apiKey}&base_currency=USD${query}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { meta?: { last_updated_at?: string }; data?: Record<string, { value?: number }> };
    const at = Date.parse(json.meta?.last_updated_at ?? "");
    const rates: Record<string, number> = { USD: 1 };
    for (const [code, entry] of Object.entries(json.data ?? {})) {
      if (typeof entry?.value === "number" && entry.value > 0) rates[code] = entry.value;
    }
    return Number.isFinite(at) && Object.keys(rates).length > 30 ? { asOf: new Date(at).toISOString(), rates } : null;
  } catch {
    return null;
  }
}

export const CHANGE_PERIODS = { "1D": 1, "1W": 7, "15D": 15, "30D": 30 } as const;
export type ChangePeriod = keyof typeof CHANGE_PERIODS;

export interface ExtRates {
  /** When the source set these rates (not when we fetched them). */
  asOf: string;
  /**
   * "live": the licensed feed. "snapshot": the 6-hourly XE collection, used
   * whenever it is the fresher of the two (or the feed is unavailable).
   */
  source: "live" | "snapshot";
  /** USD-based mid-market rates. */
  rates: Record<string, number>;
  /**
   * USD-based closes 1, 7, 15 and 30 days before `asOf`, for the change over
   * each period. They come from the same source as `rates` when it publishes
   * them, so a change is never the gap between two feeds; otherwise from the
   * XE daily history (src/data/scraped/midmarket-history.json).
   */
  ago: Record<ChangePeriod, { date: string; rates: Record<string, number> } | null>;
}

// Eight significant digits: well past what any rate is printed with.
function compact(rates: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(rates).map(([code, v]) => [code, Number(v.toPrecision(8))]));
}

export async function buildExtensionRates(): Promise<ExtRates> {
  const snapshot = extensionMidRates();
  const live = await currencyApi("latest", "", LIVE_REVALIDATE_SECONDS);
  const useLive = live !== null && Date.parse(live.asOf) >= Date.parse(snapshot.asOf);
  const primary = useLive ? live : snapshot;
  // The fresher source sets every rate it has; the other only fills currencies it lacks.
  const rates = { ...(useLive ? snapshot.rates : (live?.rates ?? {})), ...primary.rates };

  const ago = {} as ExtRates["ago"];
  await Promise.all(
    (Object.entries(CHANGE_PERIODS) as [ChangePeriod, number][]).map(async ([period, days]) => {
      const date = new Date(Date.parse(primary.asOf) - days * 86_400_000).toISOString().slice(0, 10);
      // A past day's close never changes, so it is fetched once a day at most.
      const close = useLive ? await currencyApi("historical", `&date=${date}`, 86_400) : null;
      const day = close ? { date, rates: close.rates } : getMidMarketDay(date);
      ago[period] = day ? { date: day.date, rates: compact(day.rates) } : null;
    }),
  );

  return { asOf: primary.asOf, source: useLive ? "live" : "snapshot", rates: compact(rates), ago };
}

export function extJson(body: unknown, maxAgeSeconds: number, status = 200, staleSeconds = 86400): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": `public, max-age=${Math.min(maxAgeSeconds, 300)}, s-maxage=${maxAgeSeconds}, stale-while-revalidate=${staleSeconds}`,
    },
  });
}

export function parseCurrency(value: string | null): string | null {
  const code = (value || "").toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : null;
}

const MAX_AMOUNT = 1_000_000;

export function parseAmount(value: string | null): number | null {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT ? amount : null;
}

export interface ExtFirstTransfer {
  rate: number;
  /** Most the first-transfer rate applies to, in the send currency. */
  limit: number;
  /** How much more arrives on the first transfer, at min(amount, limit). */
  extra: number;
}

export interface ExtOffer {
  badge: string;
  text: string;
  code: string | null;
  /** When an editor last confirmed it on the provider's site (YYYY-MM-DD). */
  checked: string;
}

export interface ExtRow {
  slug: string;
  name: string;
  logo: string;
  receive: number;
  fee: number;
  rate: number;
  /** Below mid-market, in percent; null without a mid-market rate. */
  markupPct: number | null;
  /** The provider's or source's published estimate; null when none is published. */
  speed: string | null;
  /** Scraped Trustpilot score only — a fallback rating is never printed. */
  trustpilot: number | null;
  ranked: boolean;
  /** Why an unranked row is not ranked, or "Indicative" for a quote-on-request broker. */
  note: string | null;
  /** Hidden until "Show all" — the site's 10-row cap. */
  collapsed: boolean;
  /** Listed above a slightly larger payout: within 0.1%, so tied and ordered by rating. */
  tiedAhead: boolean;
  firstTransfer: ExtFirstTransfer | null;
  offer: ExtOffer | null;
  /** Provider's own site, for "you're on <provider>" matching. */
  website: string | null;
  sendUrl: string;
}

export interface ExtComparison {
  from: string;
  to: string;
  amount: number;
  mid: number | null;
  midAsOf: string;
  /** Newest collection date among ranked rows. */
  collectedAt: string | null;
  /** Ranked (priced, comparable) providers. */
  compared: number;
  /** True when row 1 may carry "Best value" (rule 6: 3+ priced providers). */
  topLabel: boolean;
  rows: ExtRow[];
  compareUrl: string;
}

// unified-quotes.ts writes this note when a provider publishes a better rate
// for a first transfer; it is the only promoNote a ranked row carries.
const FIRST_TRANSFER_NOTE = /^First transfer rate ([\d.]+) [A-Z]{3} \(up to ([\d.]+) [A-Z]{3}\)$/;

function firstTransfer(note: string | undefined, amount: number, rate: number): ExtFirstTransfer | null {
  const m = note ? FIRST_TRANSFER_NOTE.exec(note) : null;
  if (!m) return null;
  const promoRate = Number(m[1]);
  const limit = Number(m[2]);
  if (!(promoRate > rate) || !(limit > 0)) return null;
  const extra = Math.round((promoRate - rate) * Math.min(amount, limit) * 100) / 100;
  return { rate: promoRate, limit, extra };
}

// A sign-up offer whose own wording names an end date that has passed is not offered.
const VALID_UNTIL = /(?:valid )?until ([A-Z][a-z]+ \d{1,2}, \d{4})/i;

/**
 * An offer nobody has re-checked on the provider's site in this long is not
 * shown: providers change sign-up offers every few months, and the extension
 * puts them next to a Send button.
 */
const OFFER_MAX_AGE_DAYS = 183;

function offerFor(slug: string, from: string): ExtOffer | null {
  const promo = getPromo(slug);
  if (!promo?.signUpOffer || !promo.signUpBadge) return null;
  if (promo.offerSendCurrencies && !promo.offerSendCurrencies.includes(from)) return null;
  if (Date.now() - Date.parse(promo.lastVerified) > OFFER_MAX_AGE_DAYS * 86_400_000) return null;
  const until = promo.signUpOffer.match(VALID_UNTIL)?.[1];
  if (until && Date.parse(until) < Date.now()) return null;
  return { badge: promo.signUpBadge, text: promo.signUpOffer, code: promo.promoCode, checked: promo.lastVerified };
}

const websiteBySlug = new Map(providers.map((p) => [p.slug, p.website]));

export function buildExtensionComparison(from: string, to: string, amount: number): ExtComparison {
  const { asOf, rates } = extensionMidRates();
  const mid = rates[from] && rates[to] ? rates[to] / rates[from] : null;
  const quotes = generateQuotes(amount, from, to, rates);

  const ranked = quotes.filter((q) => !q.isIndicative);
  const hidden = collapsedProviders(quotes.map((q) => q.providerSlug));
  const tied = tiedAboveLargerPayout(quotes);
  const collectedAt = ranked.reduce<string | null>(
    (latest, q) => (q.dateCollected && (!latest || q.dateCollected > latest) ? q.dateCollected : latest),
    null,
  );

  const rows: ExtRow[] = quotes.map((q) => {
    const isRanked = !q.isIndicative;
    return {
      slug: q.providerSlug,
      name: getProviderName(q.providerSlug),
      logo: EXT_SITE + providerLogo(q.providerSlug),
      receive: q.receiveAmount,
      fee: q.fee,
      rate: q.exchangeRate,
      markupPct: mid ? Math.round(((mid - q.exchangeRate) / mid) * 10000) / 100 : null,
      speed: q.transferSpeed && q.transferSpeed !== SPEED_NOT_PUBLISHED ? q.transferSpeed : null,
      trustpilot: q.ratingIsTrustpilot ? q.rating : null,
      ranked: isRanked,
      note: q.unranked ? unrankedLabel(q, "short") : q.isIndicative ? "Indicative · quote on request" : null,
      collapsed: hidden.has(q.providerSlug),
      tiedAhead: tied.has(q.providerSlug),
      firstTransfer: isRanked ? firstTransfer(q.promoNote, amount, q.exchangeRate) : null,
      offer: offerFor(q.providerSlug, from),
      website: websiteBySlug.get(q.providerSlug) ?? null,
      sendUrl:
        EXT_SITE +
        getGoUrl(q.providerSlug, { sourceCurrency: from, targetCurrency: to, sourceAmount: amount, clickref: "extension" }),
    };
  });

  return {
    from,
    to,
    amount,
    mid,
    midAsOf: asOf,
    collectedAt,
    compared: ranked.length,
    topLabel: ranked.length >= MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE,
    rows,
    compareUrl: EXT_SITE + compareHashHref(from, to, amount),
  };
}

export interface ExtHistory {
  from: string;
  to: string;
  /** Daily mid-market closes, oldest first: [YYYY-MM-DD, rate]. */
  points: [string, number][];
  /** "Is now a good time?" — null when the corridor has too little history to score. */
  timing: { score: number; headline: string; explanation: string; daysObserved: number } | null;
  /**
   * Who paid the most most often over 90 days; null when evidence is thin.
   * winRatePct is days won ÷ the days THIS provider was quoted (quotedDays), so
   * it is printed against quotedDays, never against the corridor's day count.
   */
  usualLeader: { slug: string; name: string; winRatePct: number; quotedDays: number } | null;
}

export function buildExtensionHistory(from: string, to: string): ExtHistory {
  const points = (getMidMarketHistory(from, to) ?? []).map((p): [string, number] => [p.date, p.rate]);
  const insight = getRateInsight(from, to);
  const score = insight?.sendScore ?? null;
  const consistency = insight?.providerConsistency ?? null;
  const leader = consistency?.leaders[0];
  return {
    from,
    to,
    points,
    timing: score
      ? { score: score.score, headline: score.headline, explanation: score.explanation, daysObserved: score.daysObserved }
      : null,
    usualLeader:
      leader
        ? {
            slug: leader.providerSlug,
            name: leader.providerName,
            winRatePct: Math.round(leader.winRate),
            quotedDays: leader.quotedDays,
          }
        : null,
  };
}

/**
 * The site's live activity feed (src/lib/live-activity.ts) for the extension's
 * strip: the same real reader events and "here now" counts, with logos made
 * absolute. The extension only reads it; it never records events of its own.
 */
export async function buildExtensionActivity(): Promise<LiveActivity> {
  const feed = await getLiveActivity();
  return { ...feed, items: feed.items.slice(0, 20).map((i) => (i.logo ? { ...i, logo: EXT_SITE + i.logo } : i)) };
}
