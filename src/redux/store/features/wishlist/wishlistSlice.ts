import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// The wishlist as this device knows it. It holds only what is needed to draw a heart and a
// placeholder row: prices and stock are always read fresh when the wishlist page opens.
// Guests: this list (kept in the browser) is the wishlist.
// Signed-in customers: the server list is the truth and this mirrors it (see WishlistSync).

export type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  primaryImage: string;
  minPrice?: number;
};

export interface WishlistItem {
  product: WishlistProduct;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = "wishlistItems";

type LooseProduct = Partial<WishlistProduct> & { _id?: string };

/** Keep the few fields we show. Older saved entries held whole product objects. */
export const toWishlistProduct = (p: LooseProduct | null | undefined): WishlistProduct | null => {
  const id = p?.id ?? p?._id;
  if (!id || !p?.name) return null;
  return {
    id: String(id),
    name: String(p.name),
    slug: String(p.slug ?? ""),
    primaryImage: String(p.primaryImage ?? ""),
    minPrice: typeof p.minPrice === "number" ? p.minPrice : undefined,
  };
};

const loadWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    const seen = new Set<string>();
    const items: WishlistItem[] = [];
    for (const entry of saved) {
      const product = toWishlistProduct(entry?.product ?? entry);
      if (!product || seen.has(product.id)) continue;
      seen.add(product.id);
      items.push({ product, addedAt: typeof entry?.addedAt === "string" ? entry.addedAt : new Date().toISOString() });
    }
    return items;
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or blocked: the wishlist still works for this visit
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  // Starts empty on purpose: the server cannot see the browser's saved list, and starting with it
  // here made the first client render differ from the server's (React then rebuilt the whole page).
  // WishlistSync loads it right after the page becomes interactive.
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  } as WishlistState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<LooseProduct>) => {
      const product = toWishlistProduct(action.payload);
      if (!product || state.items.some((item) => item.product.id === product.id)) return;
      state.items.unshift({ product, addedAt: new Date().toISOString() });
      saveWishlistToStorage(state.items);
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },

    /** Replace the list with the server's (after login / merge). */
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },

    initializeWishlist: (state) => {
      state.items = loadWishlistFromStorage();
    },

    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
  initializeWishlist,
  setWishlistLoading,
  setWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// ---- Selectors ----
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.items.length;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.isLoading;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;
