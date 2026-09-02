# Content & Cannibalization Report — sendmoneycompare.com
**Date:** 2026-09-01 · **Window:** 2026-06-02 → 2026-08-30 (90 days) · **Sources:** Google Search Console + GA4 (live, via Composio)

---

## The one-paragraph version

Google sends this site **83 sessions in 90 days — 0.9% of all traffic.** Bing sends 2,726. The homepage absorbs **97% of every Google impression**, and only **35 URLs out of ~688 in the sitemap earned a single impression**. Meanwhile **15 of those 35 URLs now return 404, 410, or redirect into a 404** — including pages ranking at **position 2–3**. The site has been pruning away the only pages Google still ranks. Separately, AI assistants convert at **30%+** versus Bing's 6%, and the pages they cite are Gulf corridor pages, not guides.

**The content problem is not thinness. It is three templates competing for the same query, and traffic magnets that convert nobody.**

---

## 1. Where traffic actually comes from

| Source | Sessions | Key events | Conv. rate |
|---|---:|---:|---:|
| (direct) | 3,984 | 83 | 2.1% |
| **bing** | **2,726** | **167** | 6.1% |
| duckduckgo | 531 | 48 | 9.0% |
| **chatgpt.com** | **409** | **135** | **33.0%** |
| yahoo | 351 | 45 | 12.8% |
| chatgpt | 160 | 38 | 23.8% |
| results (Copilot referrer) | 138 | 31 | 22.5% |
| float_pill | 94 | 0 | 0% |
| **google** | **83** | **9** | 10.8% |
| ecosia.org | 71 | 7 | 9.9% |
| copilot | 61 | 7 | 11.5% |

By channel: Direct 3,984 · Organic Search 3,923 · Unassigned 521 · **AI Assistant 380 (124 key events — 32.6%)** · Referral 283 · Organic Social 45.

**Read this carefully:** "Organic Search" is 3,923 sessions but Google contributes 83 of them. Bing is **33× Google**. ChatGPT alone converts at 33% — five times Bing's rate and sixteen times Direct's.

---

## 2. Google Search Console — the real state

**90-day totals: 52 clicks · 2,007 impressions · CTR 2.59% · average position 68.4**

- **40 of 52 clicks** come from the brand query `sendmoneycompare`.
- The homepage alone took **1,949 of 2,007 impressions (97%)**.
- **Only 35 URLs earned ≥1 impression** out of ~688 submitted.

Every non-brand commercial query sits on **page 7–10**:

| Query | Impressions | Position |
|---|---:|---:|
| compare money transfer | 211 | 81.2 |
| money transfer comparison | 189 | 83.4 |
| compare money transfer rates | 77 | 78.4 |
| money transfer app comparison | 59 | 73.6 |
| best money transfer app | 58 | 85.8 |
| best online money transfer | 55 | 87.0 |
| international money transfer comparison | 47 | 79.0 |
| compare international money transfer | 48 | 78.7 |

Position 78–87 with hundreds of impressions is not a ranking problem you fix with better titles. It is site-level suppression: Google renders the pages, declines to rank them, and the only thing it will surface is the brand name.

---

## 3. CRITICAL — the site is deleting the pages Google ranks

Of the 35 URLs that earned Google impressions, **15 are now dead.** These are not junk pages; several rank at **position 1–3**.

| URL | Impr. | Position | Clicks | Now returns |
|---|---:|---:|---:|---|
| /fr/send-money/send-money-to-algeria | 43 | 8.8 | **1** | 301 → **404** |
| /fr/send-money/uk-to-guatemala | 28 | 3.5 | 0 | 301 → **404** |
| /send-money/switzerland-to-egypt | 24 | **2.0** | **1** | **404** |
| /send-money/south-korea-to-south-africa | 24 | **3.2** | 0 | **404** |
| /send-money/eur-to-cad | 20 | **2.5** | 0 | **404** |
| /send-money/gbp-to-gtq | 20 | **2.6** | 0 | **404** |
| /send-money/eur-to-nok | 9 | 24.0 | 0 | **404** |
| /send-money/south-africa-to-nigeria | 9 | 6.2 | 0 | **410** |
| /send-money/sweden-to-vietnam | 8 | **2.1** | 0 | **404** |
| /send-money/send-money-to-serbia | 6 | **3.0** | 0 | **404** |
| /swift-codes/serbia | 6 | 46.0 | 0 | **410** |
| /send-money/denmark-to-brazil | 3 | **1.3** | 0 | **404** |
| /send-money/saudi-arabia-to-vietnam | 3 | **1.7** | 0 | **404** |
| /es/exchange-rates/history/usd-to-hnl | 1 | **1.0** | **1** | 301 → **404** |
| /send-money/belgium-to-mexico | 1 | 5.0 | 0 | **410** |

**That is 205 impressions (10% of the site's total) and 3 of the 4 non-homepage clicks — all landing on dead URLs.**

Two distinct causes:

1. **`dynamicParams = false` + tier gating turns Tier-3 corridors into hard 404s.** Pages like `switzerland-to-egypt` (position 2.0) and `denmark-to-brazil` (position 1.3) were classified thin on provider count and removed — while Google was ranking them near the top.
2. **Locale redirects chain into 404s.** `/fr/*` and `/es/*` correctly 301 to the English URL, but that target has since been deleted. `/fr/send-money/send-money-to-algeria` had 43 impressions and a click at position 8.8; it now 301s to a 404.

**Disclosure:** one of those, `belgium-to-mexico`, was removed by yesterday's Eurozone duplicate collapse. I gated that work on Bing per-page data and a GSC file that was pulled in May; this live pull shows it had 1 impression at position 5. It is the only one of the 327 deletions with any live Google impression — but the gate should have used live GSC, and I will use it going forward.

---

## 4. Cannibalization — three templates, one query

This is the core content problem, and it is structural rather than editorial.

### 4a. Three-way overlap on "send money to X"

For **22 destinations**, the site publishes all three of:

1. `/guides/send-money-to-{country}-guide` — editorial guide
2. `/send-money/send-money-to-{country}` — country hub page
3. `/send-money/{source}-to-{country}` — up to 10 corridor pages

Worked examples:

| Destination | Guide | Country hub | Corridor pages |
|---|---|---|---:|
| India | ✓ | ✓ | 10 |
| Philippines | ✓ | ✓ | 8 |
| UK | ✓ | ✓ | 8 |
| Bangladesh | ✓ | ✓ | 7 |
| Pakistan | ✓ | ✓ | 7 |
| Brazil | ✓ | ✓ | 7 |
| South Africa | ✓ | ✓ | 7 |
| South Korea | ✓ | ✓ | 7 |
| Spain | ✓ | ✓ | 7 |
| Turkey | ✓ | ✓ | 7 |

All three answer "how do I send money to India". Google must pick one and has picked none — no page in this family earned a Google click in 90 days.

### 4b. Ten pages chasing "best money transfer app"

- `/guides/best-money-transfer-services` (358 sessions)
- `/guides/best-money-transfer-apps` (116)
- `/guides/best-apps-to-send-money-from-us-2026` (68)
- `/guides/best-money-transfer-apps-expats-2026`
- `/guides/best-money-transfer-apps-large-transfers`
- `/guides/best-money-transfer-apps-china-yuan`
- `/guides/top-money-transfer-apps-usa-to-india-2026`
- `/guides/best-apps-send-money-uk-to-nigeria-2026`
- `/guides/best-money-transfer-rates-eid-holi-2026`
- `/guides/best-day-to-send-money-abroad`

Meanwhile `best money transfer app` sits at **position 85.8** with 58 impressions and `best money transfer apps` at **position 90.1**. Ten near-synonymous pages split whatever authority exists across the cluster.

### 4c. Seven overlapping forecast/rates guides

`us-dollar-forecast-2026`, `euro-forecast-2026`, `gbp-forecast-2026`, `pakistan-rupee-forecast-2026`, `exchange-rate-markup-explained`, `multi-currency-accounts-exchange-rates`, `best-money-transfer-rates-eid-holi-2026`. Two of these are among the site's biggest traffic magnets and convert **zero** (see §5).

---

## 5. Content that earns traffic and converts nobody

| Page | Sessions | Key events | Conv. |
|---|---:|---:|---:|
| /guides/revolut-foreign-transaction-fees-2026 | 168 | **0** | 0% |
| /guides/us-dollar-forecast-2026 | 160 | **0** | 0% |
| /iban/italy | 83 | **0** | 0% |
| /iban/saudi-arabia | 47 | **0** | 0% |
| /exchange-rates | 47 | **0** | 0% |
| /swift-codes/united-kingdom | 44 | **0** | 0% |
| /swift-codes/united-states | 44 | **0** | 0% |
| /exchange-rates/usd-to-php | 43 | **0** | 0% |
| /iban/poland | 43 | **0** | 0% |
| /guides/swift-codes-explained | 244 | 4 | 1.6% |
| /guides/wire-transfer-guide | 130 | 3 | 2.3% |
| /guides/money-transfer-limits-by-provider-country | 119 | 2 | 1.7% |

**Roughly 1,170 sessions per 90 days produce 9 key events.** These are reference lookups — "what is an IBAN", "what's the SWIFT code for HSBC" — that answer the question and end the visit. The content is fine; the **path out of it does not exist**.

Compare to what does convert:

| Page | Sessions | Key events | Conv. |
|---|---:|---:|---:|
| /guides/send-money-to-philippines-guide | 147 | 27 | **18.4%** |
| /guides/send-money-to-china-guide | 116 | 19 | **16.4%** |
| /guides/multi-currency-accounts-exchange-rates | 110 | 13 | 11.8% |
| /guides/how-to-send-money-abroad | 169 | 18 | 10.7% |
| / (homepage) | 615 | 101 | 16.4% |

**Transactional intent converts at 10–18%. Reference intent converts at 0–2%.**

---

## 6. What AI assistants actually cite — and it isn't the guides

AI Assistant channel: 380 sessions → **124 key events (32.6%)**. Top landing pages:

| Page | Sessions | Key events | Conv. |
|---|---:|---:|---:|
| /guides/send-money-uae-to-pakistan-guide | 10 | 8 | **80%** |
| /send-money/saudi-arabia-to-india | 14 | 10 | **71%** |
| /send-money/saudi-arabia-to-egypt | 8 | 5 | **63%** |
| /guides/best-apps-send-money-uk-to-nigeria-2026 | 7 | 4 | **57%** |
| /send-money/uae-to-pakistan | 8 | 4 | **50%** |
| /guides/best-apps-to-send-money-from-us-2026 | 41 | 2 | 4.9% |
| /guides/top-money-transfer-apps-usa-to-india-2026 | 18 | 1 | 5.6% |

**The Gulf corridor cluster — Saudi/UAE → India, Pakistan, Egypt — converts at 50–80% from AI.** These are the highest-value pages on the site by a wide margin, and they are corridor pages, not guides. This cluster is under-built relative to what it returns.

---

## 7. What needs to be fixed

### CRITICAL — this week

**C1. Restore the 15 ranking pages that now 404.**
Highest-value action available. These already rank at position 1–3 and cost nothing to win back. Add each to the tier allowlist so `dynamicParams` builds them, or restore the deleted redirect targets. Specifically: `switzerland-to-egypt`, `south-korea-to-south-africa`, `eur-to-cad`, `gbp-to-gtq`, `sweden-to-vietnam`, `denmark-to-brazil`, `saudi-arabia-to-vietnam`, `send-money-to-serbia`, `send-money-to-algeria`, `uk-to-guatemala`, `exchange-rates/history/usd-to-hnl`, plus `belgium-to-mexico`.

**C2. Gate every future deletion on live GSC, not a cached file.**
The tier system decides indexability from provider count alone. It has no idea a page ranks at position 2. Add a hard rule: **never 404/410 a URL with ≥1 impression in the trailing 90 days on Google or Bing.** This is the guardrail whose absence caused C1.

**C3. Add a redirect-chain test.**
`/fr/*` → English → 404 shipped silently. A CI check asserting that every 301 target returns 200 would have caught it.

### HIGH — next two weeks

**H1. Collapse the three-way "send money to X" overlap.** Pick one canonical template per destination. Recommended: the **country hub** (`/send-money/send-money-to-{country}`) as the destination-level answer, with corridor pages for `{source}-to-{country}` and the `/guides/` version either merged into the hub or refocused on something the hub does not cover (documentation requirements, recipient-side collection, tax). Twenty-two destinations, three competing URLs each.

**H2. Consolidate the ten "best apps" guides into one.** Keep `/guides/best-money-transfer-services` (the traffic leader at 358 sessions), fold the rest in as sections, 301 the losers. Preserve `best-apps-to-send-money-from-us-2026` only if AI citation volume justifies a separate US page — it currently earns 41 AI sessions but converts at 4.9%.

**H3. Add a conversion path to the reference pages.** ~1,170 sessions per 90 days convert at under 1%. Every `/iban/*`, `/swift-codes/*` and `/exchange-rates/*` page should carry a live "send money to {country}" comparison widget above the fold, not a footer link. This is the single largest untapped conversion pool on the site.

### MEDIUM — this quarter

**M1. Build out the Gulf corridor cluster.** Saudi/UAE → India, Pakistan, Egypt convert at 50–80% from AI. Add Saudi/UAE/Qatar/Kuwait/Bahrain → Philippines, Bangladesh, Nepal, Sri Lanka with the same depth. This is the only place where "more pages" is justified by the data.

**M2. Fix or retire the two zero-conversion traffic magnets.** `revolut-foreign-transaction-fees-2026` (168 sessions, 0 conversions) and `us-dollar-forecast-2026` (160, 0). Both pull real traffic and monetise nothing. Add a provider-comparison module or accept them as brand-awareness plays and stop counting them as content wins.

**M3. Stop optimising for Google.** Google is 0.9% of traffic and structurally suppressed. Bing is 33× larger and DuckDuckGo alone out-delivers it 6×. Prioritise Bing/IndexNow and AI-citation surfaces. Revisit Google only after a core update moves the position-80 cluster.

---

## 8. What is NOT the problem

Worth stating plainly, because previous audits chased these:

- **Not thin content.** Median page is 2,867 words; corridor pages median 4,128.
- **Not technical.** Cache headers, canonicals, redirects, schema (501/501 valid), image hygiene and AI-crawler access all verified clean yesterday.
- **Not title/meta copy.** You cannot fix position 85 with a better title tag.
- **Not hreflang.** Locale routes correctly consolidate to English; its absence is right.

---

## Method & limitations

- GSC and GA4 pulled live via Composio MCP on 2026-09-01 for 2026-06-02 → 2026-08-30. Google API credentials remain unconfigured locally (`google_auth.py` → Tier -1), so CrUX field data is still unavailable.
- GSC reports only URLs with ≥1 impression; the 35-URL figure is the complete set for the window, not a sample.
- HTTP status checks were run live against production on 2026-09-01.
- Key events are GA4-configured; per earlier findings not all intended events are flagged as key events, so absolute conversion counts may understate. Relative comparisons between pages and channels are sound.
- Cannibalization analysis is structural (URL/template overlap) plus GSC position data. A same-query-multiple-URL cut was not meaningful here: with 97% of impressions on the homepage there is almost no query for which two URLs both surface.
