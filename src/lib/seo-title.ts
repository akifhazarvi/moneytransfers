/**
 * SERP title construction — keeps <title> distinct from the on-page <h1> and
 * inside the length crawlers actually render.
 *
 * WHY THIS EXISTS
 * Every templated page used to pass the same string to both `metadata.title`
 * and the visible <h1>. That is two separate problems:
 *   1. 90 pages shipped an identical title/H1 pair (Semrush "duplicate H1 and
 *      title tags"), wasting the one slot where we can write for the SERP
 *      rather than the reader.
 *   2. 56 pages ran past 70 characters, so Google/Bing truncated the part that
 *      carried the differentiator (the corridor, the year, the currency pair).
 *
 * The fix is a deterministic degradation ladder rather than 146 hand-written
 * strings: prefer an explicit editorial title, else brand the H1, else keep the
 * first clause of the H1. Every branch is checked against MAX_TITLE, so no
 * template can regress past the limit again — see `npm run check:seo`.
 */

export const BRAND_SUFFIX = " | SendMoneyCompare";

/** Semrush/Google truncate around here; 70 is the Semrush error threshold. */
export const MAX_TITLE = 70;

/** Clause boundaries, longest-first so " — " wins over " - ". */
const SEPARATORS = [" — ", " – ", ": ", " - ", " | ", "? "];

/** Below this a clause is too stubby to stand alone as a title. */
const MIN_CLAUSE = 15;

function stripParentheticals(s: string): string {
  return s.replace(/\s*\([^)]*\)/g, "").replace(/\s{2,}/g, " ").trim();
}

/** First clause at a natural boundary, or null when there isn't a usable one. */
function firstClause(s: string): string | null {
  for (const sep of SEPARATORS) {
    const i = s.indexOf(sep);
    if (i === -1) continue;
    // "? " is the end of the clause, not a discarded delimiter.
    const head = (sep === "? " ? s.slice(0, i + 1) : s.slice(0, i)).trim();
    if (head.length >= MIN_CLAUSE && head.length < s.length) return head;
  }
  return null;
}

/**
 * Pick the first candidate that fits MAX_TITLE. Falls back to a word-boundary
 * truncation of the last candidate so the return value is never over-length.
 */
export function fitTitle(candidates: (string | undefined | null)[], max = MAX_TITLE): string {
  const usable = candidates.filter((c): c is string => Boolean(c && c.trim()));
  for (const c of usable) {
    if (c.trim().length <= max) return c.trim();
  }
  const last = (usable[usable.length - 1] ?? "").trim();
  if (last.length <= max) return last;
  const cut = last.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

/**
 * Build a <title> for a page whose <h1> is `h1`.
 *
 * `explicit` is the editorial escape hatch (a post's own `metaTitle`); it is
 * used verbatim when it fits, so hand-written titles always win over the rule.
 * Returns a string that is <= MAX_TITLE and, wherever the ladder allows,
 * different from `h1`.
 */
export function seoTitle(h1: string, explicit?: string): string {
  const base = (h1 ?? "").trim();
  if (explicit?.trim() && explicit.trim().length <= MAX_TITLE) return explicit.trim();

  const branded = `${base}${BRAND_SUFFIX}`;
  if (branded.length <= MAX_TITLE) return branded;

  const clause = firstClause(base);
  if (clause) {
    const brandedClause = `${clause}${BRAND_SUFFIX}`;
    if (brandedClause.length <= MAX_TITLE) return brandedClause;
    if (clause.length <= MAX_TITLE) return clause;
  }

  const bare = stripParentheticals(base);
  if (bare !== base) {
    const brandedBare = `${bare}${BRAND_SUFFIX}`;
    if (brandedBare.length <= MAX_TITLE) return brandedBare;
    if (bare.length <= MAX_TITLE) return bare;
  }

  return fitTitle([base]);
}
