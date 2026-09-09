import ProviderCrossSell from "@/components/ProviderCrossSell";

interface Props {
  slug: string;
  from?: string;
  to?: string;
  amount?: number;
  business?: boolean;
  exclude?: string;
}

export default function GuideSidebarCTA({ slug, from, to, amount, business, exclude }: Props) {
  return <ProviderCrossSell
    source={`guide:${slug}`} placement="sidebar"
    intent={business ? "business" : "personal"}
    context={from && to && amount ? { from, to, amount } : undefined}
    exclude={exclude}
  />;
}
