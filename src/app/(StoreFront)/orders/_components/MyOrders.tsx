"use client";

import Link from "next/link";
import { useGetMyOrdersQuery } from "@/redux/store/api/order/ordersApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { format } from "date-fns";

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "processing":
      return <Clock className="h-4 w-4 text-amber-600" />;
    case "shipped":
      return <Package className="h-4 w-4 text-blue-600" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-amber-100 text-amber-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function MyOrders() {
  const { data, isLoading, isError, error } = useGetMyOrdersQuery();

  // Correctly extract orders array from API response
  const orders = data?.data?.data || [];

  if (isLoading) return <OrdersSkeleton />;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {error?.data?.message || "Something went wrong. Please try again later."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <CardTitle>No Orders Yet</CardTitle>
            <CardDescription>
              Looks like you haven't placed any orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">
          You have {orders.length} order{orders.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Order ID:
                    </span>
                    <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                      {order.id.slice(0, 8)}
                    </code>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    {item.product?.primaryImage ? (
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-md w-16 h-16" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product?.name}
                      </h4>
                      {item.variant?.size && (
                        <p className="text-sm text-gray-600">
                          Size: {item.variant.size}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ৳{(item.variant?.price || item.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ৳{order.amount.toFixed(2)}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Skeleton Loader
function OrdersSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-32 mb-8" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="flex gap-4 items-center">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
