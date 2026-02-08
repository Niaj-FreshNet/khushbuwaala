"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useState, useRef } from "react"
import type React from "react"
import { SectionTitle } from "./SectionTitle"
import { ProductCard } from "@/components/ReusableUI/ProductCard"
import { IProductResponse } from "@/types/product.types"
import { ProductQuickView } from "@/components/ReusableUI/ProductQuickView"
import { motion, useInView, Variants, useReducedMotion } from "framer-motion"

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

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(wrapRef, { amount: 0.25, once: true })
  const reduce = useReducedMotion()

  const sectionVariants: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }

  const listVariants: Variants = reduce
    ? { hidden: {}, show: {} }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }

  const itemVariants: Variants = reduce
    ? {
      hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
      show: { opacity: 1, y: 0, filter: "blur(0px)" },
    }
    : {
      hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.45, ease: "easeOut" },
      },
    }

  return (
    <motion.section
      ref={wrapRef}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={sectionVariants}
      className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-2"
    >
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

      <div className="relative overflow-hidden">
        <Carousel opts={{ align: "center" }} className="w-full">
          <motion.div variants={listVariants} initial="hidden" animate={isInView ? "show" : "hidden"}>
            {/* ✅ GAP REDUCED HERE (product cards) */}
            <CarouselContent className="w-full mx-auto gap-0">
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <motion.div
                    variants={itemVariants}
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={reduce ? undefined : { type: "spring", stiffness: 260, damping: 22 }}
                    className="h-full"
                  >
                    <ProductCard className="h-full" product={product} onQuickView={() => handleQuickView(product)} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </motion.div>

          <CarouselPrevious className="flex" />
          <CarouselNext className="flex" />
        </Carousel>
      </div>

      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
      )}
    </motion.section>
  )
}
