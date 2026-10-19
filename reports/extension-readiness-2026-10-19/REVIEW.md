# Chrome extension readiness review — 19 October 2026

Verdict: the core popup is ready for controlled release testing. Do not treat this review as Chrome Web Store approval or complete validation of every provider integration. Updated release artifact: `extension/sendmoneycompare-extension-1.0.0.zip`. Changes are local, not published.

## Fixed

- Usage analytics now rechecks consent before sending, clears queued events and cached identity when another extension context opts out, and respects GPC/DNT.
- Replaced misleading “anonymous usage” wording: optional events include a persistent random browser identifier. Aligned welcome, settings, listing and website privacy wording.
- Settings and other sheets trap keyboard focus, make the background inert, close on Escape and restore focus. Tabs are associated with their panels.
- Offline or stale rate snapshots no longer trigger new rate alerts. Cached comparisons remain available offline.
- Revoking provider permissions stops price-check observers in already-open tabs. Turning detection off or hiding a site also cleans up listeners, timers and the panel.
- Invalid calculator input and failed comparisons clear stale price-check panels. Late responses cannot overwrite a newer comparison.
- Background comparison messages validate amount and supported currency pairs.

## Verified

`node --test scripts/test-extension-readiness.mjs`: three passing regression tests covering consent revocation, GPC/DNT, and stale/offline alert suppression.

`node scripts/test-extension.mjs`: production compare rows and payout, converter, period changes, offers, live activity, toolbar badge and alert state passed. Popup requests stayed on sendmoneycompare.com and initial functional checks reported no console errors. Keyboard dialog behavior, 380px horizontal fit, and cached comparison after an offline reload passed. Affiliate redirects were blocked by the test so no provider click was recorded.

Extension build succeeded. JavaScript syntax checks and `git diff --check` passed. Release zip contains a Manifest V3 manifest with no required host permissions; notifications and provider access are optional. The zip contains 169 files. No full website build was run for the privacy-copy edit.

## Design assessment

The amount/payout hierarchy, four-tab navigation, light/dark themes and action buttons are coherent. Captures: [light popup](compare-light.png), [dark popup](compare-dark.png), [settings, scrolled to bottom by keyboard test](settings.png).

The main conversion opportunity is density: at 380×600, insight cards and the fixed activity strip leave only the first provider visible. Next design experiment: collapse timing/history insights behind a “Transfer insights” disclosure and compare provider-row visibility and Send-click rate. Retain the clear recipient payout and rate timestamp. This is a proposed experiment, not a measured lift.

## Before public release

1. Exercise real Wise, Remitly, Western Union and Xoom calculators with the optional permission flow, SPA navigation, changed currencies, denied/revoked access and unavailable quotes. This review hardened that code but did not rerun the live provider suite or certify all supported sites.
2. Check notification permission denial, browser restart/service-worker wakeup and native notifications in a normal Chrome profile; the automated test verifies alert state, not OS delivery. Test Edge separately before claiming equivalent support.
3. Deploy the revised website privacy copy together with the extension release. Review actual Chrome Web Store privacy categories and permission declarations against the submitted build. No dashboard submission or store-account verification was performed.
4. Review all store images against the final build. A concurrent workspace change renamed the price-check screenshot; it was preserved. Ensure screenshot claims and the supported-provider list match actual behavior.
5. After a limited rollout, monitor API errors, empty comparisons, permission failures and voluntary analytics opt-in. Measure useful outcomes (first successful comparison, return usage, provider clicks); do not infer growth from acceptance rate alone.

Chrome requires accurate user-data disclosure and appropriate permission scope; review against its [user-data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq) and [permission guidance](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions). Manifest V3 code must follow [extension security requirements](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security). These references inform the checks; they do not constitute store approval.

## Addendum: follow-up the same day

- `analytics.js` `flush()` is synchronous again. A Send tap opens a tab and closes the popup at once, so nothing should be awaited between the tap and the send. An opt-out in another context still reaches every context through `storage.onChanged` (`revoke()`), which this review added. A test that tapped Send and closed the page at once delivered `provider_clicked` with both versions, so this is a precaution, not a reproduced loss.
- `setAnalytics()` returns what it saved. Under GPC/Do Not Track a "yes" is saved as off, and the welcome page, Settings and the popup's ask card now say so instead of "Thank you".
- `test-extension.mjs` writes screenshots only with `--screenshots=<dir>`, and waits for `content.js` to be registered before visiting provider pages. Without that wait, a page opened in the first second after install never got the price check, which looked like a vanishing panel.
- Privacy copy: Send-click analytics identifiers follow the site's analytics choice. The site now asks only where the law requires it (`consent.ts`, owner decision 2026-10-18), so "only if you have accepted analytics" was no longer true outside Europe. The extension's own usage events stay opt-in everywhere.
- Release item 1, rerun: `npm run test:extension:price-check` passed all 23 checks. That covers the production popup, the review's keyboard, fit and offline checks, and the price check on the live Wise, Remitly, Xoom and Western Union pages. On Remitly's live calculator, typing $5,000 into its own field updated the panel to "$5,000 → INR: Remitly shows ₹476,750.00 … the most of the 21 providers we compare". Still manual: the permission prompt flow, denial and revocation, notification delivery, browser restart, and Edge.
- Noted, not changed: the expanded card covers the right edge of Remitly's calculator, including its currency pickers. The reader opens it and it collapses with one click.
