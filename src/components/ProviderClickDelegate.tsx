"use client";

import { useEffect } from "react";
import { trackProviderClicked } from "@/lib/analytics";

/**
 * Fires provider_clicked for affiliate links that cannot carry their own
 * onClick handler.
 *
 * WHY THIS EXISTS
 * Guide and business-page tables are authored as HTML strings and rendered
 * through `sanitizeHtml`, which strips every `on*` attribute — correctly, since
 * that content is not React and an inline handler there would be an injection
 * surface. So a `/go` link emitted by {{QUOTE_TABLE}} can carry an href but not
 * a handler, and until now those clicks fired nothing: the north-star event was
 * blind to every comparison table outside the corridor page.
 *
 * One delegated listener on the document covers all of them, present and
 * future, including tables added to guides later.
 *
 * DOUBLE-FIRE GUARD
 * <ProviderLink> already fires provider_clicked itself and marks its anchor
 * with data-pc. Those are skipped here, so a link is counted once regardless of
 * which path rendered it.
 *
 * The event is best-effort: the click navigates away immediately, and the
 * analytics helper uses a transport that survives unload. The /go route also
 * records the redirect server-side, so a dropped beacon loses the client-side
 * attribution but never the redirect itself.
 */
export default function ProviderClickDelegate() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const a = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;

      // getAttribute, not .href — we want the authored path, not the resolved
      // absolute URL, so this matches regardless of origin.
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/go/") && !href.startsWith("/out/")) return;
      if (a.hasAttribute("data-pc")) return; // ProviderLink already tracked it

      const slug = href.split("/")[2]?.split("?")[0] ?? "";
      if (!slug) return;

      let corridor = "";
      let source = "content_table";
      try {
        const q = new URLSearchParams(href.split("?")[1] || "");
        const from = q.get("from");
        const to = q.get("to");
        if (from && to) corridor = `${from}-${to}`;
        source = q.get("src") || source;
      } catch {
        /* malformed query — fall back to the defaults above */
      }

      // rank 0 = "not a ranked position we can read from the DOM". The corridor
      // table passes a real rank through ProviderLink; these come from prose
      // tables where row order is not necessarily a ranking.
      trackProviderClicked(slug, corridor, 0, source);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
