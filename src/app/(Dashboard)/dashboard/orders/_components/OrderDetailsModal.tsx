'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useGetOrderByIdQuery } from '@/redux/store/api/order/ordersApi';

interface OrderDetailsModalProps {
  orderId: string;
  visible: boolean;
  onClose: () => void;
}

interface Order {
  id: string;
  orderTime: string;
  status: string;
  customer: { name: string };
  email: string;
  phone: string;
  address: string;
  zipcode?: string;
  note?: string;
  method: string;
  isPaid: boolean;
  amount: number;
  cartItems: Array<{
    productName: string;
    productImageUrls: string[];
    size: string;
    color: string;
    price: number;
    quantity: number;
  }>;
}

const OrderDetailsModal = ({ orderId, visible, onClose }: OrderDetailsModalProps) => {
  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const order: Order = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-[#FB923C]">Order Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8">Loading order details...</div>
        ) : (
          <div className="space-y-6">
            <Card className="border-[#FB923C]">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Order ID</p>
                    <p>{order?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Order Time</p>
                    <p>{order?.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <Badge className={getStatusColor(order?.status)}>{order?.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#FB923C]">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p>{order?.customer?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p>{order?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p>{order?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p>{order?.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Zip Code</p>
                    <p>{order?.zipcode || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Note</p>
                    <p>{order?.note || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#FB923C]">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Method</p>
                    <p>{order?.method}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Status</p>
                    <Badge className={order?.isPaid ? 'bg-[#4CD964]' : 'bg-red-500'}>
                      {order?.isPaid ? 'PAID' : 'UNPAID'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Amount</p>
                    <p className="font-semibold">{order?.amount} BDT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#FB923C]">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                {order?.cartItems?.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="flex gap-4">
                      <Image
                        src={item.productImageUrls?.[0] || '/placeholder.svg'}
                        alt={item.productName}
                        width={100}
                        height={80}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{item.productName}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <p><span className="text-gray-600">Size:</span> {item.size}</p>
                          <p><span className="text-gray-600">Color:</span> {item.color}</p>
                          <p><span className="text-gray-600">Price:</span> ${item.price}</p>
                          <p><span className="text-gray-600">Quantity:</span> {item.quantity}</p>
                          <p className="col-span-2"><span className="text-gray-600">Subtotal:</span> ${item.price * item.quantity}</p>
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

export default OrderDetailsModal;