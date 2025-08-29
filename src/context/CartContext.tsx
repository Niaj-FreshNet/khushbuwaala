"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useCart as useReduxCart } from "@/redux/store/hooks/useCart"
import type { CartItem } from "@/redux/store/features/cart/cartSlice"
import type { IProductResponse } from "@/types/product.types"

interface CartContextType {
  cartItems: CartItem[]
  checkoutItem: CartItem | null
  checkoutMode: boolean
  addToCart: (product: IProductResponse, quantity: number, selectedSize: string) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  calculateSubtotal: () => number
  calculateTotal: () => number
  setCheckoutOnlyItem: (product: IProductResponse, quantity: number, size: string) => void
  proceedToCartCheckout: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Compatibility wrapper that bridges Context API to Redux
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const reduxCart = useReduxCart() // ✅ comes from slice

  return (
    <CartContext.Provider value={reduxCart}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  return context || useReduxCart()
}
