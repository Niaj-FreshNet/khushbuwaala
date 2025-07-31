import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ShopBannerProps {
  heading: string
  text: string
  buttonText: string
  link: string
  images: {
    mobile: string
    desktop: string
  }
  altText: string
}

export function ShopBanner({ heading, text, buttonText, link, images, altText }: ShopBannerProps) {
  return (
    <section
      className="relative w-full h-[250px] md:h-[360px] overflow-hidden mt-16 group"
      aria-labelledby="shop-banner-heading"
    >
      {/* Background Images with Art Direction */}
      <div className="absolute inset-0">
        {/* Mobile Image */}
        <div className="block md:hidden">
          <Image
            src={images.mobile || "/placeholder.svg?height=250&width=768&text=Mobile Banner"}
            alt={altText}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={85}
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden md:block">
          <Image
            src={images.desktop || "/placeholder.svg?height=360&width=1920&text=Desktop Banner"}
            alt={altText}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={95}
          />
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 flex flex-col justify-center items-center text-center p-4">
        {/* Heading */}
        <h1
          id="shop-banner-heading"
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg mb-4 animate-in fade-in slide-in-from-top-8 duration-700"
        >
          {heading}
        </h1>

        {/* Text */}
        <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed drop-shadow-md mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {text}
        </p>

        {/* CTA Button */}
        <Button
          asChild
          className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:from-red-700 hover:to-pink-700 rounded-full shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-300"
        >
          <Link href={link} aria-label={buttonText}>
            {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
