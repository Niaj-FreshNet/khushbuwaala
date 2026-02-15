"use client";

import type React from "react";
import { useMemo, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Sparkles, Star } from "lucide-react";
import { useInViewOnce } from "@/components/Shared/useInViewOnce";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  underlineWidth?: string;
  className?: string;
  variant?: "default" | "gradient" | "elegant" | "modern" | "premium";
  animated?: boolean;
  icon?: React.ReactNode;
  showDecorations?: boolean;
  underlineVariant?: "default" | "wide" | "full";
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
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // respects reduced motion (no framer)
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const inView = useInViewOnce(wrapRef, { threshold: 0.15 });

  // styles (you can tweak later, but keeps same structure)
  const styles = useMemo(() => {
    const base = {
      container: "",
      title: "text-gray-900",
      accent: "",
    };

    if (variant === "gradient") {
      base.title = "bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent";
    }

    if (variant === "premium") {
      base.title = "text-white";
      base.container = "rounded-2xl bg-gradient-to-r from-black via-zinc-900 to-black py-6";
    }

    return base;
  }, [variant]);

  const underlineStyles = useMemo(() => {
    const wide = underlineVariant === "wide";
    const full = underlineVariant === "full";

    return {
      widthClass: full ? "w-full" : wide ? "w-64 md:w-80" : underlineWidth,
      heightClass: "h-1",
      gradientClass: "bg-gradient-to-r from-red-400 via-pink-400 to-purple-400",
      shadowClass: "shadow-sm",
      borderClass: "",
      showSideLines: !full,
    };
  }, [underlineVariant, underlineWidth]);

  return (
    <div ref={wrapRef} className={cn("text-center py-4 relative overflow-hidden", styles.container, className)}>
      {showDecorations && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <div
              className={cn(
                "absolute top-4 left-1/4 w-2 h-2 bg-red-400 rounded-full opacity-60",
                inView && !reduce && "animate-bounce"
              )}
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className={cn(
                "absolute top-8 right-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-40",
                inView && !reduce && "animate-pulse"
              )}
              style={{ animationDelay: "1s" }}
            />
            <div
              className={cn(
                "absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50",
                inView && !reduce && "animate-bounce"
              )}
              style={{ animationDelay: "1.5s" }}
            />
            <div
              className={cn(
                "absolute bottom-4 right-1/4 w-1 h-1 bg-red-300 rounded-full opacity-30",
                inView && !reduce && "animate-pulse"
              )}
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/30 to-transparent blur-3xl opacity-50" />
        </>
      )}

      <div className="relative z-10">
        <h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold mb-3 relative",
            styles.title,
            animated && !reduce
              ? cn(
                "transition-all duration-700 ease-out",
                inView ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-3 blur-[6px]"
              )
              : "opacity-100"
          )}
        >
          {icon && <span className="inline-flex items-center mr-2 align-middle">{icon}</span>}

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
        </h2>

        {subtitle && (
          <p
            className={cn(
              variant === "premium" ? "text-gray-200" : "text-gray-600",
              "text-md md:text-lg mb-4 max-w-2xl mx-auto",
              animated && !reduce
                ? cn(
                  "transition-all duration-700 ease-out delay-75",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )
                : "opacity-100"
            )}
          >
            {subtitle}
          </p>
        )}

        {/* underline */}
        <div className="flex justify-center items-center space-x-4 mb-2 w-full">
          {underlineStyles.showSideLines && (
            <div
              className={cn(
                "h-px bg-gradient-to-r from-transparent to-red-300 w-8 md:w-16 origin-left",
                animated && !reduce
                  ? cn("transition-transform duration-700 ease-out", inView ? "scale-x-100" : "scale-x-0")
                  : "scale-x-100"
              )}
            />
          )}

          <div className={cn("relative", underlineVariant === "full" ? "w-full" : underlineStyles.widthClass)}>
            <div
              className={cn(
                "origin-center",
                animated && !reduce
                  ? cn("transition-all duration-700 ease-out", inView ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0")
                  : "opacity-100 scale-x-100"
              )}
            >
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
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent",
                    animated && !reduce && "shimmer-sweep motion-reduce:animate-none"
                  )}
                />
              </Separator>

              {underlineVariant === "full" && (
                <div className="absolute inset-x-0 -bottom-1 h-4 bg-gradient-to-r from-red-300/50 via-pink-300/50 to-purple-300/50 blur-md opacity-70 rounded-full" />
              )}
            </div>
          </div>

          {underlineStyles.showSideLines && (
            <div
              className={cn(
                "h-px bg-gradient-to-l from-transparent to-red-300 w-8 md:w-16 origin-right",
                animated && !reduce
                  ? cn("transition-transform duration-700 ease-out", inView ? "scale-x-100" : "scale-x-0")
                  : "scale-x-100"
              )}
            />
          )}
        </div>

        <div
          className={cn(
            "flex justify-center space-x-2 transition-opacity duration-700",
            animated && !reduce ? (inView ? "opacity-100" : "opacity-0") : "opacity-100"
          )}
        >
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.9s" }} />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "1.2s" }} />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}
