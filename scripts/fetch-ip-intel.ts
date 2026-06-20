/**
 * Fetch the free, offline IP-intelligence datasets used by the bot scorer.
 *
 * Produces two committed artifacts under src/data/ip-intel/:
 *   1. dbip-asn-lite.mmdb      — IP→ASN map (DB-IP IP-to-ASN Lite, CC BY 4.0).
 *      Read per request via the `maxmind` package (binary search over the MMDB
 *      trie, ~µs). Attribution: a "IP data by DB-IP" link lives in the footer.
 *   2. datacenter-asns.txt     — one ASN per line, the hosting/VPN ASNs from
 *      X4BNet/lists_vpn (MIT). Loaded into a Set<number>; an ASN in this set ⇒
 *      the IP is datacenter/hosting (catches scrapers + most VPN exits).
 *
 * Run on a cadence (the existing 6-hourly scrape workflow is a good host) so
 * the data stays fresh. DB-IP publishes a new MMDB monthly at a dated URL; we
 * fall back to the previous month if the current month isn't published yet.
 *
 *   npx tsx scripts/fetch-ip-intel.ts
 *
 * Why offline/free (not a paid IP-intelligence API): the redirect is hot-path
 * and observe-only — we want a zero-latency, zero-cost datacenter/residential
 * split, which this stack delivers. A precise residential-proxy/consumer-VPN
 * label is NOT free/offline and is intentionally out of scope.
 */
import { gunzipSync } from "node:zlib";
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "src/data/ip-intel");
const MMDB_PATH = path.join(OUT_DIR, "dbip-asn-lite.mmdb");
const ASN_PATH = path.join(OUT_DIR, "datacenter-asns.txt");

const X4BNET_ASN_URL =
  "https://raw.githubusercontent.com/X4BNet/lists_vpn/main/input/datacenter/ASN.txt";
const BRIANHAMA_URL =
  "https://raw.githubusercontent.com/brianhama/bad-asn-list/master/bad-asn-list.csv";

function dbipUrl(year: number, month: number): string {
  const m = String(month).padStart(2, "0");
  return `https://download.db-ip.com/free/dbip-asn-lite-${year}-${m}.mmdb.gz`;
}

async function fetchDbipMmdb(): Promise<void> {
  const now = new Date();
  // Try current month, then the previous two (start-of-month publishing lag).
  const candidates: Array<[number, number]> = [];
  for (let back = 0; back < 3; back++) {
    const d = new Date(now.getFullYear(), now.getMonth() - back, 1);
    candidates.push([d.getFullYear(), d.getMonth() + 1]);
  }
  for (const [y, m] of candidates) {
    const url = dbipUrl(y, m);
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`  DB-IP ${y}-${m}: ${res.status}, trying older…`);
      continue;
    }
    const gz = Buffer.from(await res.arrayBuffer());
    const mmdb = gunzipSync(gz);
    await writeFile(MMDB_PATH, mmdb);
    const { size } = await stat(MMDB_PATH);
    console.log(`✓ dbip-asn-lite.mmdb  ${(size / 1e6).toFixed(1)} MB  (${y}-${m})`);
    return;
  }
  throw new Error("DB-IP ASN Lite not reachable for the last 3 months");
}

async function fetchDatacenterAsns(): Promise<void> {
  const asns = new Set<number>();

  // X4BNet — one ASN token per line (may be prefixed "AS").
  const x4 = await fetch(X4BNET_ASN_URL);
  if (x4.ok) {
    for (const line of (await x4.text()).split("\n")) {
      const n = parseInt(line.replace(/[^0-9]/g, ""), 10);
      if (n) asns.add(n);
    }
  }
  // brianhama — CSV `ASN,Name`; widen coverage (cloud/colo/managed hosting).
  const bh = await fetch(BRIANHAMA_URL);
  if (bh.ok) {
    for (const line of (await bh.text()).split("\n").slice(1)) {
      const n = parseInt(line.split(",")[0]?.replace(/[^0-9]/g, "") ?? "", 10);
      if (n) asns.add(n);
    }
  }
  // X4BNet's curated `input/` list (~900) ∪ brianhama (~740) lands ~1k unique —
  // the major cloud/hosting/VPN ASNs, which is what catches scraper + AI-egress
  // traffic. A much smaller number means a source fetch silently failed.
  if (asns.size < 500) {
    throw new Error(`datacenter ASN set implausibly small (${asns.size}) — source fetch likely failed`);
  }
  const sorted = [...asns].sort((a, b) => a - b);
  await writeFile(ASN_PATH, sorted.join("\n") + "\n", "utf8");
  console.log(`✓ datacenter-asns.txt  ${sorted.length} ASNs`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await Promise.all([fetchDbipMmdb(), fetchDatacenterAsns()]);
  console.log("IP-intel datasets refreshed.");
}

main().catch((e) => {
  console.error("fetch-ip-intel failed:", e);
  process.exit(1);
});
