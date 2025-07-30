"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Product } from "@/lib/Data/data" // Import Product interface

interface WishlistItem extends Product {
  // Wishlist items can extend Product directly if no extra fields are needed
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    // Initialize from localStorage on client-side
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlistItems")
      return savedWishlist ? JSON.parse(savedWishlist) : []
    }
    return []
  })

  // Persist wishlistItems to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems])

  const addToWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      // Check if the product already exists in the wishlist by _id
      const existingProduct = prev.some((item) => item._id === product._id)
      if (!existingProduct) {
        return [...prev, product]
      }
      return prev // Return previous state if product already exists
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => {
      const updatedWishlist = prev.filter((item) => item._id !== productId)
      // localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist)); // This is handled by the useEffect
      return updatedWishlist
    })
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return context
}
