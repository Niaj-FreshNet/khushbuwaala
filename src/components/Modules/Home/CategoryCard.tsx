import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  CategoryName: string
  CategoryImage: string
  CategoryLink: string
  description: string
}

export function CategoryCard({
  CategoryName,
  CategoryImage,
  CategoryLink,
  description,
}: CategoryCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden",
        "rounded-none sm:rounded-2xl",
        "shadow-none sm:shadow-sm sm:hover:shadow-lg",
        "transition-all duration-300",
        "bg-black/[0.02] border border-transparent sm:border-gray-100"
      )}
    >
      <div className="relative w-full h-60 sm:h-56 md:h-60 lg:h-64">
        {/* Image */}
        <Image
          src={CategoryImage || "/placeholder.svg"}
          alt={CategoryName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={cn(
            "object-cover",
            "transition-transform duration-700 ease-out",
            "sm:group-hover:scale-[1.08]"
          )}
          priority={false}
        />

        {/* Full-card link (kept) */}
        <Link
          href={CategoryLink}
          className={cn(
            "absolute inset-0 z-10 outline-none",
            "focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2",
            "focus-visible:ring-offset-white"
          )}
          aria-label={`Explore ${CategoryName} category`}
          title={`Shop ${CategoryName}`}
        />

        {/* Premium overlay stack */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-gradient-to-t from-black/85 via-black/35 to-black/5",
            "opacity-100 sm:opacity-90 sm:group-hover:opacity-100",
            "transition-opacity duration-300"
          )}
        />

        {/* Subtle vignette + glow (premium feel) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_45%)] opacity-70" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 lg:p-6 pointer-events-none">
          {/* Title pill (glass) */}
          <div className="inline-flex max-w-[92%]">
            <h3
              className={cn(
                "text-white font-semibold tracking-wide leading-tight",
                "text-lg sm:text-base md:text-lg lg:text-xl",
                "px-3 py-1.5 rounded-lg",
                "bg-white/10 backdrop-blur-md border border-white/15",
                "shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
              )}
            >
              {CategoryName}
            </h3>
          </div>

          {/* Reveal panel: hover (desktop) + focus-within (mobile tap/keyboard) */}
          <div
            className={cn(
              "mt-2",
              "opacity-0 translate-y-3",
              "transition-all duration-300",
              "group-focus-within:opacity-100 group-focus-within:translate-y-0",
              "sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
            )}
          >
            <p className="text-gray-100/90 text-sm md:text-sm lg:text-base line-clamp-3">
              {description}
            </p>

            {/* CTA “Shop Now” */}
            <div className="mt-3 inline-flex items-center">
              <div
                className={cn(
                  "inline-flex items-center gap-2",
                  "px-4 h-10 rounded-full",
                  "bg-white text-rose-600 font-semibold",
                  "shadow-sm border border-white/60",
                  "transition-transform duration-300",
                  "sm:group-hover:translate-x-0",
                  "translate-x-0"
                )}
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </div>

              {/* tiny accent line */}
              <div className="hidden sm:block ml-3 h-px w-10 bg-gradient-to-r from-white/60 to-transparent" />
            </div>
          </div>

          {/* Corner accents (very subtle luxury detail) */}
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 border border-white/10 blur-[0.5px] opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </article>
  )
}
