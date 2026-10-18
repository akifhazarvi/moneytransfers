# Consent update — October 18, 2026

Implemented locally; not deployed. Compact bottom notice chosen by the owner. Accept and reject have equal prominence and 44px minimum button height. Settings allow analytics and session replay independently, with both initially off. Footer and cookie-policy controls reopen preferences. Choices last 180 days; withdrawal clears accessible first-party identifiers and reloads to stop running SDKs. Privacy signals override optional tracking.

Worldwide explicit opt-in replaces automatic geographic grants. Legacy automatic grants are not reused as explicit permission; legacy rejection remains respected. Google uses Basic Consent Mode, with no tag load or event replay before acceptance. Clarity requires its own replay choice and always receives denied advertising permission. Browser/server GA4, Vercel, activity recording and durable visitor IDs respect the analytics choice. AdSense is paused because analytics consent is not advertising consent; re-enabling ads requires an appropriate advertising CMP integration. Cookie and privacy descriptions were updated.

Daily aggregate consent counters store only date and action totals, with 90-day expiry; no visitor ID, page or referrer is stored in those counters. The existing Redis integration is configured locally, but production counter ingestion has not been verified. Read totals with:

```sh
node --env-file=.env.local scripts/report-consent-metrics.mjs
```

Acceptance rate is accepted / (accepted + rejected), for initial analytics decisions; updates are separate. Displays count notice renders, not unique people. Qualified redirects are operational signals, not accepted commissions. Establish a 28-day baseline after deployment, then test concise copy or placement while preserving equal choices. Do not promise a lift: fixing consent bypasses and automatic grants can initially reduce analytics counts.

Validation: 10 logic/server/CSP tests passed; 8 desktop/mobile browser tests passed; changed consent components passed lint. Type checking passed with stale generated `.next/dev/types` excluded. A full production build was not run. Browser tests used the actual cookie page/layout through a temporary local route because the ordinary development route loops through a locale redirect; that fixture was removed. Vendor calls were intercepted. Screenshots are in this directory.

Before release, confirm production CMP/Clarity account settings, SDK privacy configuration and production ingestion. Technical checks are not a legal certification or a full audit of all storage and third-party services.

References:
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- https://support.google.com/adsense/answer/13554116
