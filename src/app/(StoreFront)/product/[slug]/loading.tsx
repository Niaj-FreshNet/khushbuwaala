import React from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

function ShimmerGroup({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="animate-pulse"
      style={{ animationDelay: `${delay}ms`, animationDuration: "1400ms" }}
    >
      {children}
    </div>
  );
}

export default function ProductPageLoading() {
  return (
    <>
      {/* 1. Breadcrumbs Placeholder (Matching Breadcrumbs.tsx) */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded" variant="shimmer" />
            <Skeleton className="h-3.5 w-3.5 rounded" variant="shimmer" />
            <Skeleton className="h-4 w-28 rounded" variant="shimmer" />
            <Skeleton className="h-3.5 w-3.5 rounded" variant="shimmer" />
            <Skeleton className="h-4 w-36 rounded" variant="shimmer" />
          </div>
        </div>
      </div>

      <main className="bg-white">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-blue-50/20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-start">
              {/* Product Gallery Skeleton */}
              <div className="w-full order-1 flex justify-center">
                <div className="w-full max-w-[520px] lg:max-w-none lg:sticky lg:top-16 space-y-3">
                  <ShimmerGroup delay={0}>
                    {/* Exact square ratio matching ProductGallery */}
                    <div className="relative w-full aspect-square rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                      <Skeleton className="absolute inset-0" variant="shimmer" />

                      {/* Moving Shine Effect */}
                      <div className="absolute inset-0 opacity-40">
                        <div className="absolute -inset-x-40 -inset-y-20 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[kwshine_1.4s_linear_infinite]" />
                      </div>

                      {/* Subtle Spinner */}
                      <div className="relative z-10 w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-600 animate-spin" />
                    </div>
                  </ShimmerGroup>

                  {/* Thumbnail Row */}
                  <div className="flex gap-2.5 overflow-x-auto py-1 justify-center">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ShimmerGroup key={i} delay={80 * i}>
                        <Skeleton
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border border-gray-100"
                          variant="shimmer"
                        />
                      </ShimmerGroup>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Details Section Skeleton */}
              <div className="w-full order-2">
                <div className="lg:sticky lg:top-16 space-y-5">
                  {/* Category & Title */}
                  <ShimmerGroup delay={50}>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 rounded" variant="shimmer" />
                      <Skeleton className="h-8 sm:h-9 w-4/5 rounded-lg" variant="shimmer" />
                    </div>
                  </ShimmerGroup>

                  {/* Pricing & Badges */}
                  <ShimmerGroup delay={100}>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-32 rounded-lg" variant="shimmer" />
                      <Skeleton className="h-5 w-20 rounded line-through" variant="shimmer" />
                      <Skeleton className="h-6 w-16 rounded-md" variant="shimmer" />
                    </div>
                  </ShimmerGroup>

                  {/* Short Description Preview (2 lines + Read more) */}
                  <ShimmerGroup delay={150}>
                    <div className="space-y-2 pt-1">
                      <Skeleton className="h-4 w-full rounded" variant="shimmer" />
                      <Skeleton className="h-4 w-3/4 rounded" variant="shimmer" />
                    </div>
                  </ShimmerGroup>

                  {/* Size Variant Chips */}
                  <ShimmerGroup delay={200}>
                    <div className="space-y-2 pt-1">
                      <Skeleton className="h-4 w-24 rounded" variant="shimmer" />
                      <div className="flex flex-wrap gap-2.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-10 w-20 rounded-xl"
                            variant="shimmer"
                          />
                        ))}
                      </div>
                    </div>
                  </ShimmerGroup>

                  {/* Quantity & Order Action Buttons */}
                  <ShimmerGroup delay={250}>
                    <div className="space-y-3 pt-2" id="action-buttons">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-16 rounded" variant="shimmer" />
                        <Skeleton className="h-10 w-28 rounded-xl" variant="shimmer" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <Skeleton className="h-12 rounded-xl" variant="shimmer" />
                        <Skeleton className="h-12 rounded-xl" variant="shimmer" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <Skeleton className="h-10 rounded-xl" variant="shimmer" />
                        <Skeleton className="h-10 rounded-xl" variant="shimmer" />
                      </div>
                    </div>
                  </ShimmerGroup>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Product Information Accordion Section */}
        <section className="bg-white relative">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-6 w-36 rounded" variant="shimmer" />
            </div>

            {/* Top Quick Tab Pills */}
            <div className="p-1 rounded-2xl bg-gray-100/80 flex gap-1.5 border border-gray-200/60 max-w-full">
              <Skeleton className="h-8 flex-1 rounded-xl bg-white" variant="shimmer" />
              <Skeleton className="h-8 flex-1 rounded-xl bg-transparent" variant="shimmer" />
              <Skeleton className="h-8 flex-1 rounded-xl bg-transparent" variant="shimmer" />
            </div>

            {/* Open Accordion Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-8 h-8 rounded-lg" variant="shimmer" />
                  <Skeleton className="h-4 w-48 rounded" variant="shimmer" />
                </div>
                <Skeleton className="w-6 h-6 rounded-full" variant="shimmer" />
              </div>

              {/* Description Body */}
              <Skeleton className="h-16 w-full rounded-xl" variant="shimmer" />

              {/* Longevity & Projection Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Skeleton className="h-20 rounded-xl" variant="shimmer" />
                <Skeleton className="h-20 rounded-xl" variant="shimmer" />
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" variant="shimmer" />
                ))}
              </div>
            </div>

            {/* Closed Accordion Items */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-8 h-8 rounded-lg" variant="shimmer" />
                  <Skeleton className="h-4 w-40 rounded" variant="shimmer" />
                </div>
                <Skeleton className="w-6 h-6 rounded-full" variant="shimmer" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Related Products Section */}
        <section className="bg-linear-to-b from-gray-50 to-white relative">
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-4">
            <Skeleton className="h-6 w-44 rounded" variant="shimmer" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs space-y-2 p-2"
                >
                  <Skeleton className="aspect-square w-full rounded-xl" variant="shimmer" />
                  <Skeleton className="h-4 w-3/4 rounded" variant="shimmer" />
                  <Skeleton className="h-4 w-1/2 rounded" variant="shimmer" />
                  <Skeleton className="h-8 w-full rounded-lg" variant="shimmer" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Trust Signals Section (Matching Active Contact Box) */}
        <section>
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="rounded-2xl p-6 border border-blue-100 bg-blue-50/40 text-center space-y-3">
              <Skeleton className="h-5 w-44 mx-auto rounded" variant="shimmer" />
              <Skeleton className="h-4 w-72 mx-auto rounded" variant="shimmer" />
              <div className="flex justify-center gap-3 pt-2">
                <Skeleton className="h-9 w-28 rounded-xl" variant="shimmer" />
                <Skeleton className="h-9 w-32 rounded-xl" variant="shimmer" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}