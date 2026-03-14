import Link from "next/link";
import { type ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface ButtonProps extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
}

interface LinkProps extends BaseProps {
  href: string;
  external?: boolean;
}

type Props = ButtonProps | LinkProps;

const sizeMap = {
  sm: "h-9 px-5 text-[13px]",
  md: "h-10 px-6 text-[14px]",
  lg: "h-12 px-8 text-[14px]",
};

const base =
  "inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-medium rounded-full hover:bg-[var(--color-primary-dark)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.2)] active:shadow-none transition-all";

export default function PrimaryButton(props: Props) {
  const { children, className = "", size = "md" } = props;
  const classes = `${base} ${sizeMap[size]} ${className}`.trim();

  if ("href" in props && props.href) {
    if ((props as LinkProps).external) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer nofollow" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button" } = props as ButtonProps;
  return (
    <button onClick={onClick} type={type} className={classes}>
      {children}
    </button>
  );
}
