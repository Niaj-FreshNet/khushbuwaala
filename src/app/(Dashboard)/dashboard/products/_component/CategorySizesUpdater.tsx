'use client';

import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { IProductVariant } from '@/types/product.types';
import { Category } from '@/types/category.types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  categories: Category[];
  setSelectedSizes: (sizes: string[]) => void;
}

interface FormValues {
  categoryId: string;
  variants: IProductVariant[];
}

export default function CategorySizesUpdater({ categories, setSelectedSizes }: Props) {
  const form = useFormContext<FormValues>();

  // Watch categoryId in form
  const selectedCategoryId = useWatch({
    control: form.control,
    name: 'categoryId',
  });

  // Keep previous sizes to prevent unnecessary state updates
  const prevSizesRef = useRef<string[]>([]);

  useEffect(() => {
    if (!selectedCategoryId) {
      // Clear sizes if no category selected
      if (prevSizesRef.current.length > 0) {
        prevSizesRef.current = [];
        setSelectedSizes([]);
      }
      return;
    }

    // Get sizes for the selected category
    const category = categories.find(cat => cat.id === selectedCategoryId);
    const sizes = category?.sizes || [];

    // Only update selectedSizes if it actually changed
    const sizesChanged =
      prevSizesRef.current.length !== sizes.length ||
      !sizes.every(size => prevSizesRef.current.includes(size));

    if (!sizesChanged) return; // nothing to do

    prevSizesRef.current = sizes; // update ref
    setSelectedSizes(sizes);

    // Sync form variants with selected sizes
    const variants = form.getValues('variants') || [];

    const updatedVariants = sizes.map(sizeStr => {
      const sizeNum = Number(sizeStr);
      // Keep existing variant if it exists
      return variants.find(v => v.size === sizeNum) || {
        id: uuidv4(),
        size: sizeNum,
        price: 0,
        stock: 0,
        sku: '',
        unit: 'ML',
      };
    });

    // Only update form if variants actually changed
    const variantsChanged =
      variants.length !== updatedVariants.length ||
      variants.some((v, i) => v?.size !== updatedVariants[i]?.size);

    if (variantsChanged) {
      form.setValue('variants', updatedVariants);
    }
  }, [selectedCategoryId, categories, form, setSelectedSizes]);

  return null;
}
