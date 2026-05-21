/**
 * Build-time check: verify the SHA-256 hashes in src/lib/inline-scripts.ts
 * match the actual inline script bodies. If they drift, the CSP in
 * middleware.ts blocks the inline scripts (silently killing GA4 and theme
 * init), and there's no runtime hint pointing at this file as the cause.
 *
 * Run from package.json prebuild so a stale hash fails CI before deploy.
 */
import { createHash } from "node:crypto";
import {
  GTAG_INLINE,
  GTAG_INLINE_SHA256,
  THEME_INLINE,
  THEME_INLINE_SHA256,
} from "../src/lib/inline-scripts";

function sha256Base64(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("base64");
}

const checks: { name: string; body: string; expected: string }[] = [
  { name: "GTAG_INLINE", body: GTAG_INLINE, expected: GTAG_INLINE_SHA256 },
  { name: "THEME_INLINE", body: THEME_INLINE, expected: THEME_INLINE_SHA256 },
];

let failed = false;
for (const c of checks) {
  const actual = sha256Base64(c.body);
  if (actual !== c.expected) {
    failed = true;
    console.error(
      `\n[inline-scripts] ${c.name} hash mismatch.\n` +
        `  expected: ${c.expected}\n` +
        `  actual:   ${actual}\n` +
        `Update the corresponding *_SHA256 constant in src/lib/inline-scripts.ts to '${actual}' (or revert the script body).`,
    );
  }
}

if (failed) {
  process.exit(1);
}
console.log("[inline-scripts] hashes ok");
