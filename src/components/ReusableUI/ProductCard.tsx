"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
}

export function ProductCard({ 
  product, 
  className, 
  layout = "grid", 
  showDescription = false 
}: ProductCardProps) {
  // Wishlist/cart features here (adapt to your state/context as needed)

  const handleAddToCart = () => {
    const defaultSize = product.variantPrices ? Object.keys(product.variantPrices)[0] : "3 ml"
    toast("Added to Cart!", {
      description: `${product.name} (${defaultSize}) has been added to your cart.`,
      duration: 2000,
    })
  }

  const handleAddToWishlist = () => {
    toast("Wishlist Updated!", {
      description: `${product.name} has been added to your wishlist.`,
      duration: 2000,
    })
  }

  const isProductInWishlist = false

  const categoryPathMapping: { [key: string]: string } = {
    inspiredPerfumeOil: "inspired-perfume-oil",
    oriental: "oriental-attar",
    artificialOud: "artificial-oud",
    natural: "natural-attar",
  }
  const productSlug = product.name.toLowerCase().replace(/ /g, "-")
  const productLink = `/${categoryPathMapping[product.category] || "products"}/${productSlug}`

  // --- LIST LAYOUT ---
  if (layout === "list") {
    return (
      <Card
        className={cn(
          "w-full overflow-hidden group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300",
          className
        )}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative aspect-[4/5] w-full md:w-72 flex-shrink-0 overflow-hidden bg-gray-100">
            <Link href={productLink} aria-label={`View details for ${product.name}`}>
              {/* Primary Image */}
              <Image
                src={product.primaryImage || "/placeholder.svg?height=320&width=320&text=Primary"}
                alt={product.name}
                fill
                sizes="(max-width:600px) 100vw, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              {/* Secondary Image Hover */}
              {product.secondaryImage && (
                <Image
                  src={product.secondaryImage}
                  alt={`${product.name} - alternate view`}
                  fill
                  sizes="(max-width:600px) 100vw, 320px"
                  className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                />
              )}
            </Link>

            {/* Wishlist Button Overlay */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 border border-white/50 hover:bg-red-50 hover:border-red-200 shadow-md"
                onClick={handleAddToWishlist}
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5 text-red-500" fill={isProductInWishlist ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
            <div>
              <CardTitle className="text-xl font-bold mb-2 line-clamp-2">
                <Link href={productLink} className="hover:text-red-600 transition-colors">{product.name}</Link>
              </CardTitle>
              <div className="mb-2">
                <p className="text-2xl font-bold text-red-600 leading-snug">৳{product.price} BDT</p>
                <p className="text-xs text-gray-500">Starting from 3ml</p>
              </div>
              {/* Smell Tags */}
              {product.smell && product.smell.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.smell.slice(0, 6).map((note, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs rounded-full border border-red-100"
                    >
                      {note}
                    </span>
                  ))}
                  {product.smell.length > 6 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{product.smell.length - 6} more
                    </span>
                  )}
                </div>
              )}
              {/* Description */}
              {showDescription && product.description && (
                <div className="mb-2">
                  <p className="text-xs text-gray-700 mb-1 font-medium">Description:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description.split('\n')[0]}</p>
                </div>
              )}
              {/* Perfume Notes */}
              {showDescription && product.notes && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Perfume Notes:
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.notes.replace(/\n/g, ' • ')}</p>
                </div>
              )}
            </div>
            {/* Add to Cart */}
            <div className="mt-4">
              <Button
                className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-lg hover:from-red-700 hover:to-pink-700 transition"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // --- GRID LAYOUT (Default) ---
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 group",
        className
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        <Link href={productLink} aria-label={`View details for ${product.name}`}>
          <Image
            src={product.primaryImage || "/placeholder.svg?height=256&width=200&text=Primary"}
            alt={product.name}
            fill
            sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {product.secondaryImage && (
            <Image
              src={product.secondaryImage}
              alt={`${product.name} - alternate view`}
              fill
              sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
            />
          )}
        </Link>
        {/* Wishlist Button Overlay */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 border border-white/50 hover:bg-red-50 hover:border-red-200 shadow"
            onClick={handleAddToWishlist}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4 text-red-500" fill={isProductInWishlist ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 text-center">
          <Link href={productLink} className="hover:text-red-600 transition">{product.name}</Link>
        </CardTitle>
        <div className="text-center mb-2">
          <span className="text-2xl font-bold text-red-600">৳{product.price} BDT</span>
          <span className="text-xs text-gray-500 block">Starting from 3ml</span>
        </div>
        {/* Smell Tags for Grid */}
        {product.smell && product.smell.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-1">
            {product.smell.slice(0, 3).map((note, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs rounded-full border border-red-100"
              >
                {note}
              </span>
            ))}
            {product.smell.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{product.smell.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 py-0">
        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-lg hover:from-red-700 hover:to-pink-700 transition"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
