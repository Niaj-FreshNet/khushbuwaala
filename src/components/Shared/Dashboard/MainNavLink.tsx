'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LuChevronDown, LuChevronUp, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';
import { NavLink } from '@/types/navlink.types';
import { useAuth } from '@/redux/store/hooks/useAuth';

interface MainNavLinkProps {
  navLink: NavLink[];
  additionalRoutes: NavLink[] | null;
  isShort: boolean;
  setIsShort: React.Dispatch<React.SetStateAction<boolean>>;
  dark?: boolean;
  role?: string;
}

export default function MainNavLink({
  navLink,
  additionalRoutes,
  isShort,
  setIsShort,
  dark = true,
  role
}: MainNavLinkProps) {
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const allLinks = [...(navLink || []), ...(additionalRoutes || [])];
  // console.log('allLinks', allLinks);

  return (
    <nav className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div
        className={cn(
          'flex items-center justify-between mb-6 px-2',
          isShort && 'justify-center'
        )}
      >
        {!isShort && (
          <h2
            className={cn(
              'text-lg font-bold',
              dark ? 'text-white' : 'text-gray-900'
            )}
          >
            {role}
          </h2>
        )}

        {/* Collapse/Expand Toggle */}
        <button
          onClick={() => setIsShort(!isShort)}
          className={cn(
            'hidden lg:flex items-center justify-center rounded-md p-2 transition-colors',
            dark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-900'
          )}
          aria-label={isShort ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isShort ? (
            <LuChevronsRight className="h-5 w-5" />
          ) : (
            <LuChevronsLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 space-y-1 overflow-y-auto pr-1">
        {allLinks.map((link) => {
          // Check if any of the subItems match the pathname
          const subItemActive = link.subItems?.some(
            (sub) => pathname === sub.href
          );

          // Active only if the main link matches AND no subitem is active
          const isActive = !subItemActive && pathname === link.href;

          const isSubMenuOpen = openSubMenus.includes(link.name);

          return (
            <li key={link.name}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-md transition-colors cursor-pointer',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : dark
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100',
                  isShort ? 'justify-center p-3' : 'p-2'
                )}
              >
                {/* Icon */}
                {link.icon && (
                  <link.icon
                    className={cn(
                      'h-5 w-5',
                      isActive
                        ? 'text-white'
                        : dark
                          ? 'text-gray-300'
                          : 'text-gray-600'
                    )}
                  />
                )}

                {!isShort && (
                  <>
                    {link.subItems ? (
                      <button
                        onClick={() => toggleSubMenu(link.name)}
                        className="flex-1 flex items-center justify-between"
                        aria-expanded={isSubMenuOpen}
                      >
                        <span>{link.name}</span>
                        {isSubMenuOpen ? (
                          <LuChevronUp className="h-4 w-4" />
                        ) : (
                          <LuChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex-1"
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.name}
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Submenu Items */}
              {link.subItems && isSubMenuOpen && !isShort && (
                <ul className="ml-6 mt-1 space-y-1">
                  {link.subItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          className={cn(
                            'flex items-center gap-2 rounded-md p-2 text-sm transition-colors',
                            isSubActive
                              ? 'bg-indigo-500 text-white'
                              : dark
                                ? 'text-gray-300 hover:bg-gray-600'
                                : 'text-gray-600 hover:bg-gray-200'
                          )}
                        >
                          {sub.icon && (
                            <sub.icon
                              className={cn(
                                'h-4 w-4',
                                isSubActive
                                  ? 'text-white'
                                  : dark
                                    ? 'text-gray-300'
                                    : 'text-gray-600'
                              )}
                            />
                          )}
                          {sub.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
