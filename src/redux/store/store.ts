import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import cartReducer from './features/cart/cartSlice'
import { cartApi } from './features/cart/cartApi'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types from serializability checks
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(cartApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
