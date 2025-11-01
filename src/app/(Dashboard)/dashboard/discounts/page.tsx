'use client';

import { useMemo, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import {
  useGetAllDiscountsAdminQuery,
  useDeleteDiscountMutation,
} from '@/redux/store/api/discount/discountApi';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';

export default function DiscountList() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetAllDiscountsAdminQuery();
  const [deleteDiscount] = useDeleteDiscountMutation();

  const discounts = useMemo(() => Array.isArray(data) ? data : (data?.data || []), [data]);

  const filtered = useMemo(() => {
    return discounts.filter((d: any) => {
      const code = d.code?.toLowerCase() || '';
      const productName = d.product?.name?.toLowerCase() || '';
      return code.includes(search.toLowerCase()) || productName.includes(search.toLowerCase());
    });
  }, [discounts, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    try {
      await deleteDiscount(id).unwrap();
      toast.success('Discount deleted successfully.');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete discount.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Discounts & Promotions</h1>
          <Link href="/dashboard/discounts/add">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Discount
            </Button>
          </Link>
        </div>

        <div className="relative mb-4 w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by code or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-orange-400"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-600">No discounts found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell>{d.code || 'AUTO'}</TableCell>
                  <TableCell>{d.product?.name || '-'}</TableCell>
                  <TableCell>{d.variant?.sku || '-'}</TableCell>
                  <TableCell className="capitalize">{d.type}</TableCell>
                  <TableCell>
                    {d.type === 'percentage' ? `${d.value}%` : `$${d.value}`}
                  </TableCell>
                  <TableCell>
                    {d.startDate ? format(new Date(d.startDate), 'PP') : '-'} →{' '}
                    {d.endDate ? format(new Date(d.endDate), 'PP') : '∞'}
                  </TableCell>
                  <TableCell>{d.maxUsage || '∞'}</TableCell>
                  <TableCell className="flex gap-2">
                    <Link href={`/dashboard/discounts/edit/${d.id}`}>
                      <Button size="icon" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(d.id)}>
                      <Trash className="w-4 h-4 text-red-500" />
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
}
