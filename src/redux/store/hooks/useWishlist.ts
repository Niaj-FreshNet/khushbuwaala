import { useCallback } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addToWishlist as addLocal,
  removeFromWishlist as removeLocal,
  clearWishlist as clearLocal,
  selectWishlistItems,
  selectWishlistCount,
  toWishlistProduct,
} from "../features/wishlist/wishlistSlice";
import {
  useAddToWishlistMutation,
  useClearWishlistMutation,
  useRemoveWishlistItemMutation,
} from "../api/wishlist/wishlistApi";
import { kwPushAddToWishlist } from "@/lib/Analytics/kwEcom";

type ProductLike = {
  id?: string;
  _id?: string;
  name?: string;
  slug?: string;
  primaryImage?: string;
  minPrice?: number;
  brand?: string | null;
  category?: { label?: string; categoryName?: string } | null;
};

const hasSession = () => typeof window !== "undefined" && Boolean(localStorage.getItem("accessToken"));

/**
 * The wishlist for the whole shop. The heart changes at once on the device; for a signed-in
 * customer the change is also saved to their account, and undone here if the server refuses it.
 */
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  const [addOnServer] = useAddToWishlistMutation();
  const [removeOnServer] = useRemoveWishlistItemMutation();
  const [clearOnServer] = useClearWishlistMutation();

  const addToWishlist = useCallback(
    (product: ProductLike) => {
      const slim = toWishlistProduct(product);
      if (!slim) return;
      dispatch(addLocal(slim));
      kwPushAddToWishlist({
        item: { id: slim.id, name: slim.name, brand: product.brand, category: { label: product.category?.label ?? product.category?.categoryName }, minPrice: slim.minPrice },
      });
      if (hasSession()) {
        addOnServer({ productId: slim.id })
          .unwrap()
          .catch((err: { status?: number }) => {
            // an expired login keeps the item on the device; anything else is undone
            if (err?.status === 401) return;
            dispatch(removeLocal(slim.id));
            toast.error("Could not save to your wishlist. Please try again.");
          });
      }
    },
    [dispatch, addOnServer]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const previous = items.find((item) => item.product.id === productId);
      dispatch(removeLocal(productId));
      if (hasSession()) {
        removeOnServer(productId)
          .unwrap()
          .catch((err: { status?: number }) => {
            if (err?.status === 401 || !previous) return;
            dispatch(addLocal(previous.product));
            toast.error("Could not update your wishlist. Please try again.");
          });
      }
    },
    [dispatch, items, removeOnServer]
  );

  const clearWishlist = useCallback(() => {
    dispatch(clearLocal());
    if (hasSession()) clearOnServer().unwrap().catch(() => undefined);
  }, [dispatch, clearOnServer]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  return { items, count, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist };
};
