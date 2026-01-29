import { Skeleton } from "@/components/ui/skeleton";
import { LiveSkeleton } from "./_components/LiveSkeleton";

export default function ShopLoading() {
  return (
    <div className="w-full mx-auto">
      {/* Banner */}
      <div className="relative w-full h-[250px] md:h-[360px] mt-16 mb-8 overflow-hidden">
        <LiveSkeleton delayMs={0} speedMs={1600} className="h-full">
          <Skeleton className="w-full h-full" />
        </LiveSkeleton>

        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-4 sm:px-6 lg:px-10 pb-6">
            <div className="max-w-2xl space-y-3">
              <LiveSkeleton delayMs={80} speedMs={1400}>
                <Skeleton className="h-10 w-64 md:w-96 rounded-lg" />
              </LiveSkeleton>

              <LiveSkeleton delayMs={160} speedMs={1500}>
                <Skeleton className="h-5 w-72 md:w-[520px] rounded-lg" />
              </LiveSkeleton>

              <div className="flex gap-3 pt-2">
                <LiveSkeleton delayMs={220} speedMs={1350}>
                  <Skeleton className="h-10 w-28 rounded-full" />
                </LiveSkeleton>
                <LiveSkeleton delayMs={280} speedMs={1450}>
                  <Skeleton className="h-10 w-36 rounded-full" />
                </LiveSkeleton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Bar */}
      <div className="py-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <LiveSkeleton delayMs={120} speedMs={1400}>
            <Skeleton className="h-8 w-72 mx-auto rounded-lg" />
          </LiveSkeleton>

          <LiveSkeleton delayMs={200} speedMs={1550}>
            <Skeleton className="h-5 w-[340px] sm:w-[520px] mx-auto rounded-lg" />
          </LiveSkeleton>

          <div className="flex justify-center gap-2 pt-1">
            {[0, 1, 2].map((i) => (
              <LiveSkeleton
                key={i}
                delayMs={220 + i * 80}
                speedMs={1350 + i * 120}
              >
                <Skeleton
                  className={`h-7 rounded-full ${
                    i === 0 ? "w-20" : i === 1 ? "w-24" : "w-28"
                  }`}
                />
              </LiveSkeleton>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="container mx-auto py-8 px-4 space-y-6">
        {/* Controls */}
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

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="relative">
                <LiveSkeleton
                  delayMs={80 + i * 30}
                  speedMs={1450 + (i % 3) * 120}
                >
                  <Skeleton className="w-full h-60 sm:h-64" />
                </LiveSkeleton>

                <div className="absolute top-3 left-3">
                  <LiveSkeleton delayMs={140 + i * 25} speedMs={1400}>
                    <Skeleton className="h-7 w-16 rounded-full" />
                  </LiveSkeleton>
                </div>

                <div className="absolute top-3 right-3">
                  <LiveSkeleton delayMs={160 + i * 25} speedMs={1500}>
                    <Skeleton className="h-9 w-9 rounded-full" />
                  </LiveSkeleton>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <LiveSkeleton delayMs={120 + i * 20} speedMs={1450}>
                  <Skeleton className="h-5 w-5/6 rounded" />
                </LiveSkeleton>

                <LiveSkeleton delayMs={160 + i * 20} speedMs={1550}>
                  <Skeleton className="h-4 w-2/3 rounded" />
                </LiveSkeleton>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <LiveSkeleton
                        key={j}
                        delayMs={180 + j * 40 + i * 8}
                        speedMs={1350}
                      >
                        <Skeleton className="h-4 w-4 rounded" />
                      </LiveSkeleton>
                    ))}
                  </div>

                  <LiveSkeleton delayMs={200 + i * 10} speedMs={1500}>
                    <Skeleton className="h-4 w-10 rounded" />
                  </LiveSkeleton>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <LiveSkeleton delayMs={220 + i * 10} speedMs={1400}>
                    <Skeleton className="h-6 w-20 rounded" />
                  </LiveSkeleton>
                  <LiveSkeleton delayMs={260 + i * 10} speedMs={1550}>
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </LiveSkeleton>
                </div>

                <div className="flex gap-2 pt-2">
                  <LiveSkeleton delayMs={240 + i * 10} speedMs={1500}>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </LiveSkeleton>
                  <LiveSkeleton delayMs={280 + i * 10} speedMs={1450}>
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                  </LiveSkeleton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8 space-y-4">
          <LiveSkeleton delayMs={140} speedMs={1500}>
            <Skeleton className="h-5 w-72 mx-auto rounded" />
          </LiveSkeleton>
          <LiveSkeleton delayMs={200} speedMs={1600}>
            <Skeleton className="h-12 w-44 mx-auto rounded-full" />
          </LiveSkeleton>
        </div>
      </section>
    </div>
  );
}
