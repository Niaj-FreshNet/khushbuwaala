"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWishlist as useReduxWishlist } from "@/redux/store/hooks/useWishlist";

const WishlistContext = createContext<ReturnType<typeof useReduxWishlist> | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const wishlist = useReduxWishlist();

  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  return context || useReduxWishlist();
};
