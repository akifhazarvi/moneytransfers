import Link from "next/link";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  className?: string;
  highlight?: boolean;
  id?: string;
}

const base =
  "bg-[var(--color-surface)] border rounded-2xl transition-all hover:shadow-[0_2px_12px_rgba(32,33,36,0.12)]";

export default function Card({ children, href, className = "", highlight = false, id }: Props) {
  const border = highlight
    ? "border-[var(--color-primary)] shadow-[0_0_0_1px_var(--color-primary)]"
    : "border-[var(--color-outline)]";

  if (href) {
    return (
      <Link href={href} id={id} className={`${base} ${border} p-5 block ${className}`.trim()}>
        {children}
      </Link>
    );
  }

  return (
    <div id={id} className={`${base} ${border} p-5 ${className}`.trim()}>
      {children}
    </div>
  );
}
