import type { Metadata } from "next";
import { ShopListing, shopMetadata, type ShopSearchParams } from "@/components/Modules/Shop/ShopListing";
import { collections } from "@/config/collections";

// Wording and product selection for this page live in src/config/collections.ts
const config = collections["new-arrivals"];

type Props = { searchParams: ShopSearchParams };

export function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return shopMetadata(config, searchParams);
}

export default function Page({ searchParams }: Props) {
  return <ShopListing config={config} searchParams={searchParams} />;
}
