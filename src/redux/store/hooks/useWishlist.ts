import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  clearWishlist as clearWishlistAction,
  selectWishlistItems,
  selectWishlistCount,
} from "../features/wishlist/wishlistSlice";
import type { IProductResponse } from "@/types/product.types";
// import { toast } from "sonner";

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  const addToWishlist = useCallback(
    (product: IProductResponse) => {
      dispatch(addToWishlistAction(product));
      // toast.success(`${product.name} added to wishlist!`);
    },
    [dispatch]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      dispatch(removeFromWishlistAction(productId));
      // toast.info(`Item removed from wishlist`);
    },
    [dispatch]
  );

  const clearWishlist = useCallback(() => {
    dispatch(clearWishlistAction());
    // toast.info("Wishlist cleared!");
  }, [dispatch]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  return {
    items,
    count,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  };
};
