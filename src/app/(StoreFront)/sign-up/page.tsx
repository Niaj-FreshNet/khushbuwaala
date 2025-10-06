// File: app/sign-up/page.tsx
'use client';

import { signUpSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { useRegisterMutation } from '@/redux/store/api/auth/authApi';
import AuthLayout from '@/components/Layout/AuthLayout/AuthLayout';
import FormWrapper from '@/components/ReusableUI/FormWrapper';
import FormInput from '@/components/ReusableUI/FormInput';
import { FormCheckbox } from '@/components/ReusableUI/FormCheckbox';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { fullName, email, password } = data;
    const name = fullName.trim().split(' ')[0] || fullName;
    try {
      await registerUser({ name, email, password }).unwrap();
      toast.success('Account created successfully! Please verify your email.');
      // 👇 Redirect to verify-email page with email in query params
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Sign-up failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Create Account">
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(signUpSchema)}
        defaultValues={{ fullName: '', email: '', password: '', confirmPassword: '', agree: false }}
        successMessage="Account created successfully!"
        className="space-y-4"
      >
        <FormInput
          name="fullName"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          required
        />
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />

        {/* Password */}
        <div className="relative">
          <FormInput
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Agree to terms */}
        <FormCheckbox
          name="agree"
          label={
            <>
              I agree to the{' '}
              <Link href="/terms" className="text-indigo-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
            </>
          }
        />
      </FormWrapper>

      <p className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
}
