/**
 * Typed reader for src/data/scraped/weekend-markup.json — the day-of-week FX
 * markup dataset behind /guides/best-day-to-send-money-abroad.
 *
 * The JSON is produced by scripts/build-weekend-markup.ts (run in the scrape
 * pipeline). Everything the article states is read from here rather than typed
 * into the copy, so the published numbers can never drift from the data — same
 * contract as bank-vs-app-index.ts.
 *
 * The file is a few KB, so importing it into a server component is cheap. Do
 * NOT import this from a client component: keep the import chain server-side.
 */
import raw from "@/data/scraped/weekend-markup.json";
import providerNamesData from "@/data/provider-names.json";

const providerNames = providerNamesData as Record<string, string>;

export interface DayRow {
  day: string;
  n: number;
  mean: number | null;
  median: number | null;
}

export interface ProviderRow {
  slug: string;
  /** Mean FX markup % on Mon-Fri. */
  weekday: number;
  /** Mean FX markup % on Sat-Sun. */
  weekend: number;
  /** weekend - weekday, in percentage points. Positive = dearer at weekends. */
  premiumPp: number;
  n: number;
}

export interface WeekendMarkup {
  generatedAt: string;
  dataRange: { from: string; to: string };
  observations: number;
  skipped: number;
  snapshots: number;
  byDayOfWeek: DayRow[];
  weekdayMean: number;
  weekendMean: number;
  weekendDeltaPp: number;
  minSideN: number;
  publishableMaxMean: number;
  providers: ProviderRow[];
  quarantined: ProviderRow[];
}

export const weekendMarkup = raw as WeekendMarkup;

/** Display name for a provider slug, falling back to a de-slugged label. */
export function providerLabel(slug: string): string {
  return (
    providerNames[slug] ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** Providers that charge MORE at weekends, biggest gap first. */
export function widensAtWeekend(limit = 8): ProviderRow[] {
  return weekendMarkup.providers.filter((p) => p.premiumPp > 0).slice(0, limit);
}

/** Providers that charge LESS at weekends, biggest gap first. */
export function narrowsAtWeekend(limit = 8): ProviderRow[] {
  return weekendMarkup.providers
    .filter((p) => p.premiumPp < 0)
    .slice()
    .sort((a, b) => a.premiumPp - b.premiumPp)
    .slice(0, limit);
}

/** Cheapest and dearest by weekday markup — the spread that dwarfs timing. */
export function costExtremes(limit = 5): { cheapest: ProviderRow[]; dearest: ProviderRow[] } {
  const byCost = [...weekendMarkup.providers].sort((a, b) => a.weekday - b.weekday);
  return { cheapest: byCost.slice(0, limit), dearest: byCost.slice(-limit).reverse() };
}

/** "10 March 2026" from a YYYY-MM-DD string. */
export function longDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
