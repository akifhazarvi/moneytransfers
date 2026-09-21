# TapTap visibility and click measurement

The objective is more voluntary, relevant TapTap clicks from readers already researching transfers.

- Guides hub: dedicated paid feature before the guide collection; the lower provider grid offers alternatives.
- Reading bar: guides, consumer reviews, banks, travel, tools, research, news, rates and converters. Appears after half a viewport of scrolling (capped at 500px). Hidden around consent prompts, active inputs, and visible TapTap links. Dismissal lasts for the browser tab's session.
- Provider cards: TapTap has an explicit paid-spotlight label and a specific rate-check action.
- Comparison rankings and the outbound-click verification flow are unchanged.

## Measure by placement

Use `provider_cross_sell_viewed` with `placement=reading-bar`, `providers=taptap-send`, and source `taptap_reading:<page>`. Count `provider_clicked` for the same source. The guides hub uses `taptap_spotlight:guides-hub`; partner grids retain `partner_<placement>:<page>`.

Compare click-through rate per exposed session, unique qualified outbound clicks, and total TapTap clicks per site session. Watch total-site clicks so a new placement that merely relocates an existing click is not counted as growth. Segment by mobile/desktop and acquisition source; compare matching weekdays before and after release.

For redirect verification, inspect the existing server `affiliate_redirect` event's provider, source, click_id, genuine_click, is_bot, and outcome fields. Reconcile with the affiliate network's accepted-click report: browser clicks and verified redirects are diagnostic signals, not proof of payment.

At the owner's stated $1 per eligible click, estimated revenue is accepted clicks × $1. Do not assign $1 to impressions, automated test traffic, repeated button presses, or every raw redirect event. These placements do not auto-open, prefetch, or call the affiliate destination without a click.
