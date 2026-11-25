import type { IReview } from "@/types/product.types";
import type { ApiEnvelope } from "@/types/order.types";
import baseApi from "../baseApi";

// What the review form sends. A guest may leave an email; a signed-in customer's id is added.
export type NewReview = {
  rating: number;
  title: string;
  comment: string;
  productId: string;
  userId?: string | null;
  imageUrl?: string;
  email?: string;
};

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<ApiEnvelope<IReview>, NewReview>({
      query: (review) => ({
        url: "/review/create-review",
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Review"],
    }),

    getProductReviews: builder.query<ApiEnvelope<IReview[]>, string>({
      query: (productId) => `/review/get-product-reviews/${productId}`,
      providesTags: (result, error, productId) => [{ type: "Review", id: productId }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateReviewMutation, useGetProductReviewsQuery } = reviewApi;

export default reviewApi;
