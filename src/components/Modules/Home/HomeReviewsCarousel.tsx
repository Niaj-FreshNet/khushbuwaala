"use client"

import * as React from "react"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import { Quote, Star } from "lucide-react"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PlainImage } from "@/components/ui/plain-image"
import { cn } from "@/lib/utils"
import type { HomeReview } from "@/lib/homeReviews"

// Longer reviews are cut to a few lines with "Read more", so every card in a row is the same height.
const LONG_REVIEW = 190

const monthYear = (iso: string) => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "Asia/Dhaka" })
}

function ReviewCard({ review }: { review: HomeReview }) {
  const [open, setOpen] = React.useState(false)
  const long = review.comment.length > LONG_REVIEW
  const initial = (review.name.trim().charAt(0) || "C").toUpperCase()

  return (
    <figure className="relative flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
      <Quote aria-hidden className="absolute right-5 top-5 h-8 w-8 text-emerald-100" strokeWidth={1.5} />

      <div className="flex items-center gap-0.5" role="img" aria-label="5 out of 5 stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} aria-hidden className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <blockquote className="mt-3 flex-1">
        <p className={cn("whitespace-pre-line break-words text-[15px] leading-relaxed text-stone-800", !open && "line-clamp-5")}>
          {review.comment}
        </p>
        {long && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-1 min-h-0! text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            {open ? "Show less" : "Read more"}
          </button>
        )}
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-4">
        {review.avatar ? (
          <PlainImage src={review.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full border border-stone-200 object-cover" />
        ) : (
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-900 text-sm font-semibold text-white">
            {initial}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-900">{review.name}</p>
          <p className="truncate text-xs text-stone-500">
            {review.product ? (
              <>
                on{" "}
                <Link href={`/product/${review.product.slug}`} className="font-medium text-emerald-700 hover:underline">
                  {review.product.name}
                </Link>
              </>
            ) : (
              "Khushbuwaala customer"
            )}
            {monthYear(review.createdAt) ? <span> · {monthYear(review.createdAt)}</span> : null}
          </p>
        </div>
        {review.imageUrl ? (
          <PlainImage
            src={review.imageUrl}
            alt={`Photo sent by ${review.name}`}
            className="h-11 w-11 shrink-0 rounded-lg border border-stone-200 object-cover"
          />
        ) : null}
      </figcaption>
    </figure>
  )
}

export function HomeReviewsCarousel({ reviews }: { reviews: HomeReview[] }) {
  // Moves on by itself, slowly; stops for good once the visitor touches it, and waits while the
  // pointer is over it, so nobody loses the review they are reading.
  const autoplay = React.useRef(Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true }))
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [active, setActive] = React.useState(0)
  const [pages, setPages] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const sync = () => {
      setPages(api.scrollSnapList().length)
      setActive(api.selectedScrollSnap())
    }
    sync()
    api.on("select", sync)
    api.on("reInit", sync)
    return () => {
      api.off("select", sync)
      api.off("reInit", sync)
    }
  }, [api])

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        plugins={[autoplay.current]}
        opts={{ align: "start", loop: reviews.length > 3 }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 items-stretch">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="basis-[88%] pl-3 sm:basis-1/2 lg:basis-1/3">
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex h-11 w-11 -left-4 lg:-left-6 border border-stone-200 bg-white text-stone-800 shadow-md hover:bg-stone-50" />
        <CarouselNext className="hidden md:flex h-11 w-11 -right-4 lg:-right-6 border border-stone-200 bg-white text-stone-800 shadow-md hover:bg-stone-50" />
      </Carousel>

      {pages > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to review ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "h-2 min-h-0! rounded-full transition-all",
                index === active ? "w-6 bg-emerald-700" : "w-2 bg-stone-300 hover:bg-stone-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
