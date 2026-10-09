/**
 * Data behind the /send-money hub — server-only (reads the quote dataset).
 *
 * WHY (round-3 freelance brief §4.4, 2026-10-08)
 * After GSC validation started on Sep 29, Googlebot re-crawled /send-money
 * alone and left it "Crawled – currently not indexed". Its static HTML held the
 * comparison as "Loading…", ~307 words of its own text and 196 unique links,
 * 99 of them to pages noindexed for every engine. The brief asks for:
 *   - a complete provider table for one fixed route in the static HTML, read
 *     from generateQuotes() (the only allowed source for a ranking);
 *   - 600–900 words of original text whose figures come from that data;
 *   - links only to Google-eligible pages (src/lib/link-eligibility.ts).
 *
 * The example route is USD→INR at $1,000: the comparison form opens on it
 * (SendMoneyClient's defaults), so a reader without a saved route sees the
 * same pair in both places; India leads the hub's demand-ordered destination
 * list; the route is one of the deepest we price and /send-money/usa-to-india
 * is Google-eligible. It is labelled as an example everywhere it is shown, and
 * is never chosen from URL parameters — selections stay client-side so the
 * page stays one static, self-canonical document.
 */
import { allCorridors } from "@/data/corridors";
import { getProviderName, getExchangeRate, type TransferQuote } from "@/data/providers";
import { currencies, sendCurrencies } from "@/data/transfer-currencies";
import { generateQuotes } from "@/lib/quotes-engine";
import { tiedAboveLargerPayout, MATERIALITY_BAND_PCT } from "@/lib/rank-quotes";
import { quoteFreshness } from "@/lib/quote-freshness";
import { getDataUpdatedInstant } from "@/lib/data-freshness";
import { isLinkEligible } from "@/lib/link-eligibility";
import { corridorPageRenders } from "@/lib/route-map";
import { renderDataTokens } from "@/lib/ratings-tokens";
import { SITE_STATS } from "@/lib/site-stats";

/**
 * When a person last rewrote or re-checked this page's copy and figures.
 * Bump it when the text changes — never derive it from the build or the data,
 * which would make the page look edited every six hours.
 */
export const HUB_COPY_REVIEWED = "2026-10-08";
export const HUB_AUTHOR_SLUG = "awais-imran";
export const HUB_REVIEWER_SLUG = "ahsan-mukhtar";

export const EXAMPLE = { from: "USD", to: "INR", amount: 1000, fromCountry: "United States", toCountry: "India" } as const;
export const EXAMPLE_ROWS = 5;

function symbolFor(code: string): string {
  return sendCurrencies.find((c) => c.code === code)?.symbol || currencies.find((c) => c.code === code)?.symbol || `${code} `;
}

export const money = (n: number, dp = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

const UTC_LONG = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC",
});
const UTC_SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC",
});
export const utcLong = (iso: string) => `${UTC_LONG.format(new Date(iso))} UTC`;
export const utcShort = (iso: string) => `${UTC_SHORT.format(new Date(iso))} UTC`;
export const longDate = (isoDay: string) =>
  new Date(`${isoDay}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export interface ExampleRow {
  quote: TransferQuote;
  name: string;
  rank: number;
  /** % below (positive) or above (negative) the XE mid-market rate. */
  markupPct: number;
  tiedAhead: boolean;
}

export interface HubData {
  rows: ExampleRow[];
  /** Measured (non-indicative) providers priced on the example route. */
  priced: number;
  mid: number;
  sendSymbol: string;
  recvSymbol: string;
  oldest?: string;
  latest?: string;
  /** Newest scrape in the whole dataset. */
  collectedAt: string;
  refreshHours: number;
  worked: WorkedExample | null;
  /** "TapTap Send, which led on 66 of the last 91 days we could compare", or null. */
  leader: string | null;
  bandPct: number;
}

export interface WorkedExample {
  best: { name: string; receive: number };
  fifth: { name: string; receive: number };
  lowest: { name: string; receive: number };
  /** Highest minus lowest payout across every measured provider, in INR and USD. */
  spread: number;
  spreadSend: number;
  feeVsRate: {
    feeName: string;
    fee: number;
    /** The fee as the recipient feels it: fee × that provider's rate. */
    feeCost: number;
    freeName: string;
    /** feeName's rate minus freeName's rate, times the amount (positive = feeName converts better). */
    rateEffect: number;
    /** Net payout difference, feeName minus freeName. */
    net: number;
  } | null;
}

function buildWorked(rows: ExampleRow[], measured: TransferQuote[], mid: number): WorkedExample | null {
  if (rows.length < EXAMPLE_ROWS || measured.length < EXAMPLE_ROWS) return null;
  const byPayout = [...measured].sort((a, b) => b.receiveAmount - a.receiveAmount);
  const top = byPayout[0];
  const bottom = byPayout[byPayout.length - 1];
  const fifth = rows[EXAMPLE_ROWS - 1].quote;
  const spread = top.receiveAmount - bottom.receiveAmount;

  // A row that charges a fee against one that charges none, both in the table:
  // the arithmetic every "zero fee" headline hides, on real quotes.
  const shown = rows.map((r) => r.quote);
  const feeRow = [...shown].filter((q) => q.fee > 0).sort((a, b) => b.fee - a.fee)[0];
  const freeRow = [...shown].filter((q) => q.fee === 0).sort((a, b) => a.exchangeRate - b.exchangeRate)[0];
  const feeVsRate = feeRow && freeRow
    ? {
        feeName: getProviderName(feeRow.providerSlug),
        fee: feeRow.fee,
        feeCost: feeRow.fee * feeRow.exchangeRate,
        freeName: getProviderName(freeRow.providerSlug),
        rateEffect: (feeRow.exchangeRate - freeRow.exchangeRate) * EXAMPLE.amount,
        net: feeRow.receiveAmount - freeRow.receiveAmount,
      }
    : null;

  return {
    best: { name: getProviderName(top.providerSlug), receive: top.receiveAmount },
    fifth: { name: getProviderName(fifth.providerSlug), receive: fifth.receiveAmount },
    lowest: { name: getProviderName(bottom.providerSlug), receive: bottom.receiveAmount },
    spread,
    spreadSend: mid > 0 ? spread / mid : 0,
    feeVsRate,
  };
}

let cached: HubData | null = null;

export function getHubData(): HubData {
  if (cached) return cached;
  const all = generateQuotes(EXAMPLE.amount, EXAMPLE.from, EXAMPLE.to);
  const measured = all.filter((q) => !q.isIndicative);
  const top = measured.slice(0, EXAMPLE_ROWS);
  const mid = getExchangeRate(EXAMPLE.from, EXAMPLE.to);
  const tied = tiedAboveLargerPayout(top);
  const rows: ExampleRow[] = top.map((quote, i) => ({
    quote,
    name: getProviderName(quote.providerSlug),
    rank: i + 1,
    markupPct: mid > 0 ? ((mid - quote.exchangeRate) / mid) * 100 : 0,
    tiedAhead: tied.has(quote.providerSlug),
  }));
  const freshness = quoteFreshness(top);
  const leaderText = renderDataTokens(`{{CORRIDOR_LEADER:${EXAMPLE.from}:${EXAMPLE.to}}}`);

  cached = {
    rows,
    priced: measured.length,
    mid,
    sendSymbol: symbolFor(EXAMPLE.from),
    recvSymbol: symbolFor(EXAMPLE.to),
    oldest: freshness.oldest,
    latest: freshness.latest,
    collectedAt: getDataUpdatedInstant(),
    refreshHours: SITE_STATS.refreshHours,
    worked: buildWorked(rows, measured, mid),
    // Unresolved when the history holds no record for the route: drop the
    // sentence rather than print a literal token (check:assets fails on "{{").
    leader: leaderText.includes("{{") ? null : leaderText,
    bandPct: MATERIALITY_BAND_PCT,
  };
  return cached;
}

// ── Route directory ──────────────────────────────────────────────────────────

export interface RouteLink {
  href: string;
  label: string;
}
export interface DestinationGroup {
  country: string;
  /** The destination's own page (/send-money/send-money-to-<country>), if Google-eligible. */
  countryPage: RouteLink | null;
  /** Origin → destination pages, Google-eligible only. */
  routes: RouteLink[];
}

/** Destinations in the order the hub has always led with — measured demand. */
const LEAD_DESTINATIONS = ["India", "Pakistan", "Philippines"];

/**
 * Every Google-eligible /send-money/* page, grouped by destination country.
 *
 * Until 2026-10-08 this hub linked ~436 corridors (and printed the top ten
 * twice); 99 of the 128 corridor/guide links went to pages noindexed for all
 * engines. Owner decision with the round-3 brief: the static HTML links only
 * what sitemap-google.xml submits. This list is derived from that manifest, so
 * a page released to Google joins it on the next build and a page withdrawn
 * leaves it. Every other route stays reachable through the comparison form.
 *
 * All eligible corridor pages are listed (43 on 2026-10-08, not a hand-picked
 * subset): a submitted URL needs an internal path, and with in-content links
 * now limited to eligible pages site-wide, the hub is that path for most of
 * them. If the manifest grows far past ~50 corridor pages, cap this list by
 * demand rather than let the hub grow back into a directory.
 */
export function getRouteDirectory(): DestinationGroup[] {
  const groups = new Map<string, DestinationGroup>();
  for (const c of allCorridors) {
    const href = `/send-money/${c.slug}`;
    if (!corridorPageRenders(c.slug) || !isLinkEligible(href)) continue;
    const country = c.toCountry || c.toCurrency;
    const group = groups.get(country) ?? { country, countryPage: null, routes: [] };
    if (c.isCountryPage) group.countryPage = { href, label: `Send money to ${country}` };
    else group.routes.push({ href, label: `${c.fromCountry || c.fromCurrency} to ${country}` });
    groups.set(country, group);
  }
  const collator = new Intl.Collator("en");
  for (const g of groups.values()) g.routes.sort((a, b) => collator.compare(a.label, b.label));
  const size = (g: DestinationGroup) => g.routes.length + (g.countryPage ? 1 : 0);
  const lead = (g: DestinationGroup) => {
    const i = LEAD_DESTINATIONS.indexOf(g.country);
    return i === -1 ? LEAD_DESTINATIONS.length : i;
  };
  return [...groups.values()].sort(
    (a, b) => lead(a) - lead(b) || size(b) - size(a) || collator.compare(a.country, b.country),
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────

export interface HubFaq {
  question: string;
  answer: string;
}

/**
 * Plain-text answers, so the visible block and the FAQPage JSON-LD are the
 * same words. Figures come from getHubData(), never typed.
 */
export function getHubFaqs(data: HubData): HubFaq[] {
  const faqs: HubFaq[] = [
    {
      question: "Which provider should I use to send money to my country?",
      answer:
        "That depends on the route and the amount, and no single provider leads on every pair. Choose the currency you pay in and the one your recipient receives in the form at the top of this page, enter your real amount, and compare what arrives." +
        (data.leader ? ` On the example route, USD to INR, the most frequent leader in our history is ${data.leader}.` : ""),
    },
    {
      question: "Why does the same provider rank differently from one country to another?",
      answer:
        "Providers set their exchange-rate margin and fees route by route, depending on their payout partners in the destination country, their cost of buying each currency and how hard they compete there. A provider's price on one route tells you little about its price on the next, which is why this page compares routes rather than brands.",
    },
  ];
  return faqs;
}
