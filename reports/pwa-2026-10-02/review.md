# PWA diagnosis and minimal sitewide installation

Reviewed and implemented October 2, 2026. Changes are local; not deployed.

## Diagnosis

The live `/sw.js` returned 200 with JavaScript content type, root scope permission,
and no-cache headers. The manifest returned the expected identity, standalone
display, start URL and icons. An actual Chromium session on `/guides` reported
zero `Page.getInstallabilityErrors`, an active controlling service worker and no
uncaught page errors. The same checks passed on the local production build.
This does not reproduce a universal inability to install: device-specific failures
remain possible, and a native installation on the user's device was not observed.

The source did contain several ways for installation to appear broken:

- Worker registration waited for window load, which can be delayed by an unrelated
  resource. It now registers at idle after hydration, with a two-second idle timeout.
- A visible offer slot was not rechecked when the browser delivered a late install
  event, the connection returned, or consent was answered. Those changes now retry
  the existing eligibility checks.
- Client-rendered slots were only discovered on other activity. A scoped mutation
  observer now discovers them without requiring another scroll.
- Rejection of the browser's one-use install event escaped without recovery. The
  action now opens browser-specific instructions if that event fails.
- The legal-page exclusion used `/privacy` rather than the actual `/privacy-policy`.

## Sitewide integration

Keep the header and mobile-menu install entries. Add a quiet **Add to your device**
footer button on every page where installation is supported. This explicit action
remains available after dismissing an automatic offer and works without a captured
native prompt by opening the existing browser instructions.

Use the existing contextual slots after comparisons or reading, with the shared
end-of-content slot as a fallback on other pages. Render one compact card: app icon,
title, one benefit sentence, Install/Show me how, and Not now. No automatic modal or
fixed overlay. All installation surfaces use the same manager and browser guidance.

Automatic offers retain the second-view and four-second engagement rules, at most
once per session, a 30-day dismissal, and suppression while offline, entering a
visible field, awaiting consent, or using an installed app. Unsupported browsers
do not receive an install action. Legal pages keep the explicit action but no
automatic offer. Chromium automatic offers require its install event; Safari uses
the manual Home Screen/Dock instructions.

Browser-specific behavior follows [web.dev's install guidance](https://web.dev/articles/customize-install)
and [MDN's beforeinstallprompt documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event).
The site cannot force a browser to provide a native install prompt.

## Verification

- Production build and prebuild/postbuild guards passed.
- TypeScript, targeted ESLint and diff whitespace checks passed.
- 76 browser scenarios passed: 72 existing/updated and recovery scenarios, plus
  four additional late-content and stalled-load checks on desktop/Android Chromium.
- Tests cover actual service-worker control, offline saved pages and fallback,
  freshness labels, manifest/assets, install recovery, dismissal, placement,
  consent, and installed-app behavior. Native prompt outcomes are simulated;
  Safari/iPhone guidance is exercised through user-agent simulation in Chromium.
- Actual Chromium installability checks passed locally and on the live site.
- Screenshots at 320, 390, 768 and 1440 pixels showed no card or page overflow.
  Card heights were about 168, 131, 78 and 78 pixels respectively; 390px uses dark mode.
- [Narrow mobile preview](install-320.png), [dark mobile preview](install-390.png),
  [tablet preview](install-768.png), [desktop preview](install-1440.png).

No deployment, native device installation, affiliate visit, or conversion uplift is
claimed. Existing unrelated untracked data was preserved; unrelated build-generated
file changes were restored to their starting contents.
