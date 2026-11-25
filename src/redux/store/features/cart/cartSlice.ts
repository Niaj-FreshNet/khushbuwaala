import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { CartItem, CartProduct } from '@/types/cart.types'

export interface CartState {
  items: CartItem[]
  checkoutItem: CartItem | null
  checkoutMode: boolean
  isLoading: boolean
  error: string | null
  appliedCouponCode: string | null
}

const initialState: CartState = {
  items: [],
  checkoutItem: null,
  checkoutMode: false,
  isLoading: false,
  error: null,
  appliedCouponCode: null,
}

type CartStorageShape =
  | CartItem[] // old format (backward compatible)
  | { items: CartItem[]; appliedCouponCode?: string | null } // new format

const loadCartFromStorage = (): { items: CartItem[]; appliedCouponCode: string | null } => {
  if (typeof window === "undefined") return { items: [], appliedCouponCode: null }

  try {
    const raw = localStorage.getItem("cartItems")
    if (!raw) return { items: [], appliedCouponCode: null }

    const parsed: CartStorageShape = JSON.parse(raw)

    // ✅ backward compatibility: old saved value was array
    if (Array.isArray(parsed)) {
      return { items: parsed, appliedCouponCode: null }
    }

    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      appliedCouponCode: parsed.appliedCouponCode ? String(parsed.appliedCouponCode) : null,
    }
  } catch {
    return { items: [], appliedCouponCode: null }
  }
}

const saveCartToStorage = (items: CartItem[], appliedCouponCode: string | null) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      "cartItems",
      JSON.stringify({ items, appliedCouponCode })
    )
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error)
  }
}

const hydrated = loadCartFromStorage()

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    items: hydrated.items,
    appliedCouponCode: hydrated.appliedCouponCode,
  },
  reducers: {
    // Add item to cart
    addToCart: (
      state,
      action: PayloadAction<{
        product: CartProduct
        quantity: number
        selectedSize: string
        selectedPrice: number
      }>
    ) => {
      const { product, quantity, selectedSize, selectedPrice } = action.payload
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      )

      if (existingIndex !== -1) {
        // Update existing item quantity
        state.items[existingIndex].quantity += quantity
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
          selectedSize,
          selectedPrice
        })
      }
      saveCartToStorage(state.items, state.appliedCouponCode)
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string
        selectedSize: string
        quantity: number
        cartItemId?: string
      }>
    ) => {
      const { productId, selectedSize, quantity, cartItemId } = action.payload
      const itemIndex = state.items.findIndex(
        (item) => item.product.id === productId && item.selectedSize === selectedSize
      )

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = Math.max(quantity, 1)
        state.items[itemIndex].cartItemId = cartItemId
        saveCartToStorage(state.items, state.appliedCouponCode)
      }
    },

    // Remember which server cart row belongs to a line, without touching its quantity
    setCartItemId: (
      state,
      action: PayloadAction<{ productId: string; selectedSize: string; cartItemId: string }>
    ) => {
      const { productId, selectedSize, cartItemId } = action.payload
      const item = state.items.find((i) => i.product.id === productId && i.selectedSize === selectedSize)
      if (item && item.cartItemId !== cartItemId) {
        item.cartItemId = cartItemId
        saveCartToStorage(state.items, state.appliedCouponCode)
      }
    },

    // Remove item from cart
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; size: string }>
    ) => {
      const { productId, size } = action.payload
      state.items = state.items.filter(
        (item) => item.product.id !== productId || item.selectedSize !== size
      )
      saveCartToStorage(state.items, state.appliedCouponCode)
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = []
      state.appliedCouponCode = null
      saveCartToStorage(state.items, state.appliedCouponCode)
    },

    // Set checkout only item (for buy now functionality)
    setCheckoutOnlyItem: (
      state,
      action: PayloadAction<{
        product: CartProduct
        quantity: number
        selectedSize: string
        selectedPrice: number
      }>
    ) => {
      const { product, quantity, selectedSize, selectedPrice } = action.payload
      state.checkoutItem = {
        product,
        quantity,
        selectedSize,
        selectedPrice
      }
      state.checkoutMode = true
    },

    // Proceed to cart checkout (disable single item checkout mode)
    proceedToCartCheckout: (state) => {
      state.checkoutMode = false
      state.checkoutItem = null
    },

    setAppliedCouponCode: (state, action: PayloadAction<string | null>) => {
      state.appliedCouponCode = action.payload ? String(action.payload).trim().toUpperCase() : null
      saveCartToStorage(state.items, state.appliedCouponCode)
    },

    clearAppliedCouponCode: (state) => {
      state.appliedCouponCode = null
      saveCartToStorage(state.items, state.appliedCouponCode)
    },

  },
})

export const {
  addToCart,
  updateQuantity,
  setCartItemId,
  removeFromCart,
  clearCart,
  setCheckoutOnlyItem,
  proceedToCartCheckout,
  setAppliedCouponCode,
  clearAppliedCouponCode,
} = cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items

export const selectAppliedCouponCode = (state: { cart: CartState }) =>
  state.cart.appliedCouponCode

export const selectCheckoutItem = (state: { cart: CartState }) => state.cart.checkoutItem
export const selectCheckoutMode = (state: { cart: CartState }) => state.cart.checkoutMode
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading
export const selectCartError = (state: { cart: CartState }) => state.cart.error
