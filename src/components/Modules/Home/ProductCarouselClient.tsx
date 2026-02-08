"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useState, useRef } from "react"
import type React from "react"
import { SectionTitle } from "./SectionTitle"
import { ProductCard } from "@/components/ReusableUI/ProductCard"
import { IProductResponse } from "@/types/product.types"

import dynamic from "next/dynamic"
// REMOVE: import { motion, useInView, Variants, useReducedMotion } from "framer-motion"

const ProductQuickView = dynamic(
  () => import("@/components/ReusableUI/ProductQuickView").then((m) => m.ProductQuickView),
  { ssr: false }
)

export function ProductCarouselClient({
  products,
  title,
  titleVariant = "default",
  titleSubtitle,
  titleIcon,
  titleUnderlineWidth,
  titleAnimated = true,
  titleShowDecorations = true,
  titleUnderlineVariant = "default",
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
  const [quickViewProduct, setQuickViewProduct] = useState<IProductResponse | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const handleQuickView = (product: IProductResponse) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }

  // kept (even if unused) in case you need it later
  const wrapRef = useRef<HTMLDivElement | null>(null)

  return (
    <section ref={wrapRef} className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-2">
      <SectionTitle
        title={title}
        subtitle={titleSubtitle}
        variant={titleVariant}
        icon={titleIcon}
        underlineWidth={titleUnderlineWidth}
        animated={titleAnimated}
        showDecorations={titleShowDecorations}
        underlineVariant={titleUnderlineVariant}
      />

      <div className="relative">
        <Carousel opts={{ align: "center" }} className="w-full">
          {/* ✅ GAP REDUCED HERE (product cards) */}
          <CarouselContent className="w-full mx-auto gap-0 md:gap-1 lg:gap-2">
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="h-full">
                  <ProductCard className="h-auto" product={product} onQuickView={() => handleQuickView(product)} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          open={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
        />
      )}
    </section>
  )
}
