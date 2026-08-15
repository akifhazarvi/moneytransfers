/**
 * Purchasing-power + transfer-cost model behind /tools/salary-abroad.
 *
 * THE GAP THIS FILLS
 * Every salary/cost-of-living calculator online converts money at the
 * mid-market rate, for free. Nobody pays that rate. If you earn in one currency
 * and live in another, a spread comes off every transfer, and our own quote
 * archive shows that spread runs from ~0.3% to ~4.8% depending purely on which
 * provider you use. This model puts both halves on screen: how much further the
 * money goes, and how much of that the transfer takes back.
 *
 * DATA
 * - Purchasing power: World Bank ICP household-consumption PPP, via
 *   scripts/build-ppp-index.ts. Official, free, country-level.
 * - Provider markup: the same 2.37M-observation archive behind
 *   /guides/best-day-to-send-money-abroad, via weekend-markup.json.
 *
 * Markup here is the provider's TYPICAL FX margin across all corridors, not a
 * live quote for a specific pair — the tool says so, and links to the live
 * comparison for the real number. Using the average keeps this a static import
 * with no per-keystroke API call.
 *
 * Server-side only: keep the import chain off the client bundle.
 */
import pppRaw from "@/data/scraped/ppp-index.json";
import { weekendMarkup, providerLabel } from "@/lib/weekend-markup";
import { allCorridors } from "@/data/corridors";
import { getCorridorTier } from "@/lib/corridor-tiers";
import { GONE_CORRIDOR_SLUGS } from "@/lib/gone-corridors";

export interface PppCountry {
  iso2: string;
  iso3: string;
  name: string;
  currency: string;
  ppp: number;
  pppYear: string;
  rate: number;
  /** >1 = income buys MORE there than in the US. */
  multiplier: number;
  /** Price level, US = 1. Higher = more expensive. Inverse of multiplier. */
  priceLevel: number;
  /** GNI per capita, PPP int$ — what locals actually earn. Null if unreported. */
  gni: number | null;
  gniYear: string | null;
}

export interface PppIndex {
  generatedAt: string;
  source: string;
  indicator: string;
  rateDate: string;
  pppYears: { from: string; to: string };
  countryCount: number;
  withGni: number;
  gniIndicator: string;
  countries: PppCountry[];
}

export const pppIndex = pppRaw as PppIndex;

/** Countries keyed by ISO2 for O(1) lookup. */
const byIso2 = new Map(pppIndex.countries.map((c) => [c.iso2, c]));
export function getCountry(iso2: string): PppCountry | undefined {
  return byIso2.get(iso2.toUpperCase());
}

/** Currencies people actually earn in, present in the index. */
export function earnCurrencies(): string[] {
  return [...new Set(pppIndex.countries.map((c) => c.currency))].sort();
}

/**
 * The cheapest and dearest well-sampled providers, used to size the spread a
 * reader can actually control. Excludes the quarantined outlier by construction
 * (weekendMarkup.providers already has it removed).
 */
export function markupBounds(): { best: { slug: string; name: string; pct: number }; worst: { slug: string; name: string; pct: number } } {
  const sorted = [...weekendMarkup.providers].sort((a, b) => a.weekday - b.weekday);
  const b = sorted[0];
  const w = sorted[sorted.length - 1];
  return {
    best: { slug: b.slug, name: providerLabel(b.slug), pct: b.weekday },
    worst: { slug: w.slug, name: providerLabel(w.slug), pct: w.weekday },
  };
}

export interface AbroadResult {
  country: PppCountry;
  /** Salary converted at the mid-market rate, in local currency. */
  localNominal: number;
  /** What that income "feels like" back home, adjusted for local prices. */
  feelsLike: number;
  /** Purchasing-power multiplier relative to the earning currency. */
  multiplier: number;
  /** Annual FX cost at the cheapest / dearest provider, in the earning currency. */
  costBest: number;
  costWorst: number;
  /** What choosing well saves per year. */
  savedPerYear: number;
}

/**
 * Model one destination against the user's CURRENT country.
 *
 * Keyed on home country, not home currency, and deliberately so: 20 countries
 * share the euro but their price levels differ enormously. Resolving "EUR" to
 * some arbitrary eurozone member made Germany score 0.72x against itself.
 * Purchasing power is a country-to-country comparison; the currency is just
 * what rides on top.
 *
 * `multiplier` is therefore the ratio of the two countries' USD-relative
 * figures: >1 means the same income buys more in the destination than at home,
 * and a country compared with itself is exactly 1.0.
 */
export function modelDestination(
  salary: number,
  homeIso2: string,
  destIso2: string,
): AbroadResult | null {
  const country = getCountry(destIso2);
  const home = getCountry(homeIso2);
  if (!country || !home || salary <= 0) return null;

  const multiplier = country.multiplier / home.multiplier;
  const crossRate = country.rate / home.rate; // earnCurrency -> local
  const localNominal = salary * crossRate;
  const feelsLike = salary * multiplier;

  const { best, worst } = markupBounds();
  const costBest = salary * (best.pct / 100);
  const costWorst = salary * (worst.pct / 100);

  return {
    country,
    localNominal,
    feelsLike,
    multiplier: Math.round(multiplier * 1000) / 1000,
    costBest: Math.round(costBest),
    costWorst: Math.round(costWorst),
    savedPerYear: Math.round(costWorst - costBest),
  };
}

/** Every destination ranked by purchasing power, relative to the home country. */
export function rankDestinations(salary: number, homeIso2: string): AbroadResult[] {
  return pppIndex.countries
    .filter((c) => c.iso2 !== homeIso2.toUpperCase())
    .map((c) => modelDestination(salary, homeIso2, c.iso2))
    .filter((r): r is AbroadResult => r !== null)
    .sort((a, b) => b.multiplier - a.multiplier);
}

/** Countries sorted by name, for the home/destination pickers. */
export function countriesByName(): PppCountry[] {
  return [...pppIndex.countries].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Map "FROM-TO" currency pair -> a corridor slug that actually renders.
 *
 * The tool links out to /send-money/<slug> for each destination, but that route
 * only pre-renders Tier 1-2 corridors and 404s the rest at runtime, and slug
 * shapes are inconsistent (usd-to-cad, but usa-to-india). Linking by naive
 * string construction would emit dozens of broken internal links.
 *
 * This mirrors generateStaticParams' filter exactly, so a link is only rendered
 * when the target page genuinely exists. Country-style slugs are preferred over
 * bare currency slugs — they are the canonical, editorially richer pages.
 */
export function corridorSlugByPair(): Record<string, string> {
  const out: Record<string, string> = {};
  const live = allCorridors
    .filter((c) => !GONE_CORRIDOR_SLUGS.has(c.slug))
    .filter((c) => getCorridorTier(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage) <= 2);

  for (const c of live) {
    if (!c.fromCurrency || !c.toCurrency) continue;
    const key = `${c.fromCurrency}-${c.toCurrency}`;
    const existing = out[key];
    // Prefer a country-style slug (usa-to-india) over a currency one (usd-to-inr).
    if (!existing || (c.isCountryPage && !/^[a-z]{3}-to-[a-z]{3}$/.test(c.slug))) {
      out[key] = c.slug;
    }
  }
  return out;
}

/** "15 August 2026" from a YYYY-MM-DD string. */
export function longDateFromIso(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}

/**
 * Points for the cost-vs-income scatter, plus the medians that draw its
 * quadrant dividers. Only countries reporting both axes are plotted — a
 * missing GNI cannot be imputed without inventing data.
 */
export function scatterData(): {
  points: { iso2: string; name: string; priceLevel: number; gni: number; currency: string }[];
  medPrice: number;
  medGni: number;
} {
  const pts = pppIndex.countries
    .filter((c): c is PppCountry & { gni: number } => typeof c.gni === "number" && c.gni > 0)
    .map((c) => ({ iso2: c.iso2, name: c.name, priceLevel: c.priceLevel, gni: c.gni, currency: c.currency }));
  const mid = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  return { points: pts, medPrice: mid(pts.map((p) => p.priceLevel)), medGni: mid(pts.map((p) => p.gni)) };
}
