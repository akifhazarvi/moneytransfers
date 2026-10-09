/**
 * What a corridor `<title>` / `og:title` may claim, given how many providers
 * the page actually prices.
 *
 * WHY
 * Round-2 brief §2.1 (2026-09-24): a page holding ONE estimate was titled
 * "Cheapest Way to Send Money…". That was fixed for a single quote; round-3
 * brief §4.3 (2026-10-08) found the same title on /send-money/aud-to-bdt with
 * two. Two quotes can be put in order, but "Cheapest" and "Best" in a search
 * result promise a field, and two is not one. So the superlative needs
 * MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE providers; below it the title says what
 * the page does instead (send / compare), and with one it says "estimate".
 *
 * Pure and import-free so scripts/check-claims.ts --built enforces the same
 * number the page renders with.
 */
export const MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE = 3;

/** "Compare 15+ Providers" → "Compare 7 Providers": the count is measured, never typed. */
function resolveCount(text: string, count: number): string {
  return text.replace(/\b\d+\+(\s+[Pp]roviders?\b)/g, `${count}$1`);
}

function tidy(text: string): string {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,])/g, "$1")
    .trim();
}

/**
 * Resolve a corridor title candidate against `count`, the comparable estimates
 * the page renders (corridorComparisonSummary(...).compared.length).
 */
export function resolveProviderClaimInTitle(text: string | undefined, count: number): string | undefined {
  if (!text) return text;
  if (count >= MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE) return resolveCount(text, count);

  if (count === 2) {
    // Two quotes: a comparison exists, a "cheapest" does not.
    return tidy(
      resolveCount(text, count)
        .replace(/^(?:Cheapest|Best) Way to Send Money\b/, "Send Money")
        .replace(/^Best Money Transfer\b/, "Money Transfer")
        .replace(/^Cheapest (\S+) to (\S+) Rates\b/, "$1 to $2 Rates")
        .replace(/: (?:Cheapest|Best) Way to Send Money\b/, ": Ways to Send Money")
        .replace(/Who's Cheapest Right Now\?/, "Compare Today's Quotes")
        // og:title "USA→Pakistan: Who Gives the Best USD→PKR Rate?"
        .replace(/Who Gives (?:You )?the Best (\S+ )?Rate\?/, "Compare $1Rates")
        .replace(/\b(?:Cheapest|Best(?:[- ]Value)?)\s+/gi, ""),
    );
  }

  // One estimate (or none): the page itself says "one estimate cannot
  // establish the cheapest option", so the title may not promise one.
  return tidy(
    text
      .replace(/^(?:Cheapest|Best) Way to Send Money to (.+?)(?= [—–-] | \(|$)/, "Send Money to $1: Transfer Estimate")
      .replace(/^(?:Cheapest|Best) Way to Send Money (.+?)(?= [—–-] | \(|$)/, "$1 Transfer Estimate")
      .replace(/^Best Money Transfer (.+?)(?= [—–-] | \(|$)/, "$1 Transfer Estimate")
      .replace(/^Cheapest (\S+) to (\S+) Rates\b/, "$1 to $2 Transfer Estimate")
      .replace(/: (?:Cheapest|Best) Way to Send Money\b/, ": Transfer Estimate")
      .replace(/Who's Cheapest Right Now\?/, "Transfer Estimate")
      .replace(/Who Gives (?:You )?the Best (\S+ )?Rate\?/, "$1Transfer Estimate")
      .replace(/\s*[—–-]\s*Compare\s+[A-Z]{3}\s+Rates\b/g, "")
      .replace(/\b(?:Cheapest|Best(?:[- ]Value)?)\s+/gi, "")
      // "… — Compare 15+ Providers (2026)" and "… (2026) — Compare 15+ Providers"
      .replace(/\s*[—–-]\s*Compare\s+\d+\+\s+[Pp]roviders?\b/g, "")
      // bare "Compare 15+ Providers" with no dash in front of it
      .replace(/\s*\bCompare\s+\d+\+\s+[Pp]roviders?\b/g, ""),
  );
}

/** For check:claims --built: does a title make a ranking claim? */
export const SUPERLATIVE_TITLE = /\b(?:cheapest|best)\b/i;
