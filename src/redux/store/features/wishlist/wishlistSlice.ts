import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProductResponse } from '@/types/product.types'

export interface WishlistItem {
  product: IProductResponse
}

export interface WishlistState {
  items: WishlistItem[]
}

// Load wishlist from localStorage
const loadWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem('khushbuwaala-wishlist')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Save wishlist to localStorage
const saveWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('khushbuwaala-wishlist', JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save wishlist to localStorage:', error)
  }
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    ...initialState,
    items: loadWishlistFromStorage(),
  },
  reducers: {
    addToWishlist: (state, action: PayloadAction<IProductResponse>) => {
      const product = action.payload
      const exists = state.items.some((item) => item.product.id === product.id)
      if (!exists) {
        state.items.push({ product })
        saveWishlistToStorage(state.items)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload
      state.items = state.items.filter((item) => item.product.id !== productId)
      saveWishlistToStorage(state.items)
    },
    toggleWishlist: (state, action: PayloadAction<IProductResponse>) => {
      const product = action.payload
      const exists = state.items.some((item) => item.product.id === product.id)
      if (exists) {
        state.items = state.items.filter((item) => item.product.id !== product.id)
      } else {
        state.items.push({ product })
      }
      saveWishlistToStorage(state.items)
    },
    clearWishlist: (state) => {
      state.items = []
      saveWishlistToStorage(state.items)
    },
    initializeWishlist: (state) => {
      state.items = loadWishlistFromStorage()
    },
  },
})

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  initializeWishlist,
} = wishlistSlice.actions

export default wishlistSlice.reducer

// Selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.items.length
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((item) => item.product.id === productId)
