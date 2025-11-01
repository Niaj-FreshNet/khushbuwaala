import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrdersLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-32 mb-8" />

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="flex gap-4 items-center pb-4 border-b last:border-0 last:pb-0">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}