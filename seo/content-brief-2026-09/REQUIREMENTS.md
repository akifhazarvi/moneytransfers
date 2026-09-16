# Three-document implementation checklist

## What each file contributes

1. **Content_Links_Brief_sendmoneycompare_EN.docx** is the specification: rewrite named pages without merging them, restrict low-value generation, improve authorship/trust, review spam links, earn category backlinks, and measure results. Its section 10 contains the actionable acceptance list.
2. **Appendix_Content_Links_sendmoneycompare_EN.xlsx** is supporting inventory, not another technical brief. Its eight tabs contain summary metrics, 37 rewrite targets, 394 initial spam domains, 10 link-building categories, seven existing editorial-link records, 45 disavow corrections, 167 overlapping pages, and referring-domain totals.
3. **Disavow_sendmoneycompare_v2_EN.txt** is the proposed 439-domain exclusion list. It contains no code fixes or indexing directives. It matches the workbook and the versioned `disavow.txt` exactly; upload and necessity are separate questions.

The earlier `Technical_SEO_Brief_sendmoneycompare_EN.docx` mentioned by the consultant is not one of these three attachments and was not found in the searched Downloads/project files. Do not claim this checklist validates that missing specification.

## Detailed requirements and acceptance evidence

| ID / brief section | Required work | Current evidence and remaining work |
| --- | --- | --- |
| A1 / §10-A.1 | Export the 37 URLs at ≥30% overlap | Complete in `src/lib/content-brief-rewrites.ts`; original workbook preserved. |
| A2 / §10-A.2 | Identify repeated blocks on each page | Local shingle checker and `--blocks` report exist. Detailed review of each target's repeated sections remains part of editorial acceptance. |
| A3 / §4, §10-A.3 | Add unique rates, providers, timing, local details and worked examples | Source changes cover all 37 targets. Coverage alone does not prove all claims are correct or all required details appear on every page. Concurrent workspace changes correct the discovered Remitly limit; US-specific scope and other static claims still need review. |
| A4 / §10-A.4 | Remove repeated boilerplate; derive prose from page-specific evidence | Implemented in part, especially comparisons. All 37 targets remain above the local overlap threshold in the existing build. Do not add filler merely to change a percentage. |
| A5 / §10-A.5 | Do not merge targets or canonicalize them elsewhere | Existing build: all 37 have self-canonicals and one H1. None has meta noindex. No target is being retired by this follow-up. |
| A6 / §10-A.6 | Visible author, update date and sources | Detail templates received bylines and methodology links. Follow-up adds the existing editor's byline and a fixed editorial update date to `/send-money`. Provider-specific claims still require supporting citations and factual review. |
| A7 / §10-A.7 | Fresh SiteLiner crawl: every processed page below 30% | Partial — real Premium crawl obtained 2026-09-16 (`siteliner-fresh-2026-09-16.csv`, 540 pages, confirmed fresh via changed word counts/timestamps, not the earlier stale free-tier export). 9/37 targets pass; 28 remain above 30%, all measurably improved from baseline. Local diagnostic remains a separate, stricter measure — not a substitute, but no longer the only evidence. |
| A8 / §4, §10-A.8 | Generate only pages with useful unique data; otherwise 404/410, unlink and remove from sitemap | Currency-pair deduplication retires 419 candidate corridors; route-map, sitemap and middleware use the gone list. Local diagnostic still flags 18 pages under 50 unique words. Review usefulness and ranking data before retiring any more URLs. Word count alone is insufficient. |
| B1 / §5.1, §10-B | Review and upload disavow list | File format and 439-domain workbook match verified. No upload evidence. Google advises disavow only when artificial links caused or likely will cause a manual action; first review link history and any existing file. |
| B2 / §5.1, §10-B | Stop purchased links and audit vendors | External business task; no vendor/purchase evidence available. Do not assume the owner bought the links merely from domain names. |
| B3 / §5.2–5.3, §10-B | Earn 1–2 contextual quality links per category | Ten categories, so 10–20 placements are the brief's target. No newly earned links verified. Existing appendix entries do not demonstrate completion across categories. |
| C1 / §4, §5.4 | Methodology, editorial policy, source information and author profiles | Existing methodology/policy and author profiles are present. Verify biographical and first-hand experience claims with the named people; do not treat a byline alone as evidence of expertise. |
| C2 / §5.4 | Company name, address and phone on contact page; preferably map | Follow-up adds owner-supplied `370 W 12th Ave, Denver, CO 80204, United States` and a Google Maps link. No phone supplied. A map link is not a claimed verified Google Business Profile. |
| C3 / §5.4 | Different contact emails for inquiry types | General inquiries now use owner-supplied `info@sendmoneycompare.com`; existing correction, partnership and press contacts remain `akif@sendmoneycompare.com`. Further mailboxes require verified working addresses. |
| C4 / §5.4 | Author photos/social links and company social profiles | Author profile links exist, with a photo for the main editor. No new company social accounts or photos have been created/verified. |
| C5 / §6 | Consistent brand identity, genuine reviews and mentions | Ongoing external work; site links to Trustpilot, but no new review/mention evidence verified. |
| D1 / §10-D | Inspect processed URLs in GSC and request indexing for key pages | Open. Local GSC auth-status is unconfigured with no token/service account/client. No inspection or submission is claimed. |
| D2 / §8, §10-D | Track Google indexed/excluded pages | Open for post-deployment outcomes. Use a dated baseline and inspect Google's chosen canonical, crawl status and fetched content on the target pages. |
| D3 / §8, §10-D | Track SiteLiner overlap and Ahrefs link quality | Open. Reuse a consistent crawl configuration/corpus. Disavow does not remove links from Ahrefs or necessarily reduce its spam-domain count. |

## Link-building categories from the workbook

The target is 1–2 legitimate placements for each: `/send-money/`, `/compare/`, `/companies/`, `/guides/`, `/exchange-rates/`, `/iban/`, `/swift-codes/`, `/banks/`, `/business/`, and `/news/`.

The brief suggests journalist requests, finance publications, relevant resource pages, diaspora/community groups, university international-student offices, directories, PR, partnerships and competitor backlink analysis. These are prospecting ideas, not proof that a publication accepts guest posts or guarantees followed links. A competitor gap list was offered as an additional deliverable; it is not included in the three files. Outreach or negotiation has not been performed.

## What the attachments do not establish

- They identify plausible content/trust problems, not Google's definitive reason for excluding every page. Bing and Google have different indexes; Bing inclusion does not isolate Google's cause.
- The 30% rewrite threshold belongs to this consultant's acceptance specification. It is not a published Google indexing threshold. Google's scaled-content policy concerns manipulative, low-value content, not templating or a duplication percentage alone.
- The claim that every quality link targets the homepage is contradicted by all seven `Good_Backlinks` targets, which are internal pages. That tab omits referring-page URLs, so its named publishers cannot be independently verified from it.
- The spam arithmetic is 395 auto-flagged plus 44 later classifications = 439. The workbook stores 394 initial entries plus 45 corrections because one auto-flagged domain was initially omitted. Of 76 initially unflagged domains, only 32 remain classified as plausible after that QA, not 76.
- The brief first says technical causes are ruled out, but also acknowledges noindex/X-Robots-Tag issues in a separate brief. That is internally inconsistent. Check actual responses instead of treating the diagnosis as settled.
- Content and outreach can proceed alongside technical fixes. Do not defer a verified accidental noindex, crawler block or broken response while waiting for backlinks. Google requires accessible working pages with indexable content; even meeting those conditions does not guarantee inclusion.
- Neither “3–6 months” nor a reindex request is a guaranteed recovery timetable.

Sources: [Google technical requirements](https://developers.google.com/search/docs/essentials/technical), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [disavow guidance](https://support.google.com/webmasters/answer/2648487?hl=en), [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Current verification and next steps

Existing September 15 build: 907 English pages; all 534 submitted URLs pass the sitemap/robots/canonical check. All 37 targets are present, self-canonical, contain an H1 and have no meta noindex. This does not test production HTTP headers, Googlebot responses or Google's indexed copy.

Proceed with factual/editorial review and useful content improvements, preserving ranking URLs. After a fresh build and deployment, verify production status/headers/rendered content, run consistent SiteLiner checks, inspect priority URLs in GSC and record subsequent indexing changes. Track outreach separately. Keep disavow conditional on the actual link history and Google's criteria.
