"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import type { IOrderResponse } from "@/redux/store/api/order/ordersApi";
import { useApplyDiscountMutation } from "@/redux/store/api/discount/discountApi";
import Link from "next/link";

type DiscountBreakdown = {
    discountAmount?: number;
    orderDiscountAmount?: number;
    items?: Array<{
        productId: string;
        variantId?: string | null;
        price?: number; // original per-unit (optional)
        discountedPrice?: number; // ✅ per-unit after discount
    }>;
};

interface OrderInvoiceProps {
    order: (IOrderResponse & {
        invoice?: string | number;
        coupon?: string | null;
        discountAmount?: number | null;
        shippingCost?: number | null;
        estimatedTaxes?: number | null;

        billing?: {
            name?: string | null;
            phone?: string | null;
            email?: string | null;
            address?: string | null;
            district?: string | null;
            thana?: string | null;
        };
        shipping?: {
            name?: string | null;
            phone?: string | null;
            email?: string | null;
            address?: string | null;
            district?: string | null;
            thana?: string | null;
        };

        method?: string | null;
        saleType?: string | null;
        customer?: { name?: string | null } | null;

        orderItems?: Array<{
            id?: string;
            productId?: string;
            variantId?: string;
            size?: number;
            unit?: string;
            quantity?: number;
            price?: number;
            product?: { id?: string; name?: string; primaryImage?: string };
            variant?: { id?: string; size?: number; unit?: string; price?: number };
        }>;
    }) | undefined;

    visible: boolean;
    onClose: () => void;
}

export default function OrderInvoice({ order, visible, onClose }: OrderInvoiceProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);
    //   const [applyDiscount, { isLoading: isDiscountLoading }] = useApplyDiscountMutation();
    const [discountBreakdown, setDiscountBreakdown] = useState<DiscountBreakdown | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const invoiceNo = order?.invoice
        ? String(order.invoice)
        : `ORD-${String(order?.id || "").slice(-6).toUpperCase()}`;

    const formatBDT = (n: number) =>
        new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
            .format(Math.max(0, Math.round(Number(n || 0))))
            .replace(/^/, "৳");

    const formatText = (text?: string | null) => {
        if (!text) return "N/A";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const getStatusClass = (status?: string | null) => {
        if (!status) return "bg-gray-100 text-gray-800";
        switch (String(status).toUpperCase()) {
            case "PENDING":
                return "bg-[#FEF3C7] text-[#92400E]";
            case "PROCESSING":
                return "bg-[#DBEAFE] text-[#1E40AF]";
            case "COMPLETED":
            case "DELIVERED":
                return "bg-[#DCFCE7] text-[#166534]";
            case "CANCEL":
            case "CANCELLED":
                return "bg-[#FECACA] text-[#991B1B]";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const paymentLabel = useMemo(() => {
        const m = String(order?.method || "").toLowerCase();
        if (m === "cashondelivery") return "Cash On Delivery";
        if (m === "bkash") return "bKash";
        if (!m) return "N/A";
        return formatText(m);
    }, [order?.method]);

    // ✅ bill = billing first (invoice), fallback shipping
    const bill = order?.billing || order?.shipping;
    const billName = bill?.name || order?.customer?.name || "Customer";
    const billEmail = bill?.email || "";
    const billPhone = bill?.phone || "";
    const billAddress = bill?.address || "";
    const billDistrict = bill?.district || "";
    const billThana = bill?.thana || "";

    // ✅ Fetch discount breakdown here (so it works from OrderList page)
    //   useEffect(() => {
    //     const run = async () => {
    //       if (!visible) return;
    //       if (!order?.orderItems?.length) return;

    //       const code = order?.coupon ? String(order.coupon) : undefined;

    //       const items = order.orderItems.map((it: any) => ({
    //         productId: it.productId || it.product?.id,
    //         variantId: it.variantId || it.variant?.id,
    //         price: Number(it.price ?? it.variant?.price ?? 0),
    //         qty: Math.max(1, Number(it.quantity || 1)),
    //       }));

    //       // guard
    //       if (items.some((x) => !x.productId || !x.price || x.price <= 0)) {
    //         setDiscountBreakdown(null);
    //         return;
    //       }

    //       try {
    //         const res = await applyDiscount({ code, items }).unwrap();
    //         const root = (res as any)?.data ?? res;
    //         setDiscountBreakdown(root);
    //       } catch {
    //         setDiscountBreakdown(null);
    //       }
    //     };

    //     run();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [visible, order?.id, order?.coupon]);

    // ✅ discounted per-unit map
    const discountedUnitMap = useMemo(() => {
        const map = new Map<string, number>();
        const items = discountBreakdown?.items ?? [];
        for (const it of items) {
            const key = `${it.productId}__${it.variantId || ""}`;
            map.set(key, Number(it.discountedPrice ?? it.price ?? 0));
        }
        return map;
    }, [discountBreakdown]);

    // ✅ Lines (per item) with Save
    const lines = useMemo(() => {
        const items = order?.orderItems ?? [];
        return items.map((it: any, idx: number) => {
            const qty = Math.max(1, Number(it.quantity || 1));
            const productId = it.productId || it.product?.id || "";
            const variantId = it.variantId || it.variant?.id || "";

            const unitOriginal = Number(it.price ?? it.variant?.price ?? 0);
            const key = `${productId}__${variantId || ""}`;
            const unitDisc = discountedUnitMap.get(key) ?? unitOriginal;

            const lineOriginal = Math.max(0, Math.round(unitOriginal * qty));
            const lineDisc = Math.max(0, Math.round(unitDisc * qty));
            const save = Math.max(0, lineOriginal - lineDisc);

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
                unitDisc,
                lineOriginal,
                lineDisc,
                save,
                hasDiscount: save > 0,
            };
        });
    }, [order, discountedUnitMap]);

    // ✅ Totals (server truth)
    const totals = useMemo(() => {
        const subtotalOriginal = lines.reduce((s, x) => s + x.lineOriginal, 0);
        const subtotalDisc = lines.reduce((s, x) => s + x.lineDisc, 0);

        const discountAmount = Math.max(0, Number(order?.discountAmount ?? 0));
        const coupon = order?.coupon ? String(order.coupon).toUpperCase() : null;

        const shipping = Math.max(0, Number(order?.shippingCost ?? 0));
        const tax = Math.max(0, Number(order?.estimatedTaxes ?? 0));

        // ✅ Always trust server
        const totalPayable = Math.max(0, Number(order?.amount ?? (subtotalDisc + shipping + tax)));

        const received = order?.isPaid ? totalPayable : 0;
        const due = Math.max(0, totalPayable - received);

        return { subtotalOriginal, subtotalDisc, discountAmount, coupon, shipping, tax, totalPayable, received, due };
    }, [lines, order]);

    const handlePrint = () => {
        if (!invoiceRef.current) return;

        const content = invoiceRef.current.outerHTML;

        const css = `
      <style>
        * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { margin: 0; padding: 16px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111827; }
        img { max-width: 100%; }
        @page { size: A4; margin: 10mm; }
      </style>
    `;

        const w = window.open("", "_blank", "width=900,height=650");
        if (!w) return;

        w.document.open();
        w.document.write(`
      <html>
        <head>
          <title>Invoice-${invoiceNo}</title>
          ${css}
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
        w.document.close();
    };

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;
        if (isDownloading) return;

        try {
            setIsDownloading(true);

            // ✅ Dynamically import only when needed
            const html2pdf = (await import("html2pdf.js")).default;

            // ✅ CLONE the invoice node to avoid Dialog scroll/transform issues
            const node = invoiceRef.current.cloneNode(true) as HTMLElement;

            // ✅ Put clone into an offscreen container (IMPORTANT)
            const wrap = document.createElement("div");
            wrap.style.position = "fixed";
            wrap.style.left = "-99999px";
            wrap.style.top = "0";
            wrap.style.width = "794px"; // ~A4 width at 96dpi
            wrap.style.background = "#fff";
            wrap.appendChild(node);
            document.body.appendChild(wrap);

            // ✅ Wait a moment so images/layout settle (prevents blank/stuck)
            await new Promise((r) => setTimeout(r, 150));

            const opt = {
                margin: [8, 8, 8, 8],
                filename: `Invoice-${invoiceNo}.pdf`,
                image: { type: "jpeg", quality: 0.92 },

                // ✅ The most important part: reduce memory pressure
                html2canvas: {
                    scale: 1.2,            // ✅ lower scale = less freeze
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                    windowWidth: 794,      // matches wrap width
                },

                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },

                // ✅ Avoid “avoid-all” (can cause infinite layout loops / stuck)
                pagebreak: { mode: ["css", "legacy"] },
            };

            // ✅ Generate then save
            await html2pdf().set(opt).from(node).save();

            // cleanup
            document.body.removeChild(wrap);
        } catch (err) {
            console.error("PDF download failed:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b">
                    <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[#FB923C]">
                        <span className="text-base sm:text-lg font-semibold">Order Invoice</span>

                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href={`/order/invoice/${order.id}`} target="_blank">
                                    Print Invoice
                                </Link>
                            </Button>
                            <Button
                                onClick={handleDownloadPDF}
                                className="bg-[#FB923C] hover:bg-[#ff8a29]"
                                size="sm"
                                disabled={isDownloading}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloading ? "Downloading..." : "Download PDF"}
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6">
                    <div ref={invoiceRef} className="w-full bg-white rounded-xl border border-gray-200 shadow-sm text-gray-900">
                        {/* Header */}
                        <div className="px-5 sm:px-8 pt-6 pb-4 border-b-4 border-[#FB923C]">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div>
                                    <div className="text-2xl sm:text-3xl font-bold text-[#FB923C]">KHUSHBUWAALA</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                                        <p>G/138, Eastern Banabithi Shopping Complex, South Banasree, Khilgaon, Dhaka-1219</p>
                                        <p>Phone: +880 1566-395807</p>
                                        <p>Email: khushbuwaala@gmail.com</p>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right text-sm text-gray-700">
                                    <div className="text-xl font-bold text-gray-900">INVOICE</div>
                                    <p className="font-semibold mt-1">#{invoiceNo}</p>
                                    <p className="text-xs sm:text-sm">
                                        Date:{" "}
                                        {new Date(order.createdAt as any).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info section */}
                        <div className="px-5 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-[#FB923C] font-semibold mb-2">Bill To</h3>
                                <div className="text-sm text-gray-800 space-y-1">
                                    <p className="font-semibold">{billName}</p>
                                    {!!billEmail && <p className="break-words">{billEmail}</p>}
                                    {!!billPhone && <p>{billPhone}</p>}
                                    {!!billAddress && <p className="break-words">{billAddress}</p>}
                                    {(billThana || billDistrict) && <p>{[billThana, billDistrict].filter(Boolean).join(", ")}</p>}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#FB923C] font-semibold mb-2">Order Details</h3>
                                <div className="text-sm text-gray-800 space-y-2">
                                    <p>
                                        <span className="font-semibold">Sale Type:</span> {formatText((order as any).saleType)}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Payment Method:</span> {paymentLabel}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-semibold">Payment:</span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${order.isPaid ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FECACA] text-[#991B1B]"
                                                }`}
                                        >
                                            {order.isPaid ? "Paid" : "Due"}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-semibold">Status:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusClass(order.status as any)}`}>
                                            {formatText(order.status as any)}
                                        </span>
                                    </p>

                                    {totals.coupon && totals.discountAmount > 0 && (
                                        <p>
                                            <span className="font-semibold">Coupon:</span> {totals.coupon}
                                        </p>
                                    )}

                                    {/* <p className="text-xs text-gray-500">
                    {isDiscountLoading ? "Calculating item discounts..." : " "}
                  </p> */}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="px-5 sm:px-8 pb-6">
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-[#FB923C] text-white">
                                            <th className="py-3 px-3 text-left min-w-[220px]">Item</th>
                                            <th className="py-3 px-3 text-center min-w-[90px]">Size</th>
                                            <th className="py-3 px-3 text-right min-w-[90px]">Unit</th>
                                            {/* <th className="py-3 px-3 text-right min-w-[110px]">Unit (Disc)</th> */}
                                            <th className="py-3 px-3 text-center min-w-[60px]">Qty</th>
                                            <th className="py-3 px-3 text-right min-w-[110px]">Total</th>
                                            {/* <th className="py-3 px-3 text-right min-w-[120px]">Total (Disc)</th> */}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {lines.map((x, i) => (
                                            <tr key={x.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-3">
                                                        {/* print/pdf friendly image */}
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={x.image}
                                                            alt={x.name}
                                                            width={44}
                                                            height={44}
                                                            crossOrigin="anonymous"
                                                            referrerPolicy="no-referrer"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                                                            }}
                                                            style={{ width: 44, height: 44, objectFit: "cover" }}
                                                            className="rounded-md border"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900 truncate">{x.name}</p>

                                                            {/* ✅ Save badge like checkout */}
                                                            {x.hasDiscount && (
                                                                <span className="inline-flex mt-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                                                    Save {formatBDT(x.save)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-3 text-center">{x.sizeLabel}</td>

                                                <td className="py-3 px-3 text-right">{formatBDT(x.unitOriginal)}</td>

                                                {/* <td className="py-3 px-3 text-right">
                          {x.hasDiscount ? (
                            <div className="leading-tight">
                              <div className="font-semibold text-green-700">{formatBDT(x.unitDisc)}</div>
                              <div className="text-xs text-gray-400 line-through">{formatBDT(x.unitOriginal)}</div>
                            </div>
                          ) : (
                            formatBDT(x.unitDisc)
                          )}
                        </td> */}

                                                <td className="py-3 px-3 text-center">{x.qty}</td>

                                                <td className="py-3 px-3 text-right">{formatBDT(x.lineOriginal)}</td>

                                                {/* <td className="py-3 px-3 text-right font-semibold">
                          {x.hasDiscount ? (
                            <div className="leading-tight">
                              <div className="text-gray-900">{formatBDT(x.lineDisc)}</div>
                              <div className="text-xs text-gray-400 line-through">{formatBDT(x.lineOriginal)}</div>
                            </div>
                          ) : (
                            formatBDT(x.lineDisc)
                          )}
                        </td> */}
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
                                        <span className="font-semibold">{formatBDT(totals.subtotalOriginal)}</span>
                                    </div>

                                    {totals.discountAmount > 0 && (
                                        <div className="flex justify-between text-green-700">
                                            <span className="font-medium">Discount{totals.coupon ? ` (${totals.coupon})` : ""}</span>
                                            <span className="font-semibold">-{formatBDT(totals.discountAmount)}</span>
                                        </div>
                                    )}

                                    {totals.discountAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Subtotal after discount</span>
                                            <span className="font-semibold">{formatBDT(totals.subtotalDisc)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Shipping</span>
                                        <span className="font-semibold">{formatBDT(totals.shipping)}</span>
                                    </div>

                                    {totals.tax > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Tax</span>
                                            <span className="font-semibold">{formatBDT(totals.tax)}</span>
                                        </div>
                                    )}

                                    <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                                        <span>Total Payable</span>
                                        <span className="text-[#FB923C]">{formatBDT(totals.totalPayable)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Received</span>
                                        <span className="font-semibold">{formatBDT(totals.received)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Due</span>
                                        <span className="font-semibold text-red-600">{formatBDT(totals.due)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-10 text-center text-gray-600 text-xs border-t pt-5">
                                <p className="font-semibold text-gray-800">Thank you for your business!</p>
                                <p>For any queries, contact khushbuwaala@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
