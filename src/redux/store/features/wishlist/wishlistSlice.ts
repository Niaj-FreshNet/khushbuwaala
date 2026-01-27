import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductResponse } from "@/types/product.types";

export interface WishlistItem {
  product: IProductResponse;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

// ---- Load & Save to localStorage ----
const loadWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("wishlistItems", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save wishlist:", error);
  }
};

// ---- Slice ----
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlistFromStorage(),
    isLoading: false,
    error: null,
  } as WishlistState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<IProductResponse>) => {
      const exists = state.items.some(
        (item) => item.product.id === action.payload.id
      );
      if (!exists) {
        state.items.push({
          product: action.payload,
          addedAt: new Date().toISOString(),
        });
        saveWishlistToStorage(state.items);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
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
  initializeWishlist,
  setWishlistLoading,
  setWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// ---- Selectors ----
export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
  state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) =>
  state.wishlist.isLoading;
export const selectWishlistError = (state: { wishlist: WishlistState }) =>
  state.wishlist.error;
