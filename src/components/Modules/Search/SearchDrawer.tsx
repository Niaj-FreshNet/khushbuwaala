"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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

const categoryPathMapping = {
  inspiredPerfumeOil: "inspired-perfume-oil",
  oriental: "oriental-attar",
  artificialOud: "artificial-oud",
  natural: "natural-attar",
  semiOrganic: "semi-organic",
  organic: "organic",
  brand: "brand",
  giftsAndPackages: "gifts-and-packages",
}

// Client Component - Only for search interactivity
export default function SearchDrawer ({ visible, onClose }: SearchDrawerProps) {
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [searchValue, setSearchValue] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  // Focus search input when drawer opens
  useEffect(() => {
    if (visible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    }
  }, [visible])

  // Mock data - replace with actual API call
  useEffect(() => {
    if (searchValue || selectedCategory !== "all") {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setProducts([]) // Replace with actual products
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

  const handleProductClick = (product: Product) => {
    const categoryPath = categoryPathMapping[product.category as keyof typeof categoryPathMapping]
    const productSlug = product.name.toLowerCase().replace(/ /g, "-")
    router.push(`/${categoryPath}/${productSlug}`)
    onClose()
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.smell.some((smell) => smell.toLowerCase().includes(searchValue.toLowerCase()))
      return matchesCategory && matchesSearch
    })
    .reverse()

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Search Products
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Search Controls */}
          <div className="p-6 space-y-4 border-b">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchValue)}
                className="pl-10 pr-10"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchValue("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="inspiredPerfumeOil">Inspired Perfume Oil</SelectItem>
                <SelectItem value="oriental">Oriental</SelectItem>
                <SelectItem value="artificialOud">Artificial Oud</SelectItem>
                <SelectItem value="natural">Natural</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick Search Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <TagIcon className="h-4 w-4" />
                Quick Search:
              </div>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {smellTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors text-xs"
                    onClick={() => handleTagClick(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results Header */}
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-sm">Search Results</h3>
                <div className="w-16 h-0.5 bg-red-500 mt-1" />
              </div>
              <span className="text-sm text-gray-500">{filteredProducts.length} Products</span>
            </div>
          </div>

          {/* Search Results */}
          <ScrollArea className="flex-1 px-6 py-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-20 h-24 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchPerformed ? (
              filteredProducts.length > 0 ? (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="w-20 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={product.primaryImage || "/placeholder.svg?height=96&width=80"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-sm leading-tight">{product.name}</h4>
                        <p className="text-xs text-gray-500">3 ml price:</p>
                        <p className="text-sm font-medium">৳{product.price} BDT</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Start searching</h3>
                <p className="text-sm text-gray-500">Enter a product name or select a category</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
