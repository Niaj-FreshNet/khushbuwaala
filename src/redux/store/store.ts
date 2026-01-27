import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import baseApi from './api/baseApi';
import cartReducer from './features/cart/cartSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import authReducer from './features/auth/authSlice';
import ordersReducer from './features/orders/ordersSlice';

// Persist config for cart, wishlist, and auth
const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist', 'auth'], // Include auth for persistence
  transforms: [
    // Optional: Transform auth state to avoid persisting sensitive data
    {
      in: (state: any, key: string | number | symbol): any => {
        if (typeof key === 'string') { // type assertion
          if (key === 'auth') {
            // Only persist accessToken and user, exclude refreshToken or other sensitive data
            return {
              ...state,
              accessToken: state.accessToken,
              user: state.user,
              isAuthenticated: state.isAuthenticated,
            };
          }
        }
        return state;
      },
      out: (state: any, key: string | number | symbol): any => state,
    },
  ],
};

// Wrap reducers with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedOrderReducer = persistReducer(persistConfig, ordersReducer);
const persistedWishlistReducer = persistReducer(persistConfig, wishlistReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    orders: persistedOrderReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          // Ignore RTK Query actions that may include non-serializable data
          `${baseApi.reducerPath}/executeMutation`,
          `${baseApi.reducerPath}/executeQuery`,
        ],
        ignoredPaths: [
          // Ignore file objects in form submissions (e.g., product image uploads)
          `${baseApi.reducerPath}.mutations`,
          `${baseApi.reducerPath}.queries`,
        ],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);