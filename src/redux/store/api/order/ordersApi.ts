import baseApi from '../../api/baseApi'

// Types
export interface IOrderPayload {
  cartItemIds: string[]
  amount: number
  isPaid?: boolean
  orderSource?: 'WEBSITE' | 'ADMIN_PANEL'
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
    address?: string
  }
}

export interface IOrderResponse {
  id: string
  amount: number
  isPaid: boolean
  status: string
  orderSource: string
  createdAt: string
  updatedAt: string
  customer?: {
    id: string
    name: string
    imageUrl?: string
  }
  orderItems?: {
    id: string
    quantity: number
    product?: {
      id: string
      name: string
      primaryImage?: string
    }
    variant?: {
      id: string
      size?: string
      price?: number
    }
  }[]
}

export interface IPaginatedResponse<T> {
  meta: {
    page: number
    limit: number
    total: number
  }
  data: T[]
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create order (customer or guest)
    createOrder: builder.mutation<IOrderResponse, IOrderPayload>({
      query: (body) => ({
        url: '/order/create-order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    // ✅ Get all orders (Admin)
    getAllOrders: builder.query<IPaginatedResponse<IOrderResponse>, Record<string, any> | void>({
      query: (params) => ({
        url: '/order/get-all-orders',
        params: params ?? undefined,
      }),
      providesTags: ['Order'],
    }),

    // ✅ Get order by ID (Admin)
    getOrderById: builder.query<IOrderResponse, string>({
      query: (id) => `/order/get-order-by-id/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order' as const, id }],
    }),

    // ✅ Update order status (Admin)
    updateOrderStatus: builder.mutation<IOrderResponse, { id: string; data: Record<string, any> }>({
      query: ({ id, data }) => ({
        url: `/order/update-order-status/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),

    // ✅ Get all customers (Admin)
    getAllCustomers: builder.query<IPaginatedResponse<any>, Record<string, any> | void>({
      query: (params) => ({
        url: '/order/get-all-customers',
        params: params ?? undefined,
      }),
      providesTags: ['User'],
    }),

    // ✅ Get all orders for a specific user (Admin view)
    getUserOrders: builder.query<IOrderResponse[], string>({
      query: (userId) => `/order/get-user-order/${userId}`,
      providesTags: ['Order'],
    }),

    // ✅ Get logged-in user’s orders (User)
    getMyOrders: builder.query<IOrderResponse[], void>({
      query: () => '/order/my-orders',
      providesTags: ['Order'],
    }),

    // ✅ Get a single logged-in user’s order
    getMyOrderById: builder.query<IOrderResponse, string>({
      query: (id) => `/order/my-order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order' as const, id }],
    }),
  }),
  overrideExisting: true,
})

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetAllCustomersQuery,
  useGetUserOrdersQuery,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
} = orderApi
