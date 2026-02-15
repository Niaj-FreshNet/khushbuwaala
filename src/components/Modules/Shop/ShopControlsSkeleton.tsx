"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LiveSkeleton } from "@/app/(StoreFront)/shop/_components/LiveSkeleton"
import { cn } from "@/lib/utils"

export function ShopControlsSkeleton() {
    return (
        <div className="sticky top-0 z-40 mb-4 sm:mb-8">
            {/* ✅ SAME wrapper as real bar */}
            <div
                className={cn(
                    "flex justify-between items-center",
                    "bg-white/95 backdrop-blur-xl",
                    "py-2 sm:py-4 px-2 sm:px-4",
                    "rounded-b-xl shadow-lg border border-gray-200/50"
                )}
            >
                {/* LEFT: Filter button (same height + similar width) */}
                <LiveSkeleton delayMs={120} speedMs={1400}>
                    <Skeleton className="h-9 sm:h-10 w-[92px] sm:w-[110px] rounded-lg" />
                </LiveSkeleton>

                {/* CENTER: columns group (same p-1 + icon sizes + responsive hidden buttons) */}
                <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
                    <LiveSkeleton delayMs={170} speedMs={1450}>
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </LiveSkeleton>

                    <LiveSkeleton delayMs={220} speedMs={1500}>
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </LiveSkeleton>

                    <div className="hidden md:block">
                        <LiveSkeleton delayMs={270} speedMs={1550}>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </LiveSkeleton>
                    </div>

                    <div className="hidden lg:block">
                        <LiveSkeleton delayMs={320} speedMs={1600}>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </LiveSkeleton>
                    </div>

                    <div className="hidden xl:block">
                        <LiveSkeleton delayMs={370} speedMs={1650}>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </LiveSkeleton>
                    </div>
                </div>

                {/* RIGHT: Sort button (same height + similar width) */}
                <LiveSkeleton delayMs={200} speedMs={1500}>
                    <Skeleton className="h-9 sm:h-10 w-[82px] sm:w-[100px] rounded-lg" />
                </LiveSkeleton>
            </div>
        </div>
    )
}
