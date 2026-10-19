// The welcome page, opened once on install: pin the icon (the step that decides
// whether the extension gets used), try it, and the one-time analytics choice.

import { setAnalytics, track, analyticsReady } from "./lib/analytics.js";
import { siteLink } from "./lib/links.js";
import { getPrefs } from "./lib/store.js";

const $ = (id) => document.getElementById(id);
const PUZZLE =
  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M8 3.5a1.8 1.8 0 013.6 0V5H15a1 1 0 011 1v3.4h-1.4a1.8 1.8 0 000 3.6H16V16a1 1 0 01-1 1h-3.4v-1.4a1.8 1.8 0 00-3.6 0V17H5a1 1 0 01-1-1v-3.4h1.4a1.8 1.8 0 000-3.6H4V6a1 1 0 011-1h3z"/></svg>';

function toast(text) {
  const el = $("toast");
  el.textContent = text;
  el.classList.add("is-on");
  setTimeout(() => el.classList.remove("is-on"), 1800);
}

let pinnedSeen = false;
async function paintPinned() {
  let pinned = false;
  try {
    pinned = (await chrome.action.getUserSettings()).isOnToolbar === true;
  } catch {
    // Older browsers cannot tell; keep the instruction up.
  }
  const status = $("pin-status");
  status.className = `chip ${pinned ? "green" : ""}`;
  status.textContent = pinned ? "Pinned ✓" : "Not pinned yet";
  document.body.classList.toggle("w-pinned", pinned);
  if (pinned && !pinnedSeen) {
    pinnedSeen = true;
    track("ext_welcome", { action: "pinned" });
  }
}

function showChoice(analytics) {
  if (analytics === null) return;
  $("consent-actions").hidden = true;
  const done = $("consent-done");
  done.hidden = false;
  done.textContent = analytics
    ? "Thank you. Usage sharing is on; turn it off any time in Settings."
    : "Nothing will be shared. You can change this any time in Settings.";
}

async function init() {
  $("puzzle").innerHTML = PUZZLE;
  for (const [id, path] of [["link-privacy", "/privacy-policy"], ["link-method", "/methodology"], ["link-site", "/"]]) {
    $(id).href = siteLink(path, "welcome");
  }
  chrome.commands?.getAll?.().then((cmds) => {
    const key = cmds.find((c) => c.name === "_execute_action")?.shortcut;
    if (key) $("shortcut").textContent = key;
  });

  const prefs = await getPrefs();
  await analyticsReady();
  showChoice(prefs.analytics);

  $("consent-yes").addEventListener("click", async () => {
    await setAnalytics(true);
    track("ext_installed", {});
    track("ext_welcome", { action: "consent_yes" }, { now: true });
    showChoice(true);
  });
  $("consent-no").addEventListener("click", async () => {
    await setAnalytics(false);
    showChoice(false);
  });
  $("open-popup").addEventListener("click", () => {
    track("ext_welcome", { action: "open_popup" }, { now: true });
    chrome.action.openPopup().catch(() => toast("Click the SendMoneyCompare icon in your toolbar"));
  });

  paintPinned();
  setInterval(paintPinned, 1500);
}

init();
