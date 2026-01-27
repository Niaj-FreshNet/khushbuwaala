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
  selectCheckoutItem,
  selectCheckoutMode,
  selectCartLoading,
  selectCartError,
} from '../features/cart/cartSlice'
import type { IProductResponse } from '@/types/product.types'
import { useAddToCartMutation, useUpdateCartItemMutation, useRemoveCartItemMutation } from '@/redux/store/api/cart/cartApi'
import { useRouter } from 'next/navigation'
// import { toast } from 'sonner'

export const useCart = () => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const checkoutItem = useAppSelector(selectCheckoutItem)
  const checkoutMode = useAppSelector(selectCheckoutMode)
  const isLoading = useAppSelector(selectCartLoading)
  const error = useAppSelector(selectCartError)

  // RTK Query mutations (silent background API)
  const [addToCartApi] = useAddToCartMutation()
  const [updateCartItemApi] = useUpdateCartItemMutation()
  const [removeCartItemApi] = useRemoveCartItemMutation()

  const router = useRouter()

  // -------------------- CART ACTIONS --------------------
  const addToCart = useCallback(
    async (product: IProductResponse, quantity: number, selectedSize: string, selectedPrice: number) => {
      dispatch(addToCartAction({ product, quantity, selectedSize, selectedPrice }))
      // toast.success(`${product.name} added to cart!`)

      try {
        const variant = product?.variants?.find(
          (v) => `${v.size} ${v.unit.toLowerCase()}` === selectedSize
        )
        const response = await addToCartApi({
          productId: product.id,
          variantId: variant?.id || null,
          size: variant?.size || null,
          unit: variant?.unit || null,
          quantity,
        }).unwrap()
        // console.log('response', response)

        // ✅ Assume backend returns { id: 'cartItemId', ... }
        if (response?.data?.id) {
          dispatch(
            updateQuantityAction({
              productId: product.id,
              selectedSize,
              quantity,
              cartItemId: response.data.id,
            })
          )
          // console.log('dispatch done')
        }
      } catch (err) {
        console.warn('Failed to sync add to cart API', err)
      }
    },
    [dispatch, addToCartApi]
  )

  const removeFromCart = useCallback(
    async (productId: string, size: string, productName?: string, cartItenId?: string) => {
      dispatch(removeFromCartAction({ productId, size }))
      // if (productName) toast.info(`${productName} removed from cart`)

      if (cartItenId) {
        try {
          await removeCartItemApi(cartItenId).unwrap()
        } catch (err) {
          console.warn('Failed to remove cart item API', err)
        }
      }
    },
    [dispatch, removeCartItemApi]
  )

  const updateQuantity = useCallback(
    async (productId: string, selectedSize: string, quantity: number, productName?: string, cartItemId?: string) => {
      dispatch(updateQuantityAction({ productId, selectedSize, quantity, cartItemId }))
      // if (productName) toast.success(`${productName} quantity updated to ${quantity}`)

      if (cartItemId) {
        try {
          await updateCartItemApi({ id: cartItemId, quantity }).unwrap()
        } catch (err) {
          console.warn('Failed to update cart item API', err)
        }
      }
    },
    [dispatch, updateCartItemApi]
  )

  // -------------------- CALCULATIONS --------------------
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.selectedPrice ?? 0
      return total + price * item.quantity
    }, 0)
  }, [cartItems])

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal()
    const taxes = subtotal * 0.0
    return subtotal + taxes
  }, [calculateSubtotal])

  // -------------------- CHECKOUT / CLEAR --------------------
  const setCheckoutOnlyItem = useCallback(
    (product: IProductResponse, quantity: number, selectedSize: string, selectedPrice: number) => {
      dispatch(setCheckoutOnlyItemAction({ product, quantity, selectedSize, selectedPrice }))
      router.push('/checkout')
    },
    [dispatch]
  )

  const proceedToCartCheckout = useCallback(() => {
    dispatch(proceedToCartCheckoutAction())
  }, [dispatch])

  const clearCart = useCallback(() => {
    dispatch(clearCartAction())
    // toast.info('Cart cleared!')
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
