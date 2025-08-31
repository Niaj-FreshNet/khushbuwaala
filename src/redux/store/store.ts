<<<<<<< HEAD
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from './features/cart/cartSlice';
import { baseApi } from './api/baseApi';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'auth'],
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);
// const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export function initializeStore() {
  return configureStore({
    reducer: {
      cart: persistedCartReducer,
      // auth: persistedAuthReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'persist/PERSIST',
            'persist/REHYDRATE',
            'persist/REGISTER'
          ],
        },
      }).concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export const store = initializeStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

=======
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
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
