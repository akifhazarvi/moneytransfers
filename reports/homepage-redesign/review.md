# Homepage conversion redesign

30 September 2026. Implemented locally; no conversion uplift claimed.

## Visual hierarchy

1. A concise promise and explanation of the comparison service.
2. The working amount/currency tool, with a green **Compare transfers** action.
3. An estimated recipient amount, provider count for the selected route and clear quote limitations.
4. The provider handoff explained in supporting content, without repeating steps in the hero.
5. Route-specific quote results and existing disclosed sponsorship.
6. Separate paths for high-value transfers, business payments and cost research.
7. Existing provider information, methodology, guides and FAQs for readers who need more evidence.

The neutral hero, larger amount typography and restrained supporting copy make the comparison form the central visual element. Cards share the site's surface colours and 24px corners. Mobile stacks the message and tool; the primary comparison button is visible within a 900px-high viewport at the five tested widths.

## Content and usability fixes

- “Recipient gets · estimated” explains what the displayed number represents.
- The final rate, fee and delivery time must be confirmed with the provider.
- The amount label is associated with its input. Invalid values receive actionable, announced feedback instead of a silent submit failure. The approach follows [W3C's form-label guidance](https://www.w3.org/WAI/tutorials/forms/labels/).
- The results no longer claim a fixed “Updated 6h ago” timestamp.
- Fees identify the sending currency; zero transfer fees do not imply a free overall transfer.
- Result differences are described as recipient-amount differences for the current comparison.
- The results CTA uses the route's actual option count rather than site-wide provider coverage.
- Guidance cards make business and high-value journeys visible without changing the primary form.
- The generic guide section no longer makes an unverified “most-read” claim.
- Existing headline translations, metadata, substantive editorial sections, sponsored placements, analytics events and PWA installation flow are retained.

## Measurement

Primary metric: sessions with a provider click after a homepage comparison search. Also measure search submissions per homepage session, successful result views, errors and time to first comparison. Segment by device, corridor and amount band; compare equivalent traffic or run a randomized experiment. Outbound clicks are not completed transfers: the latter require provider reporting.

## Verification

TypeScript and targeted lint passed. Desktop and Android-sized browser tests cover the amount carried into results, analytics, invalid-input recovery and guidance destinations. Responsive screenshots cover 320, 390, 768, 1024 and 1440px, including dark mode; all measured layouts have no document-level horizontal overflow.

Browser checks use the isolated local preview described in the previous PWA review because the regular local middleware has a redirect loop. They verify rendered layouts and interactions, not production middleware, field performance or native device behaviour. A production build and deployment have not been performed for this change.

## Previews

- [Mobile](home-390.png)
- [Desktop](home-1440.png)
- [Dark mode](home-1024.png)
- [Mobile guidance cards](paths-390.png)
- [Desktop guidance cards](paths-1440.png)

The final pass shortened the hero to one sentence, removed the duplicate process strip and repeated handoff footnote, and shortened the guidance cards. Detailed explanations remain below the working comparison.

## Release checks

Before pushing: TypeScript, targeted ESLint, claims validation and diff whitespace checks passed. All eight homepage browser scenarios passed across the final run and retry. One desktop navigation check exceeded the 60-second limit during a slow local render; it passed on the targeted retry in 7.4 seconds. Refreshed screenshots reflect the shortened hero. Primary-action bottom coordinates at 320/390/768/1024/1440px widths were 754/684/738/487/487px in a 900px-high viewport, with no horizontal overflow.
