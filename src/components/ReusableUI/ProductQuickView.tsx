"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Zap,
  Award,
  Clock,
  Maximize2,
  X,
  ExternalLink,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  primaryImage: string
  secondaryImage?: string
  category: string
  smell: string[]
  variantPrices?: { [key: string]: number }
  description?: string
  notes?: string
  rating?: number
  reviewCount?: number
  images?: string[]
}

interface ProductQuickViewProps {
  product: Product
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductQuickView({ product, trigger, open, onOpenChange }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  const images = [
    product.primaryImage,
    ...(product.secondaryImage ? [product.secondaryImage] : []),
    ...(product.images || []),
  ].filter(Boolean)

  useEffect(() => {
    if (product.variantPrices && Object.keys(product.variantPrices).length > 0) {
      setSelectedSize(Object.keys(product.variantPrices)[0])
    } else {
      setSelectedSize("3ml")
    }
  }, [product])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳")
  }

  const getCurrentPrice = () => {
    if (product.variantPrices && selectedSize && product.variantPrices[selectedSize]) {
      return product.variantPrices[selectedSize]
    }
    return product.price
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success("Added to Cart!", {
      description: `${product.name} (${selectedSize}) × ${quantity} added to your cart.`,
      duration: 3000,
    })
    setIsAddingToCart(false)
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success("Redirecting to Checkout!", {
      description: `Processing ${product.name} (${selectedSize}) × ${quantity}`,
      duration: 3000,
    })
    setIsBuyingNow(false)
  }

  const handleViewFullDetails = () => {
    toast.info("Navigating to Product Details", {
      description: "Opening full product page...",
      duration: 2000,
    })
  }

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from Wishlist!" : "Added to Wishlist!", {
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
      duration: 3000,
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const sizeOptions = product.variantPrices ? Object.keys(product.variantPrices) : ["3ml", "6ml", "12ml"]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

        <DialogContent className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[60vh] md:min-h-[70vh]">
            {/* Image Gallery Section */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
              {/* Main Image Display */}
              <div className="relative flex-1 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px]">
                <Image
                  src={!imageError ? images[currentImageIndex] : "/placeholder.svg?height=500&width=500&text=No+Image"}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain p-4"
                  priority
                  onError={() => setImageError(true)}
                />

                {/* Zoom Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10 z-10"
                  onClick={() => setIsImageZoomed(true)}
                >
                  <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </>
                )}

                {/* Image Indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
                    {images.map((_, index) => (
                      <Button
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-200 touch-manipulation",
                          index === currentImageIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/75",
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                        >
                      </Button>
                    ))}
                  </div>
                )}

                {/* Premium Badge */}
                {product.category === "premium" && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 text-xs sm:text-sm">
                      <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-2 sm:p-4 bg-white border-t">
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                      <Button
                        key={index}
                        className={cn(
                          "relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 touch-manipulation",
                          index === currentImageIndex
                            ? "border-red-500 shadow-lg"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col pb-20 md:pb-0">
              <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight break-words">
                        {product.name}
                      </h1>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3 sm:h-4 sm:w-4",
                                  i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600">
                            {product.rating} ({product.reviewCount || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {/* View Full Details Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 touch-manipulation hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                        onClick={handleViewFullDetails}
                        title="View Full Details"
                      >
                        <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>

                      {/* Wishlist Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 touch-manipulation",
                          isWishlisted
                            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                            : "hover:bg-red-50 hover:border-red-200",
                        )}
                        onClick={handleAddToWishlist}
                      >
                        <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isWishlisted && "fill-current")} />
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(getCurrentPrice())}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="break-words">In Stock • Free shipping on orders over ৳500</span>
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                    Size Options
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        className={cn(
                          "p-2 sm:p-3 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-md touch-manipulation",
                          selectedSize === size
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700",
                        )}
                        onClick={() => setSelectedSize(size)}
                      >
                        <div className="font-semibold">{size}</div>
                        {product.variantPrices?.[size] && (
                          <div className="text-xs text-gray-500 mt-1 break-words">
                            {formatPrice(product.variantPrices[size])}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scent Notes */}
                {product.smell && product.smell.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                      Scent Profile
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {product.smell.map((note, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:shadow-md transition-shadow text-xs sm:text-sm"
                        >
                          {note}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{product.description}</p>
                  </div>
                )}

                {/* Perfume Notes */}
                {product.notes && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      Fragrance Notes
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{product.notes}</p>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent touch-manipulation"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="text-base sm:text-lg font-semibold min-w-[2rem] sm:min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent touch-manipulation"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Buttons */}
          <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto p-4 sm:p-6 border-t bg-white md:bg-gray-50 space-y-2 sm:space-y-3 shadow-lg md:shadow-none z-50">
            <div className="flex gap-2 sm:gap-3">
              <Button
                className={cn(
                  "flex-1 h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation",
                  isAddingToCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 via-red-600 to-pink-600 hover:from-red-700 hover:via-red-700 hover:to-pink-700 text-white hover:shadow-xl hover:shadow-red-500/25",
                )}
                onClick={handleAddToCart}
                disabled={isAddingToCart || isBuyingNow}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Adding...</span>
                    <span className="sm:hidden">Add...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </Button>

              {/* Buy Now Button */}
              <Button
                className={cn(
                  "flex-1 h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation",
                  isBuyingNow
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl hover:shadow-green-500/25",
                )}
                onClick={handleBuyNow}
                disabled={isAddingToCart || isBuyingNow}
              >
                {isBuyingNow ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">Wait...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">Buy Now</span>
                    <span className="sm:hidden">Buy</span>
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              ✨ Total: {formatPrice(getCurrentPrice() * quantity)} • 30-day return policy
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Screen Image Zoom Modal */}
      <Dialog open={isImageZoomed} onOpenChange={setIsImageZoomed}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20 text-white z-50"
              onClick={() => setIsImageZoomed(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="relative w-full h-full max-w-4xl max-h-4xl">
              <Image
                src={!imageError ? images[currentImageIndex] : "/placeholder.svg?height=800&width=800&text=No+Image"}
                alt={`${product.name} - Full View`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation in zoom mode */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
