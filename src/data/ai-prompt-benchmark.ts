/**
 * The fixed AI-prompt benchmark.
 *
 * WHY A DATA FILE RATHER THAN AN ARRAY IN THE SCRIPT
 * The point of a benchmark is that it does not move. If prompts are edited
 * casually, a rise in citation coverage is indistinguishable from a change of
 * question, and the whole series becomes unreadable. Keeping them here makes
 * every change to the set a reviewable diff.
 *
 * THE BASELINE TEN
 * `baseline: true` marks the ten prompts from the 2026-04-19 run — the only
 * measurement that exists (1 citation of 10 on ChatGPT, Perplexity keyless).
 * They are reproduced VERBATIM, typos of phrasing included, because they are
 * the sole "before" snapshot that predates every dataset published since.
 * Never reword one: rewording silently invalidates the comparison.
 *
 * `target` is the URL we would expect to win the prompt if the site deserved
 * it. It is a hypothesis, not a promise — recording it lets a run answer "are
 * we cited on the strength of the page we built for this, or something else",
 * which is the difference between a strategy working and getting lucky.
 */

export type PromptTopic =
  | "cost"
  | "comparison"
  | "corridor"
  | "safety"
  | "speed"
  | "rules"
  | "business"
  | "timing";

export interface BenchmarkPrompt {
  id: string;
  prompt: string;
  topic: PromptTopic;
  /** Part of the 2026-04-19 baseline. Do not reword. */
  baseline?: boolean;
  /** The page we would hope answers this, if any exists yet. */
  target?: string;
}

export const BENCHMARK_PROMPTS: BenchmarkPrompt[] = [
  // ── The baseline ten (2026-04-19). VERBATIM. ────────────────────────────
  { id: "b01", prompt: "cheapest way to send money to India from USA", topic: "corridor", baseline: true, target: "/send-money/usa-to-india" },
  { id: "b02", prompt: "best money transfer service for sending to Philippines", topic: "corridor", baseline: true },
  { id: "b03", prompt: "Wise vs Remitly comparison", topic: "comparison", baseline: true, target: "/compare/wise-vs-remitly" },
  { id: "b04", prompt: "cheapest way to send money to Mexico", topic: "corridor", baseline: true },
  { id: "b05", prompt: "cheapest international money transfer 2026", topic: "cost", baseline: true, target: "/remittance-cost-index" },
  { id: "b06", prompt: "how to send money to Pakistan", topic: "corridor", baseline: true },
  { id: "b07", prompt: "best provider for USD to INR transfer", topic: "corridor", baseline: true },
  { id: "b08", prompt: "compare international money transfer fees", topic: "cost", baseline: true, target: "/remittance-cost-index" },
  { id: "b09", prompt: "is Wise cheaper than bank wire transfer", topic: "comparison", baseline: true, target: "/guides/bank-vs-app-transfer-cost-2026" },
  { id: "b10", prompt: "best app to send money abroad", topic: "cost", baseline: true, target: "/guides/best-money-transfer-apps" },

  // ── Cost: the questions our data assets exist to answer ─────────────────
  { id: "c01", prompt: "which money transfer provider is cheapest most often?", topic: "cost", target: "/provider-consistency" },
  { id: "c02", prompt: "is the cheapest money transfer provider the same every day?", topic: "cost", target: "/provider-consistency" },
  { id: "c03", prompt: "how much does it really cost to send $1000 abroad?", topic: "cost", target: "/remittance-cost-index" },
  { id: "c04", prompt: "what is the true cost of an international transfer including exchange rate markup?", topic: "cost", target: "/remittance-cost-index" },
  { id: "c05", prompt: "do banks charge more than apps for international transfers?", topic: "cost", target: "/guides/bank-vs-app-transfer-cost-2026" },
  { id: "c06", prompt: "how much do I lose to exchange rate markup on a money transfer?", topic: "cost", target: "/tools/fx-markup-checker" },
  { id: "c07", prompt: "is it cheaper to send $100 or $1000 internationally?", topic: "cost", target: "/transfer-cost-by-amount" },
  { id: "c08", prompt: "why do small international transfers cost more proportionally?", topic: "cost", target: "/transfer-cost-by-amount" },
  { id: "c09", prompt: "is Wise good for small transfers under $200?", topic: "cost", target: "/transfer-cost-by-amount" },
  { id: "c10", prompt: "which money transfer app has no hidden fees?", topic: "cost" },
  { id: "c11", prompt: "how much does it cost to wire money internationally from a bank?", topic: "cost", target: "/guides/bank-vs-app-transfer-cost-2026" },
  { id: "c12", prompt: "cheapest way to send a large amount of money overseas", topic: "cost", target: "/guides/best-money-transfer-apps-large-transfers" },
  { id: "c13", prompt: "which is cheaper, Western Union or Wise?", topic: "cost" },
  { id: "c14", prompt: "how much of my money actually arrives when I send abroad?", topic: "cost", target: "/remittance-cost-index" },
  { id: "c15", prompt: "average cost of sending remittances in 2026", topic: "cost", target: "/remittance-cost-index" },

  // ── Head-to-head comparison ─────────────────────────────────────────────
  { id: "p01", prompt: "Wise vs Remitly which is cheaper for sending to India?", topic: "comparison", target: "/compare/wise-vs-remitly" },
  { id: "p02", prompt: "Wise vs Remitly vs Xoom vs XE which actually costs less?", topic: "comparison" },
  { id: "p03", prompt: "Remitly vs Xoom for sending to the Philippines", topic: "comparison", target: "/compare/remitly-vs-xoom" },
  { id: "p04", prompt: "Wise vs XE money transfer, which is better?", topic: "comparison", target: "/compare/wise-vs-xe" },
  { id: "p05", prompt: "is Revolut or Wise better for international transfers?", topic: "comparison" },
  { id: "p06", prompt: "PayPal vs Wise for sending money internationally", topic: "comparison" },
  { id: "p07", prompt: "MoneyGram vs Western Union which is cheaper?", topic: "comparison" },
  { id: "p08", prompt: "best alternative to Western Union", topic: "comparison" },
  { id: "p09", prompt: "is Remitly or Wise better for regular monthly transfers?", topic: "comparison" },
  { id: "p10", prompt: "which money transfer service has the best exchange rates?", topic: "comparison" },

  // ── Corridor-specific ───────────────────────────────────────────────────
  { id: "r01", prompt: "best way to send money from USA to India in 2026", topic: "corridor", target: "/send-money/usa-to-india" },
  { id: "r02", prompt: "cheapest way to send money from UK to Nigeria", topic: "corridor", target: "/guides/best-apps-send-money-uk-to-nigeria-2026" },
  { id: "r03", prompt: "how to send money from USA to Mexico cheaply", topic: "corridor" },
  { id: "r04", prompt: "best app to send money from UK to India", topic: "corridor" },
  { id: "r05", prompt: "cheapest way to send money from USA to Philippines", topic: "corridor" },
  { id: "r06", prompt: "how to send money from UAE to India", topic: "corridor" },
  { id: "r07", prompt: "best way to send money from Canada to India", topic: "corridor" },
  { id: "r08", prompt: "cheapest way to send money from Australia to Philippines", topic: "corridor" },
  { id: "r09", prompt: "how to send money from Saudi Arabia to Pakistan", topic: "corridor" },
  { id: "r10", prompt: "best way to send money from Singapore to India", topic: "corridor" },
  { id: "r11", prompt: "cheapest way to send money from USA to Nigeria", topic: "corridor" },
  { id: "r12", prompt: "how to send money from UK to Poland", topic: "corridor" },
  { id: "r13", prompt: "best way to send money from Germany to Turkey", topic: "corridor" },
  { id: "r14", prompt: "cheapest way to send money from USA to Vietnam", topic: "corridor" },
  { id: "r15", prompt: "how to send money to Bangladesh from USA", topic: "corridor" },

  // ── Safety, problems, and things going wrong ────────────────────────────
  { id: "s01", prompt: "what happens if I send money to the wrong person?", topic: "safety" },
  { id: "s02", prompt: "can I get my money back after a wrong international transfer?", topic: "safety" },
  { id: "s03", prompt: "is Wise safe to use for large amounts?", topic: "safety", target: "/companies/wise" },
  { id: "s04", prompt: "are money transfer apps safe?", topic: "safety", target: "/guides/money-transfer-safety-guide" },
  { id: "s05", prompt: "how do I know if a money transfer service is legitimate?", topic: "safety", target: "/guides/money-transfer-safety-guide" },
  { id: "s06", prompt: "what should I do if my international transfer is delayed?", topic: "safety" },
  { id: "s07", prompt: "is my money protected if a transfer company goes bust?", topic: "safety" },
  { id: "s08", prompt: "common international money transfer scams to avoid", topic: "safety" },
  { id: "s09", prompt: "is Remitly legit and safe?", topic: "safety", target: "/companies/remitly" },
  { id: "s10", prompt: "which money transfer companies are regulated by the FCA?", topic: "safety" },

  // ── Speed ───────────────────────────────────────────────────────────────
  { id: "d01", prompt: "fastest way to send money internationally", topic: "speed" },
  { id: "d02", prompt: "which money transfer app is instant?", topic: "speed" },
  { id: "d03", prompt: "how long does an international bank transfer take?", topic: "speed" },
  { id: "d04", prompt: "fastest way to send money to India", topic: "speed" },
  { id: "d05", prompt: "why is my international transfer taking so long?", topic: "speed" },
  { id: "d06", prompt: "can I send money abroad same day?", topic: "speed" },

  // ── Rules, limits, tax ──────────────────────────────────────────────────
  { id: "l01", prompt: "how much money can I send abroad without paying tax?", topic: "rules", target: "/tools/us-remittance-tax" },
  { id: "l02", prompt: "what is the US remittance tax in 2026?", topic: "rules", target: "/tools/us-remittance-tax" },
  { id: "l03", prompt: "money transfer limits by provider", topic: "rules", target: "/guides/money-transfer-limits-by-provider-country" },
  { id: "l04", prompt: "do I need to declare money I send to family abroad?", topic: "rules" },
  { id: "l05", prompt: "what documents do I need to send money internationally?", topic: "rules" },
  { id: "l06", prompt: "how much money can I send to India per year?", topic: "rules" },
  { id: "l07", prompt: "what is an IBAN and do I need one?", topic: "rules", target: "/iban" },
  { id: "l08", prompt: "what is a SWIFT code used for?", topic: "rules", target: "/swift-codes" },
  { id: "l09", prompt: "why does my bank need a SWIFT code for an international transfer?", topic: "rules", target: "/swift-codes" },

  // ── Business and freelance ──────────────────────────────────────────────
  { id: "f01", prompt: "best app to receive international payments as a freelancer", topic: "business" },
  { id: "f02", prompt: "how do freelancers get paid from overseas clients?", topic: "business" },
  { id: "f03", prompt: "cheapest way to pay international contractors", topic: "business", target: "/guides/how-to-pay-international-freelancers-contractors" },
  { id: "f04", prompt: "best business account for international payments", topic: "business", target: "/business" },
  { id: "f05", prompt: "how to invoice a client in another currency", topic: "business" },
  { id: "f06", prompt: "best way for a small business to make international payments", topic: "business", target: "/business" },
  { id: "f07", prompt: "how do I avoid fees when getting paid in a foreign currency?", topic: "business" },

  // ── Timing ──────────────────────────────────────────────────────────────
  { id: "t01", prompt: "is today a good day to send money abroad?", topic: "timing", target: "/sendscore" },
  { id: "t02", prompt: "what is the best day of the week to send money internationally?", topic: "timing", target: "/guides/best-day-to-send-money-abroad" },
  { id: "t03", prompt: "are exchange rates better on weekdays or weekends?", topic: "timing", target: "/guides/best-day-to-send-money-abroad" },
  { id: "t04", prompt: "should I wait for a better exchange rate before sending money?", topic: "timing", target: "/sendscore" },
  { id: "t05", prompt: "how do I track exchange rates before making a transfer?", topic: "timing", target: "/exchange-rates" },
  { id: "t06", prompt: "what time of day are exchange rates best?", topic: "timing" },
  { id: "t07", prompt: "GBP to USD forecast 2026", topic: "timing", target: "/guides/gbp-forecast-2026" },

  // ── Added 2026-09-07 to bring the set to 100. Not baseline. ─────────────
  { id: "x01", prompt: "how much cheaper are money transfer apps than banks?", topic: "cost", target: "/guides/bank-vs-app-transfer-cost-2026" },
  { id: "x02", prompt: "does the amount I send change which provider is cheapest?", topic: "cost", target: "/transfer-cost-by-amount" },
  { id: "x03", prompt: "which international money transfer service is best overall in 2026?", topic: "comparison", target: "/compare" },
  { id: "x04", prompt: "how do money transfer comparison sites make money?", topic: "comparison", target: "/editorial-policy" },
  { id: "x05", prompt: "how long does Wise take to transfer money?", topic: "speed", target: "/companies/wise" },
  { id: "x06", prompt: "which is faster, Remitly or Western Union?", topic: "speed" },
  { id: "x07", prompt: "what happens if my recipient's bank details are wrong?", topic: "safety" },
  { id: "x08", prompt: "can a money transfer be cancelled once sent?", topic: "safety" },
  { id: "x09", prompt: "do I pay tax on money received from abroad?", topic: "rules" },
  { id: "x10", prompt: "best way to send money to family abroad every month", topic: "corridor" },
  { id: "x11", prompt: "how do digital nomads move money between countries?", topic: "business" },
];

/** Domains we compete with for these answers, checked in every response. */
export const COMPETITOR_DOMAINS = [
  "wise.com",
  "remitly.com",
  "monito.com",
  "exiap.com",
  "nerdwallet.com",
  "moneytransfercomparison.com",
  "finder.com",
  "investopedia.com",
  "forbes.com",
  "xe.com",
  "westernunion.com",
  "worldremit.com",
  "bankrate.com",
  "moneysavingexpert.com",
  "reddit.com",
] as const;

export const BASELINE_PROMPTS = BENCHMARK_PROMPTS.filter((p) => p.baseline);
