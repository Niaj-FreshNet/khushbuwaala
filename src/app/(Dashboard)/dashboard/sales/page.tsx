'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  useGetAllSalesQuery,
  useUpdateSalesMutation,
} from '@/redux/store/api/sales/salesApi';
import { Skeleton } from '@/components/ui/skeleton';
import SaleDetailsModal from './_components/SaleDetailsModal';

interface Sale {
  id: string;
  orderTime: string;
  salesman?: { name: string } | null;
  orderSource: string;
  amount: number;
  status: string;
  isPaid: boolean;
  name: string;
}

type SortField = 'orderTime' | 'amount' | 'status';
type SortOrder = 'asc' | 'desc';

const SaleListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<SortField>('orderTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data, isLoading } = useGetAllSalesQuery({ searchTerm, page, limit });
  const [updateSale] = useUpdateSalesMutation();

  const allSales: Sale[] = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;

  // Sorting Logic
  const sortedSales = useMemo(() => {
    const sorted = [...allSales];
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
  }, [allSales, sortField, sortOrder]);

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
      const res = await updateSale({ id, status }).unwrap();
      if (res?.success) {
        toast.success(`Sale marked as ${status}`);
      } else {
        toast.error('Failed to update sale');
      }
    } catch (error) {
      toast.error('Error updating sale');
      console.error(error);
    }
  };

  const handleViewDetails = (saleId: string) => {
    setSelectedSaleId(saleId);
    setIsModalVisible(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search by Customer or Salesman..."
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

        {/* Table Section */}
        <Table className="border-[#FB923C]">
          <TableHeader>
            <TableRow>
              <TableHead>Sale ID</TableHead>
              <TableHead
                onClick={() => toggleSort('orderTime')}
                className="cursor-pointer select-none"
              >
                Sale Time {renderSortIcon('orderTime')}
              </TableHead>
              <TableHead>Salesman</TableHead>
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
                  <TableCell colSpan={8}>
                    <Skeleton className="w-full h-6 my-2" />
                  </TableCell>
                </TableRow>
              ))
            ) : sortedSales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No sales found.
                </TableCell>
              </TableRow>
            ) : (
              sortedSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    {sale.orderTime
                      ? new Date(sale.orderTime).toLocaleString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{sale.salesman?.name || 'N/A'}</TableCell>
                  <TableCell>{sale.orderSource}</TableCell>
                  <TableCell>{sale.amount} BDT</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sale.status === 'COMPLETED'
                          ? 'success'
                          : sale.status === 'CANCEL'
                          ? 'destructive'
                          : 'default'
                      }
                      className={
                        sale.status === 'COMPLETED'
                          ? 'bg-[#4CD964]'
                          : sale.status === 'CANCEL'
                          ? 'bg-red-500'
                          : 'bg-orange-500'
                      }
                    >
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={sale.isPaid ? 'success' : 'destructive'}
                      className={
                        sale.isPaid ? 'bg-[#4CD964]' : 'bg-red-500'
                      }
                    >
                      {sale.isPaid ? 'PAID' : 'DUE'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(sale.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(sale.id, 'COMPLETED')
                            }
                          >
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(sale.id, 'PENDING')
                            }
                          >
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(sale.id, 'CANCEL')
                            }
                          >
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              Showing {sortedSales.length} of {meta.total} sales
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

        {/* Sale Details Modal */}
        <SaleDetailsModal
          saleId={selectedSaleId || ''}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default SaleListPage;
