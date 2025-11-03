'use client';

import { cn } from '@/lib/utils';
import MainNavLink from './MainNavLink';
import { NavLink } from '@/types/navlink.types';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/redux/store/hooks/useAuth';
import { useLogoutMutation } from '@/redux/store/api/auth/authApi';
import { navLinks } from '@/config/navLink';
import { logout } from '@/redux/store/features/auth/authSlice';
import { UserRole } from '@/types/auth.types';

interface SideBarProps {
  navRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  isShort: boolean;
  additionalRoutes: NavLink[] | null;
  setIsShort: React.Dispatch<React.SetStateAction<boolean>>;
  dark?: boolean;
}

export default function SideBar({
  navRef,
  isOpen,
  isShort,
  additionalRoutes,
  setIsShort,
  dark = true,
}: SideBarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const [logoutApi] = useLogoutMutation();
  // console.log('user:', user?.role)


  // Skeleton Loader for Nav + SubItems (more realistic layout)
  const SkeletonNav = () => (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-4">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            {/* Main Nav Item */}
            <div
              className={cn(
                'flex items-center gap-3 rounded-md animate-pulse px-2 py-2',
                dark ? 'bg-gray-600' : 'bg-gray-200',
                isShort ? 'justify-center' : ''
              )}
            >
              {/* Icon Placeholder */}
              <div
                className={cn(
                  'rounded-md',
                  dark ? 'bg-gray-600' : 'bg-gray-300',
                  'h-5 w-5'
                )}
              ></div>

              {/* Label Placeholder */}
              {!isShort && (
                <div
                  className={cn(
                    'h-4 rounded-md',
                    dark ? 'bg-gray-600' : 'bg-gray-300',
                    'w-24'
                  )}
                ></div>
              )}
            </div>

            {/* Sub-items */}
            {!isShort &&
              [...Array(2)].map((_, subIdx) => (
                <div
                  key={subIdx}
                  className="flex items-center gap-3 ml-8 animate-pulse"
                >
                  <div
                    className={cn(
                      'rounded-md',
                      dark ? 'bg-gray-700' : 'bg-gray-300',
                      'h-3 w-3'
                    )}
                  ></div>
                  <div
                    className={cn(
                      'h-3 rounded-md',
                      dark ? 'bg-gray-700' : 'bg-gray-300',
                      'w-20'
                    )}
                  ></div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Logout button mimic */}
      <div
        className={cn(
          'flex items-center gap-3 rounded-md mt-6 animate-pulse px-3 py-2',
          dark ? 'bg-red-700' : 'bg-red-300',
          isShort ? 'justify-center' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'rounded-md',
            dark ? 'bg-red-600' : 'bg-red-400',
            'h-5 w-5'
          )}
        ></div>
        {!isShort && (
          <div
            className={cn(
              'h-4 rounded-md',
              dark ? 'bg-red-600' : 'bg-red-400',
              'w-16'
            )}
          ></div>
        )}
      </div>
    </div>
  );


  if (!user) {
    return (
      <div ref={navRef}>
        {/* Mobile Skeleton */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden',
            isOpen ? 'translate-x-0' : '-translate-x-full',
            dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          )}
        >
          <SkeletonNav />
        </div>

        {/* Desktop Skeleton */}
        <div
          className={cn(
            'hidden lg:flex flex-col h-screen shadow-md transition-all duration-300 ease-in-out',
            isShort ? 'w-20' : 'w-72',
            dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          )}
        >
          <SkeletonNav />
        </div>
      </div>
    );
  }

  const role: UserRole | undefined = user?.role;

  const filteredNavLinks = navLinks
    .filter((link) => {
      if (!role) {
        return false;
      }
      return link.roles.includes(role);
    })
    .map((link) => ({
      ...link,
      subItems: link.subItems?.filter((sub) => {
        if (!role) {
          return false;
        }
        return sub.roles.includes(role);
      }),
    }));

  const combinedNavLinks = [
    ...filteredNavLinks,
    ...(additionalRoutes?.filter((link) => {
      if (!role) {
        return false;
      }
      return link.roles.includes(role);
    }) || []),
  ];

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap();
      dispatch(logout());
      toast.success('Logged out successfully!');
      router.push('/login');
    } catch (error) {
      console.error('Logout API failed:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div ref={navRef}>
      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        )}
      >
        <div className="flex-1 overflow-y-auto">
          <MainNavLink
            dark={dark}
            isShort={isShort}
            setIsShort={setIsShort}
            additionalRoutes={additionalRoutes}
            navLink={combinedNavLinks}
            role={user?.role}
          />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 mt-auto w-full hover:bg-red-600 rounded-md text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:flex flex-col h-screen shadow-md transition-all duration-300 ease-in-out',
          isShort ? 'w-20' : 'w-72',
          dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        )}
      >
        <div className="flex-1 overflow-y-auto">
          <MainNavLink
            dark={dark}
            isShort={isShort}
            setIsShort={setIsShort}
            additionalRoutes={additionalRoutes}
            navLink={combinedNavLinks}
          />
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 px-4 py-2 mt-auto w-full hover:bg-red-600 rounded-md text-white',
            isShort ? 'justify-center' : 'justify-start'
          )}
        >
          <LogOut size={20} />
          {!isShort && 'Logout'}
        </button>
      </div>
    </div>
  );
}
