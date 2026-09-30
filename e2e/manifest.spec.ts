import { test, expect } from "./fixtures";

type Icon = { src: string; sizes?: string; type?: string; purpose?: string };

test.describe("installability", () => {
  test("the manifest is installable and every asset it names resolves", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/manifest+json");

    const m = await res.json();
    expect(m).toMatchObject({ id: "/", start_url: "/", scope: "/", display: "standalone", short_name: "SendMoney" });

    const icons: Icon[] = m.icons;
    expect(icons.some((i) => i.sizes === "192x192" && i.type === "image/png" && i.purpose?.includes("any"))).toBe(true);
    expect(icons.some((i) => i.sizes === "512x512" && i.type === "image/png" && i.purpose?.includes("any"))).toBe(true);
    expect(icons.some((i) => i.purpose?.includes("maskable"))).toBe(true);
    expect(m.screenshots.map((s: { form_factor: string }) => s.form_factor).sort()).toEqual(["narrow", "wide"]);

    const assets: Icon[] = [...icons, ...m.screenshots, ...m.shortcuts.flatMap((s: { icons?: Icon[] }) => s.icons ?? [])];
    for (const asset of assets) {
      const r = await request.get(asset.src);
      expect(r.status(), asset.src).toBe(200);
      expect(r.headers()["content-type"], asset.src).toMatch(/^image\//);
    }
  });

  test("every shortcut opens a real page", async ({ page, request }) => {
    const m = await (await request.get("/manifest.webmanifest")).json();
    expect(m.shortcuts.length).toBeGreaterThan(0);
    for (const s of m.shortcuts as { url: string }[]) {
      const res = await page.goto(s.url);
      expect(res?.status(), s.url).toBe(200);
      await expect(page.locator("h1").first(), s.url).toBeVisible();
    }
  });

  test("pages link one manifest and carry the home-screen metadata", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
    await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute("content", "SendMoney");
    await expect(page.locator('meta[name="mobile-web-app-capable"]')).toHaveAttribute("content", "yes");
  });

  test("the worker and offline page are served for the app, not for search", async ({ request }) => {
    const sw = await request.get("/sw.js");
    expect(sw.status()).toBe(200);
    expect(sw.headers()["content-type"]).toContain("javascript");
    expect(sw.headers()["cache-control"]).toContain("no-cache");
    expect(sw.headers()["service-worker-allowed"]).toBe("/");

    const offline = await request.get("/offline.html");
    expect(offline.status()).toBe(200);
    expect(offline.headers()["x-robots-tag"]).toBe("noindex");

    const csp = (await request.get("/")).headers()["content-security-policy"] ?? "";
    expect(csp).toContain("worker-src 'self'");
    expect(csp).toContain("manifest-src 'self'");
  });
});
