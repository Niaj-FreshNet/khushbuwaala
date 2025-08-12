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
import { ShieldCheck, Truck, CreditCard, Percent, Info, Phone } from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/lib/store/hooks/useCart"
import { useCreateOrderMutation } from "@/lib/store/features/orders/ordersApi"
import { useAppDispatch } from "@/lib/store/hooks"
import { setOrder } from "@/lib/store/features/orders/ordersSlice"
import StoreContainer from "@/components/Layout/StoreContainer"

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

  // UX state
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Promotions
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)

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
  const discountedSubtotal = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount])
  const total = discountedSubtotal + estimatedTaxes + shippingCost

  const formatBDT = (amount: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    })
      .format(Math.max(0, Math.round(amount)))
      .replace("BDT", "৳")
      .trim()

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}
    if (!name.trim()) nextErrors.name = "Please enter your full name."
    if (!address.trim()) nextErrors.address = "Please enter your full address."
    if (!selectedDistrict) nextErrors.district = "Please select your district."
    const phone = contactNumber.replace(/\D/g, "")
    if (phone.length < 10) nextErrors.contactNumber = "Please enter a valid phone number."
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const applyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Enter a promo code to apply")
      return
    }
    if (appliedPromoCode) {
      setAppliedPromoCode(null)
      setDiscount(0)
      setPromoCode("")
      toast.success("Promo removed")
      return
    }
    const code = promoCode.trim().toUpperCase()
    let newDiscount = 0
    if (code === "WELCOME10") {
      newDiscount = Math.min(subtotal * 0.1, 300)
    } else if (code === "SAVE100") {
      newDiscount = 100
    } else {
      toast.error("Invalid promo code")
      return
    }
    if (subtotal <= 0) {
      toast.error("Your cart is empty")
      return
    }
    setAppliedPromoCode(code)
    setDiscount(newDiscount)
    toast.success(`Promo applied: -${formatBDT(newDiscount)}`)
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields")
      return
    }
    if (!agreeToTerms) {
      toast.error("Please agree to the terms to continue")
      return
    }

    const orderDetails = {
      cartItems: itemsToDisplay,
      subtotal,
      discount,
      shippingCost,
      estimatedTaxes,
      total,
      paymentMethod,
      shippingMethod,
      postStatus: "Pending",
      paymentStatus: paymentMethod === "cashOnDelivery" ? "Due" : "Paid",
      notes,
      promoCode: appliedPromoCode,
      contactInfo: { email },
      shippingAddress: {
        name,
        address,
        district: selectedDistrict as string,
        thana: customThana,
        contactNumber,
      },
      billingAddress:
        billingType === "sameAsShipping"
          ? { name, address, district: selectedDistrict as string, thana: customThana, contactNumber }
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
    <StoreContainer>
      <div className="min-h-screen px-4 py-8">
        {/* Header aligned with cart page styling */}
        <div className="px-4 mb-6">
          <div className="rounded-2xl bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border border-red-100 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Secure checkout • SSL encrypted
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-red-600" /> Fast delivery</div>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-red-600" /> COD available</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-600" /> Support: 10am–10pm</div>
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
            <span className="text-sm">{isMobileSummaryOpen ? "Hide" : "Show"} order summary</span>
            <span className="text-base font-bold">{formatBDT(total)}</span>
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
                        <div className="text-sm font-medium">{formatBDT(line)}</div>
                      </div>
                    )
                  })}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatBDT(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> Discount{appliedPromoCode ? ` (${appliedPromoCode})` : ""}</span>
                      <span>-{formatBDT(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatBDT(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Taxes</span>
                    <span>{formatBDT(estimatedTaxes)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatBDT(total)}</span>
                  </div>
                  {/* Promo code (mobile) */}
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Gift card or discount code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyPromo}>{appliedPromoCode ? "Remove" : "Apply"}</Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Use WELCOME10 or SAVE100</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="max-w-8xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="space-y-8 w-full lg:w-2/3">
            {/* Delivery Address */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-md">Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    placeholder="e.g. Rahim Uddin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Address</label>
                  <Input
                    placeholder="House, Road, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={errors.address ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  <p className="text-xs text-gray-500 mt-1">We deliver across Bangladesh</p>
                  {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Number</label>
                  <Input
                    placeholder="01XXXXXXXXX"
                    inputMode="numeric"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className={errors.contactNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.contactNumber && <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">District</label>
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
                    {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Thana (optional)</label>
                    <Input
                      placeholder="e.g. Gulshan"
                      value={customThana}
                      onChange={(e) => setCustomThana(e.target.value)}
                    />
                  </div>
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
                <div>
                  <label className="text-sm font-medium text-gray-700">Email (optional)</label>
                  <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
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
              
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(v) => setAgreeToTerms(Boolean(v))} />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleSubmit} className="w-full h-14 text-lg font-bold" variant="gradient" disabled={isPlacingOrder || !agreeToTerms}>
                {isPlacingOrder ? "Placing Order…" : "Complete Order"}
              </Button>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> SSL Secure</div>
                <div className="flex items-center gap-1"><Truck className="h-3 w-3 text-red-600" /> Fast Delivery</div>
                <div className="flex items-center gap-1"><Info className="h-3 w-3 text-blue-600" /> Easy Returns</div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary (desktop) */}
          <div className="hidden lg:block w-1/3">
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
                          <div className="text-sm font-medium">{formatBDT(line)}</div>
                        </div>
                      )
                    })}
                  </div>

                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatBDT(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> Discount{appliedPromoCode ? ` (${appliedPromoCode})` : ""}</span>
                      <span>-{formatBDT(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatBDT(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Taxes</span>
                    <span>{formatBDT(estimatedTaxes)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatBDT(total)}</span>
                  </div>

                  {/* Promo code */}
                  <div className="pt-2">
                    <label className="text-xs font-medium text-gray-600">Have a code?</label>
                    <div className="mt-1 flex gap-2">
                      <Input
                        placeholder="Gift card or discount code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyPromo}>{appliedPromoCode ? "Remove" : "Apply"}</Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Try WELCOME10 (10% up to ৳300) or SAVE100</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StoreContainer>
  )
}


