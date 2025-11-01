
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense, useState } from "react"
import type React from "react"
import { SectionTitle } from "./SectionTitle"
import { ProductCard } from "@/components/ReusableUI/ProductCard"
import { IProductResponse } from "@/types/product.types"
import { ProductQuickView } from "@/components/ReusableUI/ProductQuickView"

// Client Component for the Carousel functionality
export function ProductCarouselClient({
  products,
  title,
  titleVariant = "default",
  titleSubtitle,
  titleIcon,
  titleUnderlineWidth,
  titleAnimated = true,
  titleShowDecorations = true,
  titleUnderlineVariant = "default", // Default to "default"
}: {
  products: IProductResponse[]
  title: string
  titleVariant?: "default" | "gradient" | "elegant" | "modern" | "premium"
  titleSubtitle?: string
  titleIcon?: React.ReactNode
  titleUnderlineWidth?: string
  titleAnimated?: boolean
  titleShowDecorations?: boolean
  titleUnderlineVariant?: "default" | "wide" | "full"
}) {
  const [quickViewProduct, setQuickViewProduct] = useState<IProductResponse | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
    const handleQuickView = (product: IProductResponse) => {
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  return (
    <div className="container mx-auto py-2">
      <SectionTitle
        title={title}
        subtitle={titleSubtitle}
        variant={titleVariant}
        icon={titleIcon}
        underlineWidth={titleUnderlineWidth}
        animated={titleAnimated}
        showDecorations={titleShowDecorations}
        underlineVariant={titleUnderlineVariant} // Pass the new prop
      />
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard
                className="py-0"
                key={product.id}
                product={product}
                // layout={columns === 1 ? "list" : "grid"}
                // showDescription={columns === 1}
                onQuickView={() => handleQuickView(product)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
      )}
    </div>
  )
}

// // Server Component for data fetching and rendering the client carousel
// export async function ProductCarouselSection({
//   title,
//   category,
//   section,
//   linkPath,
//   titleVariant = "default",
//   titleSubtitle,
//   titleIcon,
//   titleUnderlineWidth,
//   titleAnimated = true,
//   titleShowDecorations = true,
//   titleUnderlineVariant = "default", // Default to "default"
// }: ProductCarouselSectionProps) {
//   const [getBestsellers] = useGetBestSellersQuery()
//   const res = await getBestsellers()
//   const products = res.data

//   return (
//     <Suspense
//       fallback={
//         <ProductCarouselSkeleton
//           title={title}
//           titleVariant={titleVariant}
//           titleSubtitle={titleSubtitle}
//           titleIcon={titleIcon}
//           titleUnderlineWidth={titleUnderlineWidth}
//           titleAnimated={titleAnimated}
//           titleShowDecorations={titleShowDecorations}
//           titleUnderlineVariant={titleUnderlineVariant} // Pass the new prop
//         />
//       }
//     >
//       <ProductCarouselClient
//         products={products}
//         title={title}
//         titleVariant={titleVariant}
//         titleSubtitle={titleSubtitle}
//         titleIcon={titleIcon}
//         titleUnderlineWidth={titleUnderlineWidth}
//         titleAnimated={titleAnimated}
//         titleShowDecorations={titleShowDecorations}
//         titleUnderlineVariant={titleUnderlineVariant} // Pass the new prop
//       />
//     </Suspense>
//   )
// }

// Enhanced Skeleton Loader for Product Carousel
export function ProductCarouselSkeleton({
  title,
  titleVariant = "default",
  titleSubtitle,
  titleIcon,
  titleUnderlineWidth,
  titleAnimated = true,
  titleShowDecorations = true,
  titleUnderlineVariant = "default", // Default to "default"
}: {
  title: string
  titleVariant?: "default" | "gradient" | "elegant" | "modern" | "premium"
  titleSubtitle?: string
  titleIcon?: React.ReactNode
  titleUnderlineWidth?: string
  titleAnimated?: boolean
  titleShowDecorations?: boolean
  titleUnderlineVariant?: "default" | "wide" | "full"
}) {
  return (
    <div className="container mx-auto py-2">
      <SectionTitle
        title={title}
        subtitle={titleSubtitle}
        variant={titleVariant}
        icon={titleIcon}
        underlineWidth={titleUnderlineWidth}
        animated={titleAnimated}
        showDecorations={titleShowDecorations}
        underlineVariant={titleUnderlineVariant} // Pass the new prop
      />
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-[calc(50%-1rem)] md:min-w-[calc(33%-1rem)] lg:min-w-[calc(25%-1rem)] p-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <Skeleton className="w-full h-64 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
