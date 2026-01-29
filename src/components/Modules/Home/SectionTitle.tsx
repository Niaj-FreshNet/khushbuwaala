"use client"

import type React from "react"
import { useMemo, useRef } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Sparkles, Star } from "lucide-react"
import { motion, useInView, useReducedMotion, Variants } from "framer-motion"

interface SectionTitleProps {
  title: string
  subtitle?: string
  underlineWidth?: string
  className?: string
  variant?: "default" | "gradient" | "elegant" | "modern" | "premium"
  animated?: boolean
  icon?: React.ReactNode
  showDecorations?: boolean
  underlineVariant?: "default" | "wide" | "full"
}

export function SectionTitle({
  title,
  subtitle,
  underlineWidth = "w-36",
  className,
  variant = "default",
  animated = true,
  icon,
  showDecorations = true,
  underlineVariant = "default",
}: SectionTitleProps) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement | null>(null)

  // ✅ stable in-view trigger (no manual IntersectionObserver)
  const inView = useInView(wrapRef, { amount: 0.15, once: true })

  const styles = useMemo(() => {
    switch (variant) {
      case "gradient":
        return {
          title: "bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent",
          underline: "bg-gradient-to-r from-red-500 via-pink-500 to-purple-500",
          container: "relative",
        }
      case "elegant":
        return {
          title: "text-gray-800 font-serif",
          underline: "bg-gradient-to-r from-transparent via-red-500 to-transparent",
          container: "relative",
        }
      case "modern":
        return {
          title: "text-gray-900 font-black tracking-tight",
          underline: "bg-red-500 shadow-lg shadow-red-500/30",
          container: "relative",
        }
      case "premium":
        return {
          title: "text-gray-900 font-bold relative",
          underline: "bg-gradient-to-r from-amber-400 via-red-500 to-amber-400",
          container: "relative",
        }
      default:
        return {
          title: "text-gray-900",
          underline: "bg-red-500",
          container: "relative",
        }
    }
  }, [variant])

  const underlineStyles = useMemo(() => {
    if (underlineVariant === "full") {
      return {
        widthClass: "w-full",
        heightClass: "h-2.5",
        gradientClass: "bg-gradient-to-r from-red-600 via-pink-600 to-purple-600",
        shadowClass: "shadow-xl shadow-red-500/40",
        borderClass: "border border-white/20",
        showSideLines: false,
      }
    }

    if (underlineVariant === "wide") {
      return {
        widthClass: "w-64",
        heightClass: "h-1.5",
        gradientClass: styles.underline,
        shadowClass: "shadow-lg",
        borderClass: "",
        showSideLines: true,
      }
    }

    return {
      widthClass: underlineWidth || "w-36",
      heightClass: "h-1.5",
      gradientClass: styles.underline,
      shadowClass: "shadow-lg",
      borderClass: "",
      showSideLines: true,
    }
  }, [underlineVariant, underlineWidth, styles.underline])

  // ✅ Decide whether we animate
  const shouldAnimate = animated && !reduce

  const root: Variants = shouldAnimate
    ? {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }
    : { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }

  const titleV: Variants = shouldAnimate
    ? {
        hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
      }
    : { hidden: { opacity: 1 }, show: { opacity: 1 } }

  const subV: Variants = shouldAnimate
    ? {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.08 } },
      }
    : { hidden: { opacity: 1 }, show: { opacity: 1 } }

  const lineV: Variants = shouldAnimate
    ? {
        hidden: { scaleX: 0, opacity: 0 },
        show: { scaleX: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.12 } },
      }
    : { hidden: { scaleX: 1, opacity: 1 }, show: { scaleX: 1, opacity: 1 } }

  const dotsV: Variants = shouldAnimate
    ? {
        hidden: { opacity: 0, y: 6 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.18 } },
      }
    : { hidden: { opacity: 1 }, show: { opacity: 1 } }

  return (
    <motion.div
      ref={wrapRef}
      className={cn("text-center py-4 relative overflow-hidden", styles.container, className)}
      variants={root}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {/* Background Decorations (kept exactly, but no dependency on state) */}
      {showDecorations && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <div className={cn("absolute top-4 left-1/4 w-2 h-2 bg-red-400 rounded-full opacity-60", shouldAnimate && inView && "animate-bounce")} style={{ animationDelay: "0.5s" }} />
            <div className={cn("absolute top-8 right-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-40", shouldAnimate && inView && "animate-pulse")} style={{ animationDelay: "1s" }} />
            <div className={cn("absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50", shouldAnimate && inView && "animate-bounce")} style={{ animationDelay: "1.5s" }} />
            <div className={cn("absolute bottom-4 right-1/4 w-1 h-1 bg-red-300 rounded-full opacity-30", shouldAnimate && inView && "animate-pulse")} style={{ animationDelay: "2s" }} />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/30 to-transparent blur-3xl opacity-50" />
        </>
      )}

      <div className="relative z-10">
        {/* Icon (you had it commented; keeping optional and safe) */}
        {/* {icon && (
          <motion.div
            className="flex justify-center mb-4"
            variants={titleV}
          >
            <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-full shadow-lg">
              <div className="text-red-600">{icon}</div>
            </div>
          </motion.div>
        )} */}

        {/* Title */}
        <motion.h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold mb-3 relative",
            styles.title
          )}
          variants={titleV}
        >
          {variant === "premium" && (
            <>
              <span className="absolute -top-2 -left-2 text-amber-400 opacity-20 text-6xl font-black -z-10">
                {title.charAt(0)}
              </span>
              <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-amber-400 opacity-60 animate-pulse" />
            </>
          )}

          {variant === "elegant" && (
            <>
              <Star className="absolute -top-2 -left-8 h-4 w-4 text-red-400 opacity-40" />
              <Star className="absolute -top-2 -right-8 h-4 w-4 text-red-400 opacity-40" />
            </>
          )}

          {title}

          {variant === "modern" && (
            <span className="absolute inset-0 text-red-100 transform translate-x-1 translate-y-1 -z-10">
              {title}
            </span>
          )}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="text-gray-600 text-md md:text-lg mb-4 max-w-2xl mx-auto"
            variants={subV}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Underline */}
        <div className="flex justify-center items-center space-x-4 mb-2 w-full">
          {underlineStyles.showSideLines && (
            <motion.div
              className="h-px bg-gradient-to-r from-transparent to-red-300 w-8 md:w-16 origin-left"
              variants={lineV}
            />
          )}

          <div className={cn("relative", underlineVariant === "full" ? "w-full" : underlineStyles.widthClass)}>
            <motion.div variants={lineV} className={cn("origin-center")}>
              <Separator
                className={cn(
                  "rounded-full relative overflow-hidden",
                  underlineStyles.heightClass,
                  underlineStyles.gradientClass,
                  underlineStyles.shadowClass,
                  underlineStyles.borderClass,
                  underlineVariant !== "full" && underlineStyles.widthClass
                )}
              >
                {/* Keep your shimmer */}
                <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12", shouldAnimate && "animate-shimmer")} />
              </Separator>

              {underlineVariant === "full" && (
                <div
                  className="absolute inset-x-0 -bottom-1 h-4 bg-gradient-to-r from-red-300/50 via-pink-300/50 to-purple-300/50 blur-md opacity-70 rounded-full"
                />
              )}
            </motion.div>
          </div>

          {underlineStyles.showSideLines && (
            <motion.div
              className="h-px bg-gradient-to-l from-transparent to-red-300 w-8 md:w-16 origin-right"
              variants={lineV}
            />
          )}
        </div>

        {/* Decorative dots */}
        <motion.div className="flex justify-center space-x-2" variants={dotsV}>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.9s" }} />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "1.2s" }} />
        </motion.div>
      </div>

      {/* Hover overlay (kept) */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  )
}
