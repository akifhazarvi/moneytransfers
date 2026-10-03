/**
 * Typed reader for src/data/research/reader-savings.json — the dataset behind
 * /guides/how-much-can-you-save-comparing-money-transfers.
 *
 * The JSON is produced by scripts/build-reader-savings.ts from a frozen GA4
 * pull (reader-clicks.json) priced against the quote archive. Every figure the
 * article states is read from here, never typed into the copy — same contract
 * as weekend-markup.ts.
 *
 * Server-only: it imports the corridor list (via route-map) to decide which
 * corridor pages may be linked. A client component must receive the projected
 * fields it renders as props.
 */
import raw from "@/data/research/reader-savings.json";
import { allCorridors } from "@/data/corridors";
import { corridorPageRenders } from "@/lib/route-map";
import { providerLabel } from "@/lib/weekend-markup";

export { providerLabel };

export interface Summary {
  pricedDecisions: number;
  medianGainVsMedianPct: number;
  medianGainVsMedianPer1000: number;
  totalVsMedianPer1000: number;
  shareAboveMedian: number;
  shareTopPayer: number;
  shareTop3: number;
  medianOpportunityPct: number;
  medianOpportunityPer1000: number;
  bankDecisions: number;
  medianVsBankPer1000: number | null;
  totalVsBankPer1000: number | null;
}

export interface CorridorWindow {
  days: number;
  referenceAmount: number;
  medianProviders: number;
  medianBestVsMedianPct: number;
  medianBestVsWorstPct: number;
  medianBestVsBankPct: number | null;
  bankDays: number;
  mostFrequentLeader: { slug: string; days: number }[];
  latest: {
    date: string;
    amount: number;
    best: { slug: string; receive: number };
    median: number;
    worst: { slug: string; receive: number };
    providers: number;
  } | null;
}

export interface CorridorRow {
  corridor: string;
  decisions: number;
  chosen: { slug: string; users: number }[];
  priced: Summary | null;
  window: CorridorWindow | null;
}

export interface ProviderRow {
  slug: string;
  decisions: number;
  corridors: number;
  priced: Summary | null;
}

type Reason = "placeholder" | "promo-rate" | "not-quoted" | "thin";

export interface ReaderSavings {
  generatedAt: string;
  method: {
    referenceUsd: number;
    referenceRangeUsd: [number, number];
    minProviders: number;
    tieBandPct: number;
    minCorridorDecisions: number;
    snapshotsUsed: number;
  };
  clicksMeta: { pulledAt: string; window: { from: string; to: string }; excludedCountries: string[]; gscWindow: [string, string] };
  totals: Summary & {
    decisions: number;
    decisionsWithoutCorridor: number;
    corridors: number;
    providersChosen: number;
    excluded: Record<Reason, number>;
  };
  totalsExParallel: Summary;
  corridors: CorridorRow[];
  providers: ProviderRow[];
  monthlyUsers: [string, number][];
  channelUsers: Record<string, number>;
  countryUsers: [string, number][];
  countryCount: number;
  searchQueries: [string, number, number][];
}

// JSON imports widen tuples to arrays ([string, number] → (string | number)[]),
// so the declared shape is asserted through unknown; the build script writes it.
export const readerSavings = raw as unknown as ReaderSavings;

/** "USD-INR" → { from: "USD", to: "INR" } */
export const splitCorridor = (c: string) => ({ from: c.slice(0, 3), to: c.slice(4) });

/**
 * The corridor's own page, when one renders — a country-style slug
 * (usa-to-india) over a currency one (usd-to-inr). Never interpolated: asked
 * of route-map, and null when the answer is no.
 */
export function corridorHref(corridor: string): string | null {
  const { from, to } = splitCorridor(corridor);
  const live = allCorridors.filter((c) => c.fromCurrency === from && c.toCurrency === to && corridorPageRenders(c.slug));
  const pick = live.find((c) => c.isCountryPage && !/^[a-z]{3}-to-[a-z]{3}$/.test(c.slug)) ?? live[0];
  return pick ? `/send-money/${pick.slug}` : null;
}

const COUNTRY_BY_CURRENCY: Record<string, string> = {
  USD: "USA", GBP: "UK", EUR: "Eurozone", CAD: "Canada", AUD: "Australia", AED: "UAE", SAR: "Saudi Arabia",
  INR: "India", PKR: "Pakistan", PHP: "Philippines", MXN: "Mexico", NGN: "Nigeria", CNY: "China", ETB: "Ethiopia",
  BDT: "Bangladesh", EGP: "Egypt", KES: "Kenya", GHS: "Ghana", BRL: "Brazil", COP: "Colombia", DOP: "Dominican Republic",
  MYR: "Malaysia", THB: "Thailand", NPR: "Nepal", LKR: "Sri Lanka", ZAR: "South Africa", MAD: "Morocco",
};

/** "USA → India", falling back to currency codes the map does not name. */
export function corridorLabel(corridor: string): string {
  const { from, to } = splitCorridor(corridor);
  return `${COUNTRY_BY_CURRENCY[from] ?? from} → ${COUNTRY_BY_CURRENCY[to] ?? to}`;
}

/** Corridors with enough priced decisions AND a full-window series to publish a row. */
export function publishableCorridors(min = readerSavings.method.minCorridorDecisions): CorridorRow[] {
  return readerSavings.corridors.filter((c) => c.window && c.priced && c.priced.pricedDecisions >= min);
}

/** Providers chosen often enough to describe how their picks priced. */
export function publishableProviders(min = 10): ProviderRow[] {
  return readerSavings.providers.filter((p) => p.priced && p.priced.pricedDecisions >= min);
}

export const pct = (share: number) => `${Math.round(share * 100)}%`;
export const usd = (n: number, dp = 0) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: dp, maximumFractionDigits: dp });

/** "7 June 2026" from a YYYY-MM-DD string, in UTC so the day never shifts. */
export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** "September 2026" when the data window is one calendar month, else "7 June 2026 – 2 October 2026". */
export function periodLabel(w = readerSavings.clicksMeta.window): string {
  if (w.from.slice(0, 7) === w.to.slice(0, 7)) {
    return new Date(`${w.from}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  }
  return `${longDate(w.from)} – ${longDate(w.to)}`;
}

/** Channel keys from the build → reader-facing names. */
export const CHANNEL_LABELS: Record<string, string> = {
  bing: "Bing",
  aiAssistants: "AI assistants (ChatGPT, Copilot, Perplexity, Claude)",
  unattributed: "Not attributed",
  direct: "Direct / bookmarks",
  yahoo: "Yahoo",
  duckduckgo: "DuckDuckGo",
  google: "Google",
  referral: "Other websites",
  otherSearch: "Other search engines",
  social: "Social media",
};
