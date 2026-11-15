import type { BlogPost } from "./blog-posts";

/**
 * Answers to assistant prompts our AI-citation benchmark found no page of ours
 * answering, added to the FAQ of the guide that should own them (so they also
 * get the guide's FAQPage markup). Kept apart from the guide files so the set
 * can be reviewed against src/data/ai-prompt-benchmark.ts in one place.
 *
 * 2026-11-15, from the Nov 9 Perplexity run: most uncited prompts already HAD
 * a direct FAQ answer on the right guide ("Why is my international transfer
 * taking so long?", "Is money sent to Pakistan taxable?", every corridor's
 * "cheapest way"), so those gaps are citation, not content. Only the prompts
 * below had no answer anywhere. Don't add an answer a guide already gives.
 *
 * Rules as for any guide copy: figures are tokens (renderDataTokens runs over
 * faq.answer), no unmeasured superlative, no delivery time we did not time.
 */
export const GUIDE_PROMPT_ANSWERS: Record<string, NonNullable<BlogPost["faqs"]>> = {
  "swift-codes-explained": [
    {
      question: "What is a SWIFT code used for?",
      answer:
        "A SWIFT code, also called a BIC, identifies a bank in an international payment. It has 8 or 11 characters: four for the bank, two for the country, two for the location and an optional three for a branch (the ISO 9362 standard). When a payment travels over the SWIFT network, the code tells each bank in the chain where to send it. It identifies the bank, not the account: the recipient's account number or IBAN does that.",
    },
    {
      question: "Why does my bank need a SWIFT code for an international transfer?",
      answer:
        "Most banks send international payments over the SWIFT network, where the code addresses the payment to the recipient's bank, sometimes through one or more intermediary banks along the way. Without it the payment cannot be routed. Euro payments within the SEPA area need only the recipient's IBAN, and app-based providers that pay out through local bank networks often ask for local details instead of a SWIFT code.",
    },
  ],
  "iban-numbers-explained": [
    {
      question: "What is an IBAN and do I need one?",
      answer:
        "An IBAN (International Bank Account Number) identifies one bank account for cross-border payments: a two-letter country code, two check digits, then the domestic account details. {{IBAN_COUNTRY_COUNT}} countries use them, with lengths {{IBAN_LENGTH_RANGE}}. You need the recipient's IBAN to send to a country that uses them, including most of Europe, the UAE, Saudi Arabia and Pakistan. The US, Canada, Australia and India do not use IBANs: there you give an account number with a routing, transit, BSB or IFSC code.",
    },
  ],
  "fastest-way-to-send-money-internationally": [
    {
      question: "How long does an international bank transfer take?",
      answer:
        "It depends on the path the payment takes. A bank wire over the SWIFT network passes from your bank, sometimes through intermediary banks, to the recipient's bank, and each has its own cut-off times, so weekends and public holidays in either country add days. Euro payments between eurozone banks offering SEPA Instant must arrive within 10 seconds under EU rules (Regulation (EU) 2024/886). App-based providers pay out through local bank networks or mobile wallets instead of a chain of banks; our timed test transfers above show how long specific transfers took.",
    },
  ],
  "wise-vs-remitly-comparison": [
    {
      question: "Is Remitly or Wise better for regular monthly transfers?",
      answer:
        "For a regular transfer the answer can change from one month to the next, so compare before each one. On $1,000 from the US to India today, {{CHEAPER:wise:remitly:USD:INR:1000}} delivers {{RECEIVE_DIFF:wise:remitly:USD:INR:1000}} more than {{PRICIER:wise:remitly:USD:INR:1000}} (quotes of {{QUOTE_DATE}}). The most frequent leader on that route was {{CORRIDOR_LEADER:USD:INR}}. Across all corridors, today's top payout comes from someone other than the route's usual leader on {{ROTATION_RATE}} of them.",
    },
  ],
};

/** A guide's FAQs plus any prompt answers it owns, skipping a question it already asks. */
export function withPromptAnswers(slug: string, faqs: BlogPost["faqs"]): BlogPost["faqs"] {
  const extra = GUIDE_PROMPT_ANSWERS[slug];
  if (!extra) return faqs;
  const asked = new Set((faqs ?? []).map((f) => f.question.trim().toLowerCase()));
  return [...(faqs ?? []), ...extra.filter((f) => !asked.has(f.question.trim().toLowerCase()))];
}
