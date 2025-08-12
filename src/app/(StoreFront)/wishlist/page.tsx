"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import StoreContainer from "@/components/Layout/StoreContainer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Grid3X3, Grid2X2, Columns3, Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { selectWishlistItems, clearWishlist, removeFromWishlist } from "@/lib/store/features/wishlist/wishlistSlice"
import { addToCart } from "@/lib/store/features/cart/cartSlice"
import type { Product } from "@/lib/Data/data"

export default function WishlistPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectWishlistItems)
  const [columns, setColumns] = useState<number>(4)

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.variantPrices ? Object.keys(product.variantPrices)[0] : "3 ml"
    dispatch(addToCart({ product, quantity: 1, selectedSize: defaultSize }))
  }

  const handleClear = () => dispatch(clearWishlist())

  const gridClass = useMemo(() => {
    switch (columns) {
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-2 md:grid-cols-3"
      case 5:
        return "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
      default:
        return "grid-cols-2 md:grid-cols-4"
    }
  }, [columns])

  return (
    <StoreContainer>
      <div className="min-h-screen px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/shop" aria-label="Back to shop">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Wishlist</h1>
              <p className="text-gray-600 mt-1">{items.length} saved {items.length === 1 ? "item" : "items"}</p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setColumns(2)} aria-label="2 columns">
                <Grid2X2 className="w-8 h-8 mr-2" /> 2
              </Button>
              <Button variant="outline" size="sm" onClick={() => setColumns(3)} aria-label="3 columns" className="hidden sm:flex">
                <Columns3 className="w-8 h-8 mr-2" /> 3
              </Button>
              <Button variant="outline" size="sm" onClick={() => setColumns(4)} aria-label="4 columns" className="hidden md:flex">
                <Grid3X3 className="w-8 h-8 mr-2" /> 4
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClear} aria-label="Clear wishlist">
                <Trash2 className="w-8 h-8 mr-2" /> Clear
              </Button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative w-48 h-48 mb-6 opacity-60">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-full" />
              <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
                <Heart className="w-16 h-16 text-gray-400" strokeWidth={1} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center">Your Wishlist is Empty</h2>
            <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
              Save your favorite perfume oils to view them later. Explore the collection and add items to your wishlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="gradient" size="lg" className="min-w-[160px]">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[160px]">
                <Link href="/new-arrivals">New Arrivals</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* List/Grid */}
            <div className={`grid ${gridClass} gap-4`}>
              {items.map((product) => (
                <Card key={product._id} className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <Link href={`/products/${product.slug ?? product.name.toLowerCase().replace(/ /g, '-')}`} aria-label={`View details for ${product.name}`}>
                      <Image
                        src={product.primaryImage}
                        alt={product.name}
                        fill
                        sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                      />
                      {product.secondaryImage && (
                        <Image
                          src={product.secondaryImage}
                          alt={`${product.name} - alternate view`}
                          fill
                          sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
                          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>

                    {/* Wishlist-only controls */}
                    <div className="absolute top-3 right-3 z-10 flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full backdrop-blur-md bg-white/80 border-white/50 hover:bg-red-50 hover:border-red-200"
                        aria-label="Remove from wishlist"
                        onClick={() => dispatch(removeFromWishlist(product._id))}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>

                    {/* Premium badge / category */}
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="secondary" className="capitalize">
                        {product.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-2">
                    <CardTitle className="text-base font-semibold line-clamp-2 text-center leading-tight">
                      <Link href={`/products/${product.slug ?? product.name.toLowerCase().replace(/ /g, '-')}`} className="hover:text-red-600 transition-colors duration-300 group-hover:underline decoration-red-600 underline-offset-4">
                        {product.name}
                      </Link>
                    </CardTitle>

                    <div className="text-center space-y-1">
                      <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                        ৳{(product.price ?? 0).toFixed(0)}
                      </span>
                      {product.smell?.length ? (
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                          {product.smell.slice(0, 3).map((note) => (
                            <span key={note} className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] rounded-full border border-red-100">
                              {note}
                            </span>
                          ))}
                          {product.smell.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">+{product.smell.length - 3}</span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/products/${product.slug ?? product.name.toLowerCase().replace(/ /g, '-')}`}>View</Link>
                      </Button>
                      <Button className="w-full" onClick={() => handleAddToCart(product)} aria-label={`Add ${product.name} to cart`}>
                        <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Recommendation / CTA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Looking for more?</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-gray-600">Explore our curated collections and discover your signature scent.</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href="/featured">Featured</Link>
                  </Button>
                  <Button asChild variant="gradient">
                    <Link href="/new-arrivals">New Arrivals</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StoreContainer>
  )
}

