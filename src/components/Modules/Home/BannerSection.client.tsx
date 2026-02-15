"use client"

import dynamic from "next/dynamic"

const BannerSection = dynamic(
    () => import("./BannerSection").then((m) => m.BannerSection),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] mt-12 mb-4 rounded-2xl bg-gray-100 animate-pulse" />
        ),
    }
)

export default BannerSection
