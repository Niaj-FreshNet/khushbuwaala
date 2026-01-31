"use client"

import { useCart } from "@/context/CartContext"
import React, { useEffect, useMemo, useRef, useState } from "react"
import NavDrawer from "./NavDrawer"
import CartDrawer from "../Modules/Cart/CartDrawer"
import SearchDrawer from "../Modules/Search/SearchDrawer"
import { useAppSelector } from "@/redux/store/hooks"
import { selectWishlistCount } from "@/redux/store/features/wishlist/wishlistSlice"

interface NavbarClientWrapperProps {
  children: (props: {
    handlers: {
      toggleDrawer: () => void
      openCart: () => void
      closeCart: () => void
      openSearch: () => void
      closeSearch: () => void
    }
    counts: { cart: number; wishlist: number }
    drawerOpen: boolean
    cartBump: boolean
  }) => React.ReactNode
}

export function NavbarClientWrapper({ children }: NavbarClientWrapperProps) {
  const { cartItems } = useCart() || { cartItems: [] }
  const wishlistCount = useAppSelector(selectWishlistCount)

  const [isVisible, setIsVisible] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cartVisible, setCartVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [cartBump, setCartBump] = useState(false)

  const [instantReveal, setInstantReveal] = useState(false)

  // refs = smoother + no rebind issues
  const lastScrollTopRef = useRef(0)
  const lockUntilRef = useRef(0)
  const bumpTimerRef = useRef<number | null>(null)
  const instantTimerRef = useRef<number | null>(null)

  const handlers = useMemo(() => ({
    toggleDrawer: () => setDrawerOpen((prev) => !prev),
    openCart: () => setCartVisible(true),
    closeCart: () => setCartVisible(false),
    openSearch: () => setSearchVisible(true),
    closeSearch: () => setSearchVisible(false),
  }), [])

  const counts = useMemo(() => ({
    cart: cartItems.length,
    wishlist: wishlistCount,
  }), [cartItems.length, wishlistCount])

  // Scroll hide/show (premium)
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      if (now < lockUntilRef.current) return // locked visible

      const current = window.pageYOffset
      const last = lastScrollTopRef.current

      // hide only when scrolling down enough
      if (current > last && current > 120) setIsVisible(false)
      else setIsVisible(true)

      lastScrollTopRef.current = current
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const onRevealNav = () => {
      setInstantReveal(true)
      setIsVisible(true)
      lockUntilRef.current = Date.now() + 900
      if (instantTimerRef.current) window.clearTimeout(instantTimerRef.current)
      instantTimerRef.current = window.setTimeout(() => setInstantReveal(false), 50)
    }

    const onCartAdded = () => {
      setIsVisible(true)
      lockUntilRef.current = Date.now() + 1400

      setCartBump(true)
      if (bumpTimerRef.current) window.clearTimeout(bumpTimerRef.current)
      bumpTimerRef.current = window.setTimeout(() => setCartBump(false), 900)
    }

    // ✅ NEW: open cart drawer (after animation)
    const onOpenCart = () => {
      // console.log("kw:open-cart received ✅");
      setIsVisible(true)
      lockUntilRef.current = Date.now() + 1400
      setCartVisible(true)

      // ✅ always fire (even if already open)
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("kw:cart-opened"));
      }, 50);
    }

    window.addEventListener("kw:reveal-nav", onRevealNav)
    window.addEventListener("kw:cart-added", onCartAdded)
    window.addEventListener("kw:open-cart", onOpenCart)

    return () => {
      window.removeEventListener("kw:reveal-nav", onRevealNav)
      window.removeEventListener("kw:cart-added", onCartAdded)
      window.removeEventListener("kw:open-cart", onOpenCart)

      if (bumpTimerRef.current) window.clearTimeout(bumpTimerRef.current)
      if (instantTimerRef.current) window.clearTimeout(instantTimerRef.current)
    }
  }, [])

  return (
    <>
      <div
        className={[
          "fixed w-full z-50",
          "will-change-transform",
          instantReveal ? "transition-none" : "transition-transform duration-500 ease-out",
          isVisible ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
      >
        {children({ handlers, counts, drawerOpen, cartBump })}
      </div>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CartDrawer visible={cartVisible} onClose={handlers.closeCart} />
      <SearchDrawer visible={searchVisible} onClose={handlers.closeSearch} />
    </>
  )
}
