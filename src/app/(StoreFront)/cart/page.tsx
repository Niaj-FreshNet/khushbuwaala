"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Package2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import StoreContainer from "@/components/Layout/StoreContainer";
import { useCart } from "@/redux/store/hooks/useCart";
import { CartItem } from "@/types/cart.types";
import { CartItemCard } from "@/components/Modules/Cart/CartItemCard";
import { DesktopCartTable } from "@/components/Modules/Cart/DesktopCartTable";

// ✅ Empty cart illustration component
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

    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Button asChild size="lg" className="min-w-[160px]">
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
);

export default function CartPage() {
  const router = useRouter();
  const { cartItems } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isRouting, startTransition] = useTransition();
  const [checkoutClicked, setCheckoutClicked] = useState(false);

  // ✅ Subtotal: safe + consistent (works even if selectedPrice exists or not)
  const subtotal = useMemo(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;

    return cartItems.reduce((sum: number, item: any) => {
      // If your store already provides selectedPrice, prefer it
      const direct = Number(item?.selectedPrice);
      const priceFromSelected = Number.isFinite(direct) ? direct : null;

      if (priceFromSelected !== null) {
        return sum + priceFromSelected * (Number(item?.quantity) || 1);
      }

      // Otherwise derive from selectedSize + variants
      const [sizeValue, sizeUnit] = String(item?.selectedSize || "").split(" ");
      const matchedVariant = item?.product?.variants?.find(
        (v: any) =>
          Number(v?.size) === Number(sizeValue) &&
          String(v?.unit || "").toLowerCase() === String(sizeUnit || "").toLowerCase()
      );

      const selectedPrice = Number(matchedVariant?.price) || 0;
      return sum + selectedPrice * (Number(item?.quantity) || 1);
    }, 0);
  }, [cartItems]);

  const discount = appliedCoupon ? subtotal * 0.1 : 0; // demo 10%
  const total = subtotal - discount;

  const totalItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum: number, item: any) => sum + (Number(item?.quantity) || 0), 0);
  }, [cartItems]);

  const handleCheckout = () => {
    if (checkoutClicked) return; // prevent double click
    setCheckoutClicked(true);

    startTransition(() => {
      router.push("/checkout");
    });

    // Optional: safety fallback (if route fails or very slow)
    window.setTimeout(() => setCheckoutClicked(false), 8000);
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    setAppliedCoupon(couponCode.trim());
    setCouponCode("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <StoreContainer>
      {/* ✅ IMPORTANT: Shell must match loading.tsx */}
      <div className="min-h-screen bg-gray-50 pt-4 sm:pt-8 pb-6">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-start sm:items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="shrink-0">
                <Link href="/shop">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-1">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              </div>
            </div>

            {totalItems > 0 && (
              <Badge variant="secondary" className="text-base sm:text-lg font-semibold px-3 py-1 shrink-0">
                ৳{subtotal.toFixed(2)}
              </Badge>
            )}
          </div>

          {totalItems === 0 ? (
            <EmptyCartIllustration />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mobile */}
                <div className="lg:hidden space-y-4">
                  {cartItems.map((item: CartItem) => (
                    <CartItemCard
                      key={`${item.product?.id}-${item.selectedSize}`}
                      item={item}
                    />
                  ))}
                </div>

                {/* Desktop */}
                <div className="hidden lg:block">
                  <DesktopCartTable items={cartItems} />
                </div>

                {/* Order Notes */}
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
              <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                {/* Coupon */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Discount Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!appliedCoupon ? (
                      <div className="flex flex-col sm:flex-row gap-2">
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
                          className="sm:w-auto w-full"
                        >
                          Apply
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                          <span className="text-green-700 font-medium truncate">
                            {appliedCoupon}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-green-700 hover:text-green-800 shrink-0"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary */}
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
                      size="lg"
                      disabled={checkoutClicked || isRouting}
                    >
                      {(checkoutClicked || isRouting) ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Proceed to Checkout"
                      )}
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
                      {["Visa", "Mastercard", "bKash", "Nagad", "Rocket", "Cash"].map((method) => (
                        <div
                          key={method}
                          className="p-2 border rounded text-center text-xs font-medium bg-gray-50"
                        >
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
    </StoreContainer>
  );
}
