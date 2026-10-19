// Service worker: rate alerts and the toolbar rate (an hourly alarm), the
// right-click "compare / convert this amount" items, and the `smc` keyword in
// the address bar. It holds no state of its own; everything lives in
// chrome.storage (lib/store.js, lib/api.js).

import { SITE } from "./config.js";
import * as fmt from "./lib/format.js";
import { fetchJson, save, saved, cross } from "./lib/api.js";
import { priceCheckOrigins } from "./lib/hosts.js";
import { parseMoney, parseQuery } from "./lib/parse.js";
import { getPrefs, setPrefs } from "./lib/store.js";
import { analyticsReady, track } from "./lib/analytics.js";
import { siteLink } from "./lib/links.js";
import { CURRENCY } from "./data/currencies.js";

const CODES = new Set(Object.keys(CURRENCY));
const ALARM = "rates";
/** Rates are live (cached for minutes at the CDN), so alerts and the toolbar rate are checked every 15 minutes. */
const CHECK_MINUTES = 15;

function compareUrl(from, to, amount, placement) {
  const base = siteLink("/send-money", placement);
  if (!from) return base;
  return `${base}#from=${from}${to ? `&to=${to}` : ""}${amount ? `&amount=${amount}` : ""}`;
}

/** The worker restarts often, so resolve the opt-in before every event. */
function trackNow(name, params) {
  analyticsReady()
    .then((ok) => ok && track(name, params, { now: true }))
    .catch(() => {});
}

// ── Install, startup, alarm ──────────────────────────────────────────

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") chrome.tabs.create({ url: "welcome.html" });
  // A one-line "why are you leaving?" on the site; nothing is sent from here.
  chrome.runtime.setUninstallURL(siteLink("/contact", "uninstall")).catch?.(() => {});
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: "compare", title: "Compare sending “%s”", contexts: ["selection"] });
    chrome.contextMenus.create({ id: "convert", title: "Convert “%s”", contexts: ["selection"] });
  });
  chrome.alarms.create(ALARM, { periodInMinutes: CHECK_MINUTES, delayInMinutes: 1 });
  syncPriceCheck();
});

chrome.runtime.onStartup.addListener(async () => {
  if (!(await chrome.alarms.get(ALARM))) chrome.alarms.create(ALARM, { periodInMinutes: CHECK_MINUTES });
  checkRates();
  syncPriceCheck();
});

// ── Automatic price check on provider sites ──────────────────────────
//
// content.js runs on provider pages only while the reader has granted the
// optional host permission (asked on the welcome page, in the popup, in
// Settings) and kept "Check prices on provider sites" on.

const PRICE_CHECK = "smc-price-check";

async function syncPriceCheck() {
  const origins = priceCheckOrigins();
  const granted = await chrome.permissions.contains({ origins }).catch(() => false);
  const { detect } = await getPrefs();
  const registered = await chrome.scripting.getRegisteredContentScripts({ ids: [PRICE_CHECK] }).catch(() => []);
  if (granted && detect && !registered.length) {
    await chrome.scripting
      .registerContentScripts([{ id: PRICE_CHECK, matches: origins, js: ["content.js"], runAt: "document_idle", persistAcrossSessions: true }])
      .catch(() => {});
  } else if ((!granted || !detect) && registered.length) {
    await chrome.scripting.unregisterContentScripts({ ids: [PRICE_CHECK] }).catch(() => {});
  }
  return granted && detect;
}

/** Start the check in provider tabs already open, so turning it on works without a reload. */
async function injectOpenTabs() {
  const tabs = await chrome.tabs.query({ url: priceCheckOrigins() }).catch(() => []);
  for (const tab of tabs) chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] }).catch(() => {});
}

chrome.permissions.onAdded.addListener(async () => {
  if (await syncPriceCheck()) injectOpenTabs();
});
chrome.permissions.onRemoved.addListener(async () => {
  if (await syncPriceCheck()) return;
  // Unregistering prevents future injection; stop observers in existing tabs too.
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) if (tab.id != null) chrome.tabs.sendMessage(tab.id, { type: "smc:stop-price-check" }).catch(() => {});
});

// The quote a provider page needs, from the same saved answers the popup uses.
async function comparison(params) {
  const hit = await saved("compare", params);
  if (hit && Date.now() - hit.at < 10 * 60_000) return hit.data;
  try {
    const data = await fetchJson("compare", params);
    await save("compare", params, data);
    return data;
  } catch {
    return hit?.data ?? null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (sender.id !== chrome.runtime.id) return;
  if (message?.type === "smc:compare") {
    const { from, to, amount } = message;
    if (!CODES.has(from) || !CODES.has(to) || from === to || !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) return reply({});
    comparison({ from, to, amount }).then((data) => reply({ data })).catch(() => reply({}));
    return true;
  }
  if (message?.type === "smc:open-popup") chrome.action.openPopup().catch(() => {});
  if (message?.type === "smc:track" && typeof message.name === "string") trackNow(message.name, message.params ?? {});
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) checkRates();
});

// A new alert or toolbar pair is judged against the saved rates at once, not an hour later.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && (changes.badgePair || changes.alerts)) checkRates({ network: false });
  if (area === "sync" && changes.detect) syncPriceCheck();
});

let checking = null;

function checkRates(opts) {
  checking ??= runCheck(opts).finally(() => {
    checking = null;
  });
  return checking;
}

async function runCheck({ network = true } = {}) {
  let rates = (await saved("rates", {}))?.data ?? null;
  let offline = false;
  if (network || !rates) {
    try {
      rates = await fetchJson("rates", {});
      await save("rates", {}, rates);
    } catch {
      offline = true;
      // Keep the dated badge, but do not fire new alerts from an offline copy.
    }
  }
  if (!rates?.rates) return;
  const prefs = await getPrefs();
  await paintBadge(prefs, rates);
  const age = Date.now() - Date.parse(rates.asOf);
  if (!offline && Number.isFinite(age) && age >= -300_000 && age <= 12 * 60 * 60_000) await fireAlerts(prefs, rates);
}

async function paintBadge(prefs, rates) {
  const [from, to] = (prefs.badgePair || "").split(":");
  const r = from && to ? cross(rates.rates, from, to) : null;
  if (!r) {
    await chrome.action.setBadgeText({ text: "" });
    await chrome.action.setTitle({ title: "SendMoneyCompare" });
    return;
  }
  await chrome.action.setBadgeBackgroundColor({ color: "#1a73e8" });
  await chrome.action.setBadgeTextColor?.({ color: "#ffffff" });
  await chrome.action.setBadgeText({ text: fmt.badge(r) });
  await chrome.action.setTitle({
    title: `1 ${from} = ${fmt.rate(r)} ${to} (mid-market, collected ${fmt.ago(rates.asOf)})\nSendMoneyCompare`,
  });
}

async function fireAlerts(prefs, rates) {
  let changed = false;
  const alerts = prefs.alerts.map((a) => {
    if (!a.active) return a;
    const r = cross(rates.rates, a.from, a.to);
    if (!r) return a;
    const hit = a.op === "above" ? r >= a.target : r <= a.target;
    if (!hit) return a;
    changed = true;
    notify(a, r, rates.asOf);
    trackNow("ext_alert_fired", { pair: `${a.from}-${a.to}`, op: a.op });
    // One notification per alert: it is spent once it fires and can be set again.
    return { ...a, active: false, firedAt: Date.now(), firedRate: r };
  });
  if (changed) await setPrefs({ alerts });
}

async function notify(alert, r, asOf) {
  const allowed = await chrome.permissions.contains({ permissions: ["notifications"] });
  if (!allowed || !chrome.notifications) return;
  chrome.notifications.create(`alert:${alert.from}:${alert.to}`, {
    type: "basic",
    iconUrl: "icons/icon-128.png",
    title: `${alert.from} → ${alert.to} is ${alert.op} ${fmt.rate(alert.target)}`,
    message: `1 ${alert.from} = ${fmt.rate(r)} ${alert.to} at the mid-market rate (collected ${fmt.ago(asOf)}). Click to compare what providers pay.`,
    priority: 1,
  });
}

// Registered only once the reader has allowed notifications (optional permission).
function bindNotifications() {
  if (!chrome.notifications || bindNotifications.done) return;
  bindNotifications.done = true;
  chrome.notifications.onClicked.addListener((id) => {
    const [, from, to] = id.split(":");
    if (from && to) chrome.tabs.create({ url: compareUrl(from, to, null, "alert") });
    chrome.notifications.clear(id);
  });
}
bindNotifications();
chrome.permissions.onAdded.addListener(bindNotifications);

// ── Right-click: compare / convert the selected amount ───────────────

chrome.contextMenus.onClicked.addListener((info) => {
  const mode = info.menuItemId === "convert" ? "convert" : "compare";
  const money = parseMoney(info.selectionText, CODES);
  const pending = { mode, amount: money?.amount ?? null, currency: money?.currency ?? null, at: Date.now() };
  chrome.storage.session.set({ pending });
  trackNow("ext_context_menu", { mode, parsed: Boolean(money?.amount) });
  // openPopup must run inside the click; Chrome before 127 (or no focused
  // window) cannot, so the reader gets the same answer on the site instead.
  chrome.action.openPopup().catch(async () => {
    await chrome.storage.session.remove("pending");
    const prefs = await getPrefs();
    const from = pending.currency && CODES.has(pending.currency) ? pending.currency : prefs.route?.from;
    chrome.tabs.create({
      url: mode === "convert" ? siteLink("/currency-converter", "context_menu") : compareUrl(from, prefs.route?.to, pending.amount, "context_menu"),
    });
  });
});

// ── Address bar: smc 1000 usd inr ────────────────────────────────────

const escapeXml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const HINT = "Compare money transfers: type an amount and two currencies, like <match>1000 usd inr</match>";

chrome.omnibox.onInputStarted.addListener(() => {
  chrome.omnibox.setDefaultSuggestion({ description: HINT });
});

let typed = 0;

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const seq = ++typed;
  const q = parseQuery(text, CODES);
  if (!q.from || !q.to) {
    chrome.omnibox.setDefaultSuggestion({ description: HINT });
    return suggest([]);
  }
  const prefs = await getPrefs();
  const amount = q.amount ?? prefs.route?.amount ?? 1000;
  chrome.omnibox.setDefaultSuggestion({
    description: `Compare sending <match>${escapeXml(fmt.money(amount, q.from))}</match> to ${escapeXml(q.to)} on SendMoneyCompare`,
  });
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (seq !== typed) return;
  try {
    const data = await fetchJson("compare", { from: q.from, to: q.to, amount });
    if (seq !== typed) return;
    const rows = data.rows.filter((r) => r.ranked && r.sendUrl?.startsWith(`${SITE}/go/`)).slice(0, 5);
    suggest(
      rows.map((r, i) => ({
        content: r.sendUrl,
        description:
          `${escapeXml(r.name)} pays <match>${escapeXml(fmt.money(r.receive, data.to))}</match>` +
          `<dim> · ${r.fee === 0 ? "no fee" : `${escapeXml(fmt.money(r.fee, data.from))} fee`}${i === 0 && data.topLabel ? " · best value" : ""}</dim>`,
      })),
    );
  } catch {
    suggest([]);
  }
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  let url;
  if (text.startsWith(`${SITE}/go/`)) {
    url = text;
    const go = new URL(text);
    trackNow("provider_clicked", {
      provider: go.pathname.split("/")[2] ?? "",
      corridor: `${go.searchParams.get("from")}-${go.searchParams.get("to")}`,
      amount: Number(go.searchParams.get("amount")) || 0,
      placement: "extension_omnibox",
    });
  } else {
    const q = parseQuery(text, CODES);
    url = compareUrl(q.from, q.to, q.amount, "omnibox");
    trackNow("ext_omnibox", { result: "compare", parsed: Boolean(q.from && q.to) });
  }
  if (disposition === "currentTab") chrome.tabs.update({ url });
  else chrome.tabs.create({ url, active: disposition === "newForegroundTab" });
});
