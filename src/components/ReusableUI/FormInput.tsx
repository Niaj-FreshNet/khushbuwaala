'use client';

import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { ChangeEvent, useId } from 'react';
import { LucideAlertCircle } from 'lucide-react';

interface FormInputProps {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'file' | 'checkbox' | 'radio' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select inputs
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; // ✅ added onChange
}

export default function FormInput({
  name,
  label,
  type,
  placeholder,
  required = false,
  options,
  className,
  inputClassName,
  labelClassName,
  onChange,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const id = useId();

  // Handle file input internally
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setValue(name, files); // update RHF form value
    }
  };

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {type !== 'checkbox' && type !== 'radio' && (
        <label
          htmlFor={id}
          className={cn('text-sm font-medium text-gray-700', labelClassName)}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          {...register(name, { required: required ? `${label} is required` : false })}
          id={id}
          className={cn(
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
            errors[name] ? 'border-red-500' : 'border-gray-300',
            inputClassName
          )}
        >
          <option value="" disabled>
            {placeholder || `Select ${label}`}
          </option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'file' ? (
        <input
          type="file"
          id={id}
          accept="image/*"
          onChange={(e) => {
            handleFileChange(e); // internal handling
            onChange?.(e);       // call external onChange if provided
          }}
          className={cn(
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
            errors[name] ? 'border-red-500' : 'border-gray-300',
            inputClassName
          )}
        />
      ) : type === 'checkbox' || type === 'radio' ? (
        <div className="flex items-center gap-2">
          <input
            {...register(name, { required: required ? `${label} is required` : false })}
            id={id}
            type={type}
            className={cn(
              'w-4 h-4 rounded border-gray-300',
              errors[name] ? 'border-red-500' : 'border-gray-300',
              inputClassName
            )}
            onChange={onChange} // pass to external onChange
          />
          <label htmlFor={id} className={cn('text-sm text-gray-600', labelClassName)}>
            {label}
          </label>
        </div>
      ) : (
        <input
          {...register(name, { required: required ? `${label} is required` : false })}
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
            errors[name] ? 'border-red-500' : 'border-gray-300',
            inputClassName
          )}
          onChange={onChange} // allow external change for other types too
        />
      )}

      {errorMessage && (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
          <LucideAlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
