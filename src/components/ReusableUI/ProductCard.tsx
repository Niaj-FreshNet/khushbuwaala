// "use client"

// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
// import { Heart, ShoppingCart, Star, Eye, Sparkles } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { toast } from "sonner"
// import { useState } from "react"
// import { useAppDispatch, useAppSelector } from "@/redux/store/hooks"
// import { toggleWishlist, selectIsInWishlist } from "@/redux/store/features/wishlist/wishlistSlice"
// import { addToCart } from "@/redux/store/features/cart/cartSlice"
// import { IProductResponse } from "@/types/product.types"
// import { useCart } from "@/context/CartContext"

// interface ProductCardProps {
//   product: IProductResponse
//   className?: string
//   layout?: "grid" | "list"
//   showDescription?: boolean
//   onQuickView?: () => void
// }

// const priceFormatter = new Intl.NumberFormat("en-BD", {
//   style: "currency",
//   currency: "BDT",
//   minimumFractionDigits: 0,
// })

// // Skeleton loader component
// function ProductCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
//   if (layout === "list") {
//     return (
//       <Card className="w-full overflow-hidden rounded-2xl bg-white border border-gray-100">
//         <div className="flex flex-row">
//           <div className="relative aspect-[4/5] w-72 flex-shrink-0 overflow-hidden bg-gray-200 animate-pulse" />
//           <div className="flex-1 p-6 space-y-4">
//             <div className="h-6 bg-gray-200 rounded-lg animate-pulse" />
//             <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/3" />
//             <div className="flex gap-2">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
//               ))}
//             </div>
//             <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
//           </div>
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <Card className="overflow-hidden rounded-2xl bg-white border border-gray-100">
//       <div className="relative aspect-[4/5] w-full bg-gray-200 animate-pulse" />
//       <CardContent className="p-4 space-y-3">
//         <div className="h-5 bg-gray-200 rounded animate-pulse" />
//         <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
//         <div className="flex justify-center gap-2">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div key={i} className="h-5 w-12 bg-gray-200 rounded-full animate-pulse" />
//           ))}
//         </div>
//       </CardContent>
//       <CardFooter className="p-4 py-0">
//         <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
//       </CardFooter>
//     </Card>
//   )
// }

// export function ProductCard({
//   product,
//   className,
//   layout = "grid",
//   showDescription = false,
//   onQuickView,
// }: ProductCardProps) {
//   const cart = useCart()
//   const [imageError, setImageError] = useState(false)
//   const dispatch = useAppDispatch()
//   const isWishlisted = useAppSelector(selectIsInWishlist(product.id))
//   const [isAddingToCart, setIsAddingToCart] = useState(false)

//   const handleAddToCart = async () => {
//     setIsAddingToCart(true)
//     const defaultSize = product.variants ? product.variants[0].size + "ml" : "3ml"
//     // dispatch(addToCart({ product as any, quantity: 1, selectedSize: defaultSize }))

//     cart?.addToCart?.(product as any, quantity: 1, selectedSize: defaultSize, selectedPrice);

//     await new Promise((resolve) => setTimeout(resolve, 400))
//     // toast.success("Added to Cart!", {
//     //   description: `${product.name} (${defaultSize}) has been added to your cart.`,
//     //   duration: 2500,
//     // })
//     setIsAddingToCart(false)
//   }

//   const handleAddToWishlist = () => {
//     dispatch(toggleWishlist(product))
//     const nowWishlisted = !isWishlisted
//     toast.success(nowWishlisted ? "Added to Wishlist!" : "Removed from Wishlist", {
//       description: `${product.name} has been ${nowWishlisted ? 'added to' : 'removed from'} your wishlist.`,
//       duration: 1800,
//     })
//   }

//   const productSlug = product.slug || product.name.toLowerCase().replace(/ /g, "-") || "https://khushbuwaala.com/shop"
//   const productLink = `/product/${productSlug}`

//   // Enhanced price display with better formatting
//   const formatPrice = (price: number) => priceFormatter.format(price).replace("BDT", "৳")

//   const visibleAccords = product.accords?.slice(0, layout === "list" ? 6 : 3) || []


//   // --- LIST LAYOUT ---
//   if (layout === "list") {
//     return (
//       <Card
//         className={cn(
//           "w-full overflow-hidden group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-red-200",
//           className
//         )}
//       >
//         <div className="flex flex-row">
//           <div className="relative aspect-[4/5] w-72 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
//             <Link href={productLink} aria-label={`View details for ${product.name}`}>
//               {/* Primary Image */}
//               <Image
//                 src={!imageError ? product.primaryImage : "/placeholder.svg?height=320&width=320&text=No+Image"}
//                 alt={product.name}
//                 fill
//                 sizes="(max-width:600px) 100vw, 320px"
//                 className="object-cover transition-all duration-700 group-hover:scale-110"
//                 priority
//                 onError={() => setImageError(true)}
//               />
//               {/* Secondary Image Hover */}
//               {product.otherImages && product.otherImages.length > 0 && !imageError && (
//                 <Image
//                   src={product.otherImages[0]}
//                   alt={`${product.name} - alternate view`}
//                   fill
//                   sizes="(max-width:600px) 100vw, 320px"
//                   className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
//                 />
//               )}

//               {/* Gradient overlay on hover */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//               {/* Quick view button */}
//               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
//                 <Button
//                   size="sm"
//                   className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     e.stopPropagation()
//                     onQuickView?.()
//                   }}
//                 >
//                   <Eye className="h-4 w-4 mr-2" />
//                   Quick View
//                 </Button>
//               </div>
//             </Link>

//             {/* Enhanced Wishlist Button */}
//             <div className="absolute top-4 right-4 z-10">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className={cn(
//                   "h-10 w-10 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110",
//                   isWishlisted
//                     ? "bg-red-50/90 border-red-200 text-red-600"
//                     : "bg-white/80 border-white/50 hover:bg-red-50 hover:border-red-200"
//                 )}
//                 onClick={handleAddToWishlist}
//                 aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//               >
//                 <Heart
//                   className={cn("h-5 w-5 transition-all duration-300", isWishlisted && "animate-pulse")}
//                   fill={isWishlisted ? "currentColor" : "none"}
//                 />
//               </Button>
//             </div>

//             {/* Premium badge */}
//             {/* {product.category === "premium" && (
//               <div className="absolute top-4 left-4 z-10">
//                 <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//                   <Sparkles className="h-3 w-3" />
//                   Premium
//                 </div>
//               </div>
//             )} */}
//           </div>

//           <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
//             <div className="space-y-3">
//               <CardTitle className="text-xl font-bold mb-2 line-clamp-2 leading-tight">
//                 <Link href={productLink} className="hover:text-red-600 transition-colors duration-300 group-hover:underline decoration-red-600 underline-offset-4">
//                   {product.name}
//                 </Link>
//               </CardTitle>

//               <div className="space-y-1">
//                 <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//                   {formatPrice(product.minPrice)}
//                 </p>
//                 <p className="text-sm text-gray-500 flex items-center gap-1">
//                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                   Starting from 3ml • Free shipping
//                 </p>
//               </div>

//               {/* Enhanced Smell Tags */}
//               {product.accords && product.accords.length > 0 && (
//                 <div className="flex flex-wrap gap-2">
//                   {visibleAccords.map((note, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1.5 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs rounded-full border border-red-100 hover:shadow-md transition-shadow duration-200 cursor-default"
//                     >
//                       {note}
//                     </span>
//                   ))}
//                   {product.accords.length > 6 && (
//                     <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-default">
//                       +{product.accords.length - 6} more
//                     </span>
//                   )}
//                 </div>
//               )}

//               {/* Enhanced Description */}
//               {showDescription && product.description && (
//                 <div className="space-y-2">
//                   <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
//                     <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
//                     Description
//                   </p>
//                   <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.description.split('\n')[0]}</p>
//                 </div>
//               )}

//               {/* Enhanced Perfume Notes */}
//               {showDescription && product.perfumeNotes && (
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <Star className="h-4 w-4 text-yellow-500" />
//                     Perfume Notes
//                   </p>
//                   <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
//                     Top: {product.perfumeNotes.top.join(", ")} <br />
//                     Middle: {product.perfumeNotes.middle.join(", ")} <br />
//                     Base: {product.perfumeNotes.base.join(", ")}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Enhanced Add to Cart */}
//             <div className="mt-6">
//               <Button
//                 className={cn(
//                   "w-full h-12 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
//                   isAddingToCart
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-gradient-to-r from-red-600 via-red-600 to-pink-600 hover:from-red-700 hover:via-red-700 hover:to-pink-700 text-white hover:shadow-xl hover:shadow-red-500/25"
//                 )}
//                 onClick={handleAddToCart}
//                 disabled={isAddingToCart}
//                 aria-label={`Add ${product.name} to cart`}
//               >
//                 {isAddingToCart ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingCart className="h-5 w-5 mr-2" />
//                     Add to Cart
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </Card>
//     )
//   }

//   // --- ENHANCED GRID LAYOUT (Default) ---
//   return (
//     <Link href={productLink} aria-label={`View details for ${product.name}`}>

//       <Card
//         className={cn(
//           "overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group hover:border-red-200 hover:-translate-y-1",
//           className
//         )}
//       >
//         <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
//           <Image
//             src={!imageError ? product.primaryImage : "/placeholder.svg?height=256&width=200&text=No+Image"}
//             alt={product.name}
//             fill
//             sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
//             className="object-cover transition-all duration-700 group-hover:scale-110"
//             priority
//             onError={() => setImageError(true)}
//           />
//           {product.otherImages && product.otherImages.length > 0 && !imageError && (
//             <Image
//               src={product.otherImages[0]}
//               alt={`${product.name} - alternate view`}
//               fill
//               sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
//               className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
//             />
//           )}

//           {/* Gradient overlay on hover */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//           {/* Enhanced Wishlist Button */}
//           <div className="absolute top-2 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
//             <Button
//               variant="outline"
//               size="icon"
//               className={cn(
//                 "h-8 w-8 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110",
//                 isWishlisted
//                   ? "bg-red-50/90 border-red-200 text-red-600"
//                   : "bg-white/80 border-white/50 hover:bg-red-50 hover:border-red-200"
//               )}
//               onClick={handleAddToWishlist}
//               aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//             >
//               <Heart
//                 className={cn("h-4 w-4 transition-all duration-300", isWishlisted && "animate-pulse")}
//                 fill={isWishlisted ? "currentColor" : "none"}
//               />
//             </Button>
//           </div>

//           {/* Premium badge */}
//           {/* {product.category === "premium" && (
//             <div className="absolute top-2 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//                 <Sparkles className="h-3 w-3" />
//                 Premium
//               </div>
//             </div>
//           )} */}

//           {/* Quick view overlay */}
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
//             <Button
//               size="sm"
//               className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20 transform scale-75 group-hover:scale-100 transition-transform duration-300"
//               onClick={(e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 onQuickView?.()
//               }}
//             >
//               <Eye className="h-4 w-4 mr-2" />
//               Quick View
//             </Button>
//           </div>
//         </div>

//         <CardContent className="p-4 space-y-3">
//           <CardTitle className="text-lg font-semibold line-clamp-2 text-center leading-tight">
//             <span
//               className="hover:text-red-600 transition-colors duration-300 group-hover:underline decoration-red-600 underline-offset-4">
//               {product.name}
//             </span>
//           </CardTitle>

//           <div className="text-center space-y-1">
//             <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//               {formatPrice(product.minPrice)}
//             </span>
//             <span className="text-xs text-gray-500 block flex items-center justify-center gap-1">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               Starting from 3ml
//             </span>
//           </div>

//           {/* Enhanced Smell Tags for Grid */}
//           {product.accords && product.accords.length > 0 && (
//             <div className="flex flex-wrap justify-center gap-2">
//               {product.accords.slice(0, 3).map((note, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs rounded-full border border-red-100 hover:shadow-md transition-shadow duration-200 cursor-default"
//                 >
//                   {note}
//                 </span>
//               ))}
//               {product.accords.length > 3 && (
//                 <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-default">
//                   +{product.accords.length - 3}
//                 </span>
//               )}
//             </div>
//           )}
//         </CardContent>

//         <CardFooter className="p-4 py-0">
//           <Button
//             className={cn(
//               "w-full h-12 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
//               isAddingToCart
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-gradient-to-r from-red-600 via-red-600 to-pink-600 hover:from-red-700 hover:via-red-700 hover:to-pink-700 text-white hover:shadow-xl hover:shadow-red-500/25"
//             )}
//             onClick={handleAddToCart}
//             disabled={isAddingToCart}
//             aria-label={`Add ${product.name} to cart`}
//           >
//             {isAddingToCart ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                 Adding...
//               </>
//             ) : (
//               <>
//                 <ShoppingCart className="h-5 w-5 mr-2" />
//                 Add to Cart
//               </>
//             )}
//           </Button>
//         </CardFooter>
//       </Card >
//     </Link>
//   )
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { IProductResponse } from "@/types/product.types";

/* -----------------------------------------------------------------------------
  Reference: original UI (kept commented for your reference)
  - This block mirrors the UI structure & classes you provided earlier.
  - It's intentionally commented so you can compare, but the active component below
    uses the same Tailwind + shadcn design and contains the working logic.
----------------------------------------------------------------------------- */

/*

// (Original UI sample — commented)
<Card className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group hover:border-red-200 hover:-translate-y-1">
  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
    <Image src={product.primaryImage} alt={product.name} fill className="object-cover" />
    <div className="absolute top-2 left-3 z-10">
      <Badge>category</Badge>
    </div>
    <div className="absolute top-2 right-3 z-10">
      <Button size="icon"><Heart/></Button>
    </div>
  </div>
  <CardContent className="p-4 space-y-3">
    <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
    <div className="text-center">
      <div className="text-2xl font-bold">৳{product.minPrice}</div>
    </div>
  </CardContent>
  <CardFooter className="p-4">
    <Button className="w-full">Add to Cart</Button>
  </CardFooter>
</Card>

*/

// -------------------- working component --------------------

/**
 * ProductCard
 *
 * Props:
 * - product: IProductResponse (tolerant usage, supports multiple field naming conventions)
 * - layout: "grid" | "list" (controls grid/list UI variations)
 * - showDescription: boolean (if true, shows the short description and notes in list layout)
 * - onQuickView: optional callback for quick view
 *
 * Relies on:
 * - useCart() -> addToCart(product, quantity, selectedSize, selectedPrice)
 * - useWishlist() -> addToWishlist(product), removeFromWishlist(productId), isInWishlist(productId)
 */

const priceFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 0,
});
const formatPriceBDT = (price: number) => priceFormatter.format(price).replace("BDT", "৳");

// Helper: find active discount (variant-first)
function getActiveDiscount(product: any, variant?: any) {
  const now = new Date();
  const discounts = variant?.discounts?.length ? variant.discounts : product?.discounts;
  if (!discounts || discounts.length === 0) return null;
  return discounts.find((d: any) => {
    try {
      const start = d.startDate ?? d.start ?? d.from;
      const end = d.endDate ?? d.end ?? d.to;
      if (!start && !end) return true;
      const s = start ? new Date(start) : new Date(0);
      const e = end ? new Date(end) : new Date(8640000000000000);
      return now >= s && now <= e;
    } catch {
      return false;
    }
  }) || null;
}

// Helper: compute discounted price given discount object
function computeDiscountedPrice(basePrice: number, discount: any) {
  if (!discount) return basePrice;
  if (typeof discount.price === "number") return discount.price;
  // percent-style: supports discount.percent or discount.value or discount.amount
  const percent =
    typeof discount.percent === "number"
      ? discount.percent
      : typeof discount.value === "number"
        ? discount.value
        : typeof discount.amount === "number"
          ? discount.amount
          : null;
  if (percent !== null) {
    const pct = percent <= 1 ? percent * 100 : percent;
    return Math.max(0, Math.round(basePrice * (1 - pct / 100)));
  }
  // fixed amount style
  const amount = discount.amount ?? discount.value;
  if (typeof amount === "number") {
    return Math.max(0, Math.round(basePrice - amount));
  }
  return basePrice;
}

interface ProductCardProps {
  product: IProductResponse;
  className?: string;
  layout?: "grid" | "list";
  showDescription?: boolean;
  onQuickView?: () => void;
}

export function ProductCard({
  product,
  className,
  layout = "grid",
  showDescription = false,
  onQuickView,
}: ProductCardProps) {
  const cart = useCart();
  const wishlist = useWishlist();

  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // tolerant product id
  const productId = (product as any).id ?? (product as any)._id ?? product.slug ?? product.name;

  // category label - handles object or string
  const categoryLabel =
    (product as any).category?.categoryName ?? (product as any).category ?? (product as any).categoryName ?? "product";

  // default variant fallback
  const defaultVariant = useMemo(() => {
    if ((product as any).variants && (product as any).variants.length > 0) return (product as any).variants[0];
    return null;
  }, [product]);

  // discount (variant-first)
  const activeDiscount = useMemo(() => getActiveDiscount(product as any, defaultVariant), [product, defaultVariant]);

  // base price detection
  const basePrice = defaultVariant?.price ?? (product as any).minPrice ?? (product as any).price ?? 0;
  const discountedPrice = activeDiscount ? computeDiscountedPrice(basePrice, activeDiscount) : basePrice;

  // discount percent label
  const discountPercentLabel = useMemo(() => {
    if (!activeDiscount) return null;
    // look for explicit percent-like fields
    const pct = activeDiscount.percent ?? activeDiscount.value ?? activeDiscount.amount;
    if (typeof pct === "number" && pct > 0) {
      const val = pct <= 1 ? Math.round(pct * 100) : Math.round(pct);
      return `-${val}%`;
    }
    // else derive from prices
    if (basePrice > 0 && discountedPrice < basePrice) {
      return `-${Math.round(((basePrice - discountedPrice) / basePrice) * 100)}%`;
    }
    return null;
  }, [activeDiscount, basePrice, discountedPrice]);

  // default size heuristics
  const defaultSize = useMemo(() => {
    if (defaultVariant) {
      if (defaultVariant.size && defaultVariant.unit.toLowerCase()) return `${defaultVariant.size} ${defaultVariant.unit.toLowerCase()}`;
      if (defaultVariant.size) return `${defaultVariant.size}ml`;
    }
    const vp = (product as any).variantPrices;
    if (vp && typeof vp === "object") {
      const keys = Object.keys(vp);
      if (keys.length) return keys[0];
    }
    return null;
  }, [defaultVariant, product]);

  // get all available sizes
  const availableSizes = useMemo(() => {
    // from variants
    if (product.variants?.length) {
      return product.variants.map((v: any) => {
        if (v.size && v.unit.toLowerCase()) return `${v.size}${v.unit.toLowerCase()}`;
        if (v.size) return `${v.size}ml`;
        return null;
      }).filter(Boolean);
    }
    // from variantPrices object
    if ((product as any).variantPrices && typeof (product as any).variantPrices === "object") {
      return Object.keys((product as any).variantPrices);
    }
    return [];
  }, [product]);

  const isWishlisted = wishlist?.isInWishlist?.(productId) ?? false;

  // add to cart — uses discounted price if available
  const handleAddToCart = async (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    setIsAddingToCart(true);
    try {
      const selectedPrice = discountedPrice ?? basePrice;
      // console.log(defaultSize)
      cart?.addToCart?.((product as any) as any, 1, defaultSize, selectedPrice);
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Unable to add to cart");
    } finally {
      setTimeout(() => setIsAddingToCart(false), 700);
    }
  };

  // wishlist toggle
  const handleToggleWishlist = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (!wishlist) return;
    if (isWishlisted) {
      wishlist.removeFromWishlist?.(productId);
      // toast.success("Removed from wishlist");
    } else {
      wishlist.addToWishlist?.(product as any);
      // toast.success("Added to wishlist");
    }
  };

  // productLink
  const productSlug = (product as any).slug ?? (product as any).name?.toLowerCase().replace(/ /g, "-") ?? productId;
  const productLink = `/product/${productSlug}`;

  // ---------------------- LIST layout ----------------------
  if (layout === "list") {
    return (
      // <Card
      //   className={cn(
      //     "w-full overflow-hidden group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-red-200",
      //     className
      //   )}
      // >
      //   <div className="flex flex-row">
      //     <div className="relative aspect-[4/5] w-72 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      //       <Link href={productLink} aria-label={`View ${product.name}`}>
      //         <Image
      //           src={!imageError ? (product as any).primaryImage ?? (product as any).primary_image ?? "/placeholder.svg" : "/placeholder.svg"}
      //           alt={product.name}
      //           fill
      //           sizes="(max-width:600px) 100vw, 320px"
      //           className="object-cover transition-all duration-700 group-hover:scale-110"
      //           onError={() => setImageError(true)}
      //         />
      //       </Link>

      //       {/* discount badge */}
      //       {discountPercentLabel && (
      //         <div className="absolute top-2 left-3 z-10">
      //           <div className="px-2 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">
      //             {discountPercentLabel} OFF
      //           </div>
      //         </div>
      //       )}

      //       {/* wishlist button */}
      //       <div className="absolute top-4 right-4 z-10">
      //         <Button
      //           variant="ghost"
      //           size="icon"
      //           onClick={handleToggleWishlist}
      //           className={cn(
      //             "h-10 w-10 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300",
      //             isWishlisted ? "bg-red-50/90 border-red-200 text-red-600" : "bg-white/80 border-white/50"
      //           )}
      //           aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      //         >
      //           <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
      //         </Button>
      //       </div>
      //     </div>

      //     <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
      //       <div className="space-y-3">
      //         <CardTitle className="text-xl font-bold mb-2 line-clamp-2 leading-tight">
      //           <Link href={productLink} className="hover:text-red-600 transition-colors duration-300">
      //             {product.name}
      //           </Link>
      //         </CardTitle>

      //         <div>
      //           <div className="flex items-baseline justify-start gap-3">
      //             <div className="text-3xl font-bold">{formatPriceBDT(discountedPrice)}</div>
      //             {activeDiscount && <div className="text-sm text-gray-500 line-through">{formatPriceBDT(basePrice)}</div>}
      //           </div>
      //           {/* <p className="text-sm text-gray-500 mt-1">
      //             Starting from {defaultSize}
      //           </p> */}
      //           {/* display available sizes */}
      //           {/* {availableSizes.length > 0 && (
      //             <p className="text-xs text-gray-500">{availableSizes.join(", ")}</p>
      //           )} */}
      //         </div>

      //         {product.accords && product.accords.length > 0 && (
      //           <div className="flex flex-wrap justify-center gap-2">
      //             {product.accords.slice(0, 3).map((note, index) => (
      //               <span
      //                 key={index}
      //                 className="px-2 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs rounded-full border border-red-100 hover:shadow-md transition-shadow duration-200 cursor-default"
      //               >
      //                 {note}
      //               </span>
      //             ))}
      //             {product.accords.length > 3 && (
      //               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-default">
      //                 +{product.accords.length - 3}
      //               </span>
      //             )}
      //           </div>
      //         )}
      //       </div>

      //       <div className="mt-4 flex gap-2">
      //         <Button
      //           variant="outline"
      //           onClick={(e) => {
      //             e.preventDefault();
      //             e.stopPropagation();
      //             window.location.href = productLink;
      //           }}
      //         >
      //           View
      //         </Button>

      //         <Button onClick={handleAddToCart} disabled={isAddingToCart}>
      //           {isAddingToCart ? (
      //             <>
      //               <span className="inline-block w-4 h-4 border-b-2 border-white animate-spin mr-2 rounded-full" />
      //               Adding...
      //             </>
      //           ) : (
      //             <>
      //               <ShoppingCart className="h-4 w-4 mr-2" />
      //               Add to Cart
      //             </>
      //           )}
      //         </Button>
      //       </div>
      //     </div>
      //   </div>
      // </Card>

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
              {product.otherImages && product.otherImages.length > 0 && !imageError && (
                <Image
                  src={product.otherImages[0]}
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
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn("h-5 w-5 transition-all duration-300", isWishlisted && "animate-pulse")}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </Button>
            </div>

            {/* Premium badge */}
            {/* {product.category === "premium" && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Premium
                </div>
              </div>
            )} */}
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold mb-2 leading-tight">
                  <Link href={productLink} className="hover:text-red-600 transition-colors duration-300  decoration-red-600 underline-offset-4">
                    {product.name}
                  </Link>
                </CardTitle>

                <div className="space-y-1">
                  {/* <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPriceBDT(discountedPrice)}
                </p> */}

                  <div className="flex items-baseline justify-center gap-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{formatPriceBDT(discountedPrice)}</div>
                    {activeDiscount && <div className="text-sm text-gray-500 line-through">{formatPriceBDT(basePrice)}</div>}
                  </div>
                </div>
              </div>

              {/* Enhanced Smell Tags */}
              {product.accords && product.accords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.accords.map((note, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs rounded-full border border-red-100 hover:shadow-md transition-shadow duration-200 cursor-default"
                    >
                      {note}
                    </span>
                  ))}
                  {product.accords.length > 6 && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-default">
                      +{product.accords.length - 6} more
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
              {showDescription && product.perfumeNotes && (
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                    Perfume Notes
                    <Star className="h-4 w-4 text-yellow-500" />
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    Top: {product.perfumeNotes.top.join(", ")} <br />
                    Middle: {product.perfumeNotes.middle.join(", ")} <br />
                    Base: {product.perfumeNotes.base.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Add to Cart */}
            <div className="mt-6">
              <Button
                className={cn(
                  "w-full h-12 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
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
    );
  }

  // ---------------------- GRID layout (default) ----------------------
  return (
    <Link href={productLink} aria-label={`View ${product.name}`}>
      <Card
        className={cn(
          "overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 group hover:border-red-200 hover:-translate-y-1",
          className
        )}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={!imageError ? product.primaryImage : "/placeholder.svg?height=256&width=200&text=No+Image"}
              alt={product.name}
              fill
              sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover transition-all duration-700 group-hover:scale-110"
              priority
              onError={() => setImageError(true)}
            />
            {product.otherImages && product.otherImages.length > 0 && !imageError && (
              <Image
                src={product.otherImages[0]}
                alt={`${product.name} - alternate view`}
                fill
                sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
              />
            )}

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Enhanced Wishlist Button */}
            <div className="absolute top-2 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110",
                  isWishlisted
                    ? "bg-red-50/90 border-red-200 text-red-600"
                    : "bg-white/80 border-white/50 hover:bg-red-50 hover:border-red-200"
                )}
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn("h-4 w-4 transition-all duration-300", isWishlisted && "animate-pulse")}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </Button>
            </div>

            {/* Premium badge */}
            {/* {product.category === "premium" && (
            <div className="absolute top-2 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Premium
              </div>
            </div>
          )} */}

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

          {/* discount badge */}
          {discountPercentLabel && (
            <div className="absolute top-2 left-3 z-10">
              <div className="px-2 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">
                {discountPercentLabel} OFF
              </div>
            </div>
          )}

          {/* wishlist */}
          <div className="absolute top-2 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleWishlist();
              }}
              className={cn(
                "h-8 w-8 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300",
                isWishlisted ? "bg-red-50/90 border-red-200 text-red-600" : "bg-white/80 border-white/50"
              )}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
            </Button>
          </div>

          {/* quick view */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView?.();
              }}
              className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20 transform scale-75 group-hover:scale-100 transition-transform duration-300"
            >
              <Eye className="h-4 w-4 mr-2" /> Quick View
            </Button>
          </div>
        </div>

        <CardContent className="px-4 space-y-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-center leading-tight">
            <span className="block">{product.name}</span>
          </CardTitle>

          <div className="text-center space-y-1">
            <div className="flex items-baseline justify-center gap-2">
              <div className="text-2xl font-bold">{formatPriceBDT(discountedPrice)}</div>
              {activeDiscount && <div className="text-sm text-gray-500 line-through">{formatPriceBDT(basePrice)}</div>}
            </div>
            {/* <div className="text-xs text-gray-500"> Starting from {defaultSize}</div> */}
            {/* display available sizes */}
            {/* {availableSizes.length > 0 && (
              <p className="text-xs text-gray-500">{availableSizes.join(", ")}</p>
            )} */}
          </div>

          {/* Enhanced Smell Tags for Grid */}
          {product.accords && product.accords.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {product.accords.slice(0, 3).map((note, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 text-xs rounded-full border border-red-100 hover:shadow-md transition-shadow duration-200 cursor-default"
                >
                  {note}
                </span>
              ))}
              {product.accords.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-default">
                  +{product.accords.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-4 pb-3">
          <Button
            //   className="w-full hover:bg-gray-700"
            //   onClick={(e) => {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     handleAddToCart();
            //   }}
            //   disabled={isAddingToCart}
            // >
            //   {isAddingToCart ? (
            //     <>
            //       <span className="inline-block w-4 h-4 border-b-2 border-white animate-spin rounded-full mr-2" />
            //       Adding...
            //     </>
            //   ) : (
            //     <>
            //       <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            //     </>
            //   )}

            className={cn(
              "w-full h-10 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
              isAddingToCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 via-red-600 to-pink-600 hover:from-red-700 hover:via-red-700 hover:to-pink-700 text-white hover:shadow-xl hover:shadow-red-500/25"
            )}
            onClick={handleAddToCart}
            // disabled={isAddingToCart}
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
      </Card>
    </Link>
  );
}

export default ProductCard;
