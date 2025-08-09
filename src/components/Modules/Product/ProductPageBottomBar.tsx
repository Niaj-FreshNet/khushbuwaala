"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/Data/data";
import { Heart, MessageSquare, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { useProductSelectionOptional } from "@/context/ProductSelectionContext";

export default function ProductPageBottomBar({ product }: { product: Product }) {
    const cart = useCart()
    const sizeKeys = product.variantPrices
        ? Object.keys(product.variantPrices)
        : product.measurement === "ml"
            ? ["3 ml", "6 ml", "12 ml", "25 ml"]
            : ["3 gm", "6 gm", "12 gm"]

    const selection = useProductSelectionOptional();
    const [fallbackSelectedSize, setFallbackSelectedSize] = useState<string>(sizeKeys[0] || "3 ml");
    const [fallbackQuantity, setFallbackQuantity] = useState<number>(1);
    const [fallbackIsWishlisted, setFallbackIsWishlisted] = useState(false);

    const selectedSize = selection?.selectedSize ?? fallbackSelectedSize;
    const setSelectedSize = selection?.setSelectedSize ?? setFallbackSelectedSize;
    const quantity = selection?.quantity ?? fallbackQuantity;
    const setQuantity = selection?.setQuantity ?? setFallbackQuantity;
    const isWishlisted = selection?.isWishlisted ?? fallbackIsWishlisted;
    const toggleWishlist = selection?.toggleWishlist ?? (() => setFallbackIsWishlisted(!fallbackIsWishlisted));

    // Available sizes based on product data
    const availableSizes = sizeKeys;

    // Get current price
    const getCurrentPrice = () => {
        return product.variantPrices?.[selectedSize] || product.price;
    };

    const currentPrice = getCurrentPrice();
    const discountedPrice = product.discount
        ? currentPrice - (currentPrice * product.discount) / 100
        : currentPrice;
    const totalCurrent = currentPrice * (typeof quantity === "number" ? quantity : 1);
    const totalDiscounted = discountedPrice * (typeof quantity === "number" ? quantity : 1);

    const handleQuantityChange = (type: "increment" | "decrement") => {
        const current = typeof quantity === "number" ? quantity : 1;
        const next = type === "increment" ? Math.min(current + 1, 10) : Math.max(current - 1, 1);
        setQuantity(next);
    };

    const isOutOfStock = product.stock === "0";

    return (
        <>
            {/* Universal Sticky CTA */}
            <div id="sticky-cart" className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-xl"></div>

                {/* Shadow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                <div className="relative px-4 py-4 safe-area-bottom">
                    {/* Desktop/Tablet Layout */}
                    <div className="hidden md:block">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                                        <img
                                            src={product.primaryImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                                        <div className="text-2xl font-bold text-gray-900">
                                            ৳{discountedPrice.toLocaleString()}
                                            {(product.discount && discountedPrice !== currentPrice) && (
                                                <span className="text-lg text-gray-500 line-through ml-2">
                                                    ৳{currentPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
            onClick={toggleWishlist} 
            className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-300">
                                    <Heart className="w-5 h-5" />
                                    {isWishlisted ? "Saved" : "Wishlist"}
                                </button>

                                <a
                                    href="https://wa.me/8801566395807"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                                >
                                    <MessageSquare className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                                    Ask Expert
                                </a>

                                <button
                                    disabled={isOutOfStock}
                                    className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                                    onClick={() => {
                                        if (!isOutOfStock) {
                                            cart?.addToCart?.(product as any, quantity, selectedSize)
                                        }
                                    }}
                                >
                                    <ShoppingCart className="w-6 h-6 mr-2" />
                                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                                </button>

                                <button
                                    disabled={isOutOfStock}
                                    onClick={() => {
                                        if (!isOutOfStock) {
                                            cart?.setCheckoutOnlyItem?.(product as any, quantity, selectedSize)
                                        }
                                    }}
                                    className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <Zap className="w-5 h-5" />
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                disabled={isOutOfStock}
                                onClick={() => {
                                    if (!isOutOfStock) {
                                        cart?.addToCart?.(product as any, quantity, selectedSize)
                                    }
                                }}
                                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-4 rounded-2xl font-bold text-center shadow-xl hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                            </button>

                            <button
                                onClick={toggleWishlist}
                                className="w-14 h-14 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all duration-300 touch-manipulation active:scale-95 shadow-lg"
                            >
                                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>

                            <a
                                href="https://wa.me/8801566395807"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-100 transition-all duration-300 touch-manipulation active:scale-95 shadow-lg"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </a>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="text-xs text-gray-500 font-medium">Total Price</div>
                                <div className="text-xl font-bold text-gray-900">
                                    ৳{totalDiscounted.toLocaleString()}
                                    {(product.discount && totalDiscounted !== totalCurrent) && (
                                        <span className="text-sm text-gray-500 line-through ml-2">
                                            ৳{totalCurrent.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={isOutOfStock}
                                onClick={() => {
                                    if (!isOutOfStock) {
                                        cart?.setCheckoutOnlyItem?.(product as any, quantity, selectedSize)
                                    }
                                }}
                                className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Zap className="w-5 h-5" />
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for sticky CTA */}
            < div className="h-24 md:h-28" ></div >
        </>
    )
}