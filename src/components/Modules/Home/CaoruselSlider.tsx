"use client"

import { getImageProps } from "next/image"
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
import { ArrowRight } from "lucide-react"

import { heroBoxShape, type HeroSlide } from "@/lib/storefrontSettings"

// Banners are managed in the admin panel (Home page content → Banners): pictures are uploaded
// there, with their pixel size. The box takes the shape of the first banner's pictures (inside a
// sensible range, see heroBoxShape), so artwork made to the advised size is shown whole on phones
// and on computers. Other banners fill the same box, so the page never jumps between slides.
export function CarouselSlider({ slides }: { slides: HeroSlide[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const shape = heroBoxShape(slides)
  const single = slides.length < 2

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
    <section className="w-full overflow-hidden relative mt-1 sm:mt-2 mb-2 sm:mb-4" aria-label="Offers and collections">
      <Carousel
        setApi={setApi}
        plugins={single ? [] : [plugin.current]}
        opts={{ loop: !single }}
        className="mx-auto w-full max-w-7xl md:px-4 lg:px-6"
      >
        <CarouselContent>
          {slides.map((slide, index) => {
            const first = index === 0
            // One <picture>: the browser downloads only the file for its own screen width
            // (two separate images used to make phones fetch the computer picture as well).
            const common = { alt: slide.alt, fill: true as const, sizes: "(min-width: 1280px) 1232px, 100vw" }
            const wide = getImageProps({ ...common, src: slide.image }).props
            const { srcSet: phoneSrcSet, ...img } = getImageProps({
              ...common,
              src: slide.mobileImage || slide.image,
              priority: first,
              loading: first ? undefined : "lazy",
            }).props

            return (
              <CarouselItem key={index}>
                {/* The first banner is the biggest thing on the screen: tell the browser to fetch it
                    straight away (one hint per screen size, so only the right file is fetched). */}
                {first && (
                  <>
                    <link rel="preload" as="image" media="(max-width: 767.98px)" imageSrcSet={phoneSrcSet} imageSizes={img.sizes} fetchPriority="high" />
                    <link rel="preload" as="image" media="(min-width: 768px)" imageSrcSet={wide.srcSet} imageSizes={wide.sizes} fetchPriority="high" />
                  </>
                )}
                <div
                  className="relative w-full overflow-hidden bg-gray-100 aspect-(--hero-phone) md:aspect-(--hero-wide) md:rounded-2xl"
                  style={{ "--hero-phone": shape.phone, "--hero-wide": shape.desktop } as React.CSSProperties}
                >
                  {/* The whole banner is the link, so artwork with its own text needs no button */}
                  <Link href={slide.link} aria-label={slide.buttonText || slide.alt} className="absolute inset-0 block" draggable={false}>
                    <picture>
                      <source media="(min-width: 768px)" srcSet={wide.srcSet} sizes={wide.sizes} />
                      <img {...img} srcSet={phoneSrcSet} fetchPriority={first ? "high" : "auto"} alt={slide.alt} draggable={false} className={slide.mobileWidth ? "object-cover" : "object-cover object-[center_30%] md:object-center"} />
                    </picture>
                  </Link>

                  {slide.buttonText ? (
                    <>
                      {/* A light shade at the bottom so the button reads on any picture */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/40 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-8 sm:pb-10 md:pb-12">
                        <Link
                          href={slide.link}
                          tabIndex={active === index ? 0 : -1}
                          className={[
                            "inline-flex items-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-md",
                            "h-9 px-5 text-xs font-semibold md:h-10 md:px-6 md:text-sm",
                            "shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:bg-black/40",
                            "transition-opacity duration-300 motion-reduce:transition-none",
                            active === index ? "pointer-events-auto opacity-100" : "opacity-0",
                          ].join(" ")}
                        >
                          {slide.buttonText}
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </>
                  ) : null}
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        {!single && (
          <>
            <CarouselPrevious className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/15 backdrop-blur-md transition-all" />
            <CarouselNext className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/15 backdrop-blur-md transition-all" />

            {/* Dots */}
            <div className="absolute bottom-0 sm:bottom-2 left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-black/20 px-1 backdrop-blur-xs">
                {Array.from({ length: snapCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to banner ${i + 1}`}
                    onClick={() => goTo(i)}
                    className="relative grid place-items-center rounded-full min-h-0! h-6 w-6 sm:h-7 sm:w-7 active:scale-95"
                  >
                    <span
                      className={[
                        "block rounded-full transition-all duration-300",
                        i === active
                          ? "w-4 h-1 sm:w-5 sm:h-1.5 bg-white shadow-xs"
                          : "w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/60 hover:bg-white/80",
                      ].join(" ")}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </Carousel>
    </section>
  )
}
