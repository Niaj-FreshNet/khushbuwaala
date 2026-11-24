"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  // Ways to close a drawer besides the button: tap the dimmed area, or drag / flick a side
  // drawer back the way it came (it follows the finger and closes past a third of its width).
  const closeRef = React.useRef<HTMLButtonElement | null>(null)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const drag = React.useRef<{ x: number; y: number; t: number; active: boolean; dead: boolean; dx: number } | null>(null)
  const swipeable = side === "left" || side === "right"
  const close = React.useCallback(() => closeRef.current?.click(), [])

  const settle = (el: HTMLElement | null) => {
    if (!el) return
    el.style.transition = "transform 180ms ease-out"
    el.style.transform = ""
    window.setTimeout(() => {
      el.style.transition = ""
    }, 200)
  }
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    drag.current = t ? { x: t.clientX, y: t.clientY, t: Date.now(), active: false, dead: false, dx: 0 } : null
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const d = drag.current
    const t = e.touches[0]
    const el = panelRef.current
    if (!d || !t || !el || d.dead) return
    const dx = t.clientX - d.x
    const dy = t.clientY - d.y
    if (!d.active) {
      // an up/down move is a scroll: leave it alone for the rest of this touch
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { d.dead = true; return }
      if (Math.abs(dx) < 10) return
      d.active = true
    }
    const shift = side === "right" ? Math.max(0, dx) : Math.min(0, dx)
    d.dx = shift
    el.style.transition = "none"
    el.style.transform = `translateX(${shift}px)`
  }
  const onTouchEnd = () => {
    const d = drag.current
    const el = panelRef.current
    drag.current = null
    if (!d || !el || !d.active) return
    const far = Math.abs(d.dx) > el.offsetWidth / 3
    const fast = Math.abs(d.dx) > 40 && Date.now() - d.t < 300
    if (far || fast) {
      close()
      // let the closing animation take over, then drop the manual offset
      window.setTimeout(() => {
        el.style.transition = ""
        el.style.transform = ""
      }, 320)
    } else {
      settle(el)
    }
  }

  return (
    <SheetPortal>
      {/* Some phones did not close the drawer on a tap here, so the tap is handled directly. */}
      <SheetOverlay onClick={close} />
      <SheetPrimitive.Content
        ref={panelRef}
        data-slot="sheet-content"
        className={cn(
          swipeable && "touch-pan-y",
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-[80vw] max-w-[360px] border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-[80vw] max-w-[360px] border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
        onTouchStart={swipeable ? onTouchStart : undefined}
        onTouchMove={swipeable ? onTouchMove : undefined}
        onTouchEnd={swipeable ? onTouchEnd : undefined}
        onTouchCancel={swipeable ? onTouchEnd : undefined}
      >
        {children}
        {/* used by the flick gesture; works even where a drawer hides the visible button */}
        <SheetPrimitive.Close ref={closeRef} tabIndex={-1} aria-hidden className="sr-only" data-swipe-close="" />
        <SheetPrimitive.Close className="absolute top-3 right-3 z-20 grid h-10 w-10 min-h-0! place-items-center rounded-full bg-stone-100 text-stone-700 transition-colors hover:bg-stone-200 active:bg-stone-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none">
          <XIcon className="size-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
