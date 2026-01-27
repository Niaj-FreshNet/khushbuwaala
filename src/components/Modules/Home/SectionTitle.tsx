"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Sparkles, Star } from "lucide-react"

interface SectionTitleProps {
  title: string
  subtitle?: string
  underlineWidth?: string
  className?: string
  variant?: "default" | "gradient" | "elegant" | "modern" | "premium"
  animated?: boolean
  icon?: React.ReactNode
  showDecorations?: boolean
  underlineVariant?: "default" | "wide" | "full" // New prop
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
  underlineVariant = "default", // Default to "default"
}: SectionTitleProps) {
  const [isVisible, setIsVisible] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // setTimeout(() => setIsVisible(true), 100)
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => observer.disconnect()
  }, [animated])

  const getVariantStyles = () => {
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
  }

  const styles = getVariantStyles()

  const getUnderlineStyles = () => {
    if (underlineVariant === "full") {
      return {
        widthClass: "w-full",
        heightClass: "h-2.5", // Thicker
        gradientClass: "bg-gradient-to-r from-red-600 via-pink-600 to-purple-600", // More vibrant
        shadowClass: "shadow-xl shadow-red-500/40", // More pronounced shadow
        borderClass: "border border-white/20", // Subtle white border
        showSideLines: false,
      }
    } else if (underlineVariant === "wide") {
      return {
        widthClass: "w-64", // Wider than default
        heightClass: "h-1.5",
        gradientClass: styles.underline, // Use existing variant gradient
        shadowClass: "shadow-lg",
        borderClass: "",
        showSideLines: true,
      }
    } else {
      // default
      return {
        widthClass: underlineWidth || "w-36", // Use prop or default to w-36
        heightClass: "h-1.5",
        gradientClass: styles.underline,
        shadowClass: "shadow-lg",
        borderClass: "",
        showSideLines: true,
      }
    }
  }

  const underlineStyles = getUnderlineStyles()

  return (
    <div ref={titleRef} className={cn("text-center py-4 relative overflow-hidden", styles.container, className)}>
      {/* Background Decorations */}
      {showDecorations && (
        <>
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className={cn(
                "absolute top-4 left-1/4 w-2 h-2 bg-red-400 rounded-full opacity-60",
                animated && isVisible && "animate-bounce",
              )}
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className={cn(
                "absolute top-8 right-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-40",
                animated && isVisible && "animate-pulse",
              )}
              style={{ animationDelay: "1s" }}
            />
            <div
              className={cn(
                "absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50",
                animated && isVisible && "animate-bounce",
              )}
              style={{ animationDelay: "1.5s" }}
            />
            <div
              className={cn(
                "absolute bottom-4 right-1/4 w-1 h-1 bg-red-300 rounded-full opacity-30",
                animated && isVisible && "animate-pulse",
              )}
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/30 to-transparent blur-3xl opacity-50" />
        </>
      )}

      {/* Icon and Title Container */}
      <div className="relative z-10">
        {/* Icon */}
        {/* {icon && (
          <div
            className={cn(
              "flex justify-center mb-4 transform transition-all duration-700",
              animated && (isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
            )}
          >
            <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-full shadow-lg">
              <div className="text-red-600">{icon}</div>
            </div>
          </div>
        )} */}

        {/* Main Title */}
        <h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold mb-3 relative transform transition-all duration-700",
            styles.title,
            animated && (isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"),
          )}
        >
          {/* Premium variant gold accent */}
          {variant === "premium" && (
            <>
              <span className="absolute -top-2 -left-2 text-amber-400 opacity-20 text-6xl font-black -z-10">
                {title.charAt(0)}
              </span>
              <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-amber-400 opacity-60 animate-pulse" />
            </>
          )}

          {/* Elegant variant decorative elements */}
          {variant === "elegant" && (
            <>
              <Star className="absolute -top-2 -left-8 h-4 w-4 text-red-400 opacity-40" />
              <Star className="absolute -top-2 -right-8 h-4 w-4 text-red-400 opacity-40" />
            </>
          )}

          {title}

          {/* Modern variant shadow effect */}
          {variant === "modern" && (
            <span className="absolute inset-0 text-red-100 transform translate-x-1 translate-y-1 -z-10">{title}</span>
          )}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={cn(
              "text-gray-600 text-md md:text-lg mb-4 max-w-2xl mx-auto transform transition-all duration-700",
              animated && (isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
            )}
            style={{ transitionDelay: "0.2s" }}
          >
            {subtitle}
          </p>
        )}

        {/* Enhanced Underline */}
        <div className="flex justify-center items-center space-x-4 mb-2 w-full">
          {/* Left decorative line */}
          {underlineStyles.showSideLines && (
            <div
              className={cn(
                "h-px bg-gradient-to-r from-transparent to-red-300 w-8 md:w-16 transform transition-all duration-700",
                animated && (isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"),
              )}
              style={{ transitionDelay: "0.4s" }}
            />
          )}

          <div className={cn("relative", underlineVariant === "full" ? "w-full" : underlineStyles.widthClass)}>
            <Separator
              className={cn(
                "rounded-full transform transition-all duration-700 relative overflow-hidden",
                underlineStyles.heightClass,
                underlineStyles.gradientClass,
                underlineStyles.shadowClass,
                underlineStyles.borderClass, // Apply border class here
                animated && (isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"),
                underlineVariant !== "full" && underlineStyles.widthClass, // Apply width here for non-full variants
              )}
              style={{ transitionDelay: "0.3s" }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer" />
            </Separator>
            {underlineVariant === "full" && (
              <div
                className={cn(
                  "absolute inset-x-0 -bottom-1 h-4 bg-gradient-to-r from-red-300/50 via-pink-300/50 to-purple-300/50 blur-md opacity-70 rounded-full",
                  animated && (isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"),
                )}
                style={{ transitionDelay: "0.3s" }}
              />
            )}
          </div>

          {/* Right decorative line */}
          {underlineStyles.showSideLines && (
            <div
              className={cn(
                "h-px bg-gradient-to-l from-transparent to-red-300 w-8 md:w-16 transform transition-all duration-700",
                animated && (isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"),
              )}
              style={{ transitionDelay: "0.4s" }}
            />
          )}
        </div>

        {/* Decorative dots */}
        <div
          className={cn(
            "flex justify-center space-x-2 transform transition-all duration-700",
            animated && (isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"),
          )}
          style={{ transitionDelay: "0.5s" }}
        >
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.9s" }} />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "1.2s" }} />
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  )
}
