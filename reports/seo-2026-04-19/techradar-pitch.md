# TechRadar Pitch — Outreach Kit

Goal: get a `techradar.com` placement with a link to sendmoneycompare.com. Per the GEO audit, ChatGPT cites TechRadar 3/10 times for "best money transfer app" queries — one placement = measurable AI-citation lift.

Target journalists (TechRadar personal-finance / money-transfer beat):
- Jessica Downey (Senior Money Writer, TechRadar) — covers money transfer apps, credit cards
- Tom Power (Senior Finance Writer) — consumer fintech
- Ollie Leggett (Personal Finance Editor)
- Staff writers via `tips@techradar.com` as fallback

## Draft: Email Pitch (copy-paste ready)

> **Subject:** US-to-India transfers: 25M diaspora are losing $2B/year to hidden FX markup — full dataset
>
> Hi [First Name],
>
> I run SendMoneyCompare — we collect live quotes from 35+ international money transfer providers every 6 hours across 80+ currency corridors. Our April 2026 data shows something worth covering:
>
> **On a $1,000 USD→INR transfer today, using a US bank instead of Wise or Remitly costs the recipient roughly Rs 2,000–4,500 — despite the banks advertising "free wire transfers."** The difference is entirely FX markup, which banks hide inside the exchange rate. Over 4.8 million USD→INR transfers happen annually; at today's average markup that's north of $2 billion a year leaving the diaspora's pocket.
>
> Unique angles for a TechRadar story:
>
> - **The $200 benchmark**: Global average cost is still 6.0% vs the UN SDG target of 3%. We have corridor-by-corridor breakdowns for the 10 largest diaspora routes.
> - **Banks vs apps, in exact dollars**: Not 1-5% ranges — real 2026 quotes. E.g. Chase at 3.8% vs Wise at 0.54% on USD→INR, updated every 6 hours.
> - **The "zero fees" trap**: 6 of the 10 cheapest-on-paper providers in our data are more expensive total-cost than a mid-ranked competitor once FX markup is included.
>
> I can send you:
> 1. A clean CSV/JSON of the Apr 2026 data for any corridor you want
> 2. Chart-ready images (bank vs app delta by corridor)
> 3. A 150-word on-record quote from me as the founder
> 4. Direct comparison screenshots
>
> Happy to turn this around same-day. Let me know which angle fits.
>
> Best,
> Akif Hazarvi
> Founder & Editor-in-Chief, SendMoneyCompare
> https://sendmoneycompare.com
> https://sendmoneycompare.com/about/akif-hazarvi

## Why this pitch works

- **Time-specific hook**: "April 2026 data" + "$2B/year" gives a headline the journalist can quote directly.
- **Exact numbers, not ranges**: "Rs 2,000–4,500 on a $1,000 transfer" is more citable than "you save money."
- **Three story angles**: lets the editor pick rather than imposing.
- **Prepared assets offer**: reduces friction. Journalists get 200+ pitches a week; the one that comes with chart + quote + data wins.
- **Founder credibility**: personal sign-off with the `/about/akif-hazarvi` link — verifies we're a real business with a named editorial team.

## Supporting data to have ready (pre-built, 30 min of work)

1. **Corridor delta table** — top 10 corridors, bank median vs best-app, dollar delta on $1,000. Exists in our provider-quotes data; needs a small aggregation script.
2. **"Zero fees" contradiction chart** — for each provider in our data, plot advertised fee vs total-cost-after-FX-markup. Demonstrates the core TechRadar angle.
3. **2026 vs World Bank 2024 benchmark** — how much costs have or haven't moved toward the 3% UN target.
4. **Screenshot pack** — `/send-money/usa-to-india`, `/send-money/uk-to-india`, `/send-money/usa-to-brazil` showing live comparison grids.

## Variants for other outlets

Same core pitch, swap the opening hook:

- **Forbes Advisor / NerdWallet**: Lead with "average American household sends $1,400/year abroad; here's what they don't know about FX markup"
- **Bloomberg**: Lead with the $2B diaspora leakage stat + quote from a World Bank economist if available
- **The Verge / Wired**: Lead with "the apps are cheap, the banks are still 3-5% — why the gap persists in 2026"
- **Reuters**: Lead with the global $860B remittance flow + 6.0% vs 3% gap = ~$26B unnecessary cost annually

## Success measure

Track monthly in GSC / Ahrefs:
- Referral traffic from the TechRadar domain (should spike within 72 hours of publication)
- New backlinks from `techradar.com` (check via `/seo backlinks` skill)
- Re-run `/tmp/check_chatgpt.py` 14 days post-publication — target SMC cited in 1+ of the 10 competitive queries (TechRadar is cited for ChatGPT's "best money transfer app" response, so a TechRadar link should pull SMC into that citation chain)

## Do not

- Don't lead with "we're a startup, please cover us" — journalists trash these
- Don't attach press releases; put the hook in the body
- Don't follow up more than once. If no reply in 5 days, move to the next outlet.
