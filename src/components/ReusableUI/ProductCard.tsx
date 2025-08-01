"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
// import { useWishlist } from "@/context/WishlistContext"
// import { useCart } from "@/context/CartContext"
import { toast } from "sonner"

interface ProductCardProps {
    product: {
        _id: string
        name: string
        price: number
        primaryImage: string
        secondaryImage?: string // Optional secondary image for hover effect
        category: string
        smell: string[] // Added 'smell' property
        variantPrices?: { [key: string]: number } // Ensure this is present for default size logic
        description?: string
        notes?: string
    }
    className?: string
    layout?: "grid" | "list"
    showDescription?: boolean
}

// Client Component - Due to interactivity (add to cart/wishlist, toast)
export function ProductCard({ 
    product, 
    className, 
    layout = "grid", 
    showDescription = false 
}: ProductCardProps) {
    // const { addToCart } = useCart()
    // const { addToWishlist, isInWishlist } = useWishlist()

    const handleAddToCart = () => {
        const defaultQuantity = 1
        // Safely get the first variant size, or default to "3 ml" if no variants
        const defaultSize = product.variantPrices ? Object.keys(product.variantPrices)[0] : "3 ml"

        // addToCart(product, defaultQuantity, defaultSize) // Pass all three arguments
        toast("Added to Cart!", {
            description: `${product.name} (${defaultSize}) has been added to your cart.`,
            duration: 2000,
        })
        // If you have Facebook Pixel or other analytics, integrate here:
        // ReactPixel.track('AddToCart', {
        //   content_name: product.name,
        //   content_ids: [product._id],
        //   content_type: 'product',
        //   value: product.price,
        //   currency: 'BDT',
        // });
    }

    const handleAddToWishlist = () => {
        // addToWishlist(product) // Pass the entire product object directly
        toast("Wishlist Updated!", {
            description: `${product.name} has been added to your wishlist.`,
            duration: 2000,
        })
    }

    // const isProductInWishlist = isInWishlist(product._id)
    const isProductInWishlist = false;

    // Determine the link path based on category
    const categoryPathMapping: { [key: string]: string } = {
        inspiredPerfumeOil: "inspired-perfume-oil",
        oriental: "oriental-attar",
        artificialOud: "artificial-oud",
        natural: "natural-attar",
        // Add other categories as needed
    }
    const productSlug = product.name.toLowerCase().replace(/ /g, "-")
    const productLink = `/${categoryPathMapping[product.category] || "products"}/${productSlug}`

    // List layout for single column view
    if (layout === "list") {
        return (
            <Card
                className={cn(
                    "w-full overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-gray-200",
                    className,
                )}
            >
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full md:w-80 h-64 md:h-80 flex-shrink-0">
                        <Link href={productLink} className="block h-full" aria-label={`View details for ${product.name}`}>
                            <div className="relative w-full h-full overflow-hidden bg-gray-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                                {/* Primary Image */}
                                <Image
                                    src={product.primaryImage || "/placeholder.svg?height=320&width=320&text=Primary"}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                                    priority
                                />
                                {/* Secondary Image */}
                                {product.secondaryImage && (
                                    <Image
                                        src={product.secondaryImage}
                                        alt={`${product.name} - alternate view`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 320px"
                                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                                    />
                                )}
                                
                                {/* Wishlist Button Overlay */}
                                <div className="absolute top-4 right-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-white/50 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
                                        onClick={handleAddToWishlist}
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold mb-3 line-clamp-2">
                                <Link href={productLink} className="hover:text-red-600 transition-colors">
                                    {product.name}
                                </Link>
                            </CardTitle>
                            
                            {/* Price */}
                            <div className="mb-4">
                                <p className="text-2xl font-bold text-red-600">৳{product.price} BDT</p>
                                <p className="text-sm text-gray-500">Starting from 3ml</p>
                            </div>

                            {/* Smell Tags */}
                            {product.smell && product.smell.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                        <Sparkles className="h-4 w-4" />
                                        Fragrance Notes:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.smell.slice(0, 6).map((note, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs font-medium rounded-full border border-red-100"
                                            >
                                                {note}
                                            </span>
                                        ))}
                                        {product.smell.length > 6 && (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                +{product.smell.length - 6} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {showDescription && product.description && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {product.description.split('\n')[0]}
                                    </p>
                                </div>
                            )}

                            {/* Perfume Notes */}
                            {showDescription && product.notes && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                        <Star className="h-4 w-4" />
                                        Perfume Notes:
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {product.notes.replace(/\n/g, ' • ')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-6">
                            <Button
                                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-xl h-12"
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

    // Grid layout (default)
    return (
        <Card
            className={cn(
                "w-full overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-gray-200",
                className,
            )}
        >
            <Link href={productLink} className="block" aria-label={`View details for ${product.name}`}>
                <div className="relative w-full h-64 overflow-hidden bg-gray-100 rounded-t-xl">
                    {/* Primary Image - Fades out on hover */}
                    <Image
                        src={product.primaryImage || "/placeholder.svg?height=256&width=200&text=Primary"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                        priority // Prioritize loading for products on homepage
                    />
                    {/* Secondary Image - Fades in and slightly zooms on hover */}
                    {product.secondaryImage && (
                        <Image
                            src={product.secondaryImage || "/placeholder.svg"}
                            alt={`${product.name} - alternate view`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                        />
                    )}
                    
                    {/* Wishlist Button Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm border-white/50 hover:bg-red-50 hover:border-red-200"
                            onClick={handleAddToWishlist}
                            aria-label="Add to wishlist"
                        >
                            <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
                        </Button>
                    </div>
                </div>
            </Link>
            
            <CardContent className="p-4">
                <CardTitle className="text-lg font-bold mb-2 line-clamp-2 text-center">
                    <Link href={productLink} className="hover:text-red-600 transition-colors">
                        {product.name}
                    </Link>
                </CardTitle>
                <div className="text-center mb-3">
                    <p className="text-xl font-bold text-red-600">৳{product.price} BDT</p>
                    <p className="text-xs text-gray-500">Starting from 3ml</p>
                </div>
                
                {/* Smell Tags for Grid View */}
                {product.smell && product.smell.length > 0 && (
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1 justify-center">
                            {product.smell.slice(0, 3).map((note, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs font-medium rounded-full border border-red-100"
                                >
                                    {note}
                                </span>
                            ))}
                            {product.smell.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                    +{product.smell.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-xl"
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
