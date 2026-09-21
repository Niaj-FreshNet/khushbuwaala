"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  ShoppingCart,
  Trash2,
  ExternalLink,
  User,
  RefreshCw,
  Eye,
  DollarSign,
  CheckCircle2,
  Clock,
  UserX,
  Package,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  useGetAllCartsQuery,
  useRemoveCartItemMutation,
} from "@/redux/store/api/cart/cartApi";
import { toast } from "sonner";

export default function AdminAllCartsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [inspectItem, setInspectItem] = useState<any | null>(null);
  const limit = 100;

  const queryParams = useMemo(() => {
    const p: Record<string, any> = { page, limit };
    if (statusFilter !== "ALL") p.status = statusFilter;
    if (searchTerm.trim()) p.searchTerm = searchTerm.trim();
    return p;
  }, [page, limit, statusFilter, searchTerm]);

  const { data: response, isLoading, isFetching, refetch } = useGetAllCartsQuery(queryParams);
  const [removeCartItem, { isLoading: isDeleting }] = useRemoveCartItemMutation();

  const cartList: any[] = response?.data || [];
  const meta = response?.meta || { page: 1, total: 0, totalPage: 1 };

  // Calculate top KPI totals from the current view / set
  const metrics = useMemo(() => {
    let pipelineValue = 0;
    let inCartCount = 0;
    let orderedCount = 0;
    let guestCount = 0;

    cartList.forEach((it) => {
      const lineTotal = Number(it.price || 0) * Number(it.quantity || 1);
      if (it.status === "IN_CART") {
        pipelineValue += lineTotal;
        inCartCount++;
      } else if (it.status === "ORDERED") {
        orderedCount++;
      }
      if (!it.userId && !it.user) guestCount++;
    });

    return { pipelineValue, inCartCount, orderedCount, guestCount };
  }, [cartList]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cart record?")) return;
    try {
      await removeCartItem(id).unwrap();
      toast.success("Cart item removed");
      if (inspectItem?.id === id) setInspectItem(null);
    } catch {
      toast.error("Failed to delete cart item");
    }
  };

  const formatBDT = (val: number) => `৳${Math.round(val || 0).toLocaleString("en-BD")}`;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "IN_CART":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Active Cart
          </span>
        );
      case "ORDERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Converted to Order
          </span>
        );
      case "SOLD":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Showroom Sale
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-full mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100/70 text-red-600 rounded-xl">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Cart Pipeline & Bags
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Monitor live shopper bags, abandoned items, and converted checkouts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 bg-white shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Pipeline</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{formatBDT(metrics.pipelineValue)}</h3>
              <p className="text-[11px] text-amber-600 mt-0.5">Potential checkout value</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Carts</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{metrics.inCartCount}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Items currently in cart</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Converted Items</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{metrics.orderedCount}</h3>
              <p className="text-[11px] text-emerald-600 mt-0.5">Successfully placed orders</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Visitors</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{metrics.guestCount}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Unregistered shopper bags</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <UserX className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control / Filter Bar */}
      <Card className="border-gray-200/80 shadow-xs">
        <CardContent className="p-3.5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Filter by product, SKU, customer name, email or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-10 text-sm bg-gray-50/50 border-gray-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[170px] h-10 text-sm bg-white border-gray-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="IN_CART">Active (In Cart)</SelectItem>
                <SelectItem value="ORDERED">Converted (Ordered)</SelectItem>
                <SelectItem value="SOLD">Direct Sold</SelectItem>
              </SelectContent>
            </Select>

            {searchTerm || statusFilter !== "ALL" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Clear Filters
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-gray-200/80 shadow-xs overflow-hidden">
        <CardHeader className="p-4 bg-gray-50/50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-gray-900">
              Cart Records ({meta.total})
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Page {meta.page} of {meta.totalPage || 1}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow className="text-xs">
                  <TableHead className="w-[60px] pl-4">Item</TableHead>
                  <TableHead className="min-w-[200px]">Product & Variant</TableHead>
                  <TableHead className="min-w-[170px]">Shopper</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                        <RefreshCw className="h-6 w-6 animate-spin text-red-600" />
                        <span className="text-xs font-medium">Loading cart database…</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : cartList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
                        <ShoppingCart className="h-8 w-8 stroke-[1.5] text-gray-300" />
                        <span className="text-sm font-semibold text-gray-700">No carts match your filter</span>
                        <span className="text-xs text-gray-400">Adjust your search keyword or selected status.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  cartList.map((item: any) => {
                    const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
                    const sizeLabel = `${item.size ?? item.variant?.size ?? ""} ${String(item.unit ?? item.variant?.unit ?? "").toUpperCase()}`.trim();

                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Image */}
                        <TableCell className="pl-4">
                          <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/80 shrink-0">
                            <Image
                              src={item.product?.primaryImage || "/placeholder.png"}
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>

                        {/* Product & Variant */}
                        <TableCell>
                          <div className="min-w-0 max-w-[240px]">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {item.product?.name || "Unlisted Product"}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                              {sizeLabel && (
                                <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px] font-medium">
                                  {sizeLabel}
                                </span>
                              )}
                              {item.variant?.sku && (
                                <span className="truncate text-gray-400 font-mono text-[10px]">
                                  SKU: {item.variant.sku}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          {item.user ? (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-red-50 text-red-700 font-bold flex items-center justify-center text-xs shrink-0 border border-red-100">
                                {item.user.name?.slice(0, 1).toUpperCase() || "U"}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">{item.user.name}</p>
                                <p className="text-[11px] text-gray-500 truncate">{item.user.phone || item.user.email}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <span className="h-2 w-2 rounded-full bg-gray-300" />
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                Guest Visitor
                              </span>
                            </div>
                          )}
                        </TableCell>

                        {/* Quantity */}
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded-md bg-gray-100 text-gray-900 font-bold text-xs">
                            {item.quantity}
                          </span>
                        </TableCell>

                        {/* Unit Price */}
                        <TableCell className="text-xs text-gray-600 font-medium">
                          {formatBDT(item.price)}
                        </TableCell>

                        {/* Line Total */}
                        <TableCell className="text-sm font-bold text-gray-900">
                          {formatBDT(lineTotal)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <div className="flex flex-col gap-1 items-start">
                            {renderStatusBadge(item.status)}
                            {item.order?.invoice && (
                              <Link
                                href={`/dashboard/orders/${item.order.id}`}
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold hover:underline"
                              >
                                #{item.order.invoice}
                                <ExternalLink className="h-2.5 w-2.5" />
                              </Link>
                            )}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-[11px] text-gray-500">
                          {item.updatedAt ? format(new Date(item.updatedAt), "dd MMM yyyy, p") : "—"}
                        </TableCell>

                        {/* Action buttons */}
                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                              onClick={() => setInspectItem(item)}
                              title="Inspect Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={isDeleting}
                              onClick={() => handleDelete(item.id)}
                              title="Remove Cart Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      {meta.totalPage > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold">{cartList.length}</span> of{" "}
            <span className="font-semibold">{meta.total}</span> records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs h-8"
            >
              Previous
            </Button>
            <span className="text-xs text-gray-600 font-semibold px-1">
              Page {page} of {meta.totalPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPage}
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              className="text-xs h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Quick Inspect Modal */}
      {inspectItem && (
        <Dialog open={Boolean(inspectItem)} onOpenChange={() => setInspectItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-red-600" />
                Cart Record Inspector
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Cart Item ID: <span className="font-mono text-gray-700">{inspectItem.id}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-white border shrink-0">
                  <Image
                    src={inspectItem.product?.primaryImage || "/placeholder.png"}
                    alt={inspectItem.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{inspectItem.product?.name}</h4>
                  <p className="text-gray-500 mt-0.5">
                    Size: {inspectItem.size || inspectItem.variant?.size} {inspectItem.unit || inspectItem.variant?.unit}
                  </p>
                  <p className="font-semibold text-red-600 mt-1">
                    {formatBDT(inspectItem.price)} × {inspectItem.quantity} = {formatBDT(inspectItem.price * inspectItem.quantity)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">User Type</span>
                  <span className="font-medium text-gray-900">
                    {inspectItem.user ? "Registered Customer" : "Guest / Visitor"}
                  </span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Cart Status</span>
                  <span className="font-medium text-gray-900">{inspectItem.status}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Product ID</span>
                  <span className="font-mono text-[11px] truncate block">{inspectItem.productId}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Variant ID</span>
                  <span className="font-mono text-[11px] truncate block">{inspectItem.variantId || "N/A"}</span>
                </div>
              </div>

              {inspectItem.order && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Linked Order</span>
                    <span className="font-semibold text-emerald-900 text-sm">Invoice #{inspectItem.order.invoice}</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="bg-white border-emerald-300 text-emerald-700">
                    <Link href={`/dashboard/orders/${inspectItem.order.id}`} className="flex items-center gap-1 text-xs">
                      View Order <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}