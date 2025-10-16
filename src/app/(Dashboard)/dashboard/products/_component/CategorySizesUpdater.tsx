'use client';

import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { VariantForForm } from '@/types/product.types';
import { Category } from '@/types/category.types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  categories: Category[];
  setSelectedSizes: (sizes: string[]) => void;
}

interface FormValues {
  categoryId: string;
  variants: VariantForForm[];
}

export default function CategorySizesUpdater({ categories, setSelectedSizes }: Props) {
  const form = useFormContext<FormValues>();
  // console.log(setSelectedSizes)

  // Watch categoryId in form
  const selectedCategoryId = useWatch({
    control: form.control,
    name: 'categoryId',
  });

  // Keep previous sizes to prevent unnecessary state updates
  const prevSizesRef = useRef<string[]>([]);

  useEffect(() => {
    if (!selectedCategoryId) {
      if (prevSizesRef.current.length > 0) {
        prevSizesRef.current = [];
        setSelectedSizes([]);
      }
      return;
    }

    const category = categories.find(cat => cat.id === selectedCategoryId);
    const sizes = category?.sizes || [];

    const sizesChanged =
      prevSizesRef.current.length !== sizes.length ||
      !sizes.every(size => prevSizesRef.current.includes(size));

    if (!sizesChanged) return;

    prevSizesRef.current = sizes;
    setSelectedSizes(sizes);

    const variants = form.getValues('variants') || [];

    const updatedVariantses = sizes.map(size => {
      return (
        variants.find(v => v.size === size) || {
          id: uuidv4(),
          size: size,
          price: undefined,
          stock: undefined,
          sku: undefined,
          unit: undefined,
        }
      );
    });

    const variantsChanged =
      variants.length !== updatedVariantses.length ||
      variants.some((v, i) => v?.size !== updatedVariantses[i]?.size);

    if (variantsChanged) {
      // 🧩 Delay state update until after render to prevent React warning
      queueMicrotask(() => {
        form.setValue('variants', updatedVariantses, { shouldDirty: true });
      });
    }
  }, [selectedCategoryId, categories, setSelectedSizes]); // 🚫 removed `form`

  return null;
}
