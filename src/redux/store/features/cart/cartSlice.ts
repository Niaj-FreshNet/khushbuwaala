import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProductResponse } from '@/types/product.types'

export interface CartItem {
  product: IProductResponse
  quantity: number
  selectedSize: string
}

export interface CartState {
  items: CartItem[]
  checkoutItem: CartItem | null
  checkoutMode: boolean
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  checkoutItem: null,
  checkoutMode: false,
  isLoading: false,
  error: null,
}

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const savedCart = localStorage.getItem('cartItems')
    return savedCart ? JSON.parse(savedCart) : []
  } catch {
    return []
  }
}

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('cartItems', JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    items: loadCartFromStorage(),
  },
  reducers: {
    // Add item to cart
    addToCart: (
      state,
      action: PayloadAction<{
        product: IProductResponse
        quantity: number
        selectedSize: string
      }>
    ) => {
      const { product, quantity, selectedSize } = action.payload
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
        })
      }

      saveCartToStorage(state.items)
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string
        size: string
        quantity: number
      }>
    ) => {
      const { productId, size, quantity } = action.payload
      const itemIndex = state.items.findIndex(
        (item) => item.product.id === productId && item.selectedSize === size
      )

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = Math.max(quantity, 1)
        saveCartToStorage(state.items)
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
      saveCartToStorage(state.items)
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },

    // Set checkout only item (for buy now functionality)
    setCheckoutOnlyItem: (
      state,
      action: PayloadAction<{
        product: IProductResponse
        quantity: number
        selectedSize: string
      }>
    ) => {
      const { product, quantity, selectedSize } = action.payload
      state.checkoutItem = {
        product,
        quantity,
        selectedSize,
      }
      state.checkoutMode = true
    },

    // Proceed to cart checkout (disable single item checkout mode)
    proceedToCartCheckout: (state) => {
      state.checkoutMode = false
      state.checkoutItem = null
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Initialize cart from localStorage (for hydration)
    initializeCart: (state) => {
      state.items = loadCartFromStorage()
    },
  },
})

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCheckoutOnlyItem,
  proceedToCartCheckout,
  setLoading,
  setError,
  initializeCart,
} = cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items

export const selectCartItemsCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => {
    const price =
      item.product.variants?.find((v) => v.size === Number(item.selectedSize))?.price ||
      item.product.minPrice ||
      0
    return total + price * item.quantity
  }, 0)

export const selectCartTotal = (state: { cart: CartState }) => {
  const subtotal = selectCartSubtotal(state)
  const taxes = subtotal * 0.0 // No taxes for now
  return subtotal + taxes
}

export const selectCheckoutItem = (state: { cart: CartState }) => state.cart.checkoutItem
export const selectCheckoutMode = (state: { cart: CartState }) => state.cart.checkoutMode
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading
export const selectCartError = (state: { cart: CartState }) => state.cart.error
