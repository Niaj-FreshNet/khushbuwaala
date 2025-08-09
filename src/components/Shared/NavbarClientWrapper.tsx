"use client"

import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import React, { useState, useEffect } from "react"

import NavDrawer from "./NavDrawer"
import CartDrawer from "../Modules/Cart/CartDrawer"
import SearchDrawer from "../Modules/Search/SearchDrawer"

interface NavbarClientWrapperProps {
  children: (props: {
    handlers: {
      toggleDrawer: () => void
      openCart: () => void
      closeCart: () => void
      openSearch: () => void
      closeSearch: () => void
    }
    counts: {
      cart: number
      wishlist: number
    }
    drawerOpen: boolean
  }) => React.ReactNode
}

export function NavbarClientWrapper({ children }: NavbarClientWrapperProps) {
  const { cartItems } = useCart() || {
    cartItems: [],
  }
  //   const { wishlistItems } = useWishlist()

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cartVisible, setCartVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)

  const handleScroll = () => {
    const currentScrollTop = window.pageYOffset
    if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
    setLastScrollTop(currentScrollTop)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollTop])

  const handlers = {
    toggleDrawer: () => setDrawerOpen((prev) => !prev),
    openCart: () => setCartVisible(true),
    closeCart: () => setCartVisible(false),
    openSearch: () => setSearchVisible(true),
    closeSearch: () => setSearchVisible(false),
  }

  const counts = {
    cart: cartItems.length,
    // wishlist: wishlistItems.length,
    // cart: 3,
    wishlist: 2,
  }

  return (
    <>
      <div
        className={`fixed w-full z-50 transition-all duration-500 ease-out ${
          isVisible ? "top-0 translate-y-0" : "-top-20 -translate-y-full"
        }`}
      >
        {children({ handlers, counts, drawerOpen })}
      </div>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CartDrawer visible={cartVisible} onClose={handlers.closeCart} />
      <SearchDrawer visible={searchVisible} onClose={handlers.closeSearch} />
    </>
  )
}
