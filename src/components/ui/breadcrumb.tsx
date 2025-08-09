import React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.href ? `https://khushbuwaala.com${item.href}` : undefined
    }))
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb navigation" 
        className={cn("flex items-center space-x-1 text-sm", className)}
      >
        <ol className="flex items-center space-x-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" 
                  aria-hidden="true" 
                />
              )}
              
              {index === 0 ? (
                // Home icon for first item
                <Link
                  href={item.href || "/"}
                  className="text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center gap-1 group"
                  aria-label="Go to homepage"
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              ) : item.current ? (
                // Current page (no link)
                <span 
                  className="font-medium text-gray-900 line-clamp-1 max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                // Intermediate pages (with links)
                <Link
                  href={item.href || "#"}
                  className="text-gray-500 hover:text-red-600 transition-colors duration-200 hover:underline underline-offset-2 line-clamp-1 max-w-[150px] sm:max-w-none"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// Utility function to generate category breadcrumbs
export function generateCategoryBreadcrumbs(category: string, productName?: string): BreadcrumbItem[] {
  const categoryMap: { [key: string]: { name: string; href: string } } = {
    inspiredPerfumeOil: { name: "Inspired Perfume Oils", href: "/inspired-perfume-oils" },
    oriental: { name: "Oriental Collection", href: "/oriental-collection" },
    artificialOud: { name: "Artificial Oud", href: "/artificial-oud" },
    natural: { name: "Natural Collection", href: "/natural-collection" },
    forWomen: { name: "For Women", href: "/for-women" },
    gifts: { name: "Gifts & Packages", href: "/gifts-and-packages" },
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" }
  ]

  // Add category if it exists in the map
  if (categoryMap[category]) {
    breadcrumbs.push(categoryMap[category])
  }

  // Add current product if provided
  if (productName) {
    breadcrumbs.push({ name: productName, current: true })
  }

  return breadcrumbs
}