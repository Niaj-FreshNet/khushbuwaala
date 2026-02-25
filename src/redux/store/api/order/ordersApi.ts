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

// export interface IOrderResponse {
//   id: string
//   invoice: string
//   amount: number
//   isPaid: boolean
//   status: string
//   orderSource: string
//   createdAt: string
//   updatedAt: string
//   customer?: {
//     id: string
//     name: string
//     imageUrl?: string
//   }
//   orderItems?: {
//     id: string
//     quantity: number
//     product?: {
//       id: string
//       name: string
//       primaryImage?: string
//     }
//     variant?: {
//       id: string
//       size?: string
//       price?: number
//     }
//   }[]
// }

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type IOrderData = {
  id: string;
  amount: number;
  isPaid: boolean;
  status: string;
  orderSource: string;
  createdAt: string;
  updatedAt: string;
};

export type IOrderResponse = ApiResponse<IOrderData>;

export interface IPaginatedResponse<T> {
  meta: {
    page: number
    limit: number
    total: number
  }
  data: T[]
}

export type IUpdateOrderPayload = {
  id: string;

  status?: "PENDING" | "PROCESSING" | "DELIVERED" | "COMPLETED" | "CANCELED";
  isPaid?: boolean;
  method?: string | null;

  orderSource?: "WEBSITE" | "SHOWROOM" | "WHOLESALE" | "MANUAL";
  saleType?: "SINGLE" | "BULK";

  shippingCost?: number;
  additionalNotes?: string | null;

  coupon?: string | null;
  discountAmount?: number;

  shipping?: any; // or define the address type
  billing?: any;

  salesmanId?: string | null;

  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;

  amount?: number;
  customerId?: string | null;
};

export type DashboardMetrics = {
  todayOrders: number;
  monthOrders: number;
  monthSales: number;
  totalSales: number;
};

export type WeeklySalesPoint = {
  day: string;
  sales: number;
  orders: number;
};

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
    updateOrderStatus: builder.mutation<IOrderResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/order/update-order-status/${id}`,
        method: 'PATCH',
        body: { status }, // ✅
      }),
      invalidatesTags: ['Order'],
    }),

    updatePaymentStatus: builder.mutation<IOrderResponse, { id: string; isPaid: boolean }>({
      query: ({ id, isPaid }) => ({
        url: `/order/update-payment-status/${id}`,
        method: 'PATCH',
        body: { isPaid },
      }),
      invalidatesTags: ['Order'],
    }),

    updateOrder: builder.mutation<IOrderResponse, IUpdateOrderPayload>({
      query: ({ id, ...body }) => ({
        url: `/order/update-order/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Order"],
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

    getDashboardMetrics: builder.query<ApiResponse<DashboardMetrics & { type: string }>, { type?: "all" | "website" | "manual" } | void>({
      query: (arg) => ({
        url: "/order/dashboard/metrics",
        params: arg?.type ? { type: arg.type } : undefined,
      }),
      providesTags: ["Order"],
    }),

    getWeeklySalesOverview: builder.query<
      ApiResponse<{ day: string; sales: number; orders: number }[]>,
      { type?: "all" | "website" | "manual" } | void
    >({
      query: (arg) => ({
        url: "/order/dashboard/weekly-sales",
        params: arg?.type ? { type: arg.type } : undefined,
      }),
      providesTags: ["Order"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useUpdateOrderMutation,
  useGetAllCustomersQuery,
  useGetUserOrdersQuery,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useGetDashboardMetricsQuery,
  useGetWeeklySalesOverviewQuery,
} = orderApi
