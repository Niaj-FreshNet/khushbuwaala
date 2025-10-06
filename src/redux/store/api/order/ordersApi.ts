// File: src/redux/api/orders/orderApi.ts
import baseApi from "../baseApi"
import { Order } from "@/types/order.types"

interface CreateOrderResponse {
  orderId: string
  message?: string
}

interface GetOrdersParams {
  page?: number
  limit?: number
  status?: string
  startDate?: string
  endDate?: string
  search?: string
}

interface PaginatedOrders {
  data: Order[]
  total: number
  page: number
  limit: number
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create order (customer flow)
    createOrder: builder.mutation<CreateOrderResponse, Partial<Order>>({
      query: (order) => ({
        url: "/order/create-order",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Order"],
    }),

    // ✅ Admin: Get all orders (with pagination & filters)
    getAllOrders: builder.query<PaginatedOrders, GetOrdersParams>({
      query: ({ page = 1, limit = 10, status, startDate, endDate, search }) => {
        const params = new URLSearchParams()

        params.set("page", String(page))
        params.set("limit", String(limit))

        if (status) params.set("status", status)
        if (startDate) params.set("startDate", startDate)
        if (endDate) params.set("endDate", endDate)
        if (search) params.set("search", search)

        return `/order/get-all-orders?${params.toString()}`
      },
      providesTags: ["Order"],
    }),

    // ✅ Admin: Get order by ID
    getOrderById: builder.query<Order, string>({
      query: (id) => `/order/get-order-by-id/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // ✅ Admin: Update order status
    updateOrderStatus: builder.mutation<
      { success: boolean; message: string },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/order/update-order-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),

    // ✅ Admin: Get all customers
    getAllCustomers: builder.query<any[], void>({
      query: () => "/order/get-all-customers",
    }),

    // ✅ User: Get user orders by ID
    getUserOrders: builder.query<Order[], string>({
      query: (userId) => `/get-user-orders/${userId}`,
      providesTags: ["Order"],
    }),

    // ✅ User: Get my orders
    getMyOrders: builder.query<Order[], void>({
      query: () => "/order/my-orders",
      providesTags: ["Order"],
    }),

    // ✅ User: Get my order by ID
    getMyOrderById: builder.query<Order, string>({
      query: (id) => `/order/my-orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
  }),
})

// Export hooks
export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetAllCustomersQuery,
  useGetUserOrdersQuery,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
} = orderApi
