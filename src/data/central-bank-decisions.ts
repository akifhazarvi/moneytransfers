/**
 * Monetary-policy decisions inside the window our exchange-rate history
 * covers (March–October 2026), one list per currency's central bank. Read by
 * /exchange-rates/history/[pair], which prints each decision beside what that
 * pair's mid-market rate did in the following week.
 *
 * Every entry is transcribed from the central bank's own statement (`url`);
 * `reason` is a short paraphrase of the reason the statement gives, never a
 * market commentator's. Add a decision only from its statement. Round-3
 * freelance brief §4.2 (2026-10-08): history pages need "events, and
 * explanations of exchange-rate movements".
 */

export interface PolicyDecision {
  /** Announcement date, YYYY-MM-DD (local to the central bank). */
  date: string;
  /** "Held at 3.60%", "Cut by 0.25 point to 3.35%" … */
  decision: string;
  /** Why, per the statement — a clause, not a quotation. */
  reason: string;
  url: string;
}

export interface CentralBank {
  /** Short name used in tables: "RBA", "Fed" … */
  short: string;
  name: string;
  /** What the decision sets: "cash rate target", "Bank Rate" … */
  rateName: string;
  decisions: PolicyDecision[];
}

export const CENTRAL_BANK_BY_CURRENCY: Record<string, CentralBank> = {};

export function centralBankFor(currency: string): CentralBank | undefined {
  const bank = CENTRAL_BANK_BY_CURRENCY[currency];
  return bank && bank.decisions.length > 0 ? bank : undefined;
}
