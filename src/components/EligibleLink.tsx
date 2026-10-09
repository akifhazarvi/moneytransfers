import Link from "next/link";
import type { ComponentProps } from "react";
import { isLinkEligible } from "@/lib/link-eligibility";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * next/link that renders only when its target is Google-eligible; otherwise
 * the children render as plain text in a span carrying the same className, so
 * layout holds. See src/lib/link-eligibility.ts. Works in server and client
 * components (no hooks).
 */
export default function EligibleLink({ href, children, className, ...rest }: Props) {
  if (!isLinkEligible(href)) return <span className={className}>{children}</span>;
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
