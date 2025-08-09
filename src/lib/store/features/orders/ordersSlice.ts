import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import type { Product } from '@/lib/Data/data'

export interface CartLikeItem extends Product {
  quantity: number
  size: string
  variantPrices?: { [key: string]: number }
}

export interface Order {
  orderId: string
  cartItems: CartLikeItem[]
  subtotal: number
  shippingCost: number
  estimatedTaxes: number
  total: number
  paymentMethod: 'cashOnDelivery' | 'sslCommerz'
  shippingMethod: 'insideDhaka' | 'outsideDhaka'
  postStatus: string
  paymentStatus: string
  notes?: string
  contactInfo: { email?: string }
  shippingAddress: {
    name: string
    address: string
    district: string
    thana?: string
    contactNumber: string
  }
  billingAddress: {
    name: string
    address: string
    district: string
    thana?: string
    contactNumber: string
  }
  createdAt?: string
}

interface OrdersState {
  lastOrder?: Order
  byId: Record<string, Order>
}

const initialState: OrdersState = {
  lastOrder: undefined,
  byId: {},
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order>) => {
      const order = action.payload
      state.lastOrder = order
      state.byId[order.orderId] = order
    },
    clearLastOrder: (state) => {
      state.lastOrder = undefined
    },
  },
})

export const { setOrder, clearLastOrder } = ordersSlice.actions

export const selectLastOrder = (state: RootState) => state.orders.lastOrder
export const selectOrderById = (orderId: string) => (state: RootState) =>
  state.orders.byId[orderId]

export default ordersSlice.reducer


