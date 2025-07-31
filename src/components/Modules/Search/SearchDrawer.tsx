"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, TagIcon, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface SearchDrawerProps {
  visible: boolean
  onClose: () => void
}

interface Product {
  _id: string
  name: string
  category: string
  price: number
  primaryImage: string
  smell: string[]
}

const trendingSearches = ["Dior Sauvage", "Oud", "Rose", "Vanilla", "Musk"]
const recentSearches = ["Axe Signature", "Prada Candy", "Oriental Attar"]

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
]

export default function SearchDrawer({ visible, onClose }: SearchDrawerProps) {
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [searchValue, setSearchValue] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  useEffect(() => {
    if (visible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    }
  }, [visible])

  useEffect(() => {
    if (searchValue || selectedCategory !== "all") {
      setIsLoading(true)
      setTimeout(() => {
        setProducts([])
        setIsLoading(false)
        setSearchPerformed(true)
      }, 500)
    }
  }, [searchValue, selectedCategory])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setSearchPerformed(true)
  }

  const handleTagClick = (tag: string) => {
    setSearchValue(tag)
    handleSearch(tag)
  }

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[450px] sm:w-[550px] flex flex-col p-0 bg-gradient-to-b from-white to-gray-50"
      >
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-full">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex flex-col items-start">
              <span>Search Products</span>
              <span className="text-sm font-normal text-gray-600">Find your perfect fragrance</span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Enhanced Search Controls */}
          <div className="p-6 space-y-6 border-b">
            {/* Search Input with enhanced styling */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for perfumes, brands, or scents..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchValue)}
                className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base transition-all duration-300 bg-white shadow-sm focus:shadow-md"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                  onClick={() => setSearchValue("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Enhanced Category Filter */}
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
            {!searchValue && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Trending Searches:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="cursor-pointer hover:bg-green-100 hover:text-green-700 transition-colors text-sm py-1 px-3 rounded-full bg-green-50 text-green-600"
                        onClick={() => handleTagClick(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Recent Searches:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-sm py-1 px-3 rounded-full"
                        onClick={() => handleTagClick(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Quick Search Tags */}
            {searchValue && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <TagIcon className="h-4 w-4 text-purple-500" />
                  Refine by scent:
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {smellTypes.slice(0, 12).map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors text-xs py-1 px-2 rounded-full"
                      onClick={() => handleTagClick(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Search Results */}
          <div className="flex-1 flex flex-col">
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

            <ScrollArea className="flex-1 px-6 py-4">
              {isLoading ? (
                <div className="space-y-4">
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
              ) : searchPerformed ? (
                products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="group flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-300 bg-white"
                      >
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
                          <p className="text-xs text-gray-500">3 ml starting price</p>
                          <p className="text-lg font-bold text-red-600">৳{product.price} BDT</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="h-3 w-3 text-red-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-sm">
                      Try adjusting your search terms or browse our categories
                    </p>
                    <Button variant="outline" onClick={() => setSearchValue("")} className="rounded-full px-6">
                      Clear Search
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your search</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Enter a product name, brand, or scent type to find your perfect fragrance
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
