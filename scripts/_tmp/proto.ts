import { generateQuotes } from "@/lib/quotes-engine";
import { quotesByCorridorAmount, quoteDataDate, getMidMarketRate } from "@/lib/unified-quotes";
const show = (from:string,to:string,amt:number)=>{
  const qs = generateQuotes(amt, from, to);
  console.log(`\n${from}->${to} @${amt} (${qs.length} providers) date=${quoteDataDate}`);
  for (const s of ["wise","remitly","xoom","instarem","chase","western-union","wells-fargo","hsbc","barclays"]) {
    const q = qs.find(x=>x.providerSlug===s); if(!q){console.log("  ",s,"MISSING");continue;}
    const mid = getMidMarketRate(from,to); const mk = (1-q.exchangeRate/mid)*100;
    console.log("  ",s.padEnd(14), "recv",q.receiveAmount.toFixed(2).padStart(12),"fee",q.fee.toFixed(2).padStart(7),"markup%",mk.toFixed(2), q.isIndicative?"INDICATIVE":"");
  }
};
show("USD","INR",1000); show("GBP","EUR",1000); show("GBP","INR",1000);
const amts = new Map<number,number>();
for (const k of Object.keys(quotesByCorridorAmount)) { const a = Number(k.split("_")[2]); amts.set(a,(amts.get(a)||0)+quotesByCorridorAmount[k].length); }
console.log("\nsendAmount distribution:", [...amts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8));
