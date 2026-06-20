/**
 * Offline IP intelligence for the bot scorer — datacenter vs residential.
 *
 * Vercel does NOT expose ASN in request headers (verified against the Dec-2025
 * request-headers reference). So we bundle a free IP→ASN database and look the
 * client IP up ourselves, per request, in-process:
 *
 *   IP  ──(DB-IP IP-to-ASN Lite MMDB, binary-searched)──▶  ASN
 *   ASN ──(X4BNet ∪ brianhama datacenter ASN Set)───────▶  datacenter? y/n
 *
 * Both artifacts live in src/data/ip-intel/ and are refreshed by
 * scripts/fetch-ip-intel.ts. The MMDB is read ONCE per warm lambda at module
 * scope (a ~9 MB buffer, microsecond lookups thereafter) — well within the
 * Node serverless memory/cold-start budget. Node runtime only (needs fs); never
 * import this from an Edge function.
 *
 * Design notes:
 *  • "datacenter" is the signal that actually catches scrapers and most VPN/Tor
 *    exits. A precise residential-proxy / consumer-VPN label is not available
 *    free+offline, and is intentionally out of scope.
 *  • The curated ASN lists deliberately OMIT mixed CDN/cloud ASNs (Cloudflare,
 *    Microsoft) to avoid false-positiving real users behind WARP / corporate
 *    egress. We surface those separately as a LOW-WEIGHT `cloudEgress` hint, so
 *    the scorer can treat "AI-assistant fetched from Microsoft/Cloudflare" as a
 *    weak, gated signal — never a hard datacenter verdict. This protects our #2
 *    channel (real people arriving via ChatGPT/Perplexity from datacenter IPs).
 *  • Everything fails OPEN: any error → { class: "unknown" }, never throws,
 *    never delays the redirect.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { Reader, type Response } from "maxmind";

// DB-IP / MaxMind ASN MMDB record shape. `Reader<T extends Response>` requires
// T to extend mmdb-lib's Response (an index-signature record), so we intersect.
type AsnRecord = Response & {
  autonomous_system_number?: number;
  autonomous_system_organization?: string;
};

export type IpClass = "datacenter" | "residential" | "unknown";

export type IpIntel = {
  class: IpClass;
  asn: number | null;
  asnOrg: string | null;
  /** True for mixed CDN/cloud ASNs (Microsoft/Cloudflare/Google-edge) that are
   *  NOT in the hard datacenter set but commonly host AI-assistant egress.
   *  A weak, gated signal — never decisive. */
  cloudEgress: boolean;
};

const DIR = path.join(process.cwd(), "src/data/ip-intel");

// Mixed CDN/cloud ASNs intentionally excluded from the hard datacenter set
// (they front large volumes of REAL residential traffic). Used only for the
// low-weight cloudEgress hint. Microsoft 8068/8075 = Azure + Copilot/Bing
// egress; Cloudflare 13335 = WARP + CDN; Google 15169 is already in the hard
// list (kept there — pure GCP), so it's not duplicated here.
const CLOUD_EGRESS_ASNS = new Set<number>([
  8068, 8075, // Microsoft
  13335, // Cloudflare
  396982, // Google Cloud (GCP) — also a heavy AI-egress origin
]);

// ── Lazy, once-per-instance load. Module-scope so a warm lambda reuses it. ───
let reader: Reader<AsnRecord> | null = null;
let datacenterAsns: Set<number> | null = null;
let loadFailed = false;

function ensureLoaded(): boolean {
  if (reader && datacenterAsns) return true;
  if (loadFailed) return false;
  try {
    const buf = readFileSync(path.join(DIR, "dbip-asn-lite.mmdb"));
    reader = new Reader<AsnRecord>(buf);
    const txt = readFileSync(path.join(DIR, "datacenter-asns.txt"), "utf8");
    datacenterAsns = new Set(
      txt.split("\n").map((l) => parseInt(l, 10)).filter((n) => Number.isFinite(n) && n > 0),
    );
    return true;
  } catch {
    // Dataset not bundled (e.g. local dev without the fetch run) → fail open.
    loadFailed = true;
    return false;
  }
}

/**
 * Classify a client IP. Always returns; never throws. `unknown` when the
 * dataset isn't available or the IP doesn't resolve (private/reserved/IPv6
 * gaps) — the scorer treats unknown as neutral, not suspicious.
 */
export function classifyIp(ip: string | null | undefined): IpIntel {
  const blank: IpIntel = { class: "unknown", asn: null, asnOrg: null, cloudEgress: false };
  if (!ip || ip === "unknown") return blank;
  if (!ensureLoaded() || !reader || !datacenterAsns) return blank;
  try {
    const rec = reader.get(ip);
    const asn = rec?.autonomous_system_number ?? null;
    if (!asn) return blank;
    const asnOrg = rec?.autonomous_system_organization ?? null;
    const isDc = datacenterAsns.has(asn);
    return {
      class: isDc ? "datacenter" : "residential",
      asn,
      asnOrg,
      cloudEgress: CLOUD_EGRESS_ASNS.has(asn),
    };
  } catch {
    return blank;
  }
}
