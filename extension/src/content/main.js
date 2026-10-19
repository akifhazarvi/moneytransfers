// The automatic price check: on a money transfer provider's page, a small panel
// says whether the transfer its calculator shows is a good deal, and updates as
// the reader changes the amount or currencies.
//
// Runs only with the optional permission the reader grants (welcome page,
// popup, Settings), only on providers (lib/hosts.js), and only reads the page:
// it never fills in or changes the provider's form, and never rewrites its
// links. A Send in the panel is the reader's own click through /go.
//
// Built into content.js as one classic script (scripts/build-extension.ts), with
// config.js, data/currencies.js, lib/format.js, lib/hosts.js, lib/detect.js and
// lib/verdict.js in front of it, so their functions are in scope here. Quotes
// come through the service worker (chrome.runtime.sendMessage), so the page's
// own CSP and CORS never apply; the panel lives in a closed shadow root with a
// constructed stylesheet and loads no images, so the page's CSP cannot block it
// either.

const CHECK_EVERY_MS = 800;
const SEND_CODES = new Set(SEND.map((c) => c.code));
const ALL_CODE_LIST = ALL.map((c) => c.code);

/** Country slug ("united-kingdom") → its currency, for paths like /send-money-to-india. */
const PLACES = (() => {
  const out = {};
  for (const c of ALL) {
    for (const country of (c.countries || "").split(", ")) {
      const slug = country
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (slug && !(slug in out)) out[slug] = c.code;
    }
  }
  return out;
})();

/**
 * The brand mark, built node by node: some provider pages enforce Trusted
 * Types, which would refuse markup assigned through innerHTML.
 */
function plane() {
  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };
  const svg = make("svg", { viewBox: "0 0 32 32", "aria-hidden": "true" });
  svg.append(
    make("rect", { width: "32", height: "32", rx: "8", fill: "#27317a" }),
    make("path", { d: "M6.5 16.8L26 6L21 27.5L15 20Z", fill: "#fff" }),
    make("path", { d: "M15 20L21 27.5L18.2 21Z", fill: "#fff", opacity: ".5" }),
  );
  return svg;
}

const CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
.wrap { position: fixed; top: 150px; right: 16px; z-index: 2147483647; font: 13px/1.4 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif; color: #1d1d1f; -webkit-font-smoothing: antialiased; font-variant-numeric: tabular-nums; animation: in .35s cubic-bezier(.2,.8,.2,1); }
@keyframes in { from { opacity: 0; transform: translateY(-6px); } }
button, a { font: inherit; color: inherit; }
.pill { display: flex; align-items: center; gap: 8px; max-width: 320px; padding: 6px 12px 6px 6px; border: 0; border-radius: 22px; background: rgba(255,255,255,.92); backdrop-filter: saturate(180%) blur(18px); box-shadow: 0 8px 28px rgba(0,0,0,.16), 0 0 0 .5px rgba(0,0,0,.08); cursor: pointer; text-align: left; }
.pill svg { width: 28px; height: 28px; flex: none; }
.pill .t { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pill .s { display: block; font-size: 11px; font-weight: 500; color: #6e6e73; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: #8e8e93; }
.good .dot { background: #1e8e3e; } .fair .dot { background: #1a73e8; } .better .dot { background: #e37400; }
.good .t { color: #1e8e3e; } .better .t { color: #b45f06; }
.card { width: 330px; border-radius: 16px; background: rgba(255,255,255,.96); backdrop-filter: saturate(180%) blur(18px); box-shadow: 0 16px 48px rgba(0,0,0,.2), 0 0 0 .5px rgba(0,0,0,.08); overflow: hidden; }
.head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 8px 14px; }
.head svg { width: 22px; height: 22px; }
.titles { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.25; }
.brand { font-weight: 600; }
.route { color: #6e6e73; font-size: 11.5px; }
.x { width: 26px; height: 26px; border: 0; border-radius: 50%; background: transparent; color: #6e6e73; cursor: pointer; font-size: 16px; line-height: 1; }
.x:hover { background: rgba(118,118,128,.12); }
.verdict { margin: 0 12px 10px; padding: 10px 12px; border-radius: 12px; background: rgba(118,118,128,.08); }
.good .verdict { background: rgba(30,142,62,.1); } .better .verdict { background: rgba(227,116,0,.12); } .fair .verdict { background: rgba(26,115,232,.08); }
.verdict h2 { margin: 0 0 2px; font-size: 15px; letter-spacing: -.01em; }
.good .verdict h2 { color: #1e8e3e; } .better .verdict h2 { color: #b45f06; } .fair .verdict h2 { color: #1a73e8; }
.verdict p { margin: 0; color: #3a3a3c; }
.rows { margin: 0; padding: 0 4px; list-style: none; }
.rows li { display: grid; grid-template-columns: 18px 1fr auto auto; align-items: center; gap: 8px; padding: 7px 8px; border-top: 1px solid rgba(60,60,67,.12); }
.rows li:first-child { border-top: 0; }
.rk { color: #8e8e93; font-size: 11px; text-align: center; }
.nm { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nm small { display: block; font-weight: 400; font-size: 11px; color: #6e6e73; }
.amt { font-weight: 600; }
.send { padding: 4px 10px; border-radius: 12px; background: rgba(26,115,232,.1); color: #1a73e8; font-weight: 600; font-size: 12px; text-decoration: none; }
.send:hover { background: rgba(26,115,232,.18); }
.here { margin: 4px 0 0; font-size: 11px; color: #6e6e73; padding: 0 14px; }
.foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px 12px; border-top: 1px solid rgba(60,60,67,.12); font-size: 11.5px; color: #8e8e93; }
.foot button { border: 0; background: none; padding: 0; color: #1a73e8; font-weight: 600; cursor: pointer; }
.foot .quiet { color: #8e8e93; font-weight: 500; }
@media (prefers-color-scheme: dark) {
  .wrap { color: #f5f5f7; }
  .pill, .card { background: rgba(44,44,46,.94); box-shadow: 0 16px 48px rgba(0,0,0,.5), 0 0 0 .5px rgba(255,255,255,.08); }
  .pill .s, .route, .nm small, .here { color: #a1a1a6; }
  .verdict p { color: #d1d1d6; }
  .rows li, .foot { border-color: rgba(84,84,88,.5); }
  .good .t, .good .verdict h2 { color: #30d158; } .better .t, .better .verdict h2 { color: #ffb340; } .fair .verdict h2 { color: #4c8df6; }
  .send { background: rgba(76,141,246,.2); color: #8ab4ff; } .foot button { color: #8ab4ff; }
}
@media (prefers-reduced-motion: reduce) { .wrap { animation: none; } }
`;

const here = providerForHost(location.hostname);
if (here?.automatic && !globalThis.__smcPriceCheck) {
  globalThis.__smcPriceCheck = true;
  startPriceCheck();
}

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null || v === false) continue;
    if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  node.append(...children.flat().filter((c) => c != null && c !== false));
  return node;
}

function send(message) {
  return chrome.runtime.sendMessage(message).catch(() => null);
}

async function startPriceCheck() {
  const prefs = await chrome.storage.sync.get({ detect: true, quietSites: [] });
  if (!prefs.detect || prefs.quietSites.includes(here.domain)) { globalThis.__smcPriceCheck = false; return; }

  let host = null;
  let root = null;
  let expanded = false;
  let closed = false;
  let lastKey = "";
  let shown = "";
  let state = null;
  let timer = null;

  const mount = () => {
    host = document.createElement("smc-price-check");
    root = host.attachShadow({ mode: "closed" });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(CSS);
    root.adoptedStyleSheets = [sheet];
    document.documentElement.append(host);
  };

  const render = () => {
    if (closed || !state) return;
    if (!host?.isConnected) mount();
    const { v, c } = state;
    const route = `${v.sent} → ${c.to}`;

    if (!expanded) {
      const subtitle = v.tone === "better" ? `${v.best.name} pays more · ${route}` : `${here.name} · ${route}`;
      root.replaceChildren(
        el(
          "div",
          { class: `wrap ${v.tone}`, role: "complementary", "aria-label": "SendMoneyCompare price check" },
          el(
            "button",
            {
              class: "pill",
              type: "button",
              "aria-expanded": "false",
              onclick: () => {
                expanded = true;
                send({ type: "smc:track", name: "ext_price_check_opened", params: { provider: here.slugs[0], tone: v.tone } });
                render();
              },
            },
            plane(),
            el("span", { class: "dot" }),
            el("span", null, el("span", { class: "t", text: v.title }), el("span", { class: "s", text: subtitle })),
          ),
        ),
      );
      return;
    }

    const ranked = c.rows.filter((r) => r.ranked);
    const top = ranked.slice(0, 3);
    const list = el(
      "ul",
      { class: "rows" },
      top.map((r, i) =>
        el(
          "li",
          null,
          el("span", { class: "rk", text: String(i + 1) }),
          el("span", { class: "nm" }, r.name, here.slugs.includes(r.slug) ? el("small", { text: "This site" }) : null),
          el("span", { class: "amt", text: money(r.receive, c.to, r.receive >= 10000 ? 0 : undefined) }),
          here.slugs.includes(r.slug) || !r.sendUrl?.startsWith(`${SITE}/go/`)
            ? el("span")
            : el(
                "a",
                {
                  class: "send",
                  href: r.sendUrl,
                  target: "_blank",
                  rel: "noopener",
                  onclick: () =>
                    send({
                      type: "smc:track",
                      name: "provider_clicked",
                      params: { provider: r.slug, corridor: `${c.from}-${c.to}`, amount: c.amount, rank: i + 1, ranked: true, placement: "extension_page", page: here.slugs[0] },
                    }),
                },
                "Send",
              ),
        ),
      ),
    );

    root.replaceChildren(
      el(
        "div",
        { class: `wrap ${v.tone}`, role: "complementary", "aria-label": "SendMoneyCompare price check" },
        el(
          "div",
          { class: "card" },
          el(
            "div",
            { class: "head" },
            plane(),
            el("span", { class: "titles" }, el("span", { class: "brand", text: "SendMoneyCompare" }), el("span", { class: "route", text: route })),
            el("button", { class: "x", type: "button", "aria-label": "Collapse", onclick: () => ((expanded = false), render()) }, "−"),
            el("button", { class: "x", type: "button", "aria-label": "Close for this page", onclick: () => stop() }, "×"),
          ),
          el("div", { class: "verdict" }, el("h2", { text: v.title }), el("p", { text: v.text })),
          list,
          el("p", {
            class: "here",
            text: [
              v.livePayout ? `For ${here.name}, the ${money(v.theirs, c.to, v.theirs >= 10000 ? 0 : undefined)} this page shows.` : null,
              c.collectedAt ? `Other quotes collected ${ago(c.collectedAt)}.` : null,
            ]
              .filter(Boolean)
              .join(" "),
          }),
          el(
            "div",
            { class: "foot" },
            el(
              "button",
              { type: "button", onclick: () => send({ type: "smc:open-popup" }) },
              `See all ${c.compared} providers`,
            ),
            el(
              "button",
              {
                type: "button",
                class: "quiet",
                onclick: async () => {
                  const { quietSites = [] } = await chrome.storage.sync.get("quietSites");
                  await chrome.storage.sync.set({ quietSites: [...new Set([...quietSites, here.domain])] });
                  send({ type: "smc:track", name: "ext_price_check_hidden", params: { provider: here.slugs[0] } });
                  stop();
                },
              },
              `Hide on ${here.domain}`,
            ),
          ),
        ),
      ),
    );
  };

  const check = async () => {
    timer = null;
    if (closed) return;
    let d;
    try {
      d = detectTransfer(ALL_CODE_LIST, PLACES);
    } catch {
      return;
    }
    if (!d?.amount || !d.from || !d.to || d.from === d.to || !SEND_CODES.has(d.from) || d.amount > 1_000_000) {
      lastKey = "";
      state = null;
      host?.remove();
      return;
    }
    const key = `${d.from}|${d.to}|${d.amount}|${d.receive ?? ""}`;
    if (key === lastKey) return;
    lastKey = key;
    const res = await send({ type: "smc:compare", from: d.from, to: d.to, amount: d.amount });
    if (closed || key !== lastKey) return;
    if (!res?.data) { lastKey = ""; host?.remove(); return; }
    const v = judge(res.data, here, d.receive);
    state = { v, c: res.data };
    render();
    const seen = `${d.from}|${d.to}|${v.tone}`;
    if (seen !== shown) {
      shown = seen;
      send({
        type: "smc:track",
        name: "ext_price_check_shown",
        params: { provider: here.slugs[0], tone: v.tone, corridor: `${d.from}-${d.to}`, amount: d.amount, live_payout: v.livePayout, gap: Math.round(v.gap ?? 0) },
      });
    }
  };

  // At most one check per CHECK_EVERY_MS, however busy the page is.
  const schedule = () => {
    if (!timer) timer = setTimeout(check, CHECK_EVERY_MS);
  };
  const events = ["input", "change", "click", "keyup"];
  const observer = new MutationObserver(schedule);
  const interval = setInterval(schedule, 5000);
  function stop() {
    closed = true;
    clearTimeout(timer);
    clearInterval(interval);
    observer.disconnect();
    for (const type of events) document.removeEventListener(type, schedule, true);
    removeEventListener("popstate", schedule);
    chrome.storage.onChanged.removeListener(onPrefs);
    chrome.runtime.onMessage.removeListener(onMessage);
    host?.remove();
    globalThis.__smcPriceCheck = false;
  }
  function onPrefs(changes, area) {
    if (area === "sync" && (changes.detect?.newValue === false || changes.quietSites?.newValue?.includes(here.domain))) stop();
  }
  function onMessage(message) { if (message?.type === "smc:stop-price-check") stop(); }
  chrome.storage.onChanged.addListener(onPrefs);
  chrome.runtime.onMessage.addListener(onMessage);
  for (const type of events) document.addEventListener(type, schedule, true);
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
  addEventListener("popstate", schedule);
  check();
}
