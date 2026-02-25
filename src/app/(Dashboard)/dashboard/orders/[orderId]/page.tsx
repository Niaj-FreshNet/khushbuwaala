"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Receipt, Save, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import {
    useGetOrderByIdQuery,
    useUpdateOrderMutation,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
} from "@/redux/store/api/order/ordersApi";

import OrderInvoice from "../_components/OrderInvoice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Address = {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    district?: string | null;
    thana?: string | null;
};

type OrderStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "COMPLETED" | "CANCELED";
const STATUS_LIST: OrderStatus[] = ["PENDING", "PROCESSING", "DELIVERED", "COMPLETED", "CANCELED"];

const METHOD_OPTIONS = [
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

type MethodValue = (typeof METHOD_OPTIONS)[number]["value"];

type OrderForm = {
    method?: MethodValue | null;

    orderSource?: "WEBSITE" | "SHOWROOM" | "WHOLESALE" | "MANUAL";
    saleType?: "SINGLE" | "BULK" | null;

    shippingCost?: number;
    discountAmount?: number;
    coupon?: string | null;

    additionalNotes?: string | null;

    shipping?: Address;
    billing?: Address;

    salesmanId?: string | null;

    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;

    customerId?: string | null;
};

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const orderId = (params as any)?.orderId as string | undefined;

    const { data, isLoading, isFetching, isError, error, refetch } = useGetOrderByIdQuery(orderId as string, {
        skip: !orderId,
    });

    const order: any = data?.data;

    const [updateOrder, { isLoading: saving }] = useUpdateOrderMutation();
    const [updateStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation();
    const [updatePayment, { isLoading: updatingPayment }] = useUpdatePaymentStatusMutation();

    const [showInvoice, setShowInvoice] = useState(false);

    const [statusValue, setStatusValue] = useState<OrderStatus>("PENDING");
    const [paymentValue, setPaymentValue] = useState<"PAID" | "DUE">("DUE");

    const [qtyByItemId, setQtyByItemId] = useState<Record<string, number>>({});
    const [amountInput, setAmountInput] = useState<number>(0);

    const [form, setForm] = useState<OrderForm | null>(null);
    const [dirty, setDirty] = useState(false);

    const [showAdvanced, setShowAdvanced] = useState(true); // UI only

    const normalizeNumber = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };

    useEffect(() => {
        if (!order) return;

        setForm({
            method: order.method ?? "",
            orderSource: order.orderSource,
            saleType: order.saleType ?? null,

            shippingCost: Number(order.shippingCost ?? 0),
            discountAmount: Number(order.discountAmount ?? 0),
            coupon: order.coupon ?? "",

            additionalNotes: order.additionalNotes ?? "",

            shipping: {
                name: order.shipping?.name ?? "",
                phone: order.shipping?.phone ?? "",
                email: order.shipping?.email ?? "",
                address: order.shipping?.address ?? "",
                district: order.shipping?.district ?? "",
                thana: order.shipping?.thana ?? "",
            },
            billing: {
                name: order.billing?.name ?? "",
                phone: order.billing?.phone ?? "",
                email: order.billing?.email ?? "",
                address: order.billing?.address ?? "",
                district: order.billing?.district ?? "",
                thana: order.billing?.thana ?? "",
            },

            salesmanId: order.salesmanId ?? null,

            name: order.name ?? "",
            phone: order.phone ?? "",
            email: order.email ?? "",
            address: order.address ?? "",

            customerId: order.customerId ?? null,
        });

        setStatusValue(order.status as OrderStatus);
        setPaymentValue(order.isPaid ? "PAID" : "DUE");

        const map: Record<string, number> = {};
        (order.orderItems ?? []).forEach((it: any) => {
            map[it.id] = Number(it.quantity ?? 1);
        });
        setQtyByItemId(map);

        setAmountInput(Number(order.amount ?? 0));
        setDirty(false);
    }, [order?.id]);

    const orderDate = useMemo(() => {
        if (!order) return "N/A";
        const d = order.orderTime || order.createdAt;
        return new Date(d).toLocaleString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }, [order]);

    const computedItemsTotal = useMemo(() => {
        if (!order?.orderItems?.length) return 0;
        return order.orderItems.reduce((sum: number, it: any) => {
            const qty = normalizeNumber(qtyByItemId[it.id] ?? it.quantity ?? 0);
            const price = normalizeNumber(it.price ?? 0);
            return sum + price * qty;
        }, 0);
    }, [order?.orderItems, qtyByItemId]);

    const setField = <K extends keyof OrderForm>(key: K, value: OrderForm[K]) => {
        setForm((prev) => {
            if (!prev) return prev;
            setDirty(true);
            return { ...prev, [key]: value };
        });
    };

    const setAddressField = (type: "shipping" | "billing", key: keyof Address, value: any) => {
        setForm((prev) => {
            if (!prev) return prev;
            setDirty(true);
            return {
                ...prev,
                [type]: {
                    ...(prev[type] ?? {}),
                    [key]: value,
                },
            };
        });
    };

    const handleQtyChange = (itemId: string, next: any) => {
        const safe = Math.max(1, Math.floor(normalizeNumber(next)));
        setQtyByItemId((prev) => ({ ...prev, [itemId]: safe }));
        setDirty(true);
    };

    const handleSaveAll = async () => {
        if (!orderId || !form || !order) return;

        const orderItemsPayload = (order.orderItems ?? []).map((it: any) => ({
            id: it.id,
            quantity: Math.max(1, Math.floor(normalizeNumber(qtyByItemId[it.id] ?? it.quantity ?? 1))),
        }));

        const payload: any = {
            ...form,
            shippingCost: normalizeNumber(form.shippingCost),
            discountAmount: normalizeNumber(form.discountAmount),
            coupon: (form.coupon ?? "").toString().trim() || null,
            method: (form.method ?? "").toString().trim() || null,
            additionalNotes: (form.additionalNotes ?? "").toString().trim() || null,

            amount: normalizeNumber(amountInput),
            orderItems: orderItemsPayload,
        };

        await updateOrder({ id: orderId, ...payload } as any).unwrap();
        setDirty(false);
        refetch();
    };

    // same logic as yours (auto update)
    const onStatusChange = async (val: string) => {
        const next = val as OrderStatus;
        setStatusValue(next);
        if (!orderId) return;

        try {
            await updateStatus({ id: orderId, status: next } as any).unwrap();
            refetch();
        } catch {
            setStatusValue(order.status as OrderStatus);
        }
    };

    const onPaymentChange = async (val: string) => {
        const next = val as "PAID" | "DUE";
        setPaymentValue(next);
        if (!orderId) return;

        try {
            await updatePayment({ id: orderId, isPaid: next === "PAID" } as any).unwrap();
            refetch();
        } catch {
            setPaymentValue(order.isPaid ? "PAID" : "DUE");
        }
    };

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.replace("/dashboard/orders");
        }
    };

    if (!orderId || isLoading || isFetching || !form) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-6 h-6" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button onClick={() => refetch()} className="bg-[#FB923C] hover:bg-[#ff8a29]">
                        Retry
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Failed to load order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!order) return <div className="p-10">Order not found</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <Button onClick={() => setShowInvoice(true)} className="bg-[#FB923C] hover:bg-[#ff8a29]">
                        <Receipt className="w-4 h-4 mr-2" />
                        Invoice
                    </Button>
                </div>

                <Button onClick={handleSaveAll} disabled={!dirty || saving} className="gap-2 cursor-pointer">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            {/* Quick Actions / Most Used */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Edit</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Status */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Order Status</p>
                            <Select value={statusValue} onValueChange={onStatusChange} disabled={updatingStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_LIST.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Payment */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Payment Status</p>
                            <Select value={paymentValue} onValueChange={onPaymentChange} disabled={updatingPayment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PAID">PAID</SelectItem>
                                    <SelectItem value="DUE">DUE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Method */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <Select value={(form.method ?? "") as any} onValueChange={(val) => setField("method", val as any)}>
                                <SelectTrigger className="border-[#FB923C]">
                                    <SelectValue placeholder="Select payment method" />
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
                    </div>


                    {/* Small money fields */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Final Amount */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">Final Amount</p>
                                <button
                                    type="button"
                                    className="text-xs text-[#FB923C] hover:underline"
                                    onClick={() => {
                                        setAmountInput(computedItemsTotal);
                                        setDirty(true);
                                    }}
                                >
                                    Set = Items Total ({computedItemsTotal})
                                </button>
                            </div>

                            <Input
                                type="number"
                                value={String(amountInput)}
                                onChange={(e) => {
                                    setAmountInput(normalizeNumber(e.target.value));
                                    setDirty(true);
                                }}
                            />
                            <p className="text-xs text-gray-500">Items total (qty × price): {computedItemsTotal} BDT</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Shipping Cost</p>
                            <Input
                                type="number"
                                value={String(form.shippingCost ?? 0)}
                                onChange={(e) => setField("shippingCost", normalizeNumber(e.target.value))}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Discount Amount</p>
                            <Input
                                type="number"
                                value={String(form.discountAmount ?? 0)}
                                onChange={(e) => setField("discountAmount", normalizeNumber(e.target.value))}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <p className="text-sm text-gray-500">Coupon</p>
                            <Input value={form.coupon ?? ""} onChange={(e) => setField("coupon", e.target.value)} placeholder="e.g. NEWYEAR10" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Items - quick editing */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {order.orderItems?.map((item: any) => {
                        const qty = qtyByItemId[item.id] ?? item.quantity ?? 1;
                        const price = normalizeNumber(item.price ?? 0);
                        const lineTotal = price * normalizeNumber(qty);

                        return (
                            <div key={item.id} className="flex gap-4 border p-3 rounded-lg">
                                <Image
                                    src={item.product?.primaryImage || "/placeholder.png"}
                                    alt={item.product?.name || "Product"}
                                    width={72}
                                    height={72}
                                    className="rounded object-cover"
                                />

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div>
                                            <p className="font-semibold leading-tight">{item.product?.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {item.size} {item.unit}
                                            </p>
                                            <p className="text-xs text-gray-500">Unit: {price} BDT</p>
                                        </div>

                                        <div className="flex items-end gap-3">
                                            <div className="w-24">
                                                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                                <Input type="number" min={1} value={String(qty)} onChange={(e) => handleQtyChange(item.id, e.target.value)} />
                                            </div>

                                            <div className="min-w-[120px] text-right">
                                                <p className="text-xs text-gray-500">Line Total</p>
                                                <p className="font-semibold">{lineTotal} BDT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Advanced (less-used) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>More Order Details</CardTitle>

                    <Button variant="outline" onClick={() => setShowAdvanced((p) => !p)} className="gap-2">
                        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showAdvanced ? "Hide" : "Show"}
                    </Button>
                </CardHeader>

                {showAdvanced && (
                    <CardContent className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                            <Textarea
                                value={form.additionalNotes ?? ""}
                                onChange={(e) => setField("additionalNotes", e.target.value)}
                                className="min-h-[110px]"
                            />
                        </div>

                        <Separator />

                        {/* Shipping */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Shipping Address</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Name</p>
                                    <Input value={form.shipping?.name ?? ""} onChange={(e) => setAddressField("shipping", "name", e.target.value)} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                                    <Input value={form.shipping?.phone ?? ""} onChange={(e) => setAddressField("shipping", "phone", e.target.value)} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <Input value={form.shipping?.email ?? ""} onChange={(e) => setAddressField("shipping", "email", e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">Address</p>
                                    <Input value={form.shipping?.address ?? ""} onChange={(e) => setAddressField("shipping", "address", e.target.value)} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">District</p>
                                    <Input value={form.shipping?.district ?? ""} onChange={(e) => setAddressField("shipping", "district", e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Thana</p>
                                    <Input value={form.shipping?.thana ?? ""} onChange={(e) => setAddressField("shipping", "thana", e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Billing */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Billing Address</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Name</p>
                                    <Input value={form.billing?.name ?? ""} onChange={(e) => setAddressField("billing", "name", e.target.value)} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                                    <Input value={form.billing?.phone ?? ""} onChange={(e) => setAddressField("billing", "phone", e.target.value)} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <Input value={form.billing?.email ?? ""} onChange={(e) => setAddressField("billing", "email", e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">Address</p>
                                    <Input value={form.billing?.address ?? ""} onChange={(e) => setAddressField("billing", "address", e.target.value)} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">District</p>
                                    <Input value={form.billing?.district ?? ""} onChange={(e) => setAddressField("billing", "district", e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Thana</p>
                                    <Input value={form.billing?.thana ?? ""} onChange={(e) => setAddressField("billing", "thana", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            <OrderInvoice order={order} visible={showInvoice} onClose={() => setShowInvoice(false)} />
        </div>
    );
}