"use client";

import dynamic from "next/dynamic";
import { ShopProductsSkeletonGrid } from "./ShopProductsSkeletonGrid";
import { LiveSkeleton } from "@/app/(StoreFront)/shop/_components/LiveSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ShopProductsDynamic = dynamic(
  () => import("./ShopProducts").then((m) => m.ShopProducts),
  {
    // NOTE: This is still a Client Component; SSR here won’t “server-render the data”.
    // It only affects how Next loads the chunk. Your RTK Query fetch still happens client-side.
    ssr: true,
    loading: () => (
      <section className="container mx-auto py-8 px-4 relative space-y-6">
        {/* optional: skeleton for the sticky controls too */}
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center bg-white py-3 px-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <LiveSkeleton delayMs={120} speedMs={1400}>
              <Skeleton className="h-9 w-24 rounded-full" />
            </LiveSkeleton>
            <LiveSkeleton delayMs={200} speedMs={1500}>
              <Skeleton className="h-9 w-16 rounded-full" />
            </LiveSkeleton>
          </div>

          <div className="flex-1 md:max-w-md">
            <LiveSkeleton delayMs={160} speedMs={1450}>
              <Skeleton className="h-10 w-full rounded-xl" />
            </LiveSkeleton>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <LiveSkeleton delayMs={220} speedMs={1550}>
              <Skeleton className="h-10 w-28 rounded-xl" />
            </LiveSkeleton>

            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={i >= 2 ? "hidden md:block" : ""}>
                  <LiveSkeleton
                    delayMs={200 + i * 70}
                    speedMs={1350 + i * 100}
                  >
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </LiveSkeleton>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ShopProductsSkeletonGrid />
      </section>
    ),
  }
);

export function ClientShopProducts(props: any) {
  return <ShopProductsDynamic {...props} />;
}
