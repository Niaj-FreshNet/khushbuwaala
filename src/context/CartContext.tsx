"use client";

// The cart lives in the shop's store. This file keeps the older import path working:
// `useCart` from "@/context/CartContext" and from the store hook are the same thing.
export { useCart } from "@/redux/store/hooks/useCart";
