/**
 * The pages the Sep 2026 content brief named for rewriting, with the duplicate
 * share SiteLiner measured for each.
 *
 * WHY THIS IS A LIST AND NOT A JUDGEMENT CALL
 * The brief draws a line its two remedies fall on either side of, and the line
 * matters because the remedies are opposites:
 *
 *   §4  "do not merge these pages — each targets a different search query. The
 *        task is to make the content on pages with >=30% overlap unique."
 *   §10-A "For pages with no unique data available, do not generate them at all
 *        (404/410)."
 *
 * So a page on this list is one we have data for and must write better; a page
 * failing the generation threshold is one we have no data for and must stop
 * publishing. Without naming the first set explicitly, the threshold in
 * scripts/build-corridor-uniqueness.ts would retire send-money-to-india and
 * send-money-to-philippines — both of which the brief lists here, at 69% and
 * 72%, as pages to rewrite.
 *
 * Source: Appendix_Content_Links_sendmoneycompare_EN.xlsx, "Pages_to_Rewrite_30pct".
 * Acceptance test (§10-A step 7): each of these must measure under 30% duplicate
 * share — run `npm run check:duplication` after a build.
 */

/** Brief's action threshold: at or above this share, a page needs rewriting. */
export const REWRITE_THRESHOLD_PCT = 30;

/** [path, duplicate share SiteLiner measured] */
export const CONTENT_BRIEF_REWRITES: ReadonlyArray<readonly [string, number]> = [
  ["/compare/wise-vs-remitly", 79],
  ["/compare/remitly-vs-western-union", 78],
  ["/compare/paypal-vs-revolut", 76],
  ["/compare/wise-vs-paypal", 75],
  ["/compare/western-union-vs-moneygram", 74],
  ["/send-money/send-money-to-philippines", 72],
  ["/send-money/send-money-to-india", 69],
  ["/send-money/usa-to-philippines", 67],
  ["/send-money/usa-to-pakistan", 67],
  ["/send-money/send-money-to-pakistan", 67],
  ["/send-money/usa-to-india", 66],
  ["/companies/remitly", 60],
  ["/companies/ofx", 59],
  ["/banks/chase", 57],
  ["/iban/spain", 56],
  ["/companies/worldremit", 54],
  ["/companies/wise", 49],
  ["/iban/czechia", 47],
  ["/companies/instarem", 43],
  ["/banks/hsbc", 43],
  ["/companies/taptap-send", 42],
  ["/compare/wise-vs-worldremit", 42],
  ["/compare/ofx-vs-xe", 42],
  ["/iban/hungary", 41],
  ["/news/revolut-africa-14-corridors-airtel-mtn-orange-money-2026", 40],
  ["/companies/ace-money-transfer", 40],
  ["/companies/xoom", 38],
  ["/compare/ofx-vs-xoom", 38],
  ["/compare/wise-vs-western-union", 33],
  ["/guides/swift-codes-explained", 32],
  ["/companies/xe", 31],
  ["/swift-codes/mexico", 31],
  ["/compare/moneygram-vs-xoom", 31],
  ["/companies/western-union", 30],
  ["/companies/moneygram", 30],
  ["/guides/exchange-rate-markup-explained", 30],
  ["/send-money/uk-to-vietnam", 30],
];

export const CONTENT_BRIEF_REWRITE_PATHS: ReadonlySet<string> = new Set(
  CONTENT_BRIEF_REWRITES.map(([path]) => path),
);

/**
 * The corridor slugs among them. These are exempt from the generation threshold:
 * the brief tells us to rewrite these, which is the opposite of retiring them.
 */
export const CONTENT_BRIEF_REWRITE_CORRIDORS: ReadonlySet<string> = new Set(
  CONTENT_BRIEF_REWRITES.filter(([p]) => p.startsWith("/send-money/")).map(([p]) =>
    p.replace("/send-money/", ""),
  ),
);
