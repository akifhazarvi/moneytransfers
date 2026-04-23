import { Check, X } from "lucide-react";

interface Props {
  type: "pros" | "cons";
  items: string[];
}

export default function ProsConsList({ type, items }: Props) {
  const isPros = type === "pros";
  const Icon = isPros ? Check : X;

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
      <h3 className={`text-base font-semibold ${titleColor} mb-4 flex items-center gap-2`}>
        <span className={`w-6 h-6 ${iconBg} rounded-full flex items-center justify-center shrink-0`}>
          <Icon className="w-3.5 h-3.5" strokeWidth={3} />
        </span>
        {isPros ? "Pros" : "Cons"}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-on-surface)]">
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} strokeWidth={2.5} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
