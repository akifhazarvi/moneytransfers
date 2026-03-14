import Link from "next/link";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  className?: string;
  highlight?: boolean;
}

const base =
  "bg-white border rounded-xl transition-shadow hover:shadow-[0_1px_6px_rgba(32,33,36,0.18)]";

export default function Card({ children, href, className = "", highlight = false }: Props) {
  const border = highlight
    ? "border-[var(--color-primary)] shadow-[0_0_0_1px_var(--color-primary)]"
    : "border-[var(--color-outline)]";

  if (href) {
    return (
      <Link href={href} className={`${base} ${border} p-5 block ${className}`.trim()}>
        {children}
      </Link>
    );
  }

  return (
    <div className={`${base} ${border} p-5 ${className}`.trim()}>
      {children}
    </div>
  );
}
