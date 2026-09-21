#!/usr/bin/env python3
"""
Remittance cost transparency study — reproduces every figure in
/guides/remittance-cost-transparency-study.

Method. Faisal Khan & Co's remittance cost calculator states the arithmetic a
transfer actually follows: charges come off the send side, and only what is
left gets converted. Our archive satisfies that identity to the cent, so for
every quote we can split true cost into the part a sender can read off a fee
schedule and the part buried in the exchange rate:

    receive = (send - fee) x rate
    true cost %   = 100 x (1 - receive / (send x midmarket))
    visible (fee) % = 100 x fee / send
    invisible (FX margin) % = markup against midmarket

Run:  python3 scripts/research/cost-transparency-study.py
Input: src/data/scraped/history/corridors/*.json  (per-day, per-provider)
"""
import json, glob, os, collections, statistics as st

ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "scraped")
# Payout currencies whose mid-market benchmark is unreliable because the
# official rate diverges from the rate transfers actually clear at. Leaving
# these in produces negative measured markups (USD-NGN reads -3.16%), which is
# a benchmark artifact, not a provider beating the market.
EXCLUDED_PAYOUT = ("NGN", "GHS")

# The published study is a frozen, dated measurement. The archive keeps growing,
# so the window is pinned here: without it this script would quietly return
# different numbers tomorrow than the article states, and the article's
# reproducibility claim would become false.
WINDOW = ("2026-03-13", "2026-09-21")


def load():
    rows = []
    for path in glob.glob(os.path.join(ROOT, "history", "corridors", "*.json")):
        corridor = os.path.basename(path)[:-5]
        if corridor.split("-")[-1] in EXCLUDED_PAYOUT:
            continue
        try:
            days = json.load(open(path))
        except Exception:
            continue
        for day in days:
            if not (WINDOW[0] <= day["date"] <= WINDOW[1]):
                continue
            for slug, q in day.get("providers", {}).items():
                fee, rate, markup, recv = q.get("fee"), q.get("rate"), q.get("markup"), q.get("receiveAmount")
                if None in (fee, rate, markup, recv) or rate <= 0:
                    continue
                send = recv / rate + fee          # invert the send-side identity
                if send <= 0:
                    continue
                visible = 100 * fee / send
                total = visible + markup - visible * markup / 100
                rows.append((corridor, day["date"], slug, visible, markup, total))
    return rows


def main():
    rows = load()
    vis = [r[3] for r in rows]
    inv = [r[4] for r in rows]
    tot = [r[5] for r in rows]
    print("observations %d | corridors %d | providers %d | days %d"
          % (len(rows), len(set(r[0] for r in rows)), len(set(r[2] for r in rows)), len(set(r[1] for r in rows))))
    print("date range %s .. %s" % (min(r[1] for r in rows), max(r[1] for r in rows)))
    print("median true cost %.2f%%   median FX margin %.2f%%" % (st.median(tot), st.median(inv)))
    print("VISIBLE SHARE OF COST: %.1f%%" % (100 * sum(vis) / (sum(vis) + sum(inv))))

    zero = [r for r in rows if r[3] < 0.001]
    print("\nzero-fee quotes %d (%.1f%%); median true cost %.2f%%; >3%%: %.1f%%; >5%%: %.1f%%; max %.1f%%"
          % (len(zero), 100 * len(zero) / len(rows), st.median([r[5] for r in zero]),
             100 * sum(1 for r in zero if r[5] > 3) / len(zero),
             100 * sum(1 for r in zero if r[5] > 5) / len(zero), max(r[5] for r in zero)))

    print("\nSDG 10.c limb 1 (<3%%): truly clear %.1f%% | LOOK clear on fee alone %.1f%% | pass-on-fee/fail-on-cost %.1f%%"
          % (100 * sum(1 for t in tot if t < 3) / len(tot),
             100 * sum(1 for r in rows if r[3] < 3) / len(rows),
             100 * sum(1 for r in rows if r[3] < 3 and r[5] >= 3) / len(rows)))

    # Crossover: send amount at which the FX margin overtakes the flat fee.
    # History is priced at $100, so the median visible % equals the fee in dollars.
    by = collections.defaultdict(list)
    for _, _, p, v, m, _t in rows:
        by[p].append((v, m))
    print("\nCROSSOVER — send amount where the invisible margin overtakes the flat fee")
    print("%-20s%8s%9s   %s" % ("provider", "fee$", "margin%", "crossover"))
    for p, v in sorted(by.items(), key=lambda x: -len(x[1])):
        if len(v) < 300:
            continue
        f = st.median([a for a, b in v]); m = st.median([b for a, b in v])
        if f == 0 and m > 0:
            lab = "$0 - the margin is the entire cost"
        elif m <= 0.01:
            lab = "n/a (no measurable margin)"
        else:
            lab = "${:,.0f}".format(f / (m / 100))
        print("%-20s%8.2f%9.2f   %s" % (p, f, m, lab))

    # Does the lowest advertised fee identify the cheapest transfer?
    cd = collections.defaultdict(list)
    for cor, d, p, v, m, t in rows:
        cd[(cor, d)].append((p, v, t))
    agree = penalties = 0
    loss = []
    for v in cd.values():
        if len(v) < 3:
            continue
        by_fee = min(v, key=lambda x: (x[1], x[2]))
        by_cost = min(v, key=lambda x: x[2])
        if by_fee[0] == by_cost[0]:
            agree += 1
        else:
            penalties += 1
            loss.append(by_fee[2] - by_cost[2])
    n = agree + penalties
    print("\ncorridor-days with >=3 providers: %d" % n)
    print("lowest fee picks the cheapest transfer %.1f%% of the time (misleads %.1f%%)"
          % (100 * agree / n, 100 * penalties / n))
    print("median penalty when misled %.2f%% (= $%.2f on $5,000); 75th pct %.2f%%"
          % (st.median(loss), 50 * st.median(loss), st.quantiles(loss, n=4)[2]))
    corridor_and_availability(rows)
    decay()


def corridor_and_availability(rows):
    """Figures the article cites that the summary above does not emit."""
    # Zero-fee availability: when a fee-free option was on the table, how often
    # was paying a fee actually cheaper?
    cd = collections.defaultdict(list)
    for cor, d, p, v, m, t in rows:
        cd[(cor, d)].append((p, v, t))
    offered = beaten = 0
    for v in cd.values():
        if len(v) < 3 or not [x for x in v if x[1] < 0.001]:
            continue
        offered += 1
        if min(v, key=lambda x: x[2])[1] >= 0.001:
            beaten += 1
    print("\nZERO-FEE AVAILABILITY")
    print("corridor-days offering a fee-free option (>=3 providers): %d" % offered)
    print("  ...where a fee-charging provider was cheaper anyway: %.1f%%" % (100 * beaten / offered))

    # SDG 10.c limb 2: corridors above 5%, and how much of that is hidden.
    byc = collections.defaultdict(list)
    for cor, d, p, v, m, t in rows:
        byc[cor].append((v, m, t))
    med = {c: st.median([x[2] for x in v]) for c, v in byc.items() if len(v) >= 100}
    over5 = sorted([c for c, x in med.items() if x > 5], key=lambda c: -med[c])
    print("\nSDG 10.c limb 2 (>5%%): %d of %d corridors judged" % (len(over5), len(med)))
    print("%-12s%12s%10s%18s" % ("corridor", "true cost", "as fee", "invisible share"))
    for c in over5:
        v = byc[c]
        f = st.median([x[0] for x in v]); m = st.median([x[1] for x in v])
        print("%-12s%11.2f%%%9.2f%%%17.0f%%" % (c, med[c], f, 100 * m / (f + m) if f + m else 0))

    # How settled is "the cheapest provider" on a corridor?
    cc = collections.defaultdict(dict)
    for cor, d, p, v, m, t in rows:
        cc[cor].setdefault(d, []).append((p, t))
    churn = []
    for c, days in cc.items():
        seq = [min(v, key=lambda x: x[1])[0] for d, v in sorted(days.items()) if len(v) >= 3]
        if len(seq) < 60:
            continue
        churn.append((len(set(seq)), sum(1 for i in range(1, len(seq)) if seq[i] != seq[i - 1]), len(seq)))
    print("\nLEADER CHURN (%d corridors with >=60 comparable days)" % len(churn))
    print("median distinct winners %d; median lead changes %d over a median %d days"
          % (st.median([a for a, b, c in churn]), st.median([b for a, b, c in churn]),
             st.median([c for a, b, c in churn])))

    # The send-side identity, on the day the article quotes.
    path = os.path.join(ROOT, "history", "corridors", "USD-INR.json")
    day = json.load(open(path))[0]
    print("\nSEND-SIDE IDENTITY CHECK - USD to INR, $100, %s" % day["date"])
    print("%-14s%8s%11s%13s%13s" % ("provider", "fee", "rate", "model says", "actual"))
    for p, q in day["providers"].items():
        print("%-14s%8.2f%11.4f%13.2f%13.2f"
              % (p, q["fee"], q["rate"], (100 - q["fee"]) * q["rate"], q["receiveAmount"]))


def decay():
    # Amount decay, measured rather than modelled: live quotes from the same
    # provider, corridor, source and day priced at more than one send amount,
    # restricted to series whose fee is genuinely flat across amounts.
    series = collections.defaultdict(dict)
    for path in glob.glob(os.path.join(ROOT, "*-quotes.json")):
        try:
            data = json.load(open(path))
        except Exception:
            continue
        if not isinstance(data, list):
            continue
        for q in data:
            if not isinstance(q, dict) or q.get("source") == "remitroutes-bridge":
                continue          # that source prices fees as a flat percentage
            send, fee = q.get("sendAmount"), q.get("fee")
            mid, recv = q.get("midMarketRate"), q.get("receiveAmount")
            if not send or fee is None or not mid or not recv or mid <= 0:
                continue
            if q.get("receiveCurrency") in EXCLUDED_PAYOUT:
                continue
            key = (q.get("providerSlug"), q.get("sendCurrency"), q.get("receiveCurrency"), q.get("source"))
            series[key][send] = (fee, 100 * (1 - recv / (send * mid)))
    flat = {k: v for k, v in series.items()
            if len(v) >= 2 and len(set(f for f, _ in v.values())) == 1 and list(v.values())[0][0] > 0}
    agg = collections.defaultdict(list)
    for v in flat.values():
        for amount, (fee, total) in v.items():
            if total > -5:
                agg[amount].append((100 * fee / amount, total))
    print("\nAMOUNT DECAY (%d flat-fee series, same provider/corridor/day)" % len(flat))
    print("%9s%7s%10s%11s%15s" % ("amount", "n", "fee%", "true cost%", "visible share"))
    for amount in sorted(agg):
        v = agg[amount]
        if len(v) < 20:
            continue
        f = st.median([a for a, b in v]); t = st.median([b for a, b in v])
        print("%9s%7d%10.3f%11.3f%14.1f%%" % (amount, len(v), f, t, 100 * f / t if t > 0 else 0))


if __name__ == "__main__":
    main()
