import type React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  /** Kept so existing callers do not break. Every variant now draws the same calm heading. */
  variant?: "default" | "gradient" | "elegant" | "modern" | "premium";
  animated?: boolean;
  icon?: React.ReactNode;
  showDecorations?: boolean;
  underlineVariant?: "default" | "wide" | "full";
}

// One heading style for every section of the shop. It used to carry bouncing dots, a pulsing
// sparkle and a pink band that sat on top of the words; those drew the eye away from the products
// and looked different in every section.
export function SectionTitle({ title, subtitle, className, icon }: SectionTitleProps) {
  return (
    <div className={cn("px-2 pb-3 pt-1 text-center sm:pb-4", className)}>
      <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 sm:text-2xl md:text-[28px]">
        {icon && <span className="mr-2 inline-flex items-center align-middle">{icon}</span>}
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-1 max-w-2xl text-sm text-gray-600 md:text-base">{subtitle}</p>
      )}
      <span aria-hidden className="mx-auto mt-2 block h-0.5 w-10 rounded-full bg-emerald-600" />
    </div>
  );
}
