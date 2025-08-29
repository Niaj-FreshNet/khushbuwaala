import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import baseApi from './api/baseApi'
import cartReducer from './features/cart/cartSlice'
import wishlistReducer from './features/wishlist/wishlistSlice'
// import authReducer from './features/auth/authSlice'

// persist config for cart + wishlist + auth
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'cart',
    'wishlist',
    // 'auth',
  ],
}

// wrap reducers you want persisted
const persistedCartReducer = persistReducer(persistConfig, cartReducer)
const persistedWishlistReducer = persistReducer(persistConfig, wishlistReducer)
// const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    // auth: persistedAuthReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)