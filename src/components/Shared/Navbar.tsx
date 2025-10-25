"use client"

import Link from "next/link"
import { Search, Heart, ShoppingCart, MapPin, Menu, ChevronDown, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { NavbarClientWrapper } from "./NavbarClientWrapper"
import Image from "next/image"

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
}

// Server Component - Main Navbar
export function Navbar() {
  // SEO: Menu items with structured data
  const menuItems = [
    {
      label: "Inspired Perfume Oils",
      href: "/inspired-perfume-oils",
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
            className="backdrop-blur-xl bg-white/95 shadow-md border-b border-red-100/50 transition-all duration-300 sticky top-0 z-50"
            role="banner"
            style={{
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Enhanced announcement bar with animation */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white text-center py-1 px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <div className="relative flex items-center justify-center gap-2 text-xs font-medium">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="hidden sm:inline">Free shipping on orders over ৳1000 • Premium quality guaranteed</span>
                <span className="sm:hidden">Free shipping over ৳1000</span>
                <Sparkles className="h-4 w-4 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </div>

            <nav
              className="mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4"
              role="navigation"
              aria-label="Main navigation"
            >
              {/* Enhanced Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-12 w-12 hover:text-red-600 transition-all duration-300 rounded-xl group overflow-hidden"
                  aria-label="Open navigation menu"
                  onClick={handlers.toggleDrawer}
                >
                  {/* Background layers */}
                  {drawerOpen && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl animate-pulse z-0"></div>
                  )}
                  <div className="absolute inset-0 bg-red-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 z-0"></div>

                  {/* Menu icon */}
                  <Menu
                    className={`relative z-10 h-6 w-6 transition-all duration-300 ${drawerOpen ? 'rotate-90 scale-110' : 'group-hover:scale-110'
                      }`}
                  />
                </Button>
              </div>

              {/* Enhanced Logo - Desktop */}
              <div className="hidden lg:block">
                <Link
                  href="/"
                  className="group relative transition-all duration-300 hover:scale-105 flex-shrink-0"
                  title="KhushbuWaala - Premium Perfumes and Attars"
                  aria-label="KhushbuWaala homepage"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <Image
                    src="/images/khushbuwaala.webp"
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
                  <div className="absolute -inset-2 bg-gradient-to-r rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
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
                <ul
                  className="flex items-center justify-center flex-grow space-x-2 text-gray-800 font-semibold text-sm"
                  role="menubar"
                >
                  <li role="none">
                    <Link
                      href="/"
                      className="relative px-4 py-2 hover:text-red-600 transition-all duration-300 rounded-xl group"
                      role="menuitem"
                      title="KhushbuWaala homepage"
                    >
                      <span className="relative z-10">HOME</span>
                      <div className="absolute inset-0 bg-red-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/new-arrivals"
                      className="relative px-4 py-2 hover:text-red-600 transition-all duration-300 rounded-xl group flex items-center gap-2"
                      role="menuitem"
                      title="Latest perfume arrivals"
                    >
                      <span className="relative z-10">NEW IN</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs px-2 py-0.5 z-10 rounded-full"
                      >
                        Hot
                      </Badge>
                      <div className="absolute inset-0 bg-red-50 z-5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/shop"
                      className="relative px-4 py-2 hover:text-red-600 transition-all duration-300 rounded-xl group"
                      role="menuitem"
                      title="Browse all perfume collections"
                    >
                      <span className="relative z-10">ALL COLLECTION</span>
                      <div className="absolute inset-0 bg-red-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </Link>
                  </li>
                  <li role="none">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative px-4 py-2 hover:text-red-600 transition-all duration-300 font-semibold text-sm rounded-xl group"
                          aria-label="Perfume categories menu"
                          aria-haspopup="true"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            CATEGORIES
                            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                          </span>
                          <div className="absolute inset-0 bg-red-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-xl border border-red-100/50 shadow-2xl rounded-2xl p-3 animate-scale-in">
                        {menuItems.map((item, index) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="block px-4 py-3 text-gray-800 font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 rounded-xl group relative overflow-hidden"
                              title={item.description}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="relative z-10 flex flex-col">
                                <span className="font-semibold flex items-center gap-2">
                                  {item.label}
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </span>
                                <span className="text-xs text-gray-500 group-hover:text-red-500 mt-1 transition-colors duration-300">
                                  {item.description}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-pink-50/50 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl"></div>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                  <li role="none">
                    <Link
                      href="/womens-perfume"
                      className="relative px-4 py-2 hover:text-red-600 transition-all duration-300 rounded-xl group"
                      role="menuitem"
                      title="Exclusive perfumes for women"
                    >
                      <span className="relative z-10">FOR WOMEN</span>
                      <div className="absolute inset-0 bg-red-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/gifts-and-packages"
                      className="relative px-4 py-2 hover:text-red-600 transition-all duration-300 rounded-xl group"
                      role="menuitem"
                      title="Perfect gift sets and packages"
                    >
                      <span className="relative z-10">GIFTS</span>
                      <div className="absolute inset-0 bg-red-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/contact"
                      className="relative px-4 py-2 hover:text-red-600 transition-all duration-300 rounded-xl group"
                      role="menuitem"
                      title="Contact KhushbuWaala"
                    >
                      <span className="relative z-10">CONTACT</span>
                      <div className="absolute inset-0 bg-red-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Enhanced Desktop Icons */}
              <div className="hidden lg:flex gap-2 items-center flex-shrink-0 relative overflow-visible">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openSearch}
                  className="relative h-12 w-12 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 rounded-xl group"
                  aria-label="Search perfumes"
                  title="Search our perfume collection"
                >
                  <Search className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-blue-200/30 to-transparent animate-shimmer"></div>
                  </div>
                </Button>

                <Link href="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className=" relative overflow-visible h-12 w-12 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-red-600 transition-all duration-300 rounded-xl group"
                    aria-label={`Wishlist (${counts.wishlist} items)`}
                    title="View your wishlist"
                  >
                    <Heart className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:fill-current z-10" />
                    {counts.wishlist > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 z-20 text-white text-xs h-6 w-6 flex items-center justify-center p-0 rounded-full shadow-lg animate-pulse border-2 border-white">
                        {counts.wishlist > 99 ? '99+' : counts.wishlist}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-red-100/50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-pink-200/30 to-transparent animate-shimmer"></div>
                    </div>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openCart}
                  className="relative overflow-visible h-12 w-12 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-300 rounded-xl group"
                  aria-label={`Shopping cart (${counts.cart} items)`}
                  title="View your shopping cart"
                >
                  <ShoppingCart className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 z-10" />
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 z-20 text-white text-xs h-6 w-6 flex items-center justify-center p-0 rounded-full shadow-lg border-2 border-white animate-bounce">
                    {counts.cart > 99 ? '99+' : counts.cart}
                  </Badge>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-green-200/30 to-transparent animate-shimmer"></div>
                  </div>
                </Button>

                <Link href="/track-order">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-12 w-12 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-600 transition-all duration-300 rounded-xl group"
                    aria-label="Track your order"
                    title="Track your order status"
                  >
                    <MapPin className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-violet-100/50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-purple-200/30 to-transparent animate-shimmer"></div>
                    </div>
                  </Button>
                </Link>
              </div>

              {/* Enhanced Mobile Icons */}
              <div className="flex lg:hidden gap-1 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openSearch}
                  className="relative h-11 w-11 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 rounded-xl group"
                  aria-label="Search perfumes"
                >
                  <Search className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 z-10" />
                  <div className="absolute inset-0 bg-blue-50/50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlers.openCart}
                  className="relative h-11 w-11 hover:bg-green-50 hover:text-green-600 transition-all duration-300 rounded-xl groupn"
                  aria-label={`Shopping cart (${counts.cart} items)`}
                >
                  <ShoppingCart className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 z-10" />
                  <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full shadow-lg border border-white z-20">
                    {counts.cart > 99 ? '99+' : counts.cart}
                  </Badge>
                  <div className="absolute inset-0 bg-green-50/50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </Button>
              </div>
            </nav>
          </header>
        )}
      </NavbarClientWrapper>
    </>
  );
}
