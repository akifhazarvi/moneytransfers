interface Props {
  type: "pros" | "cons";
  items: string[];
}

export default function ProsConsList({ type, items }: Props) {
  const isPros = type === "pros";

  const wrapperCls = isPros
    ? "bg-[var(--color-success-surface)] border border-[var(--color-success-surface-dim)]"
    : "bg-[var(--color-danger-surface)] border border-[var(--color-danger-surface)]";

  const iconBg = isPros
    ? "bg-[var(--color-success)] text-white"
    : "bg-[var(--color-danger)] text-white";

  const titleColor = isPros
    ? "text-[var(--color-success-dark)]"
    : "text-[var(--color-danger)]";

  const iconColor = isPros ? "text-[var(--color-success-dark)]" : "text-[var(--color-danger)]";

  return (
    <div className={`rounded-2xl p-5 ${wrapperCls}`}>
      <h3 className={`text-md font-semibold ${titleColor} mb-4 flex items-center gap-2`}>
        <span className={`w-6 h-6 ${iconBg} rounded-full flex items-center justify-center text-2xs font-bold shrink-0`}>
          {isPros ? "✓" : "✕"}
        </span>
        {isPros ? "Pros" : "Cons"}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-on-surface)]">
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
