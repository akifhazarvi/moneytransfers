import { quotesByCorridor, providerNames, type NormalizedQuote } from "@/lib/unified-quotes";
import wc from "@/data/scraped/wise-comparison-quotes.json";
const bankSlugs = new Set((wc as {providerSlug:string;providerType:string}[]).filter(q=>q.providerType==="bank").map(q=>q.providerSlug));
// per quote: cost% = (midReceive - receive)/midReceive
type Row = { slug:string; name:string; costs:number[]; markups:number[]; feePcts:number[]; corridors:Set<string> };
const rows = new Map<string,Row>();
let used=0, dropped=0;
for (const [ck, qs] of Object.entries(quotesByCorridor)) {
  for (const q of qs as NormalizedQuote[]) {
    if (!q.midMarketRate || q.sendAmount<=0) { dropped++; continue; }
    const midRecv = q.sendAmount*q.midMarketRate;
    const cost = (midRecv - q.receiveAmount)/midRecv*100;
    if (!isFinite(cost) || cost < -2 || cost >= 40) { dropped++; continue; }
    used++;
    const r = rows.get(q.providerSlug) ?? { slug:q.providerSlug, name:providerNames[q.providerSlug]??q.providerSlug, costs:[], markups:[], feePcts:[], corridors:new Set() };
    r.costs.push(cost); r.markups.push(q.markup); r.feePcts.push(q.fee/q.sendAmount*100); r.corridors.add(ck);
    rows.set(q.providerSlug, r);
  }
}
const mean = (x:number[]) => x.reduce((a,b)=>a+b,0)/x.length;
const out = [...rows.values()].filter(r=>r.corridors.size>=5).map(r=>({slug:r.slug, name:r.name, type: bankSlugs.has(r.slug)?"bank":"specialist", corridors:r.corridors.size, n:r.costs.length, costPer1000:+(mean(r.costs)*10).toFixed(2), markup:+mean(r.markups).toFixed(2), feePct:+mean(r.feePcts).toFixed(2)})).sort((a,b)=>a.costPer1000-b.costPer1000);
console.log("used",used,"dropped",dropped,"providers>=5corr",out.length,"banks",out.filter(o=>o.type==="bank").length);
console.table(out.slice(0,25));
console.log("banks:"); console.table(out.filter(o=>o.type==="bank").slice(0,10));
const sp=out.filter(o=>o.type==="specialist"), bk=out.filter(o=>o.type==="bank");
console.log("avg specialist $", mean(sp.map(o=>o.costPer1000)).toFixed(2), "avg bank $", mean(bk.map(o=>o.costPer1000)).toFixed(2));
console.log("unknown-type slugs among banks set missing:", out.filter(o=>o.type!=="bank").map(o=>o.slug).join(","));
