"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Heart, MessageCircle, User, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import SearchDrawer from "../Modules/Search/SearchDrawer"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/redux/store/hooks/useAuth"

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
  const { user } = useAuth()

  const [searchVisible, setSearchVisible] = useState(false)
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

  // Determine path, icon, and label based on authentication status
  const profilePath = user ? "/my-account" : "/login"
  const profileLabel = user ? "Profile" : "Login"
  const profileIcon = user ? <User className="h-5 w-5" /> : <User className="h-5 w-5" />

  const navItems: NavItem[] = useMemo(
    () => [
      { key: "home", label: "Home", path: "/", ariaLabel: "Go to homepage", icon: <Home className="h-5 w-5" /> },
      { key: "shop", label: "Shop", path: "/shop", ariaLabel: "Go to shop page", icon: <ShoppingBag className="h-5 w-5" /> },
      { key: "wishlist", label: "Wishlist", path: "/wishlist", ariaLabel: "View wishlist", icon: <Heart className="h-5 w-5" /> },
      { key: "support", label: "Support", ariaLabel: "Chat with us on Messenger", icon: <MessageCircle className="h-5 w-5" />, onClick: handleMessengerClick },
      {
        key: "profile",
        label: profileLabel,
        path: profilePath,
        ariaLabel: user ? "View profile" : "Log in to your account",
        icon: profileIcon,
      },
    ],
    [pathname, isMobileDevice, user, profilePath, profileLabel, profileIcon]
  )

  // Product and checkout pages have their own bottom action bar. This check sits after every hook
  // so the number of hooks never changes between pages.
  if (pathname.startsWith("/product/") || pathname.startsWith("/checkout")) return null

  return (
    <>
      <nav
        className={cn(
          "fixed lg:hidden left-0 right-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-[0_-6px_16px_-12px_rgba(0,0,0,0.35)]",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
        aria-label="Mobile bottom navigation"
      >
        {/* The bar is exactly as tall as its content, so sliding it down hides all of it
            (a strip of the active tab used to stay on screen) */}
        <div className="mx-auto flex h-14 max-w-7xl items-stretch px-1">
          {navItems.map((item) => {
            const active = isActive(item.path)
            const inner = (
              <span
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-xl transition-colors duration-150",
                  active ? "text-emerald-700" : "text-gray-600"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-150",
                    active && "bg-emerald-50"
                  )}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-semibold leading-none">{item.label}</span>
              </span>
            )
            const cls = "min-w-0 flex-1 py-1 active:scale-[0.97] transition-transform duration-150 min-h-0!"
            return item.path ? (
              <Link
                key={item.key}
                href={item.path}
                aria-label={item.ariaLabel}
                aria-current={active ? "page" : undefined}
                onClick={() => haptic(30)}
                className={cls}
              >
                {inner}
              </Link>
            ) : (
              <button
                key={item.key}
                type="button"
                onClick={(e) => {
                  haptic(40)
                  item.onClick?.(e)
                }}
                aria-label={item.ariaLabel}
                className={cls}
              >
                {inner}
              </button>
            )
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      <SearchDrawer visible={searchVisible} onClose={() => setSearchVisible(false)} />
    </>
  )
}