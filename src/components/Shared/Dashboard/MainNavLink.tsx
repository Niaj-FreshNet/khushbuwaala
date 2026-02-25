'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LuChevronDown,
  LuChevronUp,
  LuChevronsLeft,
  LuChevronsRight,
} from 'react-icons/lu';
import { NavLink } from '@/types/navlink.types';

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
  role,
}: MainNavLinkProps) {
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

  const allLinks = useMemo(
    () => [...(navLink || []), ...(additionalRoutes || [])],
    [navLink, additionalRoutes]
  );

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  // ✅ Auto-open submenu if current path is inside it
  useEffect(() => {
    const parent = allLinks.find((l) => l.subItems?.some((s) => s.href === pathname));
    if (parent?.name && !openSubMenus.includes(parent.name)) {
      setOpenSubMenus((prev) => [...prev, parent.name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, allLinks]);

  const baseItemClasses = (active: boolean) =>
    cn(
      'w-full flex items-center gap-3 rounded-md transition-colors select-none',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60',
      active
        ? 'bg-indigo-600 text-white'
        : dark
        ? 'text-gray-200 hover:bg-gray-700'
        : 'text-gray-700 hover:bg-gray-100'
    );

  const iconColor = (active: boolean) =>
    cn(
      'h-5 w-5 shrink-0',
      active ? 'text-white' : dark ? 'text-gray-300' : 'text-gray-600'
    );

  return (
    <nav className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className={cn('flex items-center justify-between mb-6 px-2', isShort && 'justify-center')}>
        {!isShort && (
          <h2 className={cn('text-lg font-bold', dark ? 'text-white' : 'text-gray-900')}>
            {role}
          </h2>
        )}

        {/* Collapse/Expand Toggle */}
        <button
          onClick={() => setIsShort((p) => !p)}
          className={cn(
            'hidden lg:flex items-center justify-center rounded-md p-2 transition-colors',
            dark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-900'
          )}
          aria-label={isShort ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isShort ? 'Expand sidebar' : 'Collapse sidebar'}
          type="button"
        >
          {isShort ? <LuChevronsRight className="h-5 w-5" /> : <LuChevronsLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 space-y-1 overflow-y-auto pr-1">
        {allLinks.map((link) => {
          const subItemActive = link.subItems?.some((sub) => pathname === sub.href) ?? false;

          // Active only if main matches AND no sub item is active
          const isActive = !subItemActive && pathname === link.href;

          const isSubMenuOpen = openSubMenus.includes(link.name);
          const hasSub = !!link.subItems?.length;

          // ✅ Collapsed mode: make parent clickable (either toggle submenu or navigate if no submenu)
          if (isShort) {
            return (
              <li key={link.name}>
                {hasSub ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSubMenu(link.name)}
                      className={cn(baseItemClasses(subItemActive), 'justify-center p-3')}
                      aria-expanded={isSubMenuOpen}
                      aria-controls={`submenu-${link.name}`}
                      title={link.name} // ✅ tooltip on hover
                    >
                      {link.icon && <link.icon className={iconColor(subItemActive)} />}
                    </button>

                    {/* ✅ Submenu shown under icon even in collapsed mode (still clickable) */}
                    {isSubMenuOpen && (
                      <ul
                        id={`submenu-${link.name}`}
                        className={cn(
                          'mt-1 space-y-1',
                          dark ? 'border-l border-white/10' : 'border-l border-gray-200',
                          'pl-2 ml-2'
                        )}
                      >
                        {link.subItems!.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                title={sub.name}
                                className={cn(
                                  'w-full flex items-center justify-center rounded-md p-2 text-sm transition-colors',
                                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60',
                                  isSubActive
                                    ? 'bg-indigo-500 text-white'
                                    : dark
                                    ? 'text-gray-300 hover:bg-gray-600'
                                    : 'text-gray-700 hover:bg-gray-200'
                                )}
                                aria-current={isSubActive ? 'page' : undefined}
                              >
                                {sub.icon ? (
                                  <sub.icon
                                    className={cn(
                                      'h-4 w-4 shrink-0',
                                      isSubActive ? 'text-white' : dark ? 'text-gray-300' : 'text-gray-600'
                                    )}
                                  />
                                ) : (
                                  <span className="text-xs">{sub.name.slice(0, 2).toUpperCase()}</span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(baseItemClasses(isActive), 'justify-center p-3')}
                    aria-current={isActive ? 'page' : undefined}
                    title={link.name} // ✅ tooltip
                  >
                    {link.icon && <link.icon className={iconColor(isActive)} />}
                  </Link>
                )}
              </li>
            );
          }

          // ✅ Expanded mode (normal)
          return (
            <li key={link.name}>
              {hasSub ? (
                <>
                  {/* ✅ Whole row clickable (button) */}
                  <button
                    type="button"
                    onClick={() => toggleSubMenu(link.name)}
                    className={cn(baseItemClasses(subItemActive), 'p-2 justify-between')}
                    aria-expanded={isSubMenuOpen}
                    aria-controls={`submenu-${link.name}`}
                  >
                    <span className="flex items-center gap-3">
                      {link.icon && <link.icon className={iconColor(subItemActive)} />}
                      <span className="truncate">{link.name}</span>
                    </span>

                    {isSubMenuOpen ? <LuChevronUp className="h-4 w-4" /> : <LuChevronDown className="h-4 w-4" />}
                  </button>

                  {/* Submenu Items */}
                  {isSubMenuOpen && (
                    <ul id={`submenu-${link.name}`} className="ml-6 mt-1 space-y-1">
                      {link.subItems!.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <li key={sub.name}>
                            <Link
                              href={sub.href}
                              className={cn(
                                'w-full flex items-center gap-2 rounded-md p-2 text-sm transition-colors',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60',
                                isSubActive
                                  ? 'bg-indigo-500 text-white'
                                  : dark
                                  ? 'text-gray-300 hover:bg-gray-600'
                                  : 'text-gray-600 hover:bg-gray-200'
                              )}
                              aria-current={isSubActive ? 'page' : undefined}
                            >
                              {sub.icon && (
                                <sub.icon
                                  className={cn(
                                    'h-4 w-4 shrink-0',
                                    isSubActive ? 'text-white' : dark ? 'text-gray-300' : 'text-gray-600'
                                  )}
                                />
                              )}
                              <span className="truncate">{sub.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              ) : (
                // ✅ Whole row clickable (Link)
                <Link
                  href={link.href}
                  className={cn(baseItemClasses(isActive), 'p-2')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.icon && <link.icon className={iconColor(isActive)} />}
                  <span className="truncate">{link.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}