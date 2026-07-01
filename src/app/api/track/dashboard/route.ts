import { sql } from "@vercel/postgres";
import { ensureEventStore } from "@/lib/event-store";

/**
 * Live tracking dashboard — a single HTML page rendering everything in the
 * first-party event store: bot/human band split, provider split, leak status,
 * per-country real-rate, daily trend, and a filterable per-click log with CSV.
 *
 * Served as a GET route (not a React page) so it reads the DB on every load and
 * stays trivially self-contained. Secret-gated: /api/track/dashboard?key=…
 *
 * Query params (all optional):
 *   key      — required secret (TRACK_REPORT_KEY)
 *   days     — time window: 7 | 28 | 90 (default 28)
 *   filter   — log filter: all | human | suspect | bot | datacenter (default all)
 *   country  — restrict the log to one ISO country code
 *   purge    — admin: "preDeploy" deletes rows with no ip_class (pre-scorer
 *              data) for a clean slate. Requires the key. Confirmed client-side.
 *
 * NOTE on CTR: the store holds ONLY affiliate_redirect events (pageviews live
 * in GA4, client-side), so a true browse→click CTR isn't derivable here. The
 * per-country "real-rate" below (non-bot ÷ total redirects) is the honest
 * store-native signal: what share of each country's clicks look genuine.
 */

export const dynamic = "force-dynamic";

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

  // Window + filters (sanitised — only known values reach SQL).
  const days = [7, 28, 90].includes(Number(searchParams.get("days"))) ? Number(searchParams.get("days")) : 28;
  const filter = ["all", "human", "suspect", "bot", "datacenter"].includes(searchParams.get("filter") || "")
    ? (searchParams.get("filter") as string) : "all";
  const country = (searchParams.get("country") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
  const providerFilter = (searchParams.get("provider") || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 64) || null;
  const purge = searchParams.get("purge");

  try {
    await ensureEventStore();

    // ── Admin: purge pre-deploy rows (no ip_class = logged before the scorer) ─
    if (purge === "preDeploy") {
      const res = await sql`DELETE FROM events WHERE event='affiliate_redirect' AND ip_class IS NULL`;
      return new Response(
        `Deleted ${res.rowCount ?? 0} pre-deploy rows (ip_class IS NULL).\nReload the dashboard to see the clean slate.`,
        { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } },
      );
    }

    // @vercel/postgres' sql tag only accepts primitive values — it does NOT
    // support composing nested sql`` fragments. So the per-click log filter is
    // expressed as bound parameters that no-op when inactive: a score range
    // [lo,hi) (defaults to the full 0..101 range), a datacenter-only flag, and
    // an optional country. `filter`/`country` are already sanitised to known
    // values above, so this is safe parameterisation, not string-built SQL.
    const scoreLo = filter === "suspect" ? 30 : filter === "bot" ? 60 : 0;
    const scoreHi = filter === "human" ? 30 : filter === "suspect" ? 60 : 101;
    const dcOnly = filter === "datacenter";
    const ctry = country || null;

    const [totals, bands, byIdSource, providers, geo, daily, clicks] = await Promise.all([
      sql`SELECT count(*)::int AS total_redirects,
                 count(*) FILTER (WHERE coalesce(bot_score,0) < 30)::int AS humans,
                 count(*) FILTER (WHERE ip_class='datacenter')::int AS datacenter,
                 count(*) FILTER (WHERE coalesce(bot_score,0) >= 60)::int AS bots,
                 count(DISTINCT vid)::int AS unique_visitors
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
            AND (${providerFilter}::text IS NULL OR provider=${providerFilter})`,
      sql`SELECT
            count(*) FILTER (WHERE coalesce(bot_score,0) < 30)::int                              AS human,
            count(*) FILTER (WHERE coalesce(bot_score,0) >= 30 AND coalesce(bot_score,0) < 60)::int AS suspect,
            count(*) FILTER (WHERE coalesce(bot_score,0) >= 60 AND coalesce(bot_score,0) < 85)::int AS bot,
            count(*) FILTER (WHERE coalesce(bot_score,0) >= 85)::int                             AS certain
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
            AND (${providerFilter}::text IS NULL OR provider=${providerFilter})`,
      sql`SELECT coalesce(id_source,'(none)') AS id_source, count(*)::int AS n
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
            AND (${providerFilter}::text IS NULL OR provider=${providerFilter})
          GROUP BY id_source ORDER BY n DESC`,
      sql`SELECT coalesce(provider,'(none)') AS provider, count(*)::int AS n,
                 count(*) FILTER (WHERE coalesce(bot_score,0) < 30)::int AS human
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
            AND (${providerFilter}::text IS NULL OR provider=${providerFilter})
          GROUP BY provider ORDER BY n DESC LIMIT 25`,
      sql`SELECT coalesce(country,'(none)') AS country, count(*)::int AS n,
                 count(*) FILTER (WHERE coalesce(bot_score,0) < 30)::int AS human,
                 count(*) FILTER (WHERE ip_class='datacenter')::int AS dc
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
            AND (${providerFilter}::text IS NULL OR provider=${providerFilter})
          GROUP BY country ORDER BY n DESC LIMIT 15`,
      sql`SELECT to_char(date_trunc('day',ts),'MM-DD') AS day, count(*)::int AS n,
                 count(*) FILTER (WHERE coalesce(bot_score,0) >= 60)::int AS bots
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
            AND (${providerFilter}::text IS NULL OR provider=${providerFilter})
          GROUP BY 1 ORDER BY 1 ASC`,
      sql`SELECT to_char(ts,'MM-DD HH24:MI') AS t, provider, corridor, click_id,
                 id_source, is_bot, bot_score, bot_reasons, traffic_source, country,
                 ip_class, asn, asn_org
          FROM events WHERE event='affiliate_redirect'
            AND ts > now() - (${days}||' days')::interval
            AND coalesce(bot_score,0) >= ${scoreLo}
            AND coalesce(bot_score,0) < ${scoreHi}
            AND (${dcOnly} = false OR ip_class='datacenter')
            AND (${ctry}::text IS NULL OR country=${ctry})
            AND (${providerFilter}::text IS NULL OR provider=${providerFilter})
          ORDER BY ts DESC LIMIT 200`,
    ]);

    const t = totals.rows[0] || {};
    const b = bands.rows[0] || {};
    const total = Number(t.total_redirects) || 0;
    const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
    const realRate = pct(Number(t.humans));
    const maxProv = Math.max(1, ...providers.rows.map((r) => Number(r.n)));
    const maxDay = Math.max(1, ...daily.rows.map((r) => Number(r.n)));
    const maxGeo = Math.max(1, ...geo.rows.map((r) => Number(r.n)));

    const idColor = (s: string) =>
      s === "fabricated" || s === "(none)" ? "var(--red)" : "var(--green)";
    const scoreColor = (n: number) => (n >= 60 ? "var(--red)" : n >= 30 ? "var(--amber)" : "var(--green)");
    const bandName = (n: number) => (n >= 85 ? "certain" : n >= 60 ? "bot" : n >= 30 ? "suspect" : "human");

    const csvRows = [
      "timestamp,bot_score,band,bot_reasons,provider,corridor,click_id,id_source,is_bot,traffic_source,country,ip_class,asn,asn_org",
      ...clicks.rows.map((r) =>
        [r.t, r.bot_score, bandName(Number(r.bot_score ?? 0)), r.bot_reasons, r.provider, r.corridor, r.click_id, r.id_source, r.is_bot, r.traffic_source, r.country, r.ip_class, r.asn, r.asn_org]
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    // Build links that preserve key + the current selections.
    const link = (overrides: Record<string, string>) => {
      const p = new URLSearchParams({ key: secret, days: String(days), filter, ...(country ? { country } : {}), ...(providerFilter ? { provider: providerFilter } : {}) });
      for (const [k, v] of Object.entries(overrides)) v ? p.set(k, v) : p.delete(k);
      return `?${p.toString()}`;
    };
    const chip = (label: string, active: boolean, href: string) =>
      `<a class="chip${active ? " on" : ""}" href="${href}">${label}</a>`;

    // Stacked band bar segments.
    const seg = (n: number, color: string, label: string) =>
      total && n ? `<div class="seg" style="width:${(n / total) * 100}%;background:${color}" title="${label}: ${n} (${pct(n)}%)"></div>` : "";

    const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SMC · Tracking Dashboard</title>
<style>
  :root{--bg:#0E1B2A;--bg2:#14253A;--bg3:#1B304A;--tx:#E8EEF2;--dim:#8AA0B4;--faint:#5E768C;
    --green:#3DD68C;--amber:#F0A93B;--red:#E8665B;--blue:#6FA8DC;--purple:#B58BE0;--line:#25405C;
    --mono:"SF Mono",Menlo,Consolas,monospace;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font-family:var(--sans);line-height:1.5}
  .wrap{max-width:1100px;margin:0 auto;padding:28px 20px 80px}
  h1{font-size:22px;margin:0 0 4px;letter-spacing:-.01em}
  .sub{color:var(--faint);font-family:var(--mono);font-size:12px;margin-bottom:18px}
  .toolbar{display:flex;flex-wrap:wrap;gap:18px;align-items:center;margin-bottom:20px}
  .tgroup{display:flex;gap:6px;align-items:center}
  .tgroup .tlbl{font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);margin-right:2px}
  .chip{font-family:var(--mono);font-size:12px;color:var(--dim);background:var(--bg2);border:1px solid var(--line);
    padding:4px 10px;border-radius:999px;text-decoration:none;transition:all .12s}
  .chip:hover{color:var(--tx);border-color:var(--blue)}
  .chip.on{color:var(--bg);background:var(--blue);border-color:var(--blue);font-weight:600}
  .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px}
  .kpi{border:1px solid var(--line);border-radius:8px;padding:16px 18px;background:linear-gradient(180deg,var(--bg2),var(--bg))}
  .kpi .v{font-family:var(--mono);font-size:28px;font-weight:600;color:var(--green);line-height:1.1}
  .kpi .k{color:var(--dim);font-size:12px;margin-top:6px}
  .kpi .pct{font-size:13px;color:var(--faint);font-family:var(--mono)}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
  .card{border:1px solid var(--line);border-radius:8px;background:var(--bg2);padding:18px;overflow:hidden}
  .card.full{grid-column:1/-1}
  .card h2{font-size:12px;font-family:var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin:0 0 14px}
  .bandbar{display:flex;height:26px;border-radius:6px;overflow:hidden;background:var(--bg3);margin-bottom:12px}
  .bandbar .seg{height:100%}
  .legend{display:flex;flex-wrap:wrap;gap:14px;font-family:var(--mono);font-size:12px;color:var(--dim)}
  .legend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px;vertical-align:middle}
  .bar{display:grid;grid-template-columns:120px 1fr 88px;gap:10px;align-items:center;padding:4px 0;font-size:13px}
  .bar .lbl{font-family:var(--mono);color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bar .track{height:9px;background:var(--bg3);border-radius:2px;overflow:hidden;display:flex}
  .bar .fill{height:100%}
  .bar .n{font-family:var(--mono);text-align:right;color:var(--dim);font-size:12px}
  .bar .n small{color:var(--faint)}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;padding:8px 10px;font-family:var(--mono);font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:var(--faint);border-bottom:1px solid var(--line)}
  td{padding:7px 10px;border-bottom:1px solid var(--line);color:var(--dim);font-family:var(--mono);font-size:11px;white-space:nowrap}
  td.p{color:var(--green)}
  .pill{display:inline-block;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:600}
  .scroll{overflow-x:auto}
  .btn{font-family:var(--mono);font-size:12px;background:var(--bg3);border:1px solid var(--line);color:var(--green);padding:6px 12px;border-radius:5px;cursor:pointer;text-decoration:none;display:inline-block}
  .btn.danger{color:var(--red);border-color:var(--red)}
  .row-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
  .row-head h2{margin:0}
  .spark{display:flex;align-items:flex-end;gap:3px;height:80px}
  .spark .col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;min-height:2px}
  .spark .col .real{background:var(--green);border-radius:0 0 2px 2px}
  .spark .col .botseg{background:var(--red);border-radius:2px 2px 0 0}
  .daylbl{display:flex;gap:3px;margin-top:6px}
  .daylbl span{flex:1;text-align:center;font-family:var(--mono);font-size:9px;color:var(--faint);overflow:hidden}
  @media(max-width:720px){.kpis,.grid{grid-template-columns:1fr}}
</style></head><body>
<div class="wrap">
  <h1>Tracking Dashboard${providerFilter ? ` · ${esc(providerFilter)}` : ""}</h1>
  <div class="sub">first-party event store · affiliate_redirect · last ${days} days · refreshes on reload${providerFilter ? ` · filtered to ${esc(providerFilter)}` : ""}</div>

  <div class="toolbar">
    <div class="tgroup"><span class="tlbl">Window</span>
      ${[7, 28, 90].map((d) => chip(`${d}d`, days === d, link({ days: String(d) }))).join("")}
    </div>
    <div class="tgroup"><span class="tlbl">Log filter</span>
      ${[["all", "All"], ["human", "Human"], ["suspect", "Suspect"], ["bot", "Bot"], ["datacenter", "Datacenter"]]
        .map(([f, l]) => chip(l, filter === f, link({ filter: f }))).join("")}
    </div>
    ${country ? `<div class="tgroup"><span class="tlbl">Country</span>${chip(`${country} ✕`, true, link({ country: "" }))}</div>` : ""}
    ${providerFilter ? `<div class="tgroup"><span class="tlbl">Provider</span>${chip(`${providerFilter} ✕`, true, link({ provider: "" }))}</div>` : ""}
  </div>

  <div class="kpis">
    <div class="kpi"><div class="v">${esc(total)}</div><div class="k">Total redirects</div></div>
    <div class="kpi"><div class="v">${esc(t.humans)} <span class="pct">${realRate}%</span></div><div class="k">Human (score &lt;30)</div></div>
    <div class="kpi"><div class="v" style="color:var(--red)">${esc(t.bots)} <span class="pct">${pct(Number(t.bots))}%</span></div><div class="k">Bot (score ≥60)</div></div>
    <div class="kpi"><div class="v" style="color:var(--amber)">${esc(t.datacenter)} <span class="pct">${pct(Number(t.datacenter))}%</span></div><div class="k">Datacenter-IP clicks</div></div>
    <div class="kpi"><div class="v">${esc(t.unique_visitors)}</div><div class="k">Unique visitors</div></div>
  </div>

  <div class="card full" style="margin-top:14px">
    <h2>Traffic quality — score band split</h2>
    <div class="bandbar">
      ${seg(Number(b.human), "var(--green)", "Human")}
      ${seg(Number(b.suspect), "var(--amber)", "Suspect")}
      ${seg(Number(b.bot), "var(--red)", "Bot")}
      ${seg(Number(b.certain), "var(--purple)", "Certain")}
    </div>
    <div class="legend">
      <span><i style="background:var(--green)"></i>Human &lt;30 · ${esc(b.human)} (${pct(Number(b.human))}%)</span>
      <span><i style="background:var(--amber)"></i>Suspect 30–59 · ${esc(b.suspect)} (${pct(Number(b.suspect))}%)</span>
      <span><i style="background:var(--red)"></i>Bot 60–84 · ${esc(b.bot)} (${pct(Number(b.bot))}%)</span>
      <span><i style="background:var(--purple)"></i>Certain 85+ · ${esc(b.certain)} (${pct(Number(b.certain))}%)</span>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Providers — where they went</h2>
      ${providers.rows.map((r) => { const n = Number(r.n), h = Number(r.human); return `<div class="bar"><a class="lbl" style="text-decoration:none;color:var(--blue)" href="${link({ provider: String(r.provider) })}">${esc(r.provider)}</a><div class="track"><div class="fill" style="width:${(h / maxProv) * 100}%;background:var(--green)"></div><div class="fill" style="width:${((n - h) / maxProv) * 100}%;background:var(--red);opacity:.7"></div></div><span class="n">${n} <small style="color:var(--green)">${h}h</small></span></div>`; }).join("")}
      <div style="margin-top:10px;font-size:11px;color:var(--faint);font-family:var(--mono)"><i style="display:inline-block;width:9px;height:9px;background:var(--green);border-radius:2px"></i> human · <i style="display:inline-block;width:9px;height:9px;background:var(--red);opacity:.7;border-radius:2px"></i> bot/suspect</div>
    </div>
    <div class="card">
      <h2>Leak status — how each click was identified</h2>
      ${byIdSource.rows.map((r) => `<div class="bar"><span class="lbl">${esc(r.id_source)}</span><div class="track"><div class="fill" style="width:${(Number(r.n) / Math.max(1, ...byIdSource.rows.map((x) => Number(x.n)))) * 100}%;background:${idColor(String(r.id_source))}"></div></div><span class="n">${esc(r.n)}</span></div>`).join("")}
      <div style="margin-top:12px;font-size:11px;color:var(--faint);font-family:var(--mono)">green = captured (vid/cid) · red = fabricated/none = the leak</div>
    </div>
    <div class="card">
      <h2>Countries — volume &amp; real-rate</h2>
      ${geo.rows.map((r) => { const n = Number(r.n), h = Number(r.human), dc = Number(r.dc); const rr = n ? Math.round((h / n) * 100) : 0; const cc = String(r.country); return `<div class="bar"><a class="lbl" style="text-decoration:none;color:var(--blue)" href="${link({ country: cc === "(none)" ? "" : cc })}">${esc(cc)}</a><div class="track"><div class="fill" style="width:${(h / maxGeo) * 100}%;background:var(--green)"></div><div class="fill" style="width:${((n - h) / maxGeo) * 100}%;background:var(--red);opacity:.7"></div></div><span class="n">${n} <small>${rr}%${dc ? ` · ${dc}🖥` : ""}</small></span></div>`; }).join("")}
      <div style="margin-top:10px;font-size:11px;color:var(--faint);font-family:var(--mono)">% = human share · 🖥 = datacenter clicks · click a country to filter the log</div>
    </div>
    <div class="card">
      <h2>Redirects per day (red = bots)</h2>
      <div class="spark">${daily.rows.map((r) => { const n = Number(r.n), bo = Number(r.bots); const hReal = ((n - bo) / maxDay) * 80, hBot = (bo / maxDay) * 80; return `<div class="col" title="${esc(r.day)}: ${n} (${bo} bot)"><div class="botseg" style="height:${hBot}px"></div><div class="real" style="height:${hReal}px"></div></div>`; }).join("")}</div>
      <div class="daylbl">${daily.rows.map((r) => `<span>${esc(r.day)}</span>`).join("")}</div>
    </div>
  </div>

  <div class="card full" style="margin-top:14px">
    <div class="row-head">
      <h2>Per-click log — newest 200${filter !== "all" ? ` · ${filter}` : ""}${country ? ` · ${country}` : ""}</h2>
      <div style="display:flex;gap:8px">
        <button class="btn" onclick="dl()">⬇ Export CSV</button>
        <button class="btn danger" onclick="purge()">🗑 Reset pre-scorer data</button>
      </div>
    </div>
    <div class="scroll"><table>
      <thead><tr><th>Score</th><th>Band</th><th>Time</th><th>Provider</th><th>Corridor</th><th>Country</th><th>Network</th><th>ID src</th><th>Source</th><th>Why flagged</th></tr></thead>
      <tbody>${clicks.rows.map((r) => { const sc = Number(r.bot_score ?? 0); const bn = bandName(sc); const dc = r.ip_class === "datacenter"; const net = r.ip_class ? `${dc ? "🖥 " : ""}${esc(r.asn_org || r.ip_class)}` : "-"; return `<tr><td style="color:${scoreColor(sc)};font-weight:600">${esc(r.bot_score ?? "-")}</td><td><span class="pill" style="background:${scoreColor(sc)};color:var(--bg)">${bn}</span></td><td>${esc(r.t)}</td><td class="p">${esc(r.provider)}</td><td>${esc(r.corridor)}</td><td>${esc(r.country)}</td><td style="color:${dc ? "var(--amber)" : "var(--dim)"};max-width:150px;overflow:hidden;text-overflow:ellipsis">${net}</td><td>${esc(r.id_source)}</td><td>${esc(r.traffic_source)}</td><td style="white-space:normal;max-width:280px;color:var(--faint)">${esc(r.bot_reasons)}</td></tr>`; }).join("") || `<tr><td colspan="10" style="text-align:center;color:var(--faint);padding:20px">no rows match this filter</td></tr>`}</tbody>
    </table></div>
  </div>
</div>
<script>
  const CSV = ${JSON.stringify(csvRows)};
  function dl(){const b=new Blob([CSV],{type:"text/csv"});const a=document.createElement("a");
    a.href=URL.createObjectURL(b);a.download="smc-clicks-${days}d.csv";a.click();}
  function purge(){
    if(!confirm("Delete ALL pre-scorer rows (clicks logged before IP scoring, i.e. no network data)?\\n\\nThis cannot be undone. New scored data is kept."))return;
    const u=new URL(window.location.href); u.searchParams.set("purge","preDeploy");
    fetch(u.toString()).then(r=>r.text()).then(t=>{alert(t);location.href=${JSON.stringify(link({}))};});
  }
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
