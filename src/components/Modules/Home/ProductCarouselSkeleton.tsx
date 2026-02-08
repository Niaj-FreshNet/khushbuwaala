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
  const items = [0, 1, 2, 3]

  return (
    <motion.section
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={reduce ? undefined : { duration: 0.25 }}
      className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-2 overflow-x-hidden"
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
        {/* ✅ SAME GAP AS CLIENT NOW */}
        <div className="flex gap-1 sm:gap-2 md:gap-3">
          {items.map((i) => (
            <div
              key={i}
              className={cn(
                "basis-1/2 md:basis-1/3 lg:basis-1/4",
                i >= 2 && "hidden md:block",
                i >= 3 && "hidden lg:block"
              )}
            >
              <motion.div
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={reduce ? undefined : { duration: 0.35, ease: "easeOut", delay: i * 0.08 }}
                className="h-full"
              >
                <div
                  className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
                  style={
                    reduce
                      ? undefined
                      : { animation: `soft-float 2.8s ease-in-out ${i * 0.2}s infinite` }
                  }
                >
                  {/* Image skeleton */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <Skeleton className="absolute inset-0" />

                    {/* ✅ shimmer overlay to look "alive" */}
                    {!reduce && (
                      <div className="absolute inset-0 pointer-events-none skeleton-shimmer" />
                    )}

                    {/* badge placeholders */}
                    <div className="absolute top-2 left-3 flex gap-2">
                      <Skeleton className="h-6 w-14 rounded-full" />
                    </div>

                    {/* wishlist circle */}
                    <div className="absolute top-2 right-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>

                  {/* Body matches ProductCard padding rhythm */}
                  <div className="p-2 sm:p-3 md:p-4 pb-1 space-y-2">
                    <Skeleton className="h-4 w-4/5 mx-auto" />
                    <Skeleton className="h-4 w-3/5 mx-auto" />

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-4 w-12 rounded-md" />
                    </div>

                    <div className="flex justify-center gap-1 sm:gap-2 pt-1">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  </div>

                  {/* footer button area */}
                  <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 pt-0">
                    <Skeleton className="h-9 sm:h-10 w-full rounded-lg sm:rounded-xl" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-rose-50/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
