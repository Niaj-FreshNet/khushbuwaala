"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import StoreContainer from "@/components/Layout/StoreContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertCircle,
  ArrowLeft,
  ClipboardCopy,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Package,
  ChevronRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  ListOrdered,
} from "lucide-react";
import { useLazyTrackOrdersQuery } from "@/redux/store/api/order/ordersApi";
import { useRouter, useSearchParams } from "next/navigation";

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: ClipboardCopy },
  { key: "PROCESSING", label: "Parcel is being Ready", icon: Clock },
  { key: "SHIPPED", label: "Shipped to Courier", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const detailSectionRef = useRef<HTMLDivElement | null>(null);

  const [triggerTrackOrders, { data, isFetching, isUninitialized, error }] =
    useLazyTrackOrdersQuery();

  useEffect(() => {
    if (urlQuery && urlQuery.trim()) {
      setSearchQuery(urlQuery.trim());
      triggerTrackOrders(urlQuery.trim());
    }
  }, [urlQuery, triggerTrackOrders])

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/shop");
    }
  };

  const orders: any[] = data?.data || [];
  const selectedOrder = orders[selectedIndex] || orders[0] || null;

  const onSearch = async () => {
    if (searchQuery.trim()) {
      setSelectedIndex(0);
      await triggerTrackOrders(searchQuery.trim());
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  const selectOrder = (idx: number) => {
    setSelectedIndex(idx);
    setIsPickerOpen(false);

    // Smooth scroll to the details view on mobile
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        detailSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const activeStepIndex = useMemo(() => {
    if (!selectedOrder) return 0;
    const s = String(selectedOrder.status || "").toUpperCase();
    if (s === "DELIVERED" || s === "COMPLETED") return 2;
    if (s === "PROCESSING") return 1;
    return 0;
  }, [selectedOrder]);

  const formatBDT = (amount: number) => `৳${Math.round(amount || 0).toLocaleString("en-BD")}`;

  const renderStatusBadge = (status: string) => {
    const s = String(status || "").toUpperCase();
    if (s === "DELIVERED" || s === "COMPLETED") {
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Delivered</Badge>;
    }
    if (s === "PROCESSING") {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Processing</Badge>;
    }
    if (s === "CANCELED") {
      return <Badge className="bg-red-100 text-red-800 border-red-300">Canceled</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>;
  };

  return (
    <StoreContainer>
      <div className="min-h-screen bg-gray-50 pt-4 sm:pt-8 pb-6">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Go back"
              className="rounded-full bg-white shadow-xs hover:bg-gray-100 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                Track Your Order
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Track by Invoice ID, Phone, or Email
              </p>
            </div>
          </div>

          {/* Search Box */}
          <Card className="border-gray-200/80 shadow-xs mb-6">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter Invoice #, Phone (01...), or Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="h-11 sm:h-12 pl-10 text-sm sm:text-base bg-white border-gray-200 focus-visible:ring-red-500"
                  />
                </div>
                <Button
                  onClick={onSearch}
                  className="h-11 sm:h-12 px-6 font-semibold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-sm"
                  disabled={!searchQuery.trim() || isFetching}
                >
                  {isFetching ? "Searching..." : "Track Order"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Not Found State */}
          {!isFetching && orders.length === 0 && !isUninitialized && (
            <Card className="border-amber-200 bg-amber-50/70">
              <CardContent className="p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 text-sm">No orders found</h3>
                  <p className="text-xs sm:text-sm text-amber-700 mt-0.5">
                    No orders match <span className="font-semibold text-amber-900">"{searchQuery}"</span>. Please
                    verify your invoice ID or phone number.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading Indicator */}
          {isFetching && (
            <div className="space-y-4 animate-pulse">
              <div className="h-20 bg-gray-200 rounded-xl" />
              <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
          )}

          {/* Master-Detail Layout */}
          {orders.length > 0 && selectedOrder && (
            <div className="space-y-4">
              {/* Mobile Multi-Order Bar */}
              {orders.length > 1 && (
                <div className="lg:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Orders Found ({orders.length})
                    </span>

                    {/* Quick Drawer trigger for mobile */}
                    <Sheet open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 flex items-center gap-1">
                          <ListOrdered className="h-3.5 w-3.5" /> View All ({orders.length})
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] p-4">
                        <SheetHeader className="pb-3 text-left">
                          <SheetTitle className="text-base">Select Order to Track</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-[60vh] pr-2">
                          <div className="space-y-2 pb-6">
                            {orders.map((ord, idx) => (
                              <div
                                key={ord.id}
                                onClick={() => selectOrder(idx)}
                                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${idx === selectedIndex ? "border-red-500 bg-red-50/50" : "border-gray-200 bg-white"
                                  }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-gray-900">
                                      #{ord.invoice || ord.id.slice(-6)}
                                    </span>
                                    {renderStatusBadge(ord.status)}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {ord.createdAt ? format(new Date(ord.createdAt), "dd MMM yyyy") : ""} •{" "}
                                    {formatBDT(ord.amount)}
                                  </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Horizontal pill list on mobile */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                    {orders.map((ord, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={ord.id}
                          onClick={() => selectOrder(idx)}
                          className={`snap-start shrink-0 px-3.5 py-2 rounded-xl border text-left cursor-pointer transition-all ${isSelected
                            ? "bg-white border-red-500 ring-2 ring-red-100 shadow-xs"
                            : "bg-white/80 border-gray-200"
                            }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-gray-900">
                              #{ord.invoice || ord.id.slice(-6)}
                            </span>
                            {renderStatusBadge(ord.status)}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{formatBDT(ord.amount)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Main Grid: Sidebar (desktop) + Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Desktop Left Sidebar: Order List */}
                {orders.length > 1 && (
                  <div className="hidden lg:block lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {orders.length} Orders Found
                      </span>
                    </div>

                    <ScrollArea className="h-[680px] rounded-xl border border-gray-200/80 bg-white p-2">
                      <div className="space-y-2 pr-2">
                        {orders.map((ord, idx) => {
                          const isSelected = idx === selectedIndex;
                          return (
                            <div
                              key={ord.id}
                              onClick={() => selectOrder(idx)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                                ? "bg-red-50/40 border-red-500 ring-1 ring-red-500/20 shadow-xs"
                                : "bg-white border-gray-200/70 hover:border-gray-300"
                                }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900 text-sm">
                                    #{ord.invoice || ord.id.slice(-6)}
                                  </span>
                                  {renderStatusBadge(ord.status)}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {ord.createdAt ? format(new Date(ord.createdAt), "dd MMM yyyy") : ""} •{" "}
                                  <span className="font-semibold text-gray-800">{formatBDT(ord.amount)}</span>
                                </p>
                              </div>
                              <ChevronRight
                                className={`h-4 w-4 shrink-0 ${isSelected ? "text-red-600" : "text-gray-300"}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Right Side: Selected Order Details */}
                <div
                  ref={detailSectionRef}
                  className={`space-y-6 ${orders.length > 1 ? "lg:col-span-8" : "lg:col-span-12"}`}
                >
                  {/* Status Progress Stepper */}
                  <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader className="pb-3 border-b bg-gray-50/50">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-base font-bold text-gray-900">
                            Order <span className="text-red-600">#{selectedOrder.invoice || selectedOrder.id}</span>
                          </CardTitle>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Placed on{" "}
                            {selectedOrder.createdAt
                              ? format(new Date(selectedOrder.createdAt), "dd MMM yyyy, p")
                              : "—"}
                          </p>
                        </div>
                        {renderStatusBadge(selectedOrder.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                      <div className="flex items-center justify-between relative">
                        {STATUS_STEPS.map((step, idx) => {
                          const Icon = step.icon;
                          const isDone = idx <= activeStepIndex;
                          return (
                            <div key={step.key} className="flex-1 flex flex-col items-center z-10">
                              <div
                                className={`h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border-2 transition-colors ${isDone
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100"
                                  : "bg-white border-gray-200 text-gray-400"
                                  }`}
                              >
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <span
                                className={`text-[11px] sm:text-xs mt-2 text-center font-medium ${isDone ? "text-gray-900 font-semibold" : "text-gray-400"
                                  }`}
                              >
                                {step.label}
                              </span>

                              {idx < STATUS_STEPS.length - 1 && (
                                <div
                                  className={`absolute top-4 sm:top-5 h-0.5 sm:h-1 -z-10 transition-colors ${idx < activeStepIndex ? "bg-emerald-500" : "bg-gray-200"
                                    }`}
                                  style={{
                                    left: `${(100 / (STATUS_STEPS.length * 2)) * (idx * 2 + 1)}%`,
                                    width: `${100 / STATUS_STEPS.length}%`,
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Items List */}
                  <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader className="border-b bg-gray-50/50 pb-3">
                      <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Package className="h-4 w-4 text-red-600" />
                        Items in this Order (
                        {selectedOrder.orderItems?.reduce((a: number, b: any) => a + (b.quantity || 1), 0) || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-5 divide-y divide-gray-100">
                      {(selectedOrder.orderItems || []).map((item: any) => {
                        const sizePart = item.size || item.variant?.size;
                        const unitPart = item.unit || item.variant?.unit;
                        return (
                          <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden bg-gray-100 border shrink-0">
                                <Image
                                  src={item.product?.primaryImage || "/placeholder.png"}
                                  alt={item.product?.name || "Product"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                  {item.product?.name || "Perfume Item"}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                                  Size: {sizePart} {String(unitPart || "").toUpperCase()}
                                </p>
                                <span className="text-[11px] text-gray-600 font-medium sm:hidden">
                                  Qty: {item.quantity} × {formatBDT(item.price)}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-xs text-gray-500 hidden sm:block">Qty: {item.quantity}</p>
                              <p className="text-xs sm:text-sm font-bold text-gray-900">
                                {formatBDT(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Summary & Address Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Financial Summary */}
                    <Card className="border-gray-200/80 shadow-xs">
                      <CardHeader className="pb-2.5 border-b bg-gray-50/50">
                        <CardTitle className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Payment Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>Method</span>
                          <span className="font-semibold text-gray-900 capitalize">
                            {selectedOrder.method === "cashOnDelivery" ? "Cash on Delivery" : selectedOrder.method}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Status</span>
                          <span className={`font-semibold ${selectedOrder.isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                            {selectedOrder.isPaid ? "Paid" : "Due upon Delivery"}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span className="text-gray-900">{formatBDT(selectedOrder.shippingCost || 0)}</span>
                        </div>
                        {selectedOrder.discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-medium">
                            <span>Discount</span>
                            <span>-{formatBDT(selectedOrder.discountAmount)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                          <span>Total</span>
                          <span className="text-red-600">{formatBDT(selectedOrder.amount)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Delivery Destination */}
                    <Card className="border-gray-200/80 shadow-xs">
                      <CardHeader className="pb-2.5 border-b bg-gray-50/50">
                        <CardTitle className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-red-600" />
                          Delivery Destination
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-1.5 text-xs text-gray-700">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          {selectedOrder.shipping?.name || selectedOrder.name || "Customer"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {selectedOrder.shipping?.phone || selectedOrder.phone || "—"}
                        </div>
                        <div className="pt-1.5 text-gray-600 leading-relaxed border-t mt-1.5">
                          {selectedOrder.shipping?.address || selectedOrder.address || "Address provided at checkout"}
                          {selectedOrder.shipping?.district ? `, ${selectedOrder.shipping.district}` : ""}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StoreContainer>
  );
}