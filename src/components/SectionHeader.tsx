import Link from "next/link";

interface Props {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, viewAllHref, viewAllLabel = "View all", centered = false }: Props) {
  return (
    <div className={`flex items-center ${centered ? "justify-center" : "justify-between"} mb-6`}>
      <h2 className="text-[22px] font-normal text-[var(--color-on-surface)]">{title}</h2>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-[14px] text-[var(--color-primary)] hover:underline">
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
