/**
 * Shared decision logic + interstitial page for the affiliate redirect routes
 * (/go and /out). Both routes call `decideRedirect` with the signals they've
 * already computed, then act on the returned outcome. Keeping this in one place
 * guarantees /go and /out behave identically.
 *
 * The three outcomes, and the signals that produce them:
 *
 *   "interstitial"   Any human-facing hit — BOTH a genuine on-site click (valid
 *                    signed token) AND a tokenless-but-plausible human (clean bot
 *                    score, e.g. an AI-cited or pasted /go link). Everyone lands
 *                    on the on-site review page first and clicks Continue to
 *                    forward. The valid-token case is still recorded as a
 *                    genuineClick (billing/attribution truth); it just no longer
 *                    skips the page. There is NO auto-continue — the Continue
 *                    button is a deliberate click, which is exactly what keeps a
 *                    JS-less bare fetch from ever forwarding on its own.
 *
 *   "not_forwarded"  Confidently a bot (isBot) — bad UA/headers/datacenter IP,
 *                    or enumeration behavior. We render the same interstitial
 *                    HTML (so nothing 500s and a mislabeled human isn't stranded
 *                    — they can still click Continue), but we DON'T count it as a
 *                    genuine click.
 *
 * This is the honest ceiling of what's provable on a stateless GET: the token
 * gives certainty for "came from our site"; bot score gives best-effort for
 * bot-vs-human among the tokenless. Rendering the page for everyone makes the
 * on-site review the mandatory step before any provider forward.
 */
import type { TokenStatus } from "@/lib/click-token";
import providerNamesData from "@/data/provider-names.json";
import { generateQuotes } from "@/lib/quotes-engine";
import { getGoUrl } from "@/lib/affiliate";
import { CLARITY_INLINE, CONTINUE_INLINE } from "@/lib/inline-scripts";

const providerNames = providerNamesData as Record<string, string>;

/**
 * Build the cross-sell comparison rows for the interstitial: the top providers
 * for this corridor by receive amount, always including the target provider so
 * the visitor can see how their pick stacks up. Each row links back through
 * /go/<slug> so cross-sell clicks are themselves tracked + gated. Returns [] if
 * we can't compute quotes (missing corridor) — the interstitial then just shows
 * the plain continue page.
 */
export function buildCrossSell(opts: {
  targetSlug: string;
  from?: string;
  to?: string;
  amount?: number;
  src?: string;
}): CrossSellRow[] {
  const { targetSlug, from, to, amount, src } = opts;
  if (!from || !to) return [];
  const amt = amount && amount > 0 ? amount : 1000;
  let quotes: ReturnType<typeof generateQuotes>;
  try {
    quotes = generateQuotes(amt, from, to);
  } catch {
    return [];
  }
  if (!quotes.length) return [];

  // Top 3 by receive amount, plus the target if it's not already in the top 3.
  const top = quotes.slice(0, 3);
  const targetQuote = quotes.find((q) => q.providerSlug === targetSlug);
  const chosen = [...top];
  if (targetQuote && !top.some((q) => q.providerSlug === targetSlug)) {
    chosen.push(targetQuote);
  }

  return chosen.map((q) => ({
    slug: q.providerSlug,
    name: providerDisplayName(q.providerSlug),
    receiveAmount: q.receiveAmount,
    goUrl: getGoUrl(q.providerSlug, {
      sourceCurrency: from,
      targetCurrency: to,
      sourceAmount: amt,
      clickref: src,
    }),
    isTarget: q.providerSlug === targetSlug,
  }));
}

/**
 * Human-readable provider name for the interstitial. Falls back to a Title-Cased
 * version of the slug when the slug isn't in the display-name map (unknown-but-
 * valid slugs still redirect, so they still need a name to show).
 */
export function providerDisplayName(slug: string): string {
  const known = providerNames[slug];
  if (known) return known;
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export type RedirectOutcome = "redirect" | "interstitial" | "not_forwarded";

export function decideRedirect(input: {
  tokenStatus: TokenStatus;
  isBot: boolean;
}): { outcome: RedirectOutcome; genuineClick: boolean; gated: boolean } {
  const genuineClick = input.tokenStatus === "valid";

  // EVERY human-facing hit now lands on the interstitial first, then forwards —
  // including genuine on-site clicks (valid token). We still record them as a
  // genuineClick (billing/attribution truth) and NOT gated (a real human, not a
  // suspicious hit); they simply see the on-site review page before forwarding,
  // where the interstitial's JS auto-continues (~1.2s) via ?continue=1 — which
  // the route honors as the actual provider 302. Only confidently-scored bots
  // are still not_forwarded (interstitial renders, but no auto-redirect).
  if (genuineClick) {
    return { outcome: "interstitial", genuineClick: true, gated: false };
  }
  if (input.isBot) {
    return { outcome: "not_forwarded", genuineClick: false, gated: true };
  }
  return { outcome: "interstitial", genuineClick: false, gated: true };
}

/**
 * Self-contained HTML interstitial — a bold, on-brand "review your transfer"
 * page. Server-rendered inline (no app bundle) so it loads instantly and works
 * even for external/pasted/AI-cited hits that never loaded our app.
 *
 * DELIBERATELY NO auto-forward and NO meta-refresh: EVERY visitor MUST land on
 * and SEE this page, then click Continue. That's the whole point — the person
 * genuinely arrives on sendmoneycompare.com and reviews the comparison before
 * forwarding. This applies to genuine on-site clicks too (valid token → still
 * recorded as a genuineClick, but no longer skips the page).
 *
 * The Continue action navigates to the SAME redirect URL with `?continue=1`
 * appended, which the route honors with the actual provider 302 — so the click
 * is still recorded by our route as the source of truth, carrying all params. A
 * BARE FETCH (curl/crawler that renders nothing and never clicks) never forwards,
 * and known scrapers are already 403'd at middleware.
 */
export type CrossSellRow = {
  slug: string;
  name: string;
  receiveAmount: number; // in the receive currency
  goUrl: string; // /go/<slug>?... — so cross-sell clicks are tracked too
  isTarget: boolean; // true = the provider they were originally heading to
};

export function interstitialHtml(opts: {
  providerName: string;
  continueUrl: string; // same route + &continue=1
  corridorLabel?: string; // e.g. "USD → INR" for the comparison heading
  receiveCurrency?: string; // e.g. "INR"
  crossSell?: CrossSellRow[]; // top alternatives for this corridor (incl. target)
}): string {
  const { providerName, continueUrl, corridorLabel, receiveCurrency, crossSell } = opts;
  const safeName = escapeHtml(providerName);
  const safeUrl = escapeHtml(continueUrl);

  // Ranked table of what each provider would deliver (already sorted best-first
  // by the caller). The "best" row is #1; the target is the visitor's pick.
  const rows = (crossSell ?? []).slice(0, 4);
  const target = rows.find((r) => r.isTarget);
  const best = rows.length ? rows[0] : undefined;
  const beatsTarget = !!(best && target && !best.isTarget && best.receiveAmount > target.receiveAmount);
  const extra = beatsTarget && target ? best!.receiveAmount - target.receiveAmount : 0;
  // Where the target ranks (1-based) among the shown rows — powers the verdict.
  const targetRank = target ? rows.findIndex((r) => r.isTarget) + 1 : 0;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const cur = receiveCurrency ? escapeHtml(receiveCurrency) : "";

  // A bold, honest verdict banner. Three truthful states:
  //   - target wins outright (rank 1)        → "Great pick"
  //   - a competitor beats it (we know delta) → "You could get X more"
  //   - no corridor data                      → generic reassurance
  let verdict = "";
  if (rows.length) {
    if (target && targetRank === 1) {
      verdict = `<div class="verdict win">
        <span class="v-eyebrow">Verdict</span>
        <p class="v-title">${safeName} is the best rate right now.</p>
        <p class="v-sub">You picked the top provider for this transfer — nice.</p>
      </div>`;
    } else if (beatsTarget && target) {
      verdict = `<div class="verdict warn">
        <span class="v-eyebrow">Heads up</span>
        <p class="v-title">You could get <span class="hl">${fmt(extra)} ${cur}</span> more.</p>
        <p class="v-sub"><strong>${escapeHtml(best!.name)}</strong> delivers more than ${escapeHtml(target.name)} on this transfer.</p>
      </div>`;
    } else {
      verdict = `<div class="verdict win">
        <span class="v-eyebrow">Verdict</span>
        <p class="v-title">${safeName} is a solid choice for this transfer.</p>
        <p class="v-sub">Here's the live comparison before you go.</p>
      </div>`;
    }
  }

  const rowsHtml = rows
    .map((r, i) => {
      const isBest = best && r.slug === best.slug;
      const rank = i + 1;
      const badges =
        (isBest ? '<span class="tag best">Best rate</span>' : "") +
        (r.isTarget ? '<span class="tag you">Your pick</span>' : "");
      // Delta vs the #1 receive amount — makes the cost of a worse pick concrete.
      const behind = best && !isBest ? best.receiveAmount - r.receiveAmount : 0;
      const deltaHtml = behind > 0 ? `<span class="delta">−${fmt(behind)} ${cur}</span>` : "";
      return `<a class="row${isBest ? " is-best" : ""}${r.isTarget ? " is-target" : ""}" href="${escapeHtml(r.goUrl)}" rel="nofollow noopener">
        <span class="rank">${rank}</span>
        <span class="row-name">${escapeHtml(r.name)}${badges}</span>
        <span class="row-amt">${fmt(r.receiveAmount)} ${cur}${deltaHtml}</span>
      </a>`;
    })
    .join("");

  const compareBlock = rowsHtml
    ? `<section class="compare" aria-label="Provider comparison">
        <p class="compare-head">${corridorLabel ? `Sending <strong>${escapeHtml(corridorLabel)}</strong> — what you'd receive` : "What you'd receive"}</p>
        <div class="rows">${rowsHtml}</div>
      </section>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Review your transfer — heading to ${safeName} · SendMoneyCompare</title>
<style>
  :root{
    --ink:#1A1916; --ink-soft:#57544E; --ink-muted:#837F77;
    --cta:#14171C; --cta-hover:#000; --cta-text:#fff;
    --canvas:#EEEDE9; --surface:#fff; --surface-2:#FAF9F7;
    --outline:#E5E3DE; --tint:#EEF1F7;
    --best:#0B7A4B; --best-bg:#D9F0E3; --best-line:#8FD3AE;
    --warn:#8A4B00; --warn-bg:#FBEBD3; --warn-line:#EBC488;
    --accent:#1a73e8;
    color-scheme:light dark;
  }
  @media(prefers-color-scheme:dark){:root{
    --ink:#F4F3F0; --ink-soft:#BFBBB2; --ink-muted:#8B8780;
    --cta:#F4F3F0; --cta-hover:#fff; --cta-text:#14171C;
    --canvas:#0A0B0D; --surface:#151719; --surface-2:#1B1E21;
    --outline:#292C31; --tint:#141821;
    --best:#5BE39C; --best-bg:#0F3323; --best-line:#1E5C3E;
    --warn:#F5C070; --warn-bg:#33240E; --warn-line:#5C441C;
    --accent:#7fb0ff;
  }}
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;
    align-items:center;padding:20px 18px 40px;
    font:16px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    background:
      radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%),
      var(--canvas);
    color:var(--ink);-webkit-font-smoothing:antialiased}
  .wrap{width:100%;max-width:560px;display:flex;flex-direction:column;gap:18px}
  .topbar{display:flex;align-items:center;justify-content:space-between;
    padding-top:6px}
  .brand{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:800;
    letter-spacing:.09em;text-transform:uppercase;color:var(--ink);text-decoration:none}
  .brand .dot{width:10px;height:10px;border-radius:50%;background:var(--accent);
    box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 22%, transparent)}
  .secured{font-size:12px;font-weight:600;color:var(--ink-muted);
    display:flex;align-items:center;gap:6px}
  .secured svg{width:13px;height:13px;fill:none;stroke:var(--best);stroke-width:2}
  .hero{background:var(--surface);border:1px solid var(--outline);
    border-radius:24px;padding:34px 30px 30px;
    box-shadow:0 10px 40px rgba(0,0,0,.08)}
  .eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.1em;
    text-transform:uppercase;color:var(--accent);
    background:color-mix(in srgb,var(--accent) 12%, transparent);
    padding:5px 11px;border-radius:9999px;margin:0 0 16px}
  h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(28px,6vw,38px);
    line-height:1.1;font-weight:400;margin:0 0 12px;letter-spacing:-.015em}
  h1 .name{font-style:italic}
  .lead{margin:0;color:var(--ink-soft);font-size:16px;max-width:44ch}
  .verdict{margin-top:22px;border-radius:16px;padding:16px 18px;border:1px solid}
  .verdict.win{background:var(--best-bg);border-color:var(--best-line)}
  .verdict.warn{background:var(--warn-bg);border-color:var(--warn-line)}
  .v-eyebrow{font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;
    opacity:.85}
  .verdict.win .v-eyebrow{color:var(--best)}
  .verdict.warn .v-eyebrow{color:var(--warn)}
  .v-title{margin:5px 0 3px;font-size:19px;font-weight:800;line-height:1.25}
  .verdict.win .v-title{color:var(--best)}
  .verdict.warn .v-title{color:var(--warn)}
  .v-title .hl{font-variant-numeric:tabular-nums}
  .v-sub{margin:0;font-size:14px;color:var(--ink-soft)}
  .verdict.win .v-sub{color:color-mix(in srgb,var(--best) 75%, var(--ink))}
  .verdict.warn .v-sub{color:color-mix(in srgb,var(--warn) 78%, var(--ink))}
  .compare{background:var(--surface);border:1px solid var(--outline);
    border-radius:24px;padding:22px 22px 12px;box-shadow:0 10px 40px rgba(0,0,0,.06)}
  .compare-head{margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:.02em;
    text-transform:uppercase;color:var(--ink-muted)}
  .compare-head strong{color:var(--ink)}
  .rows{display:flex;flex-direction:column;gap:9px;margin-bottom:12px}
  a.row{display:flex;align-items:center;gap:13px;
    padding:15px 16px;border:1.5px solid var(--outline);border-radius:16px;
    background:var(--surface-2);text-decoration:none;color:var(--ink);
    transition:border-color .12s,transform .08s,box-shadow .12s}
  a.row:hover{border-color:var(--accent);transform:translateY(-1px);
    box-shadow:0 6px 18px rgba(0,0,0,.08)}
  a.row.is-best{border-color:var(--best-line);
    background:color-mix(in srgb,var(--best-bg) 55%, var(--surface))}
  .rank{flex:0 0 auto;width:24px;height:24px;border-radius:8px;
    display:grid;place-items:center;font-size:13px;font-weight:800;
    background:var(--outline);color:var(--ink-soft);font-variant-numeric:tabular-nums}
  a.row.is-best .rank{background:var(--best);color:#fff}
  @media(prefers-color-scheme:dark){a.row.is-best .rank{color:#0A0B0D}}
  .row-name{flex:1 1 auto;font-weight:700;font-size:15.5px;display:flex;
    align-items:center;gap:8px;flex-wrap:wrap;min-width:0}
  .tag{font-size:10.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;
    padding:2px 8px;border-radius:9999px;white-space:nowrap}
  .tag.best{color:var(--best);background:var(--best-bg);
    box-shadow:inset 0 0 0 1px var(--best-line)}
  .tag.you{color:var(--ink-soft);background:var(--outline)}
  .row-amt{flex:0 0 auto;text-align:right;font-weight:800;font-size:16px;
    font-variant-numeric:tabular-nums;white-space:nowrap;
    display:flex;flex-direction:column;align-items:flex-end;gap:1px}
  .delta{font-size:12px;font-weight:700;color:var(--warn)}
  .cta-wrap{position:sticky;bottom:12px;margin-top:2px}
  a.btn{display:flex;align-items:center;justify-content:center;gap:8px;
    background:var(--cta);color:var(--cta-text);text-decoration:none;
    padding:18px 28px;border-radius:9999px;font-weight:800;font-size:17px;
    box-shadow:0 12px 30px rgba(0,0,0,.22);transition:transform .08s,background .12s}
  a.btn:hover{background:var(--cta-hover);transform:translateY(-2px)}
  a.btn:active{transform:translateY(0)}
  .microcopy{text-align:center;margin:12px 0 0;font-size:13px;color:var(--ink-muted)}
  .microcopy a{color:var(--ink-soft);text-decoration:underline;text-underline-offset:2px}
  .trust{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 18px;
    margin:4px 0 0;font-size:12.5px;color:var(--ink-muted)}
  .trust span{display:flex;align-items:center;gap:6px}
  .trust svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2}
</style>
<script>${CLARITY_INLINE}</script>
<script>${CONTINUE_INLINE}</script></head>
<body>
<div class="wrap">
  <div class="topbar">
    <a class="brand" href="/"><span class="dot"></span>SendMoneyCompare</a>
    <span class="secured"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6z"/></svg>Independent &amp; free</span>
  </div>

  <div class="hero">
    <span class="eyebrow">Review your transfer</span>
    <h1>You're heading to <span class="name">${safeName}</span></h1>
    <p class="lead">One quick look before you go — here's exactly what ${safeName} delivers versus the best rate we can find right now.</p>
    ${verdict}
  </div>

  ${compareBlock}

  <div class="cta-wrap">
    <a class="btn" href="${safeUrl}" rel="nofollow noopener">Continue to ${safeName} →</a>
  </div>
  <p class="microcopy">You'll be taken to ${safeName} to finish your transfer. <a href="/">Or compare all providers</a></p>

  <div class="trust">
    <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>60+ providers, live rates</span>
    <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>No fees, no sign-up</span>
    <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>We never see your money</span>
  </div>
</div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
