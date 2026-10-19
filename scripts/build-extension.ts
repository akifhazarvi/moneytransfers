/**
 * Build the browser extension (extension/src → extension/build + a store zip).
 *
 *   npx tsx scripts/build-extension.ts                       # production
 *   npx tsx scripts/build-extension.ts --api=http://localhost:3000   # against `next dev`
 *
 * The source is plain ES modules and loads as-is; the build only adds what is
 * generated from the site's own data, so the extension cannot drift from it:
 *
 *   data/currencies.js  the /send-money currency lists (send + receive), with
 *                       country names for search and a flag per currency
 *   flags/              every flag the site hosts (public/flags), plus those it
 *                       takes from the circle-flags CDN, fetched once into
 *                       extension/assets/flags/ (committed) — the popup makes no
 *                       third-party request. FLAG_FILES lists them, so a reader's
 *                       country in the live activity strip finds its flag.
 *   icons/              16/32/48/128 px from public/icon-512x512.png
 *   content.js          the automatic price check, one classic script: config,
 *                       currencies and the lib modules it uses, then
 *                       content/main.js (content scripts cannot import)
 *   manifest.json       optional_host_permissions = the price check's sites,
 *                       from lib/hosts.js
 *
 * --grant-price-check (tests only) grants those sites at install instead, so an
 * automated browser can exercise the price check without a permission prompt.
 *
 * The zip (extension/sendmoneycompare-extension-<version>.zip) is what gets
 * uploaded to the Chrome Web Store and Microsoft Edge Add-ons; it is always a
 * production build, so --api skips it.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import { getFlagUrl } from "@/components/CircleFlag";
import { sendCurrencies, currencies } from "@/data/transfer-currencies";
import { getCountriesByCurrency } from "@/data/currencies";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "extension/src");
const OUT = path.join(ROOT, "extension/build");
const ASSET_FLAGS = path.join(ROOT, "extension/assets/flags");
const PUBLIC = path.join(ROOT, "public");

const api = process.argv.find((a) => a.startsWith("--api="))?.slice("--api=".length);
const grantPriceCheck = process.argv.includes("--grant-price-check");

// What content.js is made of, in order. Each is an ES module whose imports are
// all in this list, so dropping import lines and `export` keywords leaves one
// self-contained script.
const CONTENT_PARTS = ["config.js", "data/currencies.js", "lib/format.js", "lib/hosts.js", "lib/detect.js", "lib/verdict.js", "content/main.js"];

function asClassicScript(code: string): string {
  return code.replace(/^import .*;\s*$/gm, "").replace(/^export (?=(?:async )?function |const |let |class )/gm, "");
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

async function flagFile(code: string): Promise<string> {
  const url = getFlagUrl(code);
  if (url.startsWith("/flags/")) {
    const name = path.basename(url);
    cpSync(path.join(PUBLIC, url), path.join(OUT, "flags", name));
    return `flags/${name}`;
  }
  const name = path.basename(new URL(url).pathname);
  const cached = path.join(ASSET_FLAGS, name);
  if (!existsSync(cached)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      mkdirSync(ASSET_FLAGS, { recursive: true });
      writeFileSync(cached, Buffer.from(await res.arrayBuffer()));
    } catch (err) {
      console.warn(`  flag ${code}: ${url} unavailable (${(err as Error).message}); using the generic flag`);
      return "flags/generic.svg";
    }
  }
  cpSync(cached, path.join(OUT, "flags", name));
  return `flags/${name}`;
}

async function currencyList(list: readonly { code: string; name: string; symbol: string }[]) {
  const out = [];
  for (const c of list) {
    const countries = [...new Set(getCountriesByCurrency(c.code).map((x) => titleCase(x.country)))].join(", ");
    out.push({ code: c.code, name: c.name, symbol: c.symbol, flag: await flagFile(c.code), countries });
  }
  return out;
}

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  cpSync(SRC, OUT, { recursive: true });
  mkdirSync(path.join(OUT, "flags"), { recursive: true });
  mkdirSync(path.join(OUT, "data"), { recursive: true });
  mkdirSync(path.join(OUT, "icons"), { recursive: true });

  cpSync(path.join(PUBLIC, "flags"), path.join(OUT, "flags"), { recursive: true });
  const send = await currencyList(sendCurrencies);
  const all = await currencyList(currencies);
  const flagFiles = readdirSync(path.join(OUT, "flags"))
    .filter((f) => f.endsWith(".svg"))
    .map((f) => f.slice(0, -4))
    .sort();
  writeFileSync(
    path.join(OUT, "data/currencies.js"),
    [
      "// Generated by scripts/build-extension.ts from src/data/transfer-currencies.ts. Do not edit.",
      `export const SEND = ${JSON.stringify(send)};`,
      `export const ALL = ${JSON.stringify(all)};`,
      "export const CURRENCY = Object.fromEntries([...ALL, ...SEND].map((c) => [c.code, c]));",
      `export const FLAG_FILES = new Set(${JSON.stringify(flagFiles)});`,
      "",
    ].join("\n"),
  );

  for (const size of [16, 32, 48, 128]) {
    await sharp(path.join(PUBLIC, "icon-512x512.png"))
      .resize(size, size)
      .png()
      .toFile(path.join(OUT, `icons/icon-${size}.png`));
  }

  const { priceCheckOrigins } = (await import(path.join(SRC, "lib/hosts.js"))) as { priceCheckOrigins: () => string[] };
  const manifestPath = path.join(OUT, "manifest.json");
  const built = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (grantPriceCheck) built.host_permissions = priceCheckOrigins();
  else built.optional_host_permissions = priceCheckOrigins();
  writeFileSync(manifestPath, `${JSON.stringify(built, null, 2)}\n`);

  if (api) {
    const config = path.join(OUT, "config.js");
    const before = readFileSync(config, "utf8");
    const after = before.replace(/export const API = "[^"]*";/, `export const API = ${JSON.stringify(api.replace(/\/$/, ""))};`);
    if (after === before) throw new Error("config.js: API line not found");
    writeFileSync(config, after);
  }

  writeFileSync(
    path.join(OUT, "content.js"),
    [
      "// Generated by scripts/build-extension.ts from extension/src (see CONTENT_PARTS). Do not edit.",
      "(() => {",
      ...CONTENT_PARTS.map((part) => `// ── ${part}\n${asClassicScript(readFileSync(path.join(OUT, part), "utf8"))}`),
      "})();",
      "",
    ].join("\n"),
  );
  rmSync(path.join(OUT, "content"), { recursive: true, force: true });

  // Every file the manifest and pages name must be in the build.
  const manifest = JSON.parse(readFileSync(path.join(OUT, "manifest.json"), "utf8"));
  const referenced = [
    ...Object.values(manifest.icons as Record<string, string>),
    ...Object.values(manifest.action.default_icon as Record<string, string>),
    manifest.action.default_popup,
    manifest.background.service_worker,
  ];
  const missing = referenced.filter((f) => !existsSync(path.join(OUT, f)));
  if (missing.length) throw new Error(`Missing from the build: ${missing.join(", ")}`);

  console.log(`Built extension ${manifest.version} → ${path.relative(ROOT, OUT)}${api ? ` (API ${api})` : ""}`);
  console.log(`  ${send.length} send / ${all.length} receive currencies`);

  if (!api && !grantPriceCheck) {
    const zip = path.join(ROOT, `extension/sendmoneycompare-extension-${manifest.version}.zip`);
    rmSync(zip, { force: true });
    execFileSync("zip", ["-qr", "-X", zip, "."], { cwd: OUT });
    console.log(`  store package → ${path.relative(ROOT, zip)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
