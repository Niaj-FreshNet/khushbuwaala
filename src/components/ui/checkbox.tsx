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
        // ✅ consistent square + behaves well inside label/grid
        "relative inline-flex items-center justify-center",
        // ✅ visual size (mobile slightly bigger)
        "h-6 w-6 sm:h-5 sm:w-5",
        "shrink-0 rounded-md border border-input bg-background",
        "shadow-sm transition-colors outline-none",
        // ✅ checked
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        // ✅ hover/focus
        "hover:border-primary/60",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // ✅ disabled/invalid
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
      </CheckboxPrimitive.Indicator>

      {/* ✅ bigger tap target, but MUST NOT block clicks */}
      <span
        className="absolute -inset-3 rounded-[10px] pointer-events-none"
        aria-hidden="true"
      />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
