import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface CreateOrderResponse {
  orderId: string
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/orders' }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
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

export const { useCreateOrderMutation } = ordersApi


