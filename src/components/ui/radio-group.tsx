"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

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
        // ✅ Tap target + visual size
        "relative flex items-center justify-center",
        "h-6 w-6 sm:h-5 sm:w-5", // mobile bigger
        "shrink-0 rounded-full border bg-background",
        "border-input text-primary shadow-xs",
        "transition-colors transition-shadow outline-none",
        // ✅ States
        "hover:border-primary/60",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        {/* ✅ cleaner dot */}
        <span className="block h-3 w-3 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>

      {/* ✅ invisible larger tap target (44px) */}
      <span className="absolute -inset-3 rounded-full" aria-hidden="true" />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
