import type { ApiEnvelope } from "@/types/order.types";
import { baseApi } from "../baseApi";

// The cart shown to the customer lives on the device. These calls keep a copy on the server
// (for signed-in customers it is their account's cart; for guests it is one row found by its id).

type AddToCartBody = {
  productId: string;
  variantId: string | null;
  size: number | null;
  unit: string | null;
  quantity: number;
  cartItemId?: string;
};

type ServerCartRow = { id: string; quantity: number };

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation<ApiEnvelope<ServerCartRow | null>, AddToCartBody>({
      query: (data) => ({
        url: "/cart/add-to-cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<ApiEnvelope<ServerCartRow | null>, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/cart/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useAddToCartMutation, useUpdateCartItemMutation, useRemoveCartItemMutation } = cartApi;
