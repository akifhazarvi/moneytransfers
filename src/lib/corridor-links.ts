/**
 * Corridor pages a template may link for a country or currency — the routes
 * that render AND that Google may index (CLAUDE.md rule 14).
 *
 * WHY (round-3 freelance brief §5.3, 2026-10-08)
 * Eligible corridor pages such as belgium-to-morocco or austria-to-sri-lanka
 * had no in-content link from any other eligible page: the corridor rails only
 * reach siblings that share a country, and most siblings are not eligible. The
 * pages that are about the same country — its IBAN or SWIFT reference, a guide
 * to sending money there, the rate history for its currency — are the
 * contextual place to link them from, so those templates ask here.
 *
 * Server-only: reads the corridor dataset (never import into a client file).
 */
import { allCorridors, type Corridor } from "@/data/corridors";
import { corridorPageRenders } from "@/lib/route-map";
import { isLinkEligible } from "@/lib/link-eligibility";

export interface CorridorLink {
  slug: string;
  href: string;
  label: string;
}

const ALIASES: Record<string, string> = {
  "united states": "usa",
  us: "usa",
  "united kingdom": "uk",
  "great britain": "uk",
  "united arab emirates": "uae",
  czechia: "czech republic",
  türkiye: "turkey",
  turkiye: "turkey",
};
export const normCountry = (name: string) => {
  const n = name.toLowerCase().trim();
  return ALIASES[n] ?? n;
};

const LINKABLE: Corridor[] = allCorridors.filter(
  (c) => !c.isCurrencyCorridor && corridorPageRenders(c.slug) && isLinkEligible(`/send-money/${c.slug}`),
);

const label = (c: Corridor) => (c.isCountryPage || !c.fromCountry ? `Send money to ${c.toCountry}` : `${c.fromCountry} to ${c.toCountry}`);

/** Countries that have at least one linkable corridor, normalised. */
export const LINKABLE_COUNTRIES: ReadonlySet<string> = new Set(
  LINKABLE.flatMap((c) => [c.toCountry, c.fromCountry].filter(Boolean).map((n) => normCountry(n as string))),
);

/**
 * Linkable corridors into or out of any of `countries` (destination matches
 * first), or paying in/out in any of `currencies`; `exclude` drops slugs a
 * list already holds. Ordered by how direct the match is, then by slug.
 */
export function linkableCorridorsFor(
  { countries = [], to = [], from = [], currencies = [], exclude = [], seed }: { countries?: string[]; to?: string[]; from?: string[]; currencies?: string[]; exclude?: string[]; seed?: string },
  limit = 4,
): CorridorLink[] {
  const into = new Set([...countries, ...to].map(normCountry));
  const outOf = new Set([...countries, ...from].map(normCountry));
  const cur = new Set(currencies.map((c) => c.toUpperCase()));
  const skip = new Set(exclude.map((s) => s.replace(/^\/send-money\//, "")));
  const rank = (c: Corridor) =>
    into.has(normCountry(c.toCountry)) ? 0 : c.fromCountry && outOf.has(normCountry(c.fromCountry)) ? 1 : cur.has(c.toCurrency) ? 2 : cur.has(c.fromCurrency) && !c.isCountryPage ? 3 : 9;
  const matched = LINKABLE.filter((c) => !skip.has(c.slug) && rank(c) < 9).sort((a, b) => rank(a) - rank(b) || a.slug.localeCompare(b.slug));
  // With a seed (the calling page's slug), rotate each equally-ranked group so
  // pages sharing a currency do not all list the same alphabetical head.
  const ordered = seed === undefined ? matched : [...new Set(matched.map(rank))].flatMap((r) => {
    const group = matched.filter((c) => rank(c) === r);
    const shift = [...seed].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261) % group.length;
    return [...group.slice(shift), ...group.slice(0, shift)];
  });
  return ordered.slice(0, limit).map((c) => ({ slug: c.slug, href: `/send-money/${c.slug}`, label: label(c) }));
}

/**
 * The countries a piece of text says money goes to ("to India", "uk-to-india")
 * and comes from ("from the UK", "UK to …"), among countries with a linkable
 * corridor — for guides, whose title and slug name their route.
 */
export function routeCountriesIn(text: string): { to: string[]; from: string[] } {
  const t = ` ${text.toLowerCase().replace(/-/g, " ")} `;
  const names = new Map<string, string>();
  for (const n of LINKABLE_COUNTRIES) names.set(n, n);
  for (const [alias, n] of Object.entries(ALIASES)) if (LINKABLE_COUNTRIES.has(n)) names.set(alias, n);
  const to = new Set<string>();
  const from = new Set<string>();
  for (const [name, n] of names) {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\bto (?:the )?${esc}\\b`).test(t)) to.add(n);
    if (new RegExp(`\\bfrom (?:the )?${esc}\\b|\\b${esc} to\\b`).test(t)) from.add(n);
  }
  return { to: [...to], from: [...from] };
}

/** Linkable country pages (send-money-to-X), alphabetical. */
export const LINKABLE_COUNTRY_PAGES: readonly CorridorLink[] = LINKABLE.filter((c) => c.isCountryPage)
  .sort((a, b) => a.toCountry.localeCompare(b.toCountry))
  .map((c) => ({ slug: c.slug, href: `/send-money/${c.slug}`, label: c.toCountry }));
