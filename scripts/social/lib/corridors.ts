// Daily rotation: 10 corridors across 2 weeks, Mon-Fri.
// Index by day-of-year so rotation is deterministic and self-recovers if we skip a day.

export interface Corridor {
  from: string;
  to: string;
  amount: number;
  fromFlag: string;
  toFlag: string;
  fromName: string;
  toName: string;
  slug: string;
}

export const CORRIDORS: Corridor[] = [
  { from: "USD", to: "INR", amount: 1000, fromFlag: "🇺🇸", toFlag: "🇮🇳", fromName: "US", toName: "India", slug: "usa-to-india" },
  { from: "GBP", to: "INR", amount: 1000, fromFlag: "🇬🇧", toFlag: "🇮🇳", fromName: "UK", toName: "India", slug: "uk-to-india" },
  { from: "USD", to: "PHP", amount: 1000, fromFlag: "🇺🇸", toFlag: "🇵🇭", fromName: "US", toName: "Philippines", slug: "usa-to-philippines" },
  { from: "USD", to: "MXN", amount: 1000, fromFlag: "🇺🇸", toFlag: "🇲🇽", fromName: "US", toName: "Mexico", slug: "usa-to-mexico" },
  { from: "GBP", to: "PHP", amount: 1000, fromFlag: "🇬🇧", toFlag: "🇵🇭", fromName: "UK", toName: "Philippines", slug: "uk-to-philippines" },
  { from: "EUR", to: "INR", amount: 1000, fromFlag: "🇪🇺", toFlag: "🇮🇳", fromName: "EU", toName: "India", slug: "eu-to-india" },
  { from: "CAD", to: "INR", amount: 1000, fromFlag: "🇨🇦", toFlag: "🇮🇳", fromName: "Canada", toName: "India", slug: "canada-to-india" },
  { from: "AUD", to: "INR", amount: 1000, fromFlag: "🇦🇺", toFlag: "🇮🇳", fromName: "Australia", toName: "India", slug: "australia-to-india" },
  { from: "USD", to: "NGN", amount: 1000, fromFlag: "🇺🇸", toFlag: "🇳🇬", fromName: "US", toName: "Nigeria", slug: "usa-to-nigeria" },
  { from: "GBP", to: "NGN", amount: 1000, fromFlag: "🇬🇧", toFlag: "🇳🇬", fromName: "UK", toName: "Nigeria", slug: "uk-to-nigeria" },
];

export function pickCorridorForDate(date: Date = new Date()): Corridor {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return CORRIDORS[dayOfYear % CORRIDORS.length];
}
