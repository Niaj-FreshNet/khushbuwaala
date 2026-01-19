import { baseApi } from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ✅ Start bKash payment: returns bkashURL -> redirect user to it
        createBkashPayment: builder.mutation<
            { success: boolean; bkashURL: string; paymentID: string },
            { orderId: string; payToken: string }
        >({
            query: (body) => ({
                url: "/checkout/bkash/create",
                method: "POST",
                body,
            }),
            // you can invalidate Order/Cart if you want after success page refresh
            // invalidatesTags: ["Order", "Cart"],
        }),


        // ✅ Refund by trxID (admin)
        refundBkashByTrxId: builder.mutation<
            { success: boolean; refund: any },
            { trxID: string }
        >({
            query: ({ trxID }) => ({
                url: `/checkout/bkash/refund/${trxID}`,
                method: "POST",
            }),
            // invalidatesTags: ["Payment", "Order"],
        }),

        /**
         * OPTIONAL (only if you add these endpoints in backend)
         * -----------------------------------------------
         * getMyPayments: builder.query({
         *   query: () => ({ url: "/payment/my", method: "GET" }),
         *   providesTags: ["Payment"],
         * }),
         *
         * getAllPaymentsAdmin: builder.query({
         *   query: (params) => ({ url: "/payment/admin", method: "GET", params }),
         *   providesTags: ["Payment"],
         * }),
         */
    }),
});

export const {
    useCreateBkashPaymentMutation,
    useRefundBkashByTrxIdMutation,
    // useGetMyPaymentsQuery,
    // useGetAllPaymentsAdminQuery,
} = paymentApi;
