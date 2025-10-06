'use client';

import { ReactNode, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormConfig {
    defaultValues?: Record<string, any>;
    resolver?: any;
}

interface FormWrapperProps extends FormConfig {
    children: ReactNode;
    onSubmit: SubmitHandler<any>;
    onReset?: () => void;
    className?: string;
    submitButtonText?: string;
    submitButtonClassName?: string;
    showResetButton?: boolean;
    resetButtonText?: string;
    resetButtonClassName?: string;
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
    // successMessage = 'Form submitted successfully!',
    errorMessage = 'Failed to submit the form. Please try again.',
    resetOnSuccess = false,
}: FormWrapperProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formConfig: FormConfig = {};
    if (defaultValues) formConfig.defaultValues = defaultValues;
    if (resolver) formConfig.resolver = resolver;

    const methods = useForm(formConfig);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            // toast.success(successMessage);
            if (resetOnSuccess) methods.reset();
        } catch (error: any) {
            toast.error(error?.data?.message || errorMessage);
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        methods.reset();
        if (onReset) onReset(); // ✅ Call the parent close function
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(handleSubmit)}
                className={cn('space-y-6', className)}
                noValidate
            >
                {children}
                <div className="flex justify-end gap-4">
                    {showResetButton && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className={cn(
                                'border-orange-400 text-orange-400 hover:bg-orange-50',
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
                            'bg-indigo-600 hover:bg-indigo-700 text-white',
                            isSubmitting && 'opacity-50 cursor-not-allowed',
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