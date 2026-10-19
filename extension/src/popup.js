// The popup: Compare (what providers pay for this amount), Convert (mid-market
// converter and rate history), Offers (first-transfer rates and sign-up offers
// on this route) and Rates (a watchlist with alerts).
//
// Every figure comes from /api/ext/v1/* (src/lib/extension-api.ts), which reads
// the same functions /send-money renders with. This file decides layout and
// wording only; it never re-ranks, filters or recomputes a quote.

import { h, fill, icon } from "./lib/dom.js";
import { ICON } from "./lib/icons.js";
import * as fmt from "./lib/format.js";
import { load, pruneSaved, cross } from "./lib/api.js";
import { lineChart, sliceRange, rangeStats, RANGES } from "./lib/chart.js";
import { detectTransfer } from "./lib/detect.js";
import { providerForHost } from "./lib/hosts.js";
import { getPrefs, setPrefs } from "./lib/store.js";
import { SEND, ALL, CURRENCY, FLAG_FILES } from "./data/currencies.js";
import { SITE } from "./config.js";

const POPULAR_SEND = ["USD", "GBP", "EUR", "CAD", "AUD", "SGD", "AED", "NZD"];
const POPULAR_RECEIVE = ["INR", "PHP", "MXN", "PKR", "NGN", "BDT", "EUR", "GBP"];
const SENDABLE = new Set(SEND.map((c) => c.code));
const ALL_CODES = ALL.map((c) => c.code);
const EURO_AREA = "AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK".split(" ");
const LOCALE_CURRENCY = { US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", NZ: "NZD", SG: "SGD", AE: "AED", SA: "SAR", CH: "CHF" };
/** Rows within this share of the highest payout are tied (rank-quotes.ts MATERIALITY_BAND). */
const TIE_BAND = 0.001;

const $view = document.getElementById("view");
const $sheet = document.getElementById("sheet");
const $toast = document.getElementById("toast");

const state = {
  prefs: null,
  tab: "compare",
  route: { from: "USD", to: "INR", amount: 1000 },
  /** The converter: `amount` is in `base`; every other currency in `list` converts from it; `selected` is charted. */
  conv: { base: "USD", amount: 1000, list: ["USD", "INR", "EUR", "GBP"], selected: "INR" },
  comparison: null,
  compMeta: null,
  compStatus: "idle",
  rates: null,
  ratesMeta: null,
  history: new Map(),
  expanded: null,
  showAll: false,
  here: null,
  hereDismissed: false,
  timingOpen: false,
  editingAlert: null,
};

const regions = {};

// ── Small helpers ────────────────────────────────────────────────────

const pairKey = (from, to) => `${from}:${to}`;

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function toast(text) {
  $toast.textContent = text;
  $toast.classList.add("is-on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => $toast.classList.remove("is-on"), 1700);
}

async function copy(text, done) {
  try {
    await navigator.clipboard.writeText(text);
    toast(done);
  } catch {
    toast("Couldn't copy");
  }
}

function flag(code, cls = "flag") {
  const c = CURRENCY[code];
  return h("img", { class: cls, src: c?.flag ?? "flags/generic.svg", alt: "", width: 22, height: 22 });
}

function logo(row) {
  const img = h("img", { class: "logo", src: row.logo, alt: "", width: 32, height: 32, loading: "lazy" });
  img.addEventListener("error", () => {
    const initials = row.name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("");
    img.replaceWith(h("span", { class: "logo initials", text: initials, "aria-hidden": "true" }));
  });
  return img;
}

function chip(text, tone = "", glyph = null, title = null) {
  return h("span", { class: `chip ${tone}`, title }, glyph ? icon(glyph, "icon") : null, text);
}

/** Only our own /go links are ever opened from a row. */
function goHref(url) {
  return typeof url === "string" && url.startsWith(`${SITE}/go/`) ? url : null;
}

function compareHref(from, to, amount) {
  return `${SITE}/send-money#from=${from}&to=${to}${amount ? `&amount=${amount}` : ""}`;
}

function ccyButton(code, label, onClick) {
  return h(
    "button",
    { type: "button", class: "ccy-btn", onclick: onClick, "aria-label": `${label}: ${CURRENCY[code]?.name ?? code}. Change` },
    flag(code),
    h("span", { text: code }),
    icon(ICON.chevronDown, "icon xs"),
  );
}

function amountField(value, label, onValue) {
  const input = h("input", {
    class: "amount-input",
    inputmode: "decimal",
    autocomplete: "off",
    spellcheck: "false",
    "aria-label": label,
    value: value == null ? "" : fmt.number(value, 2),
  });
  // Applied 320ms after typing stops, or at once on blur — before the view's own
  // blur handler reformats the field, so what was typed is never overwritten.
  let timer;
  const apply = () => {
    clearTimeout(timer);
    const n = fmt.parseAmount(input.value);
    if (n) onValue(n);
  };
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 320);
  });
  input.addEventListener("blur", apply);
  input.addEventListener("focus", () => input.select());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
  return input;
}

function savePrefs(patch) {
  Object.assign(state.prefs, patch);
  setPrefs(patch).catch(() => {});
}
const saveRoute = debounce(() => savePrefs({ route: { ...state.route } }), 400);
const saveConv = debounce(() => savePrefs({ convert: { ...state.conv } }), 400);

function localeCurrency() {
  const region = (navigator.language.split("-")[1] || "").toUpperCase();
  const code = EURO_AREA.includes(region) ? "EUR" : LOCALE_CURRENCY[region];
  return code && SENDABLE.has(code) ? code : "USD";
}

// ── Data ─────────────────────────────────────────────────────────────

let compSeq = 0;

async function refreshComparison() {
  const seq = ++compSeq;
  const { from, to, amount } = state.route;
  state.compStatus = "loading";
  state.expanded = null;
  state.showAll = false;
  repaintRoute();
  try {
    await load("compare", { from, to, amount }, (data, meta) => {
      if (seq !== compSeq) return;
      state.comparison = data;
      state.compMeta = meta;
      state.compStatus = "ready";
      repaintRoute();
    });
  } catch {
    if (seq !== compSeq) return;
    state.compStatus = "error";
    repaintRoute();
  }
  loadHistory(from, to);
}

function repaintRoute() {
  if (state.tab === "compare") paintCompare();
  else if (state.tab === "offers") viewOffers();
}

async function loadHistory(from, to) {
  const key = pairKey(from, to);
  try {
    await load("history", { from, to }, (data) => {
      state.history.set(key, data);
      if (state.tab === "compare" && pairKey(state.route.from, state.route.to) === key) paintInsights();
      if (state.tab === "convert" && pairKey(state.conv.base, state.conv.selected) === key) paintChart();
      if (state.tab === "rates") paintWatch();
    });
  } catch {
    if (state.tab === "convert") paintChart();
  }
}

async function refreshRates() {
  try {
    await load("rates", {}, (data, meta) => {
      state.rates = data;
      state.ratesMeta = meta;
      if (state.tab === "convert") paintConvert();
      if (state.tab === "rates") paintWatch();
    });
  } catch {
    if (state.tab === "convert") paintConvert();
  }
}

// ── Tabs ─────────────────────────────────────────────────────────────

const VIEWS = { compare: viewCompare, convert: viewConvert, offers: viewOffers, rates: viewRates };

function show(tab) {
  state.tab = VIEWS[tab] ? tab : "compare";
  for (const b of document.querySelectorAll("nav.seg button")) {
    const on = b.dataset.tab === state.tab;
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
  }
  $view.style.animation = "none";
  void $view.offsetWidth;
  $view.style.animation = "";
  VIEWS[state.tab]();
  savePrefs({ tab: state.tab });
}

// ── Compare ──────────────────────────────────────────────────────────

function viewCompare() {
  const r = state.route;
  regions.here = h("div");
  regions.receive = h("div", { class: "receive" });
  regions.midline = h("p", { class: "midline" });
  regions.insights = h("div", { class: "insights" });
  regions.list = h("section", { "aria-label": "Providers" });
  regions.footer = h("footer", { class: "foot" });

  const amount = amountField(r.amount, `Amount to send in ${r.from}`, (n) => {
    if (n === state.route.amount) return;
    state.route.amount = n;
    saveRoute();
    refreshComparison();
  });
  amount.addEventListener("blur", () => {
    amount.value = fmt.number(state.route.amount, 2);
  });

  const canSwap = SENDABLE.has(r.to);
  const swap = h(
    "button",
    {
      type: "button",
      class: "swap",
      disabled: !canSwap,
      "aria-label": canSwap ? `Send ${r.to} to ${r.from} instead` : `We don't compare transfers sent in ${r.to}`,
      title: canSwap ? "Swap" : `We don't compare transfers sent in ${r.to}`,
      onclick: () => setRoute({ from: r.to, to: r.from }),
    },
    icon(ICON.swap, "icon sm"),
  );

  fill(
    $view,
    regions.here,
    h(
      "div",
      { class: "card amount-card" },
      h("span", { class: "field-label", text: "You send" }),
      h("div", { class: "field-row" }, amount, ccyButton(r.from, "Sending currency", () => pickRouteCurrency("from"))),
      h("div", { class: "divider" }, swap),
      h("span", { class: "field-label", text: "Recipient gets" }),
      h("div", { class: "field-row" }, regions.receive, ccyButton(r.to, "Receiving currency", () => pickRouteCurrency("to"))),
      regions.midline,
    ),
    regions.insights,
    regions.list,
    regions.footer,
  );
  paintCompare();
}

function setRoute(patch) {
  state.route = { ...state.route, ...patch };
  saveRoute();
  if (state.tab === "compare") viewCompare();
  refreshComparison();
}

function paintCompare() {
  if (!regions.list?.isConnected) return;
  paintHere();
  paintReceive();
  paintInsights();
  paintList();
  paintFooter();
}

function currentComparison() {
  const c = state.comparison;
  return c && c.from === state.route.from && c.to === state.route.to ? c : null;
}

function paintReceive() {
  const c = currentComparison();
  const top = c?.rows.find((row) => row.ranked);
  const loading = state.compStatus === "loading";
  fill(
    regions.receive,
    h("output", {
      class: `receive-amount${top && !loading ? "" : " muted"}`,
      text: top ? fmt.money(top.receive, c.to) : loading ? "…" : "—",
    }),
    h(
      "p",
      { class: "receive-caption" },
      top
        ? ["with ", h("strong", { text: top.name }), c.topLabel ? " · best value" : ""]
        : loading
          ? "Finding providers…"
          : "No provider quotes for this route",
    ),
  );
  fill(
    regions.midline,
    c?.mid
      ? [h("span", { text: `1 ${c.from} = ${fmt.rate(c.mid)} ${c.to}` }), h("span", { class: "dim", text: "mid-market rate" })]
      : null,
  );
  regions.midline.hidden = !c?.mid;
}

function paintHere() {
  const here = state.here;
  if (!here || state.hereDismissed) return fill(regions.here);
  const c = currentComparison();
  const amount = c ? fmt.amount(c.amount, c.from) : "";
  const ranked = c?.rows.filter((r) => r.ranked) ?? [];
  const row = c?.rows.find((r) => here.slugs.includes(r.slug));
  let text;
  let sub = null;

  if (!c) text = "Checking how it compares…";
  else if (!row) {
    text = ranked.length
      ? `We don't hold a ${here.name} quote for ${c.from} → ${c.to}. Here's what ${ranked.length} other provider${ranked.length === 1 ? "" : "s"} pay.`
      : `We don't hold quotes for ${c.from} → ${c.to} yet.`;
  } else if (!row.ranked) {
    text = `${here.name}'s quote for this route isn't ranked: ${row.note?.toLowerCase() ?? "it may be out of date"}.`;
  } else {
    const best = ranked.reduce((a, b) => (b.receive > a.receive ? b : a));
    const gap = best.receive - row.receive;
    const rank = ranked.indexOf(row) + 1;
    if (gap <= best.receive * TIE_BAND) {
      text =
        rank === 1 && c.topLabel
          ? `${here.name} is the best value of ${c.compared} providers for ${amount}.`
          : `${here.name} is within 0.1% of the highest payout for ${amount}, effectively tied.`;
    } else {
      text = `${best.name} pays ${fmt.money(gap, c.to)} more than ${here.name} for ${amount}.`;
      sub = `${here.name} is #${rank} of ${c.compared} by payout.`;
    }
  }
  if (here.detected && c) sub = [sub, `Amount and currencies read from this page.`].filter(Boolean).join(" ");

  fill(
    regions.here,
    h(
      "div",
      { class: "here", role: "note" },
      icon(ICON.pin, "icon here-icon"),
      h(
        "div",
        null,
        h("p", { class: "here-title", text: `You're on ${here.name}` }),
        h("p", { class: "here-text", text }),
        sub ? h("p", { class: "here-sub", text: sub }) : null,
      ),
      h(
        "button",
        {
          type: "button",
          class: "icon-btn",
          "aria-label": "Dismiss",
          onclick: () => {
            state.hereDismissed = true;
            paintHere();
          },
        },
        icon(ICON.close, "icon sm"),
      ),
    ),
  );
}

function paintInsights() {
  if (!regions.insights?.isConnected) return;
  const hist = state.history.get(pairKey(state.route.from, state.route.to));
  const cards = [];
  if (hist?.timing) {
    const t = hist.timing;
    const band = t.score >= 75 ? "great" : t.score >= 55 ? "good" : t.score >= 40 ? "" : "poor";
    cards.push(
      h(
        "button",
        {
          type: "button",
          class: `insight${state.timingOpen ? " wide" : ""}`,
          "aria-expanded": String(state.timingOpen),
          onclick: () => {
            state.timingOpen = !state.timingOpen;
            paintInsights();
          },
        },
        h("span", { class: "insight-eyebrow", text: "Timing" }),
        h("span", { class: "insight-title" }, h("span", { class: `band ${band}` }), t.headline),
        h("span", { class: "insight-sub", text: `Score ${t.score} of 100${state.timingOpen ? "" : " · why?"}` }),
        state.timingOpen
          ? h("span", { class: "insight-more", text: `${t.explanation} Based on ${t.daysObserved} days of quotes.` })
          : null,
      ),
    );
  }
  if (hist?.usualLeader) {
    const l = hist.usualLeader;
    cards.push(
      h(
        "div",
        { class: `insight${state.timingOpen || !hist.timing ? " wide" : ""}` },
        h("span", { class: "insight-eyebrow", text: "Top payout · 90 days" }),
        h("span", { class: "insight-title" }, icon(ICON.trend, "icon"), l.name),
        h("span", { class: "insight-sub", text: `on ${l.winRatePct}% of its ${l.quotedDays} quoted days` }),
      ),
    );
  }
  fill(regions.insights, cards);
}

function skeleton(n) {
  return h(
    "div",
    { class: "group", "aria-busy": "true", "aria-label": "Loading providers" },
    Array.from({ length: n }, () => h("div", { class: "skel" }, h("i"), h("div", null, h("i"), h("i", { class: "two" })), h("i"))),
  );
}

function paintList() {
  const c = currentComparison();
  if (!c) {
    if (state.compStatus === "error") return fill(regions.list, errorState());
    return fill(regions.list, skeleton(5));
  }
  if (!c.rows.length) {
    return fill(
      regions.list,
      h(
        "div",
        { class: "card empty" },
        icon(ICON.search, "icon"),
        h("h3", { text: `No quotes for ${c.from} → ${c.to} yet` }),
        h("p", { text: "We only list providers whose prices we collect. Try another currency." }),
      ),
    );
  }

  const ranked = c.rows.filter((r) => r.ranked);
  const maxReceive = ranked.length ? Math.max(...ranked.map((r) => r.receive)) : 0;
  const hereSlugs = state.here?.slugs ?? [];
  const visible = state.showAll ? c.rows : c.rows.filter((r) => !r.collapsed);
  const hidden = c.rows.length - visible.length;

  const group = h(
    "div",
    { class: `group${state.compStatus === "loading" ? " is-loading" : ""}` },
    visible.map((row) => providerRow(row, c, { index: c.rows.indexOf(row), maxReceive, here: hereSlugs.includes(row.slug) })),
    hidden
      ? h(
          "button",
          {
            type: "button",
            class: "more-btn",
            onclick: () => {
              state.showAll = true;
              paintList();
            },
          },
          `Show ${hidden} more provider${hidden === 1 ? "" : "s"}`,
        )
      : null,
  );

  fill(
    regions.list,
    h(
      "div",
      { class: "section-head" },
      h("h2", { text: `${c.compared} provider${c.compared === 1 ? "" : "s"} compared · by payout` }),
      h(
        "button",
        { type: "button", class: "text-btn", onclick: () => copy(c.compareUrl, "Link copied") },
        icon(ICON.link, "icon xs"),
        "Copy link",
      ),
    ),
    group,
  );
}

/** Short form for the row ("0.18% markup"), long form for the details. */
function markupText(pctValue, long = false) {
  if (pctValue == null) return null;
  if (Math.abs(pctValue) < 0.005) return "at mid-market";
  if (pctValue < 0) return `${fmt.pct(-pctValue)} above mid${long ? "-market" : ""}`;
  return long ? `${fmt.pct(pctValue)} below mid-market` : `${fmt.pct(pctValue)} markup`;
}

function providerRow(row, c, ctx) {
  const isTop = ctx.index === 0 && row.ranked && c.topLabel;
  const open = state.expanded === row.slug;
  const less = row.ranked ? ctx.maxReceive - row.receive : 0;

  const chips = [];
  if (isTop) chips.push(chip("Best value", "accent"));
  if (ctx.here) chips.push(chip("You're here", "orange", ICON.pin));
  if (row.tiedAhead) chips.push(chip("≈ Tied", "", null, "Within 0.1% of a larger payout below; listed first on rating"));
  if (row.firstTransfer) chips.push(chip(`+${fmt.moneyShort(row.firstTransfer.extra, c.to)} 1st transfer`, "green", ICON.tag));
  else if (row.offer) chips.push(chip(row.offer.badge, "green", ICON.tag));
  if (row.note) chips.push(chip(row.note));

  const meta = row.ranked
    ? [row.fee === 0 ? "No fee" : `${fmt.money(row.fee, c.from)} fee`, markupText(row.markupPct)].filter(Boolean).join(" · ")
    : "Shown, not ranked";
  const href = goHref(row.sendUrl);

  return h(
    "article",
    { class: `prow${isTop ? " is-top" : ""}${ctx.here ? " is-here" : ""}${row.ranked ? "" : " is-unranked"}` },
    h(
      "button",
      {
        type: "button",
        class: "prow-main",
        "aria-expanded": String(open),
        onclick: () => {
          state.expanded = open ? null : row.slug;
          paintList();
        },
      },
      logo(row),
      h(
        "span",
        { class: "prow-body" },
        h("span", { class: "prow-name", text: row.name }),
        h("span", { class: "prow-meta", text: meta }),
        chips.length ? h("span", { class: "chips" }, chips) : null,
      ),
      h(
        "span",
        { class: "prow-amount" },
        h("span", { class: "amt", text: fmt.moneyShort(row.receive, c.to) }),
        less > 0.005 ? h("span", { class: "less", text: `−${fmt.moneyShort(less, c.to)}`, title: "Less than the highest payout listed" }) : null,
      ),
    ),
    href
      ? h("a", { class: `btn btn-sm ${isTop ? "btn-primary" : "btn-tinted"}`, href, target: "_blank", rel: "noopener", "aria-label": `Send with ${row.name}` }, "Send")
      : h("span"),
    open ? rowDetails(row, c, href) : null,
  );
}

function rowDetails(row, c, href) {
  const kv = (k, v) => [h("dt", { text: k }), h("dd", { text: v })];
  return h(
    "div",
    { class: "prow-details" },
    h(
      "dl",
      { class: "kv" },
      kv("Recipient gets", fmt.money(row.receive, c.to)),
      kv("Exchange rate", `1 ${c.from} = ${fmt.rate(row.rate)} ${c.to}`),
      kv("Transfer fee", row.fee === 0 ? "None" : fmt.money(row.fee, c.from)),
      row.markupPct != null ? kv("Markup", markupText(row.markupPct, true)) : null,
      kv("Delivery", row.speed ?? "Not published"),
      row.trustpilot != null ? kv("Trustpilot", `${row.trustpilot.toFixed(1)} out of 5`) : null,
    ),
    row.tiedAhead
      ? h("p", {
          class: "fine",
          text: "Within 0.1% of a larger payout listed below. Payouts this close move more than that between our updates, so they count as tied and the higher-rated provider is listed first.",
        })
      : null,
    row.firstTransfer ? firstTransferBox(row, c) : null,
    row.offer ? offerBox(row.offer, row.name) : null,
    href ? h("a", { class: "btn btn-primary btn-block", href, target: "_blank", rel: "noopener" }, `Continue to ${row.name}`) : null,
    h("p", { class: "fine", text: `${row.name} confirms the final rate, fee and delivery time before you pay.` }),
  );
}

function firstTransferBox(row, c) {
  const ft = row.firstTransfer;
  return h(
    "div",
    { class: "offer" },
    icon(ICON.tag, "icon"),
    h(
      "div",
      null,
      h("p", { class: "offer-title", text: `Better rate on your first transfer` }),
      h("p", {
        class: "offer-text",
        text: `${fmt.rate(ft.rate)} instead of ${fmt.rate(row.rate)} on up to ${fmt.money(ft.limit, c.from)}: ${fmt.money(ft.extra, c.to)} more on ${fmt.money(Math.min(c.amount, ft.limit), c.from)}.`,
      }),
      h("p", { class: "fine", text: `From ${row.name}'s own quote, collected with its standard price.` }),
    ),
  );
}

function offerBox(offer, name) {
  return h(
    "div",
    { class: "offer" },
    icon(ICON.tag, "icon"),
    h(
      "div",
      null,
      h("p", { class: "offer-title", text: offer.badge }),
      h("p", { class: "offer-text", text: offer.text }),
      offer.code
        ? h(
            "button",
            { type: "button", class: "code", onclick: () => copy(offer.code, "Code copied"), "aria-label": `Copy code ${offer.code}` },
            offer.code,
            icon(ICON.copy, "icon xs"),
          )
        : null,
      h("p", { class: "fine", text: `Checked ${fmt.day(offer.checked)}. ${name}'s own terms apply and may have changed.` }),
    ),
  );
}

function paintFooter() {
  const c = currentComparison();
  const meta = state.compMeta;
  fill(
    regions.footer,
    meta?.offline
      ? h("p", { class: "offline" }, icon(ICON.wifiOff, "icon xs"), `Offline · saved ${fmt.ago(meta.savedAt)}`)
      : null,
    c
      ? h(
          "p",
          null,
          [c.collectedAt ? `Quotes collected ${fmt.ago(c.collectedAt)}` : null, `mid-market rate ${fmt.ago(c.midAsOf)}`]
            .filter(Boolean)
            .join(" · "),
        )
      : null,
    h(
      "a",
      { class: "foot-link", href: compareHref(state.route.from, state.route.to, state.route.amount), target: "_blank", rel: "noopener" },
      "Open the full comparison",
      icon(ICON.external, "icon xs"),
    ),
  );
}

function errorState() {
  const offline = !navigator.onLine;
  return h(
    "div",
    { class: "card empty" },
    icon(ICON.wifiOff, "icon"),
    h("h3", { text: offline ? "You're offline" : "Can't reach SendMoneyCompare" }),
    h("p", { text: offline ? "Connect to the internet to compare live prices." : "Try again in a moment." }),
    h("button", { type: "button", class: "btn btn-tinted btn-sm", onclick: refreshComparison }, "Try again"),
  );
}

// ── Offers ───────────────────────────────────────────────────────────

function viewOffers() {
  const r = state.route;
  const c = currentComparison();
  const routeChip = h(
    "button",
    { type: "button", class: "route-chip", onclick: () => show("compare"), "aria-label": "Change route on the Compare tab" },
    h(
      "span",
      { class: "flags" },
      flag(r.from, "flag sm"),
      `${r.from} → ${r.to}`,
      flag(r.to, "flag sm"),
      h("span", { class: "dim", text: `· ${fmt.amount(r.amount, r.from)}` }),
    ),
    icon(ICON.chevronRight, "icon sm"),
  );

  if (!c) {
    return fill($view, routeChip, state.compStatus === "error" ? errorState() : skeleton(3));
  }

  const first = c.rows.filter((row) => row.firstTransfer);
  const signup = c.rows.filter((row) => row.offer);
  const sendBtn = (row) => {
    const href = goHref(row.sendUrl);
    return href ? h("a", { class: "btn btn-sm btn-tinted", href, target: "_blank", rel: "noopener", "aria-label": `Send with ${row.name}` }, "Send") : null;
  };

  const sections = [];
  if (first.length) {
    sections.push(
      h("div", { class: "section-head" }, h("h2", { text: "Better rate on a first transfer" })),
      h(
        "div",
        { class: "group" },
        first.map((row) =>
          h(
            "div",
            { class: "orow" },
            logo(row),
            h(
              "div",
              null,
              h("p", { class: "orow-name", text: row.name }),
              h("p", {
                class: "orow-text",
                text: `${fmt.rate(row.firstTransfer.rate)} instead of ${fmt.rate(row.rate)} on up to ${fmt.money(row.firstTransfer.limit, c.from)}`,
              }),
              h("p", { class: "orow-gain", text: `+${fmt.money(row.firstTransfer.extra, c.to)} on ${fmt.money(Math.min(c.amount, row.firstTransfer.limit), c.from)}` }),
            ),
            sendBtn(row),
          ),
        ),
      ),
    );
  }
  if (signup.length) {
    sections.push(
      h("div", { class: "section-head" }, h("h2", { text: "Sign-up offers" })),
      h(
        "div",
        { class: "group" },
        signup.map((row) =>
          h(
            "div",
            { class: "orow" },
            logo(row),
            h(
              "div",
              null,
              h("p", { class: "orow-name", text: row.name }),
              h("span", { class: "chips" }, chip(row.offer.badge, "green", ICON.tag)),
              h("p", { class: "orow-text", text: row.offer.text }),
              row.offer.code
                ? h(
                    "button",
                    { type: "button", class: "code", onclick: () => copy(row.offer.code, "Code copied"), "aria-label": `Copy code ${row.offer.code}` },
                    row.offer.code,
                    icon(ICON.copy, "icon xs"),
                  )
                : null,
              h("p", { class: "fine", text: `Checked ${fmt.day(row.offer.checked)}` }),
            ),
            sendBtn(row),
          ),
        ),
      ),
    );
  }
  if (!sections.length) {
    sections.push(
      h(
        "div",
        { class: "card empty" },
        icon(ICON.tag, "icon"),
        h("h3", { text: `No offers listed for ${c.from} → ${c.to}` }),
        h("p", { text: "Standard prices for every provider are on the Compare tab." }),
      ),
    );
  }

  fill(
    $view,
    routeChip,
    sections,
    h("p", {
      class: "note",
      text: "First-transfer rates come from the providers' own quotes, collected with their standard prices. Sign-up offers are checked by hand and change often; each provider's terms decide. Offers never change the order on the Compare tab.",
    }),
  );
}

// ── Convert: several currencies at once ──────────────────────────────

const MAX_CONVERT = 10;
const PERIODS = [
  ["1D", "1 day"],
  ["1W", "1 week"],
  ["15D", "15 days"],
  ["30D", "30 days"],
];

function rateNow(from, to) {
  return cross(state.rates?.rates, from, to);
}

/** Percent change of from→to over a period (1D/1W/15D/30D), against the source's own close. */
function rateChange(from, to, period = state.prefs.period) {
  const then = cross(state.rates?.ago?.[period]?.rates, from, to);
  const now = rateNow(from, to);
  return then && now ? (now / then - 1) * 100 : null;
}

function periodLabel(period = state.prefs.period) {
  return PERIODS.find(([k]) => k === period)?.[1] ?? period;
}

function decimalsFor(value) {
  return value >= 100 ? 2 : value >= 1 ? 4 : 6;
}

/** "Live" only while the source's own timestamp is minutes old; otherwise say how old it is. */
function rateStatus() {
  const r = state.rates;
  if (!r) return h("span", { class: "status" }, h("span", { class: "dot" }), "Loading rates…");
  const live = Date.now() - Date.parse(r.asOf) < 10 * 60_000;
  return h(
    "span",
    { class: "status", title: `Mid-market rate set ${new Date(r.asOf).toLocaleString()}` },
    h("span", { class: `dot${live ? " live" : ""}` }),
    live ? "Live mid-market rate" : `Mid-market · ${fmt.ago(r.asOf)}`,
    state.ratesMeta?.offline ? " · offline" : "",
  );
}

function periodSeg(onChange) {
  return h(
    "div",
    { class: "seg small", role: "tablist", "aria-label": "Change over" },
    PERIODS.map(([key, label]) =>
      h(
        "button",
        {
          type: "button",
          role: "tab",
          title: `Change over ${label}`,
          "aria-selected": String(key === state.prefs.period),
          onclick: () => {
            savePrefs({ period: key });
            onChange();
          },
        },
        key,
      ),
    ),
  );
}

function viewConvert() {
  regions.status = h("div");
  regions.periods = h("div");
  regions.rows = h("div", { class: "group conv-list", role: "list" });
  regions.chart = h("section", { class: "card chart-card", "aria-label": "Rate history" });
  regions.cta = h("div");
  fill(
    $view,
    h("div", { class: "section-head" }, regions.status, regions.periods),
    regions.rows,
    regions.chart,
    regions.cta,
  );
  buildConvRows();
  paintConvert();
  paintChart();
  const { base, selected } = state.conv;
  if (selected && !state.history.has(pairKey(base, selected))) loadHistory(base, selected);
}

function buildConvRows() {
  regions.convRows = new Map();
  const c = state.conv;
  const rows = c.list.map((code) => {
    const input = h("input", {
      class: "conv-input",
      inputmode: "decimal",
      autocomplete: "off",
      spellcheck: "false",
      "aria-label": `Amount in ${CURRENCY[code]?.name ?? code}`,
    });
    // Typing in any row makes it the one the others convert from.
    let timer;
    const apply = () => {
      clearTimeout(timer);
      const n = fmt.parseAmount(input.value);
      if (!n) return;
      if (code !== state.conv.base) {
        if (state.conv.selected === code) state.conv.selected = state.conv.base;
        state.conv.base = code;
        paintChart();
        loadHistory(state.conv.base, state.conv.selected);
      }
      state.conv.amount = n;
      saveConv();
      paintConvert({ keep: code });
    };
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(apply, 250);
    });
    input.addEventListener("blur", () => {
      apply();
      paintConvert();
    });
    input.addEventListener("focus", () => input.select());
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });

    const sub = h("span", { class: "crow-sub" });
    const chg = h("span", { class: "crow-chg" });
    const row = h(
      "div",
      { class: "crow", role: "listitem" },
      h(
        "button",
        { type: "button", class: "crow-id", onclick: () => selectConv(code), "aria-label": `Show the ${code} chart` },
        flag(code),
        h("span", { class: "crow-text" }, h("span", { class: "crow-code", text: code }), sub),
      ),
      h("div", { class: "crow-val" }, input, chg),
      c.list.length > 2
        ? h(
            "button",
            { type: "button", class: "icon-btn crow-x", "aria-label": `Remove ${code}`, onclick: () => removeConv(code) },
            icon(ICON.close, "icon xs"),
          )
        : null,
    );
    regions.convRows.set(code, { row, input, sub, chg });
    return row;
  });

  fill(
    regions.rows,
    rows,
    c.list.length < MAX_CONVERT
      ? h("button", { type: "button", class: "more-btn add-ccy", onclick: addConv }, icon(ICON.plus, "icon xs"), " Add currency")
      : null,
  );
}

function paintConvert({ keep } = {}) {
  if (!regions.rows?.isConnected) return;
  fill(regions.status, rateStatus());
  fill(regions.periods, periodSeg(() => paintConvert()));
  const { base, amount, selected } = state.conv;
  for (const [code, el] of regions.convRows) {
    const r = code === base ? 1 : rateNow(base, code);
    const value = r ? amount * r : null;
    if (code !== keep && document.activeElement !== el.input) {
      const text = value == null ? "" : fmt.number(value, value >= 1 ? 2 : 6);
      if (el.input.value && el.input.value !== text) {
        el.row.classList.remove("ticked");
        void el.row.offsetWidth;
        el.row.classList.add("ticked");
      }
      el.input.value = text;
      el.input.placeholder = value == null ? "—" : "";
    }
    el.row.classList.toggle("is-base", code === base);
    el.row.classList.toggle("is-selected", code === selected && code !== base);
    el.sub.textContent = code === base ? (CURRENCY[code]?.name ?? code) : r ? `1 ${base} = ${fmt.rate(r)}` : "No rate";
    const change = code === base ? null : rateChange(base, code);
    fill(
      el.chg,
      change == null
        ? null
        : h("span", {
            class: `chg ${change >= 0 ? "up" : "down"}`,
            text: fmt.pct(change, { signed: true }),
            title: `${base} → ${code} over ${periodLabel()}`,
          }),
    );
  }
  paintConvCta();
}

function selectConv(code) {
  if (code === state.conv.base || code === state.conv.selected) return;
  state.conv.selected = code;
  saveConv();
  paintConvert();
  paintChart();
  loadHistory(state.conv.base, code);
}

function removeConv(code) {
  const c = state.conv;
  const list = c.list.filter((x) => x !== code);
  if (code === c.base) {
    const next = list[0];
    const r = rateNow(c.base, next);
    state.conv = { ...c, base: next, amount: r ? Math.round(c.amount * r * 100) / 100 : c.amount };
  }
  state.conv.list = list;
  if (!list.includes(state.conv.selected) || state.conv.selected === state.conv.base) {
    state.conv.selected = list.find((x) => x !== state.conv.base);
  }
  saveConv();
  buildConvRows();
  paintConvert();
  paintChart();
}

function addConv() {
  const c = state.conv;
  openPicker({
    title: "Add currency",
    list: ALL.filter((x) => !c.list.includes(x.code)),
    popular: [...POPULAR_RECEIVE, ...POPULAR_SEND].filter((x) => !c.list.includes(x)),
    selected: null,
    onPick: (code) => {
      state.conv.list = [...state.conv.list, code];
      state.conv.selected = code;
      saveConv();
      buildConvRows();
      paintConvert();
      paintChart();
      loadHistory(state.conv.base, code);
    },
  });
}

function paintConvCta() {
  const { base, selected, amount } = state.conv;
  fill(
    regions.cta,
    selected && SENDABLE.has(base)
      ? h(
          "button",
          {
            type: "button",
            class: "cta",
            onclick: () => {
              state.route = { from: base, to: selected, amount: amount >= 10 ? Math.round(amount * 100) / 100 : state.route.amount };
              saveRoute();
              refreshComparison();
              show("compare");
            },
          },
          icon(ICON.trend, "icon"),
          h("span", { text: `Sending ${base} to ${selected}? See what providers pay.` }),
          icon(ICON.chevronRight, "icon sm"),
        )
      : null,
  );
}

function paintChart() {
  if (!regions.chart?.isConnected) return;
  const { base: from, selected: to } = state.conv;
  if (!to) return fill(regions.chart);
  const hist = state.history.get(pairKey(from, to));
  const range = RANGES.find(([k]) => k === state.prefs.range) ?? RANGES[1];
  const watched = state.prefs.watch.some((w) => w.from === from && w.to === to);

  const title = h(
    "div",
    { class: "chart-title" },
    h("span", { class: "pair-flags" }, flag(from), flag(to)),
    h("span", { class: "chart-pair", text: `${from} → ${to}` }),
    h(
      "button",
      {
        type: "button",
        class: `icon-btn${watched ? " is-on" : ""}`,
        "aria-pressed": String(watched),
        "aria-label": watched ? `Stop following ${from} → ${to}` : `Follow ${from} → ${to} on the Rates tab`,
        title: watched ? "Following on Rates" : "Follow on Rates",
        onclick: () => {
          toggleWatch(from, to);
          paintChart();
        },
      },
      icon(watched ? ICON.starFill : ICON.star, "icon"),
    ),
  );

  const seg = h(
    "div",
    { class: "seg small", role: "tablist", "aria-label": "Chart range" },
    RANGES.map(([key]) =>
      h(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": String(key === range[0]),
          onclick: () => {
            savePrefs({ range: key });
            paintChart();
          },
        },
        key,
      ),
    ),
  );

  if (!hist) return fill(regions.chart, title, h("div", { class: "chart-empty", text: "Loading history…" }), seg);
  const points = sliceRange(hist.points, range[1]);
  const stats = rangeStats(points);
  if (!stats) return fill(regions.chart, title, h("div", { class: "chart-empty", text: `No rate history for ${from} → ${to}` }));

  const value = h("p", { class: "chart-value", text: fmt.rate(stats.last) });
  const when = h("p", { class: "chart-when" });
  const tone = stats.changePct >= 0 ? "up" : "down";
  const showSummary = () =>
    fill(
      when,
      h("span", { class: `chg ${tone}`, text: fmt.pct(stats.changePct, { signed: true }) }),
      ` past ${range[0] === "1W" ? "week" : range[0] === "1Y" ? "year" : `${range[0].replace("M", "")} month${range[0] === "1M" ? "" : "s"}`}`,
    );
  showSummary();

  const chart = lineChart(points, {
    width: 324,
    height: 132,
    label: `${from} to ${to}, ${fmt.day(points[0][0])} to ${fmt.day(points[points.length - 1][0])}: from ${fmt.rate(stats.first)} to ${fmt.rate(stats.last)}`,
    onHover: (p) => {
      if (!p) {
        value.textContent = fmt.rate(stats.last);
        return showSummary();
      }
      value.textContent = fmt.rate(p[1]);
      const d = ((p[1] - stats.first) / stats.first) * 100;
      fill(when, h("span", { class: `chg ${d >= 0 ? "up" : "down"}`, text: fmt.pct(d, { signed: true }) }), ` · ${fmt.day(p[0])}`);
    },
  });

  const stat = (label, v, date) => h("div", { class: "stat" }, h("dt", { text: label }), h("dd", null, v, date ? h("span", { class: "when", text: fmt.day(date, false) }) : null));
  fill(
    regions.chart,
    title,
    h("div", { class: "chart-head" }, h("div", null, value, when), seg),
    chart,
    h(
      "dl",
      { class: "stats" },
      stat("High", fmt.rate(stats.hi[1]), stats.hi[0]),
      stat("Low", fmt.rate(stats.lo[1]), stats.lo[0]),
      stat("Average", fmt.rate(points.reduce((sum, p) => sum + p[1], 0) / points.length), null),
    ),
  );
}

// ── Rates: watchlist + alerts ────────────────────────────────────────

function toggleWatch(from, to) {
  const watch = state.prefs.watch.filter((w) => !(w.from === from && w.to === to));
  const adding = watch.length === state.prefs.watch.length;
  if (adding) watch.push({ from, to });
  savePrefs({ watch });
  toast(adding ? `Following ${from} → ${to}` : `Stopped following ${from} → ${to}`);
  if (adding) loadHistory(from, to);
}

function viewRates() {
  regions.watch = h("div");
  fill($view, regions.watch);
  paintWatch();
  for (const w of state.prefs.watch) {
    if (!state.history.has(pairKey(w.from, w.to))) loadHistory(w.from, w.to);
  }
}

function paintWatch() {
  if (!regions.watch?.isConnected) return;
  const watch = state.prefs.watch;
  const addBtn = h(
    "button",
    { type: "button", class: "text-btn", onclick: addWatchPair },
    icon(ICON.plus, "icon xs"),
    "Add pair",
  );

  if (!watch.length) {
    const from = state.conv.base;
    const to = state.conv.selected ?? state.route.to;
    return fill(
      regions.watch,
      h(
        "div",
        { class: "card empty" },
        icon(ICON.bell, "icon"),
        h("h3", { text: "Follow a currency pair" }),
        h("p", { text: "See its rate and trend at a glance, and get a notification when it reaches a rate you choose." }),
        h(
          "button",
          {
            type: "button",
            class: "btn btn-primary btn-sm",
            onclick: () => {
              toggleWatch(from, to);
              paintWatch();
            },
          },
          `Follow ${from} → ${to}`,
        ),
        h("button", { type: "button", class: "btn btn-plain btn-sm", onclick: addWatchPair }, "Choose another pair"),
      ),
    );
  }

  const badgeOptions = [h("option", { value: "", text: "Nothing" })].concat(
    watch.map((w) => h("option", { value: pairKey(w.from, w.to), text: `${w.from} → ${w.to}`, selected: state.prefs.badgePair === pairKey(w.from, w.to) })),
  );

  regions.watchStatus = h("div", null, rateStatus());
  fill(
    regions.watch,
    h("div", { class: "section-head" }, regions.watchStatus, periodSeg(() => paintWatch())),
    h("div", { class: "section-head" }, h("h2", { text: "Rates you follow" }), addBtn),
    h("div", { class: "group" }, watch.map(watchRow)),
    h(
      "div",
      { class: "card" },
      h(
        "div",
        { class: "setting" },
        h("span", { class: "setting-label" }, "Toolbar icon shows", h("small", { text: "A rate on the icon, updated about every 15 minutes" })),
        h(
          "select",
          {
            class: "select",
            "aria-label": "Rate shown on the toolbar icon",
            onchange: (e) => savePrefs({ badgePair: e.target.value || null }),
          },
          badgeOptions,
        ),
      ),
    ),
    h("p", { class: "note", text: "Alerts are checked about every 15 minutes while Chrome is open, against the mid-market rate; a provider's own rate is lower. Sparklines show the past 30 days." }),
  );
}

function watchRow(w) {
  const key = pairKey(w.from, w.to);
  const r = cross(state.rates?.rates, w.from, w.to);
  const hist = state.history.get(key);
  const month = hist ? sliceRange(hist.points, 30) : [];
  const stats = rangeStats(month);
  const change = rateChange(w.from, w.to);
  const alert = state.prefs.alerts.find((a) => a.from === w.from && a.to === w.to);
  const editing = state.editingAlert === key;

  let sub = CURRENCY[w.to]?.name ?? w.to;
  let subClass = "wrow-sub";
  if (alert?.active) {
    sub = `Alert ${alert.op === "above" ? "above" : "below"} ${fmt.rate(alert.target)}`;
    subClass += " alert-on";
  } else if (alert?.firedAt) {
    sub = `Reached ${fmt.rate(alert.firedRate)} ${fmt.ago(alert.firedAt)}`;
    subClass += " alert-hit";
  }

  return h(
    "div",
    { class: "wrow" },
    h(
      "button",
      {
        type: "button",
        class: "wrow-main",
        "aria-label": `${w.from} to ${w.to}: open in the converter`,
        onclick: () => {
          const c = state.conv;
          const r0 = rateNow(c.base, w.from);
          const list = [...new Set([w.from, w.to, ...c.list])].slice(0, MAX_CONVERT);
          state.conv = { base: w.from, amount: r0 ? Math.round(c.amount * r0 * 100) / 100 : c.amount, list, selected: w.to };
          saveConv();
          show("convert");
        },
      },
      h("span", { class: "pair-flags" }, flag(w.from), flag(w.to)),
      h("span", null, h("span", { class: "wrow-pair", text: `${w.from} → ${w.to}` }), h("span", { class: subClass, text: sub })),
      h("span", { class: "spark" }, stats ? lineChart(month, { width: 64, height: 26, interactive: false, label: "Past month" }) : null),
      h(
        "span",
        { class: "wrow-rate" },
        r ? fmt.rate(r) : "…",
        change != null
          ? h("span", { class: `chg ${change >= 0 ? "up" : "down"}`, text: fmt.pct(change, { signed: true }), title: `Over ${periodLabel()}` })
          : null,
      ),
    ),
    h(
      "button",
      {
        type: "button",
        class: `icon-btn${alert?.active ? " is-on" : ""}`,
        "aria-expanded": String(editing),
        "aria-label": alert?.active ? `Edit alert for ${w.from} → ${w.to}` : `Set an alert for ${w.from} → ${w.to}`,
        onclick: () => {
          state.editingAlert = editing ? null : key;
          paintWatch();
        },
      },
      icon(alert?.active ? ICON.bellFill : ICON.bell, "icon"),
    ),
    editing ? alertEditor(w, alert, r) : null,
  );
}

function alertEditor(w, alert, r) {
  let op = alert?.op ?? "above";
  const suggested = r ? r * (op === "above" ? 1.005 : 0.995) : null;
  const input = h("input", {
    class: "alert-input",
    inputmode: "decimal",
    "aria-label": `Target rate in ${w.to}`,
    value: alert ? fmt.number(alert.target, 6) : suggested ? fmt.number(suggested, decimalsFor(suggested)) : "",
  });
  const opSeg = h(
    "div",
    { class: "seg small", role: "radiogroup", "aria-label": "Direction" },
    ["above", "below"].map((value) =>
      h(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-selected": String(op === value),
          "aria-checked": String(op === value),
          onclick: (e) => {
            op = value;
            for (const b of opSeg.children) {
              const on = b === e.currentTarget;
              b.setAttribute("aria-selected", String(on));
              b.setAttribute("aria-checked", String(on));
            }
          },
        },
        value === "above" ? "Above" : "Below",
      ),
    ),
  );

  const save = () => {
    const target = fmt.parseAmount(input.value, 8);
    if (!target) {
      input.focus();
      return toast("Enter a rate");
    }
    // Asked here, inside the click, because Chrome only grants it from a user action.
    const asked = chrome.permissions.request({ permissions: ["notifications"] }).catch(() => false);
    const alerts = state.prefs.alerts.filter((a) => !(a.from === w.from && a.to === w.to));
    alerts.push({ id: crypto.randomUUID(), from: w.from, to: w.to, op, target, active: true });
    savePrefs({ alerts });
    state.editingAlert = null;
    paintWatch();
    asked.then((granted) =>
      toast(granted ? `We'll tell you when it's ${op} ${fmt.rate(target)}` : "Alert saved · notifications are off"),
    );
  };
  const removeAlert = () => {
    savePrefs({ alerts: state.prefs.alerts.filter((a) => !(a.from === w.from && a.to === w.to)) });
    state.editingAlert = null;
    paintWatch();
    toast("Alert removed");
  };
  const unfollow = () => {
    savePrefs({
      alerts: state.prefs.alerts.filter((a) => !(a.from === w.from && a.to === w.to)),
      badgePair: state.prefs.badgePair === pairKey(w.from, w.to) ? null : state.prefs.badgePair,
    });
    toggleWatch(w.from, w.to);
    state.editingAlert = null;
    paintWatch();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
  });

  return h(
    "div",
    { class: "alert-editor" },
    h("p", { text: `Notify me when 1 ${w.from} is` }),
    h("div", { class: "alert-line" }, opSeg, input, h("span", { class: "dim", text: w.to })),
    h(
      "div",
      { class: "alert-actions" },
      h("button", { type: "button", class: "btn btn-primary btn-sm", onclick: save }, alert?.active ? "Update alert" : "Set alert"),
      alert ? h("button", { type: "button", class: "btn btn-plain btn-sm", onclick: removeAlert }, "Remove alert") : null,
      h("span", { class: "spacer" }),
      h("button", { type: "button", class: "btn btn-danger btn-sm", onclick: unfollow }, "Unfollow"),
    ),
  );
}

function addWatchPair() {
  openPicker({
    title: "Rate of",
    list: ALL,
    popular: POPULAR_SEND,
    selected: null,
    onPick: (from) =>
      openPicker({
        title: `${from} in`,
        list: ALL.filter((c) => c.code !== from),
        popular: POPULAR_RECEIVE.filter((c) => c !== from),
        selected: null,
        onPick: (to) => {
          if (!state.prefs.watch.some((w) => w.from === from && w.to === to)) toggleWatch(from, to);
          paintWatch();
        },
      }),
  });
}

// ── Currency picker ──────────────────────────────────────────────────

function pickRouteCurrency(side) {
  const r = state.route;
  openPicker({
    title: side === "from" ? "Send from" : "Recipient gets",
    list: side === "from" ? SEND : ALL,
    popular: side === "from" ? POPULAR_SEND : POPULAR_RECEIVE,
    selected: r[side],
    onPick: (code) => {
      const other = side === "from" ? "to" : "from";
      const patch = { [side]: code };
      if (code === r[other]) {
        if (side === "to" && !SENDABLE.has(r.from)) return;
        patch[other] = r[side];
      }
      setRoute(patch);
    },
  });
}

function closeSheet() {
  const opener = closeSheet.opener;
  fill($sheet);
  document.removeEventListener("keydown", closeSheet.onKey);
  if (opener?.isConnected) opener.focus();
}

function openSheet(title, body, { header = null } = {}) {
  closeSheet.opener = document.activeElement;
  const panel = h(
    "div",
    { class: "sheet", role: "dialog", "aria-modal": "true", "aria-label": title },
    h(
      "div",
      { class: "sheet-head" },
      h("h2", { text: title }),
      h("button", { type: "button", class: "icon-btn", "aria-label": "Close", onclick: closeSheet }, icon(ICON.close, "icon sm")),
    ),
    header,
    h("div", { class: "sheet-body" }, body),
  );
  fill($sheet, h("div", { class: "sheet-backdrop", onclick: closeSheet }), panel);
  closeSheet.onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSheet();
    }
  };
  document.addEventListener("keydown", closeSheet.onKey);
  return panel;
}

function openPicker({ title, list, popular, selected, onPick }) {
  const search = h("input", { type: "search", placeholder: "Search currency or country", "aria-label": "Search currencies", autocomplete: "off" });
  const results = h("div", { role: "listbox", "aria-label": title });
  let options = [];
  let active = 0;

  const option = (c) =>
    h(
      "button",
      {
        type: "button",
        class: "option",
        role: "option",
        "aria-selected": String(c.code === selected),
        onclick: () => {
          closeSheet();
          onPick(c.code);
        },
      },
      flag(c.code),
      h("span", { class: "option-code", text: c.code }),
      h("span", { class: "option-name", text: c.name }),
      c.code === selected ? icon(ICON.check, "icon") : h("span"),
    );

  const render = () => {
    const q = search.value.trim().toLowerCase();
    const match = (c) => !q || c.code.toLowerCase().startsWith(q) || c.name.toLowerCase().includes(q) || c.countries?.toLowerCase().includes(q);
    const all = list.filter(match);
    const groups = [];
    if (!q) {
      const pop = popular.map((code) => list.find((c) => c.code === code)).filter(Boolean);
      if (pop.length) groups.push(h("p", { class: "list-label", text: "Popular" }), h("div", { class: "group" }, pop.map(option)));
      groups.push(h("p", { class: "list-label", text: "All currencies" }));
    }
    groups.push(all.length ? h("div", { class: "group" }, all.map(option)) : h("div", { class: "empty" }, h("p", { text: `No currency matches “${search.value}”` })));
    fill(results, groups);
    options = [...results.querySelectorAll(".option")];
    active = q ? 0 : -1;
    highlight();
  };
  const highlight = () => {
    options.forEach((o, i) => o.classList.toggle("is-active", i === active));
    options[active]?.scrollIntoView({ block: "nearest" });
  };

  search.addEventListener("input", render);
  search.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(0, Math.min(options.length - 1, active + (e.key === "ArrowDown" ? 1 : -1)));
      highlight();
    } else if (e.key === "Enter" && options[active]) {
      e.preventDefault();
      options[active].click();
    }
  });

  openSheet(title, results, { header: h("label", { class: "search" }, icon(ICON.search, "icon sm"), search) });
  render();
  search.focus();
}

// ── Settings ─────────────────────────────────────────────────────────

function openSettings() {
  const detect = h("input", {
    type: "checkbox",
    class: "switch",
    id: "detect",
    checked: state.prefs.detect,
    onchange: (e) => savePrefs({ detect: e.target.checked }),
  });
  const shortcut = h("span", { class: "dim", text: "Alt+Shift+S" });
  chrome.commands?.getAll?.().then((cmds) => {
    const key = cmds.find((c) => c.name === "_execute_action")?.shortcut;
    shortcut.textContent = key || "Not set";
  });
  const version = chrome.runtime.getManifest().version;

  openSheet(
    "Settings",
    h(
      "div",
      null,
      h(
        "div",
        { class: "card" },
        h(
          "div",
          { class: "setting" },
          h(
            "label",
            { for: "detect" },
            "Read amounts on provider sites",
            h("small", {
              text: "When you open SendMoneyCompare on a provider's page, it reads the amount and currencies shown there to compare them. Nothing is sent from the page.",
            }),
          ),
          detect,
        ),
        h(
          "div",
          { class: "setting" },
          h(
            "label",
            { for: "live" },
            "Show live activity",
            h("small", { text: "What readers on sendmoneycompare.com are comparing and choosing, at the bottom of the popup." }),
          ),
          h("input", {
            type: "checkbox",
            class: "switch",
            id: "live",
            checked: state.prefs.live,
            onchange: (e) => {
              savePrefs({ live: e.target.checked });
              if (e.target.checked) refreshActivity().then(() => paintLive(true));
              else paintLive(false);
            },
          }),
        ),
        h(
          "div",
          { class: "setting" },
          h("span", { class: "setting-label" }, "Keyboard shortcut", h("small", { text: "Change it at chrome://extensions/shortcuts" })),
          shortcut,
        ),
        h(
          "div",
          { class: "setting" },
          h("span", { class: "setting-label" }, "Address bar", h("small", { text: "Type smc, a space, then “500 gbp inr”" })),
        ),
        h(
          "div",
          { class: "setting" },
          h("span", { class: "setting-label" }, "On any page", h("small", { text: "Select an amount like “$1,250”, right-click, and compare or convert it" })),
        ),
      ),
      h(
        "div",
        { class: "about" },
        h("p", {
          text: "No account, and no analytics in the extension. To show prices it asks sendmoneycompare.com for public quotes and rates, sending only the currencies and amount you compare. Your watchlist and alerts stay in Chrome.",
        }),
        h("p", {
          text: "Send buttons open the provider through sendmoneycompare.com/go, which counts the click as the site does. Some are affiliate links: we may earn a commission, and it never changes the order.",
        }),
        h(
          "p",
          null,
          h("a", { href: `${SITE}/methodology`, target: "_blank", rel: "noopener" }, "How we compare"),
          " · ",
          h("a", { href: `${SITE}/privacy-policy`, target: "_blank", rel: "noopener" }, "Privacy"),
          " · ",
          h("span", { class: "dim", text: `Version ${version}` }),
        ),
      ),
    ),
  );
}

// ── Where the reader is ──────────────────────────────────────────────

async function detectHere() {
  let tab;
  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch {
    return;
  }
  if (!tab?.url?.startsWith("http")) return;
  const provider = providerForHost(new URL(tab.url).hostname);
  if (!provider) return;
  state.here = { ...provider, detected: null };

  if (state.prefs.detect && tab.id != null) {
    try {
      const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: detectTransfer, args: [ALL_CODES] });
      const d = res?.result;
      if (d?.amount && d.from && SENDABLE.has(d.from)) {
        const to = d.to && d.to !== d.from ? d.to : state.route.to !== d.from ? state.route.to : "INR";
        state.here.detected = d;
        state.route = { from: d.from, to, amount: d.amount };
        saveRoute();
        if (state.tab !== "compare") show("compare");
        else viewCompare();
        refreshComparison();
        return;
      }
    } catch {
      // A page we may not script (the Web Store, a PDF): the hostname is enough.
    }
  }
  if (state.tab === "compare") paintHere();
}

// ── Live activity: the site's strip ──────────────────────────────────
//
// The same feed and wording as the site's toast (src/components/live-activity/):
// real reader events, one at a time, each shown once per popup, the last one
// staying. The extension only reads the feed; it never records its own events.

const $live = document.getElementById("live");
const LIVE_EVERY_MS = 6000;
const RECENT_MS = 30 * 60_000;
/** The phone banner's short names (LiveActivityBanner.tsx), for a one-line strip. */
const SHORT_NAMES = { US: "US", GB: "UK", AE: "UAE" };
const live = { feed: null, shown: new Set(), current: null, paused: false };
let regionNames;

function placeName(code) {
  if (SHORT_NAMES[code]) return SHORT_NAMES[code];
  regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(code) ?? code;
}

function countryFlag(code) {
  const cc = String(code).toLowerCase();
  return h("img", { class: "flag sm", src: FLAG_FILES.has(cc) ? `flags/${cc}.svg` : "flags/generic.svg", alt: "", width: 18, height: 18 });
}

/** "now", "12m", "3h", "2d", as the phone banner says it. */
function liveAgo(item) {
  // An hourly item happened somewhere inside the hour that began at `at`.
  const mins = Math.max(0, Math.round((Date.now() - item.at - (item.hourly ? 30 * 60_000 : 0)) / 60_000));
  if (mins < 2) return item.hourly ? "1h" : "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
}

function liveCounter(feed) {
  if (feed?.source !== "live") return "Recent activity";
  if (feed.here != null && feed.here >= 2) return `Live · ${feed.here} people on the site now`;
  if (feed.people != null && feed.people >= 2) return `Live · ${feed.people} people on the site in 6 hours`;
  return "Live";
}

function liveWords(item) {
  const amount = item.amount && item.from ? fmt.amount(item.amount, item.from) : null;
  const who = h("strong", { text: placeName(item.country) });
  if (item.kind === "chose") return [who, " chose ", h("strong", { text: item.provider ?? "a provider" }), amount ? ` for ${amount}` : ""];
  if (item.from) return [who, " compared ", h("strong", { text: amount ?? "rates" }), item.to ? ` to ${item.to}` : ""];
  return [who, !item.hourly && Date.now() - item.at < RECENT_MS ? " is comparing rates" : " compared rates"];
}

function nextLive() {
  if (live.paused) return;
  const items = live.feed?.items ?? [];
  const key = (i) => `${i.at}|${i.country}|${i.kind}|${i.from}|${i.to}|${i.providerSlug}`;
  const next = items.find((i) => !live.shown.has(key(i)));
  if (!next) return paintLive(false);
  live.shown.add(key(next));
  live.current = next;
  paintLive(true);
}

function paintLive(animate) {
  const item = live.current;
  if (!state.prefs.live || !item) {
    $live.hidden = true;
    return;
  }
  const route = [countryFlag(item.country)];
  if (item.logo || item.to) {
    route.push(icon(ICON.chevronRight, "icon xs live-arrow"));
    route.push(
      item.logo
        ? h("img", { class: "live-logo", src: item.logo, alt: "", width: 18, height: 18 })
        : flag(item.to, "flag sm"),
    );
  }
  const canOpen = item.from && item.to && SENDABLE.has(item.from) && CURRENCY[item.to];
  fill(
    $live,
    h(
      "button",
      {
        type: "button",
        class: "live-item",
        disabled: !canOpen,
        title: canOpen ? `Compare ${item.from} → ${item.to}` : null,
        onclick: () => {
          state.route = { from: item.from, to: item.to, amount: item.amount ?? state.route.amount };
          saveRoute();
          refreshComparison();
          show("compare");
        },
      },
      h("span", { class: "live-route" }, route),
      h(
        "span",
        { class: `live-text${animate ? " is-new" : ""}` },
        h("span", { class: "live-counter" }, h("span", { class: `dot${live.feed?.source === "live" ? " live" : ""}` }), liveCounter(live.feed)),
        h("span", { class: "live-line", title: `${placeName(item.country)}, ${new Date(item.at).toLocaleString()}` }, liveWords(item), h("span", { class: "dim", text: ` · ${liveAgo(item)}` })),
      ),
    ),
    h(
      "button",
      {
        type: "button",
        class: "icon-btn live-x",
        "aria-label": "Hide live activity",
        onclick: () => {
          savePrefs({ live: false });
          paintLive(false);
          toast("Live activity hidden · Settings brings it back");
        },
      },
      icon(ICON.close, "icon xs"),
    ),
  );
  $live.hidden = false;
}

async function refreshActivity() {
  if (!state.prefs.live) return;
  try {
    await load("activity", {}, (data) => {
      live.feed = data;
      if (!live.current) nextLive();
      else paintLive(false);
    });
  } catch {
    // No feed, no strip.
  }
}

// ── Start ────────────────────────────────────────────────────────────

async function takePending() {
  try {
    const { pending } = await chrome.storage.session.get("pending");
    if (!pending) return null;
    await chrome.storage.session.remove("pending");
    return Date.now() - pending.at < 60_000 ? pending : null;
  } catch {
    return null;
  }
}

function applyPending(p) {
  if (p.mode === "convert") {
    const c = state.conv;
    const base = p.currency && CURRENCY[p.currency] ? p.currency : c.base;
    const list = [...new Set([base, ...c.list])].slice(0, MAX_CONVERT);
    const selected = c.selected && c.selected !== base ? c.selected : list.find((x) => x !== base);
    state.conv = { base, amount: p.amount ?? c.amount, list, selected };
    state.tab = "convert";
  } else {
    const from = p.currency && SENDABLE.has(p.currency) ? p.currency : state.route.from;
    const to = state.route.to === from ? (from === "USD" ? "INR" : "USD") : state.route.to;
    state.route = { from, to, amount: p.amount ?? state.route.amount };
    state.tab = "compare";
  }
}

async function init() {
  state.prefs = await getPrefs();
  const p = state.prefs;
  if (p.route && SENDABLE.has(p.route.from) && CURRENCY[p.route.to]) state.route = p.route;
  else {
    const from = localeCurrency();
    state.route = { from, to: from === "INR" ? "USD" : "INR", amount: 1000 };
  }
  state.conv = convFromPrefs(p.convert, state.route);
  state.tab = p.tab;

  const pending = await takePending();
  if (pending) {
    applyPending(pending);
    saveRoute();
    saveConv();
  }

  document.getElementById("settings").append(icon(ICON.gear, "icon"));
  document.getElementById("settings").addEventListener("click", openSettings);
  const tabs = [...document.querySelectorAll("nav.seg button")];
  for (const b of tabs) b.addEventListener("click", () => show(b.dataset.tab));
  document.querySelector("nav.seg").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const i = tabs.findIndex((b) => b.dataset.tab === state.tab);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    show(next.dataset.tab);
    next.focus();
  });

  show(state.tab);
  refreshComparison();
  refreshRates();
  if (!pending) detectHere();
  setTimeout(() => pruneSaved().catch(() => {}), 3000);
  refreshActivity();
  setInterval(refreshActivity, 30_000);
  setInterval(nextLive, LIVE_EVERY_MS);
  $live.addEventListener("pointerenter", () => (live.paused = true));
  $live.addEventListener("pointerleave", () => (live.paused = false));
  $live.addEventListener("focusin", () => (live.paused = true));
  $live.addEventListener("focusout", () => (live.paused = false));
  // While the popup is open the converter and watchlist follow the live rate.
  setInterval(refreshRates, 60_000);
  setInterval(() => {
    if (state.tab === "convert") fill(regions.status, rateStatus());
    if (state.tab === "rates") fill(regions.watchStatus, rateStatus());
  }, 15_000);
}

function convFromPrefs(saved, route) {
  if (saved?.list?.length >= 2 && saved.list.every((code) => CURRENCY[code]) && saved.list.includes(saved.base)) return saved;
  // The first version stored one pair: { from, to, amount }.
  const from = CURRENCY[saved?.from] ? saved.from : route.from;
  const to = CURRENCY[saved?.to] ? saved.to : route.to;
  const list = [...new Set([from, to, "EUR", "GBP", "USD"])].slice(0, 4);
  return { base: from, amount: saved?.amount ?? 1000, list, selected: to === from ? list[1] : to };
}

init();
