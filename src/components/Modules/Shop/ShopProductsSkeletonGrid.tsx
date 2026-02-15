"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

function LiveSkeleton({
  className = "",
  delayMs = 0,
  speedMs = 1400,
  children,
}: {
  className?: string
  delayMs?: number
  speedMs?: number
  children: React.ReactNode
}) {
  return (
    <div
      className={`skel-live ${className}`}
      style={
        {
          ["--skel-delay" as any]: `${delayMs}ms`,
          ["--skel-speed" as any]: `${speedMs}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

export function ShopProductsSkeletonGrid({
  count = 12,
  colsClass = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: {
  count?: number
  colsClass?: string
}) {
  return (
    <div className={`grid ${colsClass} gap-2 sm:gap-3 md:gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="relative">
            <LiveSkeleton delayMs={80 + i * 30} speedMs={1450 + (i % 3) * 120}>
              <Skeleton className="w-full h-52 sm:h-64" />
            </LiveSkeleton>

            <div className="absolute top-3 left-3 flex gap-2">
              <LiveSkeleton delayMs={140 + i * 25} speedMs={1400}>
                <Skeleton className="h-7 w-16 rounded-full" />
              </LiveSkeleton>
              <LiveSkeleton delayMs={155 + i * 25} speedMs={1450}>
                <Skeleton className="h-7 w-12 rounded-full" />
              </LiveSkeleton>
            </div>

            <div className="absolute top-3 right-3">
              <LiveSkeleton delayMs={160 + i * 25} speedMs={1500}>
                <Skeleton className="h-9 w-9 rounded-full" />
              </LiveSkeleton>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <LiveSkeleton delayMs={120 + i * 20} speedMs={1450}>
              <Skeleton className="h-5 w-5/6 rounded" />
            </LiveSkeleton>

            <LiveSkeleton delayMs={160 + i * 20} speedMs={1550}>
              <Skeleton className="h-4 w-2/3 rounded" />
            </LiveSkeleton>

            <div className="flex items-center justify-between pt-1">
              <LiveSkeleton delayMs={220 + i * 10} speedMs={1400}>
                <Skeleton className="h-6 w-20 rounded" />
              </LiveSkeleton>
              <LiveSkeleton delayMs={260 + i * 10} speedMs={1550}>
                <Skeleton className="h-6 w-14 rounded-full" />
              </LiveSkeleton>
            </div>

            <div className="flex gap-2 pt-2">
              <LiveSkeleton delayMs={240 + i * 10} speedMs={1500}>
                <Skeleton className="h-10 w-10 rounded-full" />
              </LiveSkeleton>
              <LiveSkeleton delayMs={280 + i * 10} speedMs={1450}>
                <Skeleton className="h-10 flex-1 rounded-xl" />
              </LiveSkeleton>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
