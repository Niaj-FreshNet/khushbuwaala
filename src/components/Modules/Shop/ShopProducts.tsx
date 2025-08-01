"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  FilterIcon,
  ListFilter,
  Grid3X3,
  Grid2X2,
  LayoutGrid,
  List,
  Loader2,
  SlidersHorizontal,
  Eye,
  TrendingUp,
  Zap,
} from "lucide-react"
import { getProducts, type Product } from "@/lib/Data/data"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/ReusableUI/ProductCard"
import { FilterSheet } from "./FilterSheet"
import { SortSheet } from "./SortSheet"

interface LayoutOption {
  id: string
  label: string
  icon: React.ReactNode
  columns: number
  gridClass: string
  cardSize: "small" | "medium" | "large"
  showOn: string[]
}

export function ShopProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<any>({
    priceRange: [100, 5000],
    selectedCategories: [],
    selectedSmells: [],
    selectedSpecification: "all",
  })
  const [sortOption, setSortOption] = useState("new-to-old")
  const [currentLayout, setCurrentLayout] = useState("grid-4")
  const [visibleProductsCount, setVisibleProductsCount] = useState(20)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false)
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Enhanced layout options with better responsive design
  const layoutOptions: LayoutOption[] = [
    {
      id: "list",
      label: "List View",
      icon: <List className="h-4 w-4" />,
      columns: 1,
      gridClass: "grid-cols-1",
      cardSize: "large",
      showOn: ["sm", "md", "lg", "xl"],
    },
    {
      id: "grid-2",
      label: "2 Columns",
      icon: <Grid2X2 className="h-4 w-4" />,
      columns: 2,
      gridClass: "grid-cols-2",
      cardSize: "medium",
      showOn: ["all"],
    },
    {
      id: "grid-3",
      label: "3 Columns",
      icon: <Grid3X3 className="h-4 w-4" />,
      columns: 3,
      gridClass: "grid-cols-2 md:grid-cols-3",
      cardSize: "medium",
      showOn: ["md", "lg", "xl"],
    },
    {
      id: "grid-4",
      label: "4 Columns",
      icon: <LayoutGrid className="h-4 w-4" />,
      columns: 4,
      gridClass: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      cardSize: "small",
      showOn: ["lg", "xl"],
    },
    {
      id: "grid-5",
      label: "5 Columns",
      icon: <LayoutGrid className="h-4 w-4" />,
      columns: 5,
      gridClass: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      cardSize: "small",
      showOn: ["xl"],
    },
  ]

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const products = await getProducts()
        setAllProducts(products)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Apply filters and sorting
  const displayedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesCategory =
        filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.category)
      const matchesSmell =
        filters.selectedSmells.length === 0 ||
        (product.smell && filters.selectedSmells.some((smell: string) => product.smell.includes(smell)))
      const matchesSpecification =
        filters.selectedSpecification === "all" || product.specification === filters.selectedSpecification

      return matchesPrice && matchesCategory && matchesSmell && matchesSpecification
    })

    // Apply sorting
    switch (sortOption) {
      case "newArrival":
        filtered = filtered.filter((item) => item.section === "newArrival")
        break
      case "featured":
        filtered = filtered.filter((item) => item.section === "featured")
        break
      case "onSale":
        filtered = filtered.filter((item) => item.discount && item.discount > 0)
        break
      case "a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "low-to-high":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "high-to-low":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "old-to-new":
        filtered.sort((a, b) => a._id.localeCompare(b._id))
        break
      case "new-to-old":
        filtered.sort((a, b) => b._id.localeCompare(a._id))
        break
      default:
        break
    }
    return filtered
  }, [allProducts, filters, sortOption])

  const totalFilteredProducts = displayedProducts.length
  const currentLayoutOption = layoutOptions.find((option) => option.id === currentLayout) || layoutOptions[2]

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters)
    setVisibleProductsCount(20)
  }

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption)
    setVisibleProductsCount(20)
  }

  const handleLayoutChange = (layoutId: string) => {
    setCurrentLayout(layoutId)
    const layout = layoutOptions.find((option) => option.id === layoutId)
    setViewMode(layout?.id === "list" ? "list" : "grid")
  }

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleProductsCount((prev) => Math.min(prev + 20, totalFilteredProducts))
      setLoadingMore(false)
    }, 1000)
  }

  // Auto-adjust layout on screen size change
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768 && currentLayout === "grid-5") {
        setCurrentLayout("grid-2")
      } else if (width < 1024 && (currentLayout === "grid-4" || currentLayout === "grid-5")) {
        setCurrentLayout("grid-3")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [currentLayout])

  return (
    <section className="container mx-auto py-8 px-4" aria-labelledby="shop-products-heading">
      <h2 id="shop-products-heading" className="sr-only">
        All Products
      </h2>

      {/* Enhanced Controls Bar */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-200/20 p-4 mb-8 sticky top-20 z-40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm"
              onClick={() => setIsFilterSheetVisible(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              {(filters.selectedCategories.length > 0 || filters.selectedSmells.length > 0) && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                  {filters.selectedCategories.length + filters.selectedSmells.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm"
              onClick={() => setIsSortSheetVisible(true)}
            >
              <ListFilter className="h-4 w-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </div>

          {/* Center - Product Count */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50/80 px-3 py-2 rounded-lg backdrop-blur-sm">
            <Eye className="h-4 w-4" />
            <span className="font-medium">{totalFilteredProducts}</span>
            <span>products</span>
            {totalFilteredProducts !== allProducts.length && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                filtered
              </Badge>
            )}
          </div>

          {/* Right - Layout Controls */}
          <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl backdrop-blur-sm">
            {layoutOptions.map((option) => {
              const shouldShow =
                option.showOn.includes("all") ||
                (window.innerWidth >= 640 && option.showOn.includes("sm")) ||
                (window.innerWidth >= 768 && option.showOn.includes("md")) ||
                (window.innerWidth >= 1024 && option.showOn.includes("lg")) ||
                (window.innerWidth >= 1280 && option.showOn.includes("xl"))

              if (!shouldShow) return null

              return (
                <Button
                  key={option.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 w-9 p-0 transition-all duration-300 rounded-lg",
                    currentLayout === option.id
                      ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50",
                  )}
                  onClick={() => handleLayoutChange(option.id)}
                  title={option.label}
                >
                  {option.icon}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.selectedCategories.length > 0 || filters.selectedSmells.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200/50">
            <span className="text-xs font-medium text-gray-500">Active filters:</span>
            {filters.selectedCategories.map((category: string) => (
              <Badge key={category} variant="secondary" className="bg-red-50 text-red-700 text-xs">
                {category}
              </Badge>
            ))}
            {filters.selectedSmells.map((smell: string) => (
              <Badge key={smell} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                {smell}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Product Grid */}
      {isLoading ? (
        <div className={`grid gap-6 ${currentLayoutOption.gridClass} transition-all duration-500`}>
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="group">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                <Skeleton className="w-full h-64 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {displayedProducts.length > 0 ? (
            <div
              className={cn(
                "grid gap-6 transition-all duration-500",
                currentLayoutOption.gridClass,
                viewMode === "list" && "grid-cols-1",
              )}
            >
              {displayedProducts.slice(0, visibleProductsCount).map((product, index) => (
                <div
                  key={product._id}
                  className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    product={product}
                    className={cn(
                      "h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                      viewMode === "list" && "flex flex-row items-center max-w-none",
                    )}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6">
                <FilterIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
              <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
                We couldn't find any products matching your current filters. Try adjusting your search criteria or
                browse our full collection.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    priceRange: [100, 5000],
                    selectedCategories: [],
                    selectedSmells: [],
                    selectedSpecification: "all",
                  })
                  setSortOption("new-to-old")
                }}
                className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 rounded-xl px-6 py-3"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </>
      )}

      {/* Enhanced Load More Section */}
      {totalFilteredProducts > visibleProductsCount && (
        <div className="text-center mt-12 space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">
                Showing {Math.min(visibleProductsCount, totalFilteredProducts)} of {totalFilteredProducts} products
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(visibleProductsCount / totalFilteredProducts) * 100}%` }}
              />
            </div>
            <Button
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading more amazing products...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  Load More Products
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Filter and Sort Sheets */}
      <FilterSheet
        visible={isFilterSheetVisible}
        onClose={setIsFilterSheetVisible}
        onApplyFilters={handleApplyFilters}
      />
      <SortSheet visible={isSortSheetVisible} onClose={setIsSortSheetVisible} onSortChange={handleSortChange} />
    </section>
  )
}
