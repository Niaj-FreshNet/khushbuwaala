import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "@/components/Modules/Shop/ShopListingSkeleton"

// The placeholder shown for a moment while the home page loads. It follows the real page section
// by section (see page.tsx), with the same widths, grids and heights, so nothing jumps when the
// content arrives. When a section of the home page changes, change its twin here.
//
//   banner → first product row → "Not sure which perfume?" box → categories →
//   the other product rows → brand story → "Why choose us" cards → customer reviews

// The page width every home section uses (same string as in the sections themselves).
const WIDTH = "mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] px-3 sm:px-4 lg:px-6 2xl:px-8"

export default function HomeLoading() {
  return (
    <div className="w-full mx-auto" aria-busy="true" aria-label="Loading the home page">
      {/* Banner: square on phones, wide and short on computers (see heroBoxShape) */}
      <section className="w-full overflow-hidden relative mt-1 sm:mt-2 mb-2 sm:mb-4">
        <div className="mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] md:px-4 lg:px-6 2xl:px-8">
          <Skeleton className="w-full aspect-square md:aspect-[2.9] rounded-none md:rounded-2xl" />
        </div>
      </section>

      <ProductRowSkeleton />

      {/* "Not sure which perfume? Start with what you like." */}
      <section className={`${WIDTH} mb-8 sm:mb-10`}>
        <div className="h-[730px] min-[400px]:h-[600px] sm:h-[504px] md:h-[404px] xl:h-[312px] overflow-hidden rounded-3xl border border-stone-200 bg-stone-50/70 px-4 py-5 sm:px-8 sm:py-7">
          <Skeleton className="h-7 w-11/12 max-w-md rounded-md sm:h-8" />
          <Skeleton className="mt-2 h-4 w-full max-w-2xl rounded-md" />
          <Skeleton className="mt-1.5 h-4 w-2/3 max-w-xl rounded-md" />
          <div className="mt-5 grid gap-4 md:grid-cols-3 md:gap-6">
            {[0, 1, 2].map((group) => (
              <div key={group}>
                <Skeleton className="h-4 w-32 rounded-md" />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["w-28", "w-20", "w-20", "w-24", "w-32", "w-28"].map((width, i) => (
                    <Skeleton key={i} className={`h-10 ${width} rounded-full`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Categories: six pictures edge to edge, two per row on phones */}
      <section className={`${WIDTH} mb-8 sm:mb-10 lg:mb-12`}>
        <TitleSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-none border border-white sm:h-56 md:h-60 lg:h-64" />
          ))}
        </div>
      </section>

      {[...Array(4)].map((_, i) => (
        <ProductRowSkeleton key={i} />
      ))}

      {/* Brand story: the dark green box */}
      <section className={`${WIDTH} mb-8 sm:mb-10`}>
        <div className="h-[819px] min-[400px]:h-[657px] md:h-[472px] lg:h-[372px] overflow-hidden rounded-3xl bg-emerald-950 px-5 py-7 sm:px-10 sm:py-10">
          <div className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
            <div>
              <div className="h-3.5 w-40 rounded-md bg-white/15" />
              <div className="mt-3 h-7 w-full max-w-lg rounded-md bg-white/15" />
              <div className="mt-2 h-7 w-3/4 max-w-md rounded-md bg-white/15" />
              <div className="mt-4 h-4 w-full max-w-xl rounded-md bg-white/10" />
              <div className="mt-2 h-4 w-full max-w-xl rounded-md bg-white/10" />
              <div className="mt-2 h-4 w-2/3 max-w-md rounded-md bg-white/10" />
              <div className="mt-5 flex flex-wrap gap-2">
                <div className="h-11 w-28 rounded-full bg-white/20" />
                <div className="h-11 w-52 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Khushbuwaala: four small cards, two per row on phones */}
      <section className={WIDTH}>
        <TitleSkeleton className="mt-6 sm:mt-8 lg:mt-10 mb-2 sm:mb-4" />
        <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex h-[150px] flex-col items-center rounded-xl border border-emerald-200/80 bg-white p-3 min-[400px]:h-[138px] sm:h-[151px] sm:items-start sm:p-4 md:h-[142px] lg:h-[169px] xl:h-[151px]">
              <Skeleton className="mb-2 h-9 w-9 rounded-xl sm:mb-3 sm:h-11 sm:w-11" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="mt-2 h-3 w-full rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-2/3 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* What our customers say: review cards, a little over one on a phone, three on a computer */}
      <section className={`${WIDTH} mt-8 sm:mt-10 lg:mt-12 mb-8 sm:mb-10`}>
        <TitleSkeleton className="mb-1 sm:mb-2" />
        <div className="overflow-hidden">
          <div className="-ml-3 flex">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-[88%] pl-3 sm:basis-1/2 lg:basis-1/3">
                <div className="h-[262px] rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="mt-4 h-4 w-full rounded-md" />
                  <Skeleton className="mt-2 h-4 w-full rounded-md" />
                  <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
                  <div className="mt-10 flex items-center gap-3 border-t border-stone-100 pt-4">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="mt-1.5 h-3 w-40 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-1.5">
          <Skeleton className="h-2 w-6 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </section>
    </div>
  )
}

// A section heading: one line of text and the short green rule under it (see SectionTitle).
function TitleSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center px-2 pb-3 pt-1 sm:pb-4 ${className}`}>
      <Skeleton className="h-[25px] w-44 rounded-md sm:h-[30px] sm:w-56 md:h-[35px]" />
      <Skeleton className="mt-2 h-0.5 w-10 rounded-full" />
    </div>
  )
}

// One row of products: heading, the sliding row of cards (a little over two fit on a phone,
// six on a wide screen), and the "see all" button under it. See ProductCarouselClient and
// HomeProductRow.
function ProductRowSkeleton() {
  return (
    <div>
      <section className={`${WIDTH} mb-8 sm:mb-10 lg:mb-12`}>
        <TitleSkeleton />
        <div className="overflow-hidden">
          <div className="-ml-2 flex items-start md:-ml-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-1/2 pl-2 min-[360px]:basis-[46%] sm:basis-1/3 md:basis-1/4 md:pl-3 lg:basis-1/5 2xl:basis-1/6"
              >
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="-mt-5 mb-8 text-center sm:-mt-6 sm:mb-10">
        <Skeleton className="inline-block h-10 w-36 rounded-full align-top" />
      </div>
    </div>
  )
}
