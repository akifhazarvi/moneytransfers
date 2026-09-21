# SendMoneyCompare design language

Conversion is the primary product goal: help readers choose a transfer, understand the recipient amount, and continue confidently to the provider. Apply the same visual language to comparison results, guide recommendations, and provider placements.

## Shared foundations

Use the existing surface, outline, and text variables from `src/app/globals.css` for light and dark modes. Conversion components live in `src/app/conversion.css`. Use the site's sans-serif font, quiet neutral backgrounds, strong amount typography, and green primary actions (#166344 with white text). Do not create page-specific button systems.

- Headings: 32–56px on the comparison hero; 24px in feature cards; 18px for providers. Tight tracking, weight 600.
- Body: 14–16px; supplementary data 12–13px. Financial amounts use tabular numerals.
- Cards: 24px corners and padding on desktop; 20px on mobile. Space between distinct decisions instead of nested decorative panels.
- Actions: at least 48px high; one primary outbound action per provider. Secondary review and details links stay visually quieter.
- Accessibility: visible keyboard focus, labelled inputs, expandable details with ARIA state, and reduced-motion support. No horizontal page overflow at 390px.

## Journey

1. `/send-money`: concise purpose, amount and currencies, explicit Compare transfers action.
2. Results: provider identity → recipient amount → fee/rate/delivery → continue with provider. Details and side-by-side comparison are optional.
3. Guides: answer the question first, then offer a clearly disclosed TapTap spotlight with a review link. Retain substantive editorial content and internal links.
4. Partner placements across the site share the same typography, card proportions, and action treatment.

Paid placement is separate from measured results. The Best value badge is reserved for the first result under the default ranking. Quote values come from the same quote data as comparisons; never claim universal free fees or instant delivery. Always name currencies on illustrative guide quotes.

## Research and measurement

[Apple layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout) informed alignment, hierarchy, and consistency—not a copied Apple interface. [TapTap's fee guidance](https://taptapsend.zendesk.com/hc/en-gb/articles/45247485548051-Fees-you-pay-sending-with-Taptap-Send) supports route-specific fee wording. [Google link guidance](https://developers.google.com/search/blog/2021/07/link-tagging-and-link-spam-update) supports sponsored affiliate links.

Use existing `compare_search`, provider-click, and cross-sell events to evaluate the funnel. Spotlight impressions fire once when half of the unit is visible; compare their clicks and review visits by placement and route. Measure outbound clicks per comparison session and paid-spotlight clicks per visible impression. Search Console impressions and clicks are a separate acquisition measure: internal links and useful content can support discovery, but placement changes do not establish ranking or conversion gains. Provider-side completed transfers require affiliate reporting.
