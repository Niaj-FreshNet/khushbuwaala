import { baseApi } from "../baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: "/wishlist/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getUserWishlist: builder.query({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),
    removeWishlistItem: builder.mutation({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    clearWishlist: builder.mutation({
      query: () => ({
        url: `/wishlist/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetUserWishlistQuery,
  useRemoveWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;
