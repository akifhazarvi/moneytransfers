# Homepage Restructure Plan

**File:** `src/app/[locale]/page.tsx`
**Date:** 2026-05-11
**Goal:** Cut homepage from 17 sections → 7 sections. Apple/Google-style hierarchy. Funnel users to one action; let `/send-money`, `/companies`, `/exchange-rates` carry the long-tail link surface.

---

## Why

The current homepage tries to be a sitemap:
- 17 distinct sections stacked vertically
- 36 destination pills across 7 region groups
- 4 "Coming soon" cards (3 of 4 in Travel section) — credibility hit
- 4-column "Explore More" link farm at the bottom that duplicates the footer
- Two adjacent provider sections (Best Providers + Best by Need) doing similar jobs
- Rate Trends chart and Live Example widget that have natural homes on `/exchange-rates` and inside Best Routes respectively

Apple/Google/Wise homepages run **5–7 sections max**. The homepage's job is one action (start a comparison), not breadth. Internal-link breadth lives in the footer + dedicated hub pages.

---

## Before → After (top-down)

| # | Current section | Decision | New home |
|---|---|---|---|
| 1 | Hero + ComparisonWidget | **Keep** | — |
| 2 | Best Provider by Corridor (3 cards) | **Keep + absorb Live Example** | Same slot |
| 3 | Live Rates strip (6 corridors) | **Keep** | Same slot |
| 4 | Rate Trends widget | **Move out** | `/exchange-rates` |
| 5 | Trust strip (4 chips + Trustpilot) | **Keep, compress** | Same slot, inline row |
| 6 | How It Works (3 steps) | **Keep** | Same slot |
| 7 | Best Providers (5 cards) | **Merge with #8** | Combined Section |
| 8 | Best by Need (6 use-case cards) | **Merge with #7 as tabs** | Combined Section |
| 9 | Send Money to Destinations (36 pills, 7 regions) | **Trim to 8** | Full grid moves to `/send-money` |
| 10 | Travel + eSIM (1 real + 3 "Coming soon") | **Hide entirely until ≥3 real guides** | Removed from homepage |
| 11 | Live Example ($1,000 USD→PKR) | **Fold into #2** | Best Routes section |
| 12 | Video (YouTube Shorts) | **Move into FAQ** | Embedded in FAQ answer |
| 13 | FAQ (8 questions, first 3 open) | **Keep, collapse all by default** | Same slot |
| 14 | News ticker | **Keep, lazy-load** | Same slot |
| 15 | Why Trust Us (4 cards) | **Compress to 1 row of inline items** | Folded into trust strip area |
| 16 | Explore More link farm (4 columns, ~20 links) | **Remove entirely** | Already in footer |
| 17 | MobileScrollNav (6 anchors) | **Update to 4 anchors** | Match new sections |

**Net:** 17 → 7 sections.

---

## New homepage structure (target)

1. **Hero + ComparisonWidget** — single primary CTA, unchanged
2. **Best Provider by Corridor** — 3 corridor cards, with the $1,000 example folded in as a featured "Today's best" card
3. **Live Rates strip** — 6 corridors, thin band
4. **Trust strip** — compressed: 4 chips + Trustpilot, single row on desktop, horizontal scroll on mobile (already exists, just remove the standalone "Why Trust Us" 4-card section and inline its strongest claim here)
5. **How It Works** — 3 steps, unchanged
6. **Best Providers** (merged) — segmented control: *Top Providers* (5 cards) / *By Use Case* (6 badges). Default to Top Providers.
7. **Popular Destinations** — top 8 pills + "See all 64 destinations →"
8. **FAQ** — 8 questions, all collapsed by default. YouTube Short embedded inside the answer for "Which provider is cheapest?"
9. **News ticker** — lazy-loaded as before

`MobileScrollNav` becomes: `Best Routes`, `Providers`, `Destinations`, `FAQ`.

---

## "Top 8 Destinations" — data-driven pick

Based on GSC May 4 snapshot (`memory/project_gsc_may4_2026.md`) + corridor GA4 landing pages, prioritize destinations with measured demand:

1. **India** 🇮🇳 — largest remittance corridor globally; existing /send-money/usa-to-india ranks
2. **Pakistan** 🇵🇰 — diaspora signal in Week 4 plan; UK→Pakistan flagged
3. **Philippines** 🇵🇭 — /guides/send-money-to-philippines-guide is #4 GA4 landing
4. **Mexico** 🇲🇽 — top 5 global corridor by volume
5. **Nigeria** 🇳🇬 — strong remittance corridor
6. **UK** 🇬🇧 — both inbound and outbound demand
7. **UAE** 🇦🇪 — diaspora corridor + IBAN signal
8. **Europe** 🇪🇺 — catch-all EUR destination

Cut from homepage (but kept in `/send-money` hub): Bangladesh, Nepal, Sri Lanka, Vietnam, Indonesia, Thailand, Malaysia, Brazil, Colombia, Guatemala, Dominican Republic, Kenya, Ghana, South Africa, Egypt, Morocco, Germany, France, Spain, Turkey, Australia, Canada, New Zealand, South Korea, China.

---

## SEO impact — links leaving the homepage

Internal links that will no longer be on `/` after this change. I'm flagging this because GSC has shown that homepage internal-linking moves needles (per `project_gsc_march29_learnings.md`).

**Lost from homepage:**
- 28 destination pill links (kept in footer + `/send-money` hub)
- Rate Trends widget links to historical corridors (kept on `/exchange-rates`)
- Travel hub link (kept in nav + footer)
- "Explore More" link farm: ~18 links (all duplicated in site footer — no net loss)
- Why Trust Us section (no outbound links lost; only marketing copy)

**Retained on homepage:**
- 3 Best Route corridors (with provider deep-links)
- 6 Live Rate corridor links
- 8 destination pills + "See all" → `/send-money`
- 5 provider cards → `/companies/[slug]`
- 3 comparison links inside FAQ answers (if present)

**Mitigation:** Verify footer covers everything we drop. If footer is missing region clusters (e.g. South Asia), add them before shipping.

---

## Implementation order (when you approve)

1. **Trim Destinations to 8** — least risky, biggest visual win. One edit to the data array in `page.tsx`.
2. **Hide Travel + eSIM section** — wrap in a feature flag or just comment out. Restore when ≥3 guides exist.
3. **Remove Explore More link farm** — verify footer parity first.
4. **Move Rate Trends widget** to `/exchange-rates` page. Delete `<LazyHistoricalRateWidget>` from `page.tsx`.
5. **Fold Live Example into Best Routes** — add the $1,000 USD→PKR card as a 4th featured route.
6. **Merge Best Providers + Best by Need** — needs a small client component for the segmented tabs. ~30 lines.
7. **Move Video into FAQ** — embed the YouTube Short inside the "Which provider is cheapest?" answer details.
8. **Compress Why Trust Us** — inline strongest claim into existing trust strip; delete the 4-card section.
9. **Update MobileScrollNav anchors** to match new section IDs.
10. **Verify build + lint + Lighthouse score** before pushing.

---

## SEO safety — pre-flight checks (blocking before any edit)

Each of these must pass before we cut a link from the homepage. If any fail, fix the source (footer / hub page) **first**, then proceed with the cut.

1. **No orphans.** For every internal link we remove from `/`, confirm the target page is linked from at least one of: site footer, `/send-money` hub, `/companies` hub, `/exchange-rates`, or relevant guide. Run `grep -r "send-money-to-thailand" src/` style checks for each removed destination/comparison.
2. **Footer parity.** Verify the footer contains link coverage for every region cluster we're cutting from the homepage (South Asia, SE Asia, LatAm, Africa, Europe+ME). If a cluster is missing, **add to footer first**.
3. **Sitemap still includes the targets.** Confirm every cut-link target is in `app/sitemap.ts` output (post-May 8 dedindex cleanup brought it to 405 URLs). Pages mid-reindex should keep homepage exposure.
4. **Schema preservation.** FAQPage, VideoObject, WebPage, BreadcrumbList JSON-LD blocks all stay in place. Even if the video moves into the FAQ answer visually, its schema URL is unchanged. Verify after edit.
5. **E-E-A-T copy retained, not deleted.** "Why Trust Us" cards become a 2x2 compact grid in the trust strip area — copy stays in the DOM for AI Overviews / Dec 2025 E-E-A-T extension.
6. **No canonical/hreflang touches.** Plan does not modify `getAlternates`, canonical URLs, or locale routing.
7. **CWV.** Run Lighthouse before/after on `/`. Target: LCP delta ≤ +200ms, CLS unchanged, no new render-blocking JS. Merged providers section default-renders server-side.

## Risks

- **Long-tail SEO**: removing destinations and Explore links from `/` may reduce internal PageRank flow to those pages. Footer covers most; the Send Money hub at `/send-money` is the canonical entry point for the full grid. Mitigation = pre-flight checks above.
- **News + Video relocation**: Mar 29 learnings showed news CTR didn't work, so demoting/relocating these is consistent with data.
- **Merged providers section**: needs a client component for tab switching. Adds <2KB JS; default tab renders server-side so no LCP regression.
- **Why Trust Us compression**: copy currently fills space — the inlined 2x2 version preserves all claims so E-E-A-T / AI Overview passage citability is intact.
- **May 8 deindex recovery**: pages currently re-indexing benefit from homepage links. Pre-flight check #3 catches this — we don't cut links to targets still rebuilding indexability.

---

## Decisions (locked 2026-05-11)

- **No A/B.** Ship to main directly.
- **Merged Providers = stacked sub-sections, no tabs.** Reasoning: both groups are short (5 + 6 cards), zero JS keeps LCP safe and avoids hydration risk, AI Overviews / crawlers see both passages above the fold instead of one hidden behind a tab.
- **Travel section → single link inside FAQ.** Remove the 4-card grid; add a one-line link ("Travelling? See our country guides →") inside an FAQ answer until ≥3 real guides exist.
