"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useCart } from "@/context/CartContext"


const cartItems = [
  {
    _id: "1",
    name: "Oud Wood Intense",
    size: "50ml",
    quantity: 2,
    primaryImage: "/sample-product.jpg", // Add this image in your public folder or use placeholder
    variantPrices: { "50ml": 1200 },
  },
  {
    _id: "2",
    name: "Amber & Spice",
    size: "100ml",
    quantity: 1,
    primaryImage: "/sample-product-2.jpg",
    variantPrices: { "100ml": 1800 },
  },
]

const updateQuantity = (id: string, size: string, newQuantity: number) => {
  console.log(`Updating ${id} (${size}) to quantity ${newQuantity}`)
}

const removeFromCart = (id: string, size: string) => {
  console.log(`Removing ${id} (${size}) from cart`)
}

const calculateSubtotal = () =>
  cartItems.reduce(
    (acc, item) => acc + (item.variantPrices?.[item.size] || 0) * item.quantity,
    0
  )

  

interface CartDrawerProps {
  visible: boolean
  onClose: () => void
}

export default function CartDrawer({ visible, onClose }: CartDrawerProps) {
  const router = useRouter()
  // const { cartItems, updateQuantity, removeFromCart, calculateSubtotal } = useCart()

  const redirectToCart = () => {
    onClose()
    router.push("/cart")
  }

  const handleCheckout = () => {
    onClose()
    router.push("/checkout")
  }

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[500px] flex flex-col p-0 bg-gradient-to-b from-white to-gray-50"
      >
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-red-50 to-pink-50">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-red-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex flex-col items-start">
              <span>Shopping Cart</span>
              {cartItems.length > 0 && (
                <span className="text-sm font-normal text-gray-600">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700">
                {cartItems.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 px-6 py-4">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item: any, index: number) => (
                  <div
                    key={`${item._id}-${item.size}-${index}`}
                    className="group p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:shadow-md transition-all duration-300 bg-white"
                  >
                    <div className="flex items-start gap-4">
                      {/* Enhanced Product Image */}
                      <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                        <Image
                          src={item.primaryImage || "/placeholder.svg?height=96&width=80"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Enhanced Product Details */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-sm leading-tight text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            <span>Size: {item.size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full hover:bg-red-50 hover:border-red-200 bg-transparent"
                              onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full hover:bg-red-50 hover:border-red-200 bg-transparent"
                              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-red-600">৳{item.variantPrices?.[item.size]?.toFixed(2)} BDT</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2"
                            onClick={() => removeFromCart(item._id, item.size)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs font-bold">0</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  Discover our amazing collection of premium perfumes and add some to your cart.
                </p>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </ScrollArea>

          {/* Enhanced Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t bg-white p-6 space-y-4">
              <Separator />

              {/* Subtotal with enhanced styling */}
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-xs text-gray-500">{cartItems.length} items</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-600">৳{calculateSubtotal()?.toFixed(2)}</span>
                  <span className="text-sm text-gray-600 block">BDT</span>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 font-semibold rounded-xl transition-all duration-300 bg-transparent"
                  onClick={redirectToCart}
                >
                  View Full Cart
                </Button>
                <Button
                  className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>

              {/* Enhanced Disclaimer */}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">🔒 Secure checkout • Free shipping on orders over ৳1000</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
