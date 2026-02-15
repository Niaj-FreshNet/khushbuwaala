"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Package2, Loader2, Sparkles, BadgeCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import StoreContainer from "@/components/Layout/StoreContainer";
import { useCart } from "@/redux/store/hooks/useCart";
import { CartItem } from "@/types/cart.types";
import { CartItemCard } from "@/components/Modules/Home/CartItemCard";
import { DesktopCartTable } from "@/components/Modules/Cart/DesktopCartTable";
import { kwPushBeginCheckout } from "@/lib/Analytics/kwEcom";
import { useApplyDiscountMutation } from "@/redux/store/api/discount/discountApi";
import { toast } from "sonner";

type DiscountLabel =
  | { type: "percentage"; value: number }
  | { type: "fixed"; value: number }
  | null;

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
  const { cartItems, appliedCouponCode, setAppliedCouponCode, clearAppliedCouponCode } =
    useCart();

  const [couponCode, setCouponCode] = useState("");
  const [isRouting, startTransition] = useTransition();
  const [checkoutClicked, setCheckoutClicked] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [discountInfo, setDiscountInfo] = useState<DiscountLabel>(null);

  const [applyDiscount, { isLoading: isApplyingDiscount }] = useApplyDiscountMutation();

  const formatBDT = (amount: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    })
      .format(Math.max(0, Math.round(amount)))
      .replace("BDT", "৳")
      .trim();

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

  const buildDiscountItems = () => {
    return (cartItems || []).map((item: any) => {
      const [sizeValue, sizeUnit] = String(item?.selectedSize || "").split(" ");

      const matchedVariant = item?.product?.variants?.find(
        (v: any) =>
          Number(v?.size) === Number(sizeValue) &&
          String(v?.unit || "").toLowerCase() === String(sizeUnit || "").toLowerCase()
      );

      const price = Number(item?.selectedPrice ?? matchedVariant?.price ?? 0);
      const qty = Number(item?.quantity || 1);

      const productId = item?.product?.id || item?.product?._id || item?.productId;

      const variantId =
        item?.variantId ||
        item?.selectedVariantId ||
        matchedVariant?.id ||
        matchedVariant?._id;

      return { productId, variantId, price, qty };
    });
  };

  const pickDiscountAmount = (res: any) => Number(res?.data?.discountAmount ?? res?.discountAmount ?? 0);

  const pickDiscountInfo = (res: any): DiscountLabel => {
    const items = res?.data?.items ?? res?.items ?? [];

    // Prefer promo discount
    for (const it of items) {
      const promo = (it?.appliedDiscounts ?? []).find((d: any) => d?.code);
      if (promo?.type && typeof promo?.value === "number") {
        return { type: promo.type, value: Number(promo.value) };
      }
    }

    // fallback auto discount
    for (const it of items) {
      const auto = (it?.appliedDiscounts ?? []).find((d: any) => !d?.code);
      if (auto?.type && typeof auto?.value === "number") {
        return { type: auto.type, value: Number(auto.value) };
      }
    }

    return null;
  };

  const discountLabel = useMemo(() => {
    if (!discountInfo) return null;
    if (discountInfo.type === "percentage") return `${Math.round(discountInfo.value)}%`;
    return formatBDT(discountInfo.value);
  }, [discountInfo]);

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const total = discountedSubtotal; // shipping calculated at checkout

  const applyCoupon = async () => {
    // remove flow
    if (appliedCouponCode) {
      clearAppliedCouponCode();
      setDiscount(0);
      setDiscountInfo(null);
      toast.success("Coupon removed");
      return;
    }

    const code = couponCode.trim().toUpperCase();
    if (!code) return toast.error("Enter a coupon code");

    try {
      const items = buildDiscountItems();

      if (!items.length) return toast.error("Your cart is empty.");
      if (items.some((it) => !it.price || it.price <= 0)) {
        return toast.error("Some items have invalid price.");
      }

      const res = await applyDiscount({ code, items }).unwrap();

      const discountAmount = pickDiscountAmount(res);
      const info = pickDiscountInfo(res);

      if (discountAmount <= 0) {
        toast.error("This coupon doesn't apply to your cart.");
        return;
      }

      setAppliedCouponCode(code);
      setDiscount(discountAmount);
      setDiscountInfo(info);
      setCouponCode("");
      toast.success(`Coupon applied: -${formatBDT(discountAmount)}`);
    } catch (e: any) {
      const msg = e?.data?.message || e?.error || "Failed to apply coupon.";
      toast.error(msg);
    }
  };

  const removeCoupon = () => {
    clearAppliedCouponCode();
    setDiscount(0);
    setDiscountInfo(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  useEffect(() => {
    const revalidate = async () => {
      if (!appliedCouponCode) return;
      if (!cartItems?.length) {
        clearAppliedCouponCode();
        setDiscount(0);
        setDiscountInfo(null);
        return;
      }

      try {
        const items = buildDiscountItems();
        const res = await applyDiscount({ code: appliedCouponCode, items }).unwrap();
        setDiscount(pickDiscountAmount(res));
        setDiscountInfo(pickDiscountInfo(res));
      } catch {
        clearAppliedCouponCode();
        setDiscount(0);
        setDiscountInfo(null);
      }
    };

    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, appliedCouponCode]);

  const totalItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum: number, item: any) => sum + (Number(item?.quantity) || 0), 0);
  }, [cartItems]);

  const handleCheckout = () => {
    if (checkoutClicked) return;
    setCheckoutClicked(true);

    const items = (cartItems || [])
      .map((item: any) => ({
        item_id: String(item?.product?.id || item?.product?.slug || ""),
        item_name: String(item?.product?.name || ""),
        item_brand: String(item?.product?.brand || "KhushbuWaala"),
        item_category: String(item?.product?.categoryId || ""),
        item_variant: String(item?.selectedSize || ""),
        price: Number(item?.selectedPrice || 0),
        quantity: Number(item?.quantity || 1),
      }))
      .filter((i: any) => i.item_id);

    kwPushBeginCheckout({
      currency: "BDT",
      value: Number(total || 0),
      items,
    });

    startTransition(() => {
      router.push("/checkout");
    });

    window.setTimeout(() => setCheckoutClicked(false), 5000);
  };

  return (
    <StoreContainer>
      {/* ✅ IMPORTANT: Shell must match loading.tsx */}
      <div className="min-h-screen bg-gray-50 pt-4 sm:pt-8 pb-8">
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
              <Badge
                variant="secondary"
                className="text-sm sm:text-base font-semibold px-3 py-1.5 shrink-0"
              >
                {formatBDT(subtotal)}
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

                {/* Desktop Promo Banner (keeps layout consistent after removing Order Notes) */}
                <div className="hidden lg:block">
                  <Card className="overflow-hidden border bg-white">
                    <CardContent className="p-0">
                      {/* Header strip */}
                      <div className="relative p-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50" />
                        <div className="relative">
                          <div className="flex items-start justify-between gap-6">
                            <div className="min-w-0">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border text-sm font-medium text-gray-800">
                                <Sparkles className="h-4 w-4" />
                                Premium Perfume House
                              </div>

                              <h3 className="mt-3 text-xl font-bold text-gray-900">
                                Make it a signature set ✨
                              </h3>
                              <p className="mt-1 text-sm text-gray-600 max-w-xl">
                                Pair your current picks with a complementary note for a richer, longer-lasting scent experience.
                              </p>
                            </div>

                            <div className="shrink-0">
                              <Button asChild variant="outline" className="bg-white/70">
                                <Link href="/shop">
                                  <ShoppingBag className="h-4 w-4 mr-2" />
                                  Explore More
                                </Link>
                              </Button>
                            </div>
                          </div>

                          {/* Perks */}
                          <div className="mt-5 grid grid-cols-3 gap-3">
                            <div className="rounded-lg border bg-white/70 p-3">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <BadgeCheck className="h-4 w-4" />
                                Authentic Oils
                              </div>
                              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                                Carefully crafted blends for premium projection.
                              </p>
                            </div>

                            <div className="rounded-lg border bg-white/70 p-3">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <Sparkles className="h-4 w-4" />
                                Best Sellers
                              </div>
                              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                                Add a crowd favorite to complete your lineup.
                              </p>
                            </div>

                            <div className="rounded-lg border bg-white/70 p-3">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <Truck className="h-4 w-4" />
                                Fast Delivery
                              </div>
                              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                                Quick dispatch so you enjoy your scent sooner.
                              </p>
                            </div>
                          </div>

                          {/* Quick links */}
                          <div className="mt-5 flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="secondary" className="bg-white/70">
                              <Link href="/new-arrivals">New Arrivals</Link>
                            </Button>
                            <Button asChild size="sm" variant="secondary" className="bg-white/70">
                              <Link href="/shop">Best Sellers</Link>
                            </Button>
                            <Button asChild size="sm" variant="secondary" className="bg-white/70">
                              <Link href="/gifts-and-packages">Gift and Combo Packs </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                {/* Coupon */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Discount Code</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {appliedCouponCode ? (
                      // ✅ COUPON APPLIED VIEW
                      <div className="flex items-center justify-between gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                          <span className="text-green-700 font-medium truncate">
                            {appliedCouponCode}
                          </span>

                          {discountLabel && (
                            <span className="text-green-700 text-xs font-semibold whitespace-nowrap">
                              ({discountLabel})
                            </span>
                          )}
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
                    ) : (
                      // ✅ INPUT VIEW
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={applyCoupon}
                          disabled={!couponCode.trim() || isApplyingDiscount}
                          variant="outline"
                          className="sm:w-auto w-full"
                        >
                          {isApplyingDiscount ? "Applying..." : "Apply"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Order Summary</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-800">
                        <span>Subtotal</span>
                        <span>{formatBDT(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-green-700">
                          <span className="flex items-center gap-2">
                            {discountLabel ? `${discountLabel} ` : ""}
                            Discount{appliedCouponCode ? ` (${appliedCouponCode})` : ""}
                          </span>
                          <span>-{formatBDT(discount)}</span>
                        </div>
                      )}

                      {discount > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal after discount</span>
                          <span>{formatBDT(discountedSubtotal)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-base font-semibold text-gray-900">
                        <span>Total</span>
                        <span>{formatBDT(total)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full"
                      size="lg"
                      disabled={checkoutClicked || isRouting}
                    >
                      {checkoutClicked || isRouting ? (
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">We Accept</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {["Visa", "Mastercard", "bKash", "Nagad", "Rocket", "Cash"].map(
                        (method) => (
                          <div
                            key={method}
                            className="p-2 border rounded text-center text-xs font-medium bg-gray-50"
                          >
                            {method}
                          </div>
                        )
                      )}
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
