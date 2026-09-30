import Link from "next/link";
import type { BusinessFxIndex } from "@/lib/business-fx-index";
export default function BusinessBenchmark({ index }: { index: BusinessFxIndex }) {
  const max = Math.max(index.bankAvgCostPct, index.specialistAvgCostPct, .01);
  return <aside className="business-benchmark" aria-label="Business transfer cost benchmark">
    <p className="business-eyebrow">The cost of moving money</p>
    <h2>Same payment size.<br />Different total costs.</h2>
    <p className="business-muted">Average measured cost for a ${index.amount.toLocaleString("en-US")} transfer</p>
    {[{ label: "Bank average", value: index.bankAvgCostPct }, { label: "Specialist average", value: index.specialistAvgCostPct }].map(({ label, value }) => <div className="business-benchmark-row" key={label}>
      <div><span>{label}</span><strong>{value.toFixed(2)}%</strong></div><div className="business-benchmark-track" aria-hidden="true"><span style={{ width: `${Math.max(0, value / max * 100)}%` }} /></div>
    </div>)}
    <p className="business-evidence">Across {index.corridorCount} tracked corridors · data <time dateTime={index.dataAsOf}>{index.dataAsOf}</time>. These averages are a benchmark, not your quote. <Link href="/business/compare#cost">See the data and method →</Link></p>
  </aside>;
}
