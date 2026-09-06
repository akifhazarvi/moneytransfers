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

  return out;
}
