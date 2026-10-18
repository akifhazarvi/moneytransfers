"use client";

/**
 * Paused: the site's consent flow offers analytics and replay, not advertising.
 * Do not load AdSense on an analytics grant. Restore only with a separate,
 * appropriate advertising consent integration (including Google's CMP rules).
 */
export default function AdSenseLoader() {
  return null;
}
