"use client"

import type React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Home, ShoppingBag, Heart, MessageCircle, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// Client Component - Contains interactivity and browser-specific APIs
export default function BottomBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [cartCount, setCartCount] = useState(2) // Mock cart count
  const [wishlistCount, setWishlistCount] = useState(5) // Mock wishlist count
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    // This check needs to run on the client side
    setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  // Hide/show bottom bar on scroll for better UX
  useEffect(() => {
    const controlBottomBar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false)
        } else {
          // Scrolling up
          setIsVisible(true)
        }
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlBottomBar)
      return () => {
        window.removeEventListener('scroll', controlBottomBar)
      }
    }
  }, [lastScrollY])

  const handleNavigation = (path: string) => {
    // Add haptic feedback for mobile devices
    if (isMobileDevice && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    router.push(path)
  }

  const handleMessengerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Add haptic feedback
    if (isMobileDevice && 'vibrate' in navigator) {
      navigator.vibrate(100)
    }

    const messengerAppUrl = "fb-messenger://user-thread/111483794112905"
    const messengerWebUrl = "https://m.me/111483794112905"

    if (isMobileDevice) {
      // Attempt to open the Messenger app
      window.location.href = messengerAppUrl
      // Fallback for when the app is not installed or cannot be opened
      setTimeout(() => {
        window.open(messengerWebUrl, "_blank", "noopener noreferrer")
      }, 500) // Small delay before opening web fallback
    } else {
      // Open in a new tab for desktop users
      window.open(messengerWebUrl, "_blank", "noopener noreferrer")
    }
  }

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navItems = [
    {
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/",
      ariaLabel: "Go to homepage",
      showBadge: false,
    },
    {
      label: "Shop",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/shop",
      ariaLabel: "Go to shop page",
      showBadge: false,
    },
    {
      label: "Messenger",
      icon: <MessageCircle className="h-7 w-7 text-[#0078FF]" />, // Larger icon for Messenger
      onClick: handleMessengerClick,
      ariaLabel: "Chat with us on Messenger",
      showBadge: false,
      isSpecial: true, // Special styling for messenger button
    },
    {
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
      path: "/wishlist",
      ariaLabel: "View your wishlist",
      showBadge: true,
      badgeCount: wishlistCount,
    },
    {
      label: "Cart",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/cart",
      ariaLabel: "View your shopping cart",
      showBadge: true,
      badgeCount: cartCount,
    },
  ]

  return (
    <>
      {/* Backdrop blur overlay when bottom bar is visible */}
      <div 
        className={cn(
          "fixed lg:hidden bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-xl pointer-events-none z-40 transition-all duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
      
      <div
        className={cn(
          "fixed lg:hidden bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
        role="navigation"
        aria-label="Mobile bottom navigation"
      >
        {/* Enhanced glassmorphism background */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50/30 to-transparent" />
          
          <div className="relative flex justify-around items-center h-16 px-2">
            {navItems.map((item, index) => {
              const isActive = item.path ? isActiveRoute(item.path) : false
              
              return (
                <div key={item.label} className="relative flex-1 flex justify-center">
                  {item.path ? (
                    <Button
                      variant="ghost"
                      className={cn(
                        "relative flex flex-col items-center justify-center h-14 w-14 rounded-2xl transition-all duration-300 group",
                        "hover:bg-red-50/80 active:scale-95",
                        isActive 
                          ? "bg-red-50/80 text-red-600 shadow-lg shadow-red-500/20" 
                          : "text-gray-600 hover:text-red-600",
                        item.isSpecial && "bg-blue-50/80 hover:bg-blue-100/80"
                      )}
                      asChild
                      aria-label={item.ariaLabel}
                      title={item.ariaLabel}
                    >
                      <Link href={item.path} className="flex flex-col items-center justify-center relative">
                        {/* Icon with enhanced animations */}
                        <div className={cn(
                          "relative transition-all duration-300 ease-out",
                          "group-hover:scale-110 group-active:scale-95",
                          isActive && "scale-110"
                        )}>
                          {item.icon}
                          
                          {/* Badge for notifications */}
                          {item.showBadge && item.badgeCount && item.badgeCount > 0 && (
                            <Badge 
                              className={cn(
                                "absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold",
                                "bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-white",
                                "animate-pulse shadow-lg"
                              )}
                            >
                              {item.badgeCount > 99 ? '99+' : item.badgeCount}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Label with better typography */}
                        <span className={cn(
                          "text-xs mt-1 font-medium transition-all duration-300",
                          isActive && "font-semibold"
                        )}>
                          {item.label}
                        </span>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute -bottom-1 w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className={cn(
                        "relative flex flex-col items-center justify-center h-14 w-14 rounded-2xl transition-all duration-300 group",
                        "hover:bg-red-50/80 active:scale-95",
                        "text-gray-600 hover:text-red-600",
                        item.isSpecial && "bg-blue-50/80 hover:bg-blue-100/80"
                      )}
                      onClick={item.onClick}
                      aria-label={item.ariaLabel}
                      title={item.ariaLabel}
                    >
                      <div className="flex flex-col items-center justify-center relative">
                        {/* Icon with enhanced animations */}
                        <div className={cn(
                          "relative transition-all duration-300 ease-out",
                          "group-hover:scale-110 group-active:scale-95"
                        )}>
                          {item.icon}
                          
                          {/* Special messenger indicator */}
                          {item.isSpecial && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping" />
                          )}
                        </div>
                        
                        {/* Label with better typography */}
                        <span className="text-xs mt-1 font-medium transition-all duration-300">
                          {item.label}
                        </span>
                      </div>
                    </Button>
                  )}
                  
                  {/* Ripple effect on touch */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-red-400/20 rounded-2xl scale-0 group-active:scale-100 transition-transform duration-200 ease-out" />
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Bottom safe area for devices with home indicator */}
          <div className="h-2 bg-transparent" />
        </div>
      </div>

      {/* Floating Action Button for Search (optional enhancement) */}
      <div className={cn(
        "fixed lg:hidden right-4 z-40 transition-all duration-300",
        isVisible ? "bottom-20" : "bottom-4"
      )}>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20"
          onClick={() => handleNavigation('/search')}
          aria-label="Search products"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </>
  )
}
