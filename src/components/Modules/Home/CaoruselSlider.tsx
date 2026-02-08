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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const home1 = "/hero1desktop.png"
const home2 = "/hero2desktop.png"
const home3 = "/hero3desktop.png"
const homeMobile1 = "/hero1mobile.png"
const homeMobile2 = "/hero2mobile.png"
const homeMobile3 = "/hero3mobile.png"

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
  const reduce = useReducedMotion()

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
      primaryText: "Explore Collections",
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

  // CTA entrance (safe + premium)
  const ctaWrap = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
      hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.45, ease: "easeOut" },
      },
      exit: { opacity: 0, y: 6, transition: { duration: 0.2 } },
    }

  return (
    <section className="w-full overflow-hidden relative mb-6 mt-6" aria-label="Hero Carousel">
      <Carousel setApi={setApi} plugins={[plugin.current]} className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[420px] md:h-[600px]">
                {/* Mobile image */}
                <Image
                  src={slide.mobileSrc || slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover md:hidden"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Desktop image */}
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover hidden md:block"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Minimal vignette ONLY for CTA readability (doesn't fight your image text) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />

                {/* CTA Dock: bottom-left on desktop, centered on mobile */}
                <div className="absolute inset-0 flex items-end">
                  <div className="container mx-auto sm:px-4 md:px-8 pb-8 sm:pb-10 md:pb-24">
                    <div className="flex justify-center md:justify-start">
                      <AnimatePresence mode="wait">
                        {active === index && (
                          <motion.div
                            variants={ctaWrap as any}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className={[
                              "relative z-20 pointer-events-auto",

                              // size behavior
                              "w-auto max-w-[92%] md:max-w-[520px]",

                              // layout
                              "flex items-center gap-2 md:gap-3",

                              // padding (smaller on mobile, bigger on desktop)
                              "px-6 py-4 md:px-10 md:py-8",

                              // look
                              "rounded-xl md:rounded-2xl",
                              "bg-black/25 md:bg-white/10 backdrop-blur-md",
                              "border border-white/10 md:border-white/15",

                              // lighter shadow on mobile
                              "shadow-lg md:shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
                            ].join(" ")}
                          >
                            {/* Primary CTA */}
                            <Button
                              asChild
                              className="
h-12 md:h-14
px-8 md:px-16
text-sm md:text-xl
rounded-full
bg-gradient-to-r from-rose-600 to-pink-600
text-white font-semibold
shadow-md md:shadow-lg
hover:scale-[1.03]
transition-transform
"
                            >
                              <Link href={slide.primaryLink} aria-label={slide.primaryText}>
                                {slide.primaryText}
                                <ArrowRight className="ml-2 h-5 w-8" />
                              </Link>
                            </Button>

                            {/* Secondary CTA (ghost/glass) */}
                            {slide.secondaryText && slide.secondaryLink && (
                              <Button
                                asChild
                                variant="ghost"
                                className="
h-12 md:h-14
px-6 md:px-12
text-sm md:text-xl
rounded-full
text-white
border border-white/20
hover:bg-white/10
"
                              >
                                <Link href={slide.secondaryLink} aria-label={slide.secondaryText}>
                                  {slide.secondaryText}
                                </Link>
                              </Button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
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
