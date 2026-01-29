"use client"

import { motion, useReducedMotion } from "framer-motion"
import { SectionTitle } from "./SectionTitle"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ProductCarouselSkeleton({
  title,
  titleVariant = "default",
  titleSubtitle,
  titleIcon,
  titleUnderlineWidth,
  titleAnimated = true,
  titleShowDecorations = true,
  titleUnderlineVariant = "default",
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
  const reduce = useReducedMotion()

  // ✅ Render only 4 skeleton items; hide extras responsively
  const items = [0, 1, 2, 3]

  return (
    <motion.div
      className="container mx-auto py-2"
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={reduce ? undefined : { duration: 0.25 }}
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

      <div className="w-full">
        <div className="-ml-2 sm:-ml-4 flex overflow-hidden">
          {items.map((i) => (
            <div
              key={i}
              className={cn(
                "pl-2 sm:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4",
                // ✅ show 2 on mobile
                i >= 2 && "hidden md:block",
                // ✅ show 3 on md
                i >= 3 && "hidden lg:block"
              )}
            >
              <motion.div
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 0.35, ease: "easeOut", delay: i * 0.08 }
                }
                className="p-2"
              >
                <div
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative"
                  style={
                    reduce
                      ? undefined
                      : { animation: `soft-float 2.8s ease-in-out ${i * 0.2}s infinite` }
                  }
                >
                  {/* Image skeleton */}
                  <div className="relative w-full h-64 rounded-t-xl overflow-hidden">
                    <Skeleton className="w-full h-full" />

                    {/* Premium shimmer overlay */}
                    {!reduce && (
                      <div className="absolute inset-0 pointer-events-none skeleton-shimmer" />
                    )}

                    {/* Badge placeholders */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>

                    {/* Wishlist circle */}
                    <div className="absolute top-3 right-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />

                    <div className="flex items-center gap-2 pt-1">
                      <Skeleton className="h-4 w-20 rounded-md" />
                      <Skeleton className="h-4 w-10 rounded-md" />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Skeleton className="h-6 w-24 rounded-md" />
                      <Skeleton className="h-8 w-16 rounded-full" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-10 flex-1 rounded-lg" />
                    </div>
                  </div>

                  {/* Soft bottom glow */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-rose-50/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
