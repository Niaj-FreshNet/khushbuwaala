import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star } from "lucide-react"

interface BannerProps {
  heading: string
  text: string
  buttonText: string
  link: string
  // Art direction approach - different images for different breakpoints
  images: {
    mobile: string // 768px width, 400px height - portrait/square crop
    tablet?: string // 1024px width, 500px height - landscape crop
    desktop: string // 1920px width, 600px height - wide landscape crop
  }
  variant?: "primary" | "secondary" | "tertiary"
  overlayPattern?: "gradient" | "geometric" | "radial"
}

// Server Component - Purely presentational
export function BannerSection({
  heading,
  text,
  buttonText,
  link,
  images,
  variant = "primary",
  overlayPattern = "gradient",
}: BannerProps) {
  // Dynamic styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          overlay: "bg-gradient-to-br from-slate-900/90 via-purple-900/85 to-rose-900/90",
          accent: "from-rose-400 via-pink-400 to-purple-400",
          buttonStyle: "bg-white/95 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-slate-900 shadow-2xl",
          decorativeColor: "text-rose-300",
          glowColor: "shadow-rose-500/30",
          particleColors: ["bg-rose-400/40", "bg-pink-400/30", "bg-purple-400/35"],
        }
      case "secondary":
        return {
          overlay: "bg-gradient-to-br from-indigo-950/90 via-blue-900/85 to-cyan-900/90",
          accent: "from-cyan-400 via-blue-400 to-indigo-400",
          buttonStyle: "bg-white/95 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-slate-900 shadow-2xl",
          decorativeColor: "text-cyan-300",
          glowColor: "shadow-cyan-500/30",
          particleColors: ["bg-cyan-400/40", "bg-blue-400/30", "bg-indigo-400/35"],
        }
      case "tertiary":
        return {
          overlay: "bg-gradient-to-br from-amber-950/90 via-orange-900/85 to-red-900/90",
          accent: "from-amber-400 via-orange-400 to-red-400",
          buttonStyle: "bg-white/95 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-slate-900 shadow-2xl",
          decorativeColor: "text-amber-300",
          glowColor: "shadow-amber-500/30",
          particleColors: ["bg-amber-400/40", "bg-orange-400/30", "bg-red-400/35"],
        }
      default:
        return {
          overlay: "bg-gradient-to-br from-slate-900/90 via-purple-900/85 to-rose-900/90",
          accent: "from-rose-400 via-pink-400 to-purple-400",
          buttonStyle: "bg-white/95 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-slate-900 shadow-2xl",
          decorativeColor: "text-rose-300",
          glowColor: "shadow-rose-500/30",
          particleColors: ["bg-rose-400/40", "bg-pink-400/30", "bg-purple-400/35"],
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <section
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden my-8 group"
      aria-labelledby="banner-heading"
    >
      {/* Optimized Background Images with Art Direction */}
      <div className="absolute inset-0 transform transition-transform duration-700 group-hover:scale-105">
        {/* Mobile Image (up to 768px) */}
        <div className="block md:hidden">
          <Image
            src={images.mobile || "/placeholder.svg"}
            alt={heading}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={85}
          />
        </div>

        {/* Tablet Image (768px to 1024px) - fallback to desktop if not provided */}
        <div className="hidden md:block lg:hidden">
          <Image
            src={images.tablet || images.desktop}
            alt={heading}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={90}
          />
        </div>

        {/* Desktop Image (1024px and up) */}
        <div className="hidden lg:block">
          <Image
            src={images.desktop || "/placeholder.svg"}
            alt={heading}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={95}
          />
        </div>
      </div>

      {/* Sophisticated Multi-Layer Overlay */}
      <div className="absolute inset-0">
        {/* Base gradient overlay */}
        <div className={`absolute inset-0 ${styles.overlay}`}></div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>

        {/* Dynamic pattern overlay based on type */}
        {overlayPattern === "geometric" && (
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-20 left-20 w-40 h-40 border border-white/30 rotate-45 animate-pulse"></div>
            <div className="absolute top-32 right-32 w-28 h-28 border border-white/20 rounded-full animate-bounce"></div>
            <div className="absolute bottom-32 left-32 w-20 h-20 bg-white/10 rotate-12 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 border border-white/25 rotate-12 animate-pulse"></div>
          </div>
        )}

        {overlayPattern === "radial" && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-radial-gradient from-white/10 via-transparent to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-radial-gradient from-white/5 to-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Beautiful floating particles with varied colors */}
        <div
          className={`absolute top-1/4 left-1/4 w-3 h-3 ${styles.particleColors[0]} rounded-full animate-float blur-sm`}
        ></div>
        <div
          className={`absolute top-1/3 right-1/3 w-4 h-4 ${styles.particleColors[1]} rounded-full animate-float-delayed blur-sm`}
        ></div>
        <div
          className={`absolute bottom-1/4 left-1/3 w-2 h-2 ${styles.particleColors[2]} rounded-full animate-float-slow blur-sm`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/5 w-2.5 h-2.5 ${styles.particleColors[0]} rounded-full animate-float blur-sm`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute bottom-1/3 right-1/4 w-3.5 h-3.5 ${styles.particleColors[1]} rounded-full animate-float-delayed blur-sm`}
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Sophisticated gradient orbs with better positioning */}
        <div
          className={`absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br ${styles.accent} opacity-20 rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr ${styles.accent} opacity-15 rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-l ${styles.accent} opacity-10 rounded-full blur-2xl animate-pulse`}
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Subtle light rays effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-12 animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/3 to-transparent transform -rotate-12 animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        {/* Decorative Top Element */}
        <div className="mb-6 flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className={`h-6 w-6 ${styles.decorativeColor} animate-pulse`} />
          <div className={`h-px w-16 bg-gradient-to-r ${styles.accent}`}></div>
          <Star className={`h-5 w-5 ${styles.decorativeColor} animate-pulse`} style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Main Heading */}
        <h2
          id="banner-heading"
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-2xl mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
        >
          <span className="block">{heading.split(" ").slice(0, -1).join(" ")}</span>
          <span className={`block bg-gradient-to-r ${styles.accent} bg-clip-text text-transparent`}>
            {heading.split(" ").slice(-1)[0]}
          </span>
        </h2>

        {/* Description Text */}
        <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl leading-relaxed drop-shadow-lg mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
          {text}
        </p>

        {/* CTA Button with Enhanced Design */}
        <div className="animate-in fade-in zoom-in-95 duration-700 delay-600">
          <Button
            asChild
            className={`group relative px-10 py-5 text-lg font-bold transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl rounded-2xl ${styles.buttonStyle} border border-white/30 backdrop-blur-md ${styles.glowColor}`}
          >
            <Link href={link} aria-label={`Shop now for ${heading}`}>
              <span className="relative z-10 flex items-center">
                {buttonText}
                <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
              {/* Enhanced button glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${styles.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl`}
              ></div>
              {/* Inner glow */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${styles.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
            </Link>
          </Button>
        </div>

        {/* Decorative Bottom Element */}
        <div className="mt-8 flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
          <div className={`h-px w-12 bg-gradient-to-r ${styles.accent}`}></div>
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${styles.accent} animate-pulse`}></div>
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${styles.accent} animate-pulse`}
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${styles.accent} animate-pulse`}
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
          <div className={`h-px w-12 bg-gradient-to-l ${styles.accent}`}></div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  )
}
