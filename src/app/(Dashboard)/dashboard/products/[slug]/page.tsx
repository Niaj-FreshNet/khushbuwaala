'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProductQuery, useUpdateProductMutation } from '@/redux/store/api/product/productApi';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { X } from 'lucide-react';
import { IProductResponse, IProductVariantResponse } from '@/types/product.types';

interface Variant {
  id?: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
  unit: string;
}

interface FormValues {
  name: string;
  description: string;
  brand: string;
  gender: string;
  perfumeNotes: { top: string; middle: string; base: string };
  accords: string;
  tags: string;
  published: boolean;
  variants: Variant[];
  images: File[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useGetProductQuery(id || '');
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imagesToKeep, setImagesToKeep] = useState<string[]>([]);

  const product: IProductResponse = data;

  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  const defaultValues: FormValues = {
    name: product.name,
    description: product.description,
    brand: product.brand || '',
    gender: product.gender || '',
    perfumeNotes: {
      top: product.perfumeNotes?.top?.join(', ') || '',
      middle: product.perfumeNotes?.middle?.join(', ') || '',
      base: product.perfumeNotes?.base?.join(', ') || '',
    },
    accords: product.accords?.join(', ') || '',
    tags: product.tags?.join(', ') || '',
    published: product.published,
    variants: product.variants.map((v: IProductVariantResponse) => ({
      id: v.id,
      size: v.size.toString(),
      color: v.color || '#ffffff',
      price: v.price,
      stock: v.stock || 0,
      sku: v.sku,
      unit: v.unit,
    })),
    images: [],
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setImagePreviews([...(product.primaryImage ? [product.primaryImage] : []), ...(product.otherImages || [])]);
    setImagesToKeep([...(product.primaryImage ? [product.primaryImage] : []), ...(product.otherImages || [])]);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('brand', values.brand);
      formData.append('gender', values.gender);
      formData.append('perfumeNotes', JSON.stringify({
        top: values.perfumeNotes.top.split(',').map(note => note.trim()).filter(note => note),
        middle: values.perfumeNotes.middle.split(',').map(note => note.trim()).filter(note => note),
        base: values.perfumeNotes.base.split(',').map(note => note.trim()).filter(note => note),
      }));
      formData.append('accords', JSON.stringify(values.accords.split(',').map(accord => accord.trim()).filter(accord => accord)));
      formData.append('tags', JSON.stringify(values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)));
      formData.append('published', values.published.toString());
      formData.append('variants', JSON.stringify(values.variants));
      if (imagesToKeep.length > 0) {
        formData.append('imagesToKeep', JSON.stringify(imagesToKeep));
      }
      values.images.forEach((file) => formData.append('images', file));

      await updateProduct({ id: product.id, formData }).unwrap();
      toast.success('Product updated successfully!');
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update product');
    }
  };

  const handleImageToggle = (imageUrl: string, checked: boolean) => {
    setImagesToKeep((prev) => checked ? [...prev, imageUrl] : prev.filter((url) => url !== imageUrl));
  };

  const getPriceRange = () => {
    if (!product.variants?.length) return 'N/A';
    const prices = product.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `$${min}` : `$${min} - $${max}`;
  };

  const getTotalQuantity = () => {
    return product.variants?.reduce((sum, variant) => sum + (variant.stock || 0), 0) || 0;
  };

  return (
    <div className="p-6 bg-gray-50 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#FB923C] mb-6">Product Details</h2>
      <div className="space-y-6">
        <Card className="border-[#FB923C]">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input value={product.name} readOnly className="border-[#FB923C] mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <Input value={getPriceRange()} readOnly className="border-[#FB923C] mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input.TextArea value={product.description} readOnly rows={4} className="border-[#FB923C] mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Product Images</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[...(product.primaryImage ? [product.primaryImage] : []), ...(product.otherImages || [])].map((img, index) => (
                    <Image key={index} src={img} alt={`Product ${index + 1}`} width={80} height={80} className="object-cover border border-[#FB923C] rounded" />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brand</label>
                <Input value={product.brand || 'N/A'} readOnly className="border-[#FB923C] mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <Input value={product.gender || 'N/A'} readOnly className="border-[#FB923C] mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Perfume Notes</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#FB923C] rounded p-4 mt-1">
                  <div>
                    <p className="font-semibold">Top:</p> {product.perfumeNotes?.top?.join(', ') || 'N/A'}
                  </div>
                  <div>
                    <p className="font-semibold">Middle:</p> {product.perfumeNotes?.middle?.join(', ') || 'N/A'}
                  </div>
                  <div>
                    <p className="font-semibold">Base:</p> {product.perfumeNotes?.base?.join(', ') || 'N/A'}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Accords</label>
                <div className="border border-[#FB923C] rounded p-2 mt-1">
                  {product.accords?.map((accord, index) => (
                    <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-2">{accord}</span>
                  )) || 'N/A'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Quantity</label>
                <Input value={getTotalQuantity()} readOnly className="border-[#FB923C] mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="border border-[#FB923C] rounded p-2 mt-1">
                  {product.tags?.map((tag, index) => (
                    <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-2">{tag}</span>
                  )) || 'N/A'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Published</label>
                <Switch checked={product.published} disabled className="data-[state=checked]:bg-[#4CD964] mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Variants</label>
                <div className="border border-[#FB923C] rounded p-4 mt-1">
                  {product.variants.map((variant, index) => (
                    <div key={variant.id} className={`pb-4 ${index < product.variants.length - 1 ? 'border-b border-dashed border-gray-300 mb-4' : ''}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">Size:</p> {variant.size} {variant.unit}
                        </div>
                        <div>
                          <p className="font-semibold">Color:</p> {variant.color}
                        </div>
                        <div>
                          <p className="font-semibold">Price:</p> ${variant.price}
                        </div>
                        <div>
                          <p className="font-semibold">Quantity:</p> {variant.stock || 0}
                        </div>
                        <div>
                          <p className="font-semibold">SKU:</p> {variant.sku}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="border-[#FB923C] text-[#FB923C]" onClick={() => router.push('/dashboard/products')}>
            Back
          </Button>
          <Button className="bg-[#FB923C] hover:bg-[#ff8a29]" onClick={handleEditClick}>
            Edit Product
          </Button>
        </div>
      </div>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#FB923C]">Edit Product</DialogTitle>
          </DialogHeader>
          <FormWrapper
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitButtonText="Update Product"
            submitButtonClassName="bg-[#FB923C] hover:bg-[#ff8a29]"
            resetButtonText="Cancel"
            resetButtonClassName="border-[#FB923C] text-[#FB923C]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="name" label="Name" placeholder="Product Name" required inputClassName="border-[#FB923C]" />
              <FormInput name="brand" label="Brand" placeholder="Brand" required inputClassName="border-[#FB923C]" />
              <FormInput name="gender" label="Gender" type="select" options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'unisex', label: 'Unisex' },
              ]} required inputClassName="border-[#FB923C]" />
              <FormInput name="accords" label="Accords" placeholder="e.g. floral, woody, citrus" required inputClassName="border-[#FB923C]" />
            </div>
            <Card className="border-[#FB923C]">
              <CardHeader>
                <CardTitle>Perfume Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput name="perfumeNotes.top" label="Top Notes" placeholder="e.g. bergamot, lemon" required inputClassName="border-[#FB923C]" />
                  <FormInput name="perfumeNotes.middle" label="Middle Notes" placeholder="e.g. jasmine, rose" required inputClassName="border-[#FB923C]" />
                  <FormInput name="perfumeNotes.base" label="Base Notes" placeholder="e.g. sandalwood, musk" required inputClassName="border-[#FB923C]" />
                </div>
              </CardContent>
            </Card>
            <FormInput name="description" label="Description" type="textarea" placeholder="Product Description" required inputClassName="border-[#FB923C]" />
            <Card className="border-[#FB923C]">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <FormInput
                  name="images"
                  label="Upload Images"
                  type="file"
                  inputClassName="border-[#FB923C]"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    form.setValue('images', files);
                    setImagePreviews([...imagesToKeep, ...files.map((file) => URL.createObjectURL(file))]);
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {imagePreviews.map((preview, index) => {
                    const isExistingImage = index < (product.primaryImage ? 1 : 0) + (product.otherImages?.length || 0);
                    return (
                      <div key={index} className="relative w-20 h-20">
                        <Image src={preview} alt={`preview-${index}`} width={80} height={80} className="object-cover border border-[#FB923C] rounded" />
                        {isExistingImage && (
                          <input
                            type="checkbox"
                            checked={imagesToKeep.includes(preview)}
                            onChange={(e) => handleImageToggle(preview, e.target.checked)}
                            className="absolute top-1 left-1 w-4 h-4"
                          />
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2"
                          onClick={() => {
                            setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                            if (index >= (product.primaryImage ? 1 : 0) + (product.otherImages?.length || 0)) {
                              const images = form.getValues('images');
                              form.setValue('images', images.filter((_, i) => i !== (index - ((product.primaryImage ? 1 : 0) + (product.otherImages?.length || 0)))));
                            } else {
                              handleImageToggle(preview, false);
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#FB923C]">
              <CardHeader>
                <CardTitle>Variants</CardTitle>
              </CardHeader>
              <CardContent>
                {form.watch('variants').map((variant, index) => (
                  <div key={index} className="border border-[#FB923C] rounded-lg p-4 mb-4">
                    <div className="flex justify-end mb-2">
                      <Button variant="destructive" size="icon" onClick={() => {
                        const variants = form.getValues('variants');
                        form.setValue('variants', variants.filter((_, i) => i !== index));
                      }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormInput name={`variants.${index}.size`} label="Size" required inputClassName="border-[#FB923C]" />
                      <FormInput name={`variants.${index}.color`} label="Color" required inputClassName="border-[#FB923C]" />
                      <FormInput name={`variants.${index}.price`} label="Price" type="number" required inputClassName="border-[#FB923C]" />
                      <FormInput name={`variants.${index}.stock`} label="Quantity" type="number" required inputClassName="border-[#FB923C]" />
                      <FormInput name={`variants.${index}.sku`} label="SKU" required inputClassName="border-[#FB923C]" />
                      <FormInput name={`variants.${index}.unit`} label="Unit" initialValue="ml" inputClassName="hidden" />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#FB923C] text-[#FB923C] hover:bg-[#FFF7ED]"
                  onClick={() => form.setValue('variants', [...form.getValues('variants'), { size: '', color: '#ffffff', price: 0, stock: 0, sku: '', unit: 'ml' }])}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Variant
                </Button>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="tags" label="Tags" placeholder="e.g. floral, luxury, unisex" inputClassName="border-[#FB923C]" />
              <div>
                <label className="text-sm font-medium text-gray-700">Published</label>
                <Switch checked={form.watch('published')} onCheckedChange={(checked) => form.setValue('published', checked)} className="data-[state=checked]:bg-[#4CD964] mt-1" />
              </div>
            </div>
          </FormWrapper>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetails;