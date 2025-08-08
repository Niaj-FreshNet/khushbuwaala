# Redux Store Setup for Cart Management

This document explains the Redux implementation for cart functionality in the Khushbuwaala project.

## Overview

The cart functionality has been migrated from React Context to Redux Toolkit for better state management, performance, and scalability.

## Structure

```
src/lib/store/
├── store.ts                 # Main store configuration
├── hooks.ts                 # Typed Redux hooks
├── features/
│   └── cart/
│       ├── cartSlice.ts     # Cart state management
│       └── cartApi.ts       # RTK Query for cart operations
└── hooks/
    ├── useCart.ts           # Compatible hook with original interface
    └── useCartOperations.ts # Enhanced cart operations hook
```

## Features

### ✅ **State Management**
- **Cart Items**: Add, remove, update quantities
- **Checkout Mode**: Support for both cart and single-item checkout
- **Persistence**: Automatic localStorage synchronization
- **Loading States**: Built-in loading and error handling

### ✅ **RTK Query Integration**
- **Server Sync**: Ready for API integration when backend is available
- **Coupon System**: Apply and validate discount coupons
- **Shipping Calculator**: Calculate shipping costs
- **Availability Check**: Real-time stock validation

### ✅ **TypeScript Support**
- **Typed Hooks**: `useAppDispatch` and `useAppSelector`
- **Type Safety**: Full TypeScript coverage for all cart operations
- **Selectors**: Pre-built selectors for common cart calculations

## Usage

### Basic Cart Operations

```tsx
import { useCart } from '@/lib/store/hooks/useCart'

function MyComponent() {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    calculateSubtotal 
  } = useCart()

  // Use exactly like the original Context API
}
```

### Enhanced Cart Operations

```tsx
import { useCartOperations } from '@/lib/store/hooks/useCartOperations'

function ProductCard({ product }) {
  const { 
    isInCart, 
    addItemToCart, 
    toggleInCart,
    getItemQuantity 
  } = useCartOperations()

  const inCart = isInCart(product._id, selectedSize)
  const quantity = getItemQuantity(product._id, selectedSize)
}
```

### Pre-built Components

```tsx
// Cart button with quantity controls
import CartButton from '@/components/Shared/CartButton'

<CartButton 
  product={product} 
  selectedSize="3ml" 
  showQuantity={true} 
/>

// Cart badge for navbar
import CartBadge from '@/components/Shared/CartBadge'

<CartBadge showText={true} />
```

## Migration Benefits

### 🚀 **Performance**
- **Selective Updates**: Components only re-render when relevant state changes
- **Memoized Selectors**: Optimized calculations with automatic caching
- **DevTools**: Redux DevTools for debugging and time-travel

### 🔄 **Backward Compatibility**
- **Same Interface**: Existing components work without changes
- **Context Bridge**: Original `useCart` hook still works
- **Gradual Migration**: Can migrate components one by one

### 📡 **Future Ready**
- **API Integration**: RTK Query ready for backend integration
- **Server State**: Built-in caching and synchronization
- **Offline Support**: Can be extended with offline capabilities

## Store Configuration

The store is configured with:
- **Cart Slice**: Local cart state management
- **Cart API**: RTK Query for server operations
- **DevTools**: Enabled in development
- **Middleware**: Includes RTK Query middleware

## Selectors

Pre-built selectors for common operations:
- `selectCartItems`: Get all cart items
- `selectCartItemsCount`: Get total item count
- `selectCartSubtotal`: Calculate cart subtotal
- `selectCartTotal`: Calculate cart total with taxes
- `selectCheckoutItem`: Get single checkout item
- `selectCheckoutMode`: Check if in single-item checkout mode

## Local Storage

Cart state is automatically persisted to localStorage:
- **Hydration**: Cart restored on app startup
- **Sync**: Updates saved immediately
- **Error Handling**: Graceful fallback on localStorage errors

## RTK Query Endpoints

Ready-to-use endpoints for future API integration:
- `syncCart`: Sync local cart with server
- `applyCoupon`: Apply discount coupons
- `calculateShipping`: Get shipping costs
- `checkAvailability`: Validate product availability

## Testing

The Redux store can be easily tested:
```tsx
import { store } from '@/lib/store/store'
import { addToCart } from '@/lib/store/features/cart/cartSlice'

// Dispatch actions for testing
store.dispatch(addToCart({ product, quantity: 1, selectedSize: '3ml' }))

// Access state for assertions
const state = store.getState()
expect(state.cart.items).toHaveLength(1)
```

## Next Steps

1. **Remove Context**: Once fully migrated, remove the old CartContext
2. **API Integration**: Connect RTK Query endpoints to backend
3. **Persistence**: Consider Redux Persist for more advanced persistence
4. **Performance**: Add React.memo to components as needed
