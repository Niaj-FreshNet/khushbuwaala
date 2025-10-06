// File: app/forgot-password/page.tsx
'use client';

import { forgotPasswordSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import AuthLayout from '@/components/Layout/AuthLayout/AuthLayout';
import FormWrapper from '@/components/ReusableUI/FormWrapper';
import FormInput from '@/components/ReusableUI/FormInput';
import { useForgotPasswordMutation } from '@/redux/store/api/auth/authApi';

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (data: { email: string }) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send reset link.');
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <p className="text-center mb-6 text-sm text-gray-600">
        Enter your email to receive a password reset link.
      </p>
      <FormWrapper
        resolver={zodResolver(forgotPasswordSchema)}
        onSubmit={handleSubmit}
        successMessage="Reset link sent successfully!"
        className="space-y-4"
      >
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </FormWrapper>
      <p className="text-center mt-4 text-sm">
        Remember your password?{' '}
        <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
}