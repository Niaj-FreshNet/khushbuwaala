'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllCategoriesAdminQuery } from '@/redux/store/api/category/categoryApi';
import { useGetAllMaterialsQuery } from '@/redux/store/api/material/materialApi';
import { useGetAllFragrancesQuery } from '@/redux/store/api/fragrance/fragranceApi';
import { useCreateProductMutation } from '@/redux/store/api/product/productApi';
import { toast } from 'sonner';
import { Category } from '@/types/category.types';
import { Material } from '@/types/material.types';
import { Fragrance } from '@/types/fragrance.types';
import { Button } from '@/components/ui/button';
import FormWrapper from '@/components/ReusableUI/FormWrapper';
import FormInput from '@/components/ReusableUI/FormInput';
import { useFormContext } from 'react-hook-form';
import { FormCheckboxGroup } from '@/components/ReusableUI/FormCheckboxGroup';
import CategorySizesUpdater from '../_component/CategorySizesUpdater';
import SizesCheckboxes from '../_component/SizesCheckboxes';
import { VariantsSection } from '../_component/VariantsSection';
import AddVariantButton from '../_component/AddVariantButton';
import { PublishedSwitch } from '../_component/PublishedSwitch';
import { IProductVariant } from '@/types/product.types';

interface FormValues {
  name: string;
  description: string;
  brand: string;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  perfumeNotes: { top: string; middle: string; base: string };
  accords: string;
  tags: string;
  categoryId: string;
  materialIds: string[];
  fragranceIds: string[];
  published: boolean;
  variants: IProductVariant[];
  images: File[];
  origin?: string;
  performance?: 'POOR' | 'WEAK' | 'MODERATE' | 'GOOD' | 'EXCELLENT' | 'BEAST_MODE';
  longevity?: 'VERY_WEAK' | 'WEAK' | 'MODERATE' | 'LONG_LASTING' | 'ETERNAL';
  projection?: 'INTIMATE' | 'CLOSE' | 'MODERATE' | 'STRONG' | 'NUCLEAR';
  sillage?: 'SOFT' | 'MODERATE' | 'HEAVY' | 'ENORMOUS';
  bestFor?: string;
  videoUrl?: string;
  stock: number;
  supplier: string;
}

const AddProductPage = () => {
  const router = useRouter();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [createProduct] = useCreateProductMutation();
  const { data: categoriesData } = useGetAllCategoriesAdminQuery();
  const { data: materialsData } = useGetAllMaterialsQuery({});
  const { data: fragrancesData } = useGetAllFragrancesQuery({});

  const categories: Category[] = categoriesData?.data?.data || [];
  const materials: Material[] = materialsData?.data?.data || [];
  const fragrances: Fragrance[] = fragrancesData?.data?.data || [];

  const defaultValues: FormValues = {
    name: 'ABC',
    description: 'ABCABCABCABCABCABCABCABC',
    brand: 'ABC',
    gender: 'UNISEX',
    perfumeNotes: { top: 'ABC', middle: 'ABC', base: '' },
    accords: 'ABC',
    tags: 'ABC',
    categoryId: '',
    materialIds: [],
    fragranceIds: [],
    published: true,
    variants: [{ size: 3, price: 10, stock: 10, sku: 'ABC', unit: 'ML' }],
    images: [],
    origin: 'ABC',
    performance: 'MODERATE',
    longevity: 'MODERATE',
    projection: 'MODERATE',
    sillage: 'MODERATE',
    bestFor: 'ABC',
    videoUrl: 'http://localhost:3000/dashboard/products/add',
    stock: 0,
    supplier: 'ABC',
  };

  const handleSubmit = async (values: FormValues) => {
    if (values.images.length === 0) {
      toast.error('Please upload at least one image.');
      return;
    }
    if (values.variants.length === 0) {
      toast.error('Please add at least one variant.');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('brand', values.brand);
      formData.append('gender', values.gender);
      formData.append('origin', values.origin || '');
      formData.append(
        'perfumeNotes',
        JSON.stringify({
          top: values.perfumeNotes.top.split(',').map(n => n.trim()).filter(Boolean),
          middle: values.perfumeNotes.middle.split(',').map(n => n.trim()).filter(Boolean),
          base: values.perfumeNotes.base.split(',').map(n => n.trim()).filter(Boolean),
        })
      );
      formData.append(
        'accords',
        JSON.stringify(values.accords.split(',').map(a => a.trim()).filter(Boolean))
      );
      formData.append(
        'tags',
        JSON.stringify(values.tags.split(',').map(t => t.trim()).filter(Boolean))
      );
      formData.append('categoryId', values.categoryId);
      formData.append('materialIds', JSON.stringify(values.materialIds));
      formData.append('fragranceIds', JSON.stringify(values.fragranceIds));
      formData.append('published', values.published.toString());
      formData.append('performance', values.performance || '');
      formData.append('longevity', values.longevity || '');
      formData.append('projection', values.projection || '');
      formData.append('sillage', values.sillage || '');
      formData.append(
        'bestFor',
        JSON.stringify(values.bestFor?.split(',').map(b => b.trim()).filter(Boolean))
      );
      formData.append('supplier', values.supplier || '');
      formData.append('stock', values.stock.toString());

      formData.append(
        'variants',
        JSON.stringify(
          values.variants.map(v => ({
            ...v,
            size: Number(v.size),
            price: Number(v.price),
            stock: Number(v.stock),
            unit: v.unit.toUpperCase(),
          }))
        )
      );

      if (values.videoUrl) formData.append('videoUrl', values.videoUrl);
      values.images.forEach(file => formData.append('images', file));

      console.log(formData)

      await createProduct(formData).unwrap();
      toast.success('Product added successfully!');
      router.push('/dashboard/products');
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <FormWrapper
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitButtonText="Add Product"
            submitButtonClassName="bg-[#FB923C] hover:bg-[#ff8a29]"
            resetButtonText="Cancel"
            resetButtonClassName="border-[#FB923C] text-[#FB923C]"
            resetOnSuccess={true}
          >
            {/* Category Sizes */}
            <CategorySizesUpdater categories={categories} setSelectedSizes={setSelectedSizes} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="name" label="Name" placeholder="Product Name" inputClassName="border-[#FB923C]" />
              <FormInput
                name="categoryId"
                label="Category"
                type="select"
                options={categories.map(cat => ({ value: cat.id, label: cat.categoryName }))}
                inputClassName="border-[#FB923C]"
              />
              <FormCheckboxGroup
                name="fragranceIds"
                label="Fragrance-family"
                options={fragrances.map(f => ({ label: f.fragranceName, value: f.id }))}
              />
              <FormCheckboxGroup
                name="materialIds"
                label="Materials"
                options={materials.map(m => ({ label: m.materialName, value: m.id }))}
              />
              <FormInput name="brand" label="Brand" placeholder="Brand" inputClassName="border-[#FB923C]" />
              <FormInput name="origin" label="Origin" placeholder="e.g. France, Middle East" inputClassName="border-[#FB923C]" />
              <FormInput
                name="gender"
                label="Gender"
                type="select"
                options={[
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'UNISEX', label: 'Unisex' },
                ]}
                inputClassName="border-[#FB923C]"
              />
              <FormInput
                name="performance"
                label="Performance"
                type="select"
                options={[
                  { value: 'POOR', label: 'Poor' },
                  { value: 'WEAK', label: 'Weak' },
                  { value: 'MODERATE', label: 'Moderate' },
                  { value: 'GOOD', label: 'Good' },
                  { value: 'EXCELLENT', label: 'Excellent' },
                  { value: 'BEAST_MODE', label: 'Beast Mode' },
                ]}
                inputClassName="border-[#FB923C]"
              />
              <FormInput
                name="longevity"
                label="Longevity"
                type="select"
                options={[
                  { value: 'VERY_WEAK', label: 'Very Weak' },
                  { value: 'WEAK', label: 'Weak' },
                  { value: 'MODERATE', label: 'Moderate' },
                  { value: 'LONG_LASTING', label: 'Long Lasting' },
                  { value: 'ETERNAL', label: 'Eternal' },
                ]}
                inputClassName="border-[#FB923C]"
              />
              <FormInput
                name="projection"
                label="Projection"
                type="select"
                options={[
                  { value: 'INTIMATE', label: 'Intimate' },
                  { value: 'CLOSE', label: 'Close' },
                  { value: 'MODERATE', label: 'Moderate' },
                  { value: 'STRONG', label: 'Strong' },
                  { value: 'NUCLEAR', label: 'Nuclear' },
                ]}
                inputClassName="border-[#FB923C]"
              />
              <FormInput
                name="sillage"
                label="Sillage"
                type="select"
                options={[
                  { value: 'SOFT', label: 'Soft' },
                  { value: 'MODERATE', label: 'Moderate' },
                  { value: 'HEAVY', label: 'Heavy' },
                  { value: 'ENORMOUS', label: 'Enormous' },
                ]}
                inputClassName="border-[#FB923C]"
              />
              <FormInput name="bestFor" label="Best For" placeholder="e.g. Office, Party" inputClassName="border-[#FB923C]" />
              <FormInput name="videoUrl" label="Video URL" placeholder="Optional video link" inputClassName="border-[#FB923C]" />
              <FormInput name="stock" label="Stock" placeholder="Stock Quantity" type="number" inputClassName="border-[#FB923C]" />
              <FormInput name="supplier" label="Supplier" placeholder="Product Supplier" inputClassName="border-[#FB923C]" />
            </div>

            {/* Perfume Notes */}
            <Card className="border-[#FB923C]">
              <CardHeader>
                <CardTitle>Perfume Notes</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput name="perfumeNotes.top" label="Top Notes" placeholder="e.g. bergamot, lemon" inputClassName="border-[#FB923C]" />
                <FormInput name="perfumeNotes.middle" label="Middle Notes" placeholder="e.g. jasmine, rose" inputClassName="border-[#FB923C]" />
                <FormInput name="perfumeNotes.base" label="Base Notes" placeholder="e.g. sandalwood, musk" inputClassName="border-[#FB923C]" />
              </CardContent>
            </Card>

            <FormInput name="description" label="Description" type="textarea" placeholder="Product Description" inputClassName="border-[#FB923C]" />

            {/* Images */}
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
                    setImagePreviews(files.map(file => URL.createObjectURL(file)));
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img src={preview} alt={`preview-${index}`} className="w-full h-full object-cover border border-[#FB923C] rounded" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2"
                        onClick={() => {
                          const form = useFormContext<FormValues>();
                          const images = form.getValues('images');
                          images.splice(index, 1);
                          form.setValue('images', images);
                          setImagePreviews(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card className="border-[#FB923C]">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Variants</CardTitle>
                <SizesCheckboxes selectedSizes={selectedSizes} />
              </CardHeader>
              <CardContent>
                <VariantsSection selectedSizes={selectedSizes} />
                <div className="flex flex-wrap gap-2">
                  <AddVariantButton selectedSizes={selectedSizes} />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="tags" label="Tags" placeholder="e.g. floral, luxury, unisex" inputClassName="border-[#FB923C]" />
              <PublishedSwitch />
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;
