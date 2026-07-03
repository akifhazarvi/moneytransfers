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

const providerNames = providerNamesData as Record<string, string>;

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
export function interstitialHtml(opts: {
  providerName: string;
  continueUrl: string; // same route + &continue=1
}): string {
  const { providerName, continueUrl } = opts;
  const safeName = escapeHtml(providerName);
  const safeUrl = escapeHtml(continueUrl);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Continue to ${safeName} — SendMoneyCompare</title>
<style>
  :root{color-scheme:light dark}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    background:#f8f9fa;color:#202124}
  @media(prefers-color-scheme:dark){body{background:#202124;color:#e8eaed}}
  .card{max-width:460px;width:100%;padding:40px 32px;text-align:center;
    background:#fff;border:1px solid #dadce0;border-radius:16px;
    box-shadow:0 1px 3px rgba(0,0,0,.08)}
  @media(prefers-color-scheme:dark){.card{background:#2a2b2e;border-color:#3c4043}}
  .brand{font-size:13px;font-weight:600;letter-spacing:.02em;color:#1a73e8;
    text-transform:uppercase;margin:0 0 16px}
  h1{font-size:22px;font-weight:700;margin:0 0 10px}
  p{margin:0 0 24px;color:#5f6368}
  @media(prefers-color-scheme:dark){p{color:#9aa0a6}}
  a.btn{display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;
    padding:14px 32px;border-radius:9999px;font-weight:600;font-size:16px}
  a.btn:hover{background:#1557b0}
  .back{display:block;margin-top:16px;font-size:14px;color:#5f6368;text-decoration:none}
</style></head>
<body><div class="card">
  <p class="brand">SendMoneyCompare</p>
  <h1>You're heading to ${safeName}</h1>
  <p>You're about to leave sendmoneycompare.com and continue to ${safeName}'s website to complete your transfer.</p>
  <a class="btn" href="${safeUrl}" rel="nofollow noopener">Continue to ${safeName} →</a>
  <a class="back" href="/">← Back to SendMoneyCompare</a>
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
