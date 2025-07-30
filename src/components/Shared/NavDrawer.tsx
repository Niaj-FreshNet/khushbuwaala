"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Package, Gift, Info, Heart, MapPin, ChevronRight, MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

interface NavDrawerProps {
  onMenuClick: () => void
}

interface MenuItem {
  key: string
  label: string
  href?: string
  icon?: React.ReactNode
  children?: MenuItem[]
  isSubmenu?: boolean
}

// Client Component - Only for navigation interactivity
export default function NavDrawer ({ onMenuClick }: NavDrawerProps) {
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const menuItems: MenuItem[] = [
    {
      key: "home",
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      key: "new-arrivals",
      label: "New In",
      href: "/new-arrivals",
      icon: <Package className="h-5 w-5" />,
    },
    {
      key: "shop",
      label: "All Collection",
      href: "/shop",
      icon: <Package className="h-5 w-5" />,
    },
    {
      key: "menu",
      label: "Perfume Categories",
      icon: <MenuIcon className="h-5 w-5" />,
      children: [
        {
          key: "inspired-perfume-oil",
          label: "Inspired Perfume Oils",
          href: "/inspired-perfume-oil",
        },
        {
          key: "oriental-attar",
          label: "Oriental & Arabian Attar",
          href: "/oriental-attar",
        },
        {
          key: "artificial-oud",
          label: "Artificial Oud",
          href: "/artificial-oud",
        },
        {
          key: "natural-attar",
          label: "Natural Collections",
          href: "/natural-attar",
        },
      ],
    },
    {
      key: "womens-perfume",
      label: "For Women",
      href: "/womens-perfume",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      key: "gifts-packages",
      label: "Gifts & Packages",
      href: "/gifts-and-packages",
      icon: <Gift className="h-5 w-5" />,
    },
    {
      key: "track-order",
      label: "Track Order",
      href: "/track-order",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      key: "contact",
      label: "Contact Us",
      href: "/contact",
      icon: <Info className="h-5 w-5" />,
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    onMenuClick()
  }

  const toggleSubmenu = (key: string) => {
    setOpenSubmenu(openSubmenu === key ? null : key)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <Link href="/" onClick={onMenuClick} className="flex items-center space-x-2">
          <img src="/images/khushbuwaala-logo.webp" alt="KhushbuWaala" className="h-8 w-auto" width={120} height={32} />
        </Link>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav aria-label="Mobile navigation menu">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                {item.children ? (
                  <Collapsible open={openSubmenu === item.key} onOpenChange={() => toggleSubmenu(item.key)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-12 px-4 text-left font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-expanded={openSubmenu === item.key}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openSubmenu === item.key ? "rotate-90" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.key}
                          variant="ghost"
                          className="w-full justify-start h-10 px-4 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => handleNavigation(child.href!)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                            <span>{child.label}</span>
                          </div>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 px-4 font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => handleNavigation(item.href!)}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 KhushbuWaala</p>
          <p className="text-xs mt-1">Premium Perfumes & Attars</p>
        </div>
      </div>
    </div>
  )
}
