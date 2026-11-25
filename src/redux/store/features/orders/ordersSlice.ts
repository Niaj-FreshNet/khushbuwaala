import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { ApiEnvelope, Order } from "@/types/order.types";
import { orderApi } from "../../api/order/ordersApi";

// The order the customer has just placed, kept so the thank-you page can show it straight away.
// Orders are stored the way the server answered (`{ data: order }`).
type PlacedOrder = ApiEnvelope<Order>;

interface OrdersState {
  lastOrder?: PlacedOrder;
  byId: Record<string, PlacedOrder>;
  loading: boolean;
  error?: string;
}

const initialState: OrdersState = {
  lastOrder: undefined,
  byId: {},
  loading: false,
  error: undefined,
};

const remember = (state: OrdersState, placed: PlacedOrder) => {
  state.lastOrder = placed;
  const id = placed?.data?.id;
  if (id) state.byId[id] = placed;
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<PlacedOrder>) => {
      remember(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(orderApi.endpoints.createOrder.matchPending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addMatcher(orderApi.endpoints.createOrder.matchFulfilled, (state, { payload }) => {
        state.loading = false;
        remember(state, payload);
      })
      .addMatcher(orderApi.endpoints.createOrder.matchRejected, (state, { error }) => {
        state.loading = false;
        state.error = error?.message || "Failed to create order";
      });
  },
});

export const { setOrder } = ordersSlice.actions;

export const selectLastOrder = (state: RootState) => state.orders.lastOrder;
export const selectOrderById =
  (orderId: string) =>
  (state: RootState): PlacedOrder | undefined =>
    state.orders.byId[orderId];
export const selectOrderLoading = (state: RootState) => state.orders.loading;

export default ordersSlice.reducer;
