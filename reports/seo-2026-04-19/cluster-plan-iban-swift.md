# IBAN + SWIFT Cluster Plan

Generated 2026-04-19 · claude-seo v1.9.0 `seo-cluster` methodology · GSC 28d window (Mar 20 – Apr 17)

## TL;DR

The IBAN and SWIFT clusters together pulled **1,500+ impressions and ZERO clicks** over 28 days. The architecture is already in place (pillars + ~80 country spokes + 2 explainer guides + 3 locales). The blockers are: (a) a broken i18n key rendering `iban.heading` as H1 on the pillar, (b) no CTR-optimized meta overrides on 79/80 spokes, and (c) weak pillar-to-spoke interlinking. This is a CTR problem, not a content problem.

## Scope

**Seed:** `iban`. Expanded via GSC co-occurrence → discovered IBAN and SWIFT share the same search experience (both have per-country lookup intent, both are adjacent to money-transfer decisions). Merged into one cluster with two pillars.

## Pillars (exist, need fixes)

| Page | 28d impr | pos | Status |
|---|---|---|---|
| `/iban` | 23 | 79.7 | ⚠️  **BROKEN** — H1 is literal `"iban.heading"` (missing i18n key) |
| `/swift-codes` | n/a* | — | Needs meta audit (not surfaced individually in GSC top rows) |

*SWIFT pillar not appearing in GSC by-page data suggests it's being outranked — spokes are the only things surfacing.

## Spokes — IBAN (35 country pages ranking)

Tiered by 28d GSC impressions and current CTR miss (pos ≤10, zero clicks).

### Tier A — Striking distance, zero clicks (priority)

| Page | impr | pos | Action |
|---|---|---|---|
| `/iban/france` | 86 | 3.7 | Apply germany-style meta override |
| `/iban/spain` | 65 | 6.2 | Apply germany-style meta override |
| `/iban/austria` | 59 | 4.7 | Apply germany-style meta override |
| `/iban/poland` | 57 | 9.1 | Apply germany-style meta override |
| `/iban/turkey` | 54 | 4.8 | Apply germany-style meta override |
| `/iban/united-arab-emirates` | 52 | 54.1 | Expand content + meta override (weaker position — needs depth) |
| `/iban/israel` | 49 | 5.1 | Apply germany-style meta override |
| `/iban/egypt` | 46 | 4.8 | Apply germany-style meta override |
| `/iban/brazil` | 36 | 5.1 | Apply germany-style meta override |
| `/iban/czechia` | 36 | 5.4 | Apply germany-style meta override |
| `/iban/portugal` | 36 | 37.4 | Content expansion + meta override |
| `/iban/greece` | 35 | 12.5 | Meta override + content depth |
| `/iban/ukraine` | 34 | 5.6 | Apply germany-style meta override |
| `/iban/pakistan` | 25 | 5.8 | Apply germany-style meta override |
| `/iban/sweden` | 24 | 8.5 | Apply germany-style meta override |
| `/iban/hungary` | 23 | 19.2 | Content expansion + meta override |
| `/iban/germany` | 97 | 4.1 | ✅ DONE (commit 05cfac7) — measure CTR delta next pull |

### Tier B — Middle positions, need work

`/iban/ireland` (47 impr, pos 49.8), `/iban/lithuania` (17, pos 47.6), `/iban/norway` (18, pos 10.4), `/iban/cyprus` (10, pos 50.7), `/iban/finland` (19, pos 3.8). Content likely thinner — check BBAN breakdown, bank list, SEPA membership.

### Tier C — Long tail, no action

~15 remaining country pages <10 impr. Ignore for now; they'll cluster naturally once the pillar is fixed.

## Spokes — SWIFT (45 country pages ranking)

Same pattern. Top ranked spokes (pos ≤5, zero clicks):

| Page | impr | pos |
|---|---|---|
| `/swift-codes/mexico` | 48 | 2.9 |
| `/swift-codes/australia` | 41 | 9.5 |
| `/swift-codes/morocco` | 16 | 4.2 |
| `/swift-codes/philippines` | 13 | 4.2 |
| `/swift-codes/czech-republic` | 10 | 4.4 |
| `/swift-codes/italy` | 10 | 9.2 |
| `/swift-codes/thailand` | 16 | 8.3 |
| `/swift-codes/egypt` | 6 | 4.7 |

**Action:** Identical treatment — meta override template using per-country BIC examples, bank count, and SWIFT network specifics.

## Supporting Content (exists, underutilized)

| Page | impr | pos | Action |
|---|---|---|---|
| `/guides/iban-numbers-explained` | 63 | 58.2 | Needs promotion via internal links from pillar + top 10 spokes; content expansion to compete at pos 1–10 |
| `/guides/swift-codes-explained` | 11 | 52.5 | Same as above |

## Content Gaps (create)

1. **`/guides/iban-vs-swift`** (new) — comparison page. No current ranking for "iban vs swift", "iban or swift", "difference between iban and swift" queries (these are appearing in the 114 BIC/SWIFT bucket). High CTR potential as an answer-intent page.
2. **`/iban/format`** or **in-pillar section** — "iban format" at pos 76, "format iban" at pos 64. Pillar should host a canonical format-by-country table ranking for this.
3. **`/iban/validator`** or pillar anchor — "iban checker uae" pos 70, "iban number" pos 51. The validator widget exists on `/iban`, but pos 80 means title/schema doesn't signal it.

## Internal Link Matrix

Mandatory edges (currently weak/missing):

| From | To | Anchor | Type |
|---|---|---|---|
| `/iban` | each spoke | `"{country} IBAN format"` | mandatory |
| each spoke | `/iban` | `"IBAN lookup for 89+ countries"` | mandatory |
| each spoke | `/guides/iban-numbers-explained` | `"how IBAN numbers work"` | recommended |
| each spoke | corresponding `/swift-codes/{country}` | `"{country} SWIFT/BIC codes"` | cross-cluster |
| `/swift-codes` | `/iban` | `"IBAN format by country"` | pillar-to-pillar |
| `/iban` | `/guides/iban-vs-swift` (new) | `"IBAN vs SWIFT — which do I need?"` | pillar-to-guide |

Target: every spoke should have ≥3 inbound internal links.

## Cross-Locale

ES/FR/PT duplicates exist and rank (e.g. `/fr/iban/switzerland` at 123 impr pos 3.4). These inherit the same issues — i18n keys, no meta overrides. Fix in English first, then template.

## Cluster Scorecard Targets (measure in next GSC pull)

| Metric | Current | Target (4 weeks) |
|---|---|---|
| IBAN+SWIFT total clicks | 1 | 25+ |
| `/iban` pillar pos | 79.7 | ≤30 |
| Top-5 spoke avg CTR | 0.00% | 3%+ |
| Pillar→spoke links per spoke | ~1 | 3+ |
| Spokes with CTR-optimized meta | 1/80 | 20/80 |

## Execution Order (next 2 weeks)

1. **Day 0** — Fix `iban.heading` / `iban.subheading` missing i18n keys in all 4 locales (30 min, blocks everything downstream)
2. **Day 1** — Apply germany-style meta override template to Tier A IBAN spokes (16 pages × 10 min)
3. **Day 2** — Same for top 8 SWIFT spokes
4. **Day 3** — Expand `/iban` pillar: format-by-country table, pillar→spoke link grid, canonical link to `/swift-codes` and IBAN guide
5. **Day 4–5** — Write `/guides/iban-vs-swift` (new, ~1500 words)
6. **Week 2** — Roll out to es/fr/pt locales where ranking pages already exist

## Notes

- **Why not use USD/BRL as seed:** 651 impr on a single page is a title/CTR fix, not a cluster play. Already addressed in commit 07271d0.
- **Why merge IBAN + SWIFT:** Users researching IBAN for a specific country often need SWIFT/BIC too (the GSC queries like `"bic code"`, `"swift money transfer"` at pos 87/94 confirm shared intent). Pillar-to-pillar linking compounds.
