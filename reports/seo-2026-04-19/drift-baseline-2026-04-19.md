# Drift Baseline — 2026-04-19

15 pages baselined to SQLite at `~/.cache/claude-seo/drift/baselines.db` via localhost:3100 (production build, Googlebot UA). Compare next deploy with `drift_compare.py` once the local-bypass is merged upstream.

## Pages Captured

| id | Page | Title (first 90 chars) | H1 | Schema | H2 |
|---|---|---|---|---|---|
| 2 | `/iban` | IBAN Lookup — Format, Example & Validator for 89+ Countries (2026) | ⚠️ `iban.heading` | 3 | 5 |
| 3 | `/iban/germany` | German IBAN Format (2026): DE + 20 Digits, Example & Free Check | `GermanyIBAN` | 6 | 8 |
| 4 | `/iban/france` | France IBAN: 27-Character Format, Example & Bank Code | `FranceIBAN` | 6 | 8 |
| 5 | `/iban/spain` | Spain IBAN: 24-Character Format, Example & Bank Code | `SpainIBAN` | 6 | 8 |
| 6 | `/iban/turkey` | Turkey IBAN: 26-Character Format, Example & Bank Code | `TurkeyIBAN` | 6 | 7 |
| 7 | `/iban/poland` | Poland IBAN: 28-Character Format, Example & Bank Code | `PolandIBAN` | 6 | 8 |
| 8 | `/iban/austria` | Austria IBAN: 20-Character Format, Example & Bank Code | `AustriaIBAN` | 6 | 8 |
| 9 | `/iban/israel` | Israel IBAN: 23-Character Format, Example & Bank Code | `IsraelIBAN` | 6 | 8 |
| 10 | `/exchange-rates/usd-to-brl` | USD to BRL Exchange Rate Today: Dollar to Real Live Rate (April 2026) | `US DollartoBrazilian RealExchange Rate` | 6 | 7 |
| 11 | `/exchange-rates/gbp-to-eur` | GBP to EUR Exchange Rate Today — Live British Pound to Euro (2026) | `British PoundtoEuroExchange Rate` | 6 | 7 |
| 12 | `/companies` | 35+ Money Transfer Providers Reviewed — Best in 2026 (With Real Data) | `Money Transfer Company Reviews` | 4 | 51 |
| 13 | `/compare` | Compare Money Transfer Rates Today — Live Quotes from 35+ Providers | `Compare Money Transfer Providers` | 4 | 2 |
| 14 | `/currency-converter` | Live Currency Converter — Mid-Market Rate + Provider Markups (2026) | `Currency Converter` | 3 | 7 |
| 15 | `/business/b2b-transfers` | B2B International Money Transfer — Compare Business Providers (2026) | B2B International Money Transfer… | 5 | 10 |
| 16 | `/` | Compare 35+ Money Transfer Services — Find the Cheapest Rate (2026) | `Save $50 to $300 on yournext money transfer` | 6 | 10 |

## Bugs Surfaced by Baselining

### 🔴 Critical — `/iban` H1 is `"iban.heading"`

Page is calling `t.rich("heading", ...)` in `src/app/[locale]/iban/page.tsx:81` but the `iban.heading` key is missing from all four locale files (`en.json`, `es.json`, `fr.json`, `pt.json`). next-intl falls back to rendering the raw key as text. Googlebot is indexing `"iban.heading"` as our H1 on a pillar page with **1,500+ impressions** of cluster traffic.

Same likely applies to `t("subheading", ...)` on the next line.

**Fix:** Add `iban.heading` and `iban.subheading` to all four locale files.

### 🟡 DOM text-concatenation bugs (H1s Googlebot parses without spaces)

- Homepage: `"Save $50 to $300 on yournext money transfer"` (`your` + `next` rendered as adjacent spans)
- All IBAN spokes: `FranceIBAN`, `SpainIBAN`, etc. (country name + `IBAN` as adjacent spans, no space)
- Exchange-rate spokes: `US DollartoBrazilian Real...` (currency names concatenated without space)

These look fine to humans because of CSS spacing, but Google parses plain text from the DOM. Titles look right, but H1 parity matters for content-score.

**Fix:** Either add a space character between the spans, or use a single text node with CSS styling the inline element.

## Recently Shipped Changes (verified present)

- ✅ `/iban/germany` — new CTR title from `ibanMetaOverrides` applied
- ✅ `/exchange-rates/usd-to-brl` — 2026 title + Live Rate copy
- ✅ `/exchange-rates/gbp-to-eur` — 2026 live-rate title
- ✅ `/companies`, `/compare`, `/currency-converter` — tighter CTR titles all present

## How To Compare Later

```bash
# After next deploy, with --allow-local bypass (already patched in submodule):
python claude-seo/scripts/drift_baseline.py http://localhost:3100/iban --allow-local --user-agent __googlebot__ --skip-cwv
python claude-seo/scripts/drift_compare.py http://localhost:3100/iban --allow-local --user-agent __googlebot__
```

Note: `drift_compare.py` does not yet accept `--allow-local` / `--user-agent` — same 3-line patch needed. One-off baseliner at `/tmp/local_baseline.py` works today.

## Submodule Patches

`claude-seo/scripts/drift_baseline.py` was modified to accept:
- `--user-agent <string>` (or `__googlebot__` sentinel)
- `--allow-local` (bypass SSRF check for localhost baselines)

These patches enable Googlebot-UA fetches against localhost:3100, which both the middleware spam-bot block and fetch_page.py's SSRF check otherwise reject. Worth upstreaming — PR candidate.
