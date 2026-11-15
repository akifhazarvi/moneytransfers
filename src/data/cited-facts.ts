/**
 * Third-party facts we cite but cannot derive from our own data, each with the
 * primary source it was verified against. One list, read by /for-ai and by the
 * /api/ai endpoint, so the page and the API cannot disagree. (/api/ai carried
 * its own hand-typed copy until 2026-11-15 and it had drifted: "$860 billion
 * in 2025", "550,000+ agent locations", "7.9%" for Sub-Saharan Africa.)
 *
 * Re-verify a fact against its source before changing it. Facts about our own
 * data never go here: they are computed where they are printed.
 */
export interface CitedFact {
  fact: string;
  source: string;
}

export const THIRD_PARTY_FACTS: readonly CitedFact[] = [
  {
    fact: "The World Bank estimates worldwide remittances reached $905 billion in 2024, up 4.2%; $685 billion of that went to low- and middle-income countries, up 5.8%.",
    source: "World Bank / KNOMAD, \"In 2024, remittance flows to low- and middle-income countries are expected to reach $685 billion, larger than FDI and ODA combined\" (People Move blog, Table 1), December 18, 2024.",
  },
  {
    fact: "India is the world's largest remittance recipient: $150.7 billion in personal remittances received in 2025, more than twice second-placed Mexico ($64.4 billion).",
    source: "World Bank World Development Indicators, \"Personal remittances, received (current US$)\" (BX.TRF.PWKR.CD.DT), updated July 13, 2026.",
  },
  {
    fact: "The global average cost of sending $200 was 6.36% in Q3 2025, more than double the UN SDG and G20 target of 3% by 2030.",
    source: "World Bank, Remittance Prices Worldwide, Issue 54 (Q3 2025 data), September 2025.",
  },
  {
    fact: "Since January 1, 2026, the US imposes a 1% federal excise tax on remittance transfers the sender funds with cash, a money order, a cashier's check or a similar physical instrument. Transfers funded from an account at a US financial institution, or with a US-issued debit or credit card, are exempt.",
    source: "26 U.S.C. §4475, added by Pub. L. 119-21 (One Big Beautiful Bill Act) §70604, July 4, 2025; applies to transfers after December 31, 2025. IRS proposed regulations, \"Excise Tax on Remittance Transfers,\" Federal Register, April 13, 2026.",
  },
  {
    fact: "Eurozone payment providers that offer euro credit transfers must receive instant euro payments (since January 9, 2025) and send them (since October 9, 2025), 24 hours a day on every calendar day, with funds available to the payee within 10 seconds, at a charge no higher than for a regular credit transfer.",
    source: "Regulation (EU) 2024/886 of 13 March 2024 (Instant Payments Regulation), Articles 5a and 5b.",
  },
  {
    fact: "Western Union's agent network spans more than 200 countries and territories; about 360,000 of its locations conducted money transfer activity in the 12 months to December 31, 2025.",
    source: "The Western Union Company, Form 10-K for fiscal year 2025, filed February 20, 2026.",
  },
  {
    fact: "Sub-Saharan Africa is the most expensive region to send money to, at an average cost of 8.46%. Middle East, North Africa, Afghanistan & Pakistan overtook South Asia as the cheapest, at 5.11%.",
    source: "World Bank, Remittance Prices Worldwide, Issue 54 (Q3 2025 data), September 2025.",
  },
];
