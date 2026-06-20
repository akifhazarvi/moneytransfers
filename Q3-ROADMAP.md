# SendMoneyCompare — Q3 2026 Roadmap

**Window:** Jul 1 – Sep 30, 2026 · **Owner:** Akif (solo, ~12 hrs/wk)
**Theme:** Growth-first (SEO/organic via content) · Clean, auditable analytics · Fix the basics
**Source data:** GA4 (prop 284608262), Partnerize, GSC (sc-domain:sendmoneycompare.com), codebase audits — Jun 2026

---

## 0. The three things this quarter must deliver

1. **Organic growth from content** — built for where we actually win (Bing + AI assistants), instrumented so we can *see* if Google ever rewards it. Evidenced demand exists: GSC shows `compare money transfer` (100 impr), `compare money transfer rates` (76), `compare international money transfer` (61) — we rank position 73–83 on all of them. The demand is real; the authority is the gap.
2. **Analytics we can trust** — every user action mapped to an event, fired once, with accurate values, in a store we control. No more `(not set)`, no fabricated IDs, no 55%-capture guessing.
3. **Basics fixed** — the recurring bugs (silent scrapers, attribution leak, cache regressions, dead code) stop eating time.

---

## 1. Analytics rebuild — the centerpiece

### 1.1 Current-state audit (what's broken, with evidence)

24 events are fired today across 3 sinks (GA4 gtag, GA4 Measurement Protocol, Vercel Analytics). The systemic problems:

| # | Problem | Evidence | Impact |
|---|---------|----------|--------|
| A1 | **Fabricated client_id per server redirect** | `ga4-server.ts:63` mints `server.{ts}.{rand}` when no `cid`/`_ga` | The 5,504 `(not set)` redirects; ~45% capture gap vs Partnerize; conversions land in "Unassigned" |
| A2 | **Vercel custom events silently dropped** | Hobby plan; `dual()` calls `track()` with no tier check | Half the dual-sink is a no-op; events tab empty |
| A3 | **client_id race** | `AiSourceInjector.tsx:25-29` — `gtag('get')` async callback | Fast clickers get no cid → fabricated ID |
| A4 | **Corridor format split** | `CompareShowdown.tsx:110` uses `USD_INR`; rest use `USD-INR` | Fragmented GA4 corridor reports |
| A5 | **Duplicate counting undocumented** | `provider_clicked` (client) + `provider_clicked_server` both fire | Double-count unless deduped manually |
| A6 | **Custom dims sent but not all registered** | `provider` registered Jun 5; `traffic_source`/`corridor` partial | Pre-registration history unqueryable; `(not set)` in reports |
| A7 | **Bot classifier too broad** | `traffic-source.ts:74-79` flags some ChatGPT humans as bot | Undercounts real AI referrals |
| A8 | **Empty/missing params** | `ProviderCard.tsx:391` omits `source`; empty-provider fixed Jun but watch | Junk rows |
| A9 | **Consent double-fire** | EU/UK pageview buffered then re-fired post-accept | Inflated pageviews |

### 1.2 Recommended architecture — *first-party event store, GA4 retained*

**Decision: don't rip out GA4. Add a first-party source of truth we own; keep GA4 for Google's ecosystem + benchmarks.**

Why this over the alternatives:
- **vs "fix GA4 only":** can't fix the structural client-id problem cleanly — GA4's model fights server-side redirect traffic. Cookieless/consent will always leak.
- **vs "replace GA4 entirely":** loses Google Ads/Search integration and history; big risk for a solo dev.
- **vs "Plausible/PostHog":** good tools, but a hosted SaaS is another bill and still doesn't natively own the server-side `/go` redirect event — which is the part that actually matters for revenue.

**The build (reuses infra we already have):**

1. **Stable first-party visitor ID in middleware.** Set an httpOnly, first-party `smc_vid` cookie (UUID) in `middleware.ts` on first visit, long-lived. This is the single fix that kills A1/A3 at the source — every event (client *and* server `/go` redirect) carries the *same* stable ID, no fabrication, no race, survives ad-blockers and consent (first-party, not GA).
2. **`/api/track` endpoint** — one server endpoint that writes events to a durable store. Mirrors the existing `gaServerEvent` pattern but to *our* store. Every event: `{ event, vid, ts, props, source, is_bot, geo }`.
3. **Storage:** start with **Vercel Postgres / KV** (free tier sufficient at current volume ~10k events/mo) OR append-only to a logflare/external sink. Pick based on query needs — Postgres if we want SQL-clean reports, KV if append-only is enough. **Decide in Week 2 after a volume check.**
4. **GA4 stays** but is fed the *same* `smc_vid` as client_id (forward it everywhere, replacing the fabricated path). GA4 becomes consistent with our store instead of diverging.
5. **Reporting:** a small `/api/track/report` (auth-gated) or a SQL view → the "clean numbers" dashboard. Per-use-case counts, deduped, by channel, by provider, by corridor — auditable row by row.

**Outcome:** one stable ID, one event spec, two sinks that finally agree. Partnerize remains the billing truth for Wise/Instarem; our store becomes the truth for everything else (TapTap, funnel, content engagement).

### 1.3 The tracking plan (target spec — every use case)

Each event below is the *target* state: fired once, stable `vid`, documented props, mapped to the question it answers.

| Event | User action | Fires from | Sink | Key props | Answers |
|-------|-------------|------------|------|-----------|---------|
| `page_view` | Any page load | layout (once, post-consent-safe) | store + GA4 | path, vid, channel, geo | Traffic by page/channel |
| `compare_search` | Submit comparison widget | ComparisonWidget | store + GA4 | from, to, amount, corridor(`X-Y`) | Top-of-funnel intent |
| `quotes_viewed` | Results render | SendMoneyClient | store + GA4 | corridor, provider_count | Did search → results |
| `provider_expanded` | Expand a provider card | ProviderCard | store | provider, rank, corridor | Engagement depth |
| `provider_clicked` | Click "Send with X" (client) | ProviderLink/Card | store + GA4 | provider, corridor, rank, source, **click_id** | Intent-to-convert |
| `affiliate_redirect` | `/go` `/out` redirect runs (server) | go/out routes | store + GA4(MP) | provider, corridor, **click_id**, vid, is_bot, traffic_source, geo | **Billable click — source of truth** |
| `review_clicked` | "Full review" | ProviderCard | store | provider, corridor | Research behavior |
| `content_view` | Scroll past threshold on guide | ScrollTracker | store | slug, depth | Content engagement |
| `sticky_cta_shown/clicked/dismissed` | Sticky CTA lifecycle | StickyBestCTA | store | provider, corridor, savings | CTA effectiveness |
| `filter_applied` / `sort_changed` | Results controls | SendMoneyClient | store | type, value | Results UX |
| `compare_selected` | Pick 2 to compare | ProviderCard | store | provider_a, provider_b | Comparison usage |
| `currency_swapped` | Swap button | ComparisonWidget | store | from, to | Widget UX |

**Rules baked in:**
- `click_id` = unique per redirect (`smc_{ts}_{rand}_{corridor}`) → ties client `provider_clicked` to server `affiliate_redirect` (kills A5 dedup ambiguity) and is the per-click proof for TapTap.
- Corridor format **always** `FROM-TO` uppercase (kills A4) — one helper, enforced.
- `vid` on every event (kills A1/A3).
- Bot classification recorded but **never drops the event** (kills A7) — filter at report time.
- No empty required params — a tracking helper throws/logs in dev if `provider`/`corridor` missing (kills A8).

### 1.4 Analytics workstream — sequenced

- **Wk 1:** Implement `smc_vid` cookie in middleware + forward as GA4 client_id everywhere. *This alone fixes the biggest leak.* Volume check to pick storage.
- **Wk 2:** Build `/api/track` + storage; add `click_id` to `/go` `/out`; corridor-format helper.
- **Wk 3:** Migrate all 24 client events to the new helper (dual-write store + GA4); register remaining GA4 custom dims; document the spec (this section becomes the living doc).
- **Wk 4:** Build the report view (clean per-use-case numbers); reconcile against Partnerize; retire the fabricated-id path. **Milestone: trustworthy numbers.**

---

## 2. Growth — content for Bing/AI, measured against Google

### 2.1 The strategy (reconciled with the Google constraint)

Content targets the **evidenced head-term demand** GSC already shows, optimized for Bing + AI citation (where we win), and **instrumented** so we can see if Google's recovery (1→3 indexed, rising) starts rewarding it. Data decides where we lean — we don't bet the quarter on Google reopening.

**Demand we're chasing (real GSC impressions, position 73–83 — all to win on Bing/AI first):**
- `compare money transfer` — 100 impr
- `compare money transfer rates` — 76 impr
- `compare international money transfer` — 61 impr
- `best online money transfer` — 27 impr
- corridor + provider long-tail where we already place top-5 on Bing

### 2.2 The content engine (one rule: substantive or nothing)

Two modes per week (no thin pages — same gate the SpaceX guide passed):

**Mode A — Deepen a proven winner (≈2 of 3 content blocks)**
1. Pick a corridor/guide with real Bing/GSC impressions.
2. Add what searchers ask: live fees table, delivery time, recipient/payout details, 5-slot FAQ, first-60-words direct answer (for AI extraction).
3. Refresh data + `lastmod`; run IndexNow (Bing) + sitemap resubmit (Google).
4. Internal-link from homepage rail + related pages.

**Mode B — Publish one researched guide (≈1 of 3)**
- Only on evidenced demand. Min bar: original POV + ~1,500 words, schema, canonical, AI-extractable answer up top.
- Add to `SITEMAP_GUIDE_SLUGS` only when substantive.

### 2.3 AI-citation optimization (the real growth channel)
- Ensure passage-level citability: clear question→answer blocks, comparison tables, current dates.
- Keep `/for-ai` + `/api/ai` quote endpoint healthy and linked.
- **Measure:** track which pages get cited / drive `affiliate_redirect` with `traffic_source` in (chatgpt, perplexity, claude, ai_other). This is now clean because of the analytics rebuild.

### 2.4 Growth workstream — sequenced
- **Wk 4–6:** Surface the ~65 guides + ~180 corridors that exist but aren't sitemap-discoverable; promote impression-earners into the allowlist. Deepen 3 winners.
- **Wk 6–9:** Publish 2–3 researched guides on the head-term demand list. Internal-link sweep.
- **Wk 9–13:** Measure Bing rank + AI citations + (watch) Google position on target terms. Double down on what moves.

### 2.5 Growth metric (instrumented, so Google is *measured* not assumed)
- Primary: **earning pages** (pages with ≥1 impression) — now ~29; target 2×.
- Secondary: Bing position on the 4 head terms; AI-referred `affiliate_redirect` count.
- Watch-only: Google position on `compare money transfer*` cluster — if it moves off 73–83, content is reopening Google and we lean in.

---

## 3. Fix the basics (stability — runs alongside)

| ID | Fix | Severity | Phase |
|----|-----|----------|-------|
| F-01 | Attribution leak → fixed by `smc_vid` (see §1.2) | HIGH | Wk 1 |
| F-02 | TapTap tracked link (click_id + ask TapTap for tracked URL) | HIGH | Wk 2–3 |
| F-03 | Scraper staleness alerts — quiet scraper should ping; validate JSON before commit | HIGH | Wk 3–5 |
| F-04 | Surface ~65 guides + ~180 corridors into sitemap | MED | Wk 4–6 |
| F-05 | Centralize cache headers (no-store regression has returned twice) | MED | Wk 7 |
| F-06 | Delete 10k+ dead lines (comparison-articles.ts, orphaned reviews) — verify no imports first | LOW | Wk 7–9 |
| F-07 | Perf: ISR 4×/day risks Vercel Hobby 400-min build budget → on-demand revalidation on scraper completion | MED | Wk 8–9 |
| F-08 | Perf: stream the 500MB history aggregation (currently all-in-memory) | LOW | Wk 9 |

### Design/usability (continues the workstream already started)
- ✅ Done Jun 20: gradient tokens, dark-mode gradient fix, 44px tap target, `CurrencyAmountInput` extraction, accent-glow shadow tokens.
- Remaining (optional, low-risk): neutral box-shadow token migration; revisit only if a redesign warrants it.

---

## 4. The weekly engine (~12 hrs)

| Day | ~Time | Focus |
|-----|-------|-------|
| Mon | 30m | Health check — scraper freshness + redirect volume vs last week |
| Tue | 3h | Build block — the week's analytics/stability task |
| Wed | 3h | Content block — deepen a winner or publish a researched guide; IndexNow after |
| Thu | 2h | SEO + links — promote earners to sitemap, internal links, Bing/GSC index check |
| Fri | 1.5h | Numbers — clean report from the new store; reconcile Partnerize; 1st Fri = partner report |
| Daily | 10m | Pulse — realtime flowing + redirects firing; flatline = drop everything |

---

## 5. 13-week sequence

- **Wk 1–4 — Analytics rebuild.** vid cookie → /api/track + store → migrate events → clean report. *Unlocks everything: you can't grow what you can't measure.*
- **Wk 4–6 — Surface & deepen.** Buried inventory into sitemap; deepen 3 winners; 1st partner report.
- **Wk 6–9 — Publish & harden.** 2–3 researched guides; cache headers; dead-code delete; scraper validation.
- **Wk 9–13 — Measure & lean.** Content performance read (Bing/AI/Google); ISR→on-demand; Q3 retro + Q4 brief.

---

## 6. North-star metrics (with Q2 baselines)

| Pillar | Metric | Now | Q3 target |
|--------|--------|-----|-----------|
| Analytics | Clicks attributed (vs Partnerize) | ~55% | ≥90% |
| Analytics | Events with a stable vid | ~0% server | 100% |
| Growth | Pages earning impressions | ~29 | 2× |
| Growth | AI-referred redirects (clean count) | unmeasured | baseline + lift |
| Revenue | Billable redirects/mo (all providers) | ~3,950 attributed (+5,504 lost) | recover the lost ~5,504 into attributed |
| Stability | Scraper silent-failure incidents | unknown (no alerts) | 0 undetected >24h |

---

*Living document. Update as phases complete. Generated Jun 2026 from GA4 + Partnerize + GSC + codebase audits.*
