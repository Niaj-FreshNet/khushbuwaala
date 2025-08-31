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
import type { IProductResponse } from '@/types/product.types'

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
      return cartItems.some((item) => item.product.id === productId && item.size === size)
    },
    [cartItems]
  )

  // Get quantity of a specific product/size combination
  const getItemQuantity = useCallback(
    (productId: string, size: string) => {
      const item = cartItems.find((item) => item.product.id === productId && item.size === size)
      return item?.quantity || 0
    },
    [cartItems]
  )

  // Add item to cart
  const addItemToCart = useCallback(
    (product: IProductResponse, quantity: number, selectedSize: string) => {
      dispatch(addToCart({ product, quantity, selectedSize }))
    },
    [dispatch]
  )

  const removeItemFromCart = useCallback(
    (productId: string, size: string) => {
      dispatch(removeFromCart({ productId, size }))
    },
    [dispatch]
  )

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

  const incrementQuantity = useCallback(
    (productId: string, size: string) => {
      const currentQuantity = getItemQuantity(productId, size)
      updateItemQuantity(productId, size, currentQuantity + 1)
    },
    [getItemQuantity, updateItemQuantity]
  )

  const decrementQuantity = useCallback(
    (productId: string, size: string) => {
      const currentQuantity = getItemQuantity(productId, size)
      if (currentQuantity > 1) {
        updateItemQuantity(productId, size, currentQuantity - 1)
      }
    },
    [getItemQuantity, updateItemQuantity]
  )

  const toggleInCart = useCallback(
    (product: IProductResponse, size: string, quantity: number = 1) => {
      if (isInCart(product.id, size)) {
        removeItemFromCart(product.id, size)
      } else {
        addItemToCart(product, quantity, size)
      }
    },
    [isInCart, removeItemFromCart, addItemToCart]
  )

  const clearAllItems = useCallback(() => {
    dispatch(clearCart())
  }, [dispatch])

  const buyNow = useCallback(
    (product: IProductResponse, quantity: number, size: string) => {
      dispatch(setCheckoutOnlyItem({ product, quantity, size }))
    },
    [dispatch]
  )

  const switchToCartCheckout = useCallback(() => {
    dispatch(proceedToCartCheckout())
  }, [dispatch])

  return {
    cartItems,
    itemsCount,
    subtotal,
    total,
    isInCart,
    getItemQuantity,
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
