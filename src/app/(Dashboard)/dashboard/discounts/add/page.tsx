'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import {
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
} from '@/redux/store/api/discount/discountApi';
import { Skeleton } from '@/components/ui/skeleton';
import FormInput from '@/components/ReusableUI/FormInput';
import { FormProvider, useForm, useFormContext, SubmitHandler } from 'react-hook-form';
import { useGetAllProductsAdminQuery, useGetProductVariantsQuery } from '@/redux/store/api/product/productApi';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  productId: z.string().min(1, 'Product is required'),
  variantId: z.string().default(''),
  code: z.string().default(''),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().positive('Enter a positive number'),
  maxUsage: z.union([
    z.string().transform(val => val === '' ? undefined : parseInt(val)),
    z.number(),
    z.undefined()
  ]).optional(),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
});

type FormData = z.infer<typeof schema>;

const DiscountFormLogic = () => {
  const { watch, setValue } = useFormContext<FormData>();
  const productId = watch('productId');
  const variantId = watch('variantId');
  const discountType = watch('type');
  const discountValue = watch('value');
  
  const prevProductIdRef = useRef<string>('');

  console.log('🔍 DiscountFormLogic - productId:', productId);
  console.log('🔍 DiscountFormLogic - variantId:', variantId);

  // Only fetch when productId exists and is not empty
  const shouldFetch = Boolean(productId && productId.trim() !== '');
  
  console.log('🔍 shouldFetch:', shouldFetch);
  
  const { data: variantsData, isLoading: isVariantsLoading, error } =
    useGetProductVariantsQuery(productId, {
      skip: !shouldFetch,
    });

  console.log('🔍 variantsData:', variantsData);
  console.log('🔍 isVariantsLoading:', isVariantsLoading);
  console.log('🔍 error:', error);

  // Reset variantId when product changes
  useEffect(() => {
    if (productId && productId !== prevProductIdRef.current && prevProductIdRef.current !== '') {
      setValue('variantId', '', { shouldValidate: false });
    }
    if (productId) {
      prevProductIdRef.current = productId;
    }
  }, [productId, setValue]);

  const selectedVariant = variantsData?.data?.find(
    (v: any) => v.id === variantId
  );
  const originalPrice = selectedVariant?.price ?? 0;

  // Parse discount value safely - it comes as a string from the input
  const parsedValue = typeof discountValue === 'string' 
    ? parseFloat(discountValue) || 0 
    : discountValue || 0;

  let discountAmount = 0;
  let discountedPrice = originalPrice;
  let discountPercent = 0;

  if (parsedValue > 0) {
    if (discountType === 'percentage') {
      discountAmount = (originalPrice * parsedValue) / 100;
      discountedPrice = originalPrice - discountAmount;
      discountPercent = parsedValue;
    } else if (discountType === 'fixed') {
      discountAmount = parsedValue;
      discountedPrice = Math.max(originalPrice - discountAmount, 0);
      discountPercent = originalPrice
        ? (discountAmount / originalPrice) * 100
        : 0;
    }
  }

  // Don't render anything if no product selected
  if (!shouldFetch) {
    return null;
  }

  // Show loading state
  if (isVariantsLoading) {
    return <Skeleton className="h-12 w-full mb-4" />;
  }

  // Show error if any
  if (error) {
    console.error('Error fetching variants:', error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded mb-4 text-red-800">
        Failed to load variants. Please try again.
      </div>
    );
  }

  // Check if variants exist
  const hasVariants = variantsData?.data && Array.isArray(variantsData.data) && variantsData.data.length > 0;

  if (!hasVariants) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-4 text-gray-600">
        No variants available for this product.
      </div>
    );
  }

  return (
    <>
      <FormInput
        name="variantId"
        label="Select Variant (optional)"
        type="select"
        options={variantsData.data.map((v: any) => ({
          value: v.id,
          label: `${v.sku} (${v.size}${v.unit}) - $${v.price}`,
        }))}
        placeholder="Select variant (optional)"
      />

      {selectedVariant && parsedValue > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded mt-4 text-gray-800">
          <p>
            <strong>Original Price:</strong> ${originalPrice.toFixed(2)}
          </p>
          <p>
            <strong>Discount:</strong> ${discountAmount.toFixed(2)} (
            {discountPercent.toFixed(1)}%)
          </p>
          <p>
            <strong>Final Price:</strong> ${discountedPrice.toFixed(2)}
          </p>
        </div>
      )}
    </>
  );
};

export default function DiscountFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [createDiscount, { isLoading: isCreating }] = useCreateDiscountMutation();
  const [updateDiscount, { isLoading: isUpdating }] = useUpdateDiscountMutation();

  const { data: productData, isLoading: isProductsLoading } =
    useGetAllProductsAdminQuery({ page: 1, limit: 100 });

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: '',
      variantId: '',
      code: '',
      type: 'percentage',
      value: 10,
      maxUsage: undefined,
      startDate: '',
      endDate: '',
    },
    mode: 'onChange',
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('🚀 Form submitted with data:', data);
    
    try {
      // Clean up data before submitting
      const submitData = {
        ...data,
        variantId: data.variantId || undefined,
        code: data.code || undefined,
        maxUsage: data.maxUsage || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      };

      console.log('📤 Submitting cleaned data:', submitData);

      if (id) {
        await updateDiscount({ id, data: submitData }).unwrap();
        toast.success('Discount updated successfully');
      } else {
        await createDiscount(submitData).unwrap();
        toast.success('Discount created successfully');
      }
      router.push('/dashboard/discounts');
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      toast.error(error?.data?.message || 'Failed to save discount');
    }
  };

  const isSubmitting = isCreating || isUpdating;
  const watchedProductId = methods.watch('productId');
  console.log('🔍 Main component - watchedProductId:', watchedProductId);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {id ? 'Edit Discount' : 'Create New Discount'}
      </h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Product Select */}
          {isProductsLoading ? (
            <Skeleton className="h-12 w-full mb-4" />
          ) : (
            <FormInput
              name="productId"
              label="Select Product"
              type="select"
              options={
                productData?.data?.map((p: any) => ({
                  value: p.id,
                  label: p.name,
                })) || []
              }
              placeholder="Choose a product"
              required
            />
          )}

          {/* Code */}
          <FormInput
            name="code"
            label="Discount Code (optional)"
            placeholder="SAVE10"
          />

          {methods.watch('code') && methods.watch('code').trim() !== '' ? (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                Promo Code Discount
              </span>
            </div>
          ) : (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
                Auto Discount
              </span>
            </div>
          )}

          {/* Type & Value */}
          <FormInput
            name="type"
            label="Discount Type"
            type="select"
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'fixed', label: 'Fixed Amount' },
            ]}
            required
          />
          <FormInput
            name="value"
            label="Discount Value"
            type="number"
            placeholder="e.g. 10"
            required
          />

          {/* Variant + Preview */}
          {watchedProductId && <DiscountFormLogic key={watchedProductId} />}

          {/* Max Usage */}
          <FormInput
            name="maxUsage"
            label="Maximum Usage (optional)"
            type="number"
            placeholder="e.g. 100"
          />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="startDate" label="Start Date" type="datetime-local" />
            <FormInput name="endDate" label="End Date" type="datetime-local" />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => methods.reset()}
              disabled={isSubmitting}
              className="border-orange-400 text-orange-500 hover:bg-orange-50"
            >
              Reset
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600',
                isSubmitting && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {id ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                id ? 'Update Discount' : 'Create Discount'
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}