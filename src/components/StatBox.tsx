interface Props {
  label: string;
  value: string | number;
  className?: string;
}

export default function StatBox({ label, value, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-xl border border-[var(--color-outline)] p-4 text-center ${className}`.trim()}>
      <p className="text-[12px] text-[var(--color-on-surface-variant)]">{label}</p>
      <p className="text-[16px] font-medium text-[var(--color-on-surface)] mt-1">{value}</p>
    </div>
  );
}
