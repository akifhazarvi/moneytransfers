/**
 * Installed-app (PWA) invariants. Each one is a way the install or the offline
 * copy breaks silently — nothing errors, the browser just stops offering
 * "Install", or keeps an old offline page forever.
 *
 *   1. One manifest, and it is installable: id, name, short_name, start_url,
 *      a standalone display mode, 192 and 512 PNG icons, a maskable icon.
 *   2. Every icon and screenshot the manifest names exists in public/ at the
 *      size it declares (Chrome drops a mismatched icon, then the app has
 *      none), and screenshots are the form factor they claim.
 *   3. Every shortcut opens a page that exists.
 *   4. public/sw.js precaches files that exist, and OFFLINE_REVISION matches
 *      public/offline.html — the worker only re-fetches the offline page when
 *      its own bytes change, so an edit without a revision never ships.
 *   5. The worker's BYPASS still covers /go, /out and /api (affiliate
 *      redirects and live data must never be cached).
 *
 * Usage: npx tsx scripts/check-pwa.ts   (runs in prebuild)
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import manifest from "../src/app/manifest";

const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);

/** Pixel size of a PNG (IHDR) or JPEG (first SOFn marker). */
function imageSize(file: string): { width: number; height: number } | null {
  const buf = readFileSync(file);
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

function checkImage(src: string, sizes: string | undefined, what: string) {
  const file = join(PUBLIC, src);
  if (!existsSync(file)) return fail(`${what} ${src} is not in public/`);
  if (!sizes || sizes === "any") return;
  const actual = imageSize(file);
  if (!actual) return fail(`${what} ${src}: could not read its dimensions`);
  if (sizes !== `${actual.width}x${actual.height}`) {
    fail(`${what} ${src} declares ${sizes} but is ${actual.width}x${actual.height}`);
  }
}

// ── 1. Installable manifest ────────────────────────────────────────────────
const m = manifest();
if (existsSync(join(PUBLIC, "manifest.json"))) {
  fail("public/manifest.json exists — src/app/manifest.ts is the only manifest (see its header)");
}
for (const key of ["id", "name", "short_name", "start_url"] as const) {
  if (!m[key]) fail(`manifest is missing "${key}"`);
}
if (!["standalone", "fullscreen", "minimal-ui"].includes(m.display ?? "")) {
  fail(`manifest display "${m.display}" is not installable as an app`);
}
const icons = m.icons ?? [];
const pngAny = (size: string) =>
  icons.some((i) => i.type === "image/png" && i.sizes === size && (!i.purpose || i.purpose.includes("any")));
if (!pngAny("192x192")) fail("manifest needs a 192x192 PNG icon with purpose any");
if (!pngAny("512x512")) fail("manifest needs a 512x512 PNG icon with purpose any");
if (!icons.some((i) => i.purpose?.includes("maskable"))) fail("manifest needs a maskable icon (Android adaptive icons)");

// ── 2. Icons and screenshots exist at their declared size ──────────────────
for (const icon of icons) checkImage(icon.src, icon.sizes, "icon");
for (const shot of m.screenshots ?? []) {
  checkImage(shot.src, shot.sizes, "screenshot");
  const [w, h] = (shot.sizes ?? "").split("x").map(Number);
  if (shot.form_factor === "wide" && !(w > h)) fail(`screenshot ${shot.src} is marked wide but is not landscape`);
  if (shot.form_factor === "narrow" && !(h > w)) fail(`screenshot ${shot.src} is marked narrow but is not portrait`);
}

// ── 3. Shortcuts open pages that exist ─────────────────────────────────────
for (const s of m.shortcuts ?? []) {
  const page = join(ROOT, "src/app/[locale]", s.url, "page.tsx");
  if (!existsSync(page)) fail(`shortcut "${s.name}" opens ${s.url}, which has no page (${page.slice(ROOT.length + 1)})`);
  for (const icon of s.icons ?? []) checkImage(icon.src, icon.sizes, `shortcut "${s.name}" icon`);
}

// ── 4 & 5. Service worker ──────────────────────────────────────────────────
const sw = readFileSync(join(PUBLIC, "sw.js"), "utf8");
const offlineHtml = readFileSync(join(PUBLIC, "offline.html"));
const revision = createHash("sha256").update(offlineHtml).digest("hex").slice(0, 8);
const declared = sw.match(/const OFFLINE_REVISION = "([0-9a-f]+)";/)?.[1];
if (declared !== revision) {
  fail(
    `public/offline.html changed but public/sw.js still has OFFLINE_REVISION = "${declared}". ` +
      `Set it to "${revision}" so returning visitors get the new offline page.`,
  );
}

const precache = sw.match(/const PRECACHE_URLS = \[([^\]]*)\]/)?.[1];
if (!precache) fail("public/sw.js: PRECACHE_URLS not found");
else {
  const urls = [...precache.matchAll(/"([^"]+)"|(OFFLINE_URL)/g)].map((x) => x[1] ?? "/offline.html");
  for (const url of urls) if (!existsSync(join(PUBLIC, url))) fail(`public/sw.js precaches ${url}, which is not in public/`);
}

const bypassSrc = sw.match(/const BYPASS = \/(.+)\/;/)?.[1];
if (!bypassSrc) fail("public/sw.js: BYPASS not found");
else {
  const bypass = new RegExp(bypassSrc);
  for (const path of ["/go/wise", "/out/wise", "/api/quotes", "/sw.js"]) {
    if (!bypass.test(path)) fail(`public/sw.js BYPASS no longer covers ${path} — it would be cached`);
  }
  for (const path of ["/", "/send-money/usa-to-india", "/google", "/outbound-guide"]) {
    if (bypass.test(path)) fail(`public/sw.js BYPASS wrongly matches ${path}`);
  }
}

if (failures.length) {
  console.error(`\n[check:pwa] ${failures.length} problem(s):\n  - ${failures.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(`[check:pwa] ok — ${icons.length} icons, ${(m.screenshots ?? []).length} screenshots, ${(m.shortcuts ?? []).length} shortcuts, offline revision ${revision}`);
