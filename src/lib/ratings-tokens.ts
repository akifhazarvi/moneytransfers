// App-store ratings, overlaid from the scraper output so guide copy never
// hardcodes a score. Guide content carries tokens (see renderDataTokens) that
// are replaced at render time with whatever the latest scrape holds.
//
// Read this before using these numbers in copy: app-store scores are NOT
// comparable to Trustpilot. Stores prompt happy users inside the app at a
// good moment, so nearly every provider lands between 4.6 and 4.9 and the
// metric barely discriminates. PayPal is the clearest case — 1.3 on
// Trustpilot, 4.8 on the App Store. Always present the two side by side,
// never swap one in for the other.
import appRatingsData from "@/data/scraped/app-store-ratings.json";
import trustpilotData from "@/data/scraped/trustpilot-ratings.json";
import { SITE_STATS, atLeast } from "./site-stats";
import { generateQuotes } from "@/lib/quotes-engine";
import { getMidMarketRate, quoteDataDate, providerNames } from "@/lib/unified-quotes";
import { providers, type TransferQuote } from "@/data/providers";
import { sendCurrencies, currencies } from "@/data/transfer-currencies";
import { companyPageRenders } from "@/lib/route-map";

export interface StoreRating {
  score: number | null;
  ratingCount: number | null;
  appName: string | null;
}

export interface AppRating {
  slug: string;
  name: string;
  storefront: string;
  apple: StoreRating & { appleId: string };
  googlePlay: StoreRating & { playPackage: string };
  dateCollected: string;
}

const appRatings = appRatingsData as AppRating[];

const byslug = new Map(appRatings.map((r) => [r.slug, r]));

const trustpilotBySlug = new Map(
  (trustpilotData as { slug: string; score: number | null; totalReviews: number | null }[]).map(
    (r) => [r.slug, r]
  )
);

export function getAppRating(slug: string): AppRating | undefined {
  return byslug.get(slug);
}

function fmtCount(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString("en-US");
}

function fmtStore(r: StoreRating | undefined): string {
  if (!r || r.score === null) return "—";
  return `${r.score.toFixed(1)} (${fmtCount(r.ratingCount)})`;
}

/**
 * Inline app-store scores for one provider, e.g. "4.9 App Store / 4.8 Google Play".
 * Returns an empty string when we have no data, so copy degrades cleanly.
 */
export function renderAppScores(slug: string): string {
  const r = byslug.get(slug);
  if (!r) return "";
  const parts: string[] = [];
  if (r.apple.score !== null) parts.push(`${r.apple.score.toFixed(1)} App Store`);
  if (r.googlePlay.score !== null) parts.push(`${r.googlePlay.score.toFixed(1)} Google Play`);
  return parts.join(" / ");
}

/**
 * Inline Trustpilot score for one provider, e.g. "4.3/5 (299K reviews)".
 * These were previously hardcoded in guide copy and drifted months out of
 * date; the token keeps them tied to the scrape.
 */
export function renderTrustpilot(slug: string): string {
  const tp = trustpilotBySlug.get(slug);
  if (!tp || tp.score === null) return "";
  return `${tp.score.toFixed(1)}/5 (${fmtCount(tp.totalReviews)} reviews)`;
}

/**
 * The full cross-provider table: Trustpilot beside both app stores, ordered
 * by the size of the gap so the comparability problem is the visible story
 * rather than a footnote.
 */
export function renderAppRatingsTable(): string {
  const rows = appRatings
    .map((r) => {
      const tp = trustpilotBySlug.get(r.slug);
      const storeScores = [r.apple.score, r.googlePlay.score].filter(
        (s): s is number => s !== null
      );
      const storeAvg =
        storeScores.length > 0
          ? storeScores.reduce((a, b) => a + b, 0) / storeScores.length
          : null;
      const gap = tp?.score != null && storeAvg !== null ? storeAvg - tp.score : null;
      return { r, tp, gap };
    })
    .sort((a, b) => (b.gap ?? -Infinity) - (a.gap ?? -Infinity));

  const body = rows
    .map(({ r, tp, gap }) => {
      const tpCell =
        tp?.score != null ? `${tp.score.toFixed(1)} (${fmtCount(tp.totalReviews)})` : "—";
      const gapCell = gap === null ? "—" : `${gap > 0 ? "+" : ""}${gap.toFixed(1)}`;
      return `<tr><td><strong>${r.name}</strong></td><td>${tpCell}</td><td>${fmtStore(
        r.apple
      )}</td><td>${fmtStore(r.googlePlay)}</td><td>${gapCell}</td></tr>`;
    })
    .join("\n");

  const collected = appRatings[0]?.dateCollected?.slice(0, 10) ?? "";

  return `<div class="blog-table-box">
<h3 style="margin-top: 0;">Trustpilot vs App Store Ratings (All Providers)</h3>
<table>
<thead><tr><th>Provider</th><th>Trustpilot</th><th>App Store (iOS)</th><th>Google Play</th><th>Gap</th></tr></thead>
<tbody>
${body}
</tbody>
</table>
<p class="blog-footnote">Review counts in brackets. "Gap" is the average app-store score minus the Trustpilot score. App-store figures are the US storefront, collected ${collected}; a provider's own marketing usually quotes a global total, which is a larger number than any single storefront reports.</p>
</div>`;
}

/**
 * Replaces data tokens in guide/article HTML with live scraped values.
 * Unknown tokens are left untouched rather than blanked, so a typo is
 * visible in review instead of silently deleting content.
 */
// ── Live quote tokens ─────────────────────────────────────────────────────
// Guides used to carry rate figures in prose ("recipient gets ₹91,596") that
// were true the week they were written and false every week after, while the
// product surface next to them showed the live number — /guides/wise-vs-remitly
// and /compare/wise-vs-remitly disagreed by ₹2,000 on the same $1,000 USD→INR
// transfer. These tokens read the same generateQuotes() the comparison tables
// use, so an article can quote a figure without owning it.
//
//   {{RECEIVE:wise:USD:INR:1000}}          ₹93,867
//   {{FEE:wise:USD:INR:1000}}              $6.85
//   {{MARKUP:wise:USD:INR:1000}}           0%  |  0.32%  |  below mid-market
//   {{COST:wise:USD:INR:1000}}             $6.85   (fee + markup, send currency)
//   {{CHEAPER:wise:remitly:USD:INR:1000}}  Remitly   (the one that delivers more)
//   {{PRICIER:wise:remitly:USD:INR:1000}}  Wise
//   {{RECEIVE_DIFF:wise:remitly:USD:INR:1000}}  ₹345  (absolute gap)
//   {{QUOTE_LIST:USD:INR:1000:xoom,instarem,remitly,wise}}  <li>…</li> per
//        provider with a quote, best payout first, linked where a review exists
//   {{QUOTE_DATE}}                         6 September 2026
//
// A token we cannot resolve is left in place on purpose: check-assets renders
// every guide at build time and fails on a literal "{{", so a corridor that
// loses coverage fails the build instead of shipping a hole in a sentence.

const quoteCache = new Map<string, TransferQuote[]>();
function quotesFor(from: string, to: string, amount: number): TransferQuote[] {
  const key = `${from}_${to}_${amount}`;
  let q = quoteCache.get(key);
  if (!q) {
    q = generateQuotes(amount, from, to).filter((x) => !x.isIndicative);
    quoteCache.set(key, q);
  }
  return q;
}
function quoteFor(slug: string, from: string, to: string, amount: number): TransferQuote | undefined {
  return quotesFor(from, to, amount).find((q) => q.providerSlug === slug);
}

function symbolFor(code: string): string {
  return (
    sendCurrencies.find((c) => c.code === code)?.symbol ??
    currencies.find((c) => c.code === code)?.symbol ??
    ""
  );
}
function fmtMoney(code: string, n: number): string {
  const digits = Math.abs(n) >= 10_000 ? 0 : 2;
  const num = n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const sym = symbolFor(code);
  return sym ? `${sym}${num}` : `${num} ${code}`;
}
function markupPctOf(q: TransferQuote, from: string, to: string): number {
  const mid = getMidMarketRate(from, to);
  return mid > 0 ? (1 - q.exchangeRate / mid) * 100 : 0;
}
function fmtMarkup(pct: number): string {
  if (pct < -0.05) return "below mid-market";
  if (pct < 0.05) return "0%";
  return `${pct.toFixed(2)}%`;
}
function providerName(slug: string): string {
  return providers.find((p) => p.slug === slug)?.name ?? providerNames[slug] ?? slug;
}
function providerLink(slug: string): string {
  const name = providerName(slug);
  return companyPageRenders(slug) ? `<a href="/companies/${slug}">${name}</a>` : name;
}

/** The day of the freshest quote, e.g. "6 September 2026". */
export function renderQuoteDate(): string {
  const iso = quoteDataDate ?? new Date().toISOString().slice(0, 10);
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function renderQuoteTokens(html: string): string {
  let out = html;

  out = out.replace(
    /\{\{(RECEIVE|FEE|MARKUP|COST):([a-z0-9-]+):([A-Z]{3}):([A-Z]{3}):(\d+)\}\}/g,
    (match, kind: string, slug: string, from: string, to: string, amt: string) => {
      const amount = Number(amt);
      const q = quoteFor(slug, from, to, amount);
      if (!q) return match;
      switch (kind) {
        case "RECEIVE":
          return fmtMoney(to, q.receiveAmount);
        case "FEE":
          return fmtMoney(from, q.fee);
        case "MARKUP":
          return fmtMarkup(markupPctOf(q, from, to));
        case "COST":
          return fmtMoney(from, q.fee + (Math.max(0, markupPctOf(q, from, to)) / 100) * amount);
      }
      return match;
    },
  );

  out = out.replace(
    /\{\{(CHEAPER|PRICIER|RECEIVE_DIFF):([a-z0-9-]+):([a-z0-9-]+):([A-Z]{3}):([A-Z]{3}):(\d+)\}\}/g,
    (match, kind: string, a: string, b: string, from: string, to: string, amt: string) => {
      const amount = Number(amt);
      const qa = quoteFor(a, from, to, amount);
      const qb = quoteFor(b, from, to, amount);
      if (!qa || !qb) return match;
      const aWins = qa.receiveAmount >= qb.receiveAmount;
      switch (kind) {
        case "CHEAPER":
          return providerName(aWins ? a : b);
        case "PRICIER":
          return providerName(aWins ? b : a);
        case "RECEIVE_DIFF":
          return fmtMoney(to, Math.abs(qa.receiveAmount - qb.receiveAmount));
      }
      return match;
    },
  );

  out = out.replace(
    /\{\{QUOTE_LIST:([A-Z]{3}):([A-Z]{3}):(\d+):([a-z0-9,-]+)\}\}/g,
    (match, from: string, to: string, amt: string, list: string) => {
      const amount = Number(amt);
      const items = list
        .split(",")
        .map((slug) => ({ slug, q: quoteFor(slug, from, to, amount) }))
        .filter((x): x is { slug: string; q: TransferQuote } => Boolean(x.q))
        .sort((x, y) => y.q.receiveAmount - x.q.receiveAmount);
      if (items.length === 0) return match;
      return items
        .map(
          ({ slug, q }) =>
            `<li><strong>${providerLink(slug)}</strong>: ${fmtMoney(from, q.fee)} fee, ${fmtMarkup(
              markupPctOf(q, from, to),
            )} markup — recipient gets ${fmtMoney(to, q.receiveAmount)}</li>`,
        )
        .join("\n");
    },
  );

  out = out.split("{{QUOTE_DATE}}").join(renderQuoteDate());
  return out;
}

export function renderDataTokens(html: string): string {
  let out = html;

  if (out.includes("{{APP_RATINGS_TABLE}}")) {
    out = out.split("{{APP_RATINGS_TABLE}}").join(renderAppRatingsTable());
  }

  // {{TRUSTPILOT:wise}} -> "4.3/5 (299K reviews)"
  out = out.replace(/\{\{TRUSTPILOT:([a-z0-9-]+)\}\}/g, (match, slug: string) => {
    const rendered = renderTrustpilot(slug);
    return rendered || match;
  });

  // {{APP_SCORES:remitly}} -> "4.9 App Store / 4.8 Google Play"
  out = out.replace(/\{\{APP_SCORES:([a-z0-9-]+)\}\}/g, (match, slug: string) => {
    const rendered = renderAppScores(slug);
    return rendered || match;
  });

  // Coverage counts. Article prose used to hand-type these ("50+ providers
  // across 80+ corridors"), which produced four different provider counts and
  // a corridor count 10x below the truth. These read from site-stats, so a
  // sentence written today still describes the site a year from now.
  // {{PROVIDER_COUNT}} -> "90+"
  out = out.split("{{PROVIDER_COUNT}}").join(atLeast(SITE_STATS.liveProviders));
  out = out.split("{{CORRIDOR_COUNT}}").join(atLeast(SITE_STATS.comparableCorridors));
  out = out.split("{{CURRENCY_COUNT}}").join(atLeast(SITE_STATS.currencies));

  if (out.includes("{{")) out = renderQuoteTokens(out);

  return out;
}
