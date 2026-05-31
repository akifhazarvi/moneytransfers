// Intentionally empty.
//
// Next.js 16 unconditionally bundles `polyfill-module` (Array.prototype.at,
// Object.hasOwn, Object.fromEntries, Array.prototype.flat/flatMap,
// String.prototype.trimStart/trimEnd, etc.) into the client runtime for ALL
// browsers — it ignores the package.json `browserslist` for these. Every
// feature it polyfills is Baseline-supported in the browsers we target
// (Chrome/Firefox/Safari/Edge "last 2 versions"), so shipping it is dead
// weight that Lighthouse flags as "legacy JavaScript".
//
// next.config.ts aliases the polyfill-module import to this empty file via
// Turbopack `resolveAlias`, dropping ~14 KiB from the client bundle. If we
// ever need to support pre-2023 browsers, remove that alias.
export {};
