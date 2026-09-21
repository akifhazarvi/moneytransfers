"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ProviderLink from "@/components/ProviderLink";
import { getGoUrl } from "@/lib/affiliate";
import { trackCrossSellViewed } from "@/lib/analytics";
import { tapTapReadingPlacement } from "@/lib/taptap-placement";

const DISMISSED_KEY = "smc-taptap-reading-dismissed";

function ReadingCTA({ source, hasTicker }: { source: string; hasTicker: boolean }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const seen = useRef(false);
  const rail = useRef<HTMLElement>(null);

  useEffect(() => {
    let closed = false;
    try { closed = sessionStorage.getItem(DISMISSED_KEY) === "1"; } catch { /* Storage is optional. */ }
    if (closed || dismissed) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const active = document.activeElement;
      const editing = active instanceof HTMLElement && (active.matches("input, textarea, select") || active.isContentEditable);
      const competingCTA = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/go/taptap-send"]')).some(link => {
        if (rail.current?.contains(link)) return false;
        const rect = link.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth && rect.right > 0;
      });
      const cookieBanner = document.querySelector('[aria-label="Cookie consent"]');
      setVisible(window.scrollY > Math.min(500, window.innerHeight * 0.5) && !editing && !cookieBanner && !competingCTA);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    // Includes consent dismissal and dynamically inserted comparison buttons.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
    };
  }, [dismissed]);

  useEffect(() => {
    if (visible && !dismissed && !seen.current) {
      trackCrossSellViewed(source, "reading-bar", "taptap-send", "");
      seen.current = true;
    }
  }, [visible, dismissed, source]);

  const show = visible && !dismissed;
  return <>
    <aside ref={rail} hidden={!show} className={`taptap-reading-cta${hasTicker ? " taptap-reading-cta--ticker" : ""}`} aria-label="TapTap Send sponsored offer">
      <Image src="/logos/taptap-send.png" alt="" width={40} height={40} />
      <div className="taptap-reading-copy"><span>Sponsored · TapTap Send</span><strong>Sending money home?</strong><small>Check your rate and delivery options.</small></div>
      <ProviderLink href={getGoUrl("taptap-send", { clickref: source })} provider="taptap-send" source={source} className="conversion-button conversion-button--accent">Check TapTap Send rates <span aria-hidden="true">↗</span></ProviderLink>
      <button type="button" className="taptap-reading-dismiss" aria-label="Dismiss TapTap Send offer" onClick={() => {
        setDismissed(true);
        try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch { /* Still dismiss in memory. */ }
      }}>×</button>
    </aside>
    {show && <div className="taptap-reading-reserve" aria-hidden="true" />}
  </>;
}

export default function TapTapReadingCTA() {
  const pathname = usePathname() || "";
  const placement = tapTapReadingPlacement(pathname);
  return placement ? <ReadingCTA key={pathname} {...placement} /> : null;
}
