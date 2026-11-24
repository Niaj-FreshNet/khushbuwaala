import { Skeleton } from "@/components/ui/skeleton";

// The loading placeholder for the shop and every collection page. It is drawn with the same
// boxes as the real page (ShopListing + ShopView + ProductCard), so nothing jumps when the
// products arrive: title and intro, the filter/search bar, the filter column on computers, and
// cards with a square photo, name, price, two labels, Buy Now and the cart button.
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white sm:rounded-2xl">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col items-center px-2 pt-2">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="mt-1.5 h-4 w-1/3 rounded-md" />
        <div className="mt-1.5 flex gap-1">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 p-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-9 shrink-0 rounded-lg min-[360px]:w-10" />
      </div>
    </div>
  );
}

export function ShopListingSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading perfumes">
      <header className="container mx-auto px-3 pb-3 pt-4 sm:px-4 sm:pt-6">
        <Skeleton className="h-8 w-56 rounded-md sm:h-9 sm:w-72" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl rounded-md" />
        <Skeleton className="mt-1.5 h-4 w-2/3 max-w-md rounded-md" />
      </header>

      <div className="container mx-auto px-3 sm:px-4">
        {/* Filters + search, then count + sort */}
        <div className="-mx-3 border-b border-stone-200 bg-white px-3 py-2 sm:-mx-4 sm:px-4 lg:mx-0 lg:border-0 lg:px-0 lg:pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 shrink-0 rounded-full lg:hidden" />
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="hidden h-10 w-40 shrink-0 rounded-full lg:block" />
          </div>
          <div className="mt-2 flex items-center justify-between lg:hidden">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>
        </div>

        <div className="mt-3 flex gap-6">
          <aside className="hidden w-64 shrink-0 lg:block">
            <Skeleton className="h-[520px] w-full rounded-2xl" />
          </aside>
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
