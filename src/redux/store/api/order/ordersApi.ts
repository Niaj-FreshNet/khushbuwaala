import baseApi from "../../api/baseApi";
import type { ApiEnvelope, MyOrders, Order } from "@/types/order.types";

// What the checkout sends to place an order. The server works out every price itself; the
// amounts sent here are only what the customer was shown.
export type CreateOrderPayload = {
  cartItemIds: string[];
  items: { productId: string; variantId?: string; quantity: number; price: number }[];
  amount: number;
  isPaid?: boolean;
  method?: string;
  orderSource?: string;
  saleType?: string;
  shippingCost?: number;
  additionalNotes?: string | null;
  coupon?: string | null;
  discountAmount?: number;
  customerInfo?: Record<string, string | null | undefined>;
  shippingAddress?: Record<string, string | null | undefined>;
  billingAddress?: Record<string, string | null | undefined>;
  [extra: string]: unknown;
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiEnvelope<Order>, CreateOrderPayload>({
      query: (body) => ({
        url: "/order/create-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    getOrderById: builder.query<ApiEnvelope<Order>, string>({
      query: (id) => `/order/get-order-by-id/${id}`,
      providesTags: (result, error, id) => [{ type: "Order" as const, id }],
    }),

    getMyOrders: builder.query<ApiEnvelope<MyOrders>, void>({
      query: () => "/order/my-orders",
      providesTags: ["Order"],
    }),

    // The phone number (when given) unlocks the name and address. It goes in the body, never
    // in the address, so it does not end up in browser history or server logs.
    trackOrders: builder.query<ApiEnvelope<Order[]>, { query: string; phone?: string }>({
      query: ({ query, phone }) =>
        phone
          ? { url: `/order/track/${encodeURIComponent(query)}`, method: "POST", body: { phone } }
          : `/order/track/${encodeURIComponent(query)}`,
      providesTags: ["Order"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useLazyTrackOrdersQuery,
} = orderApi;
