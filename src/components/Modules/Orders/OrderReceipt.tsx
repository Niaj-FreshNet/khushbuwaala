"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/store/features/orders/ordersSlice"

interface OrderReceiptProps {
  order: Order
  isOpen: boolean
  onClose: () => void
}

export default function OrderReceipt({ order, isOpen, onClose }: OrderReceiptProps) {
  const totals = useMemo(() => {
    return {
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      estimatedTaxes: order.estimatedTaxes,
      total: order.total,
    }
  }, [order])

  if (!isOpen) return null

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/50 print:bg-transparent">
      <div className="w-full max-w-4xl px-4 print:px-0">
        <div className="relative bg-white rounded-xl shadow-xl print:shadow-none print:rounded-none">
          {/* Header actions (hidden in print) */}
          <div className="flex items-center justify-between p-4 border-b print:hidden">
            <h2 className="text-lg font-semibold">Invoice</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 h-10 rounded-md bg-black text-white text-sm font-medium"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="px-4 h-10 rounded-md border text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>

          {/* Printable content */}
          <div className="p-6 print:p-0">
            {/* Brand + Invoice meta */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">KhushbuWaala</h1>
                <p className="text-xs text-gray-500">Premium Perfume Oils</p>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  <span className="text-gray-500">Invoice #:</span>
                  <span className="ml-2 font-medium">{order.orderId}</span>
                </p>
                <p>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 font-medium">{new Date(order.createdAt || Date.now()).toLocaleString()}</span>
                </p>
                <p>
                  <span className="text-gray-500">Payment:</span>
                  <span className="ml-2 font-medium">{order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Online'}</span>
                  <span className="ml-2 text-xs text-gray-500">({order.paymentStatus})</span>
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="text-sm font-semibold">Bill To</p>
                  <p className="text-sm">{order.billingAddress.name}</p>
                  <p className="text-sm">{order.billingAddress.address}</p>
                  <p className="text-sm">{order.billingAddress.district}</p>
                  {order.billingAddress.thana && <p className="text-sm">Thana: {order.billingAddress.thana}</p>}
                  <p className="text-sm">{order.billingAddress.contactNumber}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="text-sm font-semibold">Ship To</p>
                  <p className="text-sm">{order.shippingAddress.name}</p>
                  <p className="text-sm">{order.shippingAddress.address}</p>
                  <p className="text-sm">{order.shippingAddress.district}</p>
                  {order.shippingAddress.thana && <p className="text-sm">Thana: {order.shippingAddress.thana}</p>}
                  <p className="text-sm">{order.shippingAddress.contactNumber}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="text-sm font-semibold">Contact</p>
                  <p className="text-sm">Email: {order.contactInfo.email || 'N/A'}</p>
                  <p className="text-sm">Shipping: {order.shippingMethod === 'insideDhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                  {order.notes && <p className="text-sm">Notes: {order.notes}</p>}
                </CardContent>
              </Card>
            </div>

            {/* Items table */}
            <div className="mt-6 overflow-hidden rounded-lg border">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-700">
                <div className="col-span-1 text-center">Sl.</div>
                <div className="col-span-6">Product Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-1 text-right">Unit</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              {order.cartItems.map((item, index) => {
                const unit = item.variantPrices?.[item.size] ?? item.price ?? 0
                const line = unit * item.quantity
                return (
                  <div key={`${item._id}-${item.size}-${index}`} className="grid grid-cols-12 px-4 py-3 border-t text-sm">
                    <div className="col-span-1 text-center">{index + 1}</div>
                    <div className="col-span-6">
                      <div className="font-medium">{item.name} <span className="text-gray-500 text-xs">× {item.size}</span></div>
                    </div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-1 text-right">৳{unit.toFixed(2)}</div>
                    <div className="col-span-2 text-right">৳{line.toFixed(2)}</div>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="mt-6 flex flex-col sm:items-end">
              <div className="w-full sm:w-80 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>৳{totals.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Taxes</span>
                  <span>৳{totals.estimatedTaxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>৳{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-8 text-xs text-gray-500">
              <p>Thank you for your purchase! If you have any questions, contact us at support@khushbuwaala.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


