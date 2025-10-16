'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Search, Printer, Eye, MoreHorizontal } from 'lucide-react';
import OrderDetailsModal from './_components/OrderDetailsModal';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/redux/store/api/order/ordersApi';

interface Order {
  id: string;
  orderTime: string;
  customer: { name: string };
  method: string;
  amount: number;
  status: string;
}

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, isLoading } = useGetAllOrdersQuery({ searchTerm, page, limit });
  const [updateOrder] = useUpdateOrderStatusMutation();

  const allOrders: Order[] = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateOrder({ id, status }).unwrap();
      if (res?.success) {
        toast.success(`Order marked as ${status}`);
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('Error updating order');
      console.error(error);
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search by Customer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-80 border-[#FB923C] focus:ring-[#FB923C]"
            prefix={<Search className="w-4 h-4 text-gray-500" />}
          />
          <Button
            className="bg-[#FB923C] hover:bg-[#ff8a29] text-white"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" /> Print / Download
          </Button>
        </div>
        <Table className="border-[#FB923C]">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.slice(0, 8)}...</TableCell>
                <TableCell>{order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>{order.customer?.name}</TableCell>
                <TableCell>{order.method}</TableCell>
                <TableCell>{order.amount} BDT</TableCell>
                <TableCell>
                  <Badge
                    variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCEL' ? 'destructive' : 'default'}
                    className={order.status === 'DELIVERED' ? 'bg-[#4CD964]' : order.status === 'CANCEL' ? 'bg-red-500' : 'bg-blue-500'}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}>
                          Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CANCEL')}>
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {meta && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">Showing {allOrders.length} of {meta.total} orders</p>
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
        <OrderDetailsModal
          orderId={selectedOrderId || ''}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default OrderList;