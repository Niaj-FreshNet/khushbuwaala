"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/redux/store/hooks";
import { selectLastOrder, selectOrderById } from "@/redux/store/features/orders/ordersSlice";
import OrderInvoiceModal from "@/components/Modules/Orders/OrderInvoiceModal";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import StoreContainer from "@/components/Layout/StoreContainer";
import { kwPushPurchase } from "@/lib/Analytics/kwEcom";
import { useApplyDiscountMutation } from "@/redux/store/api/discount/discountApi";

type CartLikeItem = {
  id: string;
  productId?: string;
  variantId?: string;
  name: string;
  primaryImage: string;
  size: string;
  quantity: number;
  unitOriginal: number;
  unitDiscounted: number;
};

function formatBDT(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  })
    .format(Math.max(0, Math.round(Number(amount || 0))))
    .replace("BDT", "৳")
    .trim();
}

function upper(v: any) {
  return String(v ?? "").trim().toUpperCase();
}

function safeStr(v: any, fallback = "N/A") {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
}

function orderPaymentLabel(method: any) {
  const m = String(method ?? "").toLowerCase();
  if (m === "bkash") return "bKash (Online Payment)";
  if (m === "cashondelivery" || m === "cash_on_delivery" || m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";
  // your checkout uses "cashOnDelivery"
  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery" || m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";
  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  if (m === "cashondelivery") return "Cash on Delivery";

  // final fallback: pretty print
  return upper(method || "Not Selected");
}

export default function ThankYouPage() {
  const params = useSearchParams();
  const queryOrderId = params.get("order") || undefined;

  const lastOrder = useAppSelector(selectLastOrder);
  const orderById = useAppSelector(queryOrderId ? selectOrderById(queryOrderId) : () => undefined);

  // ✅ prefer query order > last order
  const order = (orderById as any)?.data || (lastOrder as any)?.data;
  console.log("order", order);

  // discount breakdown (optional)
  const [discountBreakdown, setDiscountBreakdown] = useState<any>(null);
  const [applyDiscount] = useApplyDiscountMutation();

  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  // ✅ fetch breakdown only when order is ready
  useEffect(() => {
    const run = async () => {
      if (!order?.orderItems?.length) return;

      const code = order?.coupon ? String(order.coupon) : undefined;

      const items = order.orderItems
        .map((it: any) => ({
          productId: it.productId || it.product?.id,
          variantId: it.variantId || it.variant?.id,
          // backend might store item.price as "original unit" OR "final unit"
          // we pass what exists; breakdown will be best-effort
          price: Number(it.price ?? it.variant?.price ?? 0),
          qty: Math.max(1, Number(it.quantity || 1)),
        }))
        .filter((x: any) => x.productId && x.price > 0 && x.qty > 0);

      if (!items.length) {
        setDiscountBreakdown(null);
        return;
      }

      try {
        const res = await applyDiscount({ code, items }).unwrap();
        const root = (res as any)?.data ?? res;
        setDiscountBreakdown(root);
      } catch {
        setDiscountBreakdown(null);
      }
    };

    run();
  }, [order?.id, order?.coupon, applyDiscount]);

  // ✅ discounted unit map must be created BEFORE cartItems uses it (fixes hoisting crash)
  const discountedUnitMap = useMemo(() => {
    const map = new Map<string, number>();
    const items = discountBreakdown?.items ?? [];

    for (const it of items) {
      const key = `${it.productId}__${it.variantId || ""}`;
      map.set(key, Number(it.discountedPrice ?? it.price ?? 0)); // per unit
    }
    return map;
  }, [discountBreakdown]);

  // ✅ map orderItems -> display items (original + discounted)
  const cartItems = useMemo(() => {
    if (!order?.orderItems?.length) return [];

    return order.orderItems.map((item: any) => {
      const productId = item.productId || item.product?.id;
      const variantId = item.variantId || item.variant?.id;
      const key = `${productId}__${variantId || ""}`;

      const qty = Math.max(1, Number(item.quantity || 1));

      // ✅ original unit (regular price)
      const originalUnit = Number(item.price ?? item.variant?.price ?? 0);

      // ✅ discounted unit from breakdown
      const discountedUnit = discountedUnitMap.get(key) ?? originalUnit;

      const lineOriginal = Math.max(0, Math.round(originalUnit * qty));
      const lineDiscounted = Math.max(0, Math.round(discountedUnit * qty));
      const save = Math.max(0, lineOriginal - lineDiscounted);

      return {
        id: item.id,
        productId,
        variantId,
        name: item.product?.name || "Product",
        primaryImage: item.product?.primaryImage || "/placeholder.png",
        size: `${item.size} ${String(item.unit || "").toUpperCase()}`.trim(),
        quantity: qty,
        originalUnit,
        discountedUnit,
        lineOriginal,
        lineDiscounted,
        save,
        hasDiscount: save > 0,
      };
    });
  }, [order, discountedUnitMap]);

  // ✅ totals: trust server truth first, display breakdown if available
  const totals = useMemo(() => {
    const subtotalOriginal = cartItems.reduce((sum, p) => sum + p.lineOriginal, 0);
    const subtotalDiscounted = cartItems.reduce((sum, p) => sum + p.lineDiscounted, 0);

    const discountAmount = Math.max(0, Number(order?.discountAmount ?? 0));
    const coupon = order?.coupon ? String(order.coupon) : null;

    const shippingCost = Number(order?.shippingCost ?? 0);
    const estimatedTaxes = 0;

    const total = Number(order?.amount ?? (subtotalDiscounted + shippingCost + estimatedTaxes));

    return {
      subtotalOriginal,
      subtotalDiscounted,
      discountAmount,
      coupon,
      shippingCost,
      estimatedTaxes,
      total,
    };
  }, [cartItems, order]);

  // ✅ Purchase tracking (safe + dedupe)
  const purchaseSentRef = useRef<string>("");

  const purchaseUserData = useMemo(() => {
    if (!order) return undefined;
    const name = order?.shipping?.name || order?.customer?.name || order?.customerInfo?.name;
    const phone = order?.shipping?.phone || order?.customerInfo?.phone;
    const email = order?.shipping?.email || order?.customerInfo?.email;
    return {
      em: email || undefined,
      ph: phone || undefined,
      fn: name || undefined,
      external_id: order.customerId || order.customer?.id || undefined,
      ct: order?.shipping?.district || order?.customerInfo?.district || undefined,
      country: "bd",
    };
  }, [order]);

  const purchaseItems = useMemo(() => {
    if (!order?.orderItems?.length) return [];
    return order.orderItems
      .map((it: any) => {
        const productId = it?.productId || it?.product?.id;
        if (!productId) return null;
        const unit = it?.unit || it?.variant?.unit;
        const size = it?.size ?? it?.variant?.size;
        const variantLabel = size && unit ? `${size} ${upper(unit)}` : undefined;
        return {
          item_id: String(productId),
          item_name: String(it?.product?.name || "Product"),
          item_brand: "KhushbuWaala",
          item_variant: variantLabel,
          price: Number(it?.price ?? 0),
          quantity: Math.max(1, Number(it?.quantity || 1)),
        };
      })
      .filter(Boolean) as any[];
  }, [order]);

  useEffect(() => {
    if (!order) return;
    if (!purchaseItems.length) return;

    const badStatuses = new Set(["CANCELLED", "FAILED", "REFUNDED"]);
    if (order.status && badStatuses.has(String(order.status).toUpperCase())) return;

    if (String(order.method).toLowerCase() === "bkash" && !order.isPaid) return;

    const transactionId = String(order.id || "");
    if (!transactionId) return;

    if (purchaseSentRef.current === transactionId) return;
    purchaseSentRef.current = transactionId;

    const eventId = `kw_${transactionId}`;

    kwPushPurchase({
      event_id: eventId,
      transaction_id: transactionId,
      currency: "BDT",
      value: Number(order.amount ?? 0),
      shipping: Number(order.shippingCost ?? 0),
      tax: 0,
      coupon: order.coupon ?? undefined,
      user_data: purchaseUserData,
      shipping_data: {
        email: order.shipping?.email,
        phone: order.shipping?.phone,
        name: order.shipping?.name,
        district: order.shipping?.district,
      },
      items: purchaseItems,
    });
  }, [order, purchaseItems, purchaseUserData]);

  if (!order) {
    return (
      <div className="min-h-[60vh] pt-24 container mx-auto px-4 flex flex-col items-center text-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Thank you!</h1>
        <p className="text-gray-600">We could not find your order details. You can continue shopping.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const customerName = order?.customer?.name || order?.shipping?.name || order?.customerInfo?.name || "Customer";
  const orderPublicId = order?.invoice || order?.id;

  return (
    <StoreContainer>
      <div className="min-h-screen bg-gray-50 pt-4 sm:pt-6 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="rounded-2xl bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border border-red-100 p-5">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                Congratulations, your order has been confirmed{" "}
                <span className="text-green-600">successfully</span>.
              </h1>
              <p className="text-gray-700 mt-1 text-sm sm:text-base break-words">
                Order ID: <span className="font-semibold">#{safeStr(orderPublicId)}</span>
              </p>
            </div>
          </div>

          {/* Mobile summary toggle */}
          <div className="lg:hidden mb-6">
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
                <span className="text-sm font-medium text-gray-700">Order summary</span>
                <span className="text-xs text-gray-500">{isMobileSummaryOpen ? "Tap to hide" : "Tap to view"}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base font-semibold text-gray-900">{formatBDT(totals.total)}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isMobileSummaryOpen ? "rotate-180" : ""}`}
                />
              </div>
            </Button>

            {isMobileSummaryOpen && (
              <div id="mobile-order-summary" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {cartItems.map((p, idx) => {
                      const lineOriginal = p.unitOriginal * p.quantity;
                      const lineDisc = p.unitDiscounted * p.quantity;
                      const hasDisc = p.unitDiscounted !== p.unitOriginal;

                      return (
                        <div key={`${p.id}-${p.size}-${idx}`} className="flex items-start gap-3">
                          <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                            <Image src={p.primaryImage} alt={p.name} fill className="object-cover" />
                            <div className="absolute top-1 right-1 text-xs bg-black text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                              {p.quantity}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-gray-500">Size: {p.size}</p>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatBDT(p.lineDiscounted)}
                            </div>

                            {p.hasDiscount && (
                              <>
                                <div className="text-xs text-gray-500 line-through">
                                  {formatBDT(p.lineOriginal)}
                                </div>
                                <span className="inline-flex mt-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                  Save {formatBDT(p.save)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatBDT(totals.subtotalOriginal)}</span>
                    </div>

                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Discount{totals.coupon ? ` (${totals.coupon})` : ""}</span>
                        <span>-{formatBDT(totals.discountAmount)}</span>
                      </div>
                    )}

                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Subtotal after discount</span>
                        <span>{formatBDT(totals.discountedSubtotal)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatBDT(totals.shippingCost)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Estimated Taxes</span>
                      <span>{formatBDT(totals.estimatedTaxes)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{formatBDT(totals.total)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8 pb-8">
            {/* Left */}
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md">Thank you, {customerName}!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p>Your order is confirmed. We’ll notify you when it ships.</p>
                  <p>You can track your order status anytime using the order ID.</p>

                  <p>
                    Payment Method:{" "}
                    <span className="font-semibold">{orderPaymentLabel(order.method)}</span>
                  </p>
                  <p>
                    Order Status: <span className="font-semibold">{safeStr(order.status, "PENDING")}</span>
                  </p>

                  <div className="pt-2">
                    <Button variant="outline" onClick={() => setIsInvoiceOpen(true)}>
                      View Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Order details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-white p-4 sm:p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Contact Information</p>
                      <Separator className="mb-3" />
                      <div className="space-y-1 text-sm text-gray-700">
                        <p className="break-words">{safeStr(order?.shipping?.name || order?.customerInfo?.name)}</p>
                        <p className="break-words">{safeStr(order?.shipping?.address || order?.customerInfo?.address)}</p>
                        <p className="break-words">{safeStr(order?.shipping?.phone || order?.customerInfo?.phone)}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-white p-4 sm:p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Payment Summary</p>
                      <Separator className="mb-3" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total</span>
                        <span className="font-semibold text-gray-900">{formatBDT(totals.total)}</span>
                      </div>

                      {totals.discountAmount > 0 && (
                        <div className="flex items-center justify-between text-sm mt-2 text-green-700">
                          <span>Discount</span>
                          <span>-{formatBDT(totals.discountAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline">
                      <Link href="/track-order">Track Order</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right desktop summary */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-md">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {cartItems.map((p, idx) => {
                        const lineOriginal = p.unitOriginal * p.quantity;
                        const lineDisc = p.unitDiscounted * p.quantity;
                        const hasDisc = p.unitDiscounted !== p.unitOriginal;

                        return (
                          <div key={`${p.id}-${p.size}-${idx}`} className="flex items-start gap-3">
                            <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                              <Image src={p.primaryImage} alt={p.name} fill className="object-cover" />
                              <div className="absolute top-1 right-1 text-xs bg-black text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                {p.quantity}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs text-gray-500">Size: {p.size}</p>
                            </div>

                            <div className="text-sm font-medium shrink-0 text-right">
                              {p.hasDiscount ? (
                                <div className="leading-tight">
                                  <div className="font-semibold text-gray-900">{formatBDT(p.lineDiscounted)}</div>
                                  <div className="text-xs text-gray-400 line-through">{formatBDT(p.lineOriginal)}</div>
                                  <span className="inline-flex mt-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                    Save {formatBDT(p.save)}
                                  </span>
                                </div>
                              ) : (
                                <span>{formatBDT(p.lineDiscounted)}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatBDT(totals.subtotalOriginal)}</span>
                    </div>

                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Discount{totals.coupon ? ` (${totals.coupon})` : ""}</span>
                        <span>-{formatBDT(totals.discountAmount)}</span>
                      </div>
                    )}

                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Subtotal after discount</span>
                        <span>{formatBDT(totals.discountedSubtotal)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatBDT(totals.shippingCost)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Estimated Taxes</span>
                      <span>{formatBDT(totals.estimatedTaxes)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{formatBDT(totals.total)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Invoice Modal */}
          {isInvoiceOpen && (
            <OrderInvoiceModal
              order={order}
              isInvoiceOpen={isInvoiceOpen}
              setIsInvoiceOpen={setIsInvoiceOpen}
              discountBreakdown={discountBreakdown}
            />
          )}
        </div>
      </div>
    </StoreContainer>
  );
}
