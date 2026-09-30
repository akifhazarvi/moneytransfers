export const BUSINESS_JOURNEYS = [
  { slug: "small-business", title: "Everyday business payments", description: "Compare the costs and tools for regular international payments.", workflow: "everyday", needs: ["multiCurrencyAccount", "accounting"] },
  { slug: "vendor-payments", title: "Pay overseas suppliers", description: "Match invoice currencies, approval steps and payment deadlines.", workflow: "suppliers", needs: ["approvals", "multiCurrencyAccount"] },
  { slug: "bulk-payments", title: "Pay a team or many recipients", description: "Explore batch payments, permissions and payout automation.", workflow: "teams", needs: ["bulkPayments", "multiUser"] },
  { slug: "b2b-transfers", title: "Plan larger business transfers", description: "Compare account support and tools for future FX payments.", workflow: "planning", needs: ["dedicatedDealer", "forwardContracts"] },
] as const;
export function businessJourney(slug: string) { return BUSINESS_JOURNEYS.find(j => j.slug === slug); }
