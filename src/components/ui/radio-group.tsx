"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // ✅ consistent circle + behaves well inside label/grid
        "relative inline-flex items-center justify-center",
        // ✅ visual size (mobile slightly bigger)
        "h-6 w-6 sm:h-5 sm:w-5",
        "shrink-0 rounded-full border border-input bg-background",
        "shadow-sm transition-colors outline-none",
        // ✅ checked state (border becomes primary)
        "data-[state=checked]:border-primary",
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
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* ✅ clean dot */}
        <span className="h-3 w-3 sm:h-2.5 sm:w-2.5 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>

      {/* ✅ bigger tap target, but MUST NOT block clicks */}
      <span
        className="absolute -inset-3 rounded-full pointer-events-none"
        aria-hidden="true"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
