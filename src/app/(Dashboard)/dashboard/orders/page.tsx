"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Search,
  Printer,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Loader2,
  Filter,
  X,
  Calendar,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllProductsAdminQuery } from "@/redux/store/api/product/productApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderDetailsModal from "./_components/OrderDetailsModal";
import OrderInvoice from "./_components/OrderInvoice";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
  useUpdatePaymentStatusMutation,
} from "@/redux/store/api/order/ordersApi";

interface Order {
  id: string;
  orderTime: string;
  invoice: string;
  customer: { name: string } | null;
  method: string;
  amount: number;
  status: string;
  isPaid: boolean;
}

type SortField = "orderTime" | "amount" | "status";
type SortOrder = "asc" | "desc";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "DELIVERED", "COMPLETED", "CANCELED"] as const;
const PAYMENT_OPTIONS = ["ALL", "PAID", "DUE"] as const;

const METHOD_OPTIONS = [
  { value: "ALL", label: "All Methods" },
  { value: "cash", label: "Cash" },
  { value: "bkashPayment", label: "Bkash Payment" },
  { value: "bkashPersonal", label: "Bkash Personal" },
  { value: "nagadPayment", label: "Nagad Payment" },
  { value: "nagadPersonal", label: "Nagad Personal" },
  { value: "rocketPayment", label: "Rocket Payment" },
  { value: "rocketPersonal", label: "Rocket Personal" },
  { value: "bankTransfer", label: "Bank Transfer" },
  { value: "cardPayment", label: "Card Payment" },
  { value: "cashOnDelivery", label: "Cash On Delivery" },
  { value: "onlinePayment", label: "Online Payment" },
] as const;

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function ProductPicker({
  value,
  onPick,
  searchValue,
  onSearchChange,
}: {
  value: string; // productId
  onPick: (product: { id: string; name: string } | null) => void; // null = all
  searchValue: string;
  onSearchChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  // ✅ Use your admin products endpoint, lightweight fields only
  const { data, isLoading } = useGetAllProductsAdminQuery(
    { page: 1, limit: 20, searchTerm: searchValue } as any,
    { skip: !open } // fetch only when popover opens
  );

  // your endpoint returns: { data: IProductResponse[]; meta: {...} }
  const products = (data as any)?.data || [];

  const selected = products.find((p: any) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value ? (selected?.name ?? "Selected product") : "All Products"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[340px]" align="start">
        <Command>
          <CommandInput
            placeholder="Search product..."
            value={searchValue}
            onValueChange={onSearchChange}
          />

          <CommandEmpty>
            {isLoading ? (
              <span className="flex items-center gap-2 p-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </span>
            ) : (
              "No product found."
            )}
          </CommandEmpty>

          <CommandGroup>
            {/* ALL */}
            <CommandItem
              onSelect={() => {
                onPick(null);
                setOpen(false);
              }}
            >
              <Check className={cn("mr-2 h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
              All Products
            </CommandItem>

            {products.map((p: any) => (
              <CommandItem
                key={p.id}
                onSelect={() => {
                  onPick({ id: p.id, name: p.name });
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === p.id ? "opacity-100" : "opacity-0")} />
                {p.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const OrderList = () => {
  // Global search
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 350);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState<"ALL" | (typeof STATUS_OPTIONS)[number]>("ALL");
  const [payment, setPayment] = useState<(typeof PAYMENT_OPTIONS)[number]>("ALL");
  const [method, setMethod] = useState<(typeof METHOD_OPTIONS)[number]["value"]>("ALL");

  // Date range (YYYY-MM-DD)
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Details modal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Invoice modal
  const [invoiceOrderId, setInvoiceOrderId] = useState<string | null>(null);
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<SortField>("orderTime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Product filter
  const [productId, setProductId] = useState<string>(""); // "" = ALL
  const [productQ, setProductQ] = useState<string>("");   // search inside picker
  const debouncedProductQ = useDebouncedValue(productQ, 250);
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  // Build query params for API (only send filters when needed)
  const queryArgs = useMemo(() => {
    const args: any = {
      searchTerm: debouncedSearch?.trim() || undefined,
      page,
      limit,

      // ✅ ALWAYS show only Website orders in this page
      orderSource: "WEBSITE",
    };

    if (status !== "ALL") args.status = status;
    if (payment !== "ALL") args.payment = payment; // backend supports payment=PAID|DUE
    if (method !== "ALL") args.method = method;

    if (dateFrom) args.dateFrom = dateFrom; // "YYYY-MM-DD"
    if (dateTo) args.dateTo = dateTo;

    if (productId) args.productId = productId;

    return args;
  }, [debouncedSearch, page, limit, status, payment, method, dateFrom, dateTo]);

  const { data, isLoading } = useGetAllOrdersQuery(queryArgs);

  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  // Fetch order for invoice modal
  const { data: invoiceData } = useGetOrderByIdQuery(invoiceOrderId || "", { skip: !invoiceOrderId });
  const invoiceOrder: Order | undefined = invoiceData?.data;

  const allOrders: Order[] = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;

  // local sorting (UI only)
  const sortedOrders = useMemo(() => {
    const sorted = [...allOrders];

    sorted.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === "orderTime") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [allOrders, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (field === sortField) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-[#FB923C]" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-[#FB923C]" />
    );
  };

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    try {
      setUpdatingStatusId(id);
      const res = await updateOrderStatus({ id, status: nextStatus }).unwrap();
      if (res?.success) toast.success(`Order marked as ${nextStatus}`);
      else toast.error("Failed to update order");
    } catch (e) {
      toast.error("Error updating order");
      console.error(e);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleUpdatePayment = async (id: string, isPaid: boolean) => {
    try {
      setUpdatingPaymentId(id);
      const res = await updatePaymentStatus({ id, isPaid }).unwrap();
      if (res?.success) toast.success(isPaid ? "Marked as PAID" : "Marked as DUE");
      else toast.error("Failed to update payment");
    } catch (e) {
      toast.error("Error updating payment");
      console.error(e);
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleViewInvoice = (orderId: string) => {
    setInvoiceOrderId(orderId);
    setIsInvoiceVisible(true);
  };

  const handlePrint = () => window.print();

  const methodLabel = (m: string) => {
    const found = METHOD_OPTIONS.find((x) => x.value === m);
    return found?.label || "Unknown";
  };

  const statusBadgeClass = (s: string) => {
    return s === "COMPLETED"
      ? "bg-green-500 hover:bg-green-600 text-white"
      : s === "CANCELED"
        ? "bg-red-500 hover:bg-red-600 text-white"
        : s === "DELIVERED"
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : s === "PROCESSING"
            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
            : "bg-orange-500 hover:bg-orange-600 text-white";
  };

  // active filter chips
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (debouncedSearch?.trim()) {
      chips.push({
        key: "search",
        label: `Search: ${debouncedSearch.trim()}`,
        onRemove: () => {
          setSearchTerm("");
          setPage(1);
        },
      });
    }

    if (status !== "ALL") {
      chips.push({
        key: "status",
        label: `Status: ${status}`,
        onRemove: () => {
          setStatus("ALL");
          setPage(1);
        },
      });
    }

    if (payment !== "ALL") {
      chips.push({
        key: "payment",
        label: `Payment: ${payment}`,
        onRemove: () => {
          setPayment("ALL");
          setPage(1);
        },
      });
    }

    if (method !== "ALL") {
      const lbl = METHOD_OPTIONS.find((x) => x.value === method)?.label || method;
      chips.push({
        key: "method",
        label: `Method: ${lbl}`,
        onRemove: () => {
          setMethod("ALL");
          setPage(1);
        },
      });
    }

    if (dateFrom || dateTo) {
      chips.push({
        key: "date",
        label: `Date: ${dateFrom || "…"} → ${dateTo || "…"}`,
        onRemove: () => {
          setDateFrom("");
          setDateTo("");
          setPage(1);
        },
      });
    }

    if (productId) {
      chips.push({
        key: "product",
        label: `Product: ${selectedProductName || "Selected"}`,
        onRemove: () => {
          setProductId("");
          setProductQ("");
          setPage(1);
        },
      });
    }

    return chips;
  }, [debouncedSearch, status, payment, method, dateFrom, dateTo]);

  const clearAll = () => {
    setSearchTerm("");
    setStatus("ALL");
    setPayment("ALL");
    setMethod("ALL");
    setDateFrom("");
    setDateTo("");
    setProductId("");
    setProductQ("");
    setPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-[360px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search invoice, name, phone, email, address..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9 border-[#FB923C] focus:ring-[#FB923C]"
              />
            </div>

            {/* Filter toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters((p) => !p)}
              className="border-[#FB923C] text-[#FB923C] hover:bg-[#FB923C]/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeChips.length > 0 && (
                <span className="ml-2 text-xs bg-[#FB923C] text-white rounded-full px-2 py-0.5">
                  {activeChips.length}
                </span>
              )}
            </Button>

            {activeChips.length > 0 && (
              <Button variant="ghost" onClick={clearAll} className="text-gray-600">
                Clear
              </Button>
            )}
          </div>

          <Button className="bg-[#FB923C] hover:bg-[#ff8a29] text-white" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>

        {/* Active chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeChips.map((c) => (
              <span
                key={c.key}
                className="inline-flex items-center gap-2 text-sm bg-white border rounded-full px-3 py-1"
              >
                {c.label}
                <button
                  type="button"
                  onClick={c.onRemove}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={`Remove ${c.key}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white border rounded-lg p-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Status</p>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v as any);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="border-input">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Payment</p>
                <Select
                  value={payment}
                  onValueChange={(v) => {
                    setPayment(v as any);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="border-input">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_OPTIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Method */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Method</p>
                <Select
                  value={method}
                  onValueChange={(v) => {
                    setMethod(v as any);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="border-input">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    {METHOD_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Ordered Product</p>

                <ProductPicker
                  value={productId}
                  searchValue={productQ}
                  onSearchChange={(v) => {
                    setProductQ(v);
                    // page doesn't need reset while typing
                  }}
                  onPick={(p) => {
                    setProductId(p?.id ?? "");
                    setSelectedProductName(p?.name ?? "");
                    setPage(1);
                  }}
                />
              </div>

              {/* Date from */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> From
                </p>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Date to */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> To
                </p>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Table className="border-[#FB923C] bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Sr.</TableHead>
              <TableHead>Invoice</TableHead>

              <TableHead onClick={() => toggleSort("orderTime")} className="cursor-pointer select-none">
                Order Time {renderSortIcon("orderTime")}
              </TableHead>

              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>

              <TableHead onClick={() => toggleSort("amount")} className="cursor-pointer select-none">
                Amount {renderSortIcon("amount")}
              </TableHead>

              <TableHead onClick={() => toggleSort("status")} className="cursor-pointer select-none">
                Status {renderSortIcon("status")}
              </TableHead>

              <TableHead>Payment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={9}>
                    <Skeleton className="w-full h-6 my-2" />
                  </TableCell>
                </TableRow>
              ))
            ) : sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}.</TableCell>

                  <TableCell>
                    <Link
                      target="_blank"
                      href={`/dashboard/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      #{order.invoice}
                    </Link>
                  </TableCell>

                  <TableCell>
                    {order.orderTime
                      ? new Date(order.orderTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                      : "N/A"}
                  </TableCell>

                  <TableCell>{order.customer?.name || "N/A"}</TableCell>
                  <TableCell>{methodLabel(order.method)}</TableCell>
                  <TableCell>{order.amount} BDT</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge
                          className={`${statusBadgeClass(order.status)} ${updatingStatusId === order.id ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                            }`}
                          title="Update Status"
                        >
                          {updatingStatusId === order.id ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Updating...
                            </span>
                          ) : (
                            order.status
                          )}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["PROCESSING", "COMPLETED", "DELIVERED", "PENDING", "CANCELED"].map((s) => (
                          <DropdownMenuItem
                            key={s}
                            disabled={updatingStatusId === order.id}
                            onClick={() => handleUpdateStatus(order.id, s)}
                          >
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell>
                    <Badge
                      onClick={() => {
                        if (updatingPaymentId === order.id) return;
                        handleUpdatePayment(order.id, !order.isPaid);
                      }}
                      className={`${order.isPaid ? "bg-[#4CD964]" : "bg-red-500"} ${updatingPaymentId === order.id ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      title="Update Payment"
                    >
                      {updatingPaymentId === order.id ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Updating...
                        </span>
                      ) : order.isPaid ? (
                        "PAID"
                      ) : (
                        "DUE"
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order.id)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-black"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewInvoice(order.id)}
                        title="View Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {sortedOrders.length} of {meta.total} orders
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="border-[#FB923C] text-[#FB923C]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page >= (meta.totalPage || 1)}
                onClick={() => setPage((prev) => prev + 1)}
                className="border-[#FB923C] text-[#FB923C]"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Details Modal */}
        <OrderDetailsModal
          orderId={selectedOrderId || ""}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />

        {/* Invoice Modal */}
        {invoiceData && (
          <OrderInvoice
            order={invoiceOrder}
            visible={isInvoiceVisible}
            onClose={() => {
              setIsInvoiceVisible(false);
              setInvoiceOrderId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderList;