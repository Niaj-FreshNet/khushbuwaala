import React from "react";
import { Skeleton, SkeletonText, SkeletonAvatar } from "@/components/ui/skeleton";

export default function ProductPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs Skeleton */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Main Product Section Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 p-6 lg:p-12">
            {/* Product Gallery Skeleton */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-200">
                <Skeleton className="w-full h-full" variant="shimmer" />
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 rounded-lg" variant="shimmer" />
                ))}
              </div>
            </div>

            {/* Product Details Skeleton */}
            <div className="space-y-8">
              {/* Product Title */}
              <div className="space-y-4">
                <Skeleton className="h-10 w-4/5" variant="shimmer" />
                <Skeleton className="h-6 w-3/5" variant="shimmer" />
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-32" variant="shimmer" />
                  <Skeleton className="h-6 w-20 rounded-full" variant="shimmer" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <SkeletonText lines={3} variant="shimmer" />
              </div>

              {/* Size Options */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-16" variant="shimmer" />
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-16 rounded-lg" variant="shimmer" />
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-20" variant="shimmer" />
                  <Skeleton className="h-12 w-32 rounded-xl" variant="shimmer" />
                </div>
                
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-40 rounded-lg" variant="shimmer" />
                  <Skeleton className="h-12 w-32 rounded-lg" variant="shimmer" />
                </div>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <Skeleton className="h-8 w-8 rounded-full mx-auto" variant="shimmer" />
                    <Skeleton className="h-4 w-16 mx-auto" variant="shimmer" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-6 lg:p-8">
            {/* Tab Headers */}
            <div className="flex space-x-6 border-b mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-24" variant="shimmer" />
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="space-y-4">
              <SkeletonText lines={4} variant="shimmer" />
              
              {/* Reviews Skeleton */}
              <div className="space-y-4 mt-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                    <SkeletonAvatar size="md" variant="shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" variant="shimmer" />
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Skeleton key={j} className="h-4 w-4 rounded" variant="shimmer" />
                          ))}
                        </div>
                      </div>
                      <SkeletonText lines={2} variant="shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="space-y-8">
          <Skeleton className="h-8 w-48" variant="shimmer" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="aspect-[3/4] w-full" variant="shimmer" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-full" variant="shimmer" />
                  <Skeleton className="h-4 w-3/4" variant="shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
