"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // ✅ Tap target + visual size
        "relative flex items-center justify-center",
        "h-6 w-6 sm:h-5 sm:w-5", // mobile bigger
        "shrink-0 rounded-[6px] border bg-background",
        "border-input shadow-xs",
        "transition-colors transition-shadow outline-none",
        // ✅ Checked styles
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        // ✅ Hover / Focus
        "hover:border-primary/60",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // ✅ Invalid / Disabled
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>

      {/* ✅ invisible larger tap target (44px) */}
      <span className="absolute -inset-3 rounded-[10px]" aria-hidden="true" />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
