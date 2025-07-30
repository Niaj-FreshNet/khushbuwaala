import { getProducts, type Product } from "@/lib/Data/data"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { SectionTitle } from "./SectionTitle"
import { ProductCard } from "@/components/ReusableUI/ProductCard"

interface ProductCarouselSectionProps {
  title: string
  category?: string
  section?: string
  linkPath?: string
}

// Client Component for the Carousel functionality
function ProductCarouselClient({ products, title }: { products: Product[]; title: string }) {
  return (
    <div className="container mx-auto py-8">
      <SectionTitle title={title} />
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product._id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
}

// Server Component for data fetching and rendering the client carousel
export async function ProductCarouselSection({ title, category, section, linkPath }: ProductCarouselSectionProps) {
  const products = await getProducts(category, section)

  return (
    <Suspense fallback={<ProductCarouselSkeleton title={title} />}>
      <ProductCarouselClient products={products} title={title} />
    </Suspense>
  )
}

// Skeleton Loader for Product Carousel
function ProductCarouselSkeleton({ title }: { title: string }) {
  return (
    <div className="container mx-auto py-8">
      <SectionTitle title={title} />
      <div className="flex space-x-4 overflow-hidden">
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
  )
}
