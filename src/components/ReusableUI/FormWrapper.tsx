'use client';

import { ReactNode, useState } from 'react';
import { FormProvider, useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { apiErrorMessage } from '@/lib/apiError';

interface FormWrapperProps<T extends FieldValues> {
  children: ReactNode;
  /** Return `false` to say the submit did not succeed (the form is then not cleared). */
  onSubmit: (data: T) => unknown | Promise<unknown>;
  onReset?: () => void;
  className?: string;
  submitButtonText?: string;
  submitButtonClassName?: string;
  showResetButton?: boolean;
  resetButtonText?: string;
  resetButtonClassName?: string;
  defaultValues?: DefaultValues<T>;
  resolver?: Resolver<T>;
  errorMessage?: string;
  resetOnSuccess?: boolean;
}

export default function FormWrapper<T extends FieldValues = FieldValues>({
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
  errorMessage = 'Failed to submit the form. Please try again.',
  resetOnSuccess = false,
}: FormWrapperProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<T>({ defaultValues, resolver });

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      if (result !== false && resetOnSuccess) methods.reset();
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage));
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
