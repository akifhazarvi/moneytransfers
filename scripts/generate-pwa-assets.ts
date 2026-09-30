/**
 * Renders the PWA image assets the web app manifest points at.
 *
 *   public/icons/maskable-192.png   full-bleed, plane inside the 80% safe zone
 *   public/icons/maskable-512.png   (Android crops these to its own shape)
 *   public/apple-touch-icon.png     180×180, OPAQUE — iOS paints transparent
 *                                   pixels black, so the old rounded-corner
 *                                   PNG showed black corners on the home screen
 *   public/pwa/screenshot-wide.jpg    1280×720  (desktop install dialog)
 *   public/pwa/screenshot-narrow.jpg  780×1688  (Android install sheet)
 *
 * Icons are drawn from the same geometry as public/icon.svg, so there is one
 * mark, not a redrawn copy. Screenshots need a running site and are opt-in.
 *
 * Usage:
 *   npx tsx scripts/generate-pwa-assets.ts
 *   npx tsx scripts/generate-pwa-assets.ts --screenshots http://localhost:3000
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(__dirname, "..");

// Paper plane from public/icon.svg (32×32 box). Its visual centre is
// (16.25, 16.75); `scale` shrinks it about that point.
function iconSvg(scale: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2D3A8C"/>
      <stop offset="100%" stop-color="#1E2761"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="url(#g)"/>
  <g transform="translate(16 16) scale(${scale}) translate(-16.25 -16.75)">
    <path d="M6.5 16.8L26 6L21 27.5L15 20Z" fill="white"/>
    <path d="M15 20L26 6" stroke="#2D3A8C" stroke-width="0.8" opacity="0.6"/>
    <path d="M15 20L21 27.5L18.2 21Z" fill="white" opacity="0.5"/>
  </g>
</svg>`;
}

// The maskable safe zone is a circle of radius 0.4 × size. The plane's
// half-diagonal is ~14.5 units, so 0.7 puts it at ~10.2 < 12.8.
const ICONS = [
  { out: "public/icons/maskable-192.png", size: 192, scale: 0.7 },
  { out: "public/icons/maskable-512.png", size: 512, scale: 0.7 },
  { out: "public/apple-touch-icon.png", size: 180, scale: 0.8 },
];

const SCREENSHOTS = [
  { out: "public/pwa/screenshot-wide.jpg", width: 1280, height: 720, dpr: 1, mobile: false },
  { out: "public/pwa/screenshot-narrow.jpg", width: 390, height: 844, dpr: 2, mobile: true },
];

async function main() {
  const shotsIdx = process.argv.indexOf("--screenshots");
  const baseUrl = shotsIdx > -1 ? process.argv[shotsIdx + 1] : null;

  mkdirSync(join(ROOT, "public/icons"), { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const icon of ICONS) {
      const page = await browser.newPage({ viewport: { width: icon.size, height: icon.size } });
      const src = `data:image/svg+xml;base64,${Buffer.from(iconSvg(icon.scale)).toString("base64")}`;
      await page.setContent(
        `<html><body style="margin:0"><img src="${src}" width="${icon.size}" height="${icon.size}" style="display:block"></body></html>`,
      );
      await page.screenshot({ path: join(ROOT, icon.out), omitBackground: false });
      await page.close();
      console.log(`wrote ${icon.out} (${icon.size}×${icon.size})`);
    }

    if (baseUrl) {
      mkdirSync(join(ROOT, "public/pwa"), { recursive: true });
      for (const shot of SCREENSHOTS) {
        const context = await browser.newContext({
          viewport: { width: shot.width, height: shot.height },
          deviceScaleFactor: shot.dpr,
          isMobile: shot.mobile,
          hasTouch: shot.mobile,
          // Keep the install prompt out of its own screenshot.
          serviceWorkers: "block",
        });
        await context.addInitScript(() => {
          try {
            localStorage.setItem("smc_pwa_dismissed_at", String(Date.now()));
          } catch {}
        });
        // No cookie banner in the shot, and no analytics hit from taking it.
        await context.addCookies([
          { name: "smc_consent", value: "granted", url: baseUrl },
          { name: "geo-country", value: "US", url: baseUrl },
        ]);
        await context.route(
          /googletagmanager\.com|google-analytics\.com|clarity\.ms|googlesyndication\.com|doubleclick\.net|\/_vercel\/insights\//,
          (route) => route.abort(),
        );
        const page = await context.newPage();
        await page.goto(baseUrl, { waitUntil: "networkidle" });
        await page.screenshot({ path: join(ROOT, shot.out), type: "jpeg", quality: 80 });
        await context.close();
        console.log(`wrote ${shot.out} (${shot.width * shot.dpr}×${shot.height * shot.dpr})`);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
