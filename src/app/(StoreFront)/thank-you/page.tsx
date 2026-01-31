"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppSelector } from "@/redux/store/hooks"
import { selectLastOrder, selectOrderById } from "@/redux/store/features/orders/ordersSlice"
import OrderInvoiceModal from "@/components/Modules/Orders/OrderInvoiceModal"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import StoreContainer from "@/components/Layout/StoreContainer"
// import OrderInvoice from "@/components/Modules/Orders/OrderInvoice"

export default function ThankYouPage() {
  const params = useSearchParams()
  const queryOrderId = params.get("order") || undefined

  const lastOrder = useAppSelector(selectLastOrder)
  const orderById = useAppSelector(queryOrderId ? selectOrderById(queryOrderId) : () => undefined)
  const order = orderById?.data || lastOrder?.data
  console.log("order: ", order)

  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0)
  }, [])

  // Map API orderItems to cart-like structure for display
  const cartItems = useMemo(() => {
    if (!order?.orderItems) return []
    return order.orderItems.map((item) => ({
      id: item.id,
      name: item.product?.name || "Product",
      primaryImage: item.product?.primaryImage || "/placeholder.png",
      size: item.variant?.size || "Default",
      quantity: item.quantity,
      price: item.variant?.price || 0,
    }))
  }, [order])

  const totals = useMemo(() => {
    if (!cartItems) return { subtotal: 0, shippingCost: 0, estimatedTaxes: 0, total: 0 }
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = order?.shippingCost || 0
    const estimatedTaxes = order?.estimatedTaxes || 0
    const total = subtotal + shippingCost + estimatedTaxes
    return { subtotal, shippingCost, estimatedTaxes, total }
  }, [cartItems, order])

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
    <StoreContainer>
      {/* ✅ Keep shell consistent with loading.tsx */}
      <div className="min-h-screen bg-gray-50 pt-4 sm:pt-6 pb-6">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="container mx-auto px-4 mb-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                  Congratulations, Your order has been confirmed <span className="text-green-600">Successfully...</span>
                </h1>

                <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
                  Order ID: <span className="font-semibold">#{order.invoice}</span>
                </p>
              </div>
            </div>
          </div>


          {/* Mobile summary toggle */}
          {/* <div className="lg:hidden container mx-auto px-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between py-6 rounded-xl bg-white"
          onClick={() => setIsMobileSummaryOpen((s) => !s)}
        >
          <span className="text-sm font-medium text-gray-700">
            {isMobileSummaryOpen ? "Hide order summary" : "Show order summary"}
          </span>
          <span className="text-base font-semibold text-gray-900">
            ৳{totals.total.toFixed(2)} <span className="text-xs font-medium text-gray-600">BDT</span>
          </span>
        </Button>

        {isMobileSummaryOpen && (
          <div className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3"> */}
          <div className="lg:hidden container mx-auto px-4">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full h-auto py-4 px-4 flex items-center justify-between gap-3 rounded-xl bg-white shadow-sm",
                isMobileSummaryOpen && "ring-1 ring-gray-200"
              )}
              onClick={() => setIsMobileSummaryOpen((s) => !s)}
              aria-expanded={isMobileSummaryOpen}
              aria-controls="mobile-order-summary"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-gray-700">
                  Order summary
                </span>

                {/* tiny helper badge text */}
                <span className="text-xs text-gray-500">
                  {isMobileSummaryOpen ? "Tap to hide" : "Tap to view"}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base font-semibold text-gray-900">
                  ৳{totals.total.toFixed(2)} <span className="text-xs font-medium text-gray-600">BDT</span>
                </span>

                {/* toggle indicator */}
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isMobileSummaryOpen ? "rotate-180" : ""
                    }`}
                />
              </div>
            </Button>

            {isMobileSummaryOpen && (
              <div id="mobile-order-summary" className="mt-4 space-y-4">
                {/* your Card stays same */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {cartItems.map((product, idx) => {
                      const line = product.price * product.quantity
                      return (
                        <div key={`${product.id}-${product.size}-${idx}`} className="flex items-start gap-3">
                          <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={product.primaryImage}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover" />
                            <div className="absolute -top-2 -right-2 text-xs bg-gray-200 text-black rounded-full px-2 py-0.5">
                              {product.quantity}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">Size: {product.size}</p>
                          </div>
                          <div className="text-sm font-medium shrink-0 text-right">
                            ৳{line.toFixed(2)} <span className="text-xs font-normal text-gray-500">BDT</span>
                          </div>
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

          <div className="container mx-auto px-4 pt-4 pb-8 max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
            {/* Left: Confirmation and details */}
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md">Thank you, {order.customer?.name || 'Customer'}!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700 px-4 pb-2 sm:px-6">
                  <p>Your order is confirmed. We’ll notify you when it ships.</p>
                  <p> You can track your order status anytime using the order ID.</p>
                  <p>
                    Payment Method: <span className="font-semibold">
                      {order.isPaid ? 'Online Payment' : 'Cash on Delivery'}
                    </span>
                  </p>
                  <p>Order Status: <span className="font-semibold">{order.status}</span></p>
                  <div className="pt-2">
                    <Button variant="outline" className="cursor-pointer" onClick={() => setIsInvoiceOpen(true)}>View Invoice</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Order details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-4 pb-2 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-white p-4 sm:p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Contact Information</p>
                      <Separator className="mb-3" />
                      <div className="space-y-1 text-sm text-gray-700">
                        <p className="break-words">{order.shipping?.name || "N/A"}</p>
                        <p className="break-words">{order.shipping?.address || "N/A"}</p>
                        <p className="break-words">{order.shipping?.phone || "N/A"}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border bg-white p-4 sm:p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Payment Summary</p>
                      <Separator className="mb-3" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total</span>
                        <span className="font-semibold text-gray-900">৳{totals.total.toFixed(2)} BDT</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline">
                      {/* <Link href={`/order/${order.id}`}>View Order</Link> */}
                      <Link href="/track-order">Track Order</Link>
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
                      {cartItems.map((product, idx) => {
                        const line = product.price * product.quantity
                        return (
                          <div key={`${product.id}-${product.size}-${idx}`} className="flex items-start gap-3">
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
                            <div className="text-sm font-medium shrink-0 text-right">
                              ৳{line.toFixed(2)} <span className="text-xs font-normal text-gray-500">BDT</span>
                            </div>
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
          {/* <OrderReceipt order={order} isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} /> */}

          {/* Invoice Modal */}
          {isInvoiceOpen && <OrderInvoiceModal order={order} isInvoiceOpen={isInvoiceOpen} setIsInvoiceOpen={setIsInvoiceOpen} />}
        </div>
      </div>
    </StoreContainer>
  )
}
