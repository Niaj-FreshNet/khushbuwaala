"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  ArrowRight,
  Navigation,
  User,
  LogIn,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { NavbarClientWrapper } from "./NavbarClientWrapper"
import { cn } from "@/lib/utils"
import { useAuth } from "@/redux/store/hooks/useAuth"

const navigationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "Khushbuwaala Main Navigation",
  url: "https://khushbuwaala.com",
  hasPart: [
    {
      "@type": "WebPage",
      name: "Home",
      url: "https://khushbuwaala.com/",
      description: "Khushbuwaala homepage with featured perfumes and collections",
    },
    {
      "@type": "WebPage",
      name: "New Arrivals",
      url: "https://khushbuwaala.com/new-arrivals",
      description: "Latest perfume arrivals and new fragrance collections",
    },
    {
      "@type": "WebPage",
      name: "All Collection",
      url: "https://khushbuwaala.com/shop",
      description: "Complete collection of perfumes, attars, and fragrances",
    },
    {
      "@type": "WebPage",
      name: "For Women",
      url: "https://khushbuwaala.com/womens-perfume",
      description: "Exclusive perfume collection designed for women",
    },
    {
      "@type": "WebPage",
      name: "Gifts and Packages",
      url: "https://khushbuwaala.com/gifts-and-packages",
      description: "Perfect gift sets and perfume packages for special occasions",
    },
  ],
}

interface NavbarProps {
  notices?: string[]
  noticeInterval?: number
}

const defaultNotices = [
  "Free shipping on orders over ৳1000",
  "100% Authentic & Long-lasting Fragrances",
  "Cash on Delivery Available Island-wide",
]

export function Navbar({ notices = defaultNotices, noticeInterval = 4000 }: NavbarProps) {
  const { user } = useAuth()
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0)

  const accountHref = user ? "/my-account" : "/login"
  const accountTitle = user ? "My Account" : "Login"
  const AccountIcon = user ? User : User

  useEffect(() => {
    if (notices.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % notices.length)
      }, noticeInterval)
      return () => clearInterval(intervalId)
    }
  }, [notices, noticeInterval])

  const menuItems = [
    {
      label: "Organic Attar",
      href: "/organic-attar",
      description: "Pure natural attar and organic fragrance collections",
    },
    {
      label: "Artificial Oud",
      href: "/artificial-oud",
      description: "Premium artificial oud fragrances and blends",
    },
    {
      label: "Oriental & Arabian Attar",
      href: "/oriental-attar",
      description: "Authentic oriental and Arabian attar collection",
    },
    {
      label: "Inspired Perfume Oil",
      href: "/inspired-perfume-oil",
      description: "High-quality inspired perfume oils with long-lasting fragrance",
    },
    {
      label: "Brand Perfumes",
      href: "/brand-perfumes",
      description: "Popular Brand Perfumes",
    },
    {
      label: "Niche Perfumes",
      href: "/niche-perfumes",
      description: "Our In-house Creations",
    },
    {
      label: "Accessories",
      href: "/accessories",
      description: "Perfume-related accessories and gifts",
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationStructuredData) }}
      />

      <NavbarClientWrapper>
        {({ handlers, counts, drawerOpen, cartBump }) => (
          <header
            className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl shadow-xs transition-all duration-300"
            role="banner"
          >
            {/* Announcement Bar with Notice Rotation */}
            <div className="relative overflow-hidden bg-linear-to-r from-emerald-800 via-emerald-600 to-emerald-700 px-3 py-0 text-white sm:px-4">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              <div className="relative flex items-center justify-center gap-2 text-[11px] sm:text-xs min-h-5 sm:min-h-6">
                <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 animate-pulse text-amber-300" />

                <span
                  key={currentNoticeIndex}
                  className="animate-fade-in truncate tracking-wide text-center"
                >
                  {notices[currentNoticeIndex]}
                </span>

                <Star
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 animate-pulse text-amber-300"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>

            {/* NAV: Responsive width system */}
            <nav
              className="mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] px-3 sm:px-4 lg:px-6 2xl:px-8"
              aria-label="Main navigation"
            >
              {/* Mobile / Tablet (< lg) */}
              <div className="lg:hidden grid grid-cols-[auto_1fr_auto] items-center gap-2 h-12 sm:h-13">
                {/* Left: Menu */}
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:text-emerald-700 transition-colors"
                    aria-label="Open navigation menu"
                    onClick={handlers.toggleDrawer}
                  >
                    <Menu
                      className={`h-5 w-5 transition-transform duration-300 ${drawerOpen ? "rotate-90 scale-110" : ""
                        }`}
                    />
                  </Button>
                </div>

                {/* Center: Logo */}
                <div className="flex justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center transition-transform hover:scale-105"
                    title="Khushbuwaala - Premium Perfumes and Attars"
                    aria-label="Khushbuwaala homepage"
                  >
                    <Image
                      src="/images/khushbuwaala.webp"
                      alt="Khushbuwaala"
                      className="h-7 sm:h-8 w-auto object-contain"
                      width={120}
                      height={34}
                      priority
                    />
                  </Link>
                </div>

                {/* Right: Search & Cart */}
                <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlers.openSearch}
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-gray-100 text-gray-700"
                    aria-label="Search perfumes"
                  >
                    <Search className="h-4.5 w-4.5" />
                  </Button>

                  <Button
                    id="kw-cart-icon-mobile"
                    variant="ghost"
                    size="icon"
                    onClick={handlers.openCart}
                    className={cn(
                      "relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-gray-100 text-gray-700",
                      cartBump && "animate-bounce ring-2 ring-emerald-600 bg-emerald-50 text-emerald-700"
                    )}
                    aria-label={`Shopping cart (${counts.cart} items)`}
                  >
                    <ShoppingCart className="h-4.5 w-4.5" />
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white h-4.5 min-w-4.5 text-[9px] flex items-center justify-center p-0.5 rounded-full border border-white">
                      {counts.cart > 99 ? "99+" : counts.cart}
                    </Badge>
                  </Button>
                </div>
              </div>

              {/* Desktop (lg+) */}
              <div className="hidden lg:flex items-center justify-between gap-4 xl:gap-8 h-13 sm:h-14">
                {/* Left: Logo */}
                <div className="flex items-center shrink-0">
                  <Link
                    href="/"
                    className="inline-flex items-center transition-transform hover:scale-105"
                    title="Khushbuwaala - Premium Perfumes"
                  >
                    <Image
                      src="/images/khushbuwaala.webp"
                      alt="Khushbuwaala"
                      className="h-8.5 xl:h-9 w-auto object-contain"
                      width={130}
                      height={38}
                    />
                  </Link>
                </div>

                {/* Center: Navigation */}
                <div className="flex-1 flex justify-center min-w-0">
                  <ul
                    className="flex items-center justify-center gap-0.5 xl:gap-1.5 text-gray-800 font-semibold text-xs xl:text-sm whitespace-nowrap"
                    role="menubar"
                  >
                    <li role="none">
                      <Link
                        href="/"
                        className="px-2.5 xl:px-3.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-gray-50 transition-colors"
                        role="menuitem"
                      >
                        HOME
                      </Link>
                    </li>

                    <li role="none">
                      <Link
                        href="/new-arrivals"
                        className="px-2.5 xl:px-3.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-gray-50 transition-colors"
                        role="menuitem"
                      >
                        NEW IN
                      </Link>
                    </li>

                    <li role="none">
                      <Link
                        href="/shop"
                        className="px-2.5 xl:px-3.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-gray-50 transition-colors"
                        role="menuitem"
                      >
                        SHOP
                      </Link>
                    </li>

                    <li role="none">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="px-2.5 xl:px-3.5 py-1.5 h-auto text-xs xl:text-sm font-semibold rounded-lg hover:text-emerald-700 hover:bg-gray-50 data-[state=open]:text-emerald-700"
                          >
                            <span className="flex items-center gap-1.5">
                              CATEGORIES
                              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-72 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl rounded-xl p-2 animate-scale-in">
                          {menuItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link
                                href={item.href}
                                className="block px-3 py-2 text-gray-700 font-medium hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors cursor-pointer"
                              >
                                <div className="flex items-center justify-between text-xs font-semibold">
                                  <span>{item.label}</span>
                                  <ArrowRight className="h-3 w-3 opacity-60" />
                                </div>
                                <span className="text-[11px] text-gray-400 block mt-0.5 line-clamp-1">
                                  {item.description}
                                </span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>

                    <li role="none">
                      <Link
                        href="/womens-perfume"
                        className="px-2.5 xl:px-3.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-gray-50 transition-colors"
                        role="menuitem"
                      >
                        FOR WOMEN
                      </Link>
                    </li>

                    <li role="none">
                      <Link
                        href="/gifts-and-packages"
                        className="px-2.5 xl:px-3.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-gray-50 transition-colors"
                        role="menuitem"
                      >
                        COMBO
                      </Link>
                    </li>

                    <li role="none">
                      <Link
                        href="/contact"
                        className="px-2.5 xl:px-3.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-gray-50 transition-colors"
                        role="menuitem"
                      >
                        CONTACT
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 xl:gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlers.openSearch}
                    className="h-9 w-9 rounded-lg hover:bg-gray-100 hover:text-emerald-700 text-gray-700"
                    aria-label="Search perfumes"
                    title="Search"
                  >
                    <Search className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                  </Button>

                  <Link href="/track-order">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-gray-100 hover:text-emerald-700 text-gray-700"
                      aria-label="Track order"
                      title="Track Order"
                    >
                      <Navigation className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                    </Button>
                  </Link>

                  <Link href="/wishlist">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-9 w-9 rounded-lg hover:bg-gray-100 hover:text-emerald-700 text-gray-700"
                      aria-label={`Wishlist (${counts.wishlist} items)`}
                      title="Wishlist"
                    >
                      <Heart className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                      {counts.wishlist > 0 && (
                        <Badge className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[9px] h-4 min-w-4 flex items-center justify-center p-0 rounded-full border border-white">
                          {counts.wishlist > 99 ? "99+" : counts.wishlist}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Button
                    id="kw-cart-icon-desktop"
                    variant="ghost"
                    size="icon"
                    onClick={handlers.openCart}
                    className={cn(
                      "relative h-9 w-9 rounded-lg hover:bg-gray-100 hover:text-emerald-700 text-gray-700",
                      cartBump && "animate-bounce ring-2 ring-emerald-600 bg-emerald-50 text-emerald-700"
                    )}
                    aria-label={`Shopping cart (${counts.cart} items)`}
                    title="Cart"
                  >
                    <ShoppingCart className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                    <Badge className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] h-4 min-w-4 flex items-center justify-center p-0 rounded-full border border-white">
                      {counts.cart > 99 ? "99+" : counts.cart}
                    </Badge>
                  </Button>

                  <Link href={accountHref}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-gray-100 hover:text-emerald-700 text-gray-700"
                      aria-label={accountTitle}
                      title={accountTitle}
                    >
                      <AccountIcon className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
          </header>
        )}
      </NavbarClientWrapper>
    </>
  )
}