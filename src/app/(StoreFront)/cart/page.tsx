"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Heart, Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/store/hooks/useCart"
import type { Product } from "@/lib/Data/data"
import Image from "next/image"
import Link from "next/link"

// Types
interface CartItem extends Product {
  quantity: number
  size: string
  variantPrices?: { [key: string]: number }
}

interface CartItemCardProps {
  item: CartItem
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void
  onRemove: (productId: string, size: string) => void
}

interface DesktopCartTableProps {
  items: CartItem[]
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void
  onRemove: (productId: string, size: string) => void
}

// Empty cart illustration component
const EmptyCartIllustration = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="relative w-48 h-48 mb-6 opacity-60">
      <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-full" />
      <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-gray-400" strokeWidth={1} />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-bold">0</span>
      </div>
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center">
      Your Cart is Empty
    </h2>
    <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
      Discover our amazing collection of premium perfume oils and find your signature scent.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <Button asChild variant="gradient" size="lg" className="min-w-[160px]">
        <Link href="/shop">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="min-w-[160px]">
        <Link href="/new-arrivals">
          <Package2 className="w-4 h-4 mr-2" />
          New Arrivals
        </Link>
      </Button>
    </div>
  </div>
)

// Cart item component
const CartItemCard = ({ item, onUpdateQuantity, onRemove }: CartItemCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const price = item.variantPrices?.[item.size] || item.price || 0
  const total = price * item.quantity

  const handleQuantityChange = async (increment: number) => {
    setIsUpdating(true)
    const newQuantity = Math.max(item.quantity + increment, 1)
    onUpdateQuantity(item._id, item.size, newQuantity)
    // Simulate brief loading state for better UX
    setTimeout(() => setIsUpdating(false), 200)
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative">
            <div className="w-20 h-24 md:w-24 md:h-28 rounded-lg overflow-hidden bg-gray-100 group-hover:shadow-lg transition-shadow duration-300">
              <Image
                src={item.primaryImage}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 80px, 96px"
              />
            </div>
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5"
            >
              {item.size}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm">
                  Size: <span className="font-medium">{item.size}</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(item._id, item.size)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={item.quantity === 1 || isUpdating}
                    className="rounded-r-none border-r"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <div className="w-10 flex items-center justify-center text-sm font-medium">
                    {isUpdating ? "..." : item.quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={isUpdating}
                    className="rounded-l-none border-l"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">
                  ৳{price.toFixed(2)} each
                </p>
                <p className="font-semibold text-gray-900">
                  ৳{total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Desktop cart table component
const DesktopCartTable = ({ items, onUpdateQuantity, onRemove }: DesktopCartTableProps) => {
  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Total</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.map((item: CartItem, index: number) => {
          const price = item.variantPrices?.[item.size] || item.price || 0
          const total = price * item.quantity

          return (
            <div key={`${item._id}-${item.size}`}>
              <div className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors duration-200">
                {/* Product */}
                <div className="col-span-6 flex items-center gap-4">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.primaryImage}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="font-medium">৳{price.toFixed(2)}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemove(item._id, item.size)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onUpdateQuantity(item._id, item.size, Math.max(item.quantity - 1, 1))}
                      disabled={item.quantity === 1}
                      className="rounded-r-none border-r"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="w-12 flex items-center justify-center text-sm font-medium">
                      {item.quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onUpdateQuantity(item._id, item.size, item.quantity + 1)}
                      className="rounded-l-none border-l"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="font-semibold">৳{total.toFixed(2)}</span>
                </div>
              </div>
              {index < items.length - 1 && <Separator />}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, calculateSubtotal } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleCheckout = () => {
    // Add Facebook Pixel tracking if needed
    // ReactPixel.track("InitiateCheckout", {...})
    router.push("/checkout")
  }

  const applyCoupon = () => {
    if (couponCode.trim()) {
      // In a real app, validate coupon with API
      setAppliedCoupon(couponCode)
      setCouponCode("")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const discount = appliedCoupon ? subtotal * 0.1 : 0 // 10% discount for demo
  const total = subtotal - discount

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/shop">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              ৳{subtotal.toFixed(2)}
            </Badge>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyCartIllustration />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mobile Layout */}
              <div className="lg:hidden space-y-4">
                {cartItems.map((item: CartItem) => (
                  <CartItemCard
                    key={`${item._id}-${item.size}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block">
                <DesktopCartTable
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              </div>

              {/* Additional Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Special instructions for your order..."
                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Coupon Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Discount Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                        variant="outline"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700 font-medium">{appliedCoupon}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-green-700 hover:text-green-800"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>৳{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-৳{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>৳{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    variant="gradient"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Secure checkout powered by SSL encryption
                  </p>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">We Accept</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {['Visa', 'Mastercard', 'bKash', 'Nagad', 'Rocket', 'Cash'].map((method) => (
                      <div key={method} className="p-2 border rounded text-center text-xs font-medium bg-gray-50">
                        {method}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
