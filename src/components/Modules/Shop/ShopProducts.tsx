"use client";

import { useState, useEffect, useRef } from "react";
import { useGetAllProductsQuery } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FilterIcon,
  ListFilter,
  LayoutGrid,
  LayoutList,
  Loader2,
  Grid2X2,
  Columns3,
  Grid3X3,
} from "lucide-react";
import { FilterSheet } from "./FilterSheet";
import { SortSheet } from "./SortSheet";
import { ProductCard } from "@/components/ReusableUI/ProductCard";
import { ProductQuickView } from "@/components/ReusableUI/ProductQuickView";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { fi } from "zod/v4/locales";

interface ShopProductProps {
  // initialProducts: IProductResponse[];
  initialPage: number;
  // totalPages: number;
  category?: string;
  specification?: string;
  section?: string;
  minPrice?: number;
  maxPrice?: number;
  accords?: string;
  perfumeNotes?: string;
  performance?: string;
  sortBy?: string;
}

type Filters = {
  priceRange: [number, number];
  selectedCategories: string[];
  selectedAccords: string[];
  selectedPerfumeNotes: string[];
  selectedPerformance: string[];
  selectedSpecification: string; // "all" | "male" | "female"
};

const normalizeFilters = (f: Partial<Filters> | undefined, fallback: Filters): Filters => ({
  priceRange: (f?.priceRange ?? fallback.priceRange) as [number, number],
  selectedCategories: Array.isArray(f?.selectedCategories) ? f!.selectedCategories : fallback.selectedCategories,
  selectedAccords: Array.isArray(f?.selectedAccords) ? f!.selectedAccords : fallback.selectedAccords,
  selectedPerfumeNotes: Array.isArray(f?.selectedPerfumeNotes) ? f!.selectedPerfumeNotes : fallback.selectedPerfumeNotes,
  selectedPerformance: Array.isArray(f?.selectedPerformance) ? f!.selectedPerformance : fallback.selectedPerformance,
  selectedSpecification: typeof f?.selectedSpecification === "string" ? f!.selectedSpecification : fallback.selectedSpecification,
});

export function ShopProducts(props: ShopProductProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // const [page, setPage] = useState(initialPage);
  const [page, setPage] = useState(props.initialPage);

  const productsTopRef = useRef<HTMLDivElement | null>(null);
  const prevKeyRef = useRef<string>("");

  const [pageTransitionLoading, setPageTransitionLoading] = useState(false);

  const routeKey = `${pathname}?${searchParams.toString()}`;

  const scrollToProductsTop = () => {
    if (!productsTopRef.current) return;

    const y =
      productsTopRef.current.getBoundingClientRect().top +
      window.scrollY -
      210; // 👈 this is the offset from top (adjust 80–160 as you like)

    window.scrollTo({ top: y, behavior: "auto" });
  };

  const limit = 20;

  const initialFilters: Filters = {
    priceRange: [props.minPrice || 100, props.maxPrice || 5000],
    selectedCategories: props.category ? [props.category] : [],
    selectedAccords: props.accords ? props.accords.split(",") : [],
    selectedPerfumeNotes: props.perfumeNotes ? props.perfumeNotes.split(",") : [],
    selectedPerformance: props.performance ? props.performance.split(",") : [],
    selectedSpecification: props.specification || "all",
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);

  const [sortOption, setSortOption] = useState(props.sortBy || "new-to-old");
  const [columns, setColumns] = useState(2);
  const [visibleProductsCount, setVisibleProductsCount] = useState(limit);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<IProductResponse | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  type SortBy = "name" | "price_asc" | "price_desc" | "newest" | "oldest" | "popularity";

  const sortMap: Record<string, SortBy> = {
    newArrival: "newest",
    featured: "popularity",
    onSale: "price_asc",
    "a-z": "name",
    "z-a": "name",         // or add name_desc to backend union if you need
    "low-to-high": "price_asc",
    "high-to-low": "price_desc",
    "old-to-new": "oldest",
    "new-to-old": "newest",
  };

  const genderMap: Record<string, string | undefined> = {
    all: undefined,
    male: "MALE",
    female: "FEMALE",
  };

  // useEffect(() => {
  //   // Read URL params whenever they change
  //   const params = new URLSearchParams(searchParams.toString());

  //   const urlFilters = {
  //     selectedCategories: params.get("category")?.split(",") || [],
  //     selectedSpecification: params.get("specification") || "all",
  //     selectedSmells: params.get("smells")?.split(",") || [],
  //     priceRange: [
  //       Number(params.get("minPrice") || 100),
  //       Number(params.get("maxPrice") || 5000),
  //     ],
  //   };

  //   setFilters(urlFilters);
  //   setPage(Number(params.get("page") || 1));
  // }, [searchParams]);

  // const { data, error, isLoading, isFetching } = useGetAllProductsQuery(
  //   {
  //     page,
  //     limit,
  //     category: filters.selectedCategories.join(","),
  //     specification: filters.selectedSpecification === "all" ? undefined : filters.selectedSpecification,
  //     minPrice: filters.priceRange[0],
  //     maxPrice: filters.priceRange[1],
  //     smells: filters.selectedSmells.join(","),
  //     sortBy: sortMap[sortOption] as ProductQueryParams["sortBy"],
  //     section,
  //   },
  //   { skip: page === initialPage } // Skip initial fetch to use server data
  // );
  // ✅ Fetch products using updated filters and sortOption
  const { data, isLoading, isFetching, error } = useGetAllProductsQuery({
    page,
    limit,
    category: filters.selectedCategories.join(",") || undefined,
    gender: filters.selectedSpecification === "all"
      ? undefined
      : filters.selectedSpecification.toUpperCase(), // "MALE" | "FEMALE"
    section: props.section,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    accords: filters.selectedAccords.join(",") || undefined,
    perfumeNotes: filters.selectedPerfumeNotes.join(",") || undefined,
    performance: filters.selectedPerformance.join(",") || undefined,
    sortBy: sortMap[sortOption] as any,
  });

  // ✅ show loading + scroll to products top whenever URL changes
  useEffect(() => {
    if (prevKeyRef.current === routeKey) return;
    prevKeyRef.current = routeKey;

    setPageTransitionLoading(true);

    requestAnimationFrame(() => {
      scrollToProductsTop();
    });
  }, [routeKey]);

  // ✅ stop loading when new data finished fetching
  useEffect(() => {
    if (!isFetching && !isLoading) {
      setPageTransitionLoading(false);
    }
  }, [isFetching, isLoading]);

  const shouldShowLoading = isLoading || isFetching || pageTransitionLoading;

  // const products =
  //   page === initialPage && !isFetching
  //     ? initialProducts
  //     : data?.data || [];
  const products = data?.data || [];

  const totalPages = data?.meta.totalPage || 1;
  const totalFilteredProducts = data?.meta.total ?? totalPages * limit;

  // Update URL with page and filters
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   if (page > 1) params.set("page", page.toString());
  //   // if (filters.selectedCategories.length) params.set("category", filters.selectedCategories.join(","));
  //   if (filters.selectedSpecification && filters.selectedSpecification !== "all")
  //     params.set("specification", filters.selectedSpecification);
  //   if (filters.selectedSmells.length) params.set("smells", filters.selectedSmells.join(","));
  //   if (filters.priceRange[0] !== 100) params.set("minPrice", filters.priceRange[0].toString());
  //   if (filters.priceRange[1] !== 5000) params.set("maxPrice", filters.priceRange[1].toString());
  //   if (sortOption !== "new-to-old") params.set("sortBy", sortOption);
  //   // if (section) params.set("section", section);

  //   // ✅ Keep SEO-friendly path for "new-arrivals"
  //   // const basePath = pathname === "/new-arrivals" ? "/new-arrivals" : "/shop";

  //   // Only set section param if not already on new-arrivals page
  //   // if (section && pathname !== "/new-arrivals") {
  //   //   params.set("section", section);
  //   // } else {
  //   //   params.delete("section");
  //   // }

  //   // Use pathname as base, but remove category if it matches the page's category
  //   const basePath = pathname;
  //   if (category) {
  //     // Remove category from params if it's already implied by the page
  //     params.delete("category");
  //   }
  //   if (category) {
  //     params.delete("section");
  //   }

  //   const url = `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;

  //   // const url = `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;

  //   // const url = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
  //   router.push(url, { scroll: false });
  // }, [page, filters, sortOption, section, router, searchParams, pathname, category, section]);

  // ✅ Update URL when filters, sorting, or page changes
  // useEffect(() => {
  //   const params = new URLSearchParams();

  //   if (page > 1) params.set("page", page.toString());
  //   if (filters.selectedCategories.length)
  //     params.set("category", filters.selectedCategories.join(","));
  //   if (filters.selectedSpecification !== "all")
  //     params.set("specification", filters.selectedSpecification);
  //   if (filters.selectedSmells.length)
  //     params.set("smells", filters.selectedSmells.join(","));
  //   if (filters.priceRange[0] !== 100)
  //     params.set("minPrice", filters.priceRange[0].toString());
  //   if (filters.priceRange[1] !== 5000)
  //     params.set("maxPrice", filters.priceRange[1].toString());
  //   if (sortOption !== "new-to-old")
  //     params.set("sortBy", sortOption);
  //   if (props.section) params.set("section", props.section);

  //   const url = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  //   router.replace(url, { scroll: false });
  // }, [page, filters, sortOption, props.section, pathname, router]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString()); // keep existing

    // then set/delete what you control
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    if (filters.selectedCategories.length) params.set("category", filters.selectedCategories.join(","));
    else params.delete("category");
    if (filters.selectedSpecification !== "all") params.set("gendeer", filters.selectedSpecification);
    if (filters.selectedAccords.length) params.set("accords", filters.selectedAccords.join(","));
    else params.delete("accords");
    if (filters.selectedPerfumeNotes.length) params.set("perfumeNotes", filters.selectedPerfumeNotes.join(","));
    else params.delete("perfumeNotes");
    if (filters.selectedPerformance.length) params.set("performance", filters.selectedPerformance.join(","));
    else params.delete("performance");
    if (filters.priceRange[0] !== 100) params.set("minPrice", filters.priceRange[0].toString());
    else params.delete("minPrice");
    if (filters.priceRange[1] !== 5000) params.set("maxPrice", filters.priceRange[1].toString());
    else params.delete("maxPrice");
    if (sortOption !== "new-to-old") params.set("sortBy", sortOption);
    else params.delete("sortBy");
    if (props.section) params.set("section", props.section);
    else params.delete("section");

    const nextUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (nextUrl !== currentUrl) router.replace(nextUrl, { scroll: false });
  }, [page, filters, sortOption, props.section, pathname, router, searchParams]);


  // Infinite scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
  //       visibleProductsCount < totalFilteredProducts &&
  //       !isFetching
  //     ) {
  //       setVisibleProductsCount((prev) => Math.min(prev + limit, totalFilteredProducts));
  //       if (visibleProductsCount + limit > page * limit) {
  //         setPage((prev) => prev + 1);
  //       }
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [visibleProductsCount, totalFilteredProducts, isFetching, page, limit]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const reachedBottom =
  //       window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  //     if (!reachedBottom) return;
  //     if (isFetching) return;

  //     const nextPage = page + 1;
  //     if (nextPage <= totalPages) {
  //       setPage(nextPage);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [page, totalPages, isFetching]);

  const handleQuickView = (product: IProductResponse) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const handleApplyFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => normalizeFilters(newFilters, prev));
    setPage(1);
    setVisibleProductsCount(limit);
  };

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    setPage(1);
    setVisibleProductsCount(limit);
  };

  const handleColumnChange = (cols: number) => {
    setColumns(cols);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setVisibleProductsCount((prev) =>
      Math.min(prev + 20, totalFilteredProducts)
    );
    setLoadingMore(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setColumns(4);
      } else if (window.innerWidth >= 768) {
        setColumns(3);
      } else {
        setColumns(2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // console.log("products", products);

  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    }[columns] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <section
      className="container mx-auto py-8 px-4 relative"
      aria-labelledby="shop-products-heading"
    >
      {/* Hidden crawlable pagination links for SEO */}
      {page > 1 && (
        <link
          rel="prev"
          href={`/shop?page=${page - 1}`}
        />
      )}
      {page < totalPages && (
        <link
          rel="next"
          href={`/shop?page=${page + 1}`}
        />
      )}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Premium Perfume Oil Collection",
            description: "Explore KhushbuWaala's curated collection of world-class perfume oils and fragrances",
            url: `https://khushbuwaala.com/shop${page > 1 ? `?page=${page}` : ""}`,
            mainEntity: {
              "@type": "ItemList",
              name: "Perfume Oil Products",
              description: "Premium quality perfume oils and fragrances",
              itemListElement: products.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1 + (page - 1) * limit, // paginate properly
                url: `https://khushbuwaala.com/product/${product.slug}`,
                name: product.name,
              })),
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://khushbuwaala.com" },
                { "@type": "ListItem", position: 2, name: "Shop", item: "https://khushbuwaala.com/shop" },
              ],
            },
          }),
        }}
      />

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
            className={`sm:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${columns === 1
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
            className={`h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${columns === 2
              ? "bg-white text-blue-600 shadow-md"
              : "bg-transparent"
              }`}
            onClick={() => handleColumnChange(2)}
            aria-label="Show products in 2 columns"
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`hidden md:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${columns === 3
              ? "bg-white text-blue-600 shadow-md"
              : "bg-transparent"
              }`}
            onClick={() => handleColumnChange(3)}
            aria-label="Show products in 3 columns"
          >
            <Columns3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`hidden lg:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${columns === 4
              ? "bg-white text-blue-600 shadow-md"
              : "bg-transparent"
              }`}
            onClick={() => handleColumnChange(4)}
            aria-label="Show products in 4 columns"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`hidden xl:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${columns === 5
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
      <div ref={productsTopRef} />

      {shouldShowLoading ? (
        <div className={`grid gap-6 ${gridColsClass}`}>
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
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Perfumes</h3>
          <p className="text-sm text-gray-600 max-w-sm">
            Failed to fetch products. Please try again later.
          </p>
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className={`grid gap-4 ${gridColsClass}`}>
              {products
                .slice(0, visibleProductsCount)
                .map((product) => (
                  <ProductCard
                    className="py-0"
                    key={product.id}
                    product={product}
                    layout={columns === 1 ? "list" : "grid"}
                    showDescription={columns === 1}
                    onQuickView={() => handleQuickView(product)}
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
                you&apos;re looking for.
              </p>
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {/* {totalFilteredProducts > visibleProductsCount && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-6">
            You&apos;ve viewed{" "}
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
      )} */}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">

        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg"
        >
          Previous
        </Button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded-lg ${page === pageNum
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg"
        >
          Next
        </Button>
      </div>

      {/* Filter and Sort Sheets */}
      <FilterSheet
        visible={isFilterSheetVisible}
        onClose={setIsFilterSheetVisible}
        onApplyFilters={handleApplyFilters}
        initialFilters={{ category: props.category }}
      />
      <SortSheet
        visible={isSortSheetVisible}
        onClose={setIsSortSheetVisible}
        onSortChange={handleSortChange}
      />
      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
      )}
    </section>
  );
}