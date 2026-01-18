'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { IOrderResponse } from '@/redux/store/api/order/ordersApi';

interface OrderInvoiceProps {
    order: IOrderResponse & {
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
        method?: string;
        saleType?: string;
        salesman?: { name?: string; email?: string } | null;
    };
    visible: boolean;
    onClose: () => void;
}

const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order, visible, onClose }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const invoiceNo = order?.invoice
        ? String(order.invoice)
        : `ORD-${String(order?.id || '').slice(-6).toUpperCase()}`;

    const handlePrint = () => {
        if (!invoiceRef.current) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(invoiceRef.current.innerHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const handleDownloadPDF = () => {
        if (!invoiceRef.current) return;
        html2pdf()
            .set({
                margin: 10,
                filename: `Invoice-${invoiceNo}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    allowTaint: true,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            })
            .from(invoiceRef.current)
            .save();
    };

    const calculateSubtotal = () =>
        (order.orderItems || []).reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);

    const getStatusClass = (status?: string) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 'bg-[#FEF3C7] text-[#92400E]';
            case 'PROCESSING':
                return 'bg-[#DBEAFE] text-[#1E40AF]';
            case 'COMPLETED':
                return 'bg-[#DCFCE7] text-[#166534]';
            case 'DELIVERED':
                return 'bg-[#D0E7FF] text-[#1E3A8A]';
            case 'CANCEL':
                return 'bg-[#FECACA] text-[#991B1B]';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatText = (text?: string) => {
        if (!text) return 'N/A';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    // ✅ Use BILLING first (matches invoice), fallback to shipping/customer
    const bill = order?.billing || order?.shipping;
    const billName = bill?.name || order?.customer?.name || 'Customer';
    const billEmail = bill?.email || '';
    const billPhone = bill?.phone || '';
    const billAddress = bill?.address || '';
    const billDistrict = bill?.district || '';
    const billThana = bill?.thana || '';

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between text-[#FB923C]">
                        <span>Order Invoice</span>
                        <div className="flex gap-2">
                            <Button onClick={handlePrint} className="bg-[#FB923C] hover:bg-[#ff8a29]" size="sm">
                                <Printer className="w-4 h-4 mr-2" /> Print
                            </Button>
                            <Button onClick={handleDownloadPDF} className="bg-[#FB923C] hover:bg-[#ff8a29]" size="sm">
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div
                    ref={invoiceRef}
                    className="invoice-container w-full p-8 bg-white shadow-lg rounded-lg text-black"
                    style={{ color: '#000000', backgroundColor: '#FFFFFF' }}
                >
                    {/* Header */}
                    <div className="header text-center mb-8 border-b-4 border-[#FB923C] pb-4">
                        <div className="company-name text-3xl font-bold text-[#FB923C]">KHUSHBUWAALA</div>
                        <div className="company-details text-sm text-gray-700">
                            <p>G/138, Eastern Banabithi Shopping Complex, South Banasree, Khilgaon, Dhaka-1219</p>
                            <p>Phone: +880 1566-395807</p>
                            <p>Email: khushbuwaala@gmail.com</p>
                        </div>
                    </div>

                    {/* Invoice Info */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="invoice-title text-2xl font-bold text-gray-800">INVOICE</div>
                        <div className="text-right text-gray-700">
                            <p className="font-semibold">#{invoiceNo}</p>
                            <p className="text-sm">
                                Date:{' '}
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Info Section (same 3 columns as SalesInvoice) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Bill To */}
                        <div>
                            <h3 className="text-[#FB923C] font-semibold mb-2">Bill To:</h3>
                            <p className="font-semibold">{billName}</p>
                            {billEmail && <p>{billEmail}</p>}
                            {billPhone && <p>{billPhone}</p>}
                            {billAddress && <p>{billAddress}</p>}
                            {(billThana || billDistrict) && (
                                <p>{[billThana, billDistrict].filter(Boolean).join(', ')}</p>
                            )}
                        </div>

                        {/* Order Details */}
                        <div>
                            <h3 className="text-[#FB923C] font-semibold mb-2">Order Details:</h3>
                            <p>
                                <strong>Sale Type:</strong> {formatText((order as any).saleType)}
                            </p>
                            <p>
                                <strong>Payment Method:</strong> {formatText((order as any).method === 'cashOnDelivery'
                                    ? 'Cash On Delivery'
                                    : (order as any).method === 'cash'
                                        ? 'Cash'
                                        : (order as any).method === 'onlinePayment'
                                            ? 'Online Payment'
                                            : (order as any).method === 'bkashPayment'
                                                ? 'Bkash Payment'
                                                : (order as any).method === 'bkashPersonal'
                                                    ? 'Bkash Personal'
                                                    : (order as any).method === 'nagadPayment'
                                                        ? 'Nagad Payment'
                                                        : (order as any).method === 'nagadPersonal'
                                                            ? 'Nagad Personal'
                                                            : (order as any).method === 'rocketPayment'
                                                                ? 'Rocket Payment'
                                                                : (order as any).method === 'rocketPersonal'
                                                                    ? 'Rocket Personal'
                                                                    : (order as any).method === 'bankTransfer'
                                                                        ? 'Bank Transfer'
                                                                        : (order as any).method === 'cardPayment'
                                                                            ? 'Card Payment'
                                                                            : 'Unknown')}
                            </p>
                            <p>
                                <strong>Payment Status:</strong>{' '}
                                <span
                                    className={`ml-2 px-2 py-1 rounded text-xs font-bold ${order.isPaid ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FECACA] text-[#991B1B]'
                                        }`}
                                >
                                    {order.isPaid ? 'Paid' : 'Due'}
                                </span>
                            </p>
                            <p>
                                <strong>Order Status:</strong>{' '}
                                <span
                                    className={`ml-2 px-2 py-1 rounded text-xs font-bold ${getStatusClass(order.status)}`}
                                >
                                    {formatText(order.status)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-[#FB923C] text-white">
                                    <th className="py-3 px-2 text-left">Item</th>
                                    <th className="py-3 px-2 text-center">Size</th>
                                    <th className="py-3 px-2 text-right">Unit Price</th>
                                    <th className="py-3 px-2 text-center">Qty</th>
                                    <th className="py-3 px-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.orderItems || []).map((item, index) => (
                                    <tr key={item.id || index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                        <td className="py-2 px-2">{item.product?.name || 'Product'}</td>
                                        <td className="py-2 px-2 text-center">
                                            {item.size} {item.unit || ''}
                                        </td>
                                        <td className="py-2 px-2 text-right">{(item.price ?? 0).toFixed(2)} BDT</td>
                                        <td className="py-2 px-2 text-center">{item.quantity}</td>
                                        <td className="py-2 px-2 text-right">
                                            {(((item.price ?? 0) * (item.quantity ?? 0)) as number).toFixed(2)} BDT
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="mt-6 flex flex-col items-end space-y-1">
                        <div className="flex justify-between w-6/12 border-t-2 pt-2 border-gray-300">
                            <span className="font-semibold">Subtotal:</span>
                            <span>{calculateSubtotal().toFixed(2)} BDT</span>
                        </div>

                        <div className="flex justify-between w-6/12 border-[#FB923C] text-lg font-bold text-[#FB923C]">
                            <span className="font-semibold">Received:</span>
                            <span>{order.isPaid ? `${order.amount.toFixed(2)} BDT` : '0.00 BDT'}</span>
                        </div>

                        <div className="flex justify-between w-6/12 border-[#FB923C] text-lg font-bold text-[#FB923C]">
                            <span className="font-semibold">Due:</span>
                            <span>{(calculateSubtotal() - (order.isPaid ? order.amount : 0)).toFixed(2)} BDT</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center text-gray-700 text-xs">
                        <p>Thank you for your business!</p>
                        <p>For any queries, contact khushbuwaala@gmail.com</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderInvoice;
