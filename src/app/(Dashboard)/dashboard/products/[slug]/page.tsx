'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProductBySlugQuery, useUpdateProductMutation } from '@/redux/store/api/product/productApi';
import { useGetAllCategoriesAdminQuery } from '@/redux/store/api/category/categoryApi';
import { useGetAllMaterialsQuery } from '@/redux/store/api/material/materialApi';
import { useGetAllFragrancesQuery } from '@/redux/store/api/fragrance/fragranceApi';
import { toast } from 'sonner';
import { Category } from '@/types/category.types';
import { Material } from '@/types/material.types';
import { Fragrance } from '@/types/fragrance.types';
import { Button } from '@/components/ui/button';
import FormWrapper from '@/components/ReusableUI/FormWrapper';
import FormInput from '@/components/ReusableUI/FormInput';
import { FormCheckboxGroup } from '@/components/ReusableUI/FormCheckboxGroup';
import CategorySizesUpdater from '../_component/CategorySizesUpdater';
import SizesCheckboxes from '../_component/SizesCheckboxes';
import { VariantsSection } from '../_component/VariantsSection';
import AddVariantButton from '../_component/AddVariantButton';
import { PublishedSwitch } from '../_component/PublishedSwitch';
import { VariantForForm } from '@/types/product.types';
import { useFormContext } from 'react-hook-form';

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
  variants: VariantForForm[];
  primaryImage: File[] | string[];
  otherImages: File[] | string[];
  origin?: string;
  performance?: string;
  longevity?: string;
  projection?: string;
  sillage?: string;
  bestFor?: string;
  videoUrl?: string;
  stock: number;
  supplier: string;
}

const EditProductPage = () => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [updateProduct] = useUpdateProductMutation();

  const { data: productResponse, isLoading } = useGetProductBySlugQuery(slug);
  const product = productResponse?.data;

  const { data: categoriesData } = useGetAllCategoriesAdminQuery();
  const { data: materialsData } = useGetAllMaterialsQuery({});
  const { data: fragrancesData } = useGetAllFragrancesQuery({});

  const categories: Category[] = categoriesData?.data?.data || [];
  const materials: Material[] = materialsData?.data?.data || [];
  const fragrances: Fragrance[] = fragrancesData?.data?.data || [];

  // Convert API product to form default values
  const [defaultValues, setDefaultValues] = useState<FormValues | null>(null);

  useEffect(() => {
    if (product) {
      setImagePreviews([product.primaryImage, ...(product.otherImages || [])]);

      setDefaultValues({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        gender: product.gender || 'UNISEX',
        perfumeNotes: {
          top: (product.perfumeNotes?.top || []).join(', '),
          middle: (product.perfumeNotes?.middle || []).join(', '),
          base: (product.perfumeNotes?.base || []).join(', '),
        },
        accords: (product.accords || []).join(', '),
        tags: (product.tags || []).join(', '),
        categoryId: product.categoryId || '',
        materialIds: product.materialIds || [],
        fragranceIds: product.fragranceIds || [],
        published: product.published,
        variants:
          product.variants?.map(v => ({
            sku: v.sku,
            size: v.size.toString(),
            price: v.price,
            unit: v.unit,
          })) || [{ size: '', price: 0, stock: 0, sku: '', unit: 'ML' }],
        primaryImage: [product.primaryImage],
        otherImages: product.otherImages || [],
        origin: product.origin || '',
        performance: product.performance || 'GOOD',
        longevity: product.longevity || 'MODERATE',
        projection: product.projection || 'MODERATE',
        sillage: product.sillage || 'MODERATE',
        bestFor: (product.bestFor || []).join(', '),
        videoUrl: product.videoUrl || '',
        stock: product.totalStock || 0,
        supplier: product.supplier || '',
      });
    }
  }, [product]);

  // console.log(product?.materialIds)
  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        brand: values.brand,
        gender: values.gender,
        origin: values.origin || '',
        primaryImage: imagePreviews[0] || '',
        otherImages: imagePreviews.slice(1),
        videoUrl: values.videoUrl || '',
        tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
        perfumeNotes: {
          top: values.perfumeNotes.top.split(',').map(n => n.trim()).filter(Boolean),
          middle: values.perfumeNotes.middle.split(',').map(n => n.trim()).filter(Boolean),
          base: values.perfumeNotes.base.split(',').map(n => n.trim()).filter(Boolean),
        },
        accords: values.accords.split(',').map(a => a.trim()).filter(Boolean),
        bestFor: values.bestFor?.split(',').map(b => b.trim()).filter(Boolean),
        categoryId: values.categoryId,
        materialIds: values.materialIds,
        fragranceIds: values.fragranceIds,
        published: values.published,
        performance: values.performance || '',
        longevity: values.longevity || '',
        projection: values.projection || '',
        sillage: values.sillage || '',
        stock: values.stock,
        supplier: values.supplier,
        variants: values.variants.map(v => ({
          sku: v.sku,
          size: Number(v.size),
          unit: v.unit.toUpperCase(),
          price: Number(v.price),
        })),
      };

      await updateProduct({ id: product?.id, formData: payload }).unwrap();
      toast.success('Product updated successfully!');
      // router.push('/dashboard/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product.');
    }
  };

  if (isLoading || !defaultValues) {
    return <div className="p-6 text-center text-gray-500">Loading product details...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <FormWrapper
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitButtonText="Update Product"
            submitButtonClassName="bg-[#FB923C] hover:bg-[#ff8a29]"
            successMessage="Product updated successfully!"
            errorMessage="Failed to update product."
            resetButtonText="Cancel"
            resetButtonClassName="border-[#FB923C] text-[#FB923C]"
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
              <FormInput name="accords" label="Accords" placeholder="e.g. floral, luxury, unisex" inputClassName="border-[#FB923C]" />
              <FormInput name="tags" label="Tags" placeholder="e.g. floral, luxury, unisex" inputClassName="border-[#FB923C]" />
            </div>

            <FormInput name="description" label="Description" type="textarea" placeholder="Product Description" inputClassName="border-[#FB923C]" />

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


            {/* Product Images */}
            <Card className="border-[#FB923C]">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Primary Image */}
                <div>
                  <FormInput
                    name="primaryImage"
                    label="Primary Image"
                    type="file"
                    inputClassName="border-[#FB923C]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreviews((prev) => [previewUrl, ...prev.slice(1)]);
                      }
                    }}
                  />
                  {imagePreviews[0] && (
                    <div className="mt-3 w-24 h-24 border border-[#FB923C] rounded overflow-hidden">
                      <img
                        src={imagePreviews[0]}
                        alt="Primary Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Other Images */}
                <div>
                  <FormInput
                    name="otherImages"
                    label="Other Images"
                    type="file"
                    inputClassName="border-[#FB923C]"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const previews = files.map((file) => URL.createObjectURL(file));
                      setImagePreviews((prev) => [prev[0], ...previews]); // keep primary first
                    }}
                  />

                  {imagePreviews.slice(1).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {imagePreviews.slice(1).map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded border border-[#FB923C] overflow-hidden"
                        >
                          <img
                            src={preview}
                            alt={`Other preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-4 -translate-y-1/2 translate-x-1/2"
                            onClick={() => {
                              const form = useFormContext<FormValues>();
                              const otherImages = form.getValues("otherImages");
                              // adjust the array removing that image
                              otherImages.splice(index + 1, 1);
                              form.setValue("otherImages", otherImages);
                              setImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index + 1)
                              );
                            }}
                          >
                            x
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


            <FormInput name="videoUrl" label="Video URL" placeholder="Optional video link" inputClassName="border-[#FB923C]" />

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput name="stock" label="Stock" placeholder="Stock Quantity" type="number" inputClassName="border-[#FB923C]" />
              <FormInput name="supplier" label="Supplier" placeholder="Product Supplier" inputClassName="border-[#FB923C]" />
              <PublishedSwitch />
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;
