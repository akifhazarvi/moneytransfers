import corridorLeaders from "@/data/scraped/corridor-leaders.json";

interface LeaderRow {
  slug: string;
  name: string;
  wins: number;
  contestedDays: number;
}

/**
 * Corridors where one provider delivered the most on EVERY contested day we
 * could compare — the strongest claim the quote archive supports about a
 * provider, and the only kind of highlight a paid partner gets on this site.
 *
 * The `{{UNANIMOUS_LEAD:slug}}` token in `ratings-tokens.ts` renders the same
 * measurement as prose for guides and business pages; this is the component
 * form, for pages that are TSX rather than stored HTML. Both read
 * `corridor-leaders.json`, so neither can drift from the scrape.
 *
 * A full sweep is required (`wins === contestedDays`). "Nearly always" is a
 * weaker claim and does not belong in the same number.
 */
export function unanimousLeads(slug: string): { corridors: number; days: number } {
  const rows = Object.values(corridorLeaders as Record<string, LeaderRow>)
    .filter((v) => v.slug === slug && v.contestedDays > 0 && v.wins === v.contestedDays)
    .sort((a, b) => b.contestedDays - a.contestedDays);

  return { corridors: rows.length, days: rows[0]?.contestedDays ?? 0 };
}
