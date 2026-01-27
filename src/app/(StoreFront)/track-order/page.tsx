"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import StoreContainer from "@/components/Layout/StoreContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowLeft,
  ClipboardCopy,
  Truck,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";
import { useLazyGetOrderByIdQuery } from "@/redux/store/api/order/ordersApi";

const STATUS_STEPS = [
  { key: "PLACED", label: "Order Placed", icon: ClipboardCopy },
  { key: "PROCESSING", label: "Processing", icon: Clock },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

export default function TrackOrderPage() {
  const [searchId, setSearchId] = useState("");

  const [triggerGetOrderById, { data, isFetching, isUninitialized, error }] =
    useLazyGetOrderByIdQuery();

  const order = data?.data;

  const onSearch = async () => {
    if (searchId.trim()) {
      await triggerGetOrderById(searchId.trim());
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  const activeStepIndex = useMemo(() => {
    if (!order) return 0;
    const map: Record<string, number> = {
      PENDING: 0,
      PLACED: 0,
      PROCESSING: 1,
      SHIPPED: 2,
      DELIVERED: 3,
      COMPLETED: 3,
    };
    return map[order.status?.toUpperCase?.() ?? "PENDING"] ?? 0;
  }, [order]);

  return (
    <StoreContainer>
      <div className="min-h-screen px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/shop" aria-label="Back to shop">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Track Order
            </h1>
            <p className="text-gray-600 mt-1">
              Enter your order ID to check its status
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your order ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={onKeyDown}
                className="h-12 flex-1"
              />
              <Button
                onClick={onSearch}
                className="h-12 min-w-[140px]"
                disabled={!searchId.trim() || isFetching}
              >
                <Search className="w-4 h-4 mr-2" />
                {isFetching ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* No Order Found */}
        {!isFetching && !order && !isUninitialized && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">No order found</p>
                <p className="text-sm text-amber-700">
                  Please make sure your order ID is correct and try again.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {isFetching && (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span>
                      <span className="text-gray-800 font-medium">
                        Order ID:
                      </span>{" "}
                      {order.id}
                    </span>
                    <Separator orientation="vertical" className="hidden md:block" />
                    <span>
                      <span className="text-gray-800 font-medium">Placed:</span>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                    <Separator orientation="vertical" className="hidden md:block" />
                    <span>
                      <span className="text-gray-800 font-medium">
                        Payment:
                      </span>{" "}
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      {STATUS_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= activeStepIndex;
                        return (
                          <div
                            key={step.key}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                                isActive
                                  ? "bg-green-50 border-green-500 text-green-600"
                                  : "bg-gray-100 border-gray-200 text-gray-400"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <p
                              className={`text-xs mt-2 ${
                                isActive ? "text-gray-800" : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>
                            {index < STATUS_STEPS.length - 1 && (
                              <div
                                className={`h-0.5 w-full -mt-5 ${
                                  index < activeStepIndex
                                    ? "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Items in this Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-b pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.primaryImage}
                          alt={item.product?.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {item.variant?.size}
                            {item.variant?.unit ? ` ${item.variant.unit}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p>Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-800">
                          ৳{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span> {order.name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {order.phone}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {order.email || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {order.address}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span>৳{order.amount?.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Status</span>
                    <Badge variant="secondary" className="uppercase">
                      {order.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p>
                    If you have questions about your order, contact our support
                    team.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {error && !isFetching && (
          <Card className="border-red-200 bg-red-50 mt-6">
            <CardContent className="p-6">
              <p className="text-red-700">
                Error fetching order. Please try again later.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </StoreContainer>
  );
}
