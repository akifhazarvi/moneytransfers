# Content and backlinks implementation validation

Verdict: substantial implementation exists, but the three-document brief is not complete and should not be signed off.

## Follow-up changes after the initial audit

The initial findings below are retained as the audit baseline. The follow-up
has now:

- Fixed the standalone duplication checker so missing targets and target pages
  at/above 30% local overlap cannot report success. The passing denominator
  always includes all 37 targets. Four regression tests pass, including a
  high-overlap fixture that the old exit condition would incorrectly accept.
- Clarified that this is a local heuristic, not SiteLiner or a Google threshold.
  The current diagnostic still fails: 37 targets over the local threshold and
  18 pages under 50 unique words. This is an honest remaining failure, not a
  claimed content fix.
- Added the owner-supplied Denver address and a map link to the contact page,
  and `info@sendmoneycompare.com` for general inquiries. Existing specialist
  inquiry contacts remain. No telephone number was supplied.
- Added the existing editor's byline, editorial date and methodology link to
  the send-money category page.
- Created the detailed [requirement checklist](../seo/content-brief-2026-09/REQUIREMENTS.md)
  and corrected stale completion/disavow guidance in the brief README.
- Confirmed that the existing build's 534 submitted URLs pass the indexing
  invariants. All 37 targets have self-canonicals, one H1, and no meta noindex.
- Checked local GSC configuration: unconfigured, with no available token,
  OAuth client or service account. No authenticated inspections were performed.

TypeScript passes after the follow-up changes. Concurrent workspace changes
also correct the Remitly limit in provider data and editorial copy; these were
observed, not authored by this audit. Broader factual review, including the
US-specific scope of that limit, remains open. A concurrent build appeared,
but its rendered contact/category HTML does not yet include this follow-up's
changes. These source changes are not claimed as built or deployed.

## Scope and evidence

Reviewed the DOCX brief, XLSX appendix and disavow TXT in Downloads. All three are byte-identical to the copies in `seo/content-brief-2026-09/`. Reviewed implementation commits through `65e959fd3`, source wiring, and existing rendered English HTML. No application code was changed, no outreach sent and no disavow uploaded.

The existing build completed around September 15 at 21:34 local time, before the final 21:35 news correction commit. Results describe that build, not a fresh build of HEAD or a confirmed production deployment. External GSC, Ahrefs and SiteLiner account state was not verified.

## Completion matrix

| Requirement | Finding |
| --- | --- |
| Export 37 target URLs | Complete: `src/lib/content-brief-rewrites.ts` matches the appendix list. |
| Add individual editorial content | Implemented in source across all 37 targets: 10 comparisons, 11 companies, 7 corridors, 2 banks, 3 IBAN pages, 1 SWIFT page, 2 guides, 1 news article. This establishes coverage, not editorial accuracy or acceptance. |
| Each target below 30% SiteLiner overlap | Not demonstrated. No fresh SiteLiner evidence found. The local checker reports 0/37 below 30%. |
| Generation threshold | Implemented for corridor currency-pair duplication; generated inventory retires 419 of 845 candidate corridors. Wired into gone-corridor handling, middleware HTTP 410, route-map and sitemap exclusions. Its local content check still identifies 18 rendered pages with fewer than 50 unique words. |
| Author/date/source visibility | Added to multiple detail templates. Broader section 5.4 work remains incomplete: the contact page has no address, phone or map, and all four inquiry types use the same email. The send-money category page lacks a named author. Author profiles/social links already exist. |
| Disavow file | Validated: 439 unique domain entries, valid basic syntax, exact match to 394 spam-tab rows plus 45 QA-tab rows. This validates format and consistency, not the classification of every domain. |
| Disavow upload and vendor audit | No completion evidence. Repository README explicitly leaves upload open. Need vendor/purchased-link history before deciding whether disavow is appropriate. |
| Earn 1–2 quality links in each of 10 categories | No evidence of completion; README leaves outreach open. |
| GSC inspections/indexing requests and KPI tracking | No post-implementation evidence found for this brief. |

## Findings requiring follow-up

1. **Acceptance is unmet on available evidence.** The local scan covers 907 English pages: 55% aggregate duplication, 812 pages at or above 30%, and 18 below 50 unique words. All 37 target pages are above 30%; examples are Wise vs Remitly 57.9%, USA to India 83.1%, Wise review 48.8%, and SWIFT codes explained 38.6%. This checker uses 10-word matching across a different corpus from SiteLiner. Its percentages must not be treated as a before/after SiteLiner comparison or a Google penalty threshold. Obtain a consistent fresh crawl to test the brief's actual acceptance criterion.

2. **The check does not enforce its advertised acceptance rule.** `scripts/check-duplication.ts:243` only exits unsuccessfully for pages under 50 unique words. It does not fail for target pages above 30% or missing targets. `package.json` does not include this check in prebuild/postbuild. A successful build therefore cannot establish completion of the rewrite brief.

3. **New editorial claims still need fact checking.** `src/data/compare-editorial.ts:64` and `:136` state a $10,000 Remitly ceiling. Remitly's current US limits page advertises up to $300,000, with account, destination and delivery restrictions. This directly affects the comparisons' advice about large transfers. Source: https://www.remitly.com/us/en/landing/send-limits . Other static limits, coverage counts and pricing claims need the same editorial review; tokenized examples alone do not validate surrounding prose.

4. **E-E-A-T task coverage is partial.** See contact/category gaps above. Do not invent a business address, phone number, credentials or reviews to satisfy a checklist; use verified business details.

5. **Completion documentation is stale.** `seo/content-brief-2026-09/README.md:50` still describes all 37 rewrites as outstanding despite subsequent editorial commits. Update it to distinguish content implemented, accuracy reviewed, acceptance passed, deployed and external tasks verified.

## Problems in the supplied recommendations

- The brief claims all quality backlinks point to the homepage. The appendix's seven Good_Backlinks rows all target internal URLs, including company, guide and news pages. The exported tab contains DR, spam flag, type and target URL, but not referring URLs; it cannot independently substantiate the seven named publications.
- The appendix reconciles the domain totals as 471 total, 395 auto-flagged, 76 not auto-flagged, of which 44 were later classified as lookalikes and 32 as plausible. Calling all 76 genuine after QA is misleading. The 439-domain file itself reconciles correctly: 394 original rows plus 45 corrections, including one missed auto-flagged domain.
- Uploading a disavow is not automatically required because a tool labels links spam. Google recommends it when substantial artificial links have caused, or are likely to cause, a manual action; most sites do not need it. The brief reports no manual action and supplies no verified purchase history. Use the separate disavow tool with a URL-prefix property; Domain properties are unsupported. Disavow does not remove links or make them disappear from reports. Source: https://support.google.com/webmasters/answer/2648487?hl=en .
- A duplication percentage does not establish Google's reason for excluding a URL. Google's scaled-content policy concerns large-scale unoriginal content created primarily to manipulate rankings and provide little value; it does not define a 30% threshold. Source: https://developers.google.com/search/docs/essentials/spam-policies#scaled-content-abuse .

## Validation performed

- `tsc --noEmit --incremental false`: passed.
- Normal `npm run check:duplication`: unable to start the TypeScript runner because tsx was absent locally and npm DNS/network access failed.
- Executed the same checker after transpiling it and its constant-list dependency with the already installed TypeScript compiler to temporary CommonJS files. No metric logic changed. Checker exited 1 for the 18 low-uniqueness pages and generated `duplication-report.json` (gitignored).
- No fresh full build, production-wide crawl or authenticated external-account audit was performed. Those remain necessary before claiming deployment or SEO outcome verification.

Recommended next steps: correct inaccurate editorial claims; finish verified business/contact details; fix the acceptance checker and rerun a fresh build plus consistent SiteLiner crawl; record deployment and GSC inspections; document outreach/vendor review and make a separate evidence-based disavow decision.
