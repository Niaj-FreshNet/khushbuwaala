import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Product } from '@/lib/Data/data'
import type { CartItem } from '../../features/cart/cartSlice'
import baseApi from '../baseApi';

// Base API configuration
export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    // Sync cart with server (for logged-in users)
    syncCart: builder.mutation<
      { success: boolean; cart: CartItem[] },
      { items: CartItem[] }
    >({
      query: ({ items }) => ({
        url: '/sync',
        method: 'POST',
        body: { items },
      }),
      invalidatesTags: ['CartSync'],
    }),

    // Get cart from server (for logged-in users)
    getServerCart: builder.query<{ cart: CartItem[] }, void>({
      query: () => '/get',
      providesTags: ['Cart'],
    }),

    // Apply coupon code
    applyCoupon: builder.mutation<
      { 
        success: boolean
        discount: number
        couponCode: string
        message: string
      },
      { couponCode: string; cartTotal: number }
    >({
      query: ({ couponCode, cartTotal }) => ({
        url: '/coupon/apply',
        method: 'POST',
        body: { couponCode, cartTotal },
      }),
    }),

    // Validate coupon code
    validateCoupon: builder.query<
      { 
        valid: boolean
        discount: number
        message: string
      },
      { couponCode: string; cartTotal: number }
    >({
      query: ({ couponCode, cartTotal }) => 
        `/coupon/validate?code=${couponCode}&total=${cartTotal}`,
    }),

    // Calculate shipping
    calculateShipping: builder.query<
      {
        shippingCost: number
        estimatedDelivery: string
        options: Array<{
          id: string
          name: string
          cost: number
          estimatedDays: number
        }>
      },
      { 
        items: CartItem[]
        address?: {
          city: string
          area: string
          district: string
        }
      }
    >({
      query: ({ items, address }) => ({
        url: '/shipping/calculate',
        method: 'POST',
        body: { items, address },
      }),
    }),

    // Check product availability
    checkAvailability: builder.query<
      {
        available: boolean
        stock: number
        message?: string
      },
      { productId: string; size: string; quantity: number }
    >({
      query: ({ productId, size, quantity }) => 
        `/availability?productId=${productId}&size=${size}&quantity=${quantity}`,
    }),
  }),
})

export const {
  useSyncCartMutation,
  useGetServerCartQuery,
  useApplyCouponMutation,
  useValidateCouponQuery,
  useCalculateShippingQuery,
  useCheckAvailabilityQuery,
} = cartApi
