/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import BreadCrumb from '@/components/Shared/Dashboard/BreadCrumb';
import SideBar from '@/components/Shared/Dashboard/Sidebar';
import TopBar from '@/components/Shared/Dashboard/TopBar';
import { useEffect, useRef, useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false); // for mobile sidebar
  const [isShort, setIsShort] = useState(true); // for desktop sidebar

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Prevent the parent (document/body) from scrolling
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SideBar
        dark
        setIsShort={setIsShort}
        additionalRoutes={null}
        isOpen={isOpen}
        isShort={isShort}
        navRef={navRef}
      />

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 h-full min-h-0">
        {/* Top bar */}
        <TopBar dark setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <BreadCrumb />
            <div className="rounded-lg border bg-white shadow-sm p-4 min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
