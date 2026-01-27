"use client";

import React, { forwardRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface OrderItem {
    id: string;
    product: { name: string; primaryImage: string };
    variant: { size: number; unit: string };
    quantity: number;
    price: number;
}

interface ShippingInfo {
    name: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    thana: string;
}

interface Order {
    id: string;
    invoice: string;
    createdAt: string;
    status: string;
    isPaid: boolean;
    method: string | null;
    amount: number;
    shippingCost: number;
    additionalNotes: string | null;
    shipping: ShippingInfo;
    billing: ShippingInfo;
    orderItems: OrderItem[];
    customer: { id: string; name: string; imageUrl: string | null };
}

interface OrderInvoiceProps {
    order: Order;
    isOpen?: boolean;
    onClose?: () => void;
}

export const OrderInvoice = forwardRef<HTMLDivElement, OrderInvoiceProps>(
    ({ order }, ref) => {
        // 🧮 Calculate totals
        const totals = useMemo(() => {
            const subtotal = order.orderItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            const shipping = order.shippingCost ?? 0;
            const total = subtotal + shipping;
            return { subtotal, shipping, total };
        }, [order]);

        // 🔁 Normalize status text
        const statusLabel =
            order.status === "PENDING"
                ? "Pending"
                : order.status === "PROCESSING"
                    ? "Processing"
                    : order.status === "SHIPPED"
                        ? "Shipped"
                        : order.status === "DELIVERED"
                            ? "Delivered"
                            : "Unknown";

        // 💳 Payment method text
        const paymentMethod =
            order.method === "cashOnDelivery"
                ? "Cash On Delivery"
                : order.method || "Not Selected";

        return (
            <div
                ref={ref}
                className="bg-white shadow-lg rounded-xl p-4 w-full mx-auto text-gray-800 border border-gray-200"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold tracking-wide text-gray-900">
                        Invoice
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Thank you for choosing <b>KhushbuWaala Perfumes</b>
                    </p>
                </div>

                {/* Invoice Info */}
                <div className="flex flex-col sm:flex-row justify-between mb-8 text-gray-700">
                    {/* Left */}
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-semibold">Invoice No</p>
                            <p className="font-light italic text-gray-600">
                                #{order.invoice}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Invoice Date</p>
                            <p className="font-light">
                                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end space-y-2">
                        <div>
                            <p className="text-sm font-semibold">Order Status</p>
                            <p
                                className={`font-bold text-sm ${statusLabel === "Pending"
                                        ? "text-yellow-500"
                                        : statusLabel === "Processing"
                                            ? "text-blue-500"
                                            : statusLabel === "Shipped"
                                                ? "text-purple-500"
                                                : statusLabel === "Delivered"
                                                    ? "text-green-600"
                                                    : "text-gray-500"
                                    }`}
                            >
                                {statusLabel}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Payment Method</p>
                            <p className="font-light text-gray-700">{paymentMethod}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold">
                                Amount{" "}
                                <span
                                    className={`ml-1 font-bold ${order.isPaid ? "text-green-600" : "text-red-500"
                                        }`}
                                >
                                    {order.isPaid ? "Paid" : "Due"}
                                </span>
                            </p>
                            <p className="font-bold text-lg">৳{totals.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="flex flex-col sm:flex-row justify-between mb-10 gap-8">
                    {/* Shipping */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold mb-1">Shipping Address</p>
                        <p className="font-light">{order.shipping.name}</p>
                        <p className="font-light">{order.shipping.address}</p>
                        <p className="font-light">
                            {order.shipping.thana}, {order.shipping.district}
                        </p>
                        <p className="font-light">{order.shipping.phone}</p>
                        {order.shipping.email && (
                            <p className="font-light">{order.shipping.email}</p>
                        )}
                    </div>

                    <Separator orientation="vertical" className="hidden sm:block h-auto" />

                    {/* Billing */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold mb-1">Billing Address</p>
                        <p className="font-light">{order.billing.name}</p>
                        <p className="font-light">{order.billing.address}</p>
                        <p className="font-light">
                            {order.billing.thana}, {order.billing.district}
                        </p>
                        <p className="font-light">{order.billing.phone}</p>
                    </div>

                    {/* From */}
                    <div className="flex-1 text-right">
                        <p className="text-sm font-semibold mb-1">Billed From</p>
                        <p className="font-light">KhushbuWaala Perfumes Ltd.</p>
                        <p className="font-light">
                            E-2, H:13, R:10, Block: D <br /> Banasree, Rampura, Dhaka-1219
                        </p>
                        <p className="font-light">+880 1566-395807</p>
                        <p className="font-light">khushbuwaala@gmail.com</p>
                    </div>
                </div>

                {/* Product Table */}
                <Card className="mb-8 border border-gray-100">
                    <CardContent className="p-0 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="text-center w-12">#</TableHead>
                                    <TableHead>Product Description</TableHead>
                                    <TableHead className="text-center w-24">Qty</TableHead>
                                    <TableHead className="text-right w-32">Unit Price</TableHead>
                                    <TableHead className="text-right w-32">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.orderItems.map((item, index) => (
                                    <TableRow key={item.id} className="text-sm">
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={item.product.primaryImage}
                                                    alt={item.product.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover border"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        Size: {item.variant.size} {item.variant.unit}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ৳{item.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ৳{(item.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                    <div className="w-full sm:w-1/2 space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>৳{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Cost:</span>
                            <span>৳{totals.shipping.toFixed(2)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-lg text-gray-900">
                            <span>Total:</span>
                            <span>৳{totals.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-700 font-semibold text-sm">
                        THANK YOU FOR YOUR PURCHASE!
                    </p>
                    <p className="text-gray-600 text-sm">
                        For questions about this invoice, contact us at{" "}
                        <b>khushbuwaala@gmail.com</b>
                    </p>
                    <p className="text-lg font-semibold mt-4 text-gray-800">
                        Best Wishes from KhushbuWaala 💐
                    </p>
                </div>
            </div>
        );
    }
);

OrderInvoice.displayName = "OrderInvoice";
