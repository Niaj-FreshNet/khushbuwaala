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

