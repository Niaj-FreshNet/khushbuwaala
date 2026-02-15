"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Heart, MessageCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SearchDrawer from "../Modules/Search/SearchDrawer"
import { useEffect, useMemo, useRef, useState } from "react"

type NavItem = {
  key: string
  label: string
  path?: string
  ariaLabel: string
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
}

function useIsMobileUA() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])
  return isMobile
}

function useHideOnScroll() {
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const y = window.scrollY || 0
        const goingDown = y > lastY.current
        const pastThreshold = y > 120
        setVisible(!(goingDown && pastThreshold))
        lastY.current = y
        ticking.current = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return visible
}

export default function BottomBar() {
  const pathname = usePathname()
  const isMobileDevice = useIsMobileUA()
  const isVisible = useHideOnScroll()

  const [searchVisible, setSearchVisible] = useState(false)
  const [cartBump, setCartBump] = useState(false)

  useEffect(() => {
    const onCartAdded = () => {
      setCartBump(true)
      setTimeout(() => setCartBump(false), 900)
    }
    window.addEventListener("kw:cart-added", onCartAdded)
    return () => window.removeEventListener("kw:cart-added", onCartAdded)
  }, [])

  const haptic = (ms: number) => {
    if (isMobileDevice && "vibrate" in navigator) navigator.vibrate(ms)
  }

  const handleMessengerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    haptic(70)

    const messengerAppUrl = "fb-messenger://user-thread/111483794112905"
    const messengerWebUrl = "https://m.me/111483794112905"

    if (isMobileDevice) {
      window.location.href = messengerAppUrl
      setTimeout(() => {
        window.open(messengerWebUrl, "_blank", "noopener noreferrer")
      }, 450)
    } else {
      window.open(messengerWebUrl, "_blank", "noopener noreferrer")
    }
  }

  const isActive = (path?: string) => {
    if (!path) return false
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const navItems: NavItem[] = useMemo(
    () => [
      { key: "home", label: "Home", path: "/", ariaLabel: "Go to homepage", icon: <Home className="h-5 w-5" /> },
      { key: "shop", label: "Shop", path: "/shop", ariaLabel: "Go to shop page", icon: <ShoppingBag className="h-5 w-5" /> },
      { key: "support", label: "Support", ariaLabel: "Chat with us on Messenger", icon: <MessageCircle className="h-5 w-5" />, onClick: handleMessengerClick },
      { key: "wishlist", label: "Wishlist", path: "/wishlist", ariaLabel: "View wishlist", icon: <Heart className="h-5 w-5" /> },
      { key: "cart", label: "Cart", path: "/cart", ariaLabel: "View cart", icon: <ShoppingBag className="h-5 w-5" /> },
    ],
    [pathname, isMobileDevice]
  )

  return (
    <>
      {/* subtle fade above */}
      <div
        className={cn(
          "fixed lg:hidden left-0 right-0 bottom-0 z-40 pointer-events-none",
          "h-16 bg-gradient-to-t from-white/75 via-white/25 to-transparent backdrop-blur-[2px] transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      <nav
        className={cn(
          "fixed lg:hidden left-0 right-0 bottom-0 z-50 transition-transform duration-200 ease-out",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
        aria-label="Mobile bottom navigation"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white/92 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-12px_28px_-18px_rgba(0,0,0,0.45)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50/35 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-2">
            {/* ✅ A bit taller + better bottom padding so labels look “normal” */}
            <div className="h-[62px] flex items-center justify-between px-1 pt-1 pb-2">
              {navItems.map((item) => {
                const active = isActive(item.path)
                const isCart = item.key === "cart"

                const container =
                  "group relative w-full flex justify-center"
                const tap =
                  "active:scale-[0.97] transition-transform duration-150"

                const ActiveBG =
                  "bg-gradient-to-b from-red-50 to-white ring-1 ring-red-200 shadow-[0_10px_18px_-14px_rgba(239,68,68,0.65)]"

                const InactiveBG =
                  "hover:bg-gray-50/80"

                const Content = (
                  <div
                    className={cn(
                      "relative flex flex-col items-center justify-center",
                      "w-[74px] rounded-2xl",
                      "py-2", // ✅ gives space for label (fix weird text)
                      "transition-all duration-200",
                      active ? ActiveBG : InactiveBG
                    )}
                  >
                    {/* soft glow for full area (not only icon) */}
                    {active && (
                      <span className="pointer-events-none absolute -inset-2 rounded-[22px] bg-red-500/10 blur-md" />
                    )}

                    <div className="relative">
                      <div
                        className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center",
                          "transition-colors duration-200",
                          active ? "text-red-600" : "text-gray-600 group-hover:text-gray-900"
                        )}
                      >
                        <div
                          className={cn(
                            "transition-transform duration-200",
                            "group-hover:scale-110",
                            active && "scale-110"
                          )}
                        >
                          {item.icon}
                        </div>
                      </div>

                      {isCart && cartBump && (
                        <span className="absolute inset-0 rounded-xl ring-4 ring-emerald-200 animate-pulse" />
                      )}
                    </div>

                    <span
                      className={cn(
                        "mt-0.5 text-[10.5px] leading-none font-semibold tracking-tight",
                        active ? "text-red-600" : "text-gray-700"
                      )}
                    >
                      {item.label}
                    </span>

                    {/* selected indicator line */}
                    <span
                      className={cn(
                        "mt-1 h-[3px] w-8 rounded-full transition-all duration-200",
                        active ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-transparent"
                      )}
                    />
                  </div>
                )

                return (
                  <div key={item.key} className={container}>
                    {item.path ? (
                      <Link
                        href={item.path}
                        aria-label={item.ariaLabel}
                        onClick={() => haptic(30)}
                        className={cn("flex-1 flex justify-center", tap)}
                      >
                        {Content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          haptic(40)
                          item.onClick?.(e)
                        }}
                        aria-label={item.ariaLabel}
                        className={cn("flex-1 flex justify-center", tap)}
                      >
                        {Content}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* safe area (small, but keeps iPhone home bar happy) */}
            <div className="h-[max(4px,env(safe-area-inset-bottom))]" />
          </div>
        </div>
      </nav>

      {/* Search FAB (compact) */}
      <div
        className={cn(
          "fixed lg:hidden right-4 z-40 transition-all duration-200",
          isVisible ? "bottom-[78px]" : "bottom-3"
        )}
      >
        <Button
          size="icon"
          onClick={() => {
            haptic(20)
            setSearchVisible(true)
          }}
          aria-label="Search products"
          className={cn(
            "h-11 w-11 rounded-full",
            "bg-gray-900 text-white hover:bg-gray-800",
            "shadow-xl transition-all duration-200",
            "border border-white/10"
          )}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <SearchDrawer visible={searchVisible} onClose={() => setSearchVisible(false)} />
    </>
  )
}
