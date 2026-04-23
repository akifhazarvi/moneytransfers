# Trustpilot Review Request — Email Template

## Context
- Current Trustpilot profile: trustpilot.com/review/sendmoneycompare.com
- Score: 3.8/5 · 3 reviews (as of 2026-04-19 audit)
- Goal: cross 20+ reviews to pass Perplexity's discoverability threshold
- Why it matters: ChatGPT already surfaces our Trustpilot profile. Perplexity does not — more reviews unlock Perplexity citations.

## Who to send to
1. **Weekly digest subscribers** — highest-intent cohort, already opted in
2. **Users who clicked out via `/go/[provider]`** — we have `trackAffiliateRedirect` events in GA4 — export the `client_id`s that fired `affiliate_redirect` + `email_captured` in the last 60 days
3. **Rate-alert subscribers** — they signed up for ongoing value, most likely to return a positive sentiment

Send 48–72 hours after the user completed a comparison or set an alert, not immediately.

## Send-time rules
- Once per subscriber, ever
- Skip anyone who hit `/unsubscribe` or has an `unsubscribed` flag
- Cap at 50 sends/day so Trustpilot doesn't flag as a campaign burst (they throttle invitations that arrive in unnatural spikes)

## Email A — Weekly-digest subscribers

**Subject:** Quick favour? (it takes 30 seconds)

**Body:**

Hi {{firstName}},

You've been getting our weekly rate digest for {{weeksSubscribed}} weeks now, and I wanted to ask a small favour.

If SendMoneyCompare has helped you save money on a transfer — or just saved you 20 minutes of tab-hopping between Wise, Revolut, and your bank — a Trustpilot review would mean a lot.

It takes about 30 seconds:

👉 https://www.trustpilot.com/evaluate/sendmoneycompare.com

You don't need a long review. One honest sentence about what worked (or didn't) is more useful than a paragraph. Critical feedback is fine — I'd rather know than not.

Why it matters: Trustpilot reviews are how ChatGPT, Perplexity, and Google decide whether we're legit. Right now we're invisible to a lot of AI search results despite comparing more providers than anyone else in the UK. Your review literally changes that.

Thanks for reading,
Akif
Founder, SendMoneyCompare.com

---

## Email B — Post-conversion trigger (72h after /go/ click)

**Subject:** Did {{providerName}} work out?

**Body:**

Hi {{firstName}},

A few days ago you compared providers on SendMoneyCompare and clicked through to {{providerName}}.

I'm curious — did the transfer go smoothly? Did the rate match what we showed?

If you have 30 seconds, could you leave a quick note on Trustpilot? Even one line ("saved me £12 vs my bank", "rate was accurate", "wish they had cash pickup") helps more people find the tool.

👉 https://www.trustpilot.com/evaluate/sendmoneycompare.com

If something went wrong — please tell me directly. Just reply to this email. I read everything.

Akif
sendmoneycompare.com

---

## Email C — Rate-alert subscribers (after alert fires)

**Subject:** Your {{from}}→{{to}} alert just triggered — quick question

**Body:**

Hi {{firstName}},

Your {{from}}→{{to}} rate alert fired this morning at {{rate}}. Hope you managed to lock it in.

One quick question: how's the tool working for you?

If it's saved you money or time — or even if you've hit bugs — a quick Trustpilot review would really help me grow this:

👉 https://www.trustpilot.com/evaluate/sendmoneycompare.com

Honest feedback preferred. One sentence is plenty.

Akif
Founder, SendMoneyCompare.com

---

## Target cadence
- Week 1: 50 Email A to weekly-digest subs
- Week 2: 50 Email B to post-conversion users
- Week 3: 50 Email C to alert subscribers
- Week 4: re-send to non-openers (different subject line)

## Success metrics
- Reviews: 3 → 20+ by 2026-06-01
- Average rating: stay above 3.8 (don't send to users who had a bad experience without first resolving it)
- Perplexity citation test: rerun `scripts/check-ai-citations.ts` when review count hits 15+
