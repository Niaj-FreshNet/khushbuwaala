import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
    CategoryName: string
    CategoryImage: string
    CategoryLink: string
    description: string
}

export function CategoryCard({ CategoryName, CategoryImage, CategoryLink, description }: CategoryCardProps) {
    return (
        <article
            className="
        group relative overflow-hidden
        rounded-none sm:rounded-xl
        shadow-none sm:shadow-sm sm:hover:shadow-lg
        transition-all duration-300
      "
        >
            <div className="relative w-full h-60 sm:h-56 md:h-60 lg:h-64">
                <Image
                    src={CategoryImage || "/placeholder.svg"}
                    alt={CategoryName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover sm:transition-transform sm:duration-500 sm:group-hover:scale-110"
                />

                {/* Make the whole card focusable/tappable for mobile reveal */}
                <Link
                    href={CategoryLink}
                    className="absolute inset-0 z-10 outline-none"
                    aria-label={`Explore ${CategoryName} category`}
                    title={`Shop ${CategoryName}`}
                />

                {/* Overlay */}
                <div
                    className="
            absolute inset-0
            bg-gradient-to-t from-black/80 via-black/30 to-transparent
            flex flex-col justify-end
            p-4 sm:p-5 lg:p-6
            transition-opacity duration-300
            opacity-100 sm:opacity-90 sm:group-hover:opacity-100
            pointer-events-none
          "
                >
                    {/* Title always visible */}
                    {/* Title wrapper */}
                    <div className="inline-flex max-w-[90%]">
                        <h3
                            className="
      text-white font-semibold tracking-wider
      text-lg sm:text-base md:text-lg lg:text-xl
      leading-tight
      px-3 py-1.5
      rounded-md
      bg-black/5 backdrop-blur-sm
      shadow-sm
    "
                        >
                            {CategoryName}
                        </h3>
                    </div>

                    {/* Hidden by default. Reveal on:
              - mobile tap (focus-within)
              - desktop hover */}
                    <div
                        className="
              mt-2
              opacity-0 translate-y-2
              transition-all duration-300
              group-focus-within:opacity-100 group-focus-within:translate-y-0
              sm:group-hover:opacity-100 sm:group-hover:translate-y-0
            "
                    >
                        <p className="text-gray-200 text-sm md:text-sm lg:text-base line-clamp-3">
                            {description}
                        </p>

                        <div className="mt-3">
                            {/* Button is visual; click goes through the full-card Link above */}
                            <div
                                className="
                  inline-flex items-center
                  px-4 h-10
                  rounded-full
                  bg-white text-red-600 font-semibold
                  shadow-sm
                "
                            >
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
