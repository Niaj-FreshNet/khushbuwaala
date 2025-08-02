"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FilterIcon,
  ListFilter,
  LayoutGrid,
  LayoutList,
  Loader2,
} from "lucide-react";
import { getProducts, type Product } from "@/lib/Data/data";
import { FilterSheet } from "./FilterSheet";
import { SortSheet } from "./SortSheet";
import { ProductCard } from "@/components/ReusableUI/ProductCard";

interface ShopProductProps {
  category?: string;
}

export function ShopProducts({ category }: ShopProductProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({
    priceRange: [100, 5000],
    selectedCategories: [],
    selectedSmells: [],
    selectedSpecification: "all",
  });
  const [sortOption, setSortOption] = useState("new-to-old");
  const [columns, setColumns] = useState(2); // Default column layout for mobile
  const [visibleProductsCount, setVisibleProductsCount] = useState(20); // Initial number of products to show
  const [loadingMore, setLoadingMore] = useState(false);

  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getProducts();
        // Sort alphabetically by default initially
        const sortedAlphabetically = [...products].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setAllProducts(sortedAlphabetically);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Handle error state, e.g., show an error message
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters and sort whenever dependencies change
  const displayedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      // If category prop is provided, enforce it
      const matchesCategoryProp = category
        ? product.category === category
        : true;

      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];

      const matchesCategoryFilter =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(product.category);

      const matchesSmell =
        filters.selectedSmells.length === 0 ||
        (product.smell &&
          filters.selectedSmells.every((smell: string) =>
            product.smell.includes(smell)
          ));

      const matchesSpecification =
        filters.selectedSpecification === "all" ||
        product.specification === filters.selectedSpecification;

      return (
        matchesCategoryProp &&
        matchesPrice &&
        matchesCategoryFilter &&
        matchesSmell &&
        matchesSpecification
      );
    });

    // Apply sorting
    switch (sortOption) {
      case "newArrival":
        filtered = filtered.filter((item) => item.section === "newArrival");
        break;
      case "featured":
        filtered = filtered.filter((item) => item.section === "featured");
        break;
      case "onSale":
        filtered = filtered.filter(
          (item) => item.discount && item.discount > 0
        );
        break;
      case "a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-to-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "old-to-new":
        // Assuming products have a createdAt or similar field for date sorting
        // For now, using a simple ID comparison as a placeholder
        filtered.sort((a, b) => a._id.localeCompare(b._id));
        break;
      case "new-to-old":
        filtered.sort((a, b) => b._id.localeCompare(a._id));
        break;
      default:
        break;
    }
    return filtered;
  }, [category, allProducts, filters, sortOption]);

  const totalFilteredProducts = displayedProducts.length;

  const handleApplyFilters = (newFilters: any) => {
    setIsLoading(true);
    setFilters(newFilters);
    setVisibleProductsCount(20); // Reset visible products on new filter

  setTimeout(() => {
    setIsLoading(false);
  }, 300);
  };

  const handleSortChange = (newSortOption: string) => {
    setIsLoading(true);
    setSortOption(newSortOption);
    setVisibleProductsCount(20); // Reset visible products on new sort

  setTimeout(() => {
    setIsLoading(false);
  }, 300);
  };

  const handleColumnChange = (cols: number) => {
    setColumns(cols);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleProductsCount((prev) =>
        Math.min(prev + 20, totalFilteredProducts)
      );
      setLoadingMore(false);
    }, 1000); // Simulate loading time
  };

  // Effect to set initial columns based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        // lg breakpoint
        setColumns(4);
      } else if (window.innerWidth >= 768) {
        // md breakpoint
        setColumns(3);
      } else {
        // mobile
        setColumns(2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    }[columns] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"; // Default fallback

  return (
    <section
      className="container mx-auto py-8 px-4 relative"
      aria-labelledby="shop-products-heading"
    >
      <h2 id="shop-products-heading" className="sr-only">
        All Products
      </h2>

      {/* Enhanced Sticky Controls: Filter, Sort, Column Layout */}
      <div className="sticky top-0 z-40 flex justify-between items-center bg-white/95 backdrop-blur-xl py-4 px-4 rounded-b-xl shadow-lg mb-8 border border-gray-200/50 transition-all duration-300">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 bg-transparent rounded-lg px-4 py-2 shadow-sm hover:shadow-md"
          onClick={() => setIsFilterSheetVisible(true)}
          aria-controls="filter-sheet"
          aria-expanded={isFilterSheetVisible}
        >
          <FilterIcon className="h-4 w-4" /> Filter
        </Button>

        <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
          {/* Column Layout Buttons */}
          <Button
            variant="outline"
            size="icon"
            className={`sm:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
              columns === 1
                ? "bg-white text-blue-600 shadow-md"
                : "bg-transparent"
            }`}
            onClick={() => handleColumnChange(1)}
            aria-label="Show products in 1 column"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
              columns === 2
                ? "bg-white text-blue-600 shadow-md"
                : "bg-transparent"
            }`}
            onClick={() => handleColumnChange(2)}
            aria-label="Show products in 2 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`hidden md:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
              columns === 3
                ? "bg-white text-blue-600 shadow-md"
                : "bg-transparent"
            }`}
            onClick={() => handleColumnChange(3)}
            aria-label="Show products in 3 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`hidden lg:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
              columns === 4
                ? "bg-white text-blue-600 shadow-md"
                : "bg-transparent"
            }`}
            onClick={() => handleColumnChange(4)}
            aria-label="Show products in 4 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`hidden xl:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
              columns === 5
                ? "bg-white text-blue-600 shadow-md"
                : "bg-transparent"
            }`}
            onClick={() => handleColumnChange(5)}
            aria-label="Show products in 5 columns"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 bg-transparent rounded-lg px-4 py-2 shadow-sm hover:shadow-md"
          onClick={() => setIsSortSheetVisible(true)}
          aria-controls="sort-sheet"
          aria-expanded={isSortSheetVisible}
        >
          <ListFilter className="h-4 w-4" /> Sort
        </Button>
      </div>

      {/* Product List */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
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
            <div className={`grid gap-6 ${gridColsClass}`}>
              {displayedProducts
                .slice(0, visibleProductsCount)
                .map((product) => (
                  <ProductCard
                    className="py-0"
                    key={product._id}
                    product={product}
                    layout={columns === 1 ? "list" : "grid"}
                    showDescription={columns === 1}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
              <FilterIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-600 max-w-sm">
                Try adjusting your filters or sorting options to find what
                you're looking for.
              </p>
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {totalFilteredProducts > visibleProductsCount && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-6">
            You've viewed{" "}
            {Math.min(visibleProductsCount, totalFilteredProducts)} of{" "}
            {totalFilteredProducts} products
          </p>
          <Button
            className="px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
        initialFilters={{ category }}
      />
      <SortSheet
        visible={isSortSheetVisible}
        onClose={setIsSortSheetVisible}
        onSortChange={handleSortChange}
      />
    </section>
  );
}
