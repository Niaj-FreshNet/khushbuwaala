<<<<<<< HEAD
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/lib/Data/data'

export interface WishlistItem extends Product {}
=======
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProductResponse } from '@/types/product.types'

export interface WishlistItem {
  product: IProductResponse
}
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83

export interface WishlistState {
  items: WishlistItem[]
}

<<<<<<< HEAD
=======
// Load wishlist from localStorage
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
const loadWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem('khushbuwaala-wishlist')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

<<<<<<< HEAD
=======
// Save wishlist to localStorage
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
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
<<<<<<< HEAD
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload
      const exists = state.items.some((item) => item._id === product._id)
      if (!exists) {
        state.items.push({ ...product })
=======
    addToWishlist: (state, action: PayloadAction<IProductResponse>) => {
      const product = action.payload
      const exists = state.items.some((item) => item.product.id === product.id)
      if (!exists) {
        state.items.push({ product })
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
        saveWishlistToStorage(state.items)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload
<<<<<<< HEAD
      state.items = state.items.filter((item) => item._id !== productId)
      saveWishlistToStorage(state.items)
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload
      const exists = state.items.some((item) => item._id === product._id)
      if (exists) {
        state.items = state.items.filter((item) => item._id !== product._id)
      } else {
        state.items.push({ ...product })
=======
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
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
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
<<<<<<< HEAD
  state.wishlist.items.some((item) => item._id === productId)


=======
  state.wishlist.items.some((item) => item.product.id === productId)
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
