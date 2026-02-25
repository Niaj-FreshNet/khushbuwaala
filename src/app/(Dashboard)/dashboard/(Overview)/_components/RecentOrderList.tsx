// File: components/RecentOrderList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Loader2,
    Download,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
} from "@/redux/store/api/order/ordersApi";
import OrderInvoice from "../../orders/_components/OrderInvoice";

type SortField = "orderTime" | "amount" | "status";
type SortOrder = "asc" | "desc";

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

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "DELIVERED", "COMPLETED", "CANCELED"] as const;

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

const methodLabel = (m: string) => {
    const found = METHOD_OPTIONS.find((x) => x.value === m);
    return found?.label || "Unknown";
};

export default function RecentOrderList() {
    // Search
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 350);

    // Pagination
    const [page, setPage] = useState(1);
    const limit = 10;

    // Local sorting only (no backend sort params)
    const [sortField, setSortField] = useState<SortField>("orderTime");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc"); // ✅ missing in your code

    // ✅ IMPORTANT: do NOT send sort/sortOrder to backend (it breaks PrismaQueryBuilder)
    const queryArgs = useMemo(() => {
        return {
            searchTerm: debouncedSearch?.trim() || undefined,
            page,
            limit,
        } as any;
    }, [debouncedSearch, page, limit]);

    const { data, isLoading, refetch } = useGetAllOrdersQuery(queryArgs);
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    const [invoiceOrderId, setInvoiceOrderId] = useState<string | null>(null);
    const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);

    const { data: invoiceData } = useGetOrderByIdQuery(invoiceOrderId || "", { skip: !invoiceOrderId });
    const invoiceOrder: Order | undefined = invoiceData?.data;

    const ordersRaw = useMemo(() => (data as any)?.data?.data || [], [data]);
    const meta = (data as any)?.data?.meta;

    // ✅ local sort (latest on top)
    const orders = useMemo(() => {
        const list = [...ordersRaw];

        list.sort((a: any, b: any) => {
            let valA: any = a?.[sortField];
            let valB: any = b?.[sortField];

            if (sortField === "orderTime") {
                valA = new Date(valA || 0).getTime();
                valB = new Date(valB || 0).getTime();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return list;
    }, [ordersRaw, sortField, sortOrder]);

    const toggleSort = (field: SortField) => {
        if (field === sortField) setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
        else {
            setSortField(field);
            setSortOrder(field === "orderTime" ? "desc" : "asc");
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
            if (res?.success) {
                toast.success(`Order marked as ${nextStatus}`);
                refetch();
            } else toast.error("Failed to update order");
        } catch (e) {
            toast.error("Error updating order");
            console.error(e);
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleViewInvoice = (orderId: string) => {
        setInvoiceOrderId(orderId);
        setIsInvoiceVisible(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            {/* Top bar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>

                <div className="relative w-full md:w-[360px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search invoice, name, phone, email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="pl-9 border-[#FB923C] focus:ring-[#FB923C]"
                    />
                </div>
            </div>

            {/* Table */}
            <Table className="border-[#FB923C] bg-white">
                <TableHeader>
                    <TableRow>
                        <TableHead>Sr.</TableHead>
                        <TableHead>Order ID</TableHead>

                        <TableHead
                            onClick={() => toggleSort("orderTime")}
                            className="cursor-pointer select-none"
                            title="Sort by time"
                        >
                            Order Time {renderSortIcon("orderTime")}
                        </TableHead>

                        <TableHead>Customer</TableHead>
                        <TableHead>Method</TableHead>

                        <TableHead
                            onClick={() => toggleSort("amount")}
                            className="cursor-pointer select-none"
                            title="Sort by amount"
                        >
                            Amount {renderSortIcon("amount")}
                        </TableHead>

                        <TableHead
                            onClick={() => toggleSort("status")}
                            className="cursor-pointer select-none"
                            title="Sort by status"
                        >
                            Status {renderSortIcon("status")}
                        </TableHead>

                        <TableHead>Invoice</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={8}>
                                    <Skeleton className="w-full h-6 my-2" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order: any, idx: number) => (
                            <TableRow key={order.id}>
                                <TableCell>{(page - 1) * limit + idx + 1}.</TableCell>

                                <TableCell className="font-medium">#{order.invoice}</TableCell>

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

                                <TableCell>{order?.customer?.name || order?.name || "Guest"}</TableCell>

                                <TableCell>{methodLabel(order.method)}</TableCell>

                                <TableCell>{Number(order.amount || 0).toLocaleString()} BDT</TableCell>

                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Badge
                                                className={`${statusBadgeClass(order.status)} ${updatingStatusId === order.id
                                                    ? "opacity-70 cursor-not-allowed"
                                                    : "cursor-pointer"
                                                    }`}
                                                title="Update Status"
                                            >
                                                {updatingStatusId === order.id ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        Updating...
                                                    </span>
                                                ) : (
                                                    order.status || "PENDING"
                                                )}
                                            </Badge>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent>
                                            {STATUS_OPTIONS.map((s) => (
                                                <DropdownMenuItem
                                                    key={s}
                                                    disabled={updatingStatusId === order.id}
                                                    onClick={() => handleUpdateStatus(order.id, s)}
                                                >
                                                    {s}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                                <TableCell>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleViewInvoice(order.id)}
                                        className="inline-flex items-center gap-2 text-[#FB923C] hover:underline"
                                        title="Open Invoice"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">Invoice</span>
                                    </Button>
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
                        Showing {orders.length} of {meta.total} orders
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
    );
}