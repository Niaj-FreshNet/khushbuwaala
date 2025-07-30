"use client";

import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { NavbarClientWrapper } from "./NavbarClientWrapper";

// SEO: Structured Data for Navigation
const navigationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "KhushbuWaala Main Navigation",
  url: "https://khushbuwaala.com",
  hasPart: [
    {
      "@type": "WebPage",
      name: "Home",
      url: "https://khushbuwaala.com/",
      description:
        "KhushbuWaala homepage with featured perfumes and collections",
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
      description:
        "Perfect gift sets and perfume packages for special occasions",
    },
  ],
};

// Server Component - Main Navbar
export function Navbar() {
  // SEO: Menu items with structured data
  const menuItems = [
    {
      label: "Inspired Perfume Oil",
      href: "/inspired-perfume-oil",
      description:
        "High-quality inspired perfume oils with long-lasting fragrance",
    },
    {
      label: "Oriental & Arabian Attar",
      href: "/oriental-attar",
      description: "Authentic oriental and Arabian attar collection",
    },
    {
      label: "Artificial Oud",
      href: "/artificial-oud",
      description: "Premium artificial oud fragrances and blends",
    },
    {
      label: "Natural Collections",
      href: "/natural-attar",
      description: "Pure natural attar and organic fragrance collections",
    },
  ];

  return (
    <>
      {/* SEO: Structured Data for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(navigationStructuredData),
        }}
      />

      <NavbarClientWrapper>
        {({ handlers, counts, drawerOpen }) => (
          <header
            className="backdrop-blur-xl bg-white/95 shadow-lg border-b border-red-100/50"
            role="banner"
            style={{
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Top announcement bar */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-center py-2 px-4">
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>
                  Free shipping on orders over ৳1000 • Premium quality
                  guaranteed
                </span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <nav
              className="mx-auto px-4 lg:px-8 h-20 flex items-center justify-between"
              role="navigation"
              aria-label="Main navigation"
            >
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl group"
                  aria-label="Open navigation menu"
                  onClick={handlers.toggleDrawer}
                >
                  <Menu className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  {drawerOpen && (
                    <div className="absolute inset-0 bg-red-100 rounded-xl animate-pulse"></div>
                  )}
                </Button>
              </div>

              {/* Enhanced Logo - Desktop */}
              <div className="hidden lg:block">
                <Link
                  href="/"
                  className="group relative transition-all duration-300 hover:scale-105"
                  title="KhushbuWaala - Premium Perfumes and Attars"
                  aria-label="KhushbuWaala homepage"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <Image
                    src="/images/khushbuwaala-logo.webp"
                    alt="KhushbuWaala - Premium Perfumes"
                    className="relative h-12 w-auto transition-all duration-300"
                    width={140}
                    height={48}
                  />
                </Link>
              </div>

              {/* Enhanced Logo - Mobile (Centered) */}
              <div className="flex-1 lg:hidden flex justify-center">
                <Link
                  href="/"
                  className="group relative transition-all duration-300 hover:scale-105"
                  title="KhushbuWaala - Premium Perfumes and Attars"
                  aria-label="KhushbuWaala homepage"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <Image
                    src="/images/khushbuwaala.webp"
                    alt="KhushbuWaala - Premium Perfumes"
                    className="relative h-10 w-auto transition-all duration-300"
                    width={120}
                    height={40}
                  />
                </Link>
              </div>

              {/* Enhanced Desktop Navigation */}
              <div className="hidden lg:flex flex-grow justify-center">
                <ul className="flex space-x-6 text-black font-semibold text-sm uppercase">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="KhushbuWaala homepage"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/new-arrivals"
                      className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Latest perfume arrivals"
                    >
                      New In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Browse all perfume collections"
                    >
                      All Collection
                    </Link>
                  </li>
                  <li>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="hover:text-red-600 transition-colors duration-300 font-semibold text-sm uppercase p-2"
                          aria-label="Perfume categories menu"
                        >
                          Menu
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg">
                        {menuItems.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="block px-4 py-2 text-black font-bold text-md hover:bg-gray-100 transition-colors duration-300"
                              title={item.description}
                            >
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                  <li>
                    <Link
                      href="/womens-perfume"
                      className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Exclusive perfumes for women"
                    >
                      For Women
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gifts-and-packages"
                      className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Perfect gift sets and packages"
                    >
                      Gifts and Packages
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Contact KhushbuWaala"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Enhanced Desktop Icons */}
              <div className="hidden lg:flex gap-3 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openSearch}
                  className="relative h-12 w-12 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 rounded-xl group"
                  aria-label="Search perfumes"
                  title="Search our perfume collection"
                >
                  <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                </Button>

                <Link href="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-12 w-12 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-red-600 transition-all duration-300 rounded-xl group"
                    aria-label={`Wishlist (${counts.wishlist} items)`}
                    title="View your wishlist"
                  >
                    <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    {counts.wishlist > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs h-6 w-6 flex items-center justify-center p-0 rounded-full shadow-lg animate-pulse">
                        {counts.wishlist}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-red-100 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openCart}
                  className="relative h-12 w-12 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-300 rounded-xl group"
                  aria-label={`Shopping cart (${counts.cart} items)`}
                  title="View your shopping cart"
                >
                  <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs h-6 w-6 flex items-center justify-center p-0 rounded-full shadow-lg">
                    {counts.cart}
                  </Badge>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                </Button>

                <Link href="/track-order">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-12 w-12 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-600 transition-all duration-300 rounded-xl group"
                    aria-label="Track your order"
                    title="Track your order status"
                  >
                    <MapPin className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                  </Button>
                </Link>
              </div>

              {/* Enhanced Mobile Icons */}
              <div className="flex lg:hidden gap-2 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openSearch}
                  className="relative h-10 w-10 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 rounded-xl group"
                  aria-label="Search perfumes"
                >
                  <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openCart}
                  className="relative h-10 w-10 hover:bg-green-50 hover:text-green-600 transition-all duration-300 rounded-xl group"
                  aria-label={`Shopping cart (${counts.cart} items)`}
                >
                  <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full shadow-lg">
                    {counts.cart}
                  </Badge>
                </Button>
              </div>
            </nav>
          </header>
        )}
      </NavbarClientWrapper>
    </>
  );
}
