'use client';

import { useMemo, useState } from 'react';
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
import {
  Search,
  Printer,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import OrderDetailsModal from './_components/OrderDetailsModal';

import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
} from '@/redux/store/api/order/ordersApi';
import OrderInvoice from './_components/OrderInvoice';

interface Order {
  id: string;
  orderTime: string;
  invoice: string;
  customer: { name: string } | null;
  method: string;
  amount: number;
  status: string;
  isPaid: boolean;
}

type SortField = 'orderTime' | 'amount' | 'status';
type SortOrder = 'asc' | 'desc';

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Details modal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Invoice modal (like sales page)
  const [invoiceOrderId, setInvoiceOrderId] = useState<string | null>(null);
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);

  // Sorting (same as sales page)
  const [sortField, setSortField] = useState<SortField>('orderTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data, isLoading } = useGetAllOrdersQuery({ searchTerm, page, limit });
  const [updateOrder] = useUpdateOrderStatusMutation();

  // Fetch order for invoice modal
  const { data: invoiceData } = useGetOrderByIdQuery(invoiceOrderId || '', {
    skip: !invoiceOrderId,
  });
  const order: Order | undefined = invoiceData?.data;

  const allOrders: Order[] = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;

  const sortedOrders = useMemo(() => {
    const sorted = [...allOrders];

    sorted.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'orderTime') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [allOrders, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1 text-[#FB923C]" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-[#FB923C]" />
    );
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateOrder({ id, status }).unwrap();
      if (res?.success) toast.success(`Order marked as ${status}`);
      else toast.error('Failed to update order');
    } catch (error) {
      toast.error('Error updating order');
      console.error(error);
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleViewInvoice = (orderId: string) => {
    setInvoiceOrderId(orderId);
    setIsInvoiceVisible(true);
  };

  const handlePrint = () => window.print();

  const methodLabel = (method: string) => {
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

  const statusBadgeClass = (status: string) => {
    return status === 'COMPLETED'
      ? 'bg-[#4CD964] text-white'
      : status === 'CANCEL'
        ? 'bg-red-500 text-white'
        : status === 'DELIVERED'
          ? 'bg-blue-500 text-white'
          : status === 'PROCESSING'
            ? 'bg-yellow-500 text-white'
            : 'bg-orange-500 text-white';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header (same as sales page) */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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

        {/* Table */}
        <Table className="border-[#FB923C]">
          <TableHeader>
            <TableRow>
              <TableHead>Sr.</TableHead>
              <TableHead>Invoice</TableHead>

              <TableHead
                onClick={() => toggleSort('orderTime')}
                className="cursor-pointer select-none"
              >
                Order Time {renderSortIcon('orderTime')}
              </TableHead>

              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>

              <TableHead
                onClick={() => toggleSort('amount')}
                className="cursor-pointer select-none"
              >
                Amount {renderSortIcon('amount')}
              </TableHead>

              <TableHead
                onClick={() => toggleSort('status')}
                className="cursor-pointer select-none"
              >
                Status {renderSortIcon('status')}
              </TableHead>

              <TableHead>Payment Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={9}>
                    <Skeleton className="w-full h-6 my-2" />
                  </TableCell>
                </TableRow>
              ))
            ) : sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>#{order.invoice}</TableCell>
                  <TableCell>
                    {order.orderTime
                      ? new Date(order.orderTime).toLocaleString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                  <TableCell>{methodLabel(order.method)}</TableCell>
                  <TableCell>{order.amount} BDT</TableCell>

                  <TableCell>
                    <Badge className={statusBadgeClass(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={order.isPaid ? 'bg-[#4CD964]' : 'bg-red-500'}
                    >
                      {order.isPaid ? 'PAID' : 'DUE'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200"
                            variant="ghost"
                            size="icon"
                            title="Update Status"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                          >
                            Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          >
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                          >
                            Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(order.id, 'PENDING')}
                          >
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(order.id, 'CANCEL')}
                          >
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order.id)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        className="cursor-pointer bg-[#fda055] hover:bg-[#ff9742] text-white"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewInvoice(order.id)}
                        title="View Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {sortedOrders.length} of {meta.total} orders
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

        {/* Details Modal */}
        <OrderDetailsModal
          orderId={selectedOrderId || ''}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />

        {/* Invoice Modal */}
        {invoiceData && (
          <OrderInvoice
            order={order}
            visible={isInvoiceVisible}
            onClose={() => {
              setIsInvoiceVisible(false);
              setInvoiceOrderId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderList;
