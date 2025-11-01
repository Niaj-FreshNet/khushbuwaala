"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  TagIcon,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSearchProductsQuery } from "@/redux/store/api/product/productApi";
import Link from "next/link";

interface SearchDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const trendingSearches = ["Dior Sauvage", "Oud", "Rose", "Vanilla"];
const recentSearches = ["Axe Signature", "Prada Candy"];

const smellTypes = [
  "Corporate",
  "Citrusy",
  "Manly",
  "Earthy",
  "Leathery",
  "Soapy",
  "Refreshing",
  "Fruity",
  "Sweet",
  "Chocolate",
  "Vanilla",
  "Candy",
  "Floral",
  "Powdery",
  "Bergamote",
  "Lavender",
  "Vetiver",
  "Woody",
  "Spicy",
  "Smooky",
  "Strong",
  "Amber",
  "Musky",
  "Nostalgic",
  "Projective",
  "Longetive",
  "Synthetic",
  "Organic",
];

export default function SearchDrawer({ visible, onClose }: SearchDrawerProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [showMoreTrending, setShowMoreTrending] = useState(false);
  const [showMoreRecent, setShowMoreRecent] = useState(false);
  const [showMoreRefine, setShowMoreRefine] = useState(false);


  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  // Focus input when drawer opens
  useEffect(() => {
    if (visible && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  }, [visible]);

  // Fetch search results from backend
  const { data, isFetching, isError } = useSearchProductsQuery(
    {
      searchTerm: debouncedSearch,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      limit: 30,
      page: 1,
    },
    { skip: !debouncedSearch }
  );

  const products = data?.data || [];

  const handleTagClick = (tag: string) => {
    setSearchValue(tag);
    setSearchPerformed(true);
  };

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[320px] md:w-[550px] flex flex-col p-0 bg-gradient-to-b from-white to-gray-50 h-full"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-full">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex flex-col items-start">
              <span>Search Products</span>
              <span className="text-sm font-normal text-gray-600">
                Find your perfect fragrance
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Search Controls */}
          <div className="px-6 py-2 space-y-4 border-b">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for perfumes, brands, or scents..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setDebouncedSearch(searchValue)}
                className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base transition-all duration-300 bg-white shadow-sm focus:shadow-md"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                  onClick={() => setSearchValue("")}
                  aria-label="Clear search input"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl bg-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="inspiredPerfumeOil">Inspired Perfume Oil</SelectItem>
                <SelectItem value="oriental">Oriental & Arabian</SelectItem>
                <SelectItem value="artificialOud">Artificial Oud</SelectItem>
                <SelectItem value="natural">Natural Collections</SelectItem>
              </SelectContent>
            </Select>

            {/* Trending & Recent Searches */}
            {debouncedSearch === "" && (
              <div className="space-y-3">
                {/* Trending Searches */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Trending:
                </div>
                <div className="flex flex-wrap gap-2 pb-1">
                  {(showMoreTrending ? trendingSearches : trendingSearches.slice(0, 4)).map((search) => (
                    <Badge
                      key={search}
                      variant="secondary"
                      className="cursor-pointer whitespace-nowrap text-xs py-1 px-2 bg-white text-black border border-gray-200 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                      onClick={() => handleTagClick(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                  {trendingSearches.length > 4 && (
                    <Badge
                      className="cursor-pointer whitespace-nowrap text-xs py-1 px-2 bg-white text-black border border-gray-200 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                      onClick={() => setShowMoreTrending(!showMoreTrending)}
                    >
                      {showMoreTrending ? "See less" : "See more..."}
                    </Badge>
                  )}
                </div>

                {/* Recent Searches */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5 mt-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Recent:
                </div>
                <div className="flex flex-wrap gap-2 pb-1">
                  {(showMoreRecent ? recentSearches : recentSearches.slice(0, 4)).map((search) => (
                    <Badge
                      key={search}
                      variant="outline"
                      className="cursor-pointer whitespace-nowrap text-xs py-1 px-2 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                      onClick={() => handleTagClick(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                  {recentSearches.length > 4 && (
                    <Badge
                      className="cursor-pointer whitespace-nowrap text-xs py-1 px-2 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                      onClick={() => setShowMoreRecent(!showMoreRecent)}
                    >
                      {showMoreRecent ? "See less" : "See more..."}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Quick search tags when searching */}
            {debouncedSearch && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <TagIcon className="h-4 w-4 text-purple-500" />
                  Refine:
                </div>
                <div className="flex flex-wrap gap-2 pb-1">
                  {(showMoreRefine ? smellTypes : smellTypes.slice(0, 4)).map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="cursor-pointer whitespace-nowrap text-xs py-1 px-2 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors"
                      onClick={() => handleTagClick(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                  {smellTypes.length > 4 && (
                    <Badge
                      className="cursor-pointer whitespace-nowrap text-xs py-1 px-2 bg-white text-black border border-gray-200 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                      onClick={() => setShowMoreRefine(!showMoreRefine)}
                    >
                      {showMoreRefine ? "See less" : "See more..."}
                    </Badge>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Search Results */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Search Results</h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
                </div>
                <Badge variant="outline" className="bg-white">
                  {products.length} Products
                </Badge>
              </div>
            </div>

            {/* Scrollable area */}
            <ScrollArea className="flex-1 min-h-0 overflow-hidden">
              <div className="px-6 py-4 space-y-4">
                {debouncedSearch === "" ? null : isFetching ? (
                  <div className="space-y-4" aria-busy="true" aria-label="Loading search results">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 p-4 border rounded-xl">
                        <Skeleton className="w-20 h-24 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  <div className="text-center text-red-500 py-8">
                    Failed to load search results.
                  </div>
                ) : products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug}`} onClick={onClose}>
                        <div className="group flex gap-4 p-4 mb-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-300 bg-white">
                          <div className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 group-hover:shadow-md transition-shadow duration-300">
                            <img
                              src={product.primaryImage || "/placeholder.svg?height=96&width=80"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold text-sm leading-tight group-hover:text-blue-600 transition-colors duration-300">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {product.variants.length > 0
                                ? `৳${product.variants[0].price} - ৳${product.variants[product.variants.length - 1].price} BDT`
                                : product.minPrice && product.maxPrice
                                  ? `৳${product.minPrice} - ৳${product.maxPrice} BDT`
                                  : "Price not available"}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {product.accords?.map((acc: string) => (
                                <Badge key={acc} variant="outline" className="text-xs py-0.25 px-2">
                                  {acc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    {/* No products found UI */}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
