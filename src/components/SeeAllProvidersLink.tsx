"use client";

import Link from "next/link";
import { trackSeeAllProviders, trackSeeAllProvidersHeader } from "@/lib/analytics";

interface Props {
  href: string;
  corridor: string;
  source: "header" | "footer";
  slug: string;
  children: React.ReactNode;
  className?: string;
}

export default function SeeAllProvidersLink({ href, corridor, source, slug, children, className }: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        if (source === "header") trackSeeAllProvidersHeader(slug, corridor);
        else trackSeeAllProviders(slug, corridor);
      }}
    >
      {children}
    </Link>
  );
}
