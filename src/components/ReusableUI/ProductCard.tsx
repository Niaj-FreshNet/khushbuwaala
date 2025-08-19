"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Heart, ShoppingCart, Star, Eye, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { toggleWishlist, selectIsInWishlist } from "@/lib/store/features/wishlist/wishlistSlice"
import { addToCart } from "@/lib/store/features/cart/cartSlice"

interface ProductCardProps {
  product: {
    _id: string
    name: string
    price: number
    primaryImage: string
    secondaryImage?: string
    category: string
    smell: string[]
    variantPrices?: { [key: string]: number }
    description?: string
    notes?: string
  }
  className?: string
  layout?: "grid" | "list"
  showDescription?: boolean
  isLoading?: boolean
  onQuickView?: () => void
}

// Skeleton loader component
function ProductCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  if (layout === "list") {
    return (
      <Card className="w-full overflow-hidden rounded-2xl bg-white border border-gray-100">
        <div className="flex flex-row">
          <div className="relative aspect-[4/5] w-72 flex-shrink-0 overflow-hidden bg-gray-200 animate-pulse" />
          <div className="flex-1 p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/3" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-2xl bg-white border border-gray-100">
      <div className="relative aspect-[4/5] w-full bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-5 w-12 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 py-0">
        <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
      </CardFooter>
    </Card>
  )
}

export function ProductCard({
  product,
  className,
  layout = "grid",
  showDescription = false,
  isLoading = false,
  onQuickView,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const dispatch = useAppDispatch()
  const isWishlisted = useAppSelector(useMemo(() => selectIsInWishlist(product._id), [product._id]))
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  if (isLoading) {
    return <ProductCardSkeleton layout={layout} />
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    const defaultSize = product.variantPrices ? Object.keys(product.variantPrices)[0] : "3 ml"
    dispatch(addToCart({ product, quantity: 1, selectedSize: defaultSize }))
    await new Promise((resolve) => setTimeout(resolve, 400))
    toast.success("Added to Cart!", {
      description: `${product.name} (${defaultSize}) has been added to your cart.`,
      duration: 2500,
    })
    setIsAddingToCart(false)
  }

  const handleAddToWishlist = () => {
    dispatch(toggleWishlist(product))
    const nowWishlisted = !isWishlisted
    toast.success(nowWishlisted ? "Added to Wishlist!" : "Removed from Wishlist", {
      description: `${product.name} has been ${nowWishlisted ? 'added to' : 'removed from'} your wishlist.`,
      duration: 1800,
    })
  }

  const productSlug = product.name.toLowerCase().replace(/ /g, "-")
  const productLink = `/products/${productSlug}`

  // Enhanced price display with better formatting
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳')
  }

  // --- LIST LAYOUT ---
  if (layout === "list") {
    return (
      <Card
        className={cn(
          "w-full overflow-hidden group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-red-200",
          className
        )}
      >
        <div className="flex flex-row">
          <div className="relative aspect-[4/5] w-72 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Link href={productLink} aria-label={`View details for ${product.name}`}>
              {/* Primary Image */}
              <Image
                src={!imageError ? product.primaryImage : "/placeholder.svg?height=320&width=320&text=No+Image"}
                alt={product.name}
                fill
                sizes="(max-width:600px) 100vw, 320px"
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority
                onError={() => setImageError(true)}
              />
              {/* Secondary Image Hover */}
              {product.secondaryImage && !imageError && (
                <Image
                  src={product.secondaryImage}
                  alt={`${product.name} - alternate view`}
                  fill
                  sizes="(max-width:600px) 100vw, 320px"
                  className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
              )}

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Quick view button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  size="sm"
                  className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onQuickView?.()
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </Button>
              </div>
            </Link>

            {/* Enhanced Wishlist Button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110",
                  isWishlisted
                    ? "bg-red-50/90 border-red-200 text-red-600"
                    : "bg-white/80 border-white/50 hover:bg-red-50 hover:border-red-200"
                )}
                onClick={handleAddToWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn("h-5 w-5 transition-all duration-300", isWishlisted && "animate-pulse")}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </Button>
            </div>

            {/* Premium badge */}
            {product.category === "premium" && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Premium
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <CardTitle className="text-xl font-bold mb-2 line-clamp-2 leading-tight">
                <Link href={productLink} className="hover:text-red-600 transition-colors duration-300 group-hover:underline decoration-red-600 underline-offset-4">
                  {product.name}
                </Link>
              </CardTitle>

              <div className="space-y-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Starting from 3ml • Free shipping
                </p>
              </div>

              {/* Enhanced Smell Tags */}
              {product.smell && product.smell.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.smell.slice(0, 6).map((note, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 text-red-700 text-xs rounded-full border border-red-100 hover:shadow-md transition-shadow duration-200 cursor-default"
                    >
                      {note}
                    </span>
                  ))}
                  {product.smell.length > 6 && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-default">
                      +{product.smell.length - 6} more
                    </span>
                  )}
                </div>
              )}

              {/* Enhanced Description */}
              {showDescription && product.description && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                    Description
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.description.split('\n')[0]}</p>
                </div>
              )}

              {/* Enhanced Perfume Notes */}
              {showDescription && product.notes && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Perfume Notes
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.notes.replace(/\n/g, ' • ')}</p>
                </div>
              )}
            </div>

            {/* Enhanced Add to Cart */}
            <div className="mt-6">
              <Button
                className={cn(
                  "w-full h-12 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
                  isAddingToCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 via-red-600 to-pink-600 hover:from-red-700 hover:via-red-700 hover:to-pink-700 text-white hover:shadow-xl hover:shadow-red-500/25"
                )}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // --- ENHANCED GRID LAYOUT (Default) ---
  return (
    <Link href={productLink} aria-label={`View details for ${product.name}`}>

      <Card
        className={cn(
          "overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group hover:border-red-200 hover:-translate-y-1",
          className
        )}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* <Link href={productLink} aria-label={`View details for ${product.name}`}> */}
          <Image
            src={!imageError ? product.primaryImage : "/placeholder.svg?height=256&width=200&text=No+Image"}
            alt={product.name}
            fill
            sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition-all duration-700 group-hover:scale-110"
            priority
            onError={() => setImageError(true)}
          />
          {product.secondaryImage && !imageError && (
            <Image
              src={product.secondaryImage}
              alt={`${product.name} - alternate view`}
              fill
              sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
            />
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* </Link> */}

          {/* Enhanced Wishlist Button */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110",
                isWishlisted
                  ? "bg-red-50/90 border-red-200 text-red-600"
                  : "bg-white/80 border-white/50 hover:bg-red-50 hover:border-red-200"
              )}
              onClick={handleAddToWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={cn("h-4 w-4 transition-all duration-300", isWishlisted && "animate-pulse")}
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </Button>
          </div>

          {/* Premium badge */}
          {product.category === "premium" && (
            <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Premium
              </div>
            </div>
          )}

          {/* Quick view overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="sm"
              className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20 transform scale-75 group-hover:scale-100 transition-transform duration-300"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onQuickView?.()
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-center leading-tight">
            {/* <Link href={productLink} */}
            <span
              className="hover:text-red-600 transition-colors duration-300 group-hover:underline decoration-red-600 underline-offset-4">
              {product.name}
            </span>
            {/* </Link> */}
          </CardTitle>

          <div className="text-center space-y-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-500 block flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Starting from 3ml
            </span>
          </div>

          {/* Enhanced Smell Tags for Grid */}
          {product.smell && product.smell.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {product.smell.slice(0, 3).map((note, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 text-red-700 text-xs rounded-full border border-red-100 hover:shadow-md transition-shadow duration-200 cursor-default"
                >
                  {note}
                </span>
              ))}
              {product.smell.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-default">
                  +{product.smell.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 py-0">
          <Button
            className={cn(
              "w-full h-12 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
              isAddingToCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 via-red-600 to-pink-600 hover:from-red-700 hover:via-red-700 hover:to-pink-700 text-white hover:shadow-xl hover:shadow-red-500/25"
            )}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card >
    </Link>
  )
}
