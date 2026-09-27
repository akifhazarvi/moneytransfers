/**
 * Page-specific wording for the headings a template repeats.
 *
 * WHY
 * An H2 printed identically on every page of a template ("Frequently Asked
 * Questions" on 117 guides, "Sources & Methodology" on 81, "Key Features" on
 * 49 provider profiles) is the template speaking, not the page. The 2026-09-27
 * audit counted sixteen such headings on 10+ indexable pages each; duplicate
 * checkers and search engines weight headings above body text, so each one
 * made every page it sat on look more like the others. `check:headings`
 * (postbuild) now fails the build on any H2 shared by 10+ indexable pages.
 *
 * The fix is the page's own subject in the heading, not a synonym rotation:
 * "Sending money to Kenya: questions answered" says which page this is. The
 * subject must not itself be text other pages print (see GUIDE_TOPICS).
 */

const MONTH_YEAR = /\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+20\d\d\b/gi;
const YEAR = /\s+(?:in\s+)?20\d\d(?:[–-]20\d\d)?\b/g;

/**
 * The subject of a guide, from its headline: the first clause, without the
 * year, the trailing parenthetical or the question mark.
 *
 *   "Send Money to Nigeria 2026: Best Rates from USA, UK…" → "Send Money to Nigeria"
 *   "Ramadan 2026 Money Transfer Deals: Fee Waivers…"      → "Ramadan Money Transfer Deals"
 *   "Are Wire Transfers Safe? What Scammers Don't…"        → "Are Wire Transfers Safe"
 */
export function guideSubject(title: string): string {
  let t = title.replace(/\s*\([^)]*\)\s*$/, "");
  t = t.split(/:\s| — | – | \| /)[0];
  const [question] = t.split(/\?\s/);
  if (question !== t && question.split(/\s+/).length >= 3) t = question;
  return t.replace(MONTH_YEAR, "").replace(YEAR, "").replace(/\?\s*$/, "").replace(/\s{2,}/g, " ").trim();
}

/**
 * A short topic for guides whose headline makes a poor heading subject — the
 * way `metaTitle` overrides a poor <title>. Two cases, both measured on the
 * 2026-09-27 build (8-word shingles, the site's duplication proxy):
 *   - a first clause of 7+ words is the guide's title as printed on /guides and
 *     in every related-guides list, so a heading repeating it duplicated that
 *     text (the /guides hub rose 29.4% → 30.7%);
 *   - sibling guides whose clauses end alike ("Fastest / Cheapest Way to Send
 *     Money Internationally") shared the heading with each other.
 * Keep a topic to six words or fewer, readable on its own, and ending on a word
 * its siblings do not end on.
 */
export const GUIDE_TOPICS: Record<string, string> = {
  "remittance-cost-transparency-study": "Transfer cost transparency",
  "receive-international-payments-freelancer": "Freelancer payment apps",
  "wise-vs-remitly-vs-xoom-vs-xe": "Wise, Remitly, Xoom and XE",
  "best-apps-send-money-uk-to-nigeria-2026": "UK to Nigeria apps",
  "compare-exchange-rates-multiple-currencies": "Multi-currency rate comparison",
  "currency-converter-vs-bank-app-travel": "Converter or bank app",
  "how-to-send-money-to-india-2026": "Sending money to India",
  "send-money-to-india-guide": "India transfer options",
  "wire-transfer-guide": "Wire transfer fees",
  "send-money-to-pakistan-guide": "Sending money to Pakistan",
  "send-money-to-mexico-guide": "Sending money to Mexico",
  "send-money-to-nigeria-guide": "Sending money to Nigeria",
  "send-money-to-india-cash-pickup-ria": "Ria cash pickup in India",
  "invoicing-international-clients-multiple-currencies": "Multi-currency invoicing",
  "lowest-fx-fees-business-payments-2026": "Business FX fees",
  "best-money-transfer-rates-eid-holi-2026": "Eid and Holi transfers",
  "best-money-transfer-apps-large-transfers": "Apps for large amounts",
  "hidden-fees-international-transfers": "Hidden transfer fees",
  "stablecoin-international-transfers-guide": "Sending money with stablecoins",
  "send-money-to-nepal-guide": "Sending money to Nepal",
  "send-money-to-morocco-guide": "Sending money to Morocco",
  "send-money-to-romania-guide": "Sending money to Romania",
  "send-money-to-kenya-guide": "Sending money to Kenya",
  "send-money-to-south-africa-guide": "Sending money to South Africa",
  "send-money-to-colombia-guide": "Sending money to Colombia",
  "send-money-to-poland-guide": "Sending money to Poland",
  "send-money-to-china-guide": "US to China transfers",
  "authorization-vs-settlement-stablecoins": "Authorization vs settlement",
  "best-money-transfer-apps-expats-2026": "Transfer apps for expats",
  "send-money-to-spain-guide": "Sending money to Spain",
  "send-money-to-uk-guide": "Sending money to the UK",
  "send-money-to-south-korea-guide": "Sending money to South Korea",
  "send-money-to-australia-guide": "Sending money to Australia",
  "send-money-to-ethiopia-guide": "Sending money to Ethiopia",
  "pakistan-remittance-loss-2026": "Pakistan's remittance losses",
  "taptap-send-vs-wise-remitly-usd-to-pkr": "USD to PKR providers",
  "how-to-send-money-from-china": "Sending CNY abroad",
  "best-money-transfer-apps-china-yuan": "CNY transfer apps",
  "how-to-buy-spacex-nvidia-stock-using-revolut": "SpaceX and Nvidia on Revolut",
  "monito-alternatives": "Monito alternatives",
  "remitly-performance-to-send-money-internationally": "Remitly's six-month record",
  "fastest-way-to-send-money-internationally": "International transfer speed",
  "cheapest-way-to-send-money-internationally": "International transfer cost",
  "how-to-send-money-abroad": "Ways to send money abroad",
  // Six words, but the /guides hub prints these titles right after text the
  // guide's own heading follows — "…to India" + "Send Money from UAE to Pakistan".
  "send-money-uae-to-pakistan-guide": "UAE to Pakistan transfers",
  "business-money-transfers-provider-review": "Business transfer providers",
};

/** The subject a guide's section headings use: its topic, else its headline's first clause. */
const subjectOf = (title: string, slug?: string) => (slug && GUIDE_TOPICS[slug]) || guideSubject(title);

/** An article's FAQ heading. Not "{subject}: your questions" — the compare template uses that. */
export const faqHeading = (title: string, slug?: string) => `${subjectOf(title, slug)}: questions answered`;
export const stepsHeading = (title: string, slug?: string) => `${subjectOf(title, slug)}: step by step`;

/**
 * Section headings the post data repeats across a family of guides — "Sources
 * & Methodology" (81 guides), "Payment Methods Compared" (the 11 business-
 * payment guides) — prefixed with the guide's subject when rendered. Anchors
 * are still slugified from the stored heading, so existing #links hold.
 */
const REPEATED_SECTION_HEADINGS: [RegExp, string][] = [
  [/^sources\b/i, "sources and method"],
  [/^payment methods compared$/i, "payment methods compared"],
];
export function sectionHeading(heading: string, title: string, slug?: string): string {
  const hit = REPEATED_SECTION_HEADINGS.find(([re]) => re.test(heading.trim()));
  return hit ? `${subjectOf(title, slug)}: ${hit[1]}` : heading;
}
