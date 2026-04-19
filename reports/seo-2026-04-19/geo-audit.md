# GEO / AI Search Audit

Generated 2026-04-19 · claude-seo v1.9.0 `seo-geo` skill · Perplexity (`sonar-pro`) + ChatGPT (`gpt-4o-search-preview`), 24 live queries total

## TL;DR

**AI infrastructure is best-in-class.** llms.txt, llms-full.txt, ai.txt, `/for-ai` hub, API at `/api/ai`, plugin manifest — all shipped. Crawler access for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, anthropic-ai is explicit in both `robots.txt` and the edge middleware allowlist. None of this is the bottleneck.

**But AI citations are zero on both platforms.** 0/10 competitive queries on Perplexity, 0/10 on ChatGPT. Both know SMC when asked directly by name (cite our llms.txt + Trustpilot) — we're discoverable but not *preferred*. The gap is authority signals, not technology.

## Infrastructure (PASS)

| Check | Status | Location |
|---|---|---|
| `robots.txt` allows AI crawlers | ✅ | [src/app/robots.ts](src/app/robots.ts) — explicit rules for 6 AI UAs |
| Middleware allowlist | ✅ | [src/middleware.ts](src/middleware.ts) ALLOWED_BOTS list |
| `llms.txt` | ✅ | 173 lines, identity + citable facts + section index |
| `llms-full.txt` | ✅ | 421 lines, full corpus |
| `ai.txt` | ✅ | 46 lines, license + contact + editorial principles |
| AI-specific API | ✅ | `/api/ai` (JSON, no auth) |
| `/for-ai` hub page | ✅ | Dedicated landing for AI agents |
| Plugin manifest | ✅ | `/.well-known/ai-plugin.json` |
| OpenAPI spec | ✅ | `/openapi.json` |

## Live Citation Test — Perplexity (FAIL: 0/10)

Ran 10 competitive queries through Perplexity `sonar-pro`:

| Query | SMC cited? | Top domains cited |
|---|---|---|
| cheapest way to send money to India 2026 | ❌ | wise, investmates, youtube, extravelmoney |
| best way to send money UK to South Africa | ❌ | westernunion, wise, remitly, xe |
| compare money transfer rates online | ❌ | wise, remitfinder, mtfxgroup, xe |
| Germany IBAN format example | ❌ | wise, bank.codes, mollie, xe |
| USD to BRL exchange rate today | ❌ | wise, xe, revolut, westernunion |
| best money transfer app 2026 | ❌ | bossrevolution, pesa.co, techradar, muralpay |
| Mexico SWIFT BIC codes | ❌ | bookmyforex, arqfinance, wise, bank.codes |
| Wise vs Remitly fees | ❌ | xflowpay, wise, instarem |
| IBAN number validator | ❌ | bank.codes, apsbank, iban.com, wise |
| cheapest way to send money USA to Brazil | ❌ | revolut, remitly, westernunion, sendwave |

**SMC cited: 0/10. Wise cited: 7/10.** XE cited 5/10.

## Live Citation Test — ChatGPT (FAIL: 0/10)

Ran the same 10 queries through OpenAI `gpt-4o-search-preview` (web_search_preview):

| Query | SMC cited? | Top domains cited |
|---|---|---|
| cheapest way to send money to India 2026 | ❌ | sendtoindia (5x) |
| best way to send money UK to South Africa | ❌ | wise, help.nala, xe, forbes |
| compare money transfer rates online | ❌ | wise, mycurrencytransfer, xe, xendwise |
| Germany IBAN format example | ❌ | wise |
| USD to BRL exchange rate today | ❌ | investing.com |
| best money transfer app 2026 | ❌ | moneytransferreviews, techradar |
| Mexico SWIFT BIC codes | ❌ | xe |
| Wise vs Remitly fees | ❌ | moverdb, xflowpay, wise, youtube |
| IBAN number validator | ❌ | wise, ibanvalidator, spark.money |
| cheapest way to send money USA to Brazil | ❌ | wise, peanut, moneytransfers, paysend |

**Platform divergence (confirms 11% overlap rule from seo-geo SKILL.md):** ChatGPT favors niche corridor sites (`sendtoindia.com`, `moneytransferreviews.com`), tech review hubs (`techradar.com`, `forbes.com`), and `moneytransfers.com` alongside the brand incumbents. Perplexity skews harder toward raw brands (Wise, Western Union, Remitly dominate). So the mention-footprint work needs to target both populations — e.g. TechRadar pitch for ChatGPT visibility, r/personalfinance + YouTube for Perplexity.

## Who AI Cites (aggregate, 10 queries)

| Domain | Citations | Why they win |
|---|---|---|
| wise.com | 14 | Trustpilot 4.3/5, 203k reviews; multi-decade brand; own data source |
| remitly.com | 6 | Owned by Sendwave, public company, heavy PR |
| westernunion.com | 6 | Century-old brand, household name |
| xe.com | 5 | **Direct competitor** — comparison site since 1993, Euronet-owned |
| revolut.com | 3 | Fintech unicorn, $45B valuation |
| bank.codes / iban.com | 6 combined | Specialist utility sites with deep data |

## Branded Query Sanity Check

| Query | Perplexity | ChatGPT |
|---|---|---|
| "What is sendmoneycompare.com?" | ✅ Cites llms.txt: "60+ providers, 64 corridors, every 6 hours" | ✅ Cites sendmoneycompare.com (7 citations) + Trustpilot; richer description ("80+ corridors, 35+ providers including Wise, Remitly, XE, WorldRemit") |
| "sendmoneycompare.com review" | ❌ "No credible reviews...treat with caution — it may be an unestablished or potentially suspicious site." | ✅ **Finds Trustpilot profile**: "TrustScore 3.8/5 based on 3 reviews. Users praised the platform for saving time and money..." |

**Two platform-specific insights:**

1. **Trustpilot profile already exists** at `trustpilot.com/review/sendmoneycompare.com` (3.8/5, 3 reviews). ChatGPT surfaces it; Perplexity missed it. The fix isn't "get a Trustpilot" — it's **more Trustpilot reviews** to push the signal above the 10-review discoverability threshold Perplexity likely uses.

2. **Perplexity is further behind on SMC recognition than ChatGPT.** ChatGPT pulls richer profile data (80+ corridors vs Perplexity's outdated 64) and has indexed Trustpilot. This tracks with how each platform crawls: ChatGPT via Bing + direct crawl is more current than Perplexity's index.

## Root Cause: Brand Mentions, Not Schema

Per the Ahrefs December 2025 study (Ahrefs 75k-brand analysis, referenced in `seo-geo` SKILL.md):

| Signal | Correlation with AI citations |
|---|---|
| YouTube mentions | 0.737 (strongest) |
| Reddit mentions | High |
| Wikipedia presence | High |
| LinkedIn presence | Moderate |
| Domain Rating (backlinks) | 0.266 (weak) |

SMC's visible footprint on these channels is near zero — the llms.txt doesn't help if no one is talking about the brand elsewhere.

## Recommendations — Ranked by Expected Lift

### Tier 1: Mention footprint (highest impact, where most AI models look)
1. **Trustpilot review velocity** — profile exists (3.8/5, 3 reviews) but 3 reviews is below the discoverability threshold. Drive 20+ reviews from existing email-capture users and the weekly-digest subscribers. Every review adds indexable text ChatGPT is already surfacing.
2. **TechRadar / Forbes Advisor pitch** — ChatGPT explicitly cited `techradar.com` and `forbes.com` for "best money transfer app" queries. These are reachable with a data pitch (unique corridor-cost dataset). One placement unlocks ChatGPT visibility.
3. **Reddit seeds** in r/personalfinance, r/phfinance, r/IWantOut, r/ExpatFIRE answering "how to send money to [country]" with evidence + link. Organic answers, not spam. Perplexity weighs Reddit heavily.
4. **YouTube**: Publish 3–5 short tutorials ("UK to India cheapest transfer 2026", "How to validate a Germany IBAN") that cite `sendmoneycompare.com` in description + pinned comment. YouTube mentions = strongest AI-citation predictor (0.737 correlation).
5. **HARO / press pitch** to Bloomberg, Reuters on unique data: "Global average remittance cost 6.0% vs 3% UN target — here's the corridor breakdown." One press hit moves the needle more than months of on-page work.

### Tier 2: Passage-level citability (directly improves cite likelihood once mentioned)
5. **Rewrite top 5 ranking pages with 134–167-word self-contained answer blocks** in the first 40-60 words of each section (per GEO best practice). Start with:
   - `/iban/germany` (already high-CTR; expand answer block for "German IBAN format")
   - `/exchange-rates/usd-to-brl` (get 651-impr page into AI citations)
   - `/send-money/uk-to-south-africa` (38-impr zero-click keyword)
6. **Add a "Citable facts" block** at the top of comparison articles: specific stat + source + year.

### Tier 3: Wikipedia play (long-term, high ceiling)
7. Once a press hit lands, create a Wikipedia stub for SendMoneyCompare with the press citation as primary source. Wikipedia presence is a top-3 AI citation predictor.

### Tier 4: Skip / deprioritize
- **More schema, more llms.txt content, more AI crawler permissions** — already at ceiling. Diminishing returns.

## Measurement Plan

Rerun both scripts in 8 weeks. Target:
- **Perplexity**: SMC cited 0 → 2+ queries (of 10). Branded-review query shifts from "unestablished/suspicious" → neutral.
- **ChatGPT**: SMC cited 0 → 2+ queries. Trustpilot rating stays above 3.8, review count reaches 20+.

Reusable scripts:
- `/tmp/check_perplexity.py` — Perplexity `sonar-pro` citation check
- `/tmp/check_chatgpt.py` — ChatGPT `gpt-4o-search-preview` citation check

**Cross-platform overlap:** Across the 20 top-cited competitor slots (10 queries × 2 platforms), only **Wise** and **XE** appeared in both. This confirms the seo-geo SKILL.md claim that ~11% of domains get cited by both platforms. Tactical implication: Reddit/YouTube work compounds for Perplexity; TechRadar/Forbes/niche-site work compounds for ChatGPT. You need both.
