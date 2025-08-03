import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl active:scale-95",
        destructive:
          "bg-destructive text-white shadow-lg hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:shadow-xl active:scale-95",
        outline:
          "border bg-background shadow-lg hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:shadow-xl active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/80 hover:shadow-xl active:scale-95",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline active:scale-95",
        // Enhanced variants for modern UI
        gradient: 
          "bg-gradient-to-r from-red-600 via-red-600 to-pink-600 text-white shadow-lg hover:from-red-700 hover:via-red-700 hover:to-pink-700 hover:shadow-xl hover:shadow-red-500/25 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        "gradient-secondary":
          "bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        glass:
          "bg-white/80 backdrop-blur-xl border border-white/20 text-gray-800 shadow-xl hover:bg-white/90 hover:shadow-2xl active:scale-95",
        "glass-dark":
          "bg-black/20 backdrop-blur-xl border border-white/10 text-white shadow-xl hover:bg-black/30 hover:shadow-2xl active:scale-95",
        floating:
          "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl hover:from-red-600 hover:to-pink-600 hover:shadow-3xl hover:scale-110 active:scale-95 rounded-full border-2 border-white/20",
        shimmer:
          "bg-gradient-to-r from-gray-200 via-white to-gray-200 text-gray-800 shadow-lg hover:shadow-xl active:scale-95 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        "danger-gradient":
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/25 active:scale-95",
        "success-gradient":
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/25 active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4 text-base font-semibold",
        xl: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg font-semibold",
        icon: "size-9 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-12 rounded-lg",
        "icon-xl": "size-14 rounded-xl",
        fab: "size-12 rounded-full", // Floating Action Button
        "fab-lg": "size-16 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Enhanced button component with loading state and haptic feedback
function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  hapticFeedback = false,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    hapticFeedback?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add haptic feedback for mobile devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    if (onClick && !loading) {
      onClick(e)
    }
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          <span className="opacity-70">Loading...</span>
        </>
      ) : (
        children
      )}
      
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-200">
        <div className="absolute inset-0 bg-white/20 rounded-[inherit] scale-0 group-active:scale-100 transition-transform duration-200 ease-out" />
      </div>
    </Comp>
  )
}

export { Button, buttonVariants }
