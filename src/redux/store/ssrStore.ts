import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/product/productApi";

export function initializeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(productApi.middleware),
    preloadedState,
  });
}