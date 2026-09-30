import Image from "next/image";
import { providerLogo } from "@/lib/provider-logo";

export default function BusinessProviderLogo({ slug, compact = false }: { slug: string; compact?: boolean }) {
  return <span className={`business-provider-logo${compact ? " business-provider-logo--compact" : ""}`}><Image src={providerLogo(slug)} alt="" width={40} height={40} /></span>;
}
