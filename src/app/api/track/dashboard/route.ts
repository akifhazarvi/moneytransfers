import { sql } from "@vercel/postgres";

/**
 * Live tracking dashboard — a single HTML page rendering everything in the
 * first-party event store: provider split, leak status (id_source), geo,
 * daily trend, and a per-click log with CSV export.
 *
 * Served as a GET route (not a React page) so it reads the DB on every load
 * and stays trivially self-contained. Secret-gated: /track-dashboard?key=...
 * Reuses the same financial-terminal look as the Q3 plan for continuity.
 */

export const dynamic = "force-dynamic";

const days = 28;

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

export async function GET(request: Request) {
  const secret = process.env.TRACK_REPORT_KEY;
  const { searchParams } = new URL(request.url);
  if (!secret) return new Response("report disabled", { status: 503 });
  if (searchParams.get("key") !== secret) return new Response("unauthorized", { status: 401 });
  if (!process.env.POSTGRES_URL) return new Response("store not provisioned", { status: 503 });

  try {
    const [totals, byIdSource, providers, geo, daily, clicks] = await Promise.all([
      sql`SELECT count(*)::int AS total_redirects,
                 count(*) FILTER (WHERE is_bot IS NOT TRUE)::int AS non_bot,
                 count(DISTINCT vid)::int AS unique_visitors
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval`,
      sql`SELECT coalesce(id_source,'(none)') AS id_source, count(*)::int AS n
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
          GROUP BY id_source ORDER BY n DESC`,
      sql`SELECT coalesce(provider,'(none)') AS provider, count(*)::int AS n,
                 count(*) FILTER (WHERE is_bot IS NOT TRUE)::int AS non_bot
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
          GROUP BY provider ORDER BY n DESC LIMIT 25`,
      sql`SELECT coalesce(country,'(none)') AS country, count(*)::int AS n
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
          GROUP BY country ORDER BY n DESC LIMIT 15`,
      sql`SELECT to_char(date_trunc('day',ts),'MM-DD') AS day, count(*)::int AS n
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
          GROUP BY 1 ORDER BY 1 ASC`,
      sql`SELECT to_char(ts,'MM-DD HH24:MI') AS t, provider, corridor, click_id,
                 id_source, is_bot, bot_score, bot_reasons, traffic_source, country
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
          ORDER BY ts DESC LIMIT 200`,
    ]);

    const t = totals.rows[0] || {};
    const maxProv = Math.max(1, ...providers.rows.map((r) => Number(r.n)));
    const maxDay = Math.max(1, ...daily.rows.map((r) => Number(r.n)));
    const maxGeo = Math.max(1, ...geo.rows.map((r) => Number(r.n)));

    // leak status: fabricated/(none) is bad, the rest are captured
    const idColor = (s: string) =>
      s === "fabricated" || s === "(none)" ? "var(--red)" : "var(--green)";

    const csvRows = [
      "timestamp,bot_score,bot_reasons,provider,corridor,click_id,id_source,is_bot,traffic_source,country",
      ...clicks.rows.map((r) =>
        [r.t, r.bot_score, r.bot_reasons, r.provider, r.corridor, r.click_id, r.id_source, r.is_bot, r.traffic_source, r.country]
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    // Score colour: high = likely bot (red), mid = suspicious (amber), low = real (green)
    const scoreColor = (n: number) => (n >= 60 ? "var(--red)" : n >= 30 ? "var(--amber)" : "var(--green)");

    const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SMC · Tracking Dashboard</title>
<style>
  :root{--bg:#0E1B2A;--bg2:#14253A;--bg3:#1B304A;--tx:#E8EEF2;--dim:#8AA0B4;--faint:#5E768C;
    --green:#3DD68C;--amber:#F0A93B;--red:#E8665B;--blue:#6FA8DC;--line:#25405C;
    --mono:"SF Mono",Menlo,Consolas,monospace;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font-family:var(--sans);line-height:1.5}
  .wrap{max-width:1080px;margin:0 auto;padding:28px 20px 80px}
  h1{font-size:22px;margin:0 0 4px;letter-spacing:-.01em}
  .sub{color:var(--faint);font-family:var(--mono);font-size:12px;margin-bottom:24px}
  .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
  .kpi{border:1px solid var(--line);border-radius:6px;padding:18px;background:linear-gradient(180deg,var(--bg2),var(--bg))}
  .kpi .v{font-family:var(--mono);font-size:30px;font-weight:600;color:var(--green)}
  .kpi .k{color:var(--dim);font-size:13px;margin-top:6px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
  .card{border:1px solid var(--line);border-radius:6px;background:var(--bg2);padding:18px;overflow:hidden}
  .card.full{grid-column:1/-1}
  .card h2{font-size:12px;font-family:var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin:0 0 14px}
  .bar{display:grid;grid-template-columns:130px 1fr 46px;gap:10px;align-items:center;padding:4px 0;font-size:13px}
  .bar .lbl{font-family:var(--mono);color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bar .track{height:9px;background:var(--bg3);border-radius:2px;overflow:hidden}
  .bar .fill{height:100%;border-radius:2px}
  .bar .n{font-family:var(--mono);text-align:right;color:var(--dim)}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;padding:8px 10px;font-family:var(--mono);font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:var(--faint);border-bottom:1px solid var(--line)}
  td{padding:7px 10px;border-bottom:1px solid var(--line);color:var(--dim);font-family:var(--mono);font-size:11px;white-space:nowrap}
  td.p{color:var(--green)}
  .scroll{overflow-x:auto}
  .btn{font-family:var(--mono);font-size:12px;background:var(--bg3);border:1px solid var(--line);color:var(--green);padding:6px 12px;border-radius:4px;cursor:pointer;text-decoration:none;display:inline-block}
  .row-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
  .row-head h2{margin:0}
  .spark{display:flex;align-items:flex-end;gap:3px;height:80px}
  .spark .b{flex:1;background:var(--green);border-radius:2px 2px 0 0;min-height:2px;opacity:.85}
  .spark .b span{display:block}
  .daylbl{display:flex;gap:3px;margin-top:6px}
  .daylbl span{flex:1;text-align:center;font-family:var(--mono);font-size:9px;color:var(--faint)}
  @media(max-width:720px){.kpis,.grid{grid-template-columns:1fr}}
</style></head><body>
<div class="wrap">
  <h1>Tracking Dashboard</h1>
  <div class="sub">first-party event store · affiliate_redirect · last ${days} days · refreshes on reload</div>

  <div class="kpis">
    <div class="kpi"><div class="v">${esc(t.total_redirects)}</div><div class="k">Total redirects</div></div>
    <div class="kpi"><div class="v">${esc(t.non_bot)}</div><div class="k">Non-bot redirects</div></div>
    <div class="kpi"><div class="v">${esc(t.unique_visitors)}</div><div class="k">Unique visitors</div></div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Providers — where they went</h2>
      ${providers.rows.map((r) => `<div class="bar"><span class="lbl">${esc(r.provider)}</span><div class="track"><div class="fill" style="width:${Math.round((Number(r.n) / maxProv) * 100)}%;background:var(--green)"></div></div><span class="n">${esc(r.n)}</span></div>`).join("")}
    </div>
    <div class="card">
      <h2>Leak status — how each click was identified</h2>
      ${byIdSource.rows.map((r) => `<div class="bar"><span class="lbl">${esc(r.id_source)}</span><div class="track"><div class="fill" style="width:${Math.round((Number(r.n) / Math.max(1, ...byIdSource.rows.map((x) => Number(x.n)))) * 100)}%;background:${idColor(String(r.id_source))}"></div></div><span class="n">${esc(r.n)}</span></div>`).join("")}
      <div style="margin-top:12px;font-size:11px;color:var(--faint);font-family:var(--mono)">green = captured (vid/cid) · red = fabricated/none = the leak</div>
    </div>
    <div class="card">
      <h2>Top countries</h2>
      ${geo.rows.map((r) => `<div class="bar"><span class="lbl">${esc(r.country)}</span><div class="track"><div class="fill" style="width:${Math.round((Number(r.n) / maxGeo) * 100)}%;background:var(--blue)"></div></div><span class="n">${esc(r.n)}</span></div>`).join("")}
    </div>
    <div class="card">
      <h2>Redirects per day</h2>
      <div class="spark">${daily.rows.map((r) => `<div class="b" style="height:${Math.round((Number(r.n) / maxDay) * 100)}%" title="${esc(r.day)}: ${esc(r.n)}"></div>`).join("")}</div>
      <div class="daylbl">${daily.rows.map((r) => `<span>${esc(r.day)}</span>`).join("")}</div>
    </div>
  </div>

  <div class="card full" style="margin-top:14px">
    <div class="row-head">
      <h2>Per-click log — newest 200 (TapTap proof)</h2>
      <button class="btn" onclick="dl()">⬇ Export CSV</button>
    </div>
    <div class="scroll"><table>
      <thead><tr><th>Score</th><th>Time</th><th>Provider</th><th>Corridor</th><th>Country</th><th>ID src</th><th>Source</th><th>Why flagged</th></tr></thead>
      <tbody>${clicks.rows.map((r) => { const sc = Number(r.bot_score ?? 0); return `<tr><td style="color:${scoreColor(sc)};font-weight:600">${esc(r.bot_score ?? "-")}</td><td>${esc(r.t)}</td><td class="p">${esc(r.provider)}</td><td>${esc(r.corridor)}</td><td>${esc(r.country)}</td><td>${esc(r.id_source)}</td><td>${esc(r.traffic_source)}</td><td style="white-space:normal;max-width:340px;color:var(--faint)">${esc(r.bot_reasons)}</td></tr>`; }).join("")}</tbody>
    </table></div>
  </div>
</div>
<script>
  const CSV = ${JSON.stringify(csvRows)};
  function dl(){const b=new Blob([CSV],{type:"text/csv"});const a=document.createElement("a");
    a.href=URL.createObjectURL(b);a.download="smc-clicks-${days}d.csv";a.click();}
</script>
</body></html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  } catch (e) {
    return new Response(
      `dashboard error: ${e instanceof Error ? e.message : String(e)}`,
      { status: 500 },
    );
  }
}
