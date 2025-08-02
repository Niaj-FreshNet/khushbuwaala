import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Zap, Crown } from "lucide-react"

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
  variant?: "primary" | "secondary" | "premium"
}

export function ShopBanner({
  heading,
  text,
  buttonText,
  link,
  images,
  altText,
  variant = "primary",
}: ShopBannerProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "premium":
        return {
          overlay: "bg-gradient-to-br from-purple-950/95 via-indigo-900/90 to-blue-900/95",
          accent: "from-amber-400 via-yellow-400 to-orange-400",
          buttonStyle:
            "bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 hover:from-amber-500 hover:to-yellow-500 shadow-2xl shadow-amber-500/30",
          decorativeColor: "text-amber-300",
          glowColor: "shadow-amber-500/40",
          particleColors: ["bg-amber-400/60", "bg-yellow-400/50", "bg-orange-400/55"],
        }
      case "secondary":
        return {
          overlay: "bg-gradient-to-br from-emerald-950/95 via-teal-900/90 to-cyan-900/95",
          accent: "from-emerald-400 via-teal-400 to-cyan-400",
          buttonStyle:
            "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-2xl shadow-emerald-500/30",
          decorativeColor: "text-emerald-300",
          glowColor: "shadow-emerald-500/40",
          particleColors: ["bg-emerald-400/60", "bg-teal-400/50", "bg-cyan-400/55"],
        }
      default:
        return {
          overlay: "bg-gradient-to-br from-slate-950/95 via-red-900/90 to-pink-900/95",
          accent: "from-red-400 via-pink-400 to-rose-400",
          buttonStyle:
            "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-2xl shadow-red-500/30",
          decorativeColor: "text-red-300",
          glowColor: "shadow-red-500/40",
          particleColors: ["bg-red-400/60", "bg-pink-400/50", "bg-rose-400/55"],
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <section
      className="relative w-full h-[320px] md:h-[450px] lg:h-[550px] overflow-hidden mt-16 group"
      aria-labelledby="shop-banner-heading"
    >
      {/* Enhanced Background Images with Parallax Effect */}
      <div className="absolute inset-0 transform transition-transform duration-1000 group-hover:scale-110">
        {/* Mobile Image */}
        <div className="block md:hidden">
          <Image
            src={images.mobile || "/placeholder.svg?height=320&width=768&text=Mobile Banner"}
            alt={altText}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={90}
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden md:block">
          <Image
            src={images.desktop || "/placeholder.svg?height=550&width=1920&text=Desktop Banner"}
            alt={altText}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={95}
          />
        </div>
      </div>

      {/* Multi-Layer Enhanced Overlay System */}
      <div className="absolute inset-0">
        {/* Base gradient overlay */}
        <div className={`absolute inset-0 ${styles.overlay}`}></div>

        {/* Sophisticated texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30"></div>

        {/* Dynamic mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Premium floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${styles.particleColors[i % 3]} rounded-full blur-sm animate-float opacity-60`}
            style={{
              top: `${20 + i * 10}%`,
              left: `${15 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}

        {/* Enhanced gradient orbs */}
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${styles.accent} opacity-20 rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr ${styles.accent} opacity-15 rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "2s" }}
        />

        {/* Geometric patterns */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rotate-45 animate-spin-slow opacity-30" />
        <div className="absolute bottom-32 left-32 w-24 h-24 border border-white/15 rounded-full animate-pulse opacity-25" />
      </div>

      {/* Enhanced Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        {/* Premium Decorative Header */}
        <div className="mb-8 flex items-center space-x-4 animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className={`h-px w-12 bg-gradient-to-r ${styles.accent} opacity-80`}></div>
          <div className="flex items-center space-x-2">
            {variant === "premium" && <Crown className={`h-6 w-6 ${styles.decorativeColor} animate-pulse`} />}
            <Sparkles className={`h-5 w-5 ${styles.decorativeColor} animate-pulse`} />
            <Star className={`h-4 w-4 ${styles.decorativeColor} animate-pulse`} style={{ animationDelay: "0.5s" }} />
            <Zap className={`h-5 w-5 ${styles.decorativeColor} animate-pulse`} style={{ animationDelay: "1s" }} />
          </div>
          <div className={`h-px w-12 bg-gradient-to-l ${styles.accent} opacity-80`}></div>
        </div>

        {/* Enhanced Main Heading with Text Effects */}
        <h1
          id="shop-banner-heading"
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[0.9] drop-shadow-2xl mb-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300"
        >
          <span className="block relative">
            {heading.split(" ").slice(0, -2).join(" ")}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent blur-xl opacity-50"></div>
          </span>
          <span
            className={`block bg-gradient-to-r ${styles.accent} bg-clip-text text-transparent font-extrabold relative`}
          >
            {heading.split(" ").slice(-2).join(" ")}
            <div className={`absolute inset-0 bg-gradient-to-r ${styles.accent} opacity-20 blur-2xl`}></div>
          </span>
        </h1>

        {/* Enhanced Description with Better Typography */}
        <p className="text-white/95 text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl leading-relaxed drop-shadow-xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 font-medium">
          <span className="relative">
            {text}
            <div className="absolute -inset-2 bg-white/5 blur-xl rounded-lg opacity-50"></div>
          </span>
        </p>

        {/* Premium CTA Button with Enhanced Effects */}
        <div className="animate-in fade-in zoom-in-95 duration-1000 delay-700">
          <Button
            asChild
            className={`group relative px-12 py-6 text-lg font-bold transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl rounded-2xl ${styles.buttonStyle} border border-white/20 backdrop-blur-md ${styles.glowColor} overflow-hidden`}
          >
            <Link href={link} aria-label={`Shop now for ${heading}`}>
              {/* Button content */}
              <span className="relative z-10 flex items-center">
                {buttonText}
                <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-3" />
              </span>

              {/* Enhanced button effects */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${styles.accent} opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl`}
              ></div>
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${styles.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              ></div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            </Link>
          </Button>
        </div>

        {/* Enhanced Decorative Footer */}
        <div className="mt-10 flex items-center space-x-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-900">
          <div className={`h-px w-16 bg-gradient-to-r ${styles.accent} opacity-60`}></div>
          <div className="flex space-x-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${styles.accent} animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <div className={`h-px w-16 bg-gradient-to-l ${styles.accent} opacity-60`}></div>
        </div>
      </div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${styles.accent} opacity-10 blur-2xl`}></div>
      <div
        className={`absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl ${styles.accent} opacity-10 blur-2xl`}
      ></div>
    </section>
  )
}