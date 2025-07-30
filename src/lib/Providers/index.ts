"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/context/cart.context"
import { WishlistProvider } from "@/context/wishlist.context"

export function Providers({ children }: { children: ReactNode }) {
  return children;
}
