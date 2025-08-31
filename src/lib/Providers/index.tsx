"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
<<<<<<< HEAD
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ReduxInitializer from "@/redux/ReduxInitializer";
=======
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
import { persistor, store } from "@/redux/store/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
<<<<<<< HEAD
        <ReduxInitializer>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </ReduxInitializer>
=======
        {children}
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
      </PersistGate>
    </Provider>
  );
}