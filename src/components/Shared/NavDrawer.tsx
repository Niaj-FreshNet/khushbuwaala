"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Package, Gift, Info, Heart, MapPin, ChevronRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

interface MenuItem {
  key: string
  label: string
  href?: string
  icon?: React.ReactNode
  children?: MenuItem[]
  badge?: string
  description?: string
}

export default function NavDrawer({ open, onClose }: NavDrawerProps) {
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const menuItems: MenuItem[] = [
    {
      key: "home",
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      description: "Discover premium fragrances",
    },
    {
      key: "new-arrivals",
      label: "New Arrivals",
      href: "/new-arrivals",
      icon: <Sparkles className="h-5 w-5" />,
      badge: "New",
      description: "Latest perfume collections",
    },
    {
      key: "shop",
      label: "All Collection",
      href: "/shop",
      icon: <Package className="h-5 w-5" />,
      description: "Browse complete catalog",
    },
    {
      key: "categories",
      label: "Categories",
      icon: <Star className="h-5 w-5" />,
      children: [
        {
          key: "inspired-perfume-oil",
          label: "Inspired Perfume Oils",
          href: "/inspired-perfume-oil",
          description: "Designer-inspired fragrances",
        },
        {
          key: "oriental-attar",
          label: "Oriental & Arabian Attar",
          href: "/oriental-attar",
          description: "Traditional Middle Eastern scents",
        },
        {
          key: "artificial-oud",
          label: "Artificial Oud",
          href: "/artificial-oud",
          description: "Premium oud alternatives",
        },
        {
          key: "natural-attar",
          label: "Natural Collections",
          href: "/natural-attar",
          description: "Pure natural fragrances",
        },
      ],
    },
    {
      key: "womens-perfume",
      label: "For Women",
      href: "/womens-perfume",
      icon: <Heart className="h-5 w-5" />,
      description: "Feminine fragrances",
    },
    {
      key: "gifts-packages",
      label: "Gifts & Packages",
      href: "/gifts-and-packages",
      icon: <Gift className="h-5 w-5" />,
      badge: "Popular",
      description: "Perfect gift sets",
    },
    {
      key: "track-order",
      label: "Track Order",
      href: "/track-order",
      icon: <MapPin className="h-5 w-5" />,
      description: "Monitor your delivery",
    },
    {
      key: "contact",
      label: "Contact Us",
      href: "/contact",
      icon: <Info className="h-5 w-5" />,
      description: "Get in touch",
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  const toggleSubmenu = (key: string) => {
    setOpenSubmenu(openSubmenu === key ? null : key)
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-white to-gray-50">
        {/* Header with enhanced branding */}
        <div className="p-6 border-b bg-gradient-to-r from-red-50 to-red-100">
          <Link href="/" onClick={onClose} className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/images/khushbuwaala.webp"
                alt="KhushbuWaala"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
                width={140}
                height={40}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">KhushbuWaala</span>
              <span className="text-xs text-gray-600">Premium Fragrances</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu with enhanced styling */}
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
                          className="w-full justify-between h-14 px-4 text-left font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 rounded-xl group"
                          aria-expanded={openSubmenu === item.key}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-300">
                              {item.icon}
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-semibold">{item.label}</span>
                              {item.description && (
                                <span className="text-xs text-gray-500 group-hover:text-red-500">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight
                              className={`h-4 w-4 transition-transform duration-300 ${
                                openSubmenu === item.key ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 ml-6 space-y-1">
                        {item.children.map((child) => (
                          <Button
                            key={child.key}
                            variant="ghost"
                            className="w-full justify-start h-12 px-4 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 rounded-lg group"
                            onClick={() => handleNavigation(child.href!)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-red-400 rounded-full group-hover:bg-red-600 transition-colors duration-300" />
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{child.label}</span>
                                {child.description && (
                                  <span className="text-xs text-gray-400 group-hover:text-red-400">
                                    {child.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-14 px-4 font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 rounded-xl group"
                      onClick={() => handleNavigation(item.href!)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-300">
                          {item.icon}
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <span className="text-xs text-gray-500 group-hover:text-red-500">{item.description}</span>
                          )}
                        </div>
                      </div>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        {/* Enhanced Footer */}
        <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Always Available</span>
            </div>
            <p className="text-xs text-gray-500">© 2024 KhushbuWaala</p>
            <p className="text-xs text-gray-400 mt-1">Premium Perfumes & Attars</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
