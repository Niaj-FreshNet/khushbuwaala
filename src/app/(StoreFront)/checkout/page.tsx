"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useCart } from "@/lib/store/hooks/useCart"
import { useCreateOrderMutation } from "@/lib/store/features/orders/ordersApi"
import { useAppDispatch } from "@/lib/store/hooks"
import { setOrder } from "@/lib/store/features/orders/ordersSlice"

type ShippingMethod = "insideDhaka" | "outsideDhaka"
type PaymentMethod = "sslCommerz" | "cashOnDelivery"
type BillingType = "sameAsShipping" | "differentBillingAddress"

const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria", "Chandpur",
  "Chattogram", "Chuadanga", "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni",
  "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah",
  "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur",
  "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
  "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona",
  "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi",
  "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj",
  "Sylhet", "Tangail", "Thakurgaon",
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, calculateSubtotal, checkoutMode, checkoutItem, clearCart } = useCart()
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation()
  const dispatch = useAppDispatch()

  // UI state
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("insideDhaka")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cashOnDelivery")
  const [billingType, setBillingType] = useState<BillingType>("sameAsShipping")
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined)
  const [customThana, setCustomThana] = useState("")

  // Form state
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")

  // Billing details (when different)
  const [billingName, setBillingName] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [billingDistrict, setBillingDistrict] = useState("")
  const [billingThana, setBillingThana] = useState("")
  const [billingContactNumber, setBillingContactNumber] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }, [])

  const itemsToDisplay = useMemo(() => {
    return checkoutMode && checkoutItem ? [checkoutItem] : cartItems
  }, [checkoutMode, checkoutItem, cartItems])

  const shippingCost = useMemo(() => (shippingMethod === "outsideDhaka" ? 110 : 50), [shippingMethod])
  const subtotal = useMemo(() => calculateSubtotal(), [calculateSubtotal])
  const estimatedTaxes = 0
  const total = subtotal + estimatedTaxes + shippingCost

  const handleSubmit = async () => {
    // Basic validation
    if (!name || !address || !contactNumber || !selectedDistrict) {
      // Minimal inline alert; replace with toast if available in the project
      alert("Please fill in name, full address, contact number and district.")
      return
    }

    const orderDetails = {
      cartItems: itemsToDisplay,
      subtotal,
      shippingCost,
      estimatedTaxes,
      total,
      paymentMethod,
      shippingMethod,
      postStatus: "Pending",
      paymentStatus: paymentMethod === "cashOnDelivery" ? "Due" : "Paid",
      notes,
      contactInfo: { email },
      shippingAddress: {
        name,
        address,
        district: selectedDistrict,
        thana: customThana,
        contactNumber,
      },
      billingAddress:
        billingType === "sameAsShipping"
          ? { name, address, district: selectedDistrict, thana: customThana, contactNumber }
          : {
              name: billingName,
              address: billingAddress,
              district: billingDistrict,
              thana: billingThana,
              contactNumber: billingContactNumber,
            },
    }

    try {
      const data = await createOrder(orderDetails).unwrap()
      dispatch(setOrder({ ...orderDetails, orderId: data.orderId, createdAt: new Date().toISOString() }))
      clearCart()
      router.push(`/thank-you?orderId=${encodeURIComponent(data.orderId)}`)
    } catch (err) {
      console.error(err)
      alert("Failed to complete the order. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header aligned with cart page styling */}
      <div className="container mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1 text-sm">Secure checkout powered by SSL encryption</p>
          </div>
        </div>
      </div>

      {/* Mobile summary toggle */}
      <div className="lg:hidden container mx-auto px-4 mt-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setIsMobileSummaryOpen((s) => !s)}
        >
          <span className="text-sm">Show order summary</span>
          <span className="text-base font-bold">৳{total.toFixed(2)} BDT</span>
        </Button>

        {isMobileSummaryOpen && (
          <div className="mt-4 space-y-4">
            {/* Items */}
            <Card>
              <CardContent className="p-4 space-y-3">
                {itemsToDisplay.map((product, idx) => {
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
                  <span>৳{subtotal.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>৳{shippingCost.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Taxes</span>
                  <span>৳{estimatedTaxes.toFixed(2)} BDT</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)} BDT</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-8">
          {/* Delivery Address */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    value={selectedDistrict}
                    onValueChange={(value) => setSelectedDistrict(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Thana (optional)"
                  value={customThana}
                  onChange={(e) => setCustomThana(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="newsletter" />
                <label htmlFor="newsletter" className="text-sm text-gray-600">
                  Save this information for next time
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">Shipping Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={shippingMethod}
                onValueChange={(v) => setShippingMethod(v as ShippingMethod)}
                className="gap-3"
              >
                <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="insideDhaka" />
                  <span className="text-sm">Inside Dhaka - 50 TK</span>
                </label>
                <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="outsideDhaka" />
                  <span className="text-sm">Outside Dhaka - 110 TK</span>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Contact Email and Notes */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">Contact Email (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div>
                <p className="text-sm font-medium mb-2">Additional Notes (optional)</p>
                <textarea
                  placeholder="Add any specific instructions or notes for your order"
                  rows={4}
                  className="w-full p-3 border rounded-md bg-white"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={billingType}
                onValueChange={(v) => setBillingType(v as BillingType)}
                className="gap-3"
              >
                <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="sameAsShipping" />
                  <span className="text-sm">Same as shipping address</span>
                </label>
                <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="differentBillingAddress" />
                  <span className="text-sm">Use a different billing address</span>
                </label>
              </RadioGroup>

              {billingType === "differentBillingAddress" && (
                <div className="space-y-4 border rounded-md p-4">
                  <p className="text-sm font-medium">Billing Information</p>
                  <Input placeholder="Name" value={billingName} onChange={(e) => setBillingName(e.target.value)} />
                  <Input
                    placeholder="Address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="District"
                      value={billingDistrict}
                      onChange={(e) => setBillingDistrict(e.target.value)}
                    />
                    <Input
                      placeholder="Thana"
                      value={billingThana}
                      onChange={(e) => setBillingThana(e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Contact Number"
                    value={billingContactNumber}
                    onChange={(e) => setBillingContactNumber(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-500">All transactions are secure and encrypted.</p>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                className="gap-3"
              >
                <label className="flex items-center gap-3 border rounded-md p-3 opacity-60 cursor-not-allowed">
                  <RadioGroupItem value="sslCommerz" disabled />
                  <span className="text-sm">Pay First (Online Payment)</span>
                </label>
                <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="cashOnDelivery" />
                  <span className="text-sm">Cash on Delivery (COD)</span>
                </label>
                {paymentMethod === "cashOnDelivery" && (
                  <p className="text-xs text-gray-600 px-1">
                    Free shipping for items over 1,000 Taka. Shipping charge applied for items below 1,000 Taka.
                  </p>
                )}
              </RadioGroup>
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} className="w-full h-14 text-lg font-bold" variant="gradient" disabled={isPlacingOrder}>
            {isPlacingOrder ? "Placing Order…" : "Complete Order"}
          </Button>
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
                  {itemsToDisplay.map((product, idx) => {
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
                  <span>৳{subtotal.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>৳{shippingCost.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Taxes</span>
                  <span>৳{estimatedTaxes.toFixed(2)} BDT</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)} BDT</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


