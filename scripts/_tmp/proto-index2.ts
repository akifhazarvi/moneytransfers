import { REMITTANCE_INDEX as I } from "@/lib/remittance-cost-index";
console.log("asOf", I.dataAsOf, "corridors", I.corridorCount, "priced", I.providersPriced, "ranked", I.providers.length, "sp", I.specialists.length, "bk", I.banks.length);
console.log("avg sp $", I.avgSpecialistCost, "avg bk $", I.avgBankCost);
console.table(I.specialists.slice(0,15).map(r=>({n:r.name,c:r.corridors,q:r.quotes,cost:r.costPerAmount,mk:r.avgMarkupPct,fee:r.avgFeePct})));
console.table(I.banks.slice(0,12).map(r=>({n:r.name,c:r.corridors,q:r.quotes,cost:r.costPerAmount,mk:r.avgMarkupPct,fee:r.avgFeePct})));
