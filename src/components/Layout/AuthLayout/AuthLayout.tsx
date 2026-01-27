// File: components/auth/AuthLayout.tsx
'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { BiIdCard } from 'react-icons/bi';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export default function AuthLayout({ children, title, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={cn('w-full max-w-md bg-white rounded-3xl shadow-lg p-8', className)}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-6 justify-center text-indigo-600 font-bold text-xl">
        </Link>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">{title}</h1>
        {children}
      </div>
    </div>
  );
}