import { test as base, expect, type BrowserContext, type Page } from "@playwright/test";

/**
 * Shared fixtures for the PWA suite.
 *
 * Every context blocks third-party tags and beacons, so a run against a live
 * deployment never lands in GA4, Clarity, AdSense or Vercel Analytics, and no
 * test waits on them. (GA4 is also disabled by GTAG_INLINE whenever
 * navigator.webdriver is true, but gtag() still queues into dataLayer, which is
 * how the tests below read which events fired.)
 *
 * Every context also swallows any REAL `beforeinstallprompt`, so whether
 * headless Chromium decides the page is installable never changes a result.
 * Tests that need a prompt dispatch a fake one with `offerInstallPrompt`.
 */
const THIRD_PARTY =
  /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|clarity\.ms|googlesyndication\.com|doubleclick\.net|adtrafficquality\.google|trustpilot\.com|bing\.com/;

export const test = base.extend({
  // Named `provide`, not `use`: eslint's React hooks rule mistakes the
  // conventional `use` callback for React's use() hook.
  context: async ({ context }, provide) => {
    await context.route(THIRD_PARTY, (route) => route.abort());
    await context.route("**/_vercel/insights/**", (route) => route.abort());
    await context.addInitScript(() => {
      addEventListener(
        "beforeinstallprompt",
        (e) => {
          if (!(e as Event & { __fake?: boolean }).__fake) e.stopImmediatePropagation();
        },
        true,
      );
    });
    await provide(context);
  },
});

export { expect };

declare global {
  interface Window {
    __installPromptCalls?: number;
    dataLayer?: unknown[];
  }
}

/**
 * Behave like Chromium on an installable page: fire `beforeinstallprompt` on
 * every load, with a prompt() that records the call and answers `outcome`.
 */
export async function offerInstallPrompt(context: BrowserContext, outcome: "accepted" | "dismissed" = "accepted") {
  await context.addInitScript((answer) => {
    window.__installPromptCalls = 0;
    addEventListener("DOMContentLoaded", () => {
      const e = new Event("beforeinstallprompt", { cancelable: true });
      Object.assign(e, {
        __fake: true,
        prompt: () => {
          window.__installPromptCalls = (window.__installPromptCalls ?? 0) + 1;
          return Promise.resolve();
        },
        userChoice: Promise.resolve({ outcome: answer, platform: "web" }),
      });
      dispatchEvent(e);
    });
  }, outcome);
}

/** Pretend the page is running inside the installed app. */
export async function runAsInstalledApp(context: BrowserContext) {
  await context.addInitScript(() => {
    const real = window.matchMedia.bind(window);
    window.matchMedia = (query: string) =>
      /display-mode:\s*standalone/.test(query)
        ? ({ ...real(query), matches: true, media: query } as MediaQueryList)
        : real(query);
  });
}

/** Wait until the service worker controls this page. */
export async function waitForServiceWorker(page: Page) {
  await page.waitForFunction(() => navigator.serviceWorker?.controller != null, null, { timeout: 30_000 });
}

/** Paths (with query) of the pages saved for offline use. */
export async function savedPages(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const cache = await caches.open("smc-pages-v1");
    return (await cache.keys()).map((r) => {
      const u = new URL(r.url);
      return u.pathname + u.search;
    });
  });
}

/** Every URL path held in any of the worker's caches. */
export async function everyCachedPath(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const paths: string[] = [];
    for (const name of await caches.keys()) {
      if (!name.startsWith("smc-")) continue;
      for (const r of await (await caches.open(name)).keys()) paths.push(new URL(r.url).pathname);
    }
    return paths;
  });
}

/** Names of the gtag events queued on this page. */
export async function trackedEvents(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => entry as unknown as ArrayLike<unknown>)
      .filter((a) => a && a[0] === "event")
      .map((a) => String(a[1])),
  );
}

/** Parameters of each queued gtag event with this name, in order. */
export async function trackedEventParams(page: Page, name: string): Promise<Record<string, unknown>[]> {
  return page.evaluate(
    (eventName) =>
      (window.dataLayer ?? [])
        .map((entry) => entry as unknown as ArrayLike<unknown>)
        .filter((a) => a && a[0] === "event" && a[1] === eventName)
        .map((a) => (a[2] ?? {}) as Record<string, unknown>),
    name,
  );
}

export const installPrompt = (page: Page) => page.locator("[data-pwa-install-prompt]");

/**
 * Scroll to an install slot until the offer appears, as a reader would keep
 * scrolling. On a live deployment the quotes can land after the first scroll
 * and push the slot back out of reach; one scroll and a wait is a timing bet
 * that failed on production (a27e148d7) while passing against `next start`.
 */
export async function scrollUntilOffered(page: Page, slot = page.locator("[data-pwa-install-slot]").first()) {
  await expect(async () => {
    await slot.scrollIntoViewIfNeeded();
    await expect(installPrompt(page)).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 20_000 });
}
