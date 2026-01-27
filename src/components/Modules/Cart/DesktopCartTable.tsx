"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CartItem } from "@/types/cart.types"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/redux/store/hooks/useCart"
import { Separator } from "@/components/ui/separator"

interface DesktopCartTableProps {
  items: CartItem[]
}

export const DesktopCartTable = ({ items }: DesktopCartTableProps) => {
  const { updateQuantity, removeFromCart } = useCart()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleQuantityChange = (item: CartItem, increment: number) => {
    // const [sizeValue, sizeUnit] = item.selectedSize.split(" ") || []
    // const matchedVariant = item?.product?.variants?.find(
    //   (v: any) =>
    //     Number(v.size) === Number(sizeValue) &&
    //     v.unit?.toLowerCase() === sizeUnit?.toLowerCase()
    // )
    // const variantId = matchedVariant?.id

    setUpdatingId(item.product?.id + item.selectedSize)
    const newQuantity = Math.max(item.quantity + increment, 1)
    updateQuantity(item.product?.id, item.selectedSize, newQuantity, item.product?.name, item.cartItemId)
    setTimeout(() => setUpdatingId(null), 200)
  }

  const handleRemove = (item: CartItem) => {
    // const [sizeValue, sizeUnit] = item.selectedSize.split(" ") || []
    // const matchedVariant = item?.product?.variants?.find(
    //   (v: any) =>
    //     Number(v.size) === Number(sizeValue) &&
    //     v.unit?.toLowerCase() === sizeUnit?.toLowerCase()
    // )
    // const variantId = matchedVariant?.id

    removeFromCart(item.product?.id, item.selectedSize, item.product?.name, item.cartItemId)
  }

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

          const isUpdating = updatingId === item.product?.id + item.selectedSize

          const subtotalPrice = item.selectedPrice * item.quantity

          return (
            <div key={`${item.product?.id}-${item.selectedSize}`}>
              <div className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors duration-200">
                {/* Product */}
                <div className="col-span-6 flex items-center gap-4">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product?.primaryImage || "/placeholder.svg?height=96&width=80"}
                      alt={item.product?.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Size: <span className="font-medium">{item.selectedSize}</span>
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="font-medium">৳{item.selectedPrice.toFixed(2)}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemove(item)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={item.quantity === 1 || isUpdating}
                      className="rounded-r-none border-r"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="w-12 flex items-center justify-center text-sm font-medium">
                      {isUpdating ? "..." : item.quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleQuantityChange(item, 1)}
                      disabled={isUpdating}
                      className="rounded-l-none border-l"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="font-semibold">৳{subtotalPrice.toFixed(2)}</span>
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
