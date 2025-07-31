import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BannerProps {
  heading: string
  text: string
  buttonText: string
  link: string
  bannerMobile: string
  bannerDesktop: string
}

// Server Component - Purely presentational
export function BannerSection({ heading, text, buttonText, link, bannerMobile, bannerDesktop }: BannerProps) {
  return (
    <section className="relative w-full h-[300px] md:h-[480px] overflow-hidden my-8" aria-labelledby="banner-heading">
      <picture>
        <source media="(min-width: 768px)" srcSet={bannerDesktop} />
        <Image
          src={bannerMobile || "/placeholder.svg"} // Fallback image for mobile
          alt={heading}
          fill
          sizes="100vw"
          className="object-cover transition-opacity duration-300 ease-in-out"
          priority // Prioritize banner images
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-br from-red-800/70 via-pink-800/60 to-purple-800/70 flex flex-col justify-center items-center text-center p-6">
        <h2
          id="banner-heading"
          className="text-white text-3xl md:text-5xl font-extrabold tracking-wide leading-tight drop-shadow-lg mb-4 animate-in fade-in slide-in-from-top-10 duration-700"
        >
          {heading}
        </h2>
        <p className="text-white text-md md:text-lg mt-2 max-w-2xl drop-shadow-md mb-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          {text}
        </p>
        <Button
          asChild
          className="px-8 py-3 bg-white text-red-600 font-semibold transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-100 rounded-full shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-300"
        >
          <Link href={link} aria-label={`Shop now for ${heading}`}>
            {buttonText}
          </Link>
        </Button>
      </div>
    </section>
  )
}
