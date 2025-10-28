'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useGetSaleByIdQuery } from '@/redux/store/api/sales/salesApi';

interface SaleDetailsModalProps {
    saleId: string;
    visible: boolean;
    onClose: () => void;
}

interface Sale {
    id: string;
    orderTime: string;
    status: string;
    salesman?: { name: string } | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    name?: string | null;
    orderSource: string;
    isPaid: boolean;
    amount: number;
    cartItems: Array<{
        productId: string;
        product?: { name: string; primaryImage?: string };
        variant?: { size?: string; color?: string };
        price: number;
        quantity: number;
    }>;
}

const SaleDetailsModal = ({ saleId, visible, onClose }: SaleDetailsModalProps) => {
    const { data, isLoading } = useGetSaleByIdQuery(saleId);
    const sale: Sale | undefined = data?.data;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-[#4CD964]';
            case 'PENDING':
                return 'bg-orange-500';
            case 'CANCEL':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#FB923C]">Sale Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="text-center py-8">Loading sale details...</div>
                ) : !sale ? (
                    <div className="text-center py-8">No sale details found.</div>
                ) : (
                    <div className="space-y-6">
                        {/* Sale Info */}
                        <Card className="border-[#FB923C]">
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-4">Sale Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Sale ID</p>
                                        <p>{sale.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Sale Time</p>
                                        <p>{sale.orderTime ? new Date(sale.orderTime).toLocaleString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Status</p>
                                        <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Salesman</p>
                                        <p>{sale.salesman?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Info */}
                        <Card className="border-[#FB923C]">
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Name</p>
                                        <p>{sale.name || 'Walk-in Customer'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Email</p>
                                        <p>{sale.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Phone</p>
                                        <p>{sale.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Address</p>
                                        <p>{sale.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card className="border-[#FB923C]">
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Payment Method</p>
                                        <p>{sale.orderSource}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Payment Status</p>
                                        <Badge className={sale.isPaid ? 'bg-[#4CD964]' : 'bg-red-500'}>
                                            {sale.isPaid ? 'PAID' : 'DUE'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Total Amount</p>
                                        <p className="font-semibold">{sale.amount} BDT</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sale Items */}
                        <Card className="border-[#FB923C]">
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-4">Sale Items</h3>
                                {sale.cartItems?.map((item, index) => (
                                    <div key={index} className="border rounded-lg p-4 mb-4">
                                        <div className="flex gap-4">
                                            <Image
                                                src={item.product?.primaryImage || '/placeholder.svg'}
                                                alt={item.product?.name || 'Product'}
                                                width={100}
                                                height={80}
                                                className="rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-lg">{item.product?.name || 'Product Name'}</h4>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <p><span className="text-gray-600">Size:</span> {item.variant?.size || 'N/A'}</p>
                                                    <p><span className="text-gray-600">Color:</span> {item.variant?.color || 'N/A'}</p>
                                                    <p><span className="text-gray-600">Price:</span> {item.price} BDT</p>
                                                    <p><span className="text-gray-600">Quantity:</span> {item.quantity}</p>
                                                    <p className="col-span-2"><span className="text-gray-600">Subtotal:</span> {item.price * item.quantity} BDT</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SaleDetailsModal;
