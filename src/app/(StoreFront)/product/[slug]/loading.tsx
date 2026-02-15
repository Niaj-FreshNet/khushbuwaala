// app/product/[slug]/loading.tsx
import React from "react"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

function ShimmerGroup({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div
      className="animate-pulse"
      style={{ animationDelay: `${delay}ms`, animationDuration: "1400ms" }}
    >
      {children}
    </div>
  )
}

export default function ProductPageLoading() {
  return (
    <>
      {/* Breadcrumbs (match real page) */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10 rounded" variant="shimmer" />
            <Skeleton className="h-4 w-4 rounded" variant="shimmer" />
            <Skeleton className="h-4 w-24 rounded" variant="shimmer" />
            <Skeleton className="h-4 w-4 rounded" variant="shimmer" />
            <Skeleton className="h-4 w-40 rounded" variant="shimmer" />
          </div>
        </div>
      </div>

      <main className="bg-white pb-[var(--kw-bottom-bar-h,0px)]">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-blue-50/20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-start">
              {/* Gallery Skeleton (MATCHES ProductGallery height) */}
              <div className="w-full order-1 flex justify-center">
                <div className="w-full max-w-[520px] lg:max-w-none lg:sticky lg:top-16 space-y-3">
                  <ShimmerGroup delay={0}>
                    <div
                      className="
                        relative overflow-hidden rounded-xl
                        bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20
                        shadow-lg border border-blue-100/50 backdrop-blur-sm
                        aspect-square sm:aspect-[4/5]
                        min-h-[320px] sm:min-h-[500px]
                      "
                    >
                      {/* Base skeleton */}
                      <Skeleton className="absolute inset-0" variant="shimmer" />

                      {/* Soft moving shine (requires @keyframes kwshine in globals.css) */}
                      <div className="absolute inset-0 opacity-60">
                        <div
                          className="
                            absolute -inset-x-40 -inset-y-20 rotate-12
                            bg-gradient-to-r from-transparent via-white/40 to-transparent
                            animate-[kwshine_1.4s_linear_infinite]
                          "
                        />
                      </div>

                      {/* Premium spinner overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 blur-2xl opacity-40 scale-150 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-white/40 border-t-transparent animate-spin" />
                          <div className="absolute inset-2 rounded-full border-2 border-white/25 border-b-transparent animate-[spin_900ms_linear_infinite]" />

                          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs font-medium text-gray-600">
                            <span className="opacity-80">Loading</span>
                            <span className="inline-flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500/70 animate-bounce [animation-delay:0ms]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500/70 animate-bounce [animation-delay:150ms]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500/70 animate-bounce [animation-delay:300ms]" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* subtle ping dots */}
                      <div className="absolute top-1/4 right-1/5 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-50" />
                      <div
                        className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40"
                        style={{ animationDelay: "1s" }}
                      />
                    </div>
                  </ShimmerGroup>

                  {/* Thumbnail skeletons */}
                  <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ShimmerGroup key={i} delay={80 * i}>
                        <Skeleton className="w-16 h-16 rounded-lg" variant="shimmer" />
                      </ShimmerGroup>
                    ))}
                  </div>

                  {/* small chips */}
                  <div className="flex gap-2 pt-1">
                    <ShimmerGroup delay={160}>
                      <Skeleton className="h-9 w-24 rounded-xl" variant="shimmer" />
                    </ShimmerGroup>
                    <ShimmerGroup delay={240}>
                      <Skeleton className="h-9 w-24 rounded-xl" variant="shimmer" />
                    </ShimmerGroup>
                    <ShimmerGroup delay={320}>
                      <Skeleton className="h-9 w-24 rounded-xl" variant="shimmer" />
                    </ShimmerGroup>
                  </div>
                </div>
              </div>

              {/* Details Skeleton */}
              <div className="w-full order-2">
                <div className="lg:sticky lg:top-16 space-y-6">
                  <ShimmerGroup delay={50}>
                    <div className="space-y-3">
                      <Skeleton className="h-9 w-4/5" variant="shimmer" />
                      <Skeleton className="h-5 w-3/5" variant="shimmer" />
                    </div>
                  </ShimmerGroup>

                  <ShimmerGroup delay={120}>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-36" variant="shimmer" />
                      <Skeleton className="h-6 w-20 rounded-full" variant="shimmer" />
                    </div>
                  </ShimmerGroup>

                  <ShimmerGroup delay={180}>
                    <div className="space-y-2">
                      <SkeletonText lines={3} variant="shimmer" />
                    </div>
                  </ShimmerGroup>

                  <ShimmerGroup delay={240}>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-20" variant="shimmer" />
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-10 w-16 rounded-lg"
                            variant="shimmer"
                          />
                        ))}
                      </div>
                    </div>
                  </ShimmerGroup>

                  <ShimmerGroup delay={300}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-20" variant="shimmer" />
                        <Skeleton className="h-11 w-36 rounded-xl" variant="shimmer" />
                      </div>
                      <div className="flex gap-3">
                        <Skeleton className="h-12 flex-1 rounded-xl" variant="shimmer" />
                        <Skeleton className="h-12 w-14 rounded-xl" variant="shimmer" />
                      </div>
                    </div>
                  </ShimmerGroup>

                  <ShimmerGroup delay={360}>
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="text-center space-y-2">
                          <Skeleton
                            className="h-8 w-8 rounded-full mx-auto"
                            variant="shimmer"
                          />
                          <Skeleton className="h-3 w-16 mx-auto" variant="shimmer" />
                        </div>
                      ))}
                    </div>
                  </ShimmerGroup>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Information Section */}
        <section className="bg-white relative">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg" variant="shimmer" />
              <Skeleton className="h-6 w-44" variant="shimmer" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <ShimmerGroup key={i} delay={80 * i}>
                  <div className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-5 w-56" variant="shimmer" />
                      <Skeleton className="h-6 w-6 rounded" variant="shimmer" />
                    </div>
                    <div className="pt-3">
                      <SkeletonText lines={2} variant="shimmer" />
                    </div>
                  </div>
                </ShimmerGroup>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="bg-gradient-to-b from-gray-50 to-white relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6 space-y-4">
            <ShimmerGroup delay={80}>
              <Skeleton className="h-7 w-52" variant="shimmer" />
            </ShimmerGroup>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ShimmerGroup key={i} delay={120 * i}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <Skeleton className="aspect-[3/4] w-full" variant="shimmer" />
                    <div className="p-3 sm:p-4 space-y-2">
                      <Skeleton className="h-4 w-full" variant="shimmer" />
                      <Skeleton className="h-4 w-3/4" variant="shimmer" />
                      <Skeleton className="h-8 w-28 rounded-lg" variant="shimmer" />
                    </div>
                  </div>
                </ShimmerGroup>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="relative bg-gradient-to-r from-slate-50 via-blue-50/50 to-indigo-50/30">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">
            <div className="text-center mb-6 sm:mb-8 space-y-3">
              <Skeleton className="h-8 w-72 mx-auto" variant="shimmer" />
              <Skeleton className="h-4 w-[min(680px,90%)] mx-auto" variant="shimmer" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <ShimmerGroup key={i} delay={140 * i}>
                  <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm p-5 text-center space-y-3">
                    <Skeleton className="h-10 w-10 rounded-xl mx-auto" variant="shimmer" />
                    <Skeleton className="h-5 w-40 mx-auto" variant="shimmer" />
                    <SkeletonText lines={2} variant="shimmer" />
                  </div>
                </ShimmerGroup>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom bar placeholder */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 flex-1 rounded-xl" variant="shimmer" />
              <Skeleton className="h-10 w-12 rounded-xl" variant="shimmer" />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
