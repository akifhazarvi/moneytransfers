/**
 * Amounts for the live-quote tables embedded across reference pages.
 *
 * Every IBAN, SWIFT and bank page used to price its table at 1,000, so pages
 * sharing a currency printed the same table: 26 eurozone IBAN pages carried an
 * identical USD → EUR table, and SWIFT pages shared theirs across 46 pages
 * (round-2 duplication audit, 2026-09-25). Pages on the same corridor now get
 * different amounts. Each family draws from its own residue (…50, …25, …75)
 * so it cannot collide with another family, nor with the guides' round
 * amounts (src/lib/guide-quote-corridor.ts) or news (news/[slug]/page.tsx).
 * Rate pair pages (one page per corridor) take the first "rates" amount: their
 * tables at 1,000 matched every corridor page and guide pricing the same route
 * (2026-10-18), the largest block those pages shared.
 */
const RESIDUE = { iban: 50, swift: 25, banks: 75, rates: 10 } as const;
const RESERVED = new Set([350, 450, 650, 750]); // taken by guides and news

export type TableFamily = keyof typeof RESIDUE;

/** The n-th amount for a family: 850, 950, 1,050… for IBAN; 1,025, 1,125… for SWIFT. */
function nth(family: TableFamily, n: number): number {
  const out: number[] = [];
  for (let base = 800; out.length <= n; base += 100) {
    const amount = base + RESIDUE[family];
    if (!RESERVED.has(amount)) out.push(amount);
  }
  return out[n];
}

/** Assign each item an amount, distinct within its corridor group, in list order. */
export function assignTableAmounts<T>(items: readonly T[], idOf: (t: T) => string, corridorOf: (t: T) => string, family: TableFamily): Map<string, number> {
  const seen = new Map<string, number>();
  const out = new Map<string, number>();
  for (const item of items) {
    const group = corridorOf(item);
    const n = seen.get(group) ?? 0;
    out.set(idOf(item), nth(family, n));
    seen.set(group, n + 1);
  }
  return out;
}

/** The first amount of a family, for pages that are the only one on their corridor. */
export function firstTableAmount(family: TableFamily): number {
  return nth(family, 0);
}
