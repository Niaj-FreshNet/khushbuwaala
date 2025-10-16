"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Tag, Shield, Truck, Clock, Star, Award, Sparkles, Zap, CheckCircle, Minus, Plus, Info, Gift, Crown, FileCheck, Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useProductSelectionOptional } from "@/context/ProductSelectionContext";
import { IDiscount, IProduct, IProductVariant } from "@/types/product.types";
// import { useWishlist } from "@/context/WishlistContext";

interface ProductDetailsProps {
  product: Partial<IProduct>;
  onReadMore?: () => void;
}

export default function ProductDetails({ product, onReadMore }: ProductDetailsProps) {
  const cart = useCart()
  // const sizeKeys = product.variantPrices
  //   ? Object.keys(product.variantPrices).filter(
  //     size => !(product.measurement === "ml" && size.trim().toLowerCase() === "100 ml")
  //   )
  //   : product.measurement === "ml"
  //     ? ["3 ml", "6 ml", "12 ml", "25 ml"]
  //     : ["3 gm", "6 gm", "12 gm"];

  const sizeKeys = product.variants?.length
    ? product.variants.map(v => `${v.size} ${v.unit.toLowerCase()}`)
    : ["3 ml", "6 ml", "12 ml", "25 ml"]
  // : product.measurement === "ml"
  // ? ["3 ml", "6 ml", "12 ml", "25 ml"]
  // : ["3 gm", "6 gm", "12 gm"];

  const selection = useProductSelectionOptional();
  // const wishlist = useWishlist();
  const [fallbackSelectedSize, setFallbackSelectedSize] = useState<string>(sizeKeys[0] || "3 ml");
  const [fallbackQuantity, setFallbackQuantity] = useState<number>(1);
  const [fallbackIsWishlisted, setFallbackIsWishlisted] = useState(false);

  // const selectedSize = selection?.selectedSize ?? fallbackSelectedSize;
  // const setSelectedSize = selection?.setSelectedSize ?? setFallbackSelectedSize;
  const quantity = selection?.quantity ?? fallbackQuantity;
  const setQuantity = selection?.setQuantity ?? setFallbackQuantity;

  const selectedSize = selection?.selectedVariant
    ? `${selection.selectedVariant.size} ${selection.selectedVariant.unit.toLowerCase()}`
    : fallbackSelectedSize;

  const price = selection?.selectedVariant
    ? `${selection.selectedVariant.price}`
    : 0;

  const selectedPrice = Number(price)
  // console.log(selectedPrice)

  // 🧩 Dynamically find the selected variant and its price
  // const selectedVariant =
  //   product.variants?.find(
  //     (v) => `${v.size} ${v.unit.toLowerCase()}` === selectedSize
  //   ) || null;

  // const selectedPrice = selectedVariant?.price ?? 0; // ✅ selected variant price (default 0 if none found)
  // console.log('selectedPrice: ', selectedPrice) ///showing the price in console

  const setSelectedSize = (size: string) => {
    if (!selection) return setFallbackSelectedSize(size);

    const variant = product.variants?.find(
      (v) => `${v.size} ${v.unit.toLowerCase()}` === size
    );
    if (variant) selection.setSelectedVariant(variant);
  };

  // const isWishlisted = wishlist?.isInWishlist(product._id) ?? (selection?.isWishlisted ?? fallbackIsWishlisted);
  // const toggleWishlist = () => {
  //   if (wishlist) {
  //     if (wishlist.isInWishlist(product._id)) {
  //       wishlist.removeFromWishlist(product._id)
  //     } else {
  //       wishlist.addToWishlist(product as any)
  //     }
  //     return
  //   }
  //   // fallback local toggle (should rarely happen as provider is global)
  //   const toggle = selection?.toggleWishlist ?? (() => setFallbackIsWishlisted(!fallbackIsWishlisted))
  //   toggle()
  // }

  // Available sizes based on product data
  const availableSizes = sizeKeys;

  // Get current variant
  const getCurrentVariant = () => {
    return product.variants?.find(
      v => `${v.size} ${v.unit.toLowerCase()}` === selectedSize
    );
  };

  const currentVariant = getCurrentVariant();
  const currentPrice = currentVariant?.price ?? product.minPrice ?? 0;

  // Get active discount (checks dates, variant first)
  const getActiveDiscount = (
    product: Partial<IProduct>,
    variant?: IProductVariant
  ): IDiscount | null => {
    const now = new Date();
    const discounts = variant?.discounts?.length
      ? variant.discounts
      : product.discounts;

    if (!discounts || discounts.length === 0) return null;

    return discounts.find(d => {
      const startOk = !d.startDate || new Date(d.startDate) <= now;
      const endOk = !d.endDate || new Date(d.endDate) >= now;
      return startOk && endOk;
    }) || null;
  };

  const discount = getActiveDiscount(product, currentVariant);

  let discountedPrice = currentPrice;

  if (discount) {
    if (discount.type === "percentage") {
      discountedPrice = currentPrice - (currentPrice * discount.value) / 100;
    } else if (discount.type === "fixed") {
      discountedPrice = currentPrice - discount.value;
    }
  }

  // Final totals
  const totalCurrent = currentPrice * quantity;
  const totalDiscounted = discountedPrice * quantity;

  const activeDiscount = getActiveDiscount(product, currentVariant);

  const discountValue = activeDiscount?.type === "percentage"
    ? activeDiscount.value
    : 0;

  const handleQuantityChange = (type: "increment" | "decrement") => {
    const next = type === "increment"
      ? Math.min(quantity + 1, 10)
      : Math.max(quantity - 1, 1);
    setQuantity(next);
  };



  // const totalVariantStock = product.variants?.reduce(
  //   (sum, v) => sum + (v.stock ?? 0),
  //   0
  // );

  // const isOutOfStock = (product.totalStock ?? 0) <= 0 || (totalVariantStock ?? 0) <= 0;
  const isOutOfStock = (product.totalStock ?? 0) <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    cart?.addToCart?.(product as any, quantity, selectedSize, selectedPrice);
  };


  return (
    <div className="space-y-8 lg:space-y-10">``
      {/* Header Section */}
      <div className="space-y-6">
        {/* Brand and Category Tags */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* {product.brand && (
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-semibold">
              <Crown className="w-3 h-3 mr-2" />
              {product.brand}
            </Badge>
          )}
          {product.specification && (
            <Badge variant="outline" className="border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium">
              For {product.specification === 'male' ? 'Men' : 'Women'}
            </Badge>
          )} */}
          {/* {product.discount && product.discount > 0 ? (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 animate-pulse shadow-lg">
              <Tag className="w-3 h-3 mr-2" />
              {product.discount}% OFF
            </Badge>
          ) : null} */}
          {activeDiscount ? (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 animate-pulse shadow-lg">
              <Tag className="w-3 h-3 mr-2" />
              {activeDiscount.type === "percentage"
                ? `${activeDiscount.value}% OFF`
                : `৳${activeDiscount.value} OFF`}
            </Badge>
          ) : null}
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            {product.name}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Rating and Stock Status */}
        {/* <div className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-bold text-lg">4.5</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">127 reviews</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">In Stock</span>
          </div>
        </div> */}

        {/* Price Section */}
        <div className="relative p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border border-blue-100 shadow-lg overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative space-y-4">
            <div className="flex items-baseline gap-4 flex-wrap">
              {/* {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    ৳{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  ৳{currentPrice.toLocaleString()}
                </span>
              )} */}
              {activeDiscount ? (
                <>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    ৳{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  ৳{currentPrice.toLocaleString()}
                </span>
              )}
            </div>

            {discount ? (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-green-600 font-bold text-lg">
                    You save ৳{(currentPrice - discountedPrice).toLocaleString()}
                  </div>
                  <div className="text-green-700 text-sm">
                    {discount.type === "percentage"
                      ? `That's ${discount.value}% off the regular price!`
                      : `That's ৳${discount.value.toLocaleString()} off the regular price!`}
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-lg font-bold shadow-lg">
                  {discount.type === "percentage"
                    ? `${discount.value}% OFF`
                    : `৳${discount.value} OFF`}
                </Badge>
              </div>
            ) : null}

          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div> */}
          <h3 className="text-xl font-bold text-gray-900">Description</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {(() => {
              const description = product.description || "Experience the luxury of premium fragrances with this exquisite perfume. Crafted with the finest ingredients, this fragrance offers a captivating blend of notes that will leave a lasting impression. Perfect for those who appreciate the finer things in life.";
              const words = description.split(' ');
              const truncatedDescription = words.slice(0, 25).join(' ');

              if (words.length > 25) {
                return (
                  <>
                    {truncatedDescription}...
                    <button
                      onClick={onReadMore}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200"
                    >
                      Read more
                    </button>
                  </>
                );
              }

              return description;
            })()}
          </p>
        </div>
      </div>

      {/* Fragrance Notes */}
      {product.accords && product.accords.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl border border-purple-100 shadow-sm">
          <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            Fragrance
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.accords.map((note, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/70 text-purple-700 rounded-full text-sm font-medium border border-purple-200 hover:bg-purple-100 transition-colors duration-200 cursor-default"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-6 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Choose Size</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedSize === size
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-xl scale-105 ring-2 ring-blue-200"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg"
                }`}
            >
              {selectedSize === size && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="text-center">
                <div className="font-bold text-lg">{size}</div>
                {/* {product.variantPrices?.[size] && (
                  <div className={`text-sm font-medium ${selectedSize === size ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                    ৳{product.variantPrices[size].toLocaleString()}
                  </div>
                )} */}
                {/* {product.variants
                  ?.filter(v => `${v.size} ${v.unit.toLowerCase()}` === selectedSize)
                  .map(v => (
                    <div
                      key={v.id}
                      className={`text-sm font-medium ${selectedSize === `${v.size} ${v.unit.toLowerCase()}`
                          ? 'text-blue-600'
                          : 'text-gray-500'
                        }`}
                    >
                      ৳{v.price.toLocaleString()}
                    </div>
                  ))} */}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="space-y-6 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quantity</h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 font-medium">Total</div>
            <div className="text-2xl font-bold text-gray-900">৳{(discountedPrice * quantity).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-gray-50 shadow-inner">
            <button
              onClick={() => handleQuantityChange("decrement")}
              disabled={quantity <= 1}
              className="p-4 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-gray-100 rounded-l-xl"
            >
              <Minus className="w-6 h-6" />
            </button>
            <div className="px-8 py-4 bg-white border-x border-gray-200">
              <span className="font-bold text-gray-900 text-2xl">{quantity}</span>
            </div>
            <button
              onClick={() => handleQuantityChange("increment")}
              disabled={quantity >= 10}
              className="p-4 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-gray-100 rounded-r-xl"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Fragrance Performance */}
      {/* <div className="p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl border border-amber-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-800">Fragrance Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white/50 rounded-2xl">
            <div className="text-2xl font-bold text-amber-700 mb-1">8-12hrs</div>
            <div className="text-sm text-amber-600 font-medium">Longevity</div>
            <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full w-[85%] transition-all duration-500"></div>
            </div>

          </div>
          <div className="text-center p-4 bg-white/50 rounded-2xl">
            <div className="text-2xl font-bold text-amber-700 mb-1">Moderate</div>
            <div className="text-sm text-amber-600 font-medium">Projection</div>
            <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full w-[75%] transition-all duration-500"></div>
            </div>

          </div>
          <div className="text-center p-4 bg-white/50 rounded-2xl">
            <div className="text-2xl font-bold text-amber-700 mb-1">Good</div>
            <div className="text-sm text-amber-600 font-medium">Sillage</div>
            <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full w-[80%] transition-all duration-500"></div>
            </div>

          </div>
        </div>

        <div className="flex items-center justify-center mt-6 gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-current' : 'text-amber-200'}`} />
            ))}
          </div>
          <span className="text-sm font-bold text-amber-700 ml-2">4.5 Overall Rating</span>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div id="action-buttons" className="space-y-6">
        {/* Primary CTA */}
        <Button
          // size="xl"
          disabled={isOutOfStock}
          className={`w-full h-16 text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-[1.02] ${isOutOfStock
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white border-0 shadow-blue-500/30 hover:shadow-blue-600/50"
            } rounded-2xl`}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-6 h-6 mr-3" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-6">
          {/* <Button
            variant="outline"
            size="lg"
            onClick={toggleWishlist}
            className={`h-14 text-lg font-bold border-2 transition-all duration-300 transform hover:scale-[1.02] rounded-2xl ${isWishlisted
              ? "border-red-500 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 hover:bg-red-100 shadow-lg"
              : "border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 hover:shadow-lg"
              }`}
          >
            <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
            {isWishlisted ? "Saved" : "Wishlist"}
          </Button> */}

          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-14 text-lg font-bold border-2 border-green-300 bg-white text-green-700 hover:border-green-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-800 transition-all duration-300 transform hover:scale-[1.02] rounded-2xl hover:shadow-lg"
          >
            <a href="https://wa.me/8801566395807" target="_blank" rel="noopener noreferrer">
              <MessageSquare className="w-5 h-5 mr-2" />
              Ask Expert
            </a>
          </Button>
        </div>

        {/* Buy Now Button */}
        <Button
          // size="xl"
          disabled={isOutOfStock}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-2xl shadow-orange-500/30 hover:shadow-orange-600/50 transform transition-all duration-300 hover:scale-[1.02] border-0 rounded-2xl"
          onClick={() => {
            if (!isOutOfStock) {
              cart?.setCheckoutOnlyItem?.(product as any, quantity, selectedSize, selectedPrice)
              // Navigate to checkout is handled by pages that observe checkoutMode
            }
          }}
        >
          <Zap className="w-6 h-6 mr-3" />
          Buy Now - Express Checkout
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="font-semibold text-emerald-800 text-sm">100% Authentic</div>
            <div className="text-xs text-emerald-600">Guaranteed Original</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-blue-800 text-sm">Fast Delivery</div>
            <div className="text-xs text-blue-600">1-2 Days</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
            <FileCheck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="font-semibold text-purple-800 text-sm">Premium Quality</div>
            <div className="text-xs text-purple-600">Best Ingredients</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="font-semibold text-indigo-800 text-sm">7 Day Return</div>
            <div className="text-xs text-indigo-600">Easy Returns</div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      {/* <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Delivery & Returns
        </h3>
        <div className="space-y-3 text-blue-700">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Free delivery within 2-3 days inside Dhaka</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl">
            <Truck className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">৳60 delivery charge outside Dhaka (3-5 days)</span>
            </div>
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">7-day return policy for unused products</span>
              </div>
          </div>
      </div> */}

      {/* Urgency Indicator */}
      {/* <div className="relative p-6 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 rounded-2xl border-2 border-red-200 shadow-lg overflow-hidden"> */}
      {/* Animated background */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-orange-100/50 animate-pulse"></div>

        <div className="relative flex items-center justify-center gap-3 text-red-700">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 animate-pulse" />
            <span className="text-2xl animate-bounce">🔥</span>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">Only 3 left in stock!</div>
            <div className="text-sm text-red-600 font-medium">Order now to secure yours</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
