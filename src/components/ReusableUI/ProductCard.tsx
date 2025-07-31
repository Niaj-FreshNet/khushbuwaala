"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Heart, ShoppingCart } from "lucide-react"
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
    }
    className?: string
}

// Client Component - Due to interactivity (add to cart/wishlist, toast)
export function ProductCard({ product, className }: ProductCardProps) {
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

    return (
        <Card
            className={cn(
                "w-full max-w-xs mx-auto overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                className,
            )}
        >
            <Link href={productLink} className="block" aria-label={`View details for ${product.name}`}>
                <div className="relative w-full h-64 overflow-hidden bg-gray-100">
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
                </div>
            </Link>
            <CardContent className="p-4 text-center">
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                    <Link href={productLink} className="hover:text-red-600 transition-colors">
                        {product.name}
                    </Link>
                </CardTitle>
                <p className="text-xl font-bold text-red-600">৳{product.price} BDT</p>
            </CardContent>
            <CardFooter className="flex justify-center gap-2 p-4 pt-0">
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "rounded-full transition-colors duration-200",
                        // isProductInWishlist ? "bg-red-100 text-red-600 hover:bg-red-200" : "hover:bg-gray-100",
                        "bg-red-100 text-red-600 hover:bg-red-200",
                    )}
                    onClick={handleAddToWishlist}
                    // aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label="Remove from wishlist"
                >
                    {/* <Heart className="h-5 w-5" fill={isProductInWishlist ? "currentColor" : "none"} /> */}
                    <Heart className="h-5 w-5" fill="currentColor" />
                </Button>
                <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white transition-transform duration-200 transform hover:scale-105"
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
