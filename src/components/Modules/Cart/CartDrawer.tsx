"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import { useCart } from "@/contexts/CartContext"

interface CartDrawerProps {
  visible: boolean
  onClose: () => void
}

// Client Component - Only for cart interactivity
export default function CartDrawer ({ visible, onClose }: CartDrawerProps) {
  const router = useRouter()
  // const { cartItems, updateQuantity, removeFromCart, calculateSubtotal } = useCart()

  // Mock data - replace with actual cart context
  const cartItems: any[] = [] // Replace with actual cart items
  const calculateSubtotal = () => 0 // Replace with actual calculation

  const redirectToCart = () => {
    onClose()
    router.push("/cart")
  }

  const handleCheckout = () => {
    // Track checkout initiation
    // ReactPixel.track('InitiateCheckout', {
    //   content_ids: cartItems.map(item => item._id),
    //   content_type: 'product',
    //   value: calculateSubtotal(),
    //   currency: 'BDT',
    // })

    onClose()
    router.push("/checkout")
  }

  const removeFromCart = (id: string, size: string) => {
    // Implement remove from cart logic
    console.log("Remove from cart:", id, size)
  }

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cartItems.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <ScrollArea className="flex-1 px-6 py-4">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item: any, index: number) => (
                  <div
                    key={`${item._id}-${item.size}-${index}`}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={item.primaryImage || "/placeholder.svg?height=96&width=80"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm leading-tight">{item.name}</h4>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Size: {item.size}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-sm">৳{item.variantPrices?.[item.size]?.toFixed(2)} BDT</p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart(item._id, item.size)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mb-6">Add some products to see them here.</p>
                <Button onClick={onClose} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            )}
          </ScrollArea>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t bg-white p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Subtotal:</span>
                <span>৳{calculateSubtotal()?.toFixed(2)} BDT</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent" onClick={redirectToCart}>
                  View Cart
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center">
                All charges are billed in BDT. Taxes and shipping calculated at checkout.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
