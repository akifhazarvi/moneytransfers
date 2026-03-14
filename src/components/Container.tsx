import { type ReactNode, type ElementType } from "react";

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export default function Container({ children, as: Tag = "div", className = "" }: Props) {
  return (
    <Tag className={`max-w-[1200px] mx-auto px-4 sm:px-6 ${className}`.trim()}>
      {children}
    </Tag>
  );
}
