"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useCallback } from "react";

import { setOrder, selectOrderLoading } from "../features/orders/ordersSlice";
import { type CreateOrderPayload, useCreateOrderMutation } from "../api/order/ordersApi";
import { apiErrorMessage } from "@/lib/apiError";

// Places an order and remembers it for the thank-you page.
export const useOrder = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectOrderLoading);
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const handleCreateOrder = useCallback(
    async (payload: CreateOrderPayload) => {
      try {
        const res = await createOrder(payload).unwrap();
        dispatch(setOrder(res));
        // The success message is shown by the checkout page (it depends on the payment method).
        return res;
      } catch (err) {
        console.error(err);
        toast.error(apiErrorMessage(err, "Failed to create order"));
        throw err;
      }
    },
    [createOrder, dispatch]
  );

  return {
    loading: loading || isCreating,
    handleCreateOrder,
  };
};
