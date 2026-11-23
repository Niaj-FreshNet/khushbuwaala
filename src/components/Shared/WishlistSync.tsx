"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { initializeWishlist, selectWishlistItems, setWishlist, type WishlistState } from "@/redux/store/features/wishlist/wishlistSlice";
import { useMergeWishlistMutation } from "@/redux/store/api/wishlist/wishlistApi";

/**
 * Keeps the device wishlist and the account wishlist as one list.
 * When a customer signs in (or returns already signed in), what they saved as a guest is added to
 * their account, and the account's list is then shown on this device. Renders nothing.
 */
export default function WishlistSync() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => (state as { auth?: { accessToken?: string | null } }).auth?.accessToken ?? null);
  const store = useStore<{ wishlist: WishlistState }>();
  const [merge] = useMergeWishlistMutation();
  const syncedFor = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // 1) load what this device has saved
  useEffect(() => {
    dispatch(initializeWishlist());
    setLoaded(true);
  }, [dispatch]);

  // 2) signed in: make the device list and the account list one list
  useEffect(() => {
    if (!loaded) return;
    const session = token || (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
    if (!session) {
      syncedFor.current = null;
      return;
    }
    if (syncedFor.current === session) return;
    syncedFor.current = session;

    merge({ productIds: selectWishlistItems(store.getState()).map((i) => i.product.id) })
      .unwrap()
      .then((entries) => {
        dispatch(
          setWishlist(
            entries
              .filter((e) => e.product)
              .map((e) => ({
                product: {
                  id: e.productId,
                  name: e.product!.name,
                  slug: e.product!.slug,
                  primaryImage: e.product!.primaryImage,
                  minPrice: e.product!.minPrice,
                },
                addedAt: e.addedAt,
              }))
          )
        );
      })
      .catch(() => {
        // not signed in any more, or offline: the device list stays as it is and we retry next visit
        syncedFor.current = null;
      });
  }, [loaded, token, merge, dispatch, store]);

  return null;
}
