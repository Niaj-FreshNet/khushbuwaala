'use client';

import { ChangeEvent, useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { LucideAlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface FormInputProps {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'file' | 'checkbox' | 'radio' | 'textarea' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  accept?: string;
  multiple?: boolean;
  value?: string | number;
  disabled?: boolean;
}

export default function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  options,
  className,
  inputClassName,
  labelClassName,
  onChange,
  accept,
  multiple = false,
  value,
  disabled = false,
}: FormInputProps) {
  const id = useId();
  const { control, setValue, formState: { errors } } = useFormContext();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setValue(name, multiple ? files : files.length > 0 ? files[0] : null);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col gap-2', className)}>
          {label && type !== 'checkbox' && type !== 'radio' && (
            <FormLabel className={cn('text-sm font-medium text-gray-700', labelClassName)}>
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}

          <FormControl>
            {type === 'select' ? (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger
                  id={id}
                  className={cn(
                    'w-full border border-gray-300 focus:ring-orange-500 focus:ring-2',
                    errors[name] && 'border-red-500',
                    inputClassName
                  )}
                >
                  <SelectValue placeholder={placeholder || `Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === 'textarea' ? (
              <Textarea
                {...field}
                id={id}
                placeholder={placeholder}
                onChange={onChange || field.onChange}
                className={cn(
                  'resize-none border border-gray-300 focus:ring-2 focus:ring-orange-500',
                  errors[name] && 'border-red-500',
                  inputClassName
                )}
              />
            ) : type === 'file' ? (
              <Input
                id={id}
                type="file"
                accept={accept || 'image/*'}
                multiple={multiple}
                onChange={(e) => {
                  handleFileChange(e);
                  onChange?.(e);
                }}
                className={cn(
                  'cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600',
                  errors[name] ? 'border-red-500' : 'border-gray-300',
                  inputClassName
                )}
              />
            ) : type === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <Label htmlFor={id} className={cn('text-sm text-gray-700', labelClassName)}>
                  {label}
                </Label>
              </div>
            ) : type === 'radio' ? (
              <RadioGroup
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                className="flex gap-4"
              >
                {options?.map(opt => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem id={`${id}-${opt.value}`} value={opt.value} />
                    <Label htmlFor={`${id}-${opt.value}`} className="text-sm text-gray-700">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Input
                {...field}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value ?? field.value}
                disabled={disabled}
                onChange={onChange || field.onChange}
                className={cn(
                  'border border-gray-300 focus:ring-2 focus:ring-orange-500',
                  errors[name] && 'border-red-500',
                  inputClassName
                )}
              />
            )}
          </FormControl>

          <FormMessage className="text-xs text-red-500 flex items-center gap-1">
            {errors[name] && (
              <>
                <LucideAlertCircle className="w-4 h-4" />
                {errors[name]?.message as string}
              </>
            )}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
