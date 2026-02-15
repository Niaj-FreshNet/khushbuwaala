"use client";

import dynamic from "next/dynamic";
import { ShopProductsSkeletonGrid } from "./ShopProductsSkeletonGrid";
import { LiveSkeleton } from "@/app/(StoreFront)/shop/_components/LiveSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ShopControlsSkeleton } from "./ShopControlsSkeleton";

const ShopProductsDynamic = dynamic(
  () => import("./ShopProducts").then((m) => m.ShopProducts),
  {
    // NOTE: This is still a Client Component; SSR here won’t “server-render the data”.
    // It only affects how Next loads the chunk. Your RTK Query fetch still happens client-side.
    ssr: true,
    loading: () => (
      <section className="container mx-auto py-8 px-4 relative space-y-6">
        <ShopControlsSkeleton />
        <ShopProductsSkeletonGrid />
      </section>
    ),
  }
);

export function ClientShopProducts(props: any) {
  return <ShopProductsDynamic {...props} />;
}
