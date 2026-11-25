import { combineReducers, configureStore, type Reducer, type UnknownAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import baseApi from './api/baseApi';
import cartReducer from './features/cart/cartSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import authReducer from './features/auth/authSlice';
import ordersReducer from './features/orders/ordersSlice';

// The same settings as before for every part of the store. (The cart, wishlist and sign-in keep
// themselves on the device in their own slices; this wrapper is kept so the saved data and the
// start-up order of the app stay exactly as they were.)
const persisted = <S>(reducer: Reducer<S, UnknownAction>) =>
  persistReducer<S, UnknownAction>({ key: 'root', storage, whitelist: ['cart', 'wishlist', 'auth'] }, reducer);

const rootReducer = combineReducers({
  auth: persisted(authReducer),
  orders: persisted(ordersReducer),
  cart: persisted(cartReducer),
  wishlist: persisted(wishlistReducer),
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
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
