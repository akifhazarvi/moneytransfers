#!/usr/bin/env python3
"""
Emits the inline SVG figures used by /guides/remittance-cost-transparency-study.

The charts are generated from the study's own outputs rather than drawn by hand,
so a figure cannot drift from the number it illustrates. Re-run after changing
the study and paste the output back into src/data/blog-cost-transparency.ts.

Design: no client JS and no chart library (a client bundle on a guide page is
what put 33.5 MB of JS on /send-money once). Colors are the site's own
--chart-* / --color-* tokens, which already carry dark-mode overrides, so the
figures re-theme with the page.
"""
import math

W, PAD_L, PAD_R = 760, 96, 76
BAR_W = W - PAD_L - PAD_R
FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif"
VIS, INV = "var(--chart-1)", "var(--chart-2)"
INK, MUTED = "var(--color-on-surface)", "var(--color-on-surface-variant)"


def head(h, title, desc):
    return (f'<svg viewBox="0 0 {W} {h}" width="100%" height="auto" role="img" '
            f'aria-labelledby="t{h} d{h}" xmlns="http://www.w3.org/2000/svg" '
            f'style="max-width:100%;height:auto;font-family:{FONT}">'
            f'<title id="t{h}">{title}</title><desc id="d{h}">{desc}</desc>')


def txt(x, y, s, size=13, fill=INK, anchor="start", weight="400"):
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" font-weight="{weight}">{s}</text>')


def chart_decay():
    """Composition of cost at $100 vs $1,000 — the study's central finding."""
    rows = [("$100", 63.0, 37.0, "3.16%"), ("$1,000", 17.9, 82.1, "1.11%")]
    h, bh, top = 252, 54, 62
    out = [head(h, "Share of transfer cost that is visible, by send amount",
                "On $100 the disclosed fee is 63% of true cost and the exchange-rate "
                "margin 37%. On $1,000 the fee is 17.9% and the margin 82.1%.")]
    out.append(txt(0, 20, "What you can see, and what you cannot", 15, INK, weight="600"))
    out.append(txt(0, 40, "Share of a transfer's true cost, by amount sent", 12.5, MUTED))
    for i, (label, vis, inv, total) in enumerate(rows):
        y = top + i * (bh + 30)
        vw = BAR_W * vis / 100
        out.append(txt(PAD_L - 12, y + bh / 2 + 5, label, 14, INK, "end", "600"))
        out.append(f'<rect x="{PAD_L}" y="{y}" width="{vw:.1f}" height="{bh}" fill="{VIS}" rx="3"/>')
        out.append(f'<rect x="{PAD_L + vw:.1f}" y="{y}" width="{BAR_W - vw:.1f}" height="{bh}" fill="{INV}" rx="3"/>')
        out.append(txt(PAD_L + 10, y + bh / 2 + 5, f"{vis}% fee", 13.5, "#fff", weight="700"))
        out.append(txt(PAD_L + vw + 10, y + bh / 2 + 5, f"{inv}% exchange-rate margin", 13.5, "#fff", weight="700"))
        out.append(txt(PAD_L, y + bh + 17, f"true cost {total}", 12, MUTED))
    out.append(txt(PAD_L, h - 6, "Same providers, same corridors, same days — 241 flat-fee quote series.", 11.5, MUTED))
    return "".join(out) + "</svg>"


def chart_sdg():
    """SDG 10.c pass rate, split by whether the quote survives the margin."""
    h, bh, top = 250, 62, 92
    clear, false_pass = 60.8, 20.4          # 80.8 look compliant; 60.8 truly are
    fails = 100 - clear - false_pass
    out = [head(h, "Share of quotes meeting the UN's 3% remittance cost target",
                "60.8% of quotes are genuinely under 3%. A further 20.4% clear 3% on the "
                "disclosed fee but fail once the exchange-rate margin is counted. 18.8% "
                "fail on either measure.")]
    out.append(txt(0, 20, "One in five transfers meets the UN target only on paper", 15, INK, weight="600"))
    out.append(txt(0, 40, "Every quote scored against SDG 10.c's 3% ceiling, twice", 12.5, MUTED))
    segs = [(clear, VIS, "Genuinely under 3%", f"{clear}%"),
            (false_pass, INV, "Passes on the fee, fails on true cost", f"{false_pass}%"),
            (fails, "var(--color-on-surface-muted)", "Over 3% either way", f"{round(fails,1)}%")]
    x = PAD_L
    for i, (pct, col, label, val) in enumerate(segs):
        w = BAR_W * pct / 100
        out.append(f'<rect x="{x:.1f}" y="{top}" width="{w:.1f}" height="{bh}" fill="{col}"/>')
        out.append(txt(x + w / 2, top + bh / 2 + 6, val, 15, "#fff", "middle", "700"))
        ly = top + bh + 24 + (i % 2) * 20      # stagger so labels never collide
        out.append(f'<line x1="{x + w / 2:.1f}" y1="{top + bh + 4}" x2="{x + w / 2:.1f}" '
                   f'y2="{ly - 10}" stroke="var(--color-outline)" stroke-width="1"/>')
        anchor = "start" if i == 0 else ("end" if i == len(segs) - 1 else "middle")
        lx = x if i == 0 else (x + w if i == len(segs) - 1 else x + w / 2)
        out.append(txt(lx, ly, label, 12, MUTED, anchor))
        x += w
    # the bracket that names the finding
    b1, b2 = PAD_L + BAR_W * clear / 100, PAD_L + BAR_W * (clear + false_pass) / 100
    out.append(f'<path d="M{b1:.1f} {top - 14} V{top - 22} H{b2:.1f} V{top - 14}" fill="none" '
               f'stroke="{INV}" stroke-width="1.5"/>')
    out.append(txt((b1 + b2) / 2, top - 30, "the gap fee disclosure hides", 12, INV, "middle", "600"))
    out.append(txt(PAD_L, h - 8, "Measured on the fee alone, 80.8% appear to clear the target. Measured on true cost, 60.8% do.", 11.5, MUTED))
    return "".join(out) + "</svg>"


def chart_crossover():
    """Where each provider's invisible cost overtakes its visible one."""
    data = [("PNB Europe", 53), ("Mukuru", 61), ("Sendwave", 113), ("Paysend", 132),
            ("Xoom", 136), ("WorldRemit", 143), ("Western Union", 159), ("MoneyGram", 181),
            ("Boss Money", 182), ("Ria", 187), ("Dahabshiil", 203), ("Revolut", 207),
            ("CurrencyFair", 251), ("Profee", 260), ("Remitly", 433), ("XE", 455),
            ("HSBC", 568), ("Koho", 1800), ("SingX", 2308), ("Wise", 21950)]
    lo, hi = 40.0, 30000.0
    row, top = 22, 74
    h = top + row * len(data) + 44

    def x(v):
        return PAD_L + BAR_W * (math.log10(v) - math.log10(lo)) / (math.log10(hi) - math.log10(lo))

    out = [head(h, "Send amount at which hidden cost overtakes the visible fee, by provider",
                "Most mainstream providers cross over between $113 and $260. Wise does not "
                "cross until about $21,950 because its median margin is 0.02%.")]
    out.append(txt(0, 20, "Where the invisible cost takes over", 15, INK, weight="600"))
    out.append(txt(0, 40, "Send amount above which the exchange-rate margin exceeds the flat fee", 12.5, MUTED))
    for tick in (50, 100, 500, 1000, 5000, 20000):
        tx = x(tick)
        out.append(f'<line x1="{tx:.1f}" y1="{top - 12}" x2="{tx:.1f}" y2="{h - 34}" '
                   f'stroke="var(--color-outline)" stroke-width="1"/>')
        out.append(txt(tx, h - 18, f"${tick:,}", 11, MUTED, "middle"))
    for i, (name, v) in enumerate(data):
        y = top + i * row
        cx = x(v)
        col = VIS if v <= 260 else INV
        out.append(f'<line x1="{PAD_L}" y1="{y}" x2="{cx:.1f}" y2="{y}" stroke="{col}" stroke-width="2" opacity="0.45"/>')
        out.append(f'<circle cx="{cx:.1f}" cy="{y}" r="5" fill="{col}"/>')
        out.append(txt(PAD_L - 10, y + 4, name, 11.5, INK, "end"))
        out.append(txt(cx + 11, y + 4, f"${v:,}", 11, MUTED))
    out.append(txt(PAD_L, h - 2, "Blue: crosses over below $260 — that is, below almost every real remittance.", 11.5, MUTED))
    return "".join(out) + "</svg>"


if __name__ == "__main__":
    for name, fn in (("DECAY", chart_decay), ("SDG", chart_sdg), ("CROSSOVER", chart_crossover)):
        print(f"\n===== {name} =====\n{fn()}")
