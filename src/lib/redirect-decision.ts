/**
 * Shared decision logic + interstitial page for the affiliate redirect routes
 * (/go and /out). Both routes call `decideRedirect` with the signals they've
 * already computed, then act on the returned outcome. Keeping this in one place
 * guarantees /go and /out behave identically.
 *
 * The three outcomes, and the signals that produce them:
 *
 *   "redirect"       Genuine on-site click — a VALID signed token was present.
 *                    100%-certain this came from a real interaction on our site.
 *                    -> instant 302 to the provider. Zero friction.
 *
 *   "interstitial"   Tokenless but plausibly a real human (clean bot score) —
 *                    e.g. a person following an AI-cited /go link, or one they
 *                    pasted. We can't prove it's a genuine click, so we route it
 *                    through an on-site page that auto-continues via JS (real
 *                    browsers proceed in ~1.5s; JS-less bots never do).
 *
 *   "not_forwarded"  Confidently a bot (isBot) — bad UA/headers/datacenter IP,
 *                    or enumeration behavior. We render the same interstitial
 *                    HTML (so nothing 500s and a mislabeled human isn't stranded
 *                    — they can still click Continue), but we do NOT auto-emit a
 *                    provider redirect and we DON'T count it as a click.
 *
 * This is the honest ceiling of what's provable on a stateless GET: the token
 * gives certainty for "came from our site"; bot score + JS-execution give best-
 * effort for bot-vs-human among the tokenless.
 */
import type { TokenStatus } from "@/lib/click-token";
import providerNamesData from "@/data/provider-names.json";
import { generateQuotes } from "@/lib/quotes-engine";
import { getGoUrl } from "@/lib/affiliate";

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

  if (genuineClick) {
    return { outcome: "redirect", genuineClick: true, gated: false };
  }
  if (input.isBot) {
    return { outcome: "not_forwarded", genuineClick: false, gated: true };
  }
  return { outcome: "interstitial", genuineClick: false, gated: true };
}

/**
 * Minimal, self-contained HTML interstitial. Server-rendered so it needs no app
 * bundle.
 *
 * GUARANTEE — no real person is ever lost. EVERY human-facing interstitial
 * auto-continues to the provider; we never render a dead end:
 *   1. JS auto-continue (location.replace) — the normal path for any browser.
 *   2. <noscript> meta-refresh — so a JS-disabled human still forwards.
 *   3. A visible "Continue" button — final manual fallback.
 *
 * `fast` only controls the DELAY, not whether it forwards:
 *   - true  (plausible human): ~1.2s — barely noticeable.
 *   - false (bot-scored):      ~3.5s — a mis-scored real human still gets
 *                              through; the longer wait only mildly discourages
 *                              cheap automation. A bot that runs NO JS still
 *                              won't hit the JS path, but the <noscript> refresh
 *                              would forward it too — which is acceptable: the
 *                              point of the gate is that a BARE FETCH (curl/
 *                              crawler that renders nothing) never forwards, and
 *                              known scrapers are already 403'd at middleware.
 *
 * The continue action navigates to the SAME redirect URL with `?continue=1`
 * appended, which the route honors with the actual provider 302 — so the click
 * is still recorded by our route as the source of truth, carrying all params.
 *
 * DELIBERATELY NO auto-forward and NO meta-refresh: an external/pasted/AI-cited
 * hit MUST land on and SEE this page, then click Continue. That's the whole
 * point — the visitor genuinely arrives on sendmoneycompare.com first. (Genuine
 * on-site Send-button clicks carry a valid token and never reach this page —
 * they get an instant 302, so this friction never touches our own conversion.)
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

  // Best alternative that BEATS the target — the cross-sell hook. Only shown
  // when a competitor genuinely returns more, so the nudge is always truthful.
  const target = crossSell?.find((r) => r.isTarget);
  const best = crossSell && crossSell.length ? crossSell[0] : undefined;
  const beatsTarget = !!(best && target && !best.isTarget && best.receiveAmount > target.receiveAmount);
  const extra = beatsTarget && target ? best!.receiveAmount - target.receiveAmount : 0;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const cur = receiveCurrency ? escapeHtml(receiveCurrency) : "";

  const rowsHtml = (crossSell ?? [])
    .slice(0, 4)
    .map((r) => {
      const isBest = best && r.slug === best.slug;
      const label = escapeHtml(r.name) + (r.isTarget ? ' <span class="you">your pick</span>' : "");
      const badge = isBest && !r.isTarget ? '<span class="best">Best rate</span>' : "";
      return `<a class="row${r.isTarget ? " target" : ""}" href="${escapeHtml(r.goUrl)}" rel="nofollow noopener">
        <span class="row-name">${label}${badge}</span>
        <span class="row-amt">${fmt(r.receiveAmount)} ${cur}</span>
      </a>`;
    })
    .join("");

  const crossSellBlock = rowsHtml
    ? `<div class="compare">
        <p class="compare-head">${corridorLabel ? `Sending ${escapeHtml(corridorLabel)}? Here's what you'd receive:` : "Compare what you'd receive:"}</p>
        ${beatsTarget && target ? `<p class="nudge">💡 <strong>${escapeHtml(best!.name)}</strong> gets you <strong>${fmt(extra)} ${cur} more</strong> than ${escapeHtml(target.name)}.</p>` : ""}
        <div class="rows">${rowsHtml}</div>
      </div>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Continue to ${safeName} — SendMoneyCompare</title>
<style>
  :root{
    --ink:#1A1916; --ink-soft:#57544E; --ink-muted:#837F77;
    --cta:#14171C; --cta-hover:#000; --cta-text:#fff;
    --canvas:#F2F1EE; --surface:#fff; --outline:#E5E3DE; --tint:#EEF1F7;
    --best:#0B7A4B; --best-bg:#D4ECDC;
    color-scheme:light dark;
  }
  @media(prefers-color-scheme:dark){:root{
    --ink:#F2F1EE; --ink-soft:#B8B4AC; --ink-muted:#837F77;
    --cta:#F2F2F0; --cta-hover:#fff; --cta-text:#14171C;
    --canvas:#060708; --surface:#16181D; --outline:#23262E; --tint:#111317;
    --best:#4ADE8B; --best-bg:#123524;
  }}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    font:16px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    background:var(--canvas);color:var(--ink)}
  .card{max-width:520px;width:100%;padding:40px 36px;
    background:var(--surface);border:1px solid var(--outline);border-radius:24px;
    box-shadow:0 8px 40px rgba(0,0,0,.10)}
  .brand{display:flex;align-items:center;gap:8px;justify-content:center;
    font-size:13px;font-weight:800;letter-spacing:.08em;color:var(--ink);
    text-transform:uppercase;margin:0 0 28px}
  .brand .dot{width:9px;height:9px;border-radius:50%;background:var(--cta);
    box-shadow:0 0 0 4px var(--tint)}
  h1{font-family:Georgia,"Times New Roman",serif;font-size:30px;line-height:1.15;
    font-weight:400;margin:0 0 10px;text-align:center;letter-spacing:-.01em}
  .lead{margin:0 0 24px;color:var(--ink-soft);text-align:center;font-size:15px}
  a.btn{display:block;text-align:center;background:var(--cta);color:var(--cta-text);
    text-decoration:none;padding:16px 32px;border-radius:9999px;font-weight:700;
    font-size:16px;transition:transform .08s ease}
  a.btn:hover{background:var(--cta-hover);transform:translateY(-1px)}
  .back{display:block;text-align:center;margin-top:14px;font-size:14px;
    color:var(--ink-muted);text-decoration:none}
  .back:hover{color:var(--ink-soft)}
  .compare{margin:28px 0 4px;padding-top:24px;border-top:1px solid var(--outline)}
  .compare-head{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.02em;
    text-transform:uppercase;color:var(--ink-muted)}
  .nudge{margin:0 0 16px;padding:12px 14px;background:var(--best-bg);color:var(--best);
    border-radius:12px;font-size:14px}
  .rows{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
  a.row{display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:14px 16px;border:1px solid var(--outline);border-radius:14px;
    text-decoration:none;color:var(--ink);transition:border-color .12s,transform .08s}
  a.row:hover{border-color:var(--cta);transform:translateY(-1px)}
  a.row.target{background:var(--tint)}
  .row-name{font-weight:600;font-size:15px;display:flex;align-items:center;gap:8px}
  .row-amt{font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}
  .best{font-size:11px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;
    color:var(--best);background:var(--best-bg);padding:2px 8px;border-radius:9999px}
  .you{font-size:11px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;
    color:var(--ink-muted);background:var(--outline);padding:2px 8px;border-radius:9999px}
</style></head>
<body><div class="card">
  <p class="brand"><span class="dot"></span>SendMoneyCompare</p>
  <h1>You're heading to ${safeName}</h1>
  <p class="lead">Before you go — here's how ${safeName} compares for your transfer. You can still get the best deal.</p>
  ${crossSellBlock}
  <a class="btn" href="${safeUrl}" rel="nofollow noopener">Continue to ${safeName} →</a>
  <a class="back" href="/">← Compare all providers</a>
</div></body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
