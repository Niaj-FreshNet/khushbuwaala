"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ShoppingBag, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// Client Component - Contains interactivity and browser-specific APIs
export default function BottomBar () {
  const router = useRouter()
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    // This check needs to run on the client side
    setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleMessengerClick = (e: React.MouseEvent) => {
    e.preventDefault()
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

  const navItems = [
    {
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/",
      ariaLabel: "Go to homepage",
    },
    {
      label: "Shop",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/shop",
      ariaLabel: "Go to shop page",
    },
    {
      label: "Messenger",
      icon: <MessageCircle className="h-8 w-8 text-[#0078FF]" />, // Larger icon for Messenger
      onClick: handleMessengerClick,
      ariaLabel: "Chat with us on Messenger",
    },
    {
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
      path: "/wishlist",
      ariaLabel: "View your wishlist",
    },
    {
      label: "Cart",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/cart",
      ariaLabel: "View your shopping cart",
    },
    // {
    //   label: "Account",
    //   icon: <User className="h-5 w-5" />,
    //   path: "/user",
    //   ariaLabel: "Go to your account page",
    // },
  ]

  return (
    <div
      className="fixed lg:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="flex flex-col items-center justify-center h-full w-full text-gray-600 hover:text-red-600 transition-colors duration-200 group"
            onClick={item.onClick ? item.onClick : () => handleNavigation(item.path!)}
            asChild={!item.onClick} // Use asChild only if it's a Link
            aria-label={item.ariaLabel}
            title={item.ariaLabel}
          >
            {item.path ? (
              <Link href={item.path} className="flex flex-col items-center justify-center">
                <span className="transition-transform duration-200 ease-in-out group-hover:scale-120">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ) : (
              <>
                <span className="transition-transform duration-200 ease-in-out group-hover:scale-120">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
