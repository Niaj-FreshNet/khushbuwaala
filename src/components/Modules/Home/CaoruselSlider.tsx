"use client"

import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import * as React from "react"

// Image assets (using placeholder for now)
const home1 = "/placeholder.svg?height=660&width=1920"
const home2 = "/placeholder.svg?height=660&width=1920"

// Client Component - Due to carousel interactivity
export function CarouselSlider() {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))

  const slides = [
    {
      src: home1,
      alt: "Exquisite Perfume Collection",
      heading: "Discover Your Signature Scent",
      text: "Explore our curated collection of premium fragrances.",
    },
    {
      src: home2,
      alt: "Luxury Fragrance Bottles",
      heading: "Unleash Your Inner Aura",
      text: "Find the perfect perfume that defines you.",
    },
  ]

  return (
    <section className="w-full overflow-hidden relative" aria-label="Hero Carousel of Perfumes">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[400px] md:h-[660px]">
                <Image
                  src={slide.src || "/placeholder.svg"}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0} // Prioritize the first image
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                  <h1 className="text-white text-3xl md:text-6xl font-extrabold drop-shadow-lg mb-4 animate-in fade-in slide-in-from-top-10 duration-700">
                    {slide.heading}
                  </h1>
                  <p className="text-white text-md md:text-xl max-w-2xl drop-shadow-md animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                    {slide.text}
                  </p>
                  {/* Add a Call to Action Button if needed */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-4 z-10 hidden md:flex" />
      </Carousel>
    </section>
  )
}
