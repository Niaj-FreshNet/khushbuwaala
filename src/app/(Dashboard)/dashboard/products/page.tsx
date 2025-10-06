'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useGetAllProductsAdminQuery, useDeleteProductMutation, useUpdateProductMutation } from '@/redux/store/api/product/productApi';
import { IProductResponse, IProductVariantResponse } from '@/types/product.types';
import { Search, Plus, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from 'next/image';

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllProductsAdminQuery({ search: searchTerm, page: currentPage, limit: pageSize }, { refetchOnMountOrArgChange: true });
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const router = useRouter();

  const allProducts: IProductResponse[] = useMemo(() => data?.data || [], [data]);
  const meta = data?.meta;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId).unwrap();
      toast.success('Product deleted successfully!');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handlePublishedChange = async (checked: boolean, productId: string) => {
    try {
      const formData = new FormData();
      formData.append('published', checked.toString());
      await updateProduct({ id: productId, formData }).unwrap();
      toast.success('Product status updated successfully!');
    } catch {
      toast.error('Failed to update product status');
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search by name, description or tags..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-80 border-[#FB923C] focus:ring-[#FB923C]"
            prefix={<Search className="w-4 h-4 text-gray-500" />}
          />
          <Button className="bg-[#FB923C] hover:bg-[#ff8a29]" onClick={() => router.push('/dashboard/products/add')}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
        <Table className="border-[#FB923C]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="capitalize">{product.name.toLowerCase()}</TableCell>
                <TableCell>
                  <Image src={product.primaryImage} alt={product.name} width={60} height={40} className="object-cover rounded" />
                </TableCell>
                <TableCell>
                  {product.variants.length ? (
                    (() => {
                      const prices = product.variants.map((v) => v.price);
                      const min = Math.min(...prices);
                      const max = Math.max(...prices);
                      return min === max ? `$${min}` : `$${min} - $${max}`;
                    })()
                  ) : 'N/A'}
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="link">{product.variants.length} variants</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      {product.variants.map((variant: IProductVariantResponse, index) => (
                        <div key={index} className="mb-2">
                          <p className="font-semibold">{variant.size} {variant.unit} ({variant.color})</p>
                          <p>Price: ${variant.price}</p>
                          <p>Stock: {variant.stock ?? 0}</p>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>{product.category?.categoryName || 'N/A'}</TableCell>
                <TableCell>
                  <Switch
                    checked={product.published}
                    onCheckedChange={(checked) => handlePublishedChange(checked, product.id)}
                    className="data-[state=checked]:bg-[#4CD964]"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setDeleteId(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {meta && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">Total {meta.total} products</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="border-[#FB923C] text-[#FB923C]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage >= (meta.totalPage || 1)}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="border-[#FB923C] text-[#FB923C]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>You won't be able to revert this!</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProductList;