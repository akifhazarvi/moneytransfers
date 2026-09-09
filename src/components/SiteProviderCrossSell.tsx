"use client";

import { usePathname } from "next/navigation";
import ProviderCrossSellCards from "@/components/ProviderCrossSellCards";
import { selectCrossSellPartners, siteCrossSellConfig } from "@/lib/provider-cross-sell";

export default function SiteProviderCrossSell() {
  const pathname = usePathname();
  const config = siteCrossSellConfig(pathname);
  if (!config) return null;
  return (
    <div className="site-provider-cross-sell">
      <ProviderCrossSellCards key={pathname} {...config} placement="page-end" partners={selectCrossSellPartners(config)} />
    </div>
  );
}
