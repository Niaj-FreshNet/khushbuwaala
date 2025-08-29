import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  setCheckoutOnlyItem as setCheckoutOnlyItemAction,
  proceedToCartCheckout as proceedToCartCheckoutAction,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCheckoutItem,
  selectCheckoutMode,
  selectCartLoading,
  selectCartError,
} from '../features/cart/cartSlice'
import type { IProductResponse } from '@/types/product.types'

export interface CartItem {
  product: IProductResponse;
  quantity: number;
  variantId: string; // direct reference to chosen variant
}

// Custom hook that maintains the same interface as the original useCart context
export const useCart = () => {
  const dispatch = useAppDispatch()
  
  // Selectors
  const cartItems = useAppSelector(selectCartItems)
  const checkoutItem = useAppSelector(selectCheckoutItem)
  const checkoutMode = useAppSelector(selectCheckoutMode)
  const isLoading = useAppSelector(selectCartLoading)
  const error = useAppSelector(selectCartError)

  // Actions
  const addToCart = useCallback(
    (product: IProductResponse, quantity: number, selectedSize: string) => {
      dispatch(addToCartAction({ product, quantity, selectedSize }))
    },
    [dispatch]
  )

  const removeFromCart = useCallback(
    (productId: string, size: string) => {
      dispatch(removeFromCartAction({ productId, size }))
    },
    [dispatch]
  )

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      dispatch(updateQuantityAction({ productId, size, quantity }))
    },
    [dispatch]
  )

  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.variantPrices?.[item.size] || item.product.price || 0
      return total + price * item.quantity
    }, 0)
  }, [cartItems])

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal()
    const taxes = subtotal * 0.0 // No taxes for now
    return subtotal + taxes
  }, [calculateSubtotal])

  const setCheckoutOnlyItem = useCallback(
    (product: IProductResponse, quantity: number, size: string) => {
      dispatch(setCheckoutOnlyItemAction({ product, quantity, size }))
    },
    [dispatch]
  )

  const proceedToCartCheckout = useCallback(() => {
    dispatch(proceedToCartCheckoutAction())
  }, [dispatch])

  const clearCart = useCallback(() => {
    dispatch(clearCartAction())
  }, [dispatch])

  return {
    cartItems,
    checkoutItem,
    checkoutMode,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateSubtotal,
    calculateTotal,
    setCheckoutOnlyItem,
    proceedToCartCheckout,
    clearCart,
  }
}
