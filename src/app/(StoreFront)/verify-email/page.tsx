// File: app/verify-email/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { otpSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserVerificationMutation, useResendOtpMutation } from '@/redux/store/api/auth/authApi';
import { toast } from 'sonner';
import Image from 'next/image';
import AuthLayout from '@/components/Layout/AuthLayout/AuthLayout';
import FormWrapper from '@/components/ReusableUI/FormWrapper';
import FormInput from '@/components/ReusableUI/FormInput';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { setUser } from '@/redux/store/features/auth/authSlice';
import { TUser } from '@/types/auth.types';

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOtpResent, setIsOtpResent] = useState(false);

  const [verifyUser, { isLoading: isVerifying, isSuccess }] = useUserVerificationMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();

  const email = searchParams.get('email');
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (!email) router.push('/sign-up');
  }, [email, router]);

  // No need for this useEffect anymore since auto-login will handle redirection
  // useEffect(() => {
  //   if (!isVerifying && isSuccess) {
  //     router.push(redirect || '/dashboard');
  //   }
  // }, [isVerifying, isSuccess, redirect, router]);

  const handleSubmit = async (data: { token: string }) => {
    if (!email) return;
    try {
      const res = await verifyUser({ email, ...data }).unwrap();
      const accessToken = res?.data?.accessToken || res?.accessToken;
      if (!accessToken) throw new Error('Token missing');

      const decoded = jwtDecode<TUser>(accessToken);
      dispatch(setUser({ user: decoded, accessToken }));

      toast.success('Email verified successfully!');
      router.push(redirect || '/dashboard');
    } catch (error: any) {
      toast.error(error?.data?.message || 'OTP verification failed.');
    }
  };

  const handleResendOtp = () => {
    if (!email) return;
    resendOtp({ email })
      .unwrap()
      .then(() => {
        setIsOtpResent(true);
        toast.success('OTP resent successfully!');
      })
      .catch(() => toast.error('Failed to resend OTP.'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:block md:w-1/2 border-r-2">
          <Image
            src="/perfume-bottle.jpg"
            alt="Perfume Bottle"
            width={1024}
            height={1024}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-12 flex justify-center items-center">
          <AuthLayout title="Email Verification">
            {email && (
              <p className="text-center mb-6 text-lg text-gray-700">
                An OTP has been sent to <strong>{email}</strong>.
              </p>
            )}
            <FormWrapper
              resolver={zodResolver(otpSchema)}
              onSubmit={handleSubmit}
              successMessage="OTP verified successfully!"
              className="space-y-4"
            >
              <FormInput
                name="token"
                label="OTP"
                type="text"
                placeholder="Enter 6-digit OTP"
                required
              />
            </FormWrapper>
            <div className="text-center mt-4">
              {isOtpResent ? (
                <p className="text-green-500 text-sm">OTP has been resent to your email.</p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-sm text-indigo-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isResendingOtp}
                >
                  {isResendingOtp ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </AuthLayout>
        </div>
      </div>
    </div>
  );
}
