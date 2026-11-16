# Header and extension discovery review — 16 November 2026

## Implemented

| Finding | Change | Reach |
| --- | --- | --- |
| Seven competing navigation destinations crowded the header; the install label disappeared at intermediate desktop widths. | Group secondary destinations under Resources; keep a filled, labelled install action from 640px upwards, with the menu below that width. | Shared header |
| A language control offered only English. | Remove the redundant control and retain the theme toggle. | Shared header |
| Developer tools were missing from primary navigation. | Add Developers directly on desktop and to the mobile menu. | All pages using Header |
| Visitors could open the store without first learning the extension's benefits or required setup. | Add an explicitly opened overview covering comparisons, rate alerts, optional site access, pinning and price-check setup. | Desktop navigation, mobile menu, footer |
| Extension and API discovery at the end of a page was limited to text links. | Add two clear product cards with descriptive actions. | Shared footer |
| Navigation lacked expanded state, Escape dismissal and constrained mobile height. | Add expanded/control semantics, Escape focus return, outside-click dismissal and scrollable mobile navigation. Use a native modal dialog for the extension overview. | Shared navigation |
| Install confirmation required a new page load after returning from the store. | Recheck on focus/visibility changes, deduplicate concurrent checks and update the open overview as installation is detected. | Extension install journey |
| In-flow extension copy did not explain optional price-check setup. | State that on-page price checks must be enabled; keep the toolbar comparison benefit visible. | Existing install offer placements |

## Verification

- Seven representative pages (`/`, `/send-money`, `/companies`, `/exchange-rates`, `/guides`, `/business`, `/developers`) returned 200 and had no document overflow at 390px and 1280px.
- Navigation additionally checked at 320, 390, 768, 1024, 1200 and 1440px.
- Existing extension and desktop install suite: 11 passed.
- New header/overview suite: 5 passed; desktop-extension confirmation test intentionally skipped on Android.
- Desktop/mobile web-app installation entry points: 4 passed. Total: 20 passed, 1 intentionally skipped.
- TypeScript and whitespace checks pass.
- Store opening is tested with a stubbed store page. No actual installation or real visitor conversion increase is claimed.
- This review covers the shared UI and representative page families; it is not an exhaustive visual inspection of every generated route.

## Measure after release

Existing store links retain `site_install` campaign attribution. New overview placements are `header_details`, `mobile_details` and `footer_details`; the direct header install keeps `header`.

Compare store visits and confirmed installs before and after release, accounting for traffic volume. Use `extension_offer_shown`, `extension_offer_clicked` and `extension_install_confirmed` for the explicit overview journey. Confirmed installs require the extension to answer detection on the same browser. The store dashboard remains the source for total installs; a store click is not an installation.
