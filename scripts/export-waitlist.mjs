#!/usr/bin/env node
/**
 * Export the Data API waitlist (src/lib/api-waitlist.ts) as CSV.
 *
 *   node --env-file=.env.local scripts/export-waitlist.mjs > waitlist.csv
 *   node --env-file=.env.local scripts/export-waitlist.mjs --suspect > suspect.csv
 *   node --env-file=.env.local scripts/export-waitlist.mjs --summary
 *
 * The CSV holds email addresses: keep it out of the repo and delete it when done.
 */

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
if (!URL_ || !TOKEN) {
  console.error("Set KV_REST_API_URL and KV_REST_API_TOKEN (run with --env-file=.env.local).");
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const key = args.has("--suspect") ? "wl:api:suspect" : "wl:api";

async function cmd(...command) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}

const pairs = (flat) => {
  const out = [];
  for (let i = 0; i < (flat?.length ?? 0); i += 2) out.push([flat[i], flat[i + 1]]);
  return out;
};

const rows = pairs(await cmd("HGETALL", key)).map(([email, json]) => {
  let r = {};
  try {
    r = JSON.parse(json);
  } catch {
    r = { note: json };
  }
  return { email, ...r };
});
const first = new Map(pairs(await cmd("HGETALL", "wl:api:first")));
rows.sort((a, b) => String(first.get(a.email) ?? a.at).localeCompare(String(first.get(b.email) ?? b.at)));

if (args.has("--summary")) {
  const tally = (field) =>
    Object.entries(rows.reduce((m, r) => ((m[r[field] || "(blank)"] = (m[r[field] || "(blank)"] ?? 0) + 1), m), {}))
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `  ${k}: ${n}`)
      .join("\n");
  console.log(`${key}: ${rows.length} signups\n\nBy plan\n${tally("plan")}\n\nBy use case\n${tally("useCase")}\n\nBy country\n${tally("country")}`);
  process.exit(0);
}

const cols = ["email", "firstJoined", "lastJoined", "plan", "useCase", "company", "note", "country", "suspect"];
const esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
console.log(cols.join(","));
for (const r of rows) {
  console.log(
    [r.email, first.get(r.email) ?? "", r.at, r.plan, r.useCase, r.company, r.note, r.country, r.suspect].map(esc).join(","),
  );
}
