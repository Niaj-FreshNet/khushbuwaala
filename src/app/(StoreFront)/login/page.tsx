// File: app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSchema } from '@/schemas/auth.schema';
import { jwtDecode } from 'jwt-decode';
import { zodResolver } from '@hookform/resolvers/zod';
import { TUser } from '@/types/auth.types';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '@/components/Layout/AuthLayout/AuthLayout';
import FormInput from '@/components/ReusableUI/FormInput';
import FormWrapper from '@/components/ReusableUI/FormWrapper';
import { useLogInMutation } from '@/redux/store/api/auth/authApi';
import { setUser } from '@/redux/store/features/auth/authSlice';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [logIn, { isLoading }] = useLogInMutation();
  const router = useRouter();
  const dispatch = useDispatch();

const handleSubmit = async (data: { email: string; password: string }) => {
  try {
    const res = await logIn(data).unwrap();
    const accessToken = res?.data?.accessToken;

    if (!accessToken) throw new Error('Token missing');

    const decoded = jwtDecode<TUser>(accessToken);
    console.log(decoded)

    // Dispatch BEFORE navigating or calling API
    dispatch(setUser({ user: decoded, accessToken }));
    console.log('dispatched')

    router.push('/dashboard'); // ✅ Only navigate after token is in Redux
  } catch (error: any) {
    toast.error(error?.data?.message || 'Login failed. Please check your credentials.');
  }
};


  return (
    <AuthLayout title="Log In">
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(loginSchema)}
        successMessage="Login successful!"
        className="space-y-4"
      >
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />
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
      </FormWrapper>
      <p className="text-center mt-4 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-indigo-600 font-semibold hover:underline">
          Create Account
        </Link>
      </p>
      <p className="text-center mt-2 text-sm">
        Forgot your password?{' '}
        <Link href="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
          Reset Password
        </Link>
      </p>
    </AuthLayout>
  );
}