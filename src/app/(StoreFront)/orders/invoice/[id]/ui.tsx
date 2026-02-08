"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { useGetOrderByIdQuery } from "@/redux/store/api/order/ordersApi";
import { useApplyDiscountMutation } from "@/redux/store/api/discount/discountApi";
import InvoiceDocument from "@/components/Modules/Orders/InvoiceDocument";

export default function InvoicePageClient({ orderId }: { orderId: string }) {
    const { data, isLoading } = useGetOrderByIdQuery(orderId, { skip: !orderId });
    const order = data?.data;

    const [applyDiscount] = useApplyDiscountMutation();
    const [discountBreakdown, setDiscountBreakdown] = useState<any>(null);

    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const invoiceNo = useMemo(() => {
        if (!order) return "";
        return order?.invoice ? String(order.invoice) : `ORD-${String(order?.id || "").slice(-6).toUpperCase()}`;
    }, [order]);

    // Fetch discount breakdown once order loaded
    useMemo(() => {
        const run = async () => {
            if (!order?.orderItems?.length) return;

            const code = order?.coupon ? String(order.coupon) : undefined;
            const items = order.orderItems.map((it: any) => ({
                productId: it.productId || it.product?.id,
                variantId: it.variantId || it.variant?.id,
                price: Number(it.price ?? it.variant?.price ?? 0),
                qty: Math.max(1, Number(it.quantity || 1)),
            }));

            if (items.some((x: any) => !x.productId || !x.price || x.price <= 0)) return;

            try {
                const res = await applyDiscount({ code, items }).unwrap();
                const root = (res as any)?.data ?? res;
                setDiscountBreakdown(root);
            } catch {
                setDiscountBreakdown(null);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.id]);

    const handlePrint = () => window.print();

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;
        if (isDownloading) return;

        try {
            setIsDownloading(true);

            const html2pdf = (await import("html2pdf.js")).default;

            // clone node to avoid layout issues
            const node = invoiceRef.current.cloneNode(true) as HTMLElement;

            const wrap = document.createElement("div");
            wrap.style.position = "fixed";
            wrap.style.left = "-99999px";
            wrap.style.top = "0";
            wrap.style.width = "794px";
            wrap.style.background = "#fff";
            wrap.appendChild(node);
            document.body.appendChild(wrap);

            await new Promise((r) => setTimeout(r, 150));

            await html2pdf()
                .set({
                    margin: [8, 8, 8, 8],
                    filename: `Invoice-${invoiceNo}.pdf`,
                    image: { type: "jpeg", quality: 0.92 },
                    html2canvas: {
                        scale: 1.2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: "#ffffff",
                        logging: false,
                        windowWidth: 794,
                    },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                    pagebreak: { mode: ["css", "legacy"] },
                })
                .from(node)
                .save();

            document.body.removeChild(wrap);
        } catch (e) {
            console.error("PDF failed:", e);
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) return <div className="p-6">Loading invoice…</div>;
    if (!order) return <div className="p-6">Order not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Actions (hidden in print) */}
            <div className="print:hidden sticky top-0 z-10 bg-white border-b">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <div className="font-semibold">Invoice #{invoiceNo}</div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} variant="outline">
                            <Printer className="w-4 h-4 mr-2" /> Print
                        </Button>
                        <Button onClick={handleDownloadPDF} disabled={isDownloading}>
                            <Download className="w-4 h-4 mr-2" />
                            {isDownloading ? "Downloading…" : "Download PDF"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Document */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                <InvoiceDocument ref={invoiceRef} order={order} discountBreakdown={discountBreakdown} />
            </div>
        </div>
    );
}
