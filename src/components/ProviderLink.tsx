"use client";

import { type ReactNode } from "react";
import { trackProviderClicked } from "@/lib/analytics";

interface Props {
  href: string;
  provider: string;
  source: string;
  corridor?: string;
  rank?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Drop-in replacement for bare <a href={getGoUrl(...)}> on server-rendered pages.
 * Fires provider_clicked with source/corridor context before following the link.
 */
export default function ProviderLink({
  href,
  provider,
  source,
  corridor = "",
  rank = 0,
  className,
  children,
}: Props) {
  // Append ?src= to the /go/ URL so the route can pass it as a Partnerize clickref
  const hrefWithSrc = source && href.startsWith("/go/") && !href.includes("src=")
    ? `${href}${href.includes("?") ? "&" : "?"}src=${encodeURIComponent(source)}`
    : href;

  return (
    <a
      href={hrefWithSrc}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() => trackProviderClicked(provider, corridor, rank, source)}
      className={className}
    >
      {children}
    </a>
  );
}
