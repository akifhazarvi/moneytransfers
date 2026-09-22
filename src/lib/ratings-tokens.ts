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
import { getGoUrl } from "@/lib/affiliate";
import { MEASURED_MARKUPS, REMITTANCE_INDEX } from "@/lib/remittance-cost-index";
import { CONSISTENCY_ROWS, CONSISTENCY_INDEX } from "@/lib/consistency-index";
import ibanStructures from "@/data/scraped/iban-structures.json";
import { ibanPageRenders } from "@/lib/route-map";
import { computeBusinessFxIndex, BUSINESS_FX_SLUGS, type BusinessFxIndex } from "@/lib/business-fx-index";
import corridorLeaders from "@/data/scraped/corridor-leaders.json";
import { AMOUNT_TIER_INDEX } from "@/lib/amount-tier-index";
import CORRIDOR_LEADERS from "@/data/scraped/corridor-leaders.json";
import { getRateInsight } from "@/lib/rate-history";
import { getBankAggregateStats, getBankCorridorQuotes } from "@/lib/bank-comparisons";

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
/**
 * Live four-way cost table for the Wise / Remitly / Xoom / XE comparison guide.
 *
 * WHY A TOKEN RATHER THAN TYPED-IN NUMBERS
 * A four-way "which actually costs less" guide is worthless the moment its
 * figures go stale, and a hand-typed table goes stale silently. This renders
 * from the same indices the rest of the site publishes, so the guide cannot
 * claim a cost the cost index disagrees with.
 *
 * WHY THREE DIFFERENT MEASURES SIT SIDE BY SIDE
 * Average cost alone gives a misleading winner here, and the guide's whole
 * point is that the measures disagree: XE has the lowest average cost of the
 * four while leading almost no corridors, because its average is taken over a
 * far smaller corridor set than Wise's. Publishing the coverage column beside
 * the cost is what stops that being a false headline — the same reason
 * remittance-cost-index.ts separates banks from specialists rather than
 * ranking a five-corridor bank against a 300-corridor specialist.
 */
export function renderFourWayCostTable(): string {
  const SLUGS = ["xe", "wise", "xoom", "remitly"] as const;
  const rows = SLUGS.map((slug) => {
    const cost = REMITTANCE_INDEX.providers.find((p) => p.slug === slug);
    const cons = CONSISTENCY_ROWS.find((r) => r.providerSlug === slug);
    const tier = AMOUNT_TIER_INDEX.rows.find((r) => r.slug === slug);
    return { slug, cost, cons, tier };
  })
    .filter((r) => r.cost)
    .sort((a, b) => a.cost!.avgCostPct - b.cost!.avgCostPct);

  const body = rows
    .map(({ cost, cons, tier }) => {
      const c = cost!;
      const led = cons ? `${cons.corridorsLed} of ${cons.corridorsQuoted}` : "—";
      const win = cons ? `${cons.winRate.toFixed(1)}%` : "—";
      const small = tier ? `${tier.costSmallPct.toFixed(2)}%` : "not enough data";
      return `<tr><td><strong>${c.name}</strong></td><td>${c.avgCostPct.toFixed(2)}%</td><td>${c.avgFeePct.toFixed(
        2,
      )}% / ${c.avgMarkupPct.toFixed(2)}%</td><td>${c.corridors}</td><td>${led}</td><td>${win}</td><td>${small}</td></tr>`;
    })
    .join("\n");

  return `<div class="blog-table-box">
<h3 style="margin-top: 0;">Wise vs Remitly vs Xoom vs XE — measured cost, ${renderQuoteDate()}</h3>
<table>
<thead><tr><th>Provider</th><th>Avg cost, $1,000</th><th>of which fee / markup</th><th>Corridors priced</th><th>Corridors led</th><th>Days won</th><th>Cost at $100</th></tr></thead>
<tbody>
${body}
</tbody>
</table>
<p class="blog-footnote">Cost is the fee plus the exchange-rate markup as a share of the amount sent. <strong>The averages are not taken over the same corridors</strong> — each provider is priced on the routes it actually quotes, so a provider covering 35 corridors and one covering 350 are not directly comparable on the cost column alone; read it alongside "corridors priced". "Corridors led" counts routes where the provider is the most frequent winner over the trailing 90 days, and "days won" is its share of contested days it quoted on. Full method on the <a href="/remittance-cost-index">Remittance Cost Index</a> and the <a href="/provider-consistency">Provider Consistency Index</a>.</p>
</div>`;
}

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
//   {{QUOTE_TABLE:USD:INR:1000}}           a full <tr> league table for the
//        corridor — every provider quoting it, most received first
//   {{MARKUP_BY_CORRIDOR}}                 fee + markup per major corridor —
//        cheapest provider, its fee and markup, the median across everyone
//        quoting the route, and the worst. Takes an optional amount
//        ({{MARKUP_BY_CORRIDOR:5000}}); defaults to 1000 of the send currency.
//   {{BEST_PROVIDER:USD:INR:1000}}         TapTap Send
//   {{BEST_RECEIVE:USD:INR:1000}}          ₹94,411
//   {{WORST_PROVIDER|WORST_RECEIVE:…}}     the other end of the same table
//   {{SPREAD:USD:INR:1000}}                ₹6,797  (best minus worst)
//   {{MID_RATE:USD:INR}}                   94.5145 (mid-market, from the XE snapshot)
//   {{MID_RECEIVE:USD:INR:1000}}           ₹94,515 (the amount at mid-market, i.e.
//        what a transfer would deliver with no markup and no fee)
//   {{QUOTE_DATE}}                         6 September 2026
//   {{COST_PCT:wise:USD:INR:1000}}         0.69%  (total cost as % of amount sent)
//   {{AVG_MARKUP:instarem}}                "0.70% median across the 166 corridors we
//        quote it on" — the honest version of a hand-typed "average markup of
//        0.42%". Renders its own denominator on purpose: this mean is taken
//        over every amount, while the /remittance-cost-index table is $1,000
//        only, so the two figures differ slightly and each must say which it is.
//   {{RATINGS_DATE}}                       6 September 2026 (Trustpilot scrape)
//   {{IBAN_FORMAT_TABLE}}                  89-country IBAN length/example table
//   {{LEADS:wise}}                         44 of the 212 corridors we can compare
//   {{LEADER_MAP}}                         a table of who actually leads, by
//        provider, with the corridor count and examples — the answer to "which
//        app is best" is "it depends on your route", stated with the evidence
//   {{UNANIMOUS_LEAD:taptap-send}}          "10 corridors — including EUR → CNY,
//        GBP → CNY and USD → MYR — where it delivered the most on every one of
//        the last 91 days we could compare". The strongest honest claim a
//        provider can make here, and it goes unstated because nothing computed it.
//   {{CORRIDOR_LEADER:USD:INR}}            "Ria Money Transfer, which led on 73 of
//        the last 91 days we could compare" — the measured leader
//        for ONE corridor, as opposed to {{LEADS:}}'s site-wide count
//   {{BANK_SAVINGS_PCT}}                   46%   (specialist vs bank on $1,000)
//   {{BUSINESS_SAVINGS_PCT}}               62%   (business-FX specialist vs bank, $5,000)
//   {{BUSINESS_BANK_COST_PCT}}             4.32% (avg bank all-in cost, $5,000)
//   {{BUSINESS_SPECIALIST_COST_PCT}}       1.65% (avg business-FX specialist, $5,000)
//   {{AVG_BANK_COST}}                      $55.16  (avg bank cost per $1,000)
//   {{AVG_SPECIALIST_COST}}                $29.68  (avg specialist cost per $1,000)
//
// A token we cannot resolve is left in place on purpose: check-assets renders
// every guide at build time and fails on a literal "{{", so a corridor that
// loses coverage fails the build instead of shipping a hole in a sentence.

/**
 * Average cost saved by using a specialist rather than a bank on $1,000, as a
 * whole percent. Mirrors the same calculation the /remittance-cost-index page
 * puts in its "Savings vs banks" tile, so the guide and the study cannot
 * disagree.
 */
/**
 * Business-FX index, computed at most once per build.
 *
 * Business guides quoted the same "80-95% cheaper than banks" range as the
 * consumer ones, though it is a different population at a different amount.
 * Measured at $5,000 the gap is 4.32% against 1.65% — about 62% — so the two
 * families of claim now read from their own study and say which one it is.
 */
let businessIdx: BusinessFxIndex | undefined;
function businessFx(): BusinessFxIndex {
  if (!businessIdx) businessIdx = computeBusinessFxIndex();
  return businessIdx;
}

function businessSavingsPct(): number {
  const { bankAvgCostPct: bank, specialistAvgCostPct: spec } = businessFx();
  return bank > 0 ? Math.round(((bank - spec) / bank) * 100) : 0;
}

function bankSavingsPct(): number {
  const { avgBankCost: bank, avgSpecialistCost: spec } = REMITTANCE_INDEX;
  return bank > 0 ? Math.round(((bank - spec) / bank) * 100) : 0;
}

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
function fmtMoney(code: string, n: number, digits = Math.abs(n) >= 10_000 ? 0 : 2): string {
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
/** Fee plus the cost of the rate markup, in the send currency. */
function totalCost(q: TransferQuote, from: string, to: string, amount: number): number {
  return q.fee + (Math.max(0, markupPctOf(q, from, to)) / 100) * amount;
}

function providerName(slug: string): string {
  return providers.find((p) => p.slug === slug)?.name ?? providerNames[slug] ?? slug;
}
/**
 * Affiliate href for a table row, tagged with the corridor and amount so the
 * /go route can attribute the click. `src` marks it as a guide-table click,
 * which is what distinguishes it from a corridor-page or sticky-bar click in
 * the provider report.
 */
function goHref(slug: string, from: string, to: string, amount: number): string {
  return getGoUrl(slug, {
    sourceCurrency: from,
    targetCurrency: to,
    sourceAmount: amount,
    clickref: "guide_table",
  });
}

function providerLink(slug: string): string {
  const name = providerName(slug);
  return companyPageRenders(slug) ? `<a href="/companies/${slug}">${name}</a>` : name;
}

/**
 * Providers quoting a corridor, ordered strictly by what the recipient gets.
 *
 * NOT rankQuotes() order. That applies a 0.1% materiality band and breaks ties
 * by rating, which is right for the product tables but prints a visibly
 * smaller payout above a larger one — unreadable in an article table whose
 * entire claim is "who gives your recipient the most money", and whose next
 * sentence quotes the gap between the top and bottom row.
 */
function byPayout(from: string, to: string, amount: number): TransferQuote[] {
  return [...quotesFor(from, to, amount)].sort((a, b) => b.receiveAmount - a.receiveAmount);
}

function fmtRate(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

/** The day of the freshest quote, e.g. "6 September 2026". */
function longDate(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * IBAN format reference: every country we hold a structure for, with its length
 * and a validated example.
 *
 * Built because /guides/iban-numbers-explained earns 809 Bing impressions and
 * ZERO clicks at position 7.2 (May 2026 export). Its queries are lookups —
 * "iban lu", "iban ie", "german iban example", "iban format by country" — and
 * the page answered none of them: it explained what an IBAN is while the reader
 * wanted Luxembourg's length. The /iban/[country] pages that DO answer those
 * convert well (Italy: 723 impressions, 22 clicks, position 4.3), so the table
 * both satisfies the query in place and routes to them.
 *
 * Country names are linked only where ibanPageRenders() confirms a page — 24 of
 * the 89 structures have no /iban page, and interpolating their slugs into
 * hrefs is the exact mistake that produced 5,526 links into 404s in the
 * 2026-09-02 audit.
 */
export function renderIbanFormatTable(): string {
  const rows = (ibanStructures as {
    country: string; code: string; length: number; ibanExample: string; sepa: boolean;
  }[])
    .slice()
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((c) => {
      const slug = c.country.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const name = ibanPageRenders(slug)
        ? `<a href="/iban/${slug}">${c.country}</a>`
        : c.country;
      return `<tr><td>${name}</td><td><code>${c.code}</code></td><td>${c.length}</td><td><code>${c.ibanExample}</code></td><td>${c.sepa ? "Yes" : "No"}</td></tr>`;
    })
    .join("");
  return `<div class="overflow-x-auto"><table><thead><tr><th>Country</th><th>Code</th><th>Length</th><th>Example IBAN</th><th>SEPA</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function renderQuoteDate(): string {
  return longDate(quoteDataDate ?? new Date().toISOString().slice(0, 10));
}

/**
 * The day the Trustpilot scores on the site were collected.
 *
 * Guide copy said scores were "verified as of March 2026" while
 * {{TRUSTPILOT:…}} rendered whatever the latest scrape held — the number was
 * current and the sentence next to it was six months old.
 */
export function renderRatingsDate(): string {
  const dates = (trustpilotData as { dateCollected?: string }[])
    .map((r) => r.dateCollected)
    .filter((d): d is string => typeof d === "string")
    .sort();
  const latest = dates[dates.length - 1];
  return latest ? longDate(latest) : renderQuoteDate();
}

function renderQuoteTokens(html: string): string {
  let out = html;

  out = out.replace(
    /\{\{(RECEIVE|FEE|MARKUP|COST|COST_PCT):([a-z0-9-]+):([A-Z]{3}):([A-Z]{3}):(\d+)\}\}/g,
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
          return fmtMoney(from, totalCost(q, from, to, amount));
        case "COST_PCT":
          return `${((totalCost(q, from, to, amount) / amount) * 100).toFixed(2)}%`;
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
        case "RECEIVE_DIFF": {
          // A gap is read as a headline ("₹345 more"), so drop the paise once it
          // is in the hundreds; the per-provider figures keep their precision.
          const diff = Math.abs(qa.receiveAmount - qb.receiveAmount);
          return fmtMoney(to, diff, diff >= 100 ? 0 : 2);
        }
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

  out = out.replace(
    /\{\{QUOTE_TABLE:([A-Z]{3}):([A-Z]{3}):(\d+)(?::(\d+))?\}\}/g,
    (match, from: string, to: string, amt: string, limit: string | undefined) => {
      const rows = byPayout(from, to, Number(amt));
      if (rows.length < 3) return match;
      const shown = limit ? rows.slice(0, Number(limit)) : rows;
      const medal = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
      const body = shown
        .map((q, i) => {
          const name = providerLink(q.providerSlug);
          const label = i < 3 ? `${medal[i]} <strong>${name}</strong>` : name;
          const got = fmtMoney(to, q.receiveAmount);
          // Every row is actionable. The table used to render the provider name
          // as a link to our own /companies review and nothing else, so a reader
          // comparing twenty providers in a guide had no way to act on any of
          // them — the same defect the corridor table had. The name still links
          // to the review (research intent, and those pages need the internal
          // link); the action sits at the row end.
          const send = `<a href="${goHref(q.providerSlug, from, to, Number(amt))}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="smc-send">Send</a>`;
          return `<tr><td>${label}</td><td>${fmtMoney(from, q.fee)}</td><td>${fmtRate(
            q.exchangeRate,
          )}</td><td>${i === 0 ? `<strong>${got}</strong>` : got}</td><td>${send}</td></tr>`;
        })
        .join("\n");
      // Self-contained: emits its own <table>. It previously returned bare <tr>
      // rows and relied on each caller supplying the wrapper, which three
      // callers did not — the rows rendered as loose text with no table at all.
      return `<div class="overflow-x-auto"><table><thead><tr><th>Provider</th><th>Fee</th><th>Rate</th><th>They receive</th><th><span class="sr-only">Send</span></th></tr></thead><tbody>${body}</tbody></table></div>`;
    },
  );

  // ── {{MARKUP_BY_CORRIDOR}} ───────────────────────────────────────────────
  // A markup figure only means something next to the route it was measured on.
  // /guides/exchange-rate-markup-explained taught the concept well and then
  // showed a single per-provider table, so it answered "who is cheap" and never
  // "cheap where" — while the whole argument of the page is that the markup is
  // route-specific. The 2026-09-20 AI-citation trial put that topic at 0% share
  // with Wise's own per-corridor pricing pages taking it three times over.
  //
  // Every cell is computed, so the table cannot drift from the quotes. Two
  // guards keep it honest rather than merely full:
  //   * a route needs 3+ providers quoting it, or the median is noise;
  //   * a route whose median markup is negative is dropped, not printed. That
  //     means our mid-market benchmark for the pair is unreliable, not that the
  //     market pays you to send money — USD→NGN reads -3.16% for exactly this
  //     reason and would otherwise head the table as the "cheapest" corridor.
  //
  // The cheapest provider's OWN markup is deliberately not a column: it read
  // "below mid-market" on 8 of 10 routes, which is true (a provider can beat
  // our rate snapshot at a given minute) but says nothing and reads as broken.
  // Provider count, median and worst are the informative three — they give the
  // denominator, the typical cost and the penalty for choosing badly.
  const MARKUP_CORRIDORS: [string, string][] = [
    ["USD", "INR"],
    ["USD", "PHP"],
    ["USD", "MXN"],
    ["USD", "PKR"],
    ["GBP", "INR"],
    ["GBP", "PKR"],
    ["EUR", "INR"],
    ["AED", "INR"],
    ["CAD", "INR"],
    ["AUD", "INR"],
  ];
  out = out.replace(/\{\{MARKUP_BY_CORRIDOR(?::(\d+))?\}\}/g, (match, amt: string | undefined) => {
    const amount = Number(amt ?? 1000);
    const rows: string[] = [];
    for (const [from, to] of MARKUP_CORRIDORS) {
      const quotes = byPayout(from, to, amount);
      if (quotes.length < 3) continue;
      const markups = quotes.map((q) => markupPctOf(q, from, to)).sort((a, b) => a - b);
      const mid = markups.length % 2
        ? markups[(markups.length - 1) / 2]
        : (markups[markups.length / 2 - 1] + markups[markups.length / 2]) / 2;
      if (mid <= 0) continue;
      const best = quotes[0];
      const worst = quotes[quotes.length - 1];
      rows.push(
        `<tr><td><strong>${from} &rarr; ${to}</strong></td>` +
          `<td>${quotes.length}</td>` +
          `<td>${fmtMarkup(mid)}</td>` +
          `<td>${fmtMarkup(markupPctOf(worst, from, to))}</td>` +
          `<td>${providerLink(best.providerSlug)}</td>` +
          `<td>${fmtMoney(from, best.fee)}</td></tr>`,
      );
    }
    // Fewer than three usable routes is a data outage, not a story. Leaving the
    // token unresolved fails check:assets, which is the correct loud failure.
    if (rows.length < 3) return match;
    return (
      `<div class="overflow-x-auto"><table><thead><tr>` +
      `<th>Corridor</th><th>Providers compared</th><th>Median markup</th>` +
      `<th>Worst markup</th><th>Cheapest today</th><th>Its fee</th>` +
      `</tr></thead><tbody>${rows.join("\n")}</tbody></table></div>` +
      `<p class="blog-footnote">Measured on ${amount.toLocaleString("en-US")} of the send currency ` +
      `from our own quote data, ${renderQuoteDate()}. Markup is the provider's rate against the ` +
      `mid-market reference rate; the median is taken across every provider quoting that route, ` +
      `so it moves with the field and not with one provider's promotion.</p>`
    );
  });

  out = out.replace(
    /\{\{(BEST_PROVIDER|BEST_RECEIVE|WORST_PROVIDER|WORST_RECEIVE|SPREAD|PROVIDER_TALLY):([A-Z]{3}):([A-Z]{3}):(\d+)\}\}/g,
    (match, kind: string, from: string, to: string, amt: string) => {
      const rows = byPayout(from, to, Number(amt));
      if (rows.length < 3) return match;
      const best = rows[0];
      const worst = rows[rows.length - 1];
      switch (kind) {
        case "BEST_PROVIDER":
          return providerName(best.providerSlug);
        case "BEST_RECEIVE":
          return fmtMoney(to, best.receiveAmount);
        case "WORST_PROVIDER":
          return providerName(worst.providerSlug);
        case "WORST_RECEIVE":
          return fmtMoney(to, worst.receiveAmount);
        case "SPREAD": {
          // A gap is a headline number: whole units once it is in the hundreds,
          // cents below that (a €71.60 spread must not read as €72).
          const gap = best.receiveAmount - worst.receiveAmount;
          return fmtMoney(to, gap, gap >= 100 ? 0 : 2);
        }
        case "PROVIDER_TALLY":
          return String(rows.length);
      }
      return match;
    },
  );

  out = out.replace(/\{\{MID_RATE:([A-Z]{3}):([A-Z]{3})\}\}/g, (match, from: string, to: string) => {
    const rate = getMidMarketRate(from, to);
    return rate > 0 ? fmtRate(rate) : match;
  });

  out = out.replace(
    /\{\{MID_RECEIVE:([A-Z]{3}):([A-Z]{3}):(\d+)\}\}/g,
    (match, from: string, to: string, amt: string) => {
      const rate = getMidMarketRate(from, to);
      return rate > 0 ? fmtMoney(to, rate * Number(amt)) : match;
    },
  );

  out = out.replace(/\{\{AVG_MARKUP:([a-z0-9-]+)\}\}/g, (match, slug: string) => {
    const m = MEASURED_MARKUPS.get(slug);
    if (!m || m.corridors < 3) return match;
    // Median, not mean — see MeasuredMarkup.markupMedianPct. A provider whose
    // benchmark is unreliable on a few exotic corridors (USD→NGN reads −3.16%)
    // gets misdescribed by the mean, and this token renders straight into
    // reader-facing prose on the highest-traffic guides.
    const scope = `median across the ${m.corridors.toLocaleString()} corridor${m.corridors === 1 ? "" : "s"} we quote it on`;
    return m.markupMedianPct < 0.05
      ? `effectively nil ${scope}`
      : `${m.markupMedianPct.toFixed(2)}% ${scope}`;
  });

  out = out.split("{{QUOTE_DATE}}").join(renderQuoteDate());
  out = out.split("{{RATINGS_DATE}}").join(renderRatingsDate());
  return out;
}

/** Add review links to exact provider-name cells, never implied recommendations.
 * Authored tables can contain historical research or methodology. Outbound
 * actions belong only to explicitly authored or generated shopping tables.
 */
const LINKABLE = new Map<string, string>(
  REMITTANCE_INDEX.providers
    .filter((p) => p.kind === "specialist")
    .map((p) => [p.name.toLowerCase(), p.slug] as const),
);

function linkifyTableProviders(html: string): string {
  if (!html.includes("<td")) return html;
  // Match the whole cell, including any markup inside it — these names are
  // usually wrapped in <strong> and sometimes already linked to a review, and
  // an exact text match against the raw innerHTML misses both.
  return html.replace(/<td([^>]*)>([\s\S]{0,120}?)<\/td>/g, (match, attrs: string, inner: string) => {
    if (/smc-send/.test(inner)) return match;               // already actioned
    if (/href="\/(?:go|out)\//.test(inner)) return match;   // already affiliate-linked
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const slug = LINKABLE.get(text.toLowerCase());
    if (!slug || !companyPageRenders(slug)) return match;
    if (/<a\b/i.test(inner)) return match;
    return `<td${attrs}><a href="/companies/${slug}">${inner}</a></td>`;
  });
}

export function renderDataTokens(html: string): string {
  let out = html;

  // Each table gets its OWN guard. The guards exist so an expensive renderer
  // only runs for copy that actually uses it, which means nesting one token
  // inside another's guard leaves it unresolved in any guide that does not
  // happen to use both — a literal "{{FOUR_WAY_COST_TABLE}}" in published
  // prose. check:assets catches exactly this, and did.
  if (out.includes("{{APP_RATINGS_TABLE}}")) {
    out = out.split("{{APP_RATINGS_TABLE}}").join(renderAppRatingsTable());
  }

  if (out.includes("{{FOUR_WAY_COST_TABLE}}")) {
    out = out.split("{{FOUR_WAY_COST_TABLE}}").join(renderFourWayCostTable());
  }

  // {{BANK_WIN_LIST:hsbc}} -> "AUD\u2192NZD $100, GBP\u2192ZAR $100, GBP\u2192ZAR $1,000"
  // Named corridors, not just a count — same differentiator as LEAD_PAIRS,
  // applied to the bank-comparison data.
  out = out.replace(/\{\{BANK_WIN_LIST:([a-z0-9-]+)\}\}/g, (match, slug: string) => {
    const wins = getBankCorridorQuotes(slug).filter((q) => q.lossPct < 0);
    if (!wins.length) return match;
    return wins
      .map((w) => `${w.sendCurrency}\u2192${w.receiveCurrency} $${w.sendAmount.toLocaleString()}`)
      .join(", ");
  });

  // {{BANK_MEDIAN:chase}} -> "5.85%", {{BANK_CORRIDORS:chase}} -> "5",
  // {{BANK_WORST:chase}} -> "USD\u2192PKR" (the corridor with the largest measured
  // loss vs the best digital alternative), {{BANK_WINS:hsbc}} -> "0".
  //
  // Backs the /banks/* editorial in bank-comparisons-derived medians, per the
  // same mean-trap rule as everywhere else on the site.
  out = out.replace(/\{\{(BANK_MEDIAN|BANK_CORRIDORS|BANK_WORST|BANK_WINS):([a-z0-9-]+)\}\}/g, (match, kind: string, slug: string) => {
    const stats = getBankAggregateStats(slug);
    if (!stats.corridorCount) return match;
    switch (kind) {
      case "BANK_MEDIAN":
        return `${stats.medianLossPct.toFixed(2)}%`;
      case "BANK_CORRIDORS":
        return String(stats.corridorCount);
      case "BANK_WINS":
        return String(stats.winCount);
      case "BANK_WORST": {
        const w = stats.largestLossExample;
        return w ? `${w.sendCurrency}\u2192${w.receiveCurrency}` : match;
      }
    }
    return match;
  });

  // {{RATE_STORY:USD:INR}} -> one of four genuinely different sentence
  // architectures, chosen by what the corridor's own 91+-day history actually
  // shows — not the same template with blanks filled in. The axis that picks
  // the shape is real: whether the corridor is volatile or stable (the gap
  // between the best and worst payout day's distance from the period average,
  // split at the site-wide median of 4.5pp) crossed with whether today sits in
  // a favourable or unfavourable tier of that range. A volatile corridor with
  // good timing today gets a "this moves, and today is one of the better days"
  // structure; a stable corridor with poor timing gets "this barely moves, so
  // waiting buys you little" — different claims, different sentence shapes,
  // because the underlying facts genuinely differ.
  //
  // WHY THIS ISN'T A "RATE SPREAD" CLAIM (kept from the first version)
  // rate-insights.json's bestRate/worstRate are the RATE ON THE DAY THAT HAD
  // THE BEST/WORST RECEIVE AMOUNT (build-rate-insights.ts picks the day by
  // receiveAmount, which bundles rate and fee, then reports that day's rate) —
  // so the worst-payout day's rate is not guaranteed to be numerically lower
  // than the best-payout day's rate. Confirmed on USD-PKR: worstRate (279.65)
  // > bestRate (278.45), because MoneyGram's "worst" day had a fee that
  // outweighed a nominally decent rate. Every branch below compares each
  // day's rate to the PERIOD AVERAGE instead, which is a valid same-basis
  // comparison regardless of which direction the fee effect runs, and states
  // "best/worst-value day" rather than implying a clean rate extreme.
  out = out.replace(/\{\{RATE_STORY:([A-Z]{3}):([A-Z]{3})\}\}/g, (match, from: string, to: string) => {
    const insight = getRateInsight(from, to);
    if (!insight || insight.totalDays < 30) return match;
    const { stats, totalDays, dateRange, level } = insight;
    const bestVsAvg = ((stats.bestRate - stats.avgRate) / stats.avgRate) * 100;
    const worstVsAvg = ((stats.worstRate - stats.avgRate) / stats.avgRate) * 100;
    const gap = Math.abs(bestVsAvg - worstVsAvg);
    // Sanity ceiling, not just a floor. The organic distribution across 1,026
    // corridors has p75 at 7.1pp and a max of ~10pp outside a handful of
    // clustered outliers: 8 corridors (all AED/SAR-origin into INR/BDT/PHP/PKR)
    // sit at 150-161pp, and a second cluster (all BOB-destination) sits at
    // 55-68pp — both patterns are too systematic (same currency on one side,
    // every time) to be real volatility rather than a scraper/unit artifact on
    // that specific currency. Below 30pp comfortably covers every corridor that
    // looks organic; above it, decline to publish a number rather than assert
    // a swing the data can't actually support.
    if (gap > 30) return match;
    const volatile = gap >= 4.5;
    const favourable = level === "great" || level === "good";
    const bestProv = providerName(stats.bestRateProvider);
    const worstProv = providerName(stats.worstRateProvider);
    const bestDate = longDate(stats.bestRateDate);
    const worstDate = longDate(stats.worstRateDate);
    const since = longDate(dateRange.from);
    const gapStr = gap.toFixed(1);

    if (volatile && favourable) {
      return (
        `This corridor moves more than most we track — across the ${totalDays} days since ${since}, ` +
        `the best and worst payout days sat ${gapStr} percentage points apart relative to the period ` +
        `average. Today happens to fall in the "${level}" tier of that range, which is the better half ` +
        `of it. ${bestProv} had the standout day, ${bestDate}; the low point came from ${worstProv} ` +
        `on ${worstDate}. On a corridor that swings this much, checking before you send is worth more ` +
        `than it would be on a calmer one.`
      );
    }
    if (volatile && !favourable) {
      return (
        `Across the ${totalDays} days we've watched this pair since ${since}, the gap between the best ` +
        `and worst payout day has run to ${gapStr} percentage points against the average — a genuinely ` +
        `volatile corridor. Today isn't on the good side of that range; it sits in the "${level}" tier. ` +
        `${bestProv} delivered the best day on record (${bestDate}), ${worstProv} the worst (${worstDate}), ` +
        `which is the kind of spread that makes waiting a day or two, if you can, worth considering here.`
      );
    }
    if (!volatile && favourable) {
      return (
        `${bestProv}'s best day for this pair, ${bestDate}, and ${worstProv}'s worst, ${worstDate}, sat only ` +
        `${gapStr} percentage points apart over the ${totalDays} days since ${since} — this corridor doesn't ` +
        `move much. That also means today's "${level}" reading is close to what you'd get most days here, ` +
        `so there's little upside to timing a transfer on this route beyond picking the right provider.`
      );
    }
    return (
      `This is a stable corridor: over ${totalDays} days since ${since}, the best payout day (${bestProv}, ` +
      `${bestDate}) and the worst (${worstProv}, ${worstDate}) differed by only ${gapStr} percentage points ` +
      `against the average. Today reads "${level}", but on a corridor this flat that's unlikely to change ` +
      `much if you wait — the bigger lever here is which provider you pick, not when you send.`
    );
  });



  // {{LEAD_PAIRS:wise}} -> "AED→INR, AED→KES, GBP→AUD, USD→PKR and 40 more"
  //
  // Distinct from the existing {{LEADS:slug}}, which renders the COUNT
  // ("44 of the 212 corridors we can compare"). This one names them.
  //
  // The competitive gap this closes: Monito's Wise review says it is "less
  // competitive on many remittance corridors — particularly parts of Latin
  // America, Africa and Southeast Asia" and never names one. Naming the
  // corridors a provider actually led, from corridor-leaders.json, is a claim
  // no comparison site currently makes, and it links the evidence to the
  // corridor pages that carry it.
  out = out.replace(/\{\{LEAD_PAIRS:([a-z0-9-]+)\}\}/g, (match, slug: string) => {
    const pairs = Object.entries(CORRIDOR_LEADERS)
      .filter(([, v]) => (v as { slug: string }).slug === slug)
      .map(([pair]) => pair.replace("-", "\u2192"))
      .sort();
    if (!pairs.length) return match;
    const shown = pairs.slice(0, 4).join(", ");
    return pairs.length > 4 ? `${shown} and ${pairs.length - 4} more` : shown;
  });

  // {{AVGCOST:wise}} -> "1.75%", {{COSTCORRIDORS:wise}} -> "340",
  // {{SMALLCOST:wise}} -> "7.77%", {{BIGCOST:wise}} -> "1.75%",
  // {{SMALLPENALTY:wise}} -> "6.02pp".
  //
  // The amount-tier figures are the ones no competitor publishes: every review
  // site recommends Wise flatly, and none of them tells a reader sending $100
  // that it costs 7.77% there against 1.75% at $1,000. A provider below the
  // tier index's 20-quote-per-tier minimum resolves nothing, so a small-transfer
  // claim cannot be made about a provider we have not measured at both tiers.
  out = out.replace(
    /\{\{(AVGCOST|COSTCORRIDORS|SMALLCOST|BIGCOST|SMALLPENALTY):([a-z0-9-]+)\}\}/g,
    (match, kind: string, slug: string) => {
      if (kind === "AVGCOST" || kind === "COSTCORRIDORS") {
        const row = REMITTANCE_INDEX.providers.find((p) => p.slug === slug);
        if (!row) return match;
        return kind === "AVGCOST" ? `${row.avgCostPct.toFixed(2)}%` : String(row.corridors);
      }
      const tier = AMOUNT_TIER_INDEX.rows.find((r) => r.slug === slug);
      if (!tier) return match;
      switch (kind) {
        case "SMALLCOST":
          return `${tier.costSmallPct.toFixed(2)}%`;
        case "BIGCOST":
          return `${tier.costHeadlinePct.toFixed(2)}%`;
        case "SMALLPENALTY":
          return `${tier.deltaPp.toFixed(2)}pp`;
      }
      return match;
    },
  );

  // {{LED:wise}} -> "48 of 128", {{WINRATE:wise}} -> "32.4%",
  // {{SHORTFALL:wise}} -> "2.75%".
  //
  // The comparison editorial quotes each provider's measured record, and a win
  // rate without its denominator is the whole trap: OFX's 12.8% is measured on
  // five corridors and Wise's 32.4% on 128, so the smaller number is the better
  // one. LED renders the denominator with the figure so the two cannot be
  // separated in prose, and all three read from the consistency index rather
  // than being typed into copy that would go stale silently.
  out = out.replace(/\{\{(LED|WINRATE|SHORTFALL):([a-z0-9-]+)\}\}/g, (match, kind: string, slug: string) => {
    const row = CONSISTENCY_ROWS.find((r) => r.providerSlug === slug);
    if (!row) return match;
    switch (kind) {
      case "LED":
        return `${row.corridorsLed} of ${row.corridorsQuoted}`;
      case "WINRATE":
        return `${row.winRate.toFixed(1)}%`;
      case "SHORTFALL":
        return `${row.avgShortfallPct.toFixed(2)}%`;
    }
    return match;
  });

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
  // Mirrors the scrape cron. Copy stating a refresh interval should read this
  // rather than hand-typing "every 6 hours" and drifting from the workflow.
  out = out.split("{{REFRESH_HOURS}}").join(String(SITE_STATS.refreshHours));
  // {{CONSISTENCY_PROVIDERS}} -> "66". The size of the consistency index, which
  // is smaller than {{PROVIDER_COUNT}}: it counts only providers with enough
  // comparable quote-days to rank. Two guides hand-typed "66" next to TapTap's
  // third place, so the sentence would have survived the index growing.
  out = out.split("{{CONSISTENCY_PROVIDERS}}").join(String(CONSISTENCY_ROWS.length));

  // Business-scoped league table. {{QUOTE_TABLE}} ranks EVERY provider quoting a
  // route, which is right for a remittance page and wrong for a B2B one: on
  // USD->INR at $5,000 it puts Remitly first and on GBP->EUR TapTap Send, both
  // consumer remittance apps that a business is not paying suppliers through.
  // business-fx-index.ts already curates the providers that actually serve
  // business senders and excludes those apps deliberately; this reuses that
  // decision rather than re-deriving it.
  // {{BUSINESS_QUOTE_TABLE:USD:INR:5000}}
  out = out.replace(
    /\{\{BUSINESS_QUOTE_TABLE:([A-Z]{3}):([A-Z]{3}):(\d+)\}\}/g,
    (match, from: string, to: string, amt: string) => {
      const allowed = new Set<string>(BUSINESS_FX_SLUGS);
      const rows = quotesFor(from, to, Number(amt)).filter((q) => allowed.has(q.providerSlug));
      if (rows.length < 2) return match;
      const body = rows
        .map((q, i) => {
          const label = providerLink(q.providerSlug);
          const medal = i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : "";
          const send = `<a href="${goHref(q.providerSlug, from, to, Number(amt))}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="smc-send">Send</a>`;
          return `<tr><td>${medal}<strong>${label}</strong></td><td>${fmtMoney(from, q.fee)}</td><td>${fmtRate(q.exchangeRate)}</td><td>${i === 0 ? "<strong>" : ""}${fmtMoney(to, q.receiveAmount, 0)}${i === 0 ? "</strong>" : ""}</td><td>${send}</td></tr>`;
        })
        .join("");
      return `<div class="overflow-x-auto"><table><thead><tr><th>Provider</th><th>Fee</th><th>Rate</th><th>They receive</th><th><span class="sr-only">Send</span></th></tr></thead><tbody>${body}</tbody></table></div>`;
    },
  );

  // What choosing a provider over the cheapest costs across a year of monthly
  // transfers. Promo guides compare one-off sign-up offers and never price the
  // eleven transfers after it, which is where the money actually goes: a $25
  // welcome credit against a rate gap repeated twelve times is not a comparison
  // anyone has run. Renders the per-transfer gap and the annual total together,
  // because the annual figure alone reads as a scare number.
  // {{TWELVE_TRANSFER_GAP:ria:USD:INR:1000}} -> "₹1,593 per transfer — ₹19,114 over twelve"
  out = out.replace(
    /\{\{TWELVE_TRANSFER_GAP:([a-z0-9-]+):([A-Z]{3}):([A-Z]{3}):(\d+)\}\}/g,
    (match, slug: string, from: string, to: string, amt: string) => {
      const q = quotesFor(from, to, Number(amt));
      if (q.length < 2) return match;
      const row = q.find((x) => x.providerSlug === slug);
      if (!row) return match;
      const gap = q[0].receiveAmount - row.receiveAmount;
      if (gap <= 0) return "nothing — it is the cheapest on this route today";
      return `${fmtMoney(to, gap, 0)} per transfer — ${fmtMoney(to, gap * 12, 0)} over twelve`;
    },
  );
  if (out.includes("{{IBAN_FORMAT_TABLE}}")) {
    out = out.split("{{IBAN_FORMAT_TABLE}}").join(renderIbanFormatTable());
  }

  // Bank-vs-specialist gap. The cheapest-transfer guide asserted specialists
  // were "80-95% cheaper than traditional banks" — a number nothing on the site
  // produced. The Remittance Cost Index, computed from the same quote set,
  // measures roughly $55 against $30 per $1,000 sent, i.e. 46%. These tokens make the
  // guide quote the measurement, and the gap moves with the data.
  // {{BANK_SAVINGS_PCT}} -> "46%"
  // Corridors a provider actually leads. Guides carried unqualified "X is
  // consistently cheapest" lines that the site's own consistency index
  // contradicts — Wise leads 44 of 212 comparable corridors, the most of any
  // provider but a fifth of them. This renders the denominator with the
  // numerator so the sentence cannot be read as "cheapest everywhere".
  // {{LEADS:wise}} -> "44 of the 212 corridors we can compare"
  out = out.replace(/\{\{LEADS:([a-z0-9-]+)\}\}/g, (match, slug: string) => {
    const row = CONSISTENCY_ROWS.find((r) => r.providerSlug === slug);
    if (!row) return match;
    return `${row.corridorsLed} of the ${CONSISTENCY_INDEX.comparableCorridors} corridors we can compare`;
  });

  // {{LEADER_MAP}} -> a table of providers by corridors led, with examples.
  //
  // "Best money transfer app" has no single answer and the site's own data says
  // so: the top provider leads 44 of 216 corridors, a fifth of them. A ranked
  // list of six apps implies one winner; this shows the territory each one
  // actually holds, which is both the honest answer and the more useful one for
  // a reader who only cares about their own route.
  //
  // Complete by construction — every provider leading 5+ corridors appears, in
  // order. It is NOT a curated set, so it cannot be tuned to favour a partner:
  // whoever leads most appears first, and a provider that stops leading drops
  // out on the next build.
  out = out.split("{{LEADER_MAP}}").join((() => {
    const byProvider = new Map<string, { name: string; corridors: string[] }>();
    for (const [pair, v] of Object.entries(corridorLeaders as Record<string, { slug: string; name: string }>)) {
      const entry = byProvider.get(v.slug) ?? { name: v.name, corridors: [] };
      entry.corridors.push(pair);
      byProvider.set(v.slug, entry);
    }
    const rows = [...byProvider.values()]
      .filter((e) => e.corridors.length >= 5)
      .sort((a, b) => b.corridors.length - a.corridors.length)
      .map((e) => {
        const examples = e.corridors.slice(0, 3).map((c) => c.replace("-", " → ")).join(", ");
        return `<tr><td>${e.name}</td><td>${e.corridors.length}</td><td>${examples}</td></tr>`;
      })
      .join("");
    if (!rows) return "";
    return `<div class="overflow-x-auto"><table><thead><tr><th>Provider</th><th>Corridors it leads</th><th>Examples</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  })());

  // {{UNANIMOUS_LEAD:slug}} -> "10 corridors — including EUR → CNY, GBP → CNY
  // and USD → MYR — where it delivered the most on every one of the last 91 days
  // we could compare".
  //
  // A provider that wins EVERY contested day on a corridor is making a far
  // stronger claim than "consistently competitive", and until now nothing said
  // it. TapTap Send does this on 10 corridors; the guides described it with
  // adjectives instead, and one of those adjectives ("consistently at or near
  // the top") was false on the corridor it was written about. This renders the
  // count and names examples, so the highlight is earned rather than asserted.
  //
  // Deliberately requires a FULL sweep (wins === contestedDays). "Nearly always"
  // is a different and weaker claim; if it is wanted, give it its own token
  // rather than loosening this one.
  out = out.replace(/\{\{UNANIMOUS_LEAD:([a-z0-9-]+)\}\}/g, (match, slug: string) => {
    const rows = Object.entries(corridorLeaders as Record<string, { slug: string; wins: number; contestedDays: number }>)
      .filter(([, v]) => v.slug === slug && v.wins === v.contestedDays && v.contestedDays > 0)
      .sort((a, b) => b[1].contestedDays - a[1].contestedDays);
    if (rows.length < 2) return match;
    const days = rows[0][1].contestedDays;
    const examples = rows.slice(0, 3).map(([pair]) => pair.replace("-", " → ")).join(", ");
    return `${rows.length} corridors — including ${examples} — where it delivered the most on every one of the last ${days} days we could compare`;
  });

  // {{CORRIDOR_LEADER:USD:INR}} -> "Ria Money Transfer, which led on 73 of the
  // last 91 days we could compare"
  //
  // Guides asserted a standing winner from memory — "Wise almost always delivers
  // the most rupees" on a corridor Ria led 73 of 91 days. This states the
  // measured record instead, and recomputes it every build, so the claim cannot
  // drift the way a hand-typed one does. It is also the stronger sentence: a
  // dated count from 125k observations beats an adjective.
  //
  // Unresolvable on purpose when we hold no record: check-assets fails the build
  // on a literal "{{", so a corridor that loses coverage stops the deploy rather
  // than shipping a confident claim with nothing behind it.
  out = out.replace(/\{\{CORRIDOR_LEADER:([A-Z]{3}):([A-Z]{3})\}\}/g, (match, from: string, to: string) => {
    const row = (corridorLeaders as Record<string, { name: string; wins: number; contestedDays: number; windowDays: number }>)[`${from}-${to}`];
    if (!row) return match;
    return `${row.name}, which led on ${row.wins} of the last ${row.contestedDays} days we could compare`;
  });

  out = out.split("{{BANK_SAVINGS_PCT}}").join(`${bankSavingsPct()}%`);
  out = out.split("{{BUSINESS_SAVINGS_PCT}}").join(`${businessSavingsPct()}%`);
  out = out
    .split("{{BUSINESS_BANK_COST_PCT}}")
    .join(`${businessFx().bankAvgCostPct.toFixed(2)}%`);
  out = out
    .split("{{BUSINESS_SPECIALIST_COST_PCT}}")
    .join(`${businessFx().specialistAvgCostPct.toFixed(2)}%`);
  out = out.split("{{AVG_BANK_COST}}").join(`$${REMITTANCE_INDEX.avgBankCost.toFixed(2)}`);
  out = out.split("{{AVG_SPECIALIST_COST}}").join(`$${REMITTANCE_INDEX.avgSpecialistCost.toFixed(2)}`);

  if (out.includes("{{")) out = renderQuoteTokens(out);

  // Last, so it sees tables emitted by the tokens above as well as authored ones.
  out = linkifyTableProviders(out);

  return out;
}
