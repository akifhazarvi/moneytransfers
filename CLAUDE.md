# SendMoneyCompare

International money transfer comparison platform at **sendmoneycompare.com**. Helps users find the cheapest way to send money abroad by comparing 60+ providers across 64+ currency corridors.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, React 19)
- **TailwindCSS 4** with CSS custom properties (Google-style design tokens)
- **Playwright** + **Cheerio** for data scraping
- Deployed on **Vercel** (Pro plan — Vercel Analytics custom events record, unlike Hobby where they were silently dropped)

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

# Guards — prebuild and postbuild run these automatically; a failure fails the build
npm run check:assets     # logo manifest ↔ public/logos, asset paths, title-template length
npm run check:links      # every internal link resolves to a page the build rendered
npm run check:indexing   # sitemap ⇔ robots ⇔ canonical agree; sitemap-google.xml ⊂ sitemap.xml
npm run check:headings   # no H2 shared by 10+ indexable pages (postbuild)
npm run check:claims     # no scores, "Best Overall", unmeasured "cheapest", typed ratings (pre + postbuild)
npm run check:swift-codes # no spliced, mis-countried or wrong-length SWIFT codes (prebuild)
npm run check:rendered-text # no word glued to a value in rendered HTML, "216corridors" (postbuild)
npm run check:ranking    # ranking URLs answer 200 with an <h1> and no noindex (needs a deploy)
npm run check:link-eligibility # internal links only to Google-eligible pages; /go /out nofollow sponsored (rule 14)
npm run check:pwa        # manifest installable, icons/screenshots/shortcuts exist, sw.js bypass + offline revision (prebuild)
npm run check:redirects  # every 301 is one hop to a prerendered page; retired URLs 410 (postbuild)
npm run check:corridor-sort # every corridor provider list descends by payout (postbuild)
npm run check:link-eligibility # internal links point only at Google-eligible pages; /go /out are nofollow sponsored
npm run build:google-eligible  # regenerate src/data/google-eligible-routes.json (= sitemap-google.xml; prebuild runs it)

# End-to-end (Playwright, e2e/) — the installed app: manifest, worker, offline, install flows
npm run build && npm run test:e2e        # against `next start` on :3210
E2E_BASE_URL=https://… npm run test:e2e  # against a deployment (CI does this per deploy)
npm run build:pwa-assets # re-render maskable + apple-touch icons (add --screenshots <url>)

# Not a build gate — run periodically and read the output
npm run check:sources    # every external citation still resolves (403/unreachable ≠ dead)
npm run check:rankings   # ranked providers exist in our data; no uncomputed "N/10" scores
npm run check:weight     # heaviest prerendered pages; fails above 2 MB
npm run check:bundle     # heaviest CLIENT JS per page; catches a dataset bundled into a client chunk
npm run build:llms       # regenerate llms.txt + llms-full.txt (also runs in prebuild)
```

## Strict rules — these apply to every page, and most fail the build

Owner decision, 2026-09-27: what the round-2 and round-3 audits taught is
policy site-wide, not a fix for the pages that were audited. Each rule names
what enforces it. Where a rule is not automated, it says how to check it.

1. **Index per search engine; never gate Google with a generic `noindex`.**
   Google-only suppression is `googlebot: noindex` (meta + `X-Robots-Tag`),
   from `robotsFor()`/`xRobotsTagFor()` in `seo-indexing.ts`. A generic
   `robots: noindex` also removes the page from Bing, where the site earns:
   the Sep 20 gate cost 33% of Bing clicks in a week. *Enforced:* `check:indexing`.
2. **Two sitemaps, and GSC gets only one.** `sitemap.xml` = every
   `bingIndexable()` URL (submitted to Bing, pinged via IndexNow);
   `sitemap-google.xml` = the `googleIndexable()` subset, the only sitemap
   submitted in Search Console. Never resubmit `sitemap.xml` to GSC.
   robots.txt names `sitemap.xml` only (freelancer, 2026-10-06: one sitemap
   there; the Google one lives in GSC).
   *Enforced:* `check:indexing` (subset, and no Googlebot noindex in it).
3. **Reopen a page only on evidence, and measure it first.** A page joins
   `BING_DEMAND_ROUTES` on demand data (≥3 Bing sessions in 90 days in GA4, or
   the IBAN/SWIFT allowlists), never in bulk. Measure duplication before and
   after (8-word shingles over the rendered body, `$RC` splice replayed): no
   existing page may rise more than 0.5 points or cross 30%. Currency twins
   (send-money-to-spain / -germany are USD→EUR) stay closed unless Bing
   already sends them people: owner decision 2026-10-08 (round-3 brief §3.1)
   — no URL with Bing impressions in the brief's BWT export may carry a
   generic `noindex`, twins included (usa-to-europe, india-to-uk,
   india-to-canada, swift-codes/ireland went Bing-only in
   `BING_DEMAND_WAVE_2`). Google is unaffected: they stay `googlebot: noindex`.
   *Not automated* — the procedure is the check.
4. **A heading names its page; a widget has no heading.** No H2 may appear on
   10+ indexable pages. Template headings take the subject
   (`faqHeading(title, slug)`, `sectionHeading()` in `src/lib/page-headings.ts`,
   "{provider} features", "{a} vs {b}: your questions"). The subject must not
   be text other pages already print: a guide headline of 7+ words is on
   /guides and in every related list, so those guides get a short
   `GUIDE_TOPICS` entry (≤6 words, a last word its siblings don't share) —
   measured, not styled: the first version raised 15 guides and pushed /guides
   over 30%. A widget, ad or navigation block titles itself with a styled
   `<p>`; its landmark (`<aside aria-label>`) names it. *Enforced:*
   `check:headings` (postbuild); the duplication measurement of rule 3 still
   applies to any heading change.
5. **No unmeasured superlative, score or typed rating.** No `N/10` score, no
   "Best Overall", no "consistently / always cheapest", no "cheapest for most
   …" or "best EUR rates for most corridors", no "consistently offers the best
   rate / ranks highest", no hand-crowned "Cheapest …" table label, no
   hand-typed Trustpilot score or average markup. `messages/*.json` is in
   scope — the homepage FAQ lives there and went unscanned until 2026-09-29. Say what we measured —
   `{{CORRIDOR_LEADER:USD:INR}}`, `{{LEADS_SHORT:wise}}`,
   `{{AVG_MARKUP_PCT:slug}}`, `{{TRUSTPILOT:slug}}` — or label an editorial
   pick "Editor's pick". Never say the UK left SEPA: the EPC kept it in
   SEPA's scope after Brexit as a non-EEA member (BIC + payer address
   required) — ~30 passages said otherwise until 2026-09-29. Hand-typed markup figures ("within 0.5–1% of
   mid-market") are legacy debt on a ratchet (`scripts/claims-baseline.json`):
   the count may fall, never rise; so may the "(example)" table cells that
   hold invented payouts. *Enforced:* `check:claims` (prebuild), and
   `check:claims --built` (postbuild) for rule 6.
6. **"Cheapest" or "Best" in a title needs three priced providers.** A
   corridor page compared on fewer than 3 quotes (`MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE`
   in `corridor-title-claims.ts`, round-3 brief §4.3: /send-money/aud-to-bdt
   said "Cheapest Way" on two) says neither in its `<title>` or og title; the
   provider list is sorted by payout (rating breaks ties inside 0.1%,
   indicative quotes are not ranked). *Enforced:* `check:claims --built`
   (`few-providers-title`, via `data-compared-providers`) and
   `check:corridor-sort` (postbuild).
7. **Figures come from data, markups as medians.** See SEO Conventions: tokens
   in `ratings-tokens.ts` or `site-stats.ts`; `markupMedianPct`, never the
   mean. A field rendered without `renderDataTokens()` (provider reviews,
   `providers.ts` pros, non-editorial compare articles) cannot hold a token,
   so it cannot hold a figure a dataset knows either — drop the figure.
   Provider counts are three different numbers and always say which
   (`site-stats.ts`, "THE THREE PROVIDER COUNTS", published on /methodology):
   *tracked* (any live quote, printed "90+"), *compared* for this route
   (`{{ROUTE_PROVIDERS:…}}`), *reviewed* (`{{REVIEWED_COUNT}}`). A lead share
   is `{{LEADRATE:slug}}` (corridors led ÷ compared); `{{WINRATE}}` is days won
   and must be worded as days (`check:claims` `winrate-unlabelled`) — mixing
   the two printed "23 of 97 … 21.7%" on /companies/wise.
8. **SWIFT codes come from the directory.** A new or rewritten code is shown
   only when `src/data/scraped/swift-codes.json` (or `bank-details.json`)
   holds it for that bank, matched both ways on distinctive name words, or the
   bank's own site confirms it; otherwise remove it (tables show "—"). Never
   write one from memory. Legacy debt: ~450 codes in content (swift-content,
   corridor-details, guides, IBAN FAQs) pre-date this rule and are not in the
   directory — most look genuine, some do not (an Israel Discount Bank code
   under "DSCB", Raiffeisen Ukraine under "RAIF"); verify before trusting one.
   *Enforced (structure only):* `check:swift-codes` (prebuild).
9. **Never commit build-regenerated files.** `src/data/scraped/*`,
   `public/llms.txt`, `public/llms-full.txt` and
   `public/.well-known/ai-plugin.json` are rewritten by every build and by the
   scrape workflow. Restore them with `git checkout -- <path>` before
   `git add`; never `git add -A src`. The exception is `src/data/scraped/*.d.json.ts`:
   hand-written types (see *Editor & TypeScript load*), committed like code.
10. **A space after a JSX value must survive the build.** A text run that
    spans lines and holds an entity (`&rsquo;`) loses the space after an
    expression, and an expression ending a line loses the line break — so
    `{n} corridors` shipped as "216corridors" on /methodology and
    `{country} etiquette` as "Franceetiquette" on every /travel page. Write
    `{value}{" "}word`. *Enforced:* `check:rendered-text` (postbuild).
11. **After a deploy that changes URLs or indexing:** run
    `npm run ping:indexnow` (Bing and the IndexNow engines), and confirm GSC
    still lists only `sitemap-google.xml`.
12. **The service worker never serves a stale figure to someone online, and
    never caches money paths.** Navigations are network-first; a saved copy is
    served only when the network fails, and the worker writes a "copy saved
    on <when>" label into its HTML (it must hold even when no JS runs). `/go`, `/out`, `/api` are never cached, and a `/go`/`/out`
    navigation is answered with the navigation-preload response as-is, so a
    tap reaches the redirect exactly once (a fallback fetch would count the
    click twice). No install prompt may dock at the bottom of the viewport —
    that is StickyBestCTA's. *Enforced:* `check:pwa` (prebuild) + `e2e/`.

13. **New corridor data never creates a page.** Owner decision 2026-10-03: a
    route a scraper starts quoting shows up as provider rows in the comparison
    (`/send-money` results, existing corridor pages), not as a new
    `/send-money/<slug>` page. `src/data/corridor-page-allowlist.ts` is the
    ceiling — the 162 pages rendering that day plus one curated route — and
    `corridorPageRenders()`, the route's `generateStaticParams` and
    `build-corridor-uniqueness.ts` all require it, so data can remove a page but
    not add one. A new page is a deliberate edit to that file. *Enforced:* the
    allowlist itself; `check:links` and `check:indexing` see only what it lets
    render.

14. **An internal link points only at a Google-eligible page.** Owner
    decision 2026-10-08 (round-3 brief §5.1–5.4), strict: the eligible set is
    `sitemap-google.xml`, written to `src/data/google-eligible-routes.json` in
    prebuild. A link to anything else — Bing-only pages (`/companies/*`,
    `/compare/*`, `/banks/*`, most IBAN/SWIFT/corridor pages), pages noindexed
    everywhere, redirects, 404/410 — renders its anchor text as plain text, or
    points at the closest eligible page serving the same purpose (a corridor
    page → `/send-money#from=…&to=…`, `compareHashHref()`). Never `nofollow` an
    internal link instead. How: components import `@/components/EligibleLink`,
    never `next/link` (`fallbackHref`, `unlinked="hide"` for arrows and "Read
    review" buttons); rails filter with `isLinkEligible()` *before* slicing;
    HTML bodies pass through `renderDataTokens()`/`sanitizeHtml()`, which end
    with `gateBodyLinks()`. Nothing is hard-coded: when a page is released to
    Google it joins the eligible list on the next build and every link to it
    comes back by itself. Every `/go/` and `/out/` anchor carries
    `rel="nofollow sponsored noopener"` (+ `noreferrer` where it had it;
    `affiliateRel()`). Consequence to know: Bing-only pages now have no
    internal links and are found through `sitemap.xml` alone. *Enforced:*
    `check:link-eligibility` (postbuild; built HTML: links to non-eligible
    pages, /go rel, and §5.3 — every eligible page has in-content links from
    3+ other eligible pages; `--hubs` prints unique links per page).

15. **A retired URL answers once: 410, or one 301 to the same intent.** Round-3
    brief §3.2 (2026-10-08): 78 corridor 301s led to a different country's
    page (belgium-to-cameroon → austria-to-cameroon), 9 rate pairs to the
    /exchange-rates hub, and locale URLs into chains and 410s — Google reads
    all of those as soft 404s. A 301 may only point at the same corridor or
    currency pair (a rate pair → that pair's rate history is the same query);
    anything else is 410. `src/lib/retired-urls.ts` is the one answer
    (middleware responds with it); retired locale prefixes resolve the English
    path first, and a locale corridor whose English page does not render is
    410. *Enforced:* `check:redirects` (postbuild) — every redirect source is
    one hop to a prerendered page.

## Editor & TypeScript load

TypeScript infers a type from every imported JSON file. `rate-insights.json`
(28 MB) alone took the project check to 1.4M types and 3.8 GB, past the
editor's TypeScript-server limit, so Cursor's TS server crashed. A
`<name>.d.json.ts` beside the file (`allowArbitraryExtensions` in tsconfig)
declares its type instead; the bundler still imports the real JSON. With
declarations for rate-insights and the three largest quote files the check is
~2.0 GB / 256K types / ~14s. Give any new multi-MB JSON import one. Measure
with `npx tsc --noEmit --incremental false --extendedDiagnostics`.
`.vscode/settings.json` keeps the file watcher off `.next` and the history
snapshots; `.cursorindexingignore` keeps generated data out of the index.

A slow build is usually a loaded machine: unloaded, `npm run build` is ~1.5
min (prebuild ~15s, `next build` ~67s, postbuild ~8s). Stop any dev server you
start (`/private/tmp/*` previews ran for days at 4–6 GB each), and check
`sysctl vm.swapusage` before blaming the code.

## Live activity toast

One small card, site-wide, under the header: it slides in with one real thing,
stays ~6 seconds (longer while hovered or focused), slides out, and the next
comes 10–15 seconds later, so it never covers the page for long and needs no
scrolling. "Someone in Mexico chose InstaReM for $1,000 · USD → MXN · 2 min
ago" (provider logo with the reader's circular flag as a badge), "InstaReM
pays ₹96,164 for $1,000 · top of 20 quotes", "Readers' picks paid a median
$31 more per $1,000 than banks". Its top line is the counter: "Live · 3
people here now" (last 5 minutes, the reader included, so from 2), else "Live
· 14 people in the last 6 hours". Phones: full width under the header (the
bottom is the Send bar's). Wide screens: bottom-left, lifted above whatever
is docked there when it shows — forex ticker, Send bar, guide nudge, cookie
banner (`.pwa-lift`, `[data-forex-ticker]`); the WhatsApp pill is
bottom-right. Never over a focused field, a dialog or the welcome-back card;
never on /go, /out, /privacy, /terms, /cookies; × hides it for the visit.
Mounted once in the layout: `src/components/live-activity/`.

- **First-party, live to the second.** `src/lib/live-activity-beacon.ts`
  (started by GA4PageviewTracker, fed by `trackCompareSearch`,
  `trackQuotesViewed`, `trackProviderClicked`) posts to `/api/live-activity`,
  which keeps it in **Upstash Redis, Free plan** (Vercel Marketplace; env
  `KV_REST_API_URL`/`KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_*`), REST only,
  no client library. `src/lib/activity-store.ts` says what is kept and the
  command budget (Free = 500K/month). Without the env vars every write no-ops
  and the strip runs on the GA4 history alone, grey pill, "Recent activity".
- **Only people count, and every item is real.** Nothing is sent until the
  page has been visible 3 seconds AND the reader scrolled, tapped or typed;
  `navigator.webdriver` never sends (our e2e runs set it). Amounts come from
  the comparison (`trackQuotesViewed`/`trackCompareSearch`); a choice carries
  the amount last compared on its route. The server takes
  the country from Vercel, never the client; routes must be listed
  currencies, providers known and not hidden; one event per reader + action
  + route per 30 minutes, 20 per IP an hour; crawler UAs dropped. No cookie:
  a visitor is an HMAC of IP + UA + day, kept only inside HyperLogLogs.
- **GA4 can't feed this.** Its hourly data lands ~8 hours late, realtime has
  no route, and the org blocks service-account keys
  (`iam.disableServiceAccountKeyCreation`). `src/data/research/live-activity.json`
  holds real GA4 events from Oct 4–5 2026 as opening history; they age out
  after 48 hours.
- **30-day lines** (`reader-pulse.json`): `scripts/build-reader-pulse.ts
  --input=<saved GA4 pull>`, run by hand. Choices are priced by
  `scripts/lib/reader-choice-pricing.ts`, shared with the September study, so
  the two cannot disagree; countries need 2+ engaged sessions and 30s+ in 30
  days; sanctioned jurisdictions, Russia and Belarus are never shown. The strip
  drops these lines 45 days past their window.
- **Rendered in the browser** (`data-nosnippet`): the same sentences SSR'd on
  every guide and hub would raise each page's shared-text share (rule 3).
- **Events:** `live_activity_shown` (`placement`, the first card of a page
  view), `live_activity_clicked` (`placement`, `kind`: compared | chose | rate
  | savings), `live_activity_dismissed` (`placement`).
- **One live widget per page.** A site-wide "SiteSavingsBar" under the header
  (providers count, specialists-vs-banks %, a 5-minute "next rate check"
  countdown) was built in parallel on 2026-10-05 and not shipped: it pushed
  every page's content down, printed the same text on every page, and its
  countdown implied provider quotes refresh every 5 minutes (they refresh
  every 6 hours). An in-content strip version of this feature was replaced
  by the toast on 2026-10-06: the owner wanted it visible without scrolling.
  The same day the owner had the /send-money "ComparisonStatus" card removed
  (big provider count, "Next rate check 4:55" countdown, Refresh button) and
  the one-line results header restored: the same countdown theatre, on the
  page whose Send buttons matter most.

## Installed app (PWA)

The site installs as an app on Android, iOS, macOS, Windows and ChromeOS.

- **Manifest**: `src/app/manifest.ts` → `/manifest.webmanifest`, the only one
  (a divergent `public/manifest.json` was removed 2026-09-29). Icons: `icon-*.png`
  (any), `icons/maskable-*.png`, opaque `apple-touch-icon.png` (iOS paints
  transparency black). Screenshots in `public/pwa/` feed Chrome's richer install
  dialog.
- **Worker**: `public/sw.js`, hand-written, registered by `PwaManager` in
  production only (dev unregisters it — `next dev` and `next start` share
  localhost). Strategy and update rules are in its header. Editing
  `public/offline.html` requires updating `OFFLINE_REVISION` (check:pwa prints
  it). **Kill switch:** `NEXT_PUBLIC_DISABLE_SW=1` + redeploy unregisters it and
  clears its caches on the next page view.
- **Install flow**: `PWA_INLINE` (inline-scripts.ts, hashed) captures Chromium's
  one-shot `beforeinstallprompt` before hydration. `src/lib/pwa.ts` names the
  platform path (`prompt`, `ios-safari`, `mac-safari`, `android`, …). Surfaces:
  the header "Install app" pill (desktop, SSR'd `invisible` so the header never shifts), the
  mobile-menu row, and `InstallPrompt` — an **in-flow banner**, never fixed.
  Pages mark where it may appear with `<InstallSlot placement="…">`
  (`data-pwa-install-slot`; the layout adds `article-end`, /send-money has
  `comparison-end` after the results); `PwaManager` portals the one offer into
  the first slot once the reader scrolls it into view — from the 2nd page view,
  never while a form field has focus or a dialog is open, never on /go, /out,
  /privacy, /terms, once per session, 30-day snooze, never before cookie
  consent. Copy follows the placement prefix (`business-*`, `guide*`, other);
  `pwa_install_prompt_shown` carries `placement`. Safari has no API, so
  iOS/macOS get step-by-step `InstallDialog` instructions.
- **In the app** (`display-mode: standalone` or `minimal-ui`, or
  `html[data-app-mode="true"]` set by PwaManager): `.pwa-hide-standalone` drops
  the install buttons and desktop nav, `.pwa-app-nav` shows a Compare / Rates /
  Guides bar under the header, `.pwa-secondary-chrome` hides the back-to-top
  and WhatsApp pills, and `.pwa-lift` raises every bottom-docked bar by the
  iPhone home-indicator inset, matching ForexTicker — all CSS, so they hold at
  first paint. `start_url` is `/send-money` (the task); `id: "/"` is fixed, so
  existing installs keep their identity. `OfflineNotice` renders in the layout,
  sticky under the header, not fixed over it.
- **Events** (dual-sinked): `pwa_install_prompt_shown`, `pwa_install_clicked`
  (`surface`, `platform`), `pwa_install_outcome`, `pwa_install_prompt_dismissed`,
  `pwa_installed` (`install_method`: `appinstalled` on Chromium, `first_launch`
  on Safari — it never fires appinstalled, but a Home Screen/Dock app starts
  with empty storage, so its first launch is the install), `pwa_launch` (once
  per app session; `os`). **Usage from the app:** GTAG_INLINE stamps
  `display_mode` (standalone | minimal-ui | browser) on every GA4 hit from the
  first page_view, plus user property `app_display_mode`; `dual()` adds it to
  Vercel events fired in the app. GA4 needs these registered as custom
  dimensions to report them (the Composio GA4 connection is read-only).
- **CI**: `.github/workflows/e2e.yml` runs `e2e/` against
  https://sendmoneycompare.com after each successful production deployment,
  skipping data-only scrape commits. The custom domain is outside Vercel
  Authentication, so no bypass secret is involved; previews are not tested.
  Tests block third-party tags, so runs never reach GA4, Clarity or Vercel
  Analytics.

## Welcome back (returning visitors)

A return visit (30 min without activity) opens with the visitor's last
comparison: "Still sending money to Pakistan?", 1,300 USD → today's top payout,
and how it moved since they looked. `src/lib/last-search.ts` holds the rules;
`WelcomeBackManager` (layout) decides, `WelcomeBackCard` (lazy) renders.

- **What is remembered** (localStorage `smc_last_search`, never sent): a pair the
  visitor *chose* — /send-money reached with URL params or edited, the homepage
  converter edited — never a geo default. A corridor page read (`RememberCorridor`)
  is a weaker `page` record that never replaces a live search.
- **The payout change** compares like with like: only /send-money records the
  top quote (live-rate basis, as the card prices); other sources omit it.
- **When**: first page of a return visit only, after consent, never over a
  dialog, a focused field or the install banner (PwaManager yields to it too),
  never on a page already showing the pair (`data-smc-corridor`). Fixed under the
  header — the bottom is StickyBestCTA's. × or "New search" closes it for good;
  3 unanswered visits or 60 days retire it; a new search re-arms it.
- **Events**: `welcome_back_shown` (`kind`, `days_since`, `change`),
  `welcome_back_clicked` (`action`: compare | new_search), `welcome_back_dismissed`.

## Data Flow

1. **Scrapers** (GitHub Actions, every 6hrs) collect quotes from provider APIs and websites
2. **`src/lib/unified-quotes.ts`** merges sources by tier: 1 direct (first-party
   API/calculator) > 2 Wise Comparison API > 3 Monito > 4 Exiap > 5 RemitRoutes.
   A better tier wins a provider+amount **unless the other row is >24h fresher**;
   rows >72h behind the freshest row are quarantined as stale; rows that cannot be
   true are quarantined by `src/lib/quote-integrity.ts` (beats interbank outside
   `PARALLEL_RATE_CURRENCIES`, absurd markup/fee). RemitRoutes (tier 5) is
   gap-fill only: its rows are dropped for any provider a better tier covers on
   the corridor, at any amount — it stamps one all-in estimate at $200/$1,000/
   $5,000, which put Wise at a 2–5% "markup" on 257 slots until 2026-09-29 —
   and its USD-origin Wise rows are never used (median +3.27 points vs Wise). Every row is restated to
   "recipient gets for a total outlay of `sendAmount`" whatever the source's fee
   convention.
3. **`generateQuotes(amount, from, to)`** in `src/lib/quotes-engine.ts` returns what
   every comparison table renders (priced at the amount, hidden providers and
   transfer limits applied). Anything else that publishes a ranking — social
   posts, studies — must read it, not the raw files.
4. **History**: `aggregate-history.ts` snapshots all live files each run
   (`history/quotes-*.json.gz`) and rebuilds per-corridor series with the same
   tiers and guards → rate-insights → consistency index, SendScore, corridor
   leaders. Ranking by a raw `receiveAmount` is how Ria's promo rows became "the
   usual leader" on 40 corridors until 2026-09-27.
5. **Trustpilot ratings** are overlaid from `data/scraped/trustpilot-ratings.json`

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
| `/go/[provider]` | `/go/wise` | Affiliate redirect — TapTap direct, every other provider via the review page |
| `/go/[provider]/review` | `/go/wise/review?from=…` | The stop before a non-TapTap provider: Continue, TapTap cross-sell, app, WhatsApp |
| `/out/[provider]` | `/out/wise` | Affiliate redirect (alt), same rules |

**The review page (owner decision 2026-10-05).** A click to any provider but
TapTap Send lands on `/go/<provider>/review` (the route 302s there with the whole
query; `decideRedirect` in `redirect-decision.ts`). Its Continue goes back
through the route with `?continue=1`, which forwards. It is a real page in the
layout, rendered per request, noindex, under /go so robots.txt and the worker's
bypass already cover it. Keep "Continue to <provider>" the first, obvious
action: TapTap is offered beside the visitor's pick, never in place of it, and
only with the quote the comparison ranks (`partnerQuoteFrom`). Events: page
`go_review_shown` (`partner`, `origin`) + server `interstitial_impression`;
Continue `go_review_continue` + server `interstitial_continue`; each offer
counts its own view with source/placement `go_review` — TapTap card
`provider_cross_sell_viewed`, WhatsApp `whatsapp_cta_viewed`, app card
`pwa_install_prompt_shown`.

## Component Patterns

- **Client components** (`"use client"`): Header, ComparisonWidget, ComparisonTable, ProviderCard
- **Server components**: Everything else (Footer, Card, Container, PrimaryButton, etc.)
- Cards use `rounded-2xl` with subtle shadows. Buttons use `rounded-full`.
- External links: `target="_blank" rel="noopener noreferrer nofollow"`

## Git & Deployment

- **Author email**: All commits must use `akifhazarvi@yahoo.com` (GitHub-associated email). Other emails will block Vercel deployment on the Hobby plan.
- **No Co-Authored-By trailers** with non-GitHub emails.
- **Main branch** deploys directly to production — including the scrape workflows'
  data-only commits. `vercel-ignore.sh` used to skip those ("deploy hook will
  handle it") after the hook was removed, so no scraped data deployed from Sep 18
  to Sep 27 2026. It now builds every commit; never skip data commits unless
  something else deploys them.
- **GitHub Actions** workflow at `.github/workflows/scrape.yml` runs scrapers on schedule.

## Route Gating — read before writing any internal link

Most dynamic routes are **allowlisted**, and three of them set
`dynamicParams = false`, which means a URL outside the allowlist is a hard 404.
This is deliberate: the Mar 20 2026 scaled-content suppression followed shipping
200+ programmatic pages, and the June 2026 pruning collapsed the combinatorial
routes to allowlists. The guardrail is: **new combinatorial routes must be
allowlisted, not on-demand ISR.**

| Route | What renders | Outside it |
|-------|--------------|-----------|
| `/send-money/[corridor]` | Tier 1–2 (`corridor-tiers.ts`) + `RANKING_CORRIDOR_SLUGS`, minus `GONE_CORRIDOR_SLUGS`, inside `CORRIDOR_PAGE_ALLOWLIST` (frozen 2026-10-03) | **404** (`dynamicParams=false`) |
| `/compare/[slug]` | `EDITORIAL_COMPARE_SLUGS` + `SITEMAP_COMPARISON_SLUGS` | **404** (`dynamicParams=false`) |
| `/exchange-rates/history/[pair]` | `KEEP_HISTORY_PAIRS` ∩ pairs with ≥2 days of data | **404** (`dynamicParams=false`) |
| `/companies/[slug]` | `providers` (16 curated) | `notFound()` |
| `/guides/[slug]` | all built; indexable per `guideIsIndexable()` | renders, `noindex` |
| `/exchange-rates/[pair]` | `KEPT_RATE_PAIR_SLUGS` prerendered; retired pairs 301 to their own rate history or 410 (`gone-rate-pairs.ts`) | renders on demand |
| `/iban/[slug]`, `/swift-codes/[country]`, `/banks/[slug]`, `/business/[slug]` | their data list | `notFound()` |

**Never interpolate a slug into an internal href.** Ask `src/lib/route-map.ts`
(`corridorPageRenders`, `comparePageHref`, `rateHistoryHref`,
`companyPageRenders`, …) and drop the link when the answer is no. Scraped
`providerSlug` values are the usual trap — they are slugified bank names from
the Wise-comparison feed (`bnp-paribas`, `z-rcher-kantonalbank`) with no page
and no logo behind them. The 2026-09-02 audit found 5,526 internal links into
404s, 410s and redirects from exactly this mistake.

Provider **logos** have the same rule: `providerLogo(slug, explicit?)` from
`src/lib/provider-logo.ts`, never `` `/logos/${slug}.png` ``. Next's image
optimizer answers a missing source with HTTP 400.

## Indexing Model

Three signals must agree for every page: **sitemap membership, robots meta, and
canonical**. Disagreement between them is what the May 8 2026 deindex (500
indexed → 31) was traced to, and every cleanup since has been an instance of it.

- **Submitted (`sitemap.ts`) ⇒ indexable and self-canonical.** A sitemap entry
  is a recommendation to index; submitting a `noindex` URL, a 404, or one that
  canonicalises elsewhere is a contradiction. Enforced by `check:indexing`.
- **Not submitted ⇒ usually `noindex`.** The exceptions are declared:
  `INDEXED_IBAN_SLUGS` and `INDEXED_SWIFT_SLUGS` in `seo-indexing.ts` are
  deliberately broader than the sitemap (Bing earners Google ignores).
  `/compare-money-transfer` is indexable but unsubmitted because it
  canonicalises to `/compare`.
- **The largest exception is Tier 1 corridors, and it is deliberate.** ~362
  `/send-money/*` pages are `index, follow` while absent from the sitemap. (Until
  2026-10-08 `/send-money` linked all 436; owner decision with the round-3 brief
  §4.4: the hub's static HTML links only Google-eligible pages —
  `getRouteDirectory()` in `src/lib/send-money-hub.ts`, from the eligibility
  manifest, capped at 22 links in demand order so the page stays ≤80 unique
  links — and every other route is reached through its comparison form.)
  This looks like the "sitemap=no,
  robots=index" contradiction and is not: Tier 1 means editorial or 5+ providers
  quoting the route, i.e. a genuinely comparative page. Gating these on the
  demand allowlist was tried and reverted — it cut indexable corridors 1,176 → 100
  and suppressed 827 pages that earn their place on data richness rather than on
  already having been found. Read `shouldNoindex()` in `corridor-tiers.ts` before
  concluding those pages are a bug; the reasoning is there,
  and it is the same chicken-and-egg argument that governs guide promotion.
- **Reviewed routes override the duplication gate (2026-09-24).**
  `src/data/reviewed-indexable-routes.ts` holds the 234 URLs the round-2
  freelance technical-SEO brief opened, plus (2026-09-26) Bolivia and the
  indexable targets of brief URLs that 301 into a same-pair page — a brief URL
  must not end on a noindex page; owner decision that the brief outranks
  the 2026-09-20 measured-duplication gate for these paths.
  `routeIsIndexable()` admits them, so robots meta, `X-Robots-Tag` (which now
  mirrors `routeIsIndexable()` exactly — no extra family rules in middleware)
  and sitemap membership agree. URLs in the brief that are 301/404/410 were
  deliberately left out.
- **Footer IBAN/SWIFT pages are indexable, unsubmitted (2026-09-26).** The
  17 IBAN and 5 SWIFT pages in `src/data/footer-reference-links.ts` (read by
  both `Footer.tsx` and `routeIsIndexable()`) were reopened as Bing earners
  after their templates were de-duplicated. They stay out of the sitemap —
  IBAN/SWIFT are the documented broader-than-sitemap families.
- **Indexing is decided per search engine (2026-09-27, round-3 brief).**
  Google indexes 1 of ~8,700 known URLs; Bing earns. `routeIsIndexable()` is
  the Google gate. `googleIndexable()` = the gate minus `GOOGLE_HIDDEN_*`
  (`/companies/*`, `/compare/*`, `/banks/*` children + no-demand duplicates);
  `bingIndexable()` = the gate plus `BING_DEMAND_ROUTES` (evidenced Bing
  earners the Sep 20 gate had noindexed — Bing clicks fell 33% the week
  after). Lists in `src/data/search-engine-routes.ts`. A Bing-only page serves
  `robots: index` + `googlebot: noindex` in meta AND `X-Robots-Tag: googlebot:
  noindex` (both from `robotsFor()`/`xRobotsTagFor()`). sitemap.xml is the
  Bing sitemap; `sitemap-google.xml` is the `googleIndexable()` subset and the
  one submitted in GSC. `check:indexing` enforces both and that the header is
  never stricter than the meta. Before adding a Bing earner, measure it: many
  corridor/compare allowlist pages are currency twins that raise other pages'
  duplicate share.
- **Sitemap membership is gated on demand data, not judgement** — Bing
  Webmaster Tools (≥5 impressions/90d) post-deindex, since the site wins on
  Bing/AI assistants and Google is the failing channel. Allowlists live in
  `src/lib/sitemap-allowlists.ts` and are mechanical.
- **A ranking URL must never 404, 410, or serve noindex.**
  `ranking-corridors.ts` is the rescue list; `check:ranking` asserts those URLs
  answer 200 *with* an `<h1>` and without `noindex` — status alone is not
  enough, since a content-free 200 shell is a soft 404.

## SEO Conventions

- Every page exports `metadata` via the Next.js Metadata API, with a canonical
  from `getAlternates()`.
- **Never hand-type a figure a dataset already knows.** Cost, markup, rate and
  coverage numbers go through the `{{TOKEN}}` renderer in `ratings-tokens.ts`
  (guides, business pages) or `site-stats.ts` / the indices (components), so
  prose cannot drift from the data beneath it. `check:assets` fails the build on
  an unresolved `{{`. Report measured markups as **medians** — the mean is
  distorted by corridors where our own benchmark is unreliable (USD→NGN reads
  −3.16%), which is enough to misdescribe a provider.
- **`<title>` is not the `<h1>`.** Use `seoTitle(h1, explicit?)` or
  `fitTitle([...candidates])` from `src/lib/seo-title.ts`: titles cap at 70
  characters and must differ from the on-page headline. Hand-written titles go
  in `metaTitle` on the post/page data.
- **Descriptions cap at 160 characters.** Wrap the metadata `description` in
  `seoDescription(text, explicit?)` — it cuts at the last sentence that still
  uses most of the budget, else the last word, so the snippet ends where we
  choose rather than where the SERP truncates. Templated descriptions are
  length-checked by `check:assets` at their longest real values.
- **Every page needs an `og:image`.** A route that defines its own
  `openGraph` object replaces the inherited one and silently drops the
  file-based image, so spread `DEFAULT_OG_IMAGES` from `@/lib/i18n-metadata`
  into any `openGraph` that has no more specific image.
- **A page that ranks providers may only rank ones we hold data for.** If an
  entry earns its place on something we do not measure (account features, cash
  network reach), say so inline where it is ranked — `check:rankings` accepts an
  explicit disclosure and fails a silent one. It found two: SoFi ranked #1 at
  "9.8/10" and OnePay #4, on a page titled "Ranked by Cost", neither present in
  any dataset. No code on this site produces a `N/10` score; do not write one.
- **A citation must resolve, and must substantiate the specific claim.** A
  regulator's homepage next to a fee figure is not a source. `check:sources`
  found 11 dead citations in one sweep, four on a page promoted to indexable the
  same day. A host answering 403 or refusing HEAD is *not* evidence a page is
  dead — Revolut 403s every path including nonexistent ones — so verify with GET
  before removing anything.
- **`nofollow` is for paid, untrusted and UGC links only.** Citations to
  regulators, central banks, multilateral bodies and the press are followed —
  they are the outbound-citation signal that supports E-E-A-T on YMYL finance
  content. Providers we compare or monetise, the banks we review, and vendor
  utility pages keep it.
- JSON-LD: `FinancialService`/`BankOrCreditUnion`/`LocalBusiness` are
  LocalBusiness subclasses and **require an address** — use `Service` for what
  this site does, and reserve `FinancialService` for provider entities on their
  own page, where `headquarters` exists. `SoftwareApplication`/`WebApplication`
  require an `aggregateRating`; without an honest one, use `WebPage` or
  `WebAPI`. Reference a node declared elsewhere by `@id` rather than re-typing
  a name-only copy.
- **One licence: CC BY 4.0** — content, Dataset `license` fields and API output
  alike (owner decision, 2026-09-29). /research and six Dataset schemas said
  CC BY-NC-SA while /for-ai said CC BY; NC deters the commercial newsrooms and
  AI companies we want citing the data. `check:claims` fails on any NC/SA/ND.
- Affiliate links (`/go`, `/out`) carry `rel="nofollow sponsored"` and are
  disallowed in robots.txt. Internal links to our own pages never carry
  `nofollow` — it does not conserve PageRank, it just drops the edge.
- **Every submitted URL needs at least one internal link.** A hub indexes its
  own children (`/send-money`, `/guides`, `/news` each carry a crawlable
  index scoped by the same predicates the sitemap uses). A URL reachable only
  from sitemap.xml gives a crawler no path to it and no signal of its place in
  the site.
- Client components serialise every prop into the page HTML. Project data to
  the fields the component renders before crossing the boundary; passing
  `blogPosts` to the guides grid put 2.38 MB of article HTML into `/guides`.

## Scraper Architecture & Failure Patterns

### Scraper Types
- **API scrapers** (`scrape.yml`, every 6h): `scrape-ofx`, `scrape-instarem`,
  `scrape-xe` (mid-market), `scrape-taptapsend` (partner key), `scrape-wise-direct`,
  `scrape-wise-comparison`, `scrape-remitly`, `scrape-pandaremit`, `scrape-skyremit`,
  `scrape-lemfi`, `scrape-unplex`, `scrape-remitroutes`, `scrape-gulf` (Gulf senders:
  Western Union SA/AE/KW/BH, e& money, Al Ansari — rate-only operators need a
  published fee in `PUBLISHED_FEES` or they are not shown)
- **Cheerio**: `scrape-exiap` (JSON-LD); `scrape-ace` works but is disabled in CI
  (403 from datacenter IPs)
- **Playwright** (`scrape-browsers.yml`, daily): `scrape-monito` (4 shards),
  `scrape-xoom`, `scrape-ria` (browser auth, then API); `scrape-reviews` +
  `scrape-app-ratings` in `scrape-reviews.yml`

Verified field semantics per provider (which field is the promo, which is all-in)
are in the scrapers' own comments — read them before "fixing" a parse.

### Common Failure Modes (from git history)
1. **Page closing race condition** — Playwright `page.close()` called while navigation is in-flight. Fix: wrap close in try-catch or use `page.isClosed()` guard. (See: WU scraper fix `5acc13c`)
2. **Selector changes** — Provider redesigns their calculator UI. Fix: update CSS selectors, check for multiple fallback selectors.
3. **Timeout on CI** — GitHub Actions runners are slower than local. Fix: increase `NAV_TIMEOUT` and step `timeout-minutes`. (See: `2c15989`)
4. **Cookie/consent overlays** — Blocking interaction with calculator. Fix: `dismissOverlays()` helper in `scripts/lib/browser.ts`.
5. **Rate limiting** — Too many requests too fast. Fix: `jitteredDelay()` between corridor iterations.
6. **API response format changes** — Provider changes their JSON schema. Fix: check response shape before parsing.
7. **Orphaned scrapers** — GitHub's step `timeout-minutes` kills the bash wrapper but
   not the `npx → tsx → node` child, which keeps writing its file later; on
   2026-09-26 one rewrote its output mid-`git pull` and aborted the commit. Every
   scraper step runs under `timeout -k 15s <N>s` (30s inside the step cap), and
   `pkill -f scripts/scrape-` runs before the tail steps. Keep both.
8. **Green checks that hide failures** — `continue-on-error` reports a killed scraper
   as success (Remitly and RemitRoutes timed out on 7 of 8 runs unnoticed). Judge
   scrapers by output: the `Scrape health` step (`scripts/check-scrape-health.ts`)
   fails the run, after the commit, when a file wasn't rewritten, came back empty
   or lost >50% of its rows.
9. **Promo rates stored as the rate** — Ria `amountTo`, Xoom `FIRST_TIME_RATE`
   entries, Unplex `BlendedRate`, CompareRemit (removed). The comparison rate is
   the standard rate; promos go in `firstTimeRate`. A provider beating mid-market
   on a free-floating currency is a promo until proven otherwise.
10. **Total cost stored as a fee** — RemitRoutes `totalFeePercent` and Exiap
    `feesAndCommissionsSpecification` are fee + margin vs mid; stored next to the
    provider's own marked-up rate they charged the margin twice. Check a raw
    response: does fee% equal markup%, or does the page publish a mid?
11. **Empty output** — `writeOutput` (and Xoom's writer) keep the previous file on a
    0-quote run; the merge layer's 72h stale gate expires it and the health step
    flags it. Don't reintroduce an unconditional overwrite.
12. **A fee shape the parser ignores** — TapTap sends tiered (`tiers`) AND flat
    (`{ type: "standard", flatFee }`) schedules; until 2026-09-29 the scraper read
    only tiers, so 38 pairs stored a $0 fee (USD→INR: $1.99, 2% of history's $100
    reference) and TapTap "led" USD/CAD/GBP/EUR→INR and USD→THB on payouts it
    never made. Old rows are restated from `TAPTAP_FLAT_FEES` in
    `quote-integrity.ts`; an unreadable schedule now logs `WARN` in CI. A `fee: 0`
    from a provider that publishes fees is a parse gap until a raw response says
    otherwise.
13. **A placeholder stored as a quote** — `scrape-wise-direct`'s last-resort
    fallback wrote the mid-market rate with a $0 fee whenever Wise returned no
    quote. Every Gulf "Wise" row (AED/SAR/KWD/QAR/OMR/BHD, 76 rows) was one, so
    Saudi→India showed Wise at 0% / $0 although Wise rejects SAR as a source
    (HTTP 422) and offers AED only from a Wise balance. Removed 2026-10-03;
    `PLACEHOLDER_SOURCES` in `quote-integrity.ts` quarantines old rows live and
    in history. A scraper records nothing when the provider gives no quote. Before
    adding a sender country, probe the provider's own API for it: on 2026-10-03
    Remitly answered only from the UAE, Ria "Country not available" for every
    Gulf state, and XE serves senders in the EU, UK, US, CA, AU and NZ only.
14. **Amounts are in the sending currency** — `SEND_AMOUNTS` (100, 1,000) is
    ₹1,000 ($11) on an INR route. `sendAmountsFor(currency)` in
    `scripts/lib/browser.ts` adds the ~$1,000 equivalent for currencies where
    1,000 units is under $500 (AED 3,700). Keep 100 in every scraper's set:
    `aggregate-history.ts` keeps only the 100-unit row, so OFX (500/1,000) and
    SkyRemit (500+) are absent from history, leaders and the consistency index.
15. **A provider with nowhere to go** — `getAffiliateUrl()` sends a slug with no
    entry in `affiliateLinks` to our own `/send-money`. Until 2026-10-06, 32
    scraped slugs did (LemFi on 90 routes), so the review page's "Continue to
    LemFi" landed back on our comparison. Add the provider's own site (or an
    alias to an existing entry) when a scraper starts quoting it; the Scrape
    health step fails the run until you do.

### Shared Browser Utilities (`scripts/lib/browser.ts`)
All Playwright scrapers import from this shared library: `setupBrowserContext`, `dismissOverlays`, `fillAmountInput`, `withRetry`, `delay`, `jitteredDelay`, `writeOutput`, `parseNumber`.

### Debugging Scrapers
- Run a single scraper locally: `npx tsx scripts/scrape-<provider>.ts`
- Check GitHub Actions: `gh run list --workflow=scrape.yml --limit=3`
- All scrapers use `continue-on-error: true` in CI — one failure won't block
  others, which is why the step status means nothing: read the **Scrape health**
  table in the run summary
- Output goes to `src/data/scraped/<provider>-quotes.json`
- Use `/scrape-debug` command to check data freshness across all scrapers

## Custom Commands

- `/save-session` — Save structured session notes for future context resumption
- `/scrape-debug` — Check health of all scraped data files (staleness, counts, integrity)
- `/deploy-check` — Pre-push validation (build, lint, author email, secrets, types)

## Important Files

- `src/data/providers.ts` — Provider interface, 16 hardcoded providers, currencies list
- `src/lib/quotes-engine.ts` — `generateQuotes()`, the rows every comparison table shows
- `src/lib/quote-integrity.ts` — quarantine rules and `PARALLEL_RATE_CURRENCIES` (each entry cites its evidence)
- `src/lib/unified-quotes.ts` — Quote merging, source priority, Trustpilot index
- `src/lib/route-map.ts` — **does this internal URL render?** Ask before linking
- `src/lib/provider-logo.ts` — logo resolution against files that exist
- `src/lib/seo-title.ts` — `<title>` construction (70-char cap, distinct from `<h1>`)
- `src/lib/page-headings.ts` — page-specific wording for headings a template repeats
- `src/lib/sitemap-allowlists.ts` — what gets submitted, gated on Bing/GSC demand
- `src/lib/seo-indexing.ts` — which families stay indexable beyond the sitemap
- `src/lib/affiliate.ts` — Affiliate link generation (`getGoUrl()`)
- `next.config.ts` — Security headers, image config, `/comparison` -> `/compare` redirect
- `public/sw.js` + `src/components/pwa/` + `src/lib/pwa.ts` — installed app: worker, install flow, offline notice
