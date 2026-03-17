# SendMoneyCompare

International money transfer comparison platform at **sendmoneycompare.com**. Helps users find the cheapest way to send money abroad by comparing 60+ providers across 64+ currency corridors.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, React 19)
- **TailwindCSS 4** with CSS custom properties (Google-style design tokens)
- **Playwright** + **Cheerio** for data scraping
- Deployed on **Vercel** (Hobby plan)

## Project Structure

```
src/
  app/           # Pages (App Router)
  components/    # 14 reusable components (mix of client/server)
  data/          # Static data + scraped JSON in data/scraped/
  lib/           # Utilities (quotes, affiliates, exchange rates)
scripts/         # 13 scraper scripts (API + Playwright)
public/logos/    # 66 provider logos (PNG/SVG)
```

## Key Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm run scrape:all       # Run all scrapers (API + browser)
npm run scrape:all-api   # API-only scrapers (fast)
npm run scrape:reviews   # Trustpilot ratings
```

## Data Flow

1. **Scrapers** (GitHub Actions, every 6hrs) collect quotes from provider APIs and websites
2. **`src/lib/unified-quotes.ts`** merges sources with priority: direct API > Monito > Wise API > fallback
3. **`generateQuotes(amount, from, to)`** in `src/data/providers.ts` returns quotes sorted by best receive amount
4. **Trustpilot ratings** are overlaid from `data/scraped/trustpilot-ratings.json`

## Design System

CSS variables in `globals.css` follow Google Material style:
- `--color-primary: #1a73e8` (Google Blue)
- `--color-on-surface: #202124`, `--color-on-surface-variant: #5f6368`
- `--color-surface-dim: #f8f9fa`, `--color-outline: #dadce0`
- `--color-primary-surface: #e8f0fe` (tinted backgrounds)

Use design tokens via `var(--color-*)` in Tailwind arbitrary values, e.g. `text-[var(--color-primary)]`.

## Routing Conventions

| Pattern | Example | Purpose |
|---------|---------|---------|
| `/companies/[slug]` | `/companies/wise` | Provider review |
| `/compare/[slug]` | `/compare/wise-vs-remitly` | Head-to-head comparison |
| `/send-money/[corridor]` | `/send-money/usa-to-india` | Corridor landing page |
| `/guides/[slug]` | `/guides/how-to-send-money-abroad` | Guide article |
| `/go/[provider]` | `/go/wise` | Affiliate redirect |
| `/out/[provider]` | `/out/wise` | Affiliate redirect (alt) |

## Component Patterns

- **Client components** (`"use client"`): Header, ComparisonWidget, ComparisonTable, ProviderCard
- **Server components**: Everything else (Footer, Card, Container, PrimaryButton, etc.)
- Cards use `rounded-2xl` with subtle shadows. Buttons use `rounded-full`.
- External links: `target="_blank" rel="noopener noreferrer nofollow"`

## Git & Deployment

- **Author email**: All commits must use `akifhazarvi@yahoo.com` (GitHub-associated email). Other emails will block Vercel deployment on the Hobby plan.
- **No Co-Authored-By trailers** with non-GitHub emails.
- **Main branch** deploys directly to production.
- **GitHub Actions** workflow at `.github/workflows/scrape.yml` runs scrapers on schedule.

## SEO

- Every page exports `metadata` via Next.js Metadata API
- JSON-LD schema.org on key pages (FAQPage, Organization, WebSite)
- Dynamic `robots.ts` and `sitemap.ts`
- Canonical URLs set on all pages

## Scraper Architecture & Failure Patterns

### Scraper Types
- **API scrapers** (fast, reliable): `scrape-providers.ts` (Wise API), `scrape-ofx.ts`, `scrape-instarem.ts`, `scrape-taptapsend.ts`, `scrape-wise-direct.ts`
- **Cheerio scrapers** (medium): `scrape-exchangerates.ts`, `scrape-reviews.ts`
- **Playwright browser scrapers** (fragile): `scrape-monito.ts`, `scrape-worldremit.ts`, `scrape-remitly.ts`, `scrape-western-union.ts`, `scrape-revolut.ts`, `scrape-xoom.ts`, `scrape-ria.ts`, `scrape-xe-transfer.ts`

### Common Failure Modes (from git history)
1. **Page closing race condition** — Playwright `page.close()` called while navigation is in-flight. Fix: wrap close in try-catch or use `page.isClosed()` guard. (See: WU scraper fix `5acc13c`)
2. **Selector changes** — Provider redesigns their calculator UI. Fix: update CSS selectors, check for multiple fallback selectors.
3. **Timeout on CI** — GitHub Actions runners are slower than local. Fix: increase `NAV_TIMEOUT` and step `timeout-minutes`. (See: `2c15989`)
4. **Cookie/consent overlays** — Blocking interaction with calculator. Fix: `dismissOverlays()` helper in `scripts/lib/browser.ts`.
5. **Rate limiting** — Too many requests too fast. Fix: `jitteredDelay()` between corridor iterations.
6. **API response format changes** — Provider changes their JSON schema. Fix: check response shape before parsing.

### Shared Browser Utilities (`scripts/lib/browser.ts`)
All Playwright scrapers import from this shared library: `setupBrowserContext`, `dismissOverlays`, `fillAmountInput`, `withRetry`, `delay`, `jitteredDelay`, `writeOutput`, `parseNumber`.

### Debugging Scrapers
- Run a single scraper locally: `npx tsx scripts/scrape-<provider>.ts`
- Check GitHub Actions: `gh run list --workflow=scrape.yml --limit=3`
- All scrapers use `continue-on-error: true` in CI — one failure won't block others
- Output goes to `src/data/scraped/<provider>-quotes.json`
- Use `/scrape-debug` command to check data freshness across all scrapers

## Custom Commands

- `/save-session` — Save structured session notes for future context resumption
- `/scrape-debug` — Check health of all scraped data files (staleness, counts, integrity)
- `/deploy-check` — Pre-push validation (build, lint, author email, secrets, types)

## Important Files

- `src/data/providers.ts` — Provider interface, 16 hardcoded providers, `generateQuotes()`, currencies list
- `src/lib/unified-quotes.ts` — Quote merging, source priority, Trustpilot index
- `src/lib/affiliate.ts` — Affiliate link generation (`getGoUrl()`)
- `next.config.ts` — Security headers, image config, `/comparison` -> `/compare` redirect
