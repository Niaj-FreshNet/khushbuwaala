import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Order } from './ordersSlice'

interface CreateOrderResponse {
  orderId: string
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/orders' }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/${encodeURIComponent(orderId)}`,
      providesTags: (result, error, id) => [{ type: 'Order' as const, id }],
    }),
    createOrder: builder.mutation<CreateOrderResponse, any>({
      query: (order) => ({
        url: '',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const { useCreateOrderMutation, useLazyGetOrderByIdQuery, useGetOrderByIdQuery } = ordersApi


