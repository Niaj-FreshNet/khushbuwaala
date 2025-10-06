'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    useGetAllCategoriesQuery,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
    useGetAllCategoriesAdminQuery,
} from '@/redux/store/api/category/categoryApi';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormWrapper from '@/components/ReusableUI/FormWrapper';
import FormInput from '@/components/ReusableUI/FormInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { FormCheckbox } from '@/components/ReusableUI/FormCheckbox';
import { categorySchema } from '@/schemas/category.schema';
import { FormCheckboxGroup } from '@/components/ReusableUI/FormCheckboxGroup';

export default function CategoryList() {
    const { data, isLoading } = useGetAllCategoriesAdminQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const router = useRouter();

    // ✅ Dummy sizes array to render map
    const sizes = [
        { id: '30', size: '30 ML' },
        { id: '50', size: '50 ML' },
        { id: '75', size: '75 ML' },
        { id: '100', size: '100 ML' },
        { id: '150', size: '150 ML' },
    ];

    const allCategories = data?.data?.data || [];
    const meta = data?.data?.meta;

    const [filteredCategories, setFilteredCategories] = useState(allCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (searchTerm) {
            const filtered = allCategories.filter((cat: any) =>
                cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(allCategories);
        }
    }, [searchTerm, allCategories]);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this category?');
        if (confirmed) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted successfully');
            } catch {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setEditModalOpen(true);
        setImagePreview(category.imageUrl || null);
        setImageFile(null);
    };

    const handleUpdate = async (data: z.infer<typeof categorySchema>) => {
        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('categoryName', data.categoryName);
                formData.append('image', imageFile);
                formData.append('published', JSON.stringify(data.published));
                formData.append('sizes', JSON.stringify(data.sizes.map((s) => s.toLowerCase())));
                // formData.append('specification', data.specification);
                if (editingCategory?.imageUrl) {
                    formData.append('existingImageUrl', editingCategory.imageUrl);
                }
                await updateCategory({ id: editingCategory.id, updatedData: formData }).unwrap();
            } else {
                await updateCategory({
                    id: editingCategory.id,
                    updatedData: {
                        categoryName: data.categoryName,
                        published: data.published,
                        sizes: data.sizes,
                        imageUrl: editingCategory.imageUrl,
                    },
                }).unwrap();
            }
            toast.success('Category updated successfully');
            setEditModalOpen(false);
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
            const isValidSize = file.size <= 25 * 1024 * 1024;
            if (!isValidType) {
                toast.error('Only JPG/PNG files are allowed!');
                return;
            }
            if (!isValidSize) {
                toast.error('Image must be smaller than 25MB!');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-orange-400"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
                <Link href="/dashboard/categories/add">
                    <Button className="bg-orange-400 hover:bg-orange-500">
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                </Link>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Sizes</TableHead>
                        <TableHead>Publish</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCategories.map((category: any) => (
                        <TableRow key={category.id}>
                            <TableCell className="capitalize">{category.categoryName.toLowerCase()}</TableCell>
                            <TableCell>
                                <Image
                                    src={category.imageUrl || '/placeholder.svg'}
                                    alt="Category"
                                    width={60}
                                    height={40}
                                    className="rounded object-cover"
                                />
                            </TableCell>
                            <TableCell>{category.sizes?.join(', ')}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={category.published}
                                    onCheckedChange={async (checked) => {
                                        try {
                                            await updateCategory({
                                                id: category.id,
                                                updatedData: { published: checked },
                                            }).unwrap();
                                            toast.success('Status updated successfully');
                                        } catch {
                                            toast.error('Failed to update status');
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" onClick={() => handleEdit(category)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" className="text-red-600" onClick={() => handleDelete(category.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={editModalOpen} onOpenChange={(open) => {
                setEditModalOpen(open);
                if (!open) {
                    setImageFile(null);
                    setImagePreview(null);
                }
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-orange-400">Edit Category</DialogTitle>
                    </DialogHeader>
                    <FormWrapper
                        resolver={zodResolver(categorySchema)}
                        defaultValues={{
                            categoryName: editingCategory?.categoryName || '',
                            sizes: editingCategory?.sizes || [],
                            // specification: editingCategory?.specification,
                            published: editingCategory?.published || false,
                        }}
                        onSubmit={handleUpdate}
                        onReset={() => {
                            // ✅ Close modal & clear previews
                            setEditModalOpen(false);
                            setImageFile(null);
                            setImagePreview(null);
                        }}
                        // successMessage="Category updated successfully!"
                        errorMessage="Failed to update category"
                        submitButtonText="Update Category"
                        resetButtonText='Reset'
                        submitButtonClassName="bg-orange-400 hover:bg-orange-500"
                        resetButtonClassName="border-orange-400 text-orange-400"
                    >
                        <FormInput
                            name="categoryName"
                            label="Category Name"
                            placeholder="e.g., Floral, Woody"
                            required
                            inputClassName="border-orange-400"
                        />
                        <FormCheckboxGroup
                            name="sizes"
                            label="Sizes"
                            // options={['30 ML', '50 ML', '100 ML']}
                            options={sizes.map(f => ({ label: f.size, value: f.id }))}
                        />
                        {/* <FormInput
                            name="specification"
                            label="Specification"
                            type="select"
                            required
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'unisex', label: 'Unisex' },
                            ]}
                            inputClassName="border-orange-400 focus:ring-orange-300"
                        /> */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Category Image <span className="text-red-500">*</span></label>
                            <div className="mt-1 border-2 border-dashed border-orange-400 rounded-md p-4 text-center">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="edit-category-image"
                                />
                                <label htmlFor="edit-category-image" className="cursor-pointer">
                                    <Upload className="mx-auto h-8 w-8 text-orange-400" />
                                    <p className="mt-2 text-sm text-gray-600">Drop file or click to upload</p>
                                    <p className="text-xs text-gray-500">JPG/PNG, Max: 25MB</p>
                                </label>
                            </div>
                            {imagePreview && (
                                <div className="mt-4">
                                    <Image src={imagePreview} alt="Preview" width={80} height={80} className="max-h-20 rounded" />
                                </div>
                            )}
                        </div>
                        <FormCheckbox name="published" label="Published" />
                    </FormWrapper>
                </DialogContent>
            </Dialog>
        </div >
    );
}