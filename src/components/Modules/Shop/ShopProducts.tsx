"use client";

import { useState, useEffect, useMemo } from "react";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { useGetAllProductsQuery } from "@/redux/store/api/productApi";

interface ShopProductProps {
  category?: string;
  specification?: string;
  section?: string;
}

export function ShopProducts({ category, specification, section }: ShopProductProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const limit = 20; // Matches initial visibleProductsCount
  const [filters, setFilters] = useState({
    priceRange: [100, 5000],
    selectedCategories: category ? [category] : [],
    selectedSmells: [],
    selectedSpecification: specification || "all",
  });
  const [sortOption, setSortOption] = useState("newest");
  const [columns, setColumns] = useState(2);
  const [visibleProductsCount, setVisibleProductsCount] = useState(limit);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<IProductResponse | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Map sort options to backend sortBy values
  const sortMap: { [key: string]: string } = {
    newArrival: "newArrival",
    featured: "featured",
    onSale: "onSale",
    "a-z": "name",
    "z-a": "name_desc",
    "low-to-high": "price_asc",
    "high-to-low": "price_desc",
    "old-to-new": "oldest",
    newest: "newest",
  };

  // Fetch products with RTK Query
  const { data, error, isLoading, isFetching } = useGetAllProductsQuery({
    page,
    limit,
    category: filters.selectedCategories.join(","),
    specification: filters.selectedSpecification === "all" ? undefined : filters.selectedSpecification,
    priceMin: filters.priceRange[0],
    priceMax: filters.priceRange[1],
    smells: filters.selectedSmells.join(","),
    sortBy: sortMap[sortOption] as any,
    section,
  });
  console.log(data)

  // Update URL with page and filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (filters.selectedCategories.length)
      params.set("category", filters.selectedCategories.join(","));
    if (filters.selectedSpecification && filters.selectedSpecification !== "all")
      params.set("specification", filters.selectedSpecification);
    if (filters.selectedSmells.length) params.set("smells", filters.selectedSmells.join(","));
    if (filters.priceRange[0] !== 100) params.set("priceMin", filters.priceRange[0].toString());
    if (filters.priceRange[1] !== 5000) params.set("priceMax", filters.priceRange[1].toString());
    if (sortOption !== "newest") params.set("sortBy", sortMap[sortOption]);
    if (section) params.set("section", section);

    const url = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url, { scroll: false });
  }, [page, filters, sortOption, section, router]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        visibleProductsCount < (data?.meta.total || 0) &&
        !isFetching
      ) {
        setVisibleProductsCount((prev) => Math.min(prev + limit, data?.meta.total || prev));
        if (visibleProductsCount + limit > page * limit) {
          setPage((prev) => prev + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleProductsCount, data?.meta.total, isFetching, page, limit]);

  // Handle quick view
  const handleQuickView = (product: IProductResponse) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Handle filters
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
    setVisibleProductsCount(limit);
  };

  // Handle sort change
  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    setPage(1);
    setVisibleProductsCount(limit);
  };

  // Handle column change
  const handleColumnChange = (cols: number) => {
    setColumns(cols);
  };

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setColumns(4);
      else if (window.innerWidth >= 768) setColumns(3);
      else setColumns(2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // SEO meta tags
  const pageTitle = `Shop Perfumes - Page ${page} | KhushbuWaala`;
  const metaDescription = `Browse page ${page} of KhushbuWaala's premium perfume oils. Discover authentic fragrances with free shipping on orders over ৳1000.`;
  const canonicalUrl = `https://khushbuwaala.com/shop?page=${page}`;
  const prevUrl = page > 1 ? `https://khushbuwaala.com/shop?page=${page - 1}` : null;
  const nextUrl =
    data?.meta.totalPage && page < data.meta.totalPage
      ? `https://khushbuwaala.com/shop?page=${page + 1}`
      : null;

  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    }[columns] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content={page > 3 ? "noindex" : "index, follow"} />
        <meta name="keywords" content="perfume oil, premium fragrance, attar collection, KhushbuWaala shop, Bangladesh perfume" />
        <link rel="canonical" href={canonicalUrl} />
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: (data?.data || [])
                .slice(0, visibleProductsCount)
                .map((product, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Product",
                    name: product.name,
                    image: product.primaryImage,
                    offers: {
                      "@type": "Offer",
                      price: product.minPrice,
                      priceCurrency: "BDT",
                      availability: product.inStock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                    },
                  },
                })),
            }),
          }}
        />
      </Head>

      <section className="container mx-auto py-8 px-4 relative" aria-labelledby="shop-products-heading">
        <h2 id="shop-products-heading" className="sr-only">All Perfume Oils</h2>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600">Home</Link> &gt;{" "}
          <Link href="/shop" className="hover:text-red-600">Shop</Link> {page > 1 && `&gt; Page ${page}`}
        </nav>

        {/* Sticky Controls */}
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
            <Button
              variant="outline"
              size="icon"
              className={`sm:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
                columns === 1 ? "bg-white text-blue-600 shadow-md" : "bg-transparent"
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
                columns === 2 ? "bg-white text-blue-600 shadow-md" : "bg-transparent"
              }`}
              onClick={() => handleColumnChange(2)}
              aria-label="Show products in 2 columns"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`hidden md:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
                columns === 3 ? "bg-white text-blue-600 shadow-md" : "bg-transparent"
              }`}
              onClick={() => handleColumnChange(3)}
              aria-label="Show products in 3 columns"
            >
              <Columns3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`hidden lg:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
                columns === 4 ? "bg-white text-blue-600 shadow-md" : "bg-transparent"
              }`}
              onClick={() => handleColumnChange(4)}
              aria-label="Show products in 4 columns"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`hidden xl:flex h-8 w-8 text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-md shadow-sm ${
                columns === 5 ? "bg-white text-blue-600 shadow-md" : "bg-transparent"
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
            {data?.data.length ? (
              <div className={`grid gap-6 ${gridColsClass}`}>
                {data.data.slice(0, visibleProductsCount).map((product) => (
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Perfumes Found</h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  Try adjusting your filters or sorting options to find your perfect fragrance.
                </p>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {data?.meta.total > visibleProductsCount && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-6">
              Showing {Math.min(visibleProductsCount, data?.meta.total || 0)} of {data?.meta.total} perfumes
            </p>
            <nav aria-label="Perfume pagination">
              <div className="flex justify-center gap-2 flex-wrap">
                <Link
                  href={page > 1 ? `/shop?page=${page - 1}` : "/shop"}
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      setVisibleProductsCount(limit);
                    }
                  }}
                  aria-disabled={page === 1}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  } border border-gray-200 shadow-sm transition-all duration-300`}
                >
                  Previous
                </Link>
                {data?.meta.totalPage &&
                  Array.from({ length: data.meta.totalPage }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/shop?page=${pageNum}`}
                      onClick={() => {
                        setPage(pageNum);
                        setVisibleProductsCount(pageNum * limit);
                      }}
                      aria-label={`Go to page ${pageNum}`}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                        page === pageNum
                          ? "bg-red-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      } border border-gray-200 shadow-sm transition-all duration-300`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                <Link
                  href={
                    data?.meta.totalPage && page < data.meta.totalPage
                      ? `/shop?page=${page + 1}`
                      : "#"
                  }
                  onClick={() => {
                    if (data?.meta.totalPage && page < data.meta.totalPage) {
                      setPage(page + 1);
                      setVisibleProductsCount((prev) => prev + limit);
                    }
                  }}
                  aria-disabled={page >= (data?.meta.totalPage || 1)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                    page >= (data?.meta.totalPage || 1)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  } border border-gray-200 shadow-sm transition-all duration-300`}
                >
                  Next
                </Link>
              </div>
            </nav>
            {isFetching && (
              <p className="text-sm text-gray-600 mt-4">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Loading more perfumes...
              </p>
            )}
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
        {quickViewProduct && (
          <ProductQuickView
            product={quickViewProduct}
            open={isQuickViewOpen}
            onOpenChange={setIsQuickViewOpen}
          />
        )}
      </section>
    </>
  );
}