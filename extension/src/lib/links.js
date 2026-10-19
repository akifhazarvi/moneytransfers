// Links into sendmoneycompare.com carry utm_source / utm_medium, so the site's
// analytics can tell visits the extension sent (and from where in it) from
// direct traffic. /go links are left alone: /go counts them through src=extension.

import { SITE } from "../config.js";
import { BROWSER } from "./analytics.js";

export function siteLink(pathOrUrl, placement) {
  const url = new URL(pathOrUrl, SITE);
  if (url.origin !== SITE || url.pathname.startsWith("/go/") || url.pathname.startsWith("/out/")) return url.toString();
  url.searchParams.set("utm_source", `${BROWSER}-extension`);
  url.searchParams.set("utm_medium", "extension");
  if (placement) url.searchParams.set("utm_content", placement);
  return url.toString();
}

/** The store page to rate us on, or null for an unpacked build. */
export function storeReviewUrl() {
  const updateUrl = chrome.runtime.getManifest().update_url || "";
  if (updateUrl.includes("edge.microsoft.com")) return `https://microsoftedge.microsoft.com/addons/detail/${chrome.runtime.id}`;
  if (updateUrl.includes("google.com")) return `https://chromewebstore.google.com/detail/${chrome.runtime.id}/reviews`;
  return null;
}
