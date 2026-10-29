import { baseApi } from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // DGePay payment endpoint
        createDgepayPayment: builder.mutation<
            { success: boolean; paymentUrl: string; transactionId: string },
            { orderId: string; payToken: string }
        >({
            query: (body) => ({
                url: "/checkout/dgepay/create",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useCreateDgepayPaymentMutation,
} = paymentApi;