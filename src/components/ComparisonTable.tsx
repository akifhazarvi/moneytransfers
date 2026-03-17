import { type ReactNode } from "react";

interface Props {
  headers: string[];
  children: ReactNode;
}

export default function ComparisonTable({ headers, children }: Props) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-medium text-[var(--color-on-surface-variant)]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-outline)]">
          {children}
        </tbody>
      </table>
    </div>
  );
}
