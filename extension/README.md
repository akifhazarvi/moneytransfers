# SendMoneyCompare browser extension

Chrome and Edge (Manifest V3). Four tabs in the toolbar popup:

- **Compare**: what every provider pays out for an amount, in `/send-money` order,
  with the 10-row cap, "Best value" only at 3+ priced providers, ties, the timing
  score and the 90-day top payer. Opened on a provider's site (Wise, Remitly,
  Western Union, 50 more) it says how that provider compares and reads the
  amount from its calculator.
- **Convert**: several currencies at once (type in any row), each with its
  change over 1D / 1W / 15D / 30D, and a 1W–1Y chart (scrubbable, high/low/average)
  for the selected pair. Rates refresh every minute while the popup is open.
- **Offers**: first-transfer rates measured from providers' own quotes, and
  sign-up offers from `src/data/promos.ts` with their checked date.
- **Rates**: a watchlist (synced across the reader's Chrome profiles) with
  sparklines and period changes, rate alerts (Chrome notifications, checked every
  15 minutes) and an optional rate on the toolbar icon.
- **Live activity**: the site's strip along the bottom of the popup, same feed
  and wording. The extension reads it and never records activity of its own.
- **Welcome page** on install: pin the icon (with a live "Pinned ✓"), try it,
  and the one-time usage-sharing choice. **Uninstall** opens /contact.

## Events

Opt-in only (`analytics` pref: null until chosen; asked on the welcome page and,
if unanswered, once in the popup; switch in Settings). `extension/src/lib/analytics.js`
→ `POST /api/ext/v1/events` → GA4 via Measurement Protocol
(`src/lib/extension-events.ts`, allowlisted names, random per-browser id
`ext.<uuid>`, deleted on opt-out; GPC/DNT override). Every event carries
`cta_source=extension`, `ext_version`, `ext_browser`. The conversion is
`provider_clicked` with `placement` extension_row | extension_row_here |
extension_details | extension_offers | extension_omnibox. Others: ext_opened,
ext_tab, ext_quotes_viewed, ext_compare_search, ext_here_shown, ext_converted,
ext_watch_added, ext_alert_set, ext_alert_fired, ext_link_copied,
ext_code_copied, ext_context_menu, ext_omnibox, ext_rate_prompt, ext_setting,
ext_welcome, ext_installed, live_activity_clicked (placement extension).
Register `placement`, `ext_version`, `ext_browser`, `tab`, `via` as event-scoped
custom dimensions in GA4 (not retroactive).

Without anyone opting in: the Chrome Web Store / Edge dashboards give installs
and weekly users; `/go?src=extension` redirects that reach a provider are counted
daily with no identifier (`qualified_redirect_extension`,
`node --env-file=.env.local scripts/report-consent-metrics.mjs`, column
from_extension); links into the site carry utm_source=<browser>-extension,
utm_medium=extension, utm_content=<placement>.

Plus: right-click a selected amount ("$1,250") to compare or convert it; type
`smc 500 gbp inr` in the address bar; Alt+Shift+S opens the popup.

## How it gets its data

Only from `https://sendmoneycompare.com/api/ext/v1/{compare,rates,history,activity}`
(`src/lib/extension-api.ts`). Quotes use the 6-hourly XE mid-market snapshot the
site prices with. The converter, watchlist and alerts use the licensed live feed
(currencyapi.com, `CURRENCY_API_KEY`) whenever it is fresher than that snapshot;
the popup says "Live" only while the source's own timestamp is under 10 minutes
old. How live that is depends on the currencyapi plan (daily on Free, hourly on
Small, 60 seconds on Medium): raise the plan, then lower `LIVE_REVALIDATE_SECONDS`. Those endpoints call the functions the site renders
with, so the extension prints what `/send-money` prints and a rule changed on the
site reaches installed copies with the next deploy. They are public, cookie-free
and send `Access-Control-Allow-Origin: *`, so the extension needs no host
permission. Responses are kept in `chrome.storage.local` so the popup opens on
the last answer and works offline.

**`v1` is a contract with installed copies.** Stores roll out updates over days
and some people never update, so never change a v1 field's meaning or remove one;
add fields freely, and ship a breaking change as `v2` beside `v1`.

## Build, run, test

```bash
npm run build:extension                                   # → extension/build + store zip
npx tsx scripts/build-extension.ts --api=http://localhost:3000   # against `next dev`, no zip
```

Load it in `chrome://extensions` (or `edge://extensions`): Developer mode →
Load unpacked → `extension/build`. The source in `extension/src` is plain ES
modules; the build adds `data/currencies.js` (from `src/data/transfer-currencies.ts`),
bundled flags and icons. Flags the site takes from the circle-flags CDN are
fetched once into `extension/assets/flags/` (committed), so the popup makes no
third-party request.

## Permissions, and why (the store asks)

| Permission | Why |
|---|---|
| `activeTab`, `scripting` | When the reader opens the popup on a provider's page, read the amount and currencies shown there. Only on that click, only that tab. |
| `storage` | Saved answers, the watchlist, alerts and settings. |
| `alarms` | Check rates about hourly for alerts and the toolbar rate. |
| `contextMenus` | "Compare sending / Convert" on selected text. |
| `notifications` (optional) | Asked for only when the reader sets their first alert. |

No host permissions. Install shows no warning beyond the optional notifications prompt.

## Before submitting to the stores

1. **Deploy `/api/ext/v1/*` first.** The production build calls it; until it
   is live every request fails.
2. **Privacy policy.** `/privacy-policy` has a "SendMoneyCompare browser
   extension" section; give the stores https://sendmoneycompare.com/privacy-policy.
3. **Offers age out.** Every offer in `src/data/promos.ts` was verified on the
   provider's own site on 2026-10-18; the extension stops showing any offer not
   re-checked within 183 days. Instarem's referral runs to 30 Nov 2026.
4. **Listing assets** are in `extension/store/`: five 1280×800 screenshots, the
   440×280 promo tile and a 1400×560 marquee (128 px icon is in the build). Chrome Web Store: one-time $5 developer
   fee, review usually a few days. Edge Add-ons: free, same zip.
5. **Listing copy** must follow the site's claim rules: no "cheapest", no scores,
   no provider count unless it says which count it is. Disclose affiliate links
   (the Settings sheet does).

Suggested short description (≤132 characters):
"See what money transfer providers pay out for your amount, convert at the
mid-market rate, follow rate charts and set rate alerts."
