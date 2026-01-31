import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StoreContainer from "@/components/Layout/StoreContainer";

export default function Loading() {
  return (
    <StoreContainer>
      <div className="min-h-screen bg-gray-50 pt-2 pb-6">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="rounded-2xl border border-gray-200 p-5 bg-white">
              <Skeleton className="h-8 w-36 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* ✅ Match page layout: lg 3 cols (left span 2, right 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left column skeleton */}
            <div className="space-y-6 lg:col-span-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-10 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ))}
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>

            {/* Right column skeleton */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-16 h-20 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}

                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreContainer>
  );
}
