"use client";

import React, { forwardRef, useMemo } from "react";

type Props = {
    order: any;
    discountBreakdown?: any;
};

const formatBDT = (n: number) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
        .format(Math.max(0, Math.round(Number(n || 0))))
        .replace(/^/, "৳");

function allocateOrderDiscount(lines: Array<{ lineAfterItemDisc: number }>, orderDiscountAmount: number) {
    const totalBase = lines.reduce((s, x) => s + x.lineAfterItemDisc, 0);
    if (!totalBase || orderDiscountAmount <= 0) return lines.map(() => 0);

    // Proportional allocation, last line takes remainder to keep exact sum
    let used = 0;
    return lines.map((x, idx) => {
        if (idx === lines.length - 1) return Math.max(0, Math.round(orderDiscountAmount - used));
        const share = Math.max(0, Math.round((orderDiscountAmount * x.lineAfterItemDisc) / totalBase));
        used += share;
        return share;
    });
}

const InvoiceDocument = forwardRef<HTMLDivElement, Props>(({ order, discountBreakdown }, ref) => {
    // map of item-level discounted unit (auto discount etc.)
    const itemDiscMap = useMemo(() => {
        const map = new Map<string, number>();
        const items = discountBreakdown?.items ?? [];
        for (const it of items) {
            const key = `${it.productId}__${it.variantId || ""}`;
            map.set(key, Number(it.discountedPrice ?? it.price ?? 0));
        }
        return map;
    }, [discountBreakdown]);

    const orderDiscountAmount = useMemo(() => {
        // Prefer breakdown orderDiscountAmount if present (authoritative),
        // fallback to order.discountAmount if your backend uses that.
        const bd = Number(discountBreakdown?.orderDiscountAmount ?? 0);
        if (bd > 0) return bd;
        return Math.max(0, Number(order?.discountAmount ?? 0));
    }, [discountBreakdown, order]);

    const lines = useMemo(() => {
        const items = order?.orderItems ?? [];
        return items.map((it: any, idx: number) => {
            const qty = Math.max(1, Number(it.quantity || 1));
            const productId = it.productId || it.product?.id || "";
            const variantId = it.variantId || it.variant?.id || "";

            const unitOriginal = Number(it.price ?? it.variant?.price ?? 0);

            // item-level (auto) discounted unit if exists
            const key = `${productId}__${variantId || ""}`;
            const unitAfterItemDisc = itemDiscMap.get(key) ?? unitOriginal;

            const lineOriginal = Math.max(0, Math.round(unitOriginal * qty));
            const lineAfterItemDisc = Math.max(0, Math.round(unitAfterItemDisc * qty));

            const size = it.size ?? it.variant?.size;
            const unit = it.unit ?? it.variant?.unit;
            const sizeLabel = size && unit ? `${size} ${String(unit).toUpperCase()}` : "N/A";

            return {
                id: it.id || `${productId}-${variantId}-${idx}`,
                name: it.product?.name || "Product",
                image: it.product?.primaryImage || "/placeholder.png",
                sizeLabel,
                qty,
                unitOriginal,
                unitAfterItemDisc,
                lineOriginal,
                lineAfterItemDisc,
            };
        });
    }, [order, itemDiscMap]);

    const allocatedOrderDiscounts = useMemo(
        () => allocateOrderDiscount(lines.map((l) => ({ lineAfterItemDisc: l.lineAfterItemDisc })), orderDiscountAmount),
        [lines, orderDiscountAmount]
    );

    const computed = useMemo(() => {
        const withFinal = lines.map((l, idx) => {
            const alloc = allocatedOrderDiscounts[idx] || 0;
            const finalLine = Math.max(0, l.lineAfterItemDisc - alloc);
            const save = Math.max(0, l.lineOriginal - finalLine);
            return { ...l, alloc, finalLine, save, hasDiscount: save > 0 };
        });

        const subtotalOriginal = withFinal.reduce((s, x) => s + x.lineOriginal, 0);
        const subtotalAfterAllDiscount = withFinal.reduce((s, x) => s + x.finalLine, 0);

        const shipping = Math.max(0, Number(order?.shippingCost ?? 0));
        const tax = Math.max(0, Number(order?.estimatedTaxes ?? 0));

        // Always trust server final total
        const totalPayable = Math.max(0, Number(order?.amount ?? subtotalAfterAllDiscount + shipping + tax));

        return { withFinal, subtotalOriginal, subtotalAfterAllDiscount, shipping, tax, totalPayable };
    }, [lines, allocatedOrderDiscounts, order]);

    const invoiceNo = order?.invoice ? String(order.invoice) : `ORD-${String(order?.id || "").slice(-6).toUpperCase()}`;

    const bill = order?.billing || order?.shipping;
    const billName = bill?.name || order?.customer?.name || "Customer";

    return (
        <div ref={ref} className="bg-white border rounded-xl shadow-sm">
            {/* Header */}
            <div className="px-6 py-6 border-b-4 border-[#FB923C]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-3xl font-bold text-[#FB923C]">KHUSHBUWAALA</div>
                        <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                            <div>G/138, Eastern Banabithi Shopping Complex, South Banasree, Khilgaon, Dhaka-1219</div>
                            <div>Phone: +880 1566-395807</div>
                            <div>Email: khushbuwaala@gmail.com</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold">INVOICE</div>
                        <div className="font-semibold mt-1">#{invoiceNo}</div>
                        <div className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta */}
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="text-[#FB923C] font-semibold mb-2">Bill To</div>
                    <div className="text-sm text-gray-800 space-y-1">
                        <div className="font-semibold">{billName}</div>
                        <div className="text-gray-600 break-words">{bill?.address || "N/A"}</div>
                        <div className="text-gray-600">{[bill?.thana, bill?.district].filter(Boolean).join(", ")}</div>
                        <div className="text-gray-600">{bill?.phone || "N/A"}</div>
                        {bill?.email && <div className="text-gray-600 break-words">{bill.email}</div>}
                    </div>
                </div>

                <div className="text-sm text-gray-800 space-y-2">
                    <div><span className="font-semibold">Payment Method:</span> {String(order?.method || "").toLowerCase() === "cashondelivery" ? "Cash On Delivery" : "bKash"}</div>
                    <div><span className="font-semibold">Order Status:</span> {order?.status || "N/A"}</div>
                    {order?.coupon && <div><span className="font-semibold">Coupon:</span> {String(order.coupon).toUpperCase()}</div>}
                </div>
            </div>

            {/* Items */}
            <div className="px-6 pb-6">
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-[#FB923C] text-white">
                                <th className="py-3 px-3 text-left min-w-[260px]">Item</th>
                                <th className="py-3 px-3 text-center min-w-[90px]">Size</th>
                                <th className="py-3 px-3 text-center min-w-[60px]">Qty</th>
                                <th className="py-3 px-3 text-right min-w-[110px]">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {computed.withFinal.map((x, i) => (
                                <tr key={x.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            {/* next/image can break html2canvas; use img for pdf safety */}
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={x.image}
                                                alt={x.name}
                                                width={44}
                                                height={44}
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.png")}
                                                style={{ width: 44, height: 44, objectFit: "cover" }}
                                                className="rounded-md border"
                                            />
                                            <div className="min-w-0">
                                                <div className="font-semibold truncate">{x.name}</div>

                                                {/* ✅ Save badge exactly like checkout */}
                                                {x.hasDiscount && (
                                                    <span className="inline-flex mt-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                                        Save {formatBDT(x.save)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3 px-3 text-center">{x.sizeLabel}</td>
                                    <td className="py-3 px-3 text-center">{x.qty}</td>

                                    <td className="py-3 px-3 text-right">
                                        {/* show discounted total if discounted */}
                                        {x.hasDiscount ? (
                                            <div className="leading-tight">
                                                <div className="font-semibold text-gray-900">{formatBDT(x.finalLine)}</div>
                                                <div className="text-xs text-gray-400 line-through">{formatBDT(x.lineOriginal)}</div>
                                            </div>
                                        ) : (
                                            <span className="font-semibold">{formatBDT(x.finalLine)}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="mt-6 flex justify-end">
                    <div className="w-full sm:w-[420px] space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Subtotal</span>
                            <span className="font-semibold">{formatBDT(computed.subtotalOriginal)}</span>
                        </div>

                        {orderDiscountAmount > 0 && (
                            <div className="flex justify-between text-green-700">
                                <span className="font-medium">
                                    Discount{order?.coupon ? ` (${String(order.coupon).toUpperCase()})` : ""}
                                </span>
                                <span className="font-semibold">-{formatBDT(orderDiscountAmount)}</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Shipping</span>
                            <span className="font-semibold">{formatBDT(computed.shipping)}</span>
                        </div>

                        {computed.tax > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Tax</span>
                                <span className="font-semibold">{formatBDT(computed.tax)}</span>
                            </div>
                        )}

                        <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                            <span>Total Payable</span>
                            <span className="text-[#FB923C]">{formatBDT(computed.totalPayable)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center text-gray-600 text-xs border-t pt-5">
                    <p className="font-semibold text-gray-800">Thank you for your business!</p>
                    <p>For any queries, contact khushbuwaala@gmail.com</p>
                </div>
            </div>
        </div>
    );
});

InvoiceDocument.displayName = "InvoiceDocument";
export default InvoiceDocument;
