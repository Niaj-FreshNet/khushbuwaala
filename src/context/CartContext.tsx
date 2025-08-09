"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useCart as useReduxCart } from "@/lib/store/hooks/useCart"
import type { Product } from "@/lib/Data/data"

interface CartItem extends Product {
  quantity: number
  size: string
  variantPrices?: { [key: string]: number }
}

interface CartContextType {
  cartItems: CartItem[]
  checkoutItem: CartItem | null
  checkoutMode: boolean
  addToCart: (product: Product, quantity: number, selectedSize: string) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  calculateSubtotal: () => number
  calculateTotal: () => number
  setCheckoutOnlyItem: (product: Product, quantity: number, size: string) => void
  proceedToCartCheckout: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Compatibility wrapper that bridges Context API to Redux
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Get cart state and actions from Redux
  const reduxCart = useReduxCart()

  return (
    <CartContext.Provider value={reduxCart}>
      {children}
    </CartContext.Provider>
  )
}

// Export the useCart hook that returns the Redux-based cart
export const useCart = () => {
  const context = useContext(CartContext)
  // For backward compatibility, also return the Redux cart directly if context is not available
  return context || useReduxCart()
}
