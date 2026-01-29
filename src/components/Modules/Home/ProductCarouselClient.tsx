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

  // ✅ Animate section once when it enters viewport
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(wrapRef, { amount: 0.25, once: true })

  // ✅ Respect OS setting: "Reduce motion"
  const reduce = useReducedMotion()

  // ✅ Variants (reduced-motion safe)
  const sectionVariants: Variants = reduce
    ? {
      hidden: { opacity: 1 },
      show: { opacity: 1 },
    }
    : {
      hidden: { opacity: 0, y: 14 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    }

  const listVariants: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
      hidden: {},
      show: {
        transition: {
          staggerChildren: 0.06,
          delayChildren: 0.05,
        },
      },
    }

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
    <motion.div
      ref={wrapRef}
      className="container mx-auto py-2"
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={sectionVariants}
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

      <Carousel opts={{ align: "start" }} className="w-full">
        {/* ✅ Animate only items, not the carousel internal mechanics */}
        <motion.div variants={listVariants} initial="hidden" animate={isInView ? "show" : "hidden"}>
          <CarouselContent className="-ml-2 sm:-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 sm:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={reduce ? undefined : { y: -4 }} // ✅ hover lift only if motion allowed
                  transition={reduce ? undefined : { type: "spring", stiffness: 260, damping: 22 }}
                >
                  <ProductCard
                    className="py-0"
                    product={product}
                    onQuickView={() => handleQuickView(product)}
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          open={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
        />
      )}
    </motion.div>
  )
}