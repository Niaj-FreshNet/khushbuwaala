import { Skeleton } from "@/components/ui/skeleton"

export default function StoreFrontLoading() {
  return (
    <div className="w-full mx-auto py-8 px-4">
      {/* Carousel Slider Skeleton */}
      <Skeleton className="w-full h-[400px] md:h-[660px] mb-12" />

      {/* Best Sellers Skeleton */}
      <div className="bg-gray-50 py-12">
        <Skeleton className="h-10 w-48 mx-auto mb-8" />
        <div className="flex space-x-4 overflow-hidden px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[calc(50%-1rem)] md:min-w-[calc(33%-1rem)] lg:min-w-[calc(25%-1rem)] p-2">
              <Skeleton className="w-full h-64 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Category Banner Skeleton */}
      <div className="py-12 px-4">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-full h-48 md:h-64 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Banner Section Skeleton */}
      <Skeleton className="w-full h-[300px] md:h-[480px] my-8" />

      {/* Product Carousel Section Skeleton (repeated for inspired, oriental, oud) */}
      <div className="bg-gray-50 py-12">
        <Skeleton className="h-10 w-48 mx-auto mb-8" />
        <div className="flex space-x-4 overflow-hidden px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[calc(50%-1rem)] md:min-w-[calc(33%-1rem)] lg:min-w-[calc(25%-1rem)] p-2">
              <Skeleton className="w-full h-64 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Services Section Skeleton */}
      <div className="py-12 px-4 bg-gray-50">
        <Skeleton className="h-10 w-36 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start p-4 bg-white rounded-lg shadow-sm">
              <Skeleton className="h-8 w-8 rounded-full mr-4" />
              <div>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="py-12 px-4 text-center">
        <Skeleton className="h-10 w-36 mx-auto mb-8" />
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-screen-lg">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Subscribe Section Skeleton */}
      <div className="py-12 px-4">
        <Skeleton className="h-10 w-52 mx-auto mb-8" />
        <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
        <div className="flex justify-center max-w-lg mx-auto gap-3">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-24" />
        </div>
      </div>
    </div>
  )
}
