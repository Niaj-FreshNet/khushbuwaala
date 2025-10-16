'use client';

import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
}

interface FormCheckboxGroupProps {
  name: string;
  label: string;
  options: Option[];
  className?: string;
}

export function FormCheckboxGroup({ name, label, options, className }: FormCheckboxGroupProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col gap-1', className)}>
          <FormLabel className="text-sm text-gray-700">{label}</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <div key={option.value} className="flex items-center gap-1">
                  <Checkbox
                    id={`${name}-${option.value}`}
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...(field.value || []), option.value]);
                      } else {
                        field.onChange(
                          (field.value || []).filter((v: string) => v !== option.value)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`${name}-${option.value}`} className="text-sm text-gray-700">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
}
