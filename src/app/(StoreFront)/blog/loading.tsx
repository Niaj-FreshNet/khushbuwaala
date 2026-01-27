import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletonArray = Array.from({ length: 6 });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonArray.map((_, idx) => (
          <Card key={idx} className="rounded-2xl overflow-hidden border border-orange-100">
            <div className="w-full h-56">
              <Skeleton className="w-full h-full" />
            </div>
            <CardHeader className="space-y-2 px-4 pt-4">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-3 w-1/3 mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
