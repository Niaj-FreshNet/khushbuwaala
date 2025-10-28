'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { useGetLowStockProductsQuery } from '@/redux/store/api/product/productApi';
import { LowStockProduct } from '@/types/product.types';

const LowStockAlertPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [threshold, setThreshold] = useState(10);
  const router = useRouter();

  const { data, isLoading } = useGetLowStockProductsQuery({ threshold });
  const lowStockProducts: LowStockProduct[] = useMemo(() => data?.data || [], [data]);

  const filteredProducts = lowStockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStock = (productId: string) => {
    router.push(`/dashboard/stock/add?productId=${productId}`);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#FB923C] mb-6">Low Stock Alerts</h1>
        <div className="flex justify-between items-center mb-6 gap-4">
          <Input
            placeholder="Search by Product Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 border-[#FB923C] focus:ring-[#FB923C]"
            prefix={<Search className="w-4 h-4 text-gray-500" />}
          />
          <Input
            type="number"
            placeholder="Stock Threshold"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-40 border-[#FB923C] focus:ring-[#FB923C]"
          />
        </div>
        {isLoading ? (
          <p className="text-gray-500">Loading low stock products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No low stock products found for the current threshold.</p>
        ) : (
          <Table className="border-[#FB923C]">
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className={product.stock <= 0 ? 'bg-red-100 hover:bg-red-200' : 'bg-white hover:bg-gray-100'}
                >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock <= 0 ? 'destructive' : 'default'}
                      className={product.stock <= 0 ? 'bg-[#EF4444]' : 'bg-[#4CD964]'}
                    >
                      {product.stock <= 0 ? 'Critical' : 'Low Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-[#FB923C] hover:bg-[#ff8a29] text-white"
                      onClick={() => handleAddStock(product.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default LowStockAlertPage;