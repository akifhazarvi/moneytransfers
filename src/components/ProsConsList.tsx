interface Props {
  type: "pros" | "cons";
  items: string[];
}

export default function ProsConsList({ type, items }: Props) {
  const isPros = type === "pros";
  const title = isPros ? "Pros" : "Cons";
  const iconBg = isPros ? "bg-[var(--color-success-surface)]" : "bg-[var(--color-danger-surface)]";
  const iconColor = isPros ? "text-[var(--color-success)]" : "text-[var(--color-danger)]";

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] p-6">
      <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4 flex items-center gap-2">
        <span className={`w-6 h-6 ${iconBg} ${iconColor} rounded-full flex items-center justify-center text-[12px]`}>
          {isPros ? "✓" : "✕"}
        </span>
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[14px] text-[var(--color-on-surface)]">
            <span className={`${iconColor} mt-0.5 shrink-0`}>
              {isPros ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
