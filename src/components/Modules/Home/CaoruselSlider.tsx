"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const home1 = "/hero1desktop11.webp"
const home2 = "/hero2desktop22.webp"
const home3 = "/hero3desktop33.webp"
const homeMobile1 = "/hero1mobile11.webp"
const homeMobile2 = "/hero2mobile22.webp"
const homeMobile3 = "/hero3mobile33.webp"

type Slide = {
  src: string              // desktop
  mobileSrc?: string       // mobile
  alt: string
  primaryText: string
  primaryLink: string
  secondaryText?: string
  secondaryLink?: string
}

export function CarouselSlider() {

  const plugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const slides: Slide[] = [
    {
      src: home1,
      mobileSrc: homeMobile1,
      alt: "KhushbuWaala Premium Perfumes",
      primaryText: "Shop Now",
      primaryLink: "/shop",
      secondaryText: "Explore Collections",
      secondaryLink: "/shop",
    },
    {
      src: home2,
      mobileSrc: homeMobile2,
      alt: "KhushbuWaala Attars & Oud",
      primaryText: "Explore Collections",
      primaryLink: "/shop",
      secondaryText: "Best Sellers",
      secondaryLink: "/shop",
    },
    {
      src: home3,
      mobileSrc: homeMobile3,
      alt: "KhushbuWaala Attars & Oud",
      primaryText: "Best Sellers",
      primaryLink: "/shop",
      secondaryText: "Best Sellers",
      secondaryLink: "/shop",
    },
  ]

  const [api, setApi] = React.useState<any>(null)
  const [active, setActive] = React.useState(0)
  const [snapCount, setSnapCount] = React.useState(slides.length)

  React.useEffect(() => {
    if (!api) return
    setSnapCount(api.scrollSnapList().length)
    setActive(api.selectedScrollSnap())

    const onSelect = () => setActive(api.selectedScrollSnap())
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  const goTo = (index: number) => api?.scrollTo(index)

  return (
    <section className="w-full overflow-hidden relative mt-2" aria-label="Hero Carousel">
      <Carousel setApi={setApi} plugins={[plugin.current]} className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[280px] md:h-[400px]">
                {/* Mobile image */}
                <Image
                  src={slide.mobileSrc || slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  className="object-cover md:hidden"
                  priority={index === 0} // ✅ only this is priority on mobile
                  fetchPriority={index === 0 ? "high" : "auto"} // ✅
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={70} // ✅ reduce a bit on mobile
                />

                {/* Desktop image */}
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  className="object-cover hidden md:block"
                  priority={false} // ✅ DO NOT priority here
                  loading="lazy"
                  quality={85}
                />
                {/* Minimal vignette ONLY for CTA readability (doesn't fight your image text) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />

                {/* CTA Dock: bottom-left on desktop, centered on mobile */}
                <div className="absolute inset-0 flex items-end">
                  <div className="container mx-auto sm:px-4 md:px-8 pb-8 sm:pb-10 md:pb-16">
                    <div className="flex justify-center">
                      <div
                        className={[
                          "relative z-20 pointer-events-auto",
                          "w-auto max-w-[92%] md:max-w-none",
                          "flex items-center gap-2.5 sm:gap-3",
                          "transition-all duration-300 ease-out motion-reduce:transition-none",
                          active === index
                            ? "opacity-100 translate-y-0 blur-0"
                            : "opacity-0 translate-y-2 blur-[6px] pointer-events-none",
                        ].join(" ")}
                      >
                        <Button
                          asChild
                          className="
                          h-10 md:h-11
                          px-5 md:px-7
                          text-xs md:text-sm font-medium
                          rounded-2xl
                          text-white
                          bg-transparent hover:bg-white/[0.08]
                          backdrop-blur-sm
                          border border-white/25 hover:border-white/40
                          shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                          hover:scale-[1.03]
                          transition-all duration-200
                        "
                        >
                          <Link href={slide.primaryLink} aria-label={slide.primaryText} className="flex items-center">
                            {slide.primaryText}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>

                        {/* {slide.secondaryText && slide.secondaryLink && (
                          <Button
                            asChild
                            variant="ghost"
                            className="
                            h-10 md:h-11
                            px-5 md:px-7
                            text-xs md:text-sm font-medium
                            rounded-2xl
                            text-white/90 hover:text-white
                            bg-white/[0.04] hover:bg-white/[0.14]
                            backdrop-blur-sm
                            border border-white/15 hover:border-white/30
                            shadow-[0_4px_20px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.15)]
                            hover:scale-[1.03]
                            transition-all duration-200
                          "
                          >
                            <Link href={slide.secondaryLink} aria-label={slide.secondaryText}>
                              {slide.secondaryText}
                            </Link>
                          </Button>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows */}
        <CarouselPrevious className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/15 backdrop-blur-md transition-all" />
        <CarouselNext className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/15 backdrop-blur-md transition-all" />

        {/* Dots (mobile-optimized + still tap-friendly) */}
        <div className="absolute -bottom-1 md:bottom-6 left-0 right-0 z-10 flex items-center justify-center">
          {/* <div className="pointer-events-auto flex items-center gap-1.5 md:gap-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 px-2.5 py-1.5 md:px-3 md:py-2"> */}
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={[
                // ✅ tap target (mobile needs ~40px). We use padding wrapper via min size.
                "grid place-items-center rounded-full",
                "h-7 w-7 md:h-8 md:w-8",

                // inner dot
                "relative",
                "transition-transform duration-200",
                "active:scale-95",
                i === active ? "scale-100" : "scale-95",
              ].join(" ")}
            >
              <span
                className={[
                  "block rounded-full transition-all duration-300",
                  // ✅ actual visible dot sizes
                  i === active
                    ? "w-4 h-1.5 md:w-8 md:h-2 bg-white"
                    : "w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-white/45 hover:bg-white/70",
                ].join(" ")}
              />
            </button>
          ))}
          {/* </div> */}
        </div>

      </Carousel>
    </section>
  )
}
