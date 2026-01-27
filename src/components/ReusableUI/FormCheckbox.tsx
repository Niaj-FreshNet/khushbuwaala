'use client';

import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface FormCheckboxProps {
  name: string;
  label: React.ReactNode;
  className?: string;
}

export function FormCheckbox({ name, label, className }: FormCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex items-center', className)}>
          <FormControl>
            <Checkbox
              id={name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel htmlFor={name} className="text-sm text-gray-700">
            {label}
          </FormLabel>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
}
