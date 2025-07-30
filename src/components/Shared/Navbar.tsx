"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingCart, MapPin, Menu, ChevronDown } from "lucide-react"
import clsx from "clsx"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import NavDrawer from "./NavDrawer"
import SearchDrawer from "../Modules/Search/SearchDrawer"
import CartDrawer from "../Modules/Cart/CartDrawer"

// Import your context providers (you'll need to convert these to Next.js)
// import { CartContext } from "@/contexts/CartContext"
// import { WishlistContext } from "@/contexts/WishlistContext"

// SEO: Structured Data for KhushbuWaala Navigation
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
      description: "KhushbuWaala homepage with featured perfumes and collections",
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

export const Navbar = () => {
  // Context for cart and wishlist (you'll need to implement these)
  // const { cartItems } = useContext(CartContext)
  // const { wishlistItems } = useContext(WishlistContext)

  // Mock data - replace with actual context
  const cartItems = [] // Replace with actual cart items
  const wishlistItems = [] // Replace with actual wishlist items

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cartVisible, setCartVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)

  const router = useRouter()

  // SEO: Handle scroll behavior for navbar visibility
  const handleScroll = () => {
    const currentScrollTop = window.pageYOffset
    if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
    setLastScrollTop(currentScrollTop)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollTop])

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const handleAddtoCart = () => setCartVisible(true)
  const handleCloseCart = () => setCartVisible(false)
  const handleSearch = () => setSearchVisible(true)
  const handleCloseSearch = () => setSearchVisible(false)
  const redirectToWishlist = () => router.push("/wishlist")
  const redirectToTrackOrder = () => router.push("/track-order")

  // SEO: Menu items with structured data
  const menuItems = [
    {
      label: "Inspired Perfume Oil",
      href: "/inspired-perfume-oil",
      description: "High-quality inspired perfume oils with long-lasting fragrance",
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
  ]

  return (
    <>
      {/* SEO: Structured Data for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationStructuredData) }}
      />

      {/* SEO: Semantic header with glassy effect */}
      <header
        className={clsx(
          "fixed w-full z-50 transition-all duration-300 ease-in-out",
          "backdrop-blur-md bg-white/90 shadow-sm",
          "border-b border-red-600/20",
          isVisible ? "top-0" : "-top-16",
        )}
        role="banner"
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <nav
          className="mx-auto px-2 lg:px-8 h-16 flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-300"
                  aria-label="Open navigation menu"
                  onClick={toggleDrawer}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0">
                <NavDrawer onMenuClick={toggleDrawer} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - Desktop */}
          <div className="hidden lg:block">
            <Link
              href="/"
              className="transition-transform duration-200 ease-in-out hover:scale-110"
              title="KhushbuWaala - Premium Perfumes and Attars"
              aria-label="KhushbuWaala homepage"
            >
              <img
                src="/images/khushbuwaala-logo.webp"
                alt="KhushbuWaala - Premium Perfumes"
                className="h-8 w-auto"
                width={120}
                height={32}
              />
            </Link>
          </div>

          {/* Logo - Mobile (Centered) */}
          <div className="flex-1 lg:hidden flex justify-center">
            <Link
              href="/"
              className="transition-transform duration-200 ease-in-out hover:scale-110"
              title="KhushbuWaala - Premium Perfumes and Attars"
              aria-label="KhushbuWaala homepage"
            >
              <img
                src="/images/khushbuwaala-logo.webp"
                alt="KhushbuWaala - Premium Perfumes"
                className="h-8 w-auto"
                width={120}
                height={32}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex space-x-6 text-black font-semibold text-sm uppercase" role="menubar">
              <li role="none">
                <Link
                  href="/"
                  className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  role="menuitem"
                  title="KhushbuWaala homepage"
                >
                  Home
                </Link>
              </li>
              <li role="none">
                <Link
                  href="/new-arrivals"
                  className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  role="menuitem"
                  title="Latest perfume arrivals"
                >
                  New In
                </Link>
              </li>
              <li role="none">
                <Link
                  href="/shop"
                  className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  role="menuitem"
                  title="Browse all perfume collections"
                >
                  All Collection
                </Link>
              </li>
              <li role="none">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:text-red-600 transition-colors duration-300 font-semibold text-sm uppercase p-2"
                      aria-label="Perfume categories menu"
                      aria-haspopup="true"
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
              <li role="none">
                <Link
                  href="/womens-perfume"
                  className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  role="menuitem"
                  title="Exclusive perfumes for women"
                >
                  For Women
                </Link>
              </li>
              <li role="none">
                <Link
                  href="/gifts-and-packages"
                  className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  role="menuitem"
                  title="Perfect gift sets and packages"
                >
                  Gifts and Packages
                </Link>
              </li>
              <li role="none">
                <Link
                  href="/contact"
                  className="hover:text-red-600 transition-colors duration-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  role="menuitem"
                  title="Contact KhushbuWaala"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex gap-6 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              className="transition-transform duration-200 ease-in-out hover:scale-110 hover:text-red-600"
              aria-label="Search perfumes"
              title="Search our perfume collection"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={redirectToWishlist}
              className="relative transition-transform duration-200 ease-in-out hover:scale-110 hover:text-red-600"
              aria-label={`Wishlist (${wishlistItems.length} items)`}
              title="View your wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs h-4 w-4 flex items-center justify-center p-0 rounded-full">
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddtoCart}
              className="relative transition-transform duration-200 ease-in-out hover:scale-110 hover:text-red-600"
              aria-label={`Shopping cart (${cartItems.length} items)`}
              title="View your shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs h-4 w-4 flex items-center justify-center p-0 rounded-full">
                {cartItems.length}
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={redirectToTrackOrder}
              className="transition-transform duration-200 ease-in-out hover:scale-110 hover:text-red-600"
              aria-label="Track your order"
              title="Track your order status"
            >
              <MapPin className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Icons */}
          <div className="flex lg:hidden gap-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              className="transition-transform duration-200 ease-in-out hover:scale-110 hover:text-red-600"
              aria-label="Search perfumes"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddtoCart}
              className="relative transition-transform duration-200 ease-in-out hover:scale-110 hover:text-red-600"
              aria-label={`Shopping cart (${cartItems.length} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs h-4 w-4 flex items-center justify-center p-0 rounded-full">
                {cartItems.length}
              </Badge>
            </Button>
          </div>
        </nav>

        {/* Search Drawer */}
        <SearchDrawer visible={searchVisible} onClose={handleCloseSearch} />

        {/* Cart Drawer */}
        <CartDrawer visible={cartVisible} onClose={handleCloseCart} />
      </header>
    </>
  )
}
