"use client"

import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
      text: "Explore our curated collection of premium fragrances that define elegance and individuality.",
      buttonText: "Shop Now",
      buttonLink: "/shop",
    },
    {
      src: home2,
      alt: "Luxury Fragrance Bottles",
      heading: "Unleash Your Inner Aura",
      text: "Find the perfect perfume that resonates with your unique personality and leaves a lasting impression.",
      buttonText: "Explore Collections",
      buttonLink: "/shop",
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center text-center p-4">
                  <h1 className="text-white text-3xl md:text-6xl font-extrabold drop-shadow-lg mb-4 animate-in fade-in slide-in-from-top-10 duration-700">
                    {slide.heading}
                  </h1>
                  <p className="text-white text-md md:text-xl max-w-2xl drop-shadow-md mb-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                    {slide.text}
                  </p>
                  {slide.buttonText && slide.buttonLink && (
                    <Button
                      asChild
                      className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:from-red-700 hover:to-pink-700 rounded-full shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-300"
                    >
                      <Link href={slide.buttonLink} aria-label={slide.buttonText}>
                        <div className="flex items-center">
                          {slide.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 z-10 hidden md:flex bg-white/30 hover:bg-white/50 text-white hover:text-gray-900 rounded-full p-2 transition-all duration-300" />
        <CarouselNext className="absolute right-4 z-10 hidden md:flex bg-white/30 hover:bg-white/50 text-white hover:text-gray-900 rounded-full p-2 transition-all duration-300" />
      </Carousel>
    </section>
  )
}
