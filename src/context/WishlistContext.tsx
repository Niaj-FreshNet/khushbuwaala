"use client";

// The wishlist lives in the shop's store. This file keeps the older import path working:
// `useWishlist` from "@/context/WishlistContext" and from the store hook are the same thing.
export { useWishlist } from "@/redux/store/hooks/useWishlist";
