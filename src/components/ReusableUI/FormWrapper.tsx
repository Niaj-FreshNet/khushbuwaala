'use client';

import { ReactNode, useState } from 'react';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormWrapperProps {
  children: ReactNode;
  onSubmit: SubmitHandler<any>;
  onReset?: () => void;
  className?: string;
  submitButtonText?: string;
  submitButtonClassName?: string;
  showResetButton?: boolean;
  resetButtonText?: string;
  resetButtonClassName?: string;
  defaultValues?: Record<string, any>;
  resolver?: any;
  successMessage?: string;
  errorMessage?: string;
  resetOnSuccess?: boolean;
}

export default function FormWrapper({
  children,
  onSubmit,
  onReset,
  defaultValues,
  resolver,
  className,
  submitButtonText = 'Submit',
  submitButtonClassName,
  showResetButton = true,
  resetButtonText = 'Reset',
  resetButtonClassName,
  successMessage = 'Form submitted successfully!',
  errorMessage = 'Failed to submit the form. Please try again.',
  resetOnSuccess = false,
}: FormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm({ defaultValues, resolver });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      if (result !== false) {
        // toast.success(successMessage);
        if (resetOnSuccess) methods.reset();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        errorMessage;
      toast.error(message);
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    methods.reset();
    onReset?.();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className={cn('space-y-6', className)}
        noValidate
        encType="multipart/form-data"
      >
        {children}

        <div className="flex justify-end gap-4 pt-4">
          {showResetButton && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
              className={cn(
                'border-orange-400 text-orange-500 hover:bg-orange-50',
                resetButtonClassName
              )}
            >
              {resetButtonText}
            </Button>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200',
              isSubmitting && 'opacity-70 cursor-not-allowed',
              submitButtonClassName
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
