/**
 * Monetary-policy decisions inside the window our exchange-rate history
 * covers (March–October 2026), one list per currency's central bank. Read by
 * /exchange-rates/history/[pair], which prints each decision beside what that
 * pair's mid-market rate did in the following week.
 *
 * Every entry is transcribed from the central bank's own statement (`url`);
 * `note` paraphrases the reason (or the vote split) the statement gives, never
 * a market commentator's. Add a decision only from its statement. Round-3
 * freelance brief §4.2 (2026-10-08): history pages need "events, and
 * explanations of exchange-rate movements". Checked 2026-10-09.
 */

export interface PolicyDecision {
  /** Announcement date, YYYY-MM-DD (local to the central bank). */
  date: string;
  /** Lower-case clause after the bank's name: "held the cash rate target at 4.35%". */
  decision: string;
  /** The stated reason or the vote, per the statement — a clause, not a quotation. */
  note: string;
  url: string;
}

export interface CentralBank {
  /** Short name used in headings and lists: "RBA", "Fed" … */
  short: string;
  name: string;
  /** What the decision sets: "cash rate target", "Bank Rate" … */
  rateName: string;
  decisions: PolicyDecision[];
}

export const CENTRAL_BANK_BY_CURRENCY: Record<string, CentralBank> = {
  AUD: {
    short: "RBA",
    name: "Reserve Bank of Australia",
    rateName: "cash rate target",
    decisions: [
      { date: "2026-03-17", decision: "raised the cash rate target by 0.25 point to 4.10%", note: "inflation had picked up in late 2025 and higher fuel prices from the Middle East conflict tilted the risks towards more", url: "https://www.rba.gov.au/media-releases/2026/mr-26-08.html" },
      { date: "2026-05-05", decision: "raised it by 0.25 point to 4.35%", note: "capacity pressures and dearer fuel looked set to keep inflation above target for some time", url: "https://www.rba.gov.au/media-releases/2026/mr-26-12.html" },
      { date: "2026-06-16", decision: "held it at 4.35%", note: "to assess the earlier increases and the oil supply disruption, with inflation still above target", url: "https://www.rba.gov.au/media-releases/2026/mr-26-15.html" },
      { date: "2026-08-11", decision: "held it at 4.35%", note: "inflation was still too high, with oil-driven price pressures and capacity constraints", url: "https://www.rba.gov.au/media-releases/2026/mr-26-19.html" },
      { date: "2026-09-29", decision: "raised it by 0.25 point to 4.60%", note: "inflation was running too high on energy price shocks and pressure on domestic capacity", url: "https://www.rba.gov.au/media-releases/2026/mr-26-27.html" },
    ],
  },
  CAD: {
    short: "Bank of Canada",
    name: "Bank of Canada",
    rateName: "target for the overnight rate",
    decisions: [
      { date: "2026-03-18", decision: "held the overnight rate target at 2.25%", note: "weighing weaker growth against higher inflation risks from energy prices", url: "https://www.bankofcanada.ca/2026/03/fad-press-release-2026-03-18/" },
      { date: "2026-04-29", decision: "held it at 2.25%", note: "looking through an energy-driven jump in inflation while guarding against it lasting", url: "https://www.bankofcanada.ca/2026/04/fad-press-release-2026-04-29/" },
      { date: "2026-06-10", decision: "held it at 2.25%", note: "the economy remained weak and trade-policy uncertainty persisted", url: "https://www.bankofcanada.ca/2026/06/fad-press-release-2026-06-10/" },
      { date: "2026-07-15", decision: "held it at 2.25%", note: "judged appropriate to support the recovery and bring inflation back to the 2% target", url: "https://www.bankofcanada.ca/2026/07/fad-press-release-2026-07-15/" },
      { date: "2026-09-02", decision: "held it at 2.25%", note: "the economy and inflation were tracking the July forecast, though inflation risks had risen and new tariffs added uncertainty", url: "https://www.bankofcanada.ca/2026/09/fad-press-release-2026-09-02/" },
    ],
  },
  EUR: {
    short: "ECB",
    name: "European Central Bank",
    rateName: "deposit facility rate",
    decisions: [
      { date: "2026-03-19", decision: "held the deposit facility rate at 2.00%", note: "the Middle East conflict was raising near-term inflation through energy prices and weighing on growth", url: "https://www.ecb.europa.eu/press/press_conference/monetary-policy-statement/shared/pdf/ecb.ds260319~30247d385d.en.pdf" },
      { date: "2026-04-30", decision: "held it at 2.00%", note: "upside risks to inflation and downside risks to growth had intensified, and an increase was debated", url: "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260430~81b7179e6f.en.html" },
      { date: "2026-06-11", decision: "raised it by 0.25 point to 2.25%", note: "the war in the Middle East was generating inflation pressures", url: "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260611~4d41bd5e83.en.html" },
      { date: "2026-07-23", decision: "held it at 2.25%", note: "rates were left unchanged after June's increase", url: "https://www.ecb.europa.eu/press/press_conference/monetary-policy-statement/shared/pdf/ecb.ds260723~ef801dc812.en.pdf" },
      { date: "2026-09-10", decision: "raised it by 0.25 point to 2.50%", note: "the conflict continued to generate inflation pressures, with inflation expected to stay well above target for a long time", url: "https://www.ecb.europa.eu/press/press_conference/monetary-policy-statement/2026/html/ecb.is260910~6a45359cfc.en.html" },
    ],
  },
  GBP: {
    short: "Bank of England",
    name: "Bank of England",
    rateName: "Bank Rate",
    decisions: [
      { date: "2026-03-19", decision: "held Bank Rate at 3.75%", note: "the Monetary Policy Committee voted unanimously", url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/march-2026" },
      { date: "2026-04-30", decision: "held it at 3.75%", note: "by 8–1, one member voting to raise it to 4%", url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/april-2026" },
      { date: "2026-06-18", decision: "held it at 3.75%", note: "by 7–2, two members voting for an increase", url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/june-2026" },
      { date: "2026-07-30", decision: "held it at 3.75%", note: "by 6–3, three members voting for an increase", url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/july-2026" },
      { date: "2026-09-17", decision: "held it at 3.75%", note: "by 6–3 again, and the Committee voted to run its gilt holdings down to zero", url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/september-2026" },
    ],
  },
  USD: {
    short: "Fed",
    name: "Federal Reserve",
    rateName: "federal funds target range",
    decisions: [
      { date: "2026-03-18", decision: "held the federal funds target range at 3.50–3.75%", note: "inflation somewhat elevated, growth solid and hiring weak", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260318a.htm" },
      { date: "2026-04-29", decision: "held it at 3.50–3.75%", note: "inflation elevated, partly on higher global energy prices", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260429a.htm" },
      { date: "2026-06-17", decision: "held it at 3.50–3.75%", note: "in support of its maximum-employment and 2% inflation goals", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260617a.htm" },
      { date: "2026-07-29", decision: "held it at 3.50–3.75%", note: "in support of the same dual mandate", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm" },
      { date: "2026-09-16", decision: "raised it by 0.25 point to 3.75–4.00%", note: "in support of its dual mandate", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm" },
    ],
  },
};

export function centralBankFor(currency: string): CentralBank | undefined {
  const bank = CENTRAL_BANK_BY_CURRENCY[currency];
  return bank && bank.decisions.length > 0 ? bank : undefined;
}
