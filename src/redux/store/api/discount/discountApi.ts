import type { ApiEnvelope, DiscountCheck, DiscountCheckItem } from "@/types/order.types";
import baseApi from "../baseApi";

export const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Asks the shop what these lines cost after the running sale and (when given) a coupon.
    // Nothing is saved: the server prices the real order again when it is placed.
    applyDiscount: builder.mutation<ApiEnvelope<DiscountCheck>, { code?: string; items: DiscountCheckItem[] }>({
      query: (payload) => ({
        url: "/discount/apply",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useApplyDiscountMutation } = discountApi;
