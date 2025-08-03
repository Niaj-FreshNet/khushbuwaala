"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Play, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

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
  showVideoButton?: boolean
  videoUrl?: string
  stats?: Array<{
    value: string
    label: string
  }>
}

// Client Component with advanced interactions
export function BannerSection({
  heading,
  text,
  buttonText,
  link,
  images,
  variant = "primary",
  overlayPattern = "gradient",
  showVideoButton = false,
  videoUrl,
  stats
}: BannerProps) {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    // Intersection Observer for reveal animation
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    const bannerElement = document.getElementById('banner-section')
    if (bannerElement) observer.observe(bannerElement)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (bannerElement) observer.unobserve(bannerElement)
    }
  }, [])

  // Dynamic styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          overlay: "bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-rose-900/95",
          accent: "from-rose-400 via-pink-400 to-purple-400",
          buttonStyle: "gradient",
          decorativeColor: "text-rose-300",
          glowColor: "shadow-rose-500/30",
          particleColors: ["bg-rose-400/40", "bg-pink-400/30", "bg-purple-400/35"],
        }
      case "secondary":
        return {
          overlay: "bg-gradient-to-br from-indigo-950/95 via-blue-900/90 to-cyan-900/95",
          accent: "from-cyan-400 via-blue-400 to-indigo-400",
          buttonStyle: "gradient-secondary",
          decorativeColor: "text-cyan-300",
          glowColor: "shadow-cyan-500/30",
          particleColors: ["bg-cyan-400/40", "bg-blue-400/30", "bg-indigo-400/35"],
        }
      case "tertiary":
        return {
          overlay: "bg-gradient-to-br from-amber-950/95 via-orange-900/90 to-red-900/95",
          accent: "from-amber-400 via-orange-400 to-red-400",
          buttonStyle: "gradient",
          decorativeColor: "text-amber-300",
          glowColor: "shadow-amber-500/30",
          particleColors: ["bg-amber-400/40", "bg-orange-400/30", "bg-red-400/35"],
        }
      default:
        return {
          overlay: "bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-rose-900/95",
          accent: "from-rose-400 via-pink-400 to-purple-400",
          buttonStyle: "gradient",
          decorativeColor: "text-rose-300",
          glowColor: "shadow-rose-500/30",
          particleColors: ["bg-rose-400/40", "bg-pink-400/30", "bg-purple-400/35"],
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <section
      id="banner-section"
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden my-8 group"
      aria-labelledby="banner-heading"
    >
      {/* Optimized Background Images with Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-700"
        style={{
          transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`
        }}
      >
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

        {/* Tablet Image (768px to 1024px) */}
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

        {/* Desktop Image (1024px+) */}
        <div className="hidden lg:block">
          <Image
            src={images.desktop}
            alt={heading}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={95}
          />
        </div>
      </div>

      {/* Enhanced Overlay with Mouse Interaction */}
      <div 
        className={cn("absolute inset-0 transition-all duration-500", styles.overlay)}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%), ${styles.overlay.replace('bg-gradient-to-br', 'linear-gradient(135deg)')}`
        }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {styles.particleColors.map((color, index) => (
          <div
            key={index}
            className={cn(
              "absolute w-2 h-2 rounded-full opacity-60",
              color,
              index === 0 && "animate-float top-1/4 left-1/4",
              index === 1 && "animate-float-delayed top-3/4 right-1/4",
              index === 2 && "animate-float-slow top-1/2 left-3/4"
            )}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Decorative Element */}
          <div 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-sm font-medium transition-all duration-700",
              styles.decorativeColor,
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Premium Fragrance Collection</span>
            <Star className="h-4 w-4" />
          </div>

          {/* Enhanced Heading */}
          <h1
            id="banner-heading"
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight transition-all duration-1000 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", styles.accent)}>
              {heading.split(' ')[0]}
            </span>{' '}
            {heading.split(' ').slice(1).join(' ')}
          </h1>

          {/* Enhanced Description */}
          <p 
            className={cn(
              "text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {text}
          </p>

          {/* Enhanced Stats Section */}
          {stats && (
            <div 
              className={cn(
                "grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto transition-all duration-1000 delay-600",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={cn("text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", styles.accent)}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div 
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <Button
              asChild
              variant={styles.buttonStyle as any}
              size="xl"
              className={cn(
                "group/button shadow-2xl transition-all duration-300 hover:scale-105",
                styles.glowColor
              )}
              hapticFeedback
            >
              <Link href={link}>
                <div className="flex items-center">
                  <span className="relative z-10">{buttonText}</span>
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
                </div>
              </Link>
            </Button>

            {showVideoButton && videoUrl && (
              <Button
                variant="glass"
                size="xl"
                className="group/play"
                onClick={() => window.open(videoUrl, '_blank')}
              >
                <Play className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/play:scale-110" />
                Watch Video
              </Button>
            )}
          </div>

          {/* Scroll Indicator */}
          <div 
            className={cn(
              "absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Geometric Patterns */}
      {overlayPattern === "geometric" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rotate-45 animate-spin-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/10 rotate-12 animate-pulse" />
          <div className="absolute top-3/4 left-3/4 w-16 h-16 border border-white/10 -rotate-45 animate-bounce" />
        </div>
      )}

      {/* Radial Pattern */}
      {overlayPattern === "radial" && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`
          }}
        />
      )}

      {/* Enhanced Edge Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />
    </section>
  )
}
