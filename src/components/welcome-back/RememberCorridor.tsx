"use client";

import { useEffect } from "react";
import { rememberSearch } from "@/lib/last-search";

function readCookie(name: string): string {
  return (document.cookie.match(`(?:^|; )${name}=([^;]*)`) || [])[1] ?? "";
}

/**
 * A corridor page read is remembered as a weak search ("page"): it is offered
 * on a later visit only when no search the visitor made outranks it.
 *
 * A country page ranks every route into the country and borrows the US pair
 * only for its default table, so `anyOrigin` takes the visitor's own sending
 * currency and default amount (the middleware's geo cookies) where they have
 * one. The marker tells WelcomeBackManager this page already is the offer.
 */
export default function RememberCorridor({ from, to, amount, anyOrigin = false }: {
  from: string;
  to: string;
  amount: number;
  anyOrigin?: boolean;
}) {
  useEffect(() => {
    let pick = { from, amount };
    if (anyOrigin) {
      const geoFrom = readCookie("geo-currency");
      const geoAmount = Math.round(Number(readCookie("geo-default-amount")));
      if (/^[A-Z]{3}$/.test(geoFrom) && geoFrom !== to && geoFrom !== from && geoAmount > 0) pick = { from: geoFrom, amount: geoAmount };
    }
    rememberSearch({ ...pick, to, kind: "page" });
  }, [from, to, amount, anyOrigin]);

  return <span hidden data-smc-corridor={anyOrigin ? `*-${to}` : `${from}-${to}`} />;
}
