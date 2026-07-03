/**
 * Signed click-token — binds an affiliate redirect to a genuine interaction on
 * OUR site.
 *
 * Why this exists: `/go/[provider]` and `/out/[provider]` are public URLs that
 * appear in our HTML and get scraped, pasted, and cited by AI assistants. A
 * bare 302 forwards ANY hit to the provider as a click, so provider counts
 * (TapTap, Uniplex, …) never reconcile with reality and our own numbers are
 * inflated by hits that were never a real on-site click.
 *
 * This token is the one 100%-reliable signal we can produce: only a page on our
 * origin can mint a valid one (it requires the server secret). A pasted /
 * scraped / AI-cited URL, or a bot, has no valid token. The redirect route uses
 * `verifyClickToken` to decide whether a hit is a genuine on-site click
 * (instant redirect) or must be routed through the on-site interstitial.
 *
 * Design:
 *  - HMAC-SHA256 over a compact `provider.exp.nonce` payload, keyed on
 *    CLICK_TOKEN_SECRET. Stateless — no DB round-trip on the hot redirect path.
 *  - Short TTL (default 10 min) so a token can't be harvested and replayed
 *    hours later from a scraped page.
 *  - Bound to the provider slug so a token minted for one provider can't be
 *    reused to credit a click on another.
 *  - FAILS OPEN when CLICK_TOKEN_SECRET is unset: verify returns "absent" (not
 *    an error), so a missing secret never breaks the redirect path — it just
 *    means nothing is treated as a genuine on-site click until the secret is
 *    provisioned. Mirrors the no-op-until-provisioned pattern in event-store.
 */
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.CLICK_TOKEN_SECRET || "";
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

export type TokenStatus =
  | "valid" // signature ok, not expired, provider matches
  | "absent" // no token on the request (bare hit) OR no secret provisioned
  | "expired" // signature ok but past exp
  | "tampered" // signature mismatch / malformed / wrong provider
  ;

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/**
 * Mint a token for a genuine on-site click on `provider`. Returns "" when no
 * secret is provisioned (fail-open — the click still works, just untokenized).
 */
export function mintClickToken(provider: string, ttlMs: number = DEFAULT_TTL_MS): string {
  if (!SECRET) return "";
  // exp in seconds; nonce ties the token to a single mint (opaque, non-PII).
  const exp = Math.floor((nowMs() + ttlMs) / 1000);
  const nonce = randomNonce();
  const payload = `${provider}.${exp}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

/**
 * Verify a token against the expected provider. Never throws — returns a status
 * the caller maps to a redirect decision. `absent` covers both "no token
 * supplied" and "no secret provisioned", so the route treats an unprovisioned
 * secret exactly like a bare hit (routed through the interstitial), never a 500.
 */
export function verifyClickToken(token: string | null | undefined, provider: string): TokenStatus {
  if (!SECRET) return "absent";
  if (!token) return "absent";

  const parts = token.split(".");
  if (parts.length !== 4) return "tampered";
  const [tokProvider, expStr, nonce, sig] = parts;

  // Recompute the signature over the claimed payload and compare in constant time.
  const expected = sign(`${tokProvider}.${expStr}.${nonce}`);
  if (!constantTimeEqual(sig, expected)) return "tampered";

  // Signature is authentic — now validate claims.
  if (tokProvider !== provider) return "tampered"; // minted for a different provider
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return "tampered";
  if (nowMs() > exp * 1000) return "expired";

  return "valid";
}

// --- helpers -------------------------------------------------------------

// Date.now() is fine at runtime (this module never runs inside a Workflow
// script); wrapped so the two call sites read clearly.
function nowMs(): number {
  return Date.now();
}

function randomNonce(): string {
  // 9 random bytes -> 12 base64url chars. Enough entropy to make tokens unique
  // per mint without bloating the URL.
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  try {
    return timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}
