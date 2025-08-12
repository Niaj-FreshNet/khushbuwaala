"use client"

import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store/store"
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"
import ReduxInitializer from "@/redux/ReduxInitializer"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxInitializer>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </ReduxInitializer>
    </Provider>
  )
}
