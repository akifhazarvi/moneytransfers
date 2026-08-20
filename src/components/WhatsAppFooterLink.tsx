"use client";

import { WhatsAppGlyph } from "./WhatsAppMark";
import WhatsAppFollowLink from "./WhatsAppFollowLink";

// Footer follow link. Split out of the (server) Footer purely so the click can
// be attributed — "footer" was previously the one WhatsApp surface firing no
// event at all, which made the placement look dead when it may just have been
// unmeasured.
//
// In WhatsApp's own green rather than our gold: a recoloured mark reads as a
// generic chat icon and gets ignored. The dark label keeps it AA on the green.
export default function WhatsAppFooterLink() {
  return (
    <WhatsAppFollowLink
      source="footer"
      ariaLabel="Follow SendMoneyCompare on WhatsApp for rate alerts"
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--wa-green)] px-4 py-2 text-sm font-bold text-[var(--wa-on-green)] transition-colors hover:bg-[var(--wa-green-hover)]"
    >
      <WhatsAppGlyph className="h-4 w-4" />
      Rate alerts on WhatsApp
    </WhatsAppFollowLink>
  );
}
