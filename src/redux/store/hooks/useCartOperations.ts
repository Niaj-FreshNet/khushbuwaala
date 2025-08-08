import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCheckoutOnlyItem,
  proceedToCartCheckout,
  selectCartItems,
  selectCartItemsCount,
  selectCartSubtotal,
  selectCartTotal,
} from '../features/cart/cartSlice'
import type { Product } from '@/lib/Data/data'

// Hook for cart operations with additional utilities
export const useCartOperations = () => {
  const dispatch = useAppDispatch()
  
  // Selectors
  const cartItems = useAppSelector(selectCartItems)
  const itemsCount = useAppSelector(selectCartItemsCount)
  const subtotal = useAppSelector(selectCartSubtotal)
  const total = useAppSelector(selectCartTotal)

  // Check if a specific product/size combination is in cart
  const isInCart = useCallback(
    (productId: string, size: string) => {
      return cartItems.some((item) => item._id === productId && item.size === size)
    },
    [cartItems]
  )

  // Get quantity of a specific product/size combination
  const getItemQuantity = useCallback(
    (productId: string, size: string) => {
      const item = cartItems.find((item) => item._id === productId && item.size === size)
      return item?.quantity || 0
    },
    [cartItems]
  )

  // Add item to cart with quantity check
  const addItemToCart = useCallback(
    (product: Product, quantity: number, selectedSize: string) => {
      dispatch(addToCart({ product, quantity, selectedSize }))
    },
    [dispatch]
  )

  // Remove item from cart
  const removeItemFromCart = useCallback(
    (productId: string, size: string) => {
      dispatch(removeFromCart({ productId, size }))
    },
    [dispatch]
  )

  // Update item quantity
  const updateItemQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        dispatch(removeFromCart({ productId, size }))
      } else {
        dispatch(updateQuantity({ productId, size, quantity }))
      }
    },
    [dispatch]
  )

  // Increment item quantity
  const incrementQuantity = useCallback(
    (productId: string, size: string) => {
      const currentQuantity = getItemQuantity(productId, size)
      updateItemQuantity(productId, size, currentQuantity + 1)
    },
    [getItemQuantity, updateItemQuantity]
  )

  // Decrement item quantity
  const decrementQuantity = useCallback(
    (productId: string, size: string) => {
      const currentQuantity = getItemQuantity(productId, size)
      if (currentQuantity > 1) {
        updateItemQuantity(productId, size, currentQuantity - 1)
      }
    },
    [getItemQuantity, updateItemQuantity]
  )

  // Toggle item in cart (add if not present, remove if present)
  const toggleInCart = useCallback(
    (product: Product, size: string, quantity: number = 1) => {
      if (isInCart(product._id, size)) {
        removeItemFromCart(product._id, size)
      } else {
        addItemToCart(product, quantity, size)
      }
    },
    [isInCart, removeItemFromCart, addItemToCart]
  )

  // Clear entire cart
  const clearAllItems = useCallback(() => {
    dispatch(clearCart())
  }, [dispatch])

  // Set item for direct checkout
  const buyNow = useCallback(
    (product: Product, quantity: number, size: string) => {
      dispatch(setCheckoutOnlyItem({ product, quantity, size }))
    },
    [dispatch]
  )

  // Switch back to cart checkout
  const switchToCartCheckout = useCallback(() => {
    dispatch(proceedToCartCheckout())
  }, [dispatch])

  return {
    // State
    cartItems,
    itemsCount,
    subtotal,
    total,
    
    // Queries
    isInCart,
    getItemQuantity,
    
    // Actions
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    incrementQuantity,
    decrementQuantity,
    toggleInCart,
    clearAllItems,
    buyNow,
    switchToCartCheckout,
  }
}
