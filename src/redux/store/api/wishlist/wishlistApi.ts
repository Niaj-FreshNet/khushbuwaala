import { baseApi } from "../baseApi";

// A signed-in customer's wishlist on the server (backend: /api/wishlist).
// Guests keep theirs on the device; it is merged in after login (see WishlistSync).

export type ServerWishlistEntry = {
  productId: string;
  addedAt: string;
  available: boolean;
  product: { id: string; name: string; slug: string; primaryImage: string; minPrice?: number } | null;
};

type ApiEnvelope<T> = { success: boolean; data: T };

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserWishlist: builder.query<ServerWishlistEntry[], void>({
      query: () => ({ url: "/wishlist", method: "GET" }),
      transformResponse: (res: ApiEnvelope<ServerWishlistEntry[]>) => res.data ?? [],
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation<{ productId: string }, { productId: string }>({
      query: (body) => ({ url: "/wishlist", method: "POST", body }),
      transformResponse: (res: ApiEnvelope<{ productId: string }>) => res.data,
      invalidatesTags: ["Wishlist"],
    }),
    /** After login: add what was saved on this device as a guest; returns the full list. */
    mergeWishlist: builder.mutation<ServerWishlistEntry[], { productIds: string[] }>({
      query: (body) => ({ url: "/wishlist/merge", method: "POST", body }),
      transformResponse: (res: ApiEnvelope<ServerWishlistEntry[]>) => res.data ?? [],
      invalidatesTags: ["Wishlist"],
    }),
    removeWishlistItem: builder.mutation<{ productId: string }, string>({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: "DELETE" }),
      transformResponse: (res: ApiEnvelope<{ productId: string }>) => res.data,
      invalidatesTags: ["Wishlist"],
    }),
    clearWishlist: builder.mutation<{ removed: number }, void>({
      query: () => ({ url: "/wishlist", method: "DELETE" }),
      transformResponse: (res: ApiEnvelope<{ removed: number }>) => res.data,
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetUserWishlistQuery,
  useAddToWishlistMutation,
  useMergeWishlistMutation,
  useRemoveWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;
