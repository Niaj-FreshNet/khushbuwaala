"use client"

import { useEffect, type ReactNode } from "react"
import { useAppDispatch } from "@/lib/store/hooks"
import { initializeCart } from "@/lib/store/features/cart/cartSlice"
import { initializeWishlist } from "@/lib/store/features/wishlist/wishlistSlice"

interface ReduxInitializerProps {
  children: ReactNode
}

export default function ReduxInitializer({ children }: ReduxInitializerProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize cart from localStorage when the app starts
    dispatch(initializeCart())
    dispatch(initializeWishlist())
  }, [dispatch])

  return <>{children}</>
}
