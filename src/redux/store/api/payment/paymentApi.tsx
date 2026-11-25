import { baseApi } from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Starts an online payment (DGePay) for an order and returns the page to send the customer to.
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

export const { useCreateDgepayPaymentMutation } = paymentApi;
