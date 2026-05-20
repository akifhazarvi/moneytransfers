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
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() => trackProviderClicked(provider, corridor, rank, source)}
      className={className}
    >
      {children}
    </a>
  );
}
