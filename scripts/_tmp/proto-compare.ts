import { providers } from "@/data/providers";
import { generateComparisonContent, usesMidMarketRate } from "@/lib/comparison-content";
for (const p of providers) console.log(p.slug.padEnd(18), "mid?", String(usesMidMarketRate(p)).padEnd(5), "| fee:", p.feeStructure, "| markup:", p.exchangeRateMarkup);
const by = (s:string)=>providers.find(p=>p.slug===s)!;
for (const [a,b] of [["wise","remitly"],["remitly","xe"],["wise","western-union"]]) {
  const c = generateComparisonContent(by(a), by(b));
  console.log(`\n=== ${a} vs ${b}`); console.log("COST:", c.verdict.costExplanation); console.log("OVERALL:", c.verdict.overallSummary);
  console.log("WHEN A:", c.whenToUseA); console.log("WHEN B:", c.whenToUseB);
}
