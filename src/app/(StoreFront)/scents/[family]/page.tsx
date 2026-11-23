import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopListing, shopMetadata, type ShopSearchParams } from "@/components/Modules/Shop/ShopListing";
import { FAMILY_PAGES, familyPageConfig } from "@/config/scentPages";

// One page per scent family, e.g. /scents/woody. Wording lives in src/config/scentPages.ts
type Props = { params: Promise<{ family: string }>; searchParams: ShopSearchParams };

export function generateStaticParams() {
  return Object.keys(FAMILY_PAGES).map((family) => ({ family }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const config = familyPageConfig((await params).family);
  if (!config) return { title: "Not found", robots: { index: false, follow: true } };
  return shopMetadata(config, searchParams);
}

export default async function Page({ params, searchParams }: Props) {
  const config = familyPageConfig((await params).family);
  if (!config) notFound();
  return <ShopListing config={config} searchParams={searchParams} />;
}
