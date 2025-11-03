'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Search, Printer, Eye, MoreHorizontal, Download } from 'lucide-react';
import OrderDetailsModal from './_components/OrderDetailsModal';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/redux/store/api/order/ordersApi';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  id: string;
  orderTime: string;
  invoice: string;
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

  // ✅ Corrected structure
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
        {/* 🔍 Search and Print */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center w-80 relative">
            <Search className="absolute left-3 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by Customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9 border-[#FB923C] focus:ring-[#FB923C]"
            />
          </div>
          <Button
            className="bg-[#FB923C] hover:bg-[#ff8a29] text-white"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" /> Print / Download
          </Button>
        </div>

        {/* 📋 Table */}
        <Table className="border-[#FB923C]">
          <TableHeader>
            <TableRow>
              <TableHead>Sr.</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Order Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // 🦴 Skeleton rows during loading
              Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: 7 }).map((__, cellIdx) => (
                    <TableCell key={cellIdx}>
                      <Skeleton className="h-5 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : allOrders.length === 0 ? (
              // 🚫 No data message
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              // ✅ Actual data rows
              allOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>#{order.invoice}</TableCell>
                  <TableCell>
                    {order.orderTime
                      ? new Date(order.orderTime).toLocaleString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{order.customer?.name}</TableCell>
                  <TableCell>{order.method}</TableCell>
                  <TableCell>{order.amount} BDT</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'COMPLETED'
                          ? 'success'
                          : order.status === 'CANCEL'
                            ? 'destructive'
                            : order.status === 'DELIVERED'
                              ? 'outline'
                              : order.status === 'PROCESSING'
                                ? 'secondary'
                                : 'default'
                      }
                      className={
                        order.status === 'COMPLETED'
                          ? 'bg-[#4CD964] text-white'
                          : order.status === 'CANCEL'
                            ? 'bg-red-500 text-white'
                            : order.status === 'DELIVERED'
                              ? 'bg-blue-500 text-white'
                              : order.status === 'PROCESSING'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-orange-500 text-white'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={order.isPaid ? 'success' : 'destructive'}
                      className={
                        order.isPaid ? 'bg-[#4CD964]' : 'bg-red-500'
                      }
                    >
                      {order.isPaid ? 'PAID' : 'DUE'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className='cursor-pointer bg-gray-100 hover:bg-gray-200'
                            variant="ghost"
                            size="icon"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order.id, 'PROCESSING')
                            }
                          >
                            Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order.id, 'COMPLETED')
                            }
                          >
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order.id, 'DELIVERED')
                            }
                          >
                            Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order.id, 'PENDING')
                            }
                          >
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order.id, 'CANCEL')
                            }
                          >
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        className='cursor-pointer bg-gray-100 hover:bg-gray-200'
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 📄 Pagination */}
        {meta && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {allOrders.length} of {meta.total} orders
            </p>
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

        {/* 🪟 Order Details Modal */}
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
