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

/**
 * Makes provider names inside hand-authored comparison tables clickable.
 *
 * WHY THIS EXISTS
 * 94 guides carry comparison tables typed in by hand, holding 647 rows between
 * them, and not one row contained a /go link — on pages taking 13,474 search
 * impressions. Migrating all of them to {{QUOTE_TABLE}} would be the ideal fix
 * but is not safe in bulk: only some are corridor price tables, and the rest
 * (World Bank fee data, mid-market explainers, delivery-method matrices) would
 * lose their content if swapped for a live quote table.
 *
 * So this adds the action without touching the content. It rewrites only a <td>
 * whose text is exactly a provider name, and leaves the table otherwise intact.
 *
 * DELIBERATE LIMITS
 * - Specialists only. Banks are in providers.ts and have /go URLs, but a guide
 *   arguing that bank wires are expensive should not sprout a "Send with Chase"
 *   button; that undercuts its own argument and reads as arbitrage.
 * - Exact cell match only. Substring matching would link the word "Wise" inside
 *   prose cells and inside other provider names.
 * - Cells that already contain a link are skipped, so tables that already point
 *   at a review or a /go keep whatever they have.
 * - Table cells only. Prose mentions are left alone: a guide may discuss a
 *   provider without recommending it.
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
    const send = `<a href="${getGoUrl(slug, {
      clickref: "guide_static_table",
    })}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="smc-send smc-send-sm">Send</a>`;
    // Keep whatever the cell already had — including a review link — and append.
    return `<td${attrs}>${inner}${send}</td>`;
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
