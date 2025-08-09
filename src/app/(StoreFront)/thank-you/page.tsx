"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { selectLastOrder, selectOrderById } from "@/lib/store/features/orders/ordersSlice"
import { useAppSelector } from "@/lib/store/hooks"
import OrderReceipt from "@/components/Modules/Orders/OrderReceipt"

export default function ThankYouPage() {
  const params = useSearchParams()
  const queryOrderId = params.get("orderId") || undefined

  const lastOrder = useAppSelector(selectLastOrder)
  const orderById = useAppSelector(queryOrderId ? selectOrderById(queryOrderId) : () => undefined)
  const order = orderById || lastOrder

  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0)
  }, [])

  const totals = useMemo(() => {
    if (!order) return { subtotal: 0, shippingCost: 0, estimatedTaxes: 0, total: 0 }
    return {
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      estimatedTaxes: order.estimatedTaxes,
      total: order.total,
    }
  }, [order])

  if (!order) {
    return (
      <div className="min-h-[60vh] pt-24 container mx-auto px-4 flex flex-col items-center text-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Thank you!</h1>
        <p className="text-gray-600">We could not find your order details. You can continue shopping.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="container mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alhamdulillah! Order Confirmed</h1>
            <p className="text-gray-600 mt-1 text-sm">Order ID: <span className="font-semibold">{order.orderId}</span></p>
          </div>
        </div>
      </div>

      {/* Mobile summary toggle */}
      <div className="lg:hidden container mx-auto px-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setIsMobileSummaryOpen((s) => !s)}
        >
          <span className="text-sm">Show order summary</span>
          <span className="text-base font-bold">৳{totals.total.toFixed(2)} BDT</span>
        </Button>

        {isMobileSummaryOpen && (
          <div className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                {order.cartItems.map((product, idx) => {
                  const unit = product.variantPrices?.[product.size] ?? product.price ?? 0
                  const line = unit * product.quantity
                  return (
                    <div key={`${product._id}-${product.size}-${idx}`} className="flex items-start gap-3">
                      <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                        <Image src={product.primaryImage} alt={product.name} fill className="object-cover" />
                        <div className="absolute -top-2 -right-2 text-xs bg-gray-200 text-black rounded-full px-2 py-0.5">
                          {product.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">Size: {product.size}</p>
                      </div>
                      <div className="text-sm font-medium">৳{line.toFixed(2)} BDT</div>
                    </div>
                  )
                })}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>৳{totals.subtotal.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>৳{totals.shippingCost.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Taxes</span>
                  <span>৳{totals.estimatedTaxes.toFixed(2)} BDT</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>৳{totals.total.toFixed(2)} BDT</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Confirmation and details */}
        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">Thank you, {order.shippingAddress.name}!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>Your order is confirmed. Well notify you when it ships.</p>
              <p>
                Payment Method: <span className="font-medium">
                  {order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Online Payment'}
                </span> <span className="ml-1 text-xs text-gray-500">({order.paymentStatus})</span>
              </p>
              <p>Shipping Method: {order.shippingMethod === 'insideDhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
              <div className="pt-2">
                <Button variant="outline" onClick={() => setIsReceiptOpen(true)}>View Invoice</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">Order details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-semibold mb-2">Contact Information</p>
                  <Separator className="mb-3" />
                  <p className="text-sm">{order.contactInfo.email || 'N/A'}</p>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-semibold mb-2">Payment Summary</p>
                  <Separator className="mb-3" />
                  <p className="text-sm">Total: ৳{order.total.toFixed(2)} <span className="text-xs">({order.paymentStatus})</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-semibold mb-2">Shipping Address</p>
                  <Separator className="mb-3" />
                  <div className="space-y-1 text-sm">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.contactNumber}</p>
                    <p>District: {order.shippingAddress.district}</p>
                    {order.shippingAddress.thana && <p>Thana: {order.shippingAddress.thana}</p>}
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-semibold mb-2">Billing Address</p>
                  <Separator className="mb-3" />
                  <div className="space-y-1 text-sm">
                    <p>{order.billingAddress.name}</p>
                    <p>{order.billingAddress.address}</p>
                    <p>{order.billingAddress.contactNumber}</p>
                    <p>District: {order.billingAddress.district}</p>
                    {order.billingAddress.thana && <p>Thana: {order.billingAddress.thana}</p>}
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-semibold mb-2">Notes</p>
                  <Separator className="mb-3" />
                  <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline">
                  <Link href={`/order/${order.orderId}`}>View Order</Link>
                </Button>
                <Button asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-md">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.cartItems.map((product, idx) => {
                    const unit = product.variantPrices?.[product.size] ?? product.price ?? 0
                    const line = unit * product.quantity
                    return (
                      <div key={`${product._id}-${product.size}-${idx}`} className="flex items-start gap-3">
                        <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                          <Image src={product.primaryImage} alt={product.name} fill className="object-cover" />
                          <div className="absolute -top-2 -right-2 text-xs bg-gray-200 text-black rounded-full px-2 py-0.5">
                            {product.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">Size: {product.size}</p>
                        </div>
                        <div className="text-sm font-medium">৳{line.toFixed(2)} BDT</div>
                      </div>
                    )
                  })}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>৳{totals.subtotal.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>৳{totals.shippingCost.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Taxes</span>
                  <span>৳{totals.estimatedTaxes.toFixed(2)} BDT</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>৳{totals.total.toFixed(2)} BDT</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <OrderReceipt order={order} isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} />
    </div>
  )
}


