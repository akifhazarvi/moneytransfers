import Link from "next/link";
import type { ComponentProps } from "react";
import { isLinkEligible } from "@/lib/link-eligibility";

type Props = ComponentProps<typeof Link> & {
  href: string;
  /**
   * Where to point instead when `href` is not Google-eligible — the closest
   * eligible page serving the same purpose (e.g. `/send-money#from=USD&to=MXN`
   * for a corridor page Google may not index). Used only if it is eligible.
   */
  fallbackHref?: string | null;
  /**
   * What renders when neither href is eligible: the children as plain text
   * (default, for names in prose and tables), or nothing (`"hide"`, for
   * arrows, "Read more" and buttons that mean nothing without their link).
   */
  unlinked?: "text" | "hide";
};

/**
 * The className for unlinked text: layout kept, link styling (link colour,
 * underline, hover/focus states) dropped so the text does not pose as a link.
 */
function plainClassName(className: string | undefined): string | undefined {
  if (!className) return className;
  const kept = className
    .split(/\s+/)
    .filter((c) => c && !/^(hover:|focus:|focus-visible:|active:|group-hover:|underline$|underline-offset-|decoration-|cursor-pointer$|transition|text-\[var\(--color-primary)/.test(c));
  return kept.join(" ") || undefined;
}

/**
 * next/link that renders only when its target is Google-eligible (CLAUDE.md
 * rule 14); otherwise it follows `fallbackHref`, or degrades to its children
 * in a span carrying the same className, so layout holds. See
 * src/lib/link-eligibility.ts. Works in server and client components (no
 * hooks). Every component imports this in place of next/link.
 */
export default function EligibleLink({ href, fallbackHref, unlinked = "text", children, className, ...rest }: Props) {
  const target = isLinkEligible(href) ? href : fallbackHref && isLinkEligible(fallbackHref) ? fallbackHref : null;
  if (target === null) return unlinked === "hide" ? null : <span className={plainClassName(className)}>{children}</span>;
  return (
    <Link href={target} className={className} {...rest}>
      {children}
    </Link>
  );
}
