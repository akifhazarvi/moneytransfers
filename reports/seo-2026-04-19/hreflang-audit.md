# Hreflang & International SEO Audit

Generated 2026-04-19 · claude-seo v1.9.0 `seo-hreflang` skill · content-parity reference

## TL;DR

Hreflang tag implementation is **correctly set up** (self-refs, return tags, x-default, canonical alignment all pass). The problem is one level down: **every dynamic-route page across every locale emits English titles and descriptions**. The site declares 4 hreflang alternates per URL but serves English metadata on 3 of them, making the ES/FR/PT locales dead weight to Google.

## Tag Implementation — PASS

Verified via live render at `http://localhost:3100/iban/germany`:

```html
<link rel="canonical" href="https://sendmoneycompare.com/iban/germany"/>
<link rel="alternate" hrefLang="x-default" href="https://sendmoneycompare.com/iban/germany"/>
<link rel="alternate" hrefLang="en"        href="https://sendmoneycompare.com/iban/germany"/>
<link rel="alternate" hrefLang="es"        href="https://sendmoneycompare.com/es/iban/germany"/>
<link rel="alternate" hrefLang="fr"        href="https://sendmoneycompare.com/fr/iban/germany"/>
<link rel="alternate" hrefLang="pt"        href="https://sendmoneycompare.com/pt/iban/germany"/>
```

| Check | Result |
|---|---|
| Self-referencing tag | ✅ Present on every locale |
| Return tags (A↔B full mesh) | ✅ All 4 locales cross-reference |
| x-default | ✅ Points to English, correct |
| ISO 639-1 language codes | ✅ `en`, `es`, `fr`, `pt` all valid |
| Canonical ↔ hreflang alignment | ✅ Match per locale |
| Protocol consistency | ✅ All HTTPS |

Note: Next.js emits `hrefLang="..."` (camelCase) vs the HTML-spec `hreflang`. Googlebot accepts both; some audit tools flag it. Not a bug.

[src/lib/i18n-metadata.ts](src/lib/i18n-metadata.ts) is solid.

## Content Parity — CRITICAL

### Issue 1: PT locale is 88% English

| Locale | Total keys | Identical to EN | % identical |
|---|---|---|---|
| en | 777 | – | – |
| es | 777 | 18 | 2.3% |
| fr | 777 | 34 | 4.4% |
| **pt** | **777** | **684** | **88.0%** |

ES and FR are properly translated (the 2–4% identical are brand names and proper nouns like "Wise vs WU"). **PT is structurally a copy of EN** — keys like `iban.subheading`, `about.heading`, `compare.heading`, `exchange-rates.metaKeywords` are raw English strings under the `pt` key.

**Impact:** Google's cross-language algorithms detect the duplicate content and either drop PT alternates from SERPs entirely, or serve the EN version to PT searchers. PT pages rank (e.g. `/pt/iban/spain` 29 impr at pos 61) but will never break through with this content.

**Fix options:**
1. Translate the 684 strings (biggest one-time cost, highest payoff)
2. Remove `pt` from `LOCALES` in [src/lib/i18n-metadata.ts:12](src/lib/i18n-metadata.ts#L12) until PT is ready (stop declaring hreflang to a locale that's lying)
3. Add `noindex` to all `/pt/*` routes until translated

### Issue 2: Dynamic-route titles are English across ALL locales

The real killer. Every `generateMetadata()` in a slug page uses English hardcoded fallback strings, and only the `en` locale has override paths. Confirmed across 6 tested route types:

| Route | EN | ES | FR | PT |
|---|---|---|---|---|
| `/iban/france` | `France IBAN: 27-Character Format…` | **identical** | **identical** | **identical** |
| `/iban/spain` | `Spain IBAN: 24-Character Format…` | **identical** | **identical** | **identical** |
| `/send-money/usa-to-india` | `Cheapest Way to Send Money USA to India…` | **identical** | **identical** | **identical** |
| `/companies/wise` | `Wise Review 2026 — Fees, Exchange Rates…` | **identical** | **identical** | **identical** |
| `/exchange-rates/usd-to-brl` | `USD to BRL Exchange Rate Today…` | **identical** | **identical** | **identical** |
| `/guides/how-to-send-money-abroad` | `How to Send Money Internationally (2026)…` | **identical** | **identical** | **identical** |

Root cause: [src/app/[locale]/iban/[slug]/page.tsx:85-91](src/app/%5Blocale%5D/iban/%5Bslug%5D/page.tsx#L85-L91):

```tsx
const override = locale === "en" ? ibanMetaOverrides[slug] : undefined;
const title = override?.title ?? `${name} IBAN: ${country.ibanLength}-Character Format, Example & Bank Code`;
const description = override?.description ?? `${name} IBANs are ${country.ibanLength} characters and start with ${country.countryCode}...`;
```

The `?? <english-template-literal>` fallback fires for ES, FR, and PT. No locale-aware template.

**Scope of the bug:** Every dynamic route page — estimate 200+ URLs (50 IBAN countries + 30 send-money corridors + 35 companies + 25 compare + guides + exchange rates) × 3 non-English locales = **600+ URLs emitting English metadata under foreign-language URLs**.

**Fix pattern:** Move locale-aware title/description templates into the locale JSON files under a shared `ibanSlug` namespace that the component already reads for body content. Example:

```json
// messages/fr.json
"ibanSlug": {
  "titleFallback": "{name} IBAN : format à {length} caractères, exemple et code bancaire",
  "descriptionFallback": "Les IBAN {name} comptent {length} caractères et commencent par {code}..."
}
```

Then in the page:
```tsx
const t = await getTranslations({ locale, namespace: "ibanSlug" });
const title = override?.title ?? t("titleFallback", { name, length: country.ibanLength });
```

Apply the same pattern to every dynamic route's `generateMetadata()`.

### Issue 3: Subtle — content-parity matrix

From the claude-seo content-parity reference:

| Dimension | EN | ES | FR | PT |
|---|---|---|---|---|
| Page existence | ✅ | ✅ | ✅ | ✅ |
| Title localized | ✅ | ❌ (EN text under ES URL) | ❌ | ❌ |
| Meta description localized | ✅ | ❌ | ❌ | ❌ |
| Section structure parity | ✅ | ✅ (same components) | ✅ | ✅ |
| Body text localized | ✅ | ✅ (via `t()` in body) | ✅ | ❌ (PT 88% EN) |
| Schema markup localized | ? | ? | ? | ? |

Schema localization is not independently verified here — worth a follow-up scan.

## Recommendations — Priority Order

1. **Today (1–2 hrs):** Move dynamic-route title/description templates into locale JSON. Start with `/iban/[slug]` (highest cluster value per the cluster plan), then `/send-money/[corridor]`, `/companies/[slug]`. Every other route after.
2. **This week:** Decide on PT — translate or `noindex` it. Currently it's harming more than helping. If translating, ES→PT is a short hop (both Romance, similar ratios per content-parity ref: ES 1.15–1.25x EN, PT similar).
3. **Low priority:** Consider region qualifiers (`es-ES` vs `es-MX`, `pt-PT` vs `pt-BR`). GSC data doesn't yet justify the split; revisit if ES-LATAM queries emerge.

## Measuring Impact

After fixing dynamic-route localization, expect in the next 2–3 GSC pulls:
- ES and FR page impressions to shift from "duplicated EN" ranking slots (pos 50–70) toward their own striking distance (pos 10–20)
- CTR on localized SERPs should exceed the current 0% on non-EN pages
- PT: no change until translation lands

Re-run: `/seo hreflang` after the fix to confirm parity passes.

## Skills Not Run

- **seo-ecommerce** — skipped (site isn't e-commerce)
- **seo-sxo** — deprioritized; the IBAN cluster plan already covers page-type and intent analysis for the highest-value pages. Can be run later on `/business/b2b-transfers` (pos 71) as a specific case study where page-type mismatch is suspected.
