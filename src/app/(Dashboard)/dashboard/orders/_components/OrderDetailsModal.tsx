'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Receipt } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useGetOrderByIdQuery } from '@/redux/store/api/order/ordersApi';
import OrderInvoice from './OrderInvoice';
import { LargeNumberLike } from 'crypto';

interface OrderDetailsModalProps {
  orderId: string;
  visible: boolean;
  onClose: () => void;
}

type Nullable<T> = T | null | undefined;

type OrderApi = {
  id: string;
  invoice?: string;
  orderTime?: string; // present in your response
  createdAt?: string;

  amount: number;
  shippingCost?: number;
  additionalNotes?: string;
  discountAmount?: number;
  coupon?: string;

  isPaid: boolean;
  method: string;
  status: string;

  orderSource?: string;
  saleType?: string;

  salesmanId?: Nullable<string>;

  shipping?: Nullable<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    district?: string;
    thana?: Nullable<string>;
  }>;

  billing?: Nullable<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    district?: string;
    thana?: Nullable<string>;
  }>;

  customer?: Nullable<{
    id: string;
    name?: string;
    imageUrl?: Nullable<string>;
  }>;

  orderItems?: Array<{
    id: string;
    productId: string;
    variantId: string;
    size?: number;
    unit?: string;
    quantity: number;
    price: number;
    status?: string;

    product?: Nullable<{
      id: string;
      name?: string;
      primaryImage?: string;
    }>;

    variant?: Nullable<{
      id: string;
      sku?: string;
      unit?: string;
      size?: number;
      price?: number;
    }>;
  }>;
};

const OrderDetailsModal = ({ orderId, visible, onClose }: OrderDetailsModalProps) => {
  const { data, isLoading } = useGetOrderByIdQuery(orderId, { skip: !orderId });
  const order: OrderApi | undefined = data?.data;

  const [showInvoice, setShowInvoice] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-500';
      case 'PROCESSING':
        return 'bg-yellow-500';
      case 'DELIVERED':
        return 'bg-blue-500';
      case 'COMPLETED':
        return 'bg-[#4CD964]';
      case 'CANCELED':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const methodLabel = (method?: string) => {
    if (!method) return 'N/A';
    return method === 'cashOnDelivery'
      ? 'Cash On Delivery'
      : method === 'cash'
      ? 'Cash'
      : method === 'onlinePayment'
      ? 'Online Payment'
      : method === 'bkashPayment'
      ? 'Bkash Payment'
      : method === 'bkashPersonal'
      ? 'Bkash Personal'
      : method === 'nagadPayment'
      ? 'Nagad Payment'
      : method === 'nagadPersonal'
      ? 'Nagad Personal'
      : method === 'rocketPayment'
      ? 'Rocket Payment'
      : method === 'rocketPersonal'
      ? 'Rocket Personal'
      : method === 'bankTransfer'
      ? 'Bank Transfer'
      : method === 'cardPayment'
      ? 'Card Payment'
      : 'Unknown';
  };

  const orderDate = useMemo(() => {
    if (!order) return 'N/A';
    const d = order.orderTime || order.createdAt;
    return d ? new Date(d).toLocaleString() : 'N/A';
  }, [order]);

  const items = order?.orderItems ?? [];

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.price ?? 0) * (it.quantity ?? 0), 0);
  }, [items]);

  const shippingCost = order?.shippingCost ?? 0;
  const total = order?.amount ?? subtotal + shippingCost;

  const shipping = order?.shipping || null;
  const billing = order?.billing || null;

  const discountAmount = order?.discountAmount ?? 0;
  const coupon = order?.coupon ?? null;

  return (
    <>
      <Dialog open={visible} onOpenChange={onClose}>
        <DialogContent className="max-w-8xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#FB923C] flex items-center justify-between">
              <span>Order Details</span>

              {order && (
                <Button
                  onClick={() => setShowInvoice(true)}
                  className="bg-[#FB923C] hover:bg-[#ff8a29]"
                  size="sm"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  View Invoice
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="text-center py-8">Loading order details...</div>
          ) : !order ? (
            <div className="text-center py-8">No order details found.</div>
          ) : (
            <div className="space-y-6">
              {/* Order Info */}
              <Card className="border-[#FB923C]">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Order Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Invoice</p>
                      <p>#{order.invoice ? order.invoice : `ORD-${String(order.id).slice(-6).toUpperCase()}`}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Order Time</p>
                      <p>{orderDate}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Order Source</p>
                      <p>{order.orderSource || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Customer</p>
                      <p>{order.customer?.name || shipping?.name || billing?.name || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Handled By</p>
                      <p>{order.salesmanId ? 'Assigned' : 'N/A'}</p>
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
                      <p className="font-semibold">{methodLabel(order.method)}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Payment Status</p>
                      <Badge className={order.isPaid ? 'bg-[#13db34]' : 'bg-red-500'}>
                        <p className="font-bold">{order.isPaid ? 'PAID' : 'DUE'}</p>
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Subtotal</p>
                      <p className="font-semibold">{subtotal} BDT</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Discount</p>
                      <p className="font-semibold">{discountAmount} BDT ({coupon})</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Shipping Cost</p>
                      <p className="font-semibold">{shippingCost} BDT</p>
                    </div>

                    <div className="">
                      <p className="text-sm font-medium text-gray-700 underline">Total Amount</p>
                      <p className="font-bold">{total} BDT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card className="border-[#FB923C]">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p>{shipping?.name || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p>{shipping?.email || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p>{shipping?.phone || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p>{shipping?.address || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">District</p>
                      <p>{shipping?.district || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Thana</p>
                      <p>{shipping?.thana || 'N/A'}</p>
                    </div>

                    {order.additionalNotes ? (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700">Additional Notes</p>
                        <p>{order.additionalNotes}</p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              {/* Billing Info */}
              <Card className="border-[#FB923C]">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Billing Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p>{billing?.name || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p>{billing?.email || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p>{billing?.phone || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p>{billing?.address || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">District</p>
                      <p>{billing?.district || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Thana</p>
                      <p>{billing?.thana || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border-[#FB923C]">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>

                  {items.length ? (
                    items.map((item, index) => {
                      const imageSrc = item.product?.primaryImage || '/placeholder.svg';
                      const productName = item.product?.name || 'Product';

                      const size = item.variant?.size ?? item.size;
                      const unit = item.variant?.unit ?? item.unit;

                      return (
                        <div key={item.id ?? index} className="border rounded-lg p-4 mb-4">
                          <div className="flex gap-4">
                            <Image
                              src={imageSrc}
                              alt={productName}
                              width={100}
                              height={80}
                              className="rounded object-cover"
                            />

                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{productName}</h4>

                              <div className="grid grid-cols-1 gap-2 mt-2">
                                <p>
                                  <span className="text-gray-600">Variant:</span>{' '}
                                  {size ? `${size} ${unit ?? ''}`.trim() : 'N/A'}
                                </p>

                                <p>
                                  <span className="text-gray-600">SKU:</span>{' '}
                                  {item.variant?.sku || 'N/A'}
                                </p>

                                <p>
                                  <span className="text-gray-600">Price:</span> {item.price} BDT
                                </p>

                                <p>
                                  <span className="text-gray-600">Quantity:</span> {item.quantity}
                                </p>

                                <p className="col-span-2">
                                  <span className="text-gray-600">Line Total:</span>{' '}
                                  {item.price * item.quantity} BDT
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-6">No order items found.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {order && (
        <OrderInvoice
          order={order as any}
          visible={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
};

export default OrderDetailsModal;
