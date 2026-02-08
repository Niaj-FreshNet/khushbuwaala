"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Play, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import React, { useMemo, useRef, useState } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion"

interface BannerProps {
  heading: string
  text: string
  buttonText: string
  link: string
  images: {
    mobile: string
    tablet?: string
    desktop: string
  }
  variant?: "primary" | "secondary" | "tertiary"
  overlayPattern?: "gradient" | "geometric" | "radial"
  showVideoButton?: boolean
  videoUrl?: string
  stats?: Array<{
    value: string
    label: string
  }>
  priority?: boolean;
}

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
  stats,
  priority = false
}: BannerProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  // ✅ In-view animation (once)
  const isInView = useInView(sectionRef, { amount: 0.3, once: true })

  // ✅ Avoid overlay flicker: wait until image loads
  const [hasLoaded, setHasLoaded] = useState(false)

  // ✅ Smooth mouse highlight without setState re-renders
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(50)
  const mx = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const my = useSpring(mouseY, { stiffness: 120, damping: 20 })

  const bgImage = useTransform([mx, my], ([x, y]) => {
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12) 0%, transparent 52%)`
  })

  // ✅ Optional parallax (relative to section)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0px", "50px"])
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  const styles = useMemo(() => {
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
  }, [variant])

  // ✅ Variants (staggered + consistent)
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  }

  const itemUp: Variants = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.21, 0.61, 0.35, 1] },
    },
  }

  const itemUpSlow: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  }

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    mouseX.set(x)
    mouseY.set(y)
  }

  const enableMouse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer:fine)").matches

  return (
    <motion.section
      ref={sectionRef as any}
      id="banner-section"
      onMouseMove={enableMouse ? handleMouseMove : undefined}
      className={cn(
        "relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden mt-12 mb-4 group",
        hasLoaded ? "opacity-100" : "opacity-0"
      )}
      aria-labelledby="banner-heading"
      initial="hidden"
      animate={hasLoaded && isInView ? "show" : "hidden"}
      variants={container}
    >
      {/* Background Images (parallax via Motion) */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: parallaxY,
          scale: parallaxScale,
        }}
      >
        <div className="absolute inset-0 min-h-full block md:hidden">
          <Image
            src={images.mobile || "/placeholder.svg"}
            alt={heading}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority={priority}
            quality={85}
            onLoadingComplete={() => setHasLoaded(true)}
          />
        </div>

        <div className="absolute inset-0 min-h-full hidden md:block lg:hidden">
          <Image
            src={images.tablet || images.desktop}
            alt={heading}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority={priority}
            quality={90}
            onLoadingComplete={() => setHasLoaded(true)}
          />
        </div>

        <div className="absolute inset-0 min-h-full hidden lg:block">
          <Image
            src={images.desktop}
            alt={heading}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority={priority}
            quality={95}
            onLoadingComplete={() => setHasLoaded(true)}
          />
        </div>
      </motion.div>

      {/* Overlay (radial highlight controlled by MotionValues) */}
      <motion.div
        className={cn("absolute inset-0", styles.overlay)}
        style={{
          backgroundImage: bgImage,
        }}
      />

      {/* Soft overlay gradient so backgroundImage stacks nicely */}
      <div className={cn("absolute inset-0", styles.overlay)} />

      {/* Floating particles */}
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

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            variants={itemUp}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-sm font-medium",
              styles.decorativeColor
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Premium Fragrance Collection</span>
            <Star className="h-4 w-4" />
          </motion.div>

          <motion.h1
            id="banner-heading"
            variants={itemUp}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
          >
            <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", styles.accent)}>
              {heading.split(" ")[0]}
            </span>{" "}
            {heading.split(" ").slice(1).join(" ")}
          </motion.h1>

          <motion.p
            variants={itemUp}
            className="text-md md:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            {text}
          </motion.p>

          {stats && (
            <motion.div
              variants={itemUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={cn(
                      "text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                      styles.accent
                    )}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div
            variants={itemUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              variant={styles.buttonStyle as any}
              size="lg"
              className={cn(
                "bg-white group/button shadow-2xl transition-transform duration-300 hover:scale-105",
                styles.glowColor
              )}
            >
              <Link href={link}>
                <span className="relative z-10">{buttonText}</span>
                <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
              </Link>
            </Button>

            {showVideoButton && videoUrl && (
              <Button
                variant="ghost"
                size="lg"
                className="group/play"
                onClick={() => window.open(videoUrl, "_blank")}
              >
                <Play className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/play:scale-110" />
                Watch Video
              </Button>
            )}
          </motion.div>

          <motion.div
            variants={itemUpSlow}
            className="absolute bottom-2 md:bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-white/60" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Patterns */}
      {overlayPattern === "geometric" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rotate-45 animate-spin-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/10 rotate-12 animate-pulse" />
          <div className="absolute top-3/4 left-3/4 w-16 h-16 border border-white/10 -rotate-45 animate-bounce" />
        </div>
      )}

      {overlayPattern === "radial" && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
          }}
        />
      )}

      {/* Edge fades */}
      <div className="absolute inset-x-0 bottom-0 h-12 md:h-28 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-12 md:h-28 bg-gradient-to-b from-black/20 to-transparent" />
    </motion.section>
  )
}
