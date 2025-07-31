"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterIcon, ListFilter, LayoutGrid, LayoutList, Loader2 } from "lucide-react"
import { FilterSheet } from "./FilterSheet"
import { SortSheet } from "./SortSheet"
import { getProducts, type Product } from "@/lib/Data/data" // Assuming getProducts can fetch all products
import { ProductCard } from "@/components/ReusableUI/ProductCard"

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
  const [columns, setColumns] = useState(2) // Default column layout for mobile
  const [visibleProductsCount, setVisibleProductsCount] = useState(20) // Initial number of products to show
  const [loadingMore, setLoadingMore] = useState(false)

  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false)
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false)

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const products = await getProducts()
        // Sort alphabetically by default initially
        const sortedAlphabetically = [...products].sort((a, b) => a.name.localeCompare(b.name))
        setAllProducts(sortedAlphabetically)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        // Handle error state, e.g., show an error message
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Apply filters and sort whenever dependencies change
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
        // Assuming products have a createdAt or similar field for date sorting
        // For now, using a simple ID comparison as a placeholder
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

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters)
    setVisibleProductsCount(20) // Reset visible products on new filter
  }

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption)
    setVisibleProductsCount(20) // Reset visible products on new sort
  }

  const handleColumnChange = (cols: number) => {
    setColumns(cols)
  }

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleProductsCount((prev) => Math.min(prev + 20, totalFilteredProducts))
      setLoadingMore(false)
    }, 1000) // Simulate loading time
  }

  // Effect to set initial columns based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        // lg breakpoint
        setColumns(4)
      } else if (window.innerWidth >= 768) {
        // md breakpoint
        setColumns(3)
      } else {
        // mobile
        setColumns(2)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    }[columns] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" // Default fallback

  return (
    <section className="container mx-auto py-8 px-4" aria-labelledby="shop-products-heading">
      <h2 id="shop-products-heading" className="sr-only">
        All Products
      </h2>

      {/* Controls: Filter, Sort, Column Layout */}
      <div className="flex justify-between items-center bg-white py-3 px-2 rounded-lg shadow-sm mb-6 border border-gray-100">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors bg-transparent"
          onClick={() => setIsFilterSheetVisible(true)}
          aria-controls="filter-sheet"
          aria-expanded={isFilterSheetVisible}
        >
          <FilterIcon className="h-4 w-4" /> Filter
        </Button>

        <div className="flex gap-2">
          {/* Column Layout Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:flex h-9 w-9 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors bg-transparent"
            onClick={() => handleColumnChange(1)}
            aria-label="Show products in 1 column"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors bg-transparent"
            onClick={() => handleColumnChange(2)}
            aria-label="Show products in 2 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex h-9 w-9 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors bg-transparent"
            onClick={() => handleColumnChange(3)}
            aria-label="Show products in 3 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden lg:flex h-9 w-9 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors bg-transparent"
            onClick={() => handleColumnChange(4)}
            aria-label="Show products in 4 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden xl:flex h-9 w-9 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors bg-transparent"
            onClick={() => handleColumnChange(5)}
            aria-label="Show products in 5 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors bg-transparent"
          onClick={() => setIsSortSheetVisible(true)}
          aria-controls="sort-sheet"
          aria-expanded={isSortSheetVisible}
        >
          <ListFilter className="h-4 w-4" /> Sort
        </Button>
      </div>

      {/* Product List */}
      {isLoading ? (
        <div className={`grid gap-4 ${gridColsClass}`}>
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="w-full h-64 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {displayedProducts.length > 0 ? (
            <div className={`grid gap-4 ${gridColsClass}`}>
              {displayedProducts.slice(0, visibleProductsCount).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow-md">
              <FilterIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-sm text-gray-600 max-w-sm">
                Try adjusting your filters or sorting options to find what you're looking for.
              </p>
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {totalFilteredProducts > visibleProductsCount && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-4">
            You've viewed {Math.min(visibleProductsCount, totalFilteredProducts)} of {totalFilteredProducts} products
          </p>
          <Button
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading More...
              </span>
            ) : (
              "Load More"
            )}
          </Button>
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
