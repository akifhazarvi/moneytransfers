/**
 * "Alternatives to X" — a head-to-head priced on the corridors BOTH providers
 * actually quote.
 *
 * WHY THIS EXISTS
 * The obvious way to build an alternatives page is to rank every provider by
 * its site-wide average cost and call everything above the subject an
 * "alternative". That produces a confident table that is not true. Our own
 * index shows why: TapTap Send is measured on 793 corridors and Xoom on 13, so
 * a site-wide comparison between them is really a comparison of two different
 * corridor mixes, not two prices. Western Union looks expensive partly because
 * it quotes thin, high-margin routes nobody else covers.
 *
 * So every figure here is computed on the INTERSECTION: the corridors where we
 * hold a $1,000 quote for the subject AND for the candidate, on the same
 * corridor, from the same dataset. A provider that shares fewer than
 * MIN_SHARED_CORRIDORS routes with the subject is not listed at all — there is
 * no honest comparison to draw, and saying so is better than filling a row.
 *
 * MEDIANS, NOT MEANS. CLAUDE.md's standing rule, and it bites hardest exactly
 * here: the mean is dragged by corridors where our mid-market benchmark is
 * unreliable (USD→NGN reads −3.16%), which is enough to invert a ranking
 * between two close providers. `costPct` figures below are medians.
 *
 * Methodology mirrors remittance-cost-index.ts on purpose — same quote set,
 * same trueCostPct, same bounds, same headline amount — so the two surfaces
 * cannot disagree about the same provider.
 *
 * SERVER ONLY. This reads the full unified quote set. No client component may
 * import it (see the route-map bundle leak, Sep 18 2026); `npm run
 * check:bundle` is the guard.
 */
import { quotesByCorridor, quoteDataDate, providerNames } from "@/lib/unified-quotes";
import { INDEX_AMOUNT, trueCostPct, providerKind, type ProviderKind } from "@/lib/remittance-cost-index";
import { providers } from "@/data/providers";

/**
 * Minimum corridors two providers must share before we will compare them.
 * Eight is the point where a median stops swinging on a single odd route: at
 * five, one scrape artifact moves the figure enough to flip which provider
 * reads as cheaper.
 */
export const MIN_SHARED_CORRIDORS = 8;

/**
 * Providers that get a page. Curated, not generated — every slug here must
 * have a /companies/[slug] review to link to and enough quote coverage to
 * support a real comparison. This is an allowlist for the same reason
 * /compare/[slug] has one: a page per provider slug in the scraped feed would
 * be the combinatorial programmatic sprawl the June 2026 pruning removed.
 */
export const ALTERNATIVES_SLUGS = [
  "wise",
  "remitly",
  "western-union",
  "moneygram",
  "worldremit",
  "xoom",
  "revolut",
  "paypal",
] as const;

export interface AlternativeRow {
  slug: string;
  name: string;
  logo: string | null;
  kind: ProviderKind;
  /** Corridors where we hold a $1,000 quote for BOTH this provider and the subject. */
  sharedCorridors: number;
  /** This provider's median true cost %, on the shared corridors only. */
  costPct: number;
  /** The subject's median true cost %, on those same shared corridors. */
  subjectCostPct: number;
  /** costPct − subjectCostPct. Negative = cheaper than the subject. */
  deltaPct: number;
  /** What that delta is worth on a $1,000 transfer. Positive = saved. */
  savingPerAmount: number;
  /** Shared corridors where this provider quoted the lower true cost. */
  winsOnShared: number;
  winRatePct: number;
}

export interface AlternativesEntry {
  slug: string;
  name: string;
  logo: string | null;
  kind: ProviderKind;
  /** Corridors we priced the subject on at the headline amount. */
  corridors: number;
  quotes: number;
  /** Subject's median true cost % across all its own corridors. */
  costPct: number;
  cheaper: AlternativeRow[];
  pricier: AlternativeRow[];
  dataAsOf: string;
}

const median = (xs: number[]): number => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round2 = (n: number) => Math.round(n * 100) / 100;

/** corridor -> providerSlug -> true cost %, at the headline amount only. */
const costByCorridor = new Map<string, Map<string, number>>();

for (const [corridor, quotes] of Object.entries(quotesByCorridor)) {
  for (const q of quotes) {
    if (q.sendAmount !== INDEX_AMOUNT) continue;
    const cost = trueCostPct(q);
    if (cost === null) continue;
    let row = costByCorridor.get(corridor);
    if (!row) {
      row = new Map<string, number>();
      costByCorridor.set(corridor, row);
    }
    // Keep the best-priority quote's cost. quotesByCorridor is already
    // source-ordered, so first write wins rather than last.
    if (!row.has(q.providerSlug)) row.set(q.providerSlug, cost);
  }
}

const nameOf = (slug: string) => providerNames[slug] ?? slug;
const logoOf = (slug: string) => providers.find((p) => p.slug === slug)?.logo ?? null;

function buildEntry(subject: string): AlternativesEntry | null {
  // Subject's own corridors and costs.
  const subjectCosts: number[] = [];
  const subjectByCorridor = new Map<string, number>();
  for (const [corridor, row] of costByCorridor) {
    const c = row.get(subject);
    if (c === undefined) continue;
    subjectCosts.push(c);
    subjectByCorridor.set(corridor, c);
  }
  if (subjectByCorridor.size < MIN_SHARED_CORRIDORS) return null;

  // Candidate stats restricted to the intersection with the subject.
  interface Pair { theirs: number[]; ours: number[]; wins: number }
  const pairs = new Map<string, Pair>();
  for (const [corridor, subjectCost] of subjectByCorridor) {
    const row = costByCorridor.get(corridor);
    if (!row) continue;
    for (const [slug, cost] of row) {
      if (slug === subject) continue;
      let p = pairs.get(slug);
      if (!p) {
        p = { theirs: [], ours: [], wins: 0 };
        pairs.set(slug, p);
      }
      p.theirs.push(cost);
      p.ours.push(subjectCost);
      if (cost < subjectCost) p.wins += 1;
    }
  }

  const rows: AlternativeRow[] = [];
  for (const [slug, p] of pairs) {
    if (p.theirs.length < MIN_SHARED_CORRIDORS) continue;
    const costPct = round2(median(p.theirs));
    const subjectCostPct = round2(median(p.ours));
    const deltaPct = round2(costPct - subjectCostPct);
    rows.push({
      slug,
      name: nameOf(slug),
      logo: logoOf(slug),
      kind: providerKind(slug, nameOf(slug)),
      sharedCorridors: p.theirs.length,
      costPct,
      subjectCostPct,
      deltaPct,
      savingPerAmount: round2((-deltaPct / 100) * INDEX_AMOUNT),
      winsOnShared: p.wins,
      winRatePct: Math.round((p.wins / p.theirs.length) * 100),
    });
  }

  const bySaving = (a: AlternativeRow, b: AlternativeRow) =>
    a.deltaPct - b.deltaPct || b.sharedCorridors - a.sharedCorridors || a.slug.localeCompare(b.slug);

  return {
    slug: subject,
    name: nameOf(subject),
    logo: logoOf(subject),
    kind: providerKind(subject, nameOf(subject)),
    corridors: subjectByCorridor.size,
    quotes: subjectCosts.length,
    costPct: round2(median(subjectCosts)),
    cheaper: rows.filter((r) => r.deltaPct < 0).sort(bySaving),
    pricier: rows.filter((r) => r.deltaPct >= 0).sort(bySaving).reverse(),
    dataAsOf: quoteDataDate ?? new Date().toISOString().slice(0, 10),
  };
}

const built = new Map<string, AlternativesEntry>();
for (const slug of ALTERNATIVES_SLUGS) {
  const e = buildEntry(slug);
  if (e) built.set(slug, e);
}

export const PROVIDER_ALTERNATIVES: ReadonlyMap<string, AlternativesEntry> = built;

/** Does /alternatives/[slug] render? The single source route-map defers to. */
export function alternativesPageRenders(slug: string | undefined | null): boolean {
  return Boolean(slug && built.has(slug));
}

export const ALTERNATIVES_RENDERED_SLUGS: readonly string[] = [...built.keys()];
