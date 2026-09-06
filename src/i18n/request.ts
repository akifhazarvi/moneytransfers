import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { SITE_STATS, atLeast } from "@/lib/site-stats";

/**
 * Resolve coverage placeholders in the message catalogue.
 *
 * 16 strings — including `metadata.description`, which renders on all ~1,340
 * pages — hand-typed "50+ apps" and "80+ corridors". Those were the single
 * largest source of the site contradicting itself, and they live in JSON where
 * a TypeScript constant cannot reach them.
 *
 * The placeholder is `%NAME%` rather than `{name}` because next-intl parses
 * braces as ICU syntax; an unknown ICU argument throws at render time.
 */
function resolveCoverage(value: unknown): unknown {
  if (typeof value === "string") {
    if (!value.includes("%")) return value;
    return value
      .split("%PROVIDER_COUNT%").join(atLeast(SITE_STATS.liveProviders))
      .split("%CORRIDOR_COUNT%").join(atLeast(SITE_STATS.comparableCorridors))
      .split("%CURRENCY_COUNT%").join(atLeast(SITE_STATS.currencies));
  }
  if (Array.isArray(value)) return value.map(resolveCoverage);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, resolveCoverage(v)]),
    );
  }
  return value;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as "en")) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages: resolveCoverage(messages) as typeof messages,
  };
});
