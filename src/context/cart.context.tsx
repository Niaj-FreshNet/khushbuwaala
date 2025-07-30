"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/Data/data" // Import Product interface

interface CartItem extends Product {
  quantity: number
  size: string // Added size to CartItem
  variantPrices?: { [key: string]: number } // Explicitly added variantPrices to CartItem for clarity
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize from localStorage on client-side
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems")
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })

  const [checkoutItem, setCheckoutItem] = useState<CartItem | null>(null)
  const [checkoutMode, setCheckoutMode] = useState(false)

  // Persist cartItems to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (product: Product, quantity: number, selectedSize: string) => {
    setCartItems((prev) => {
      const existingProductIndex = prev.findIndex((item) => item._id === product._id && item.size === selectedSize)

      if (existingProductIndex !== -1) {
        const updatedCartItems = [...prev]
        updatedCartItems[existingProductIndex].quantity += quantity
        return updatedCartItems
      } else {
        // Ensure variantPrices is copied from product if it exists
        return [...prev, { ...product, quantity, size: selectedSize, variantPrices: product.variantPrices }]
      }
    })
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId && item.size === size ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (productId: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId || item.size !== size))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Ensure variantPrices and selected size exist before accessing
      const price = item.variantPrices?.[item.size] || item.price || 0
      return total + price * item.quantity
    }, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const taxes = subtotal * 0.0 // e.g., 0% tax rate
    return subtotal + taxes
  }

  const setCheckoutOnlyItem = (product: Product, quantity: number, size: string) => {
    setCheckoutItem({ ...product, quantity, size, variantPrices: product.variantPrices })
    setCheckoutMode(true) // Enable single-item checkout
  }

  const proceedToCartCheckout = () => {
    setCheckoutMode(false) // Normal checkout mode for all cart items
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateSubtotal,
        calculateTotal,
        setCheckoutOnlyItem,
        proceedToCartCheckout,
        checkoutItem,
        checkoutMode,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
