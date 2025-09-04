"use client";
import React, { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/Data/data";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Sparkles, Tag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { IProduct } from "@/types/product.types";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

// Enhanced filtering logic for better product recommendations
const getSmartRelatedProducts = (allProducts: Product[], category: string, currentProductId: string, currentProduct?: Product) => {
  // Filter out current product and get same category products
  const categoryProducts = allProducts.filter(
    (p) => p.category === category && p._id !== currentProductId
  );

  // If we have the current product, try to match by smell/fragrance family
  if (currentProduct && currentProduct.smell && categoryProducts.length > 4) {
    const scentMatches = categoryProducts.filter(p => 
      p.smell && p.smell.some(scent => 
        currentProduct.smell?.includes(scent)
      )
    );
    
    if (scentMatches.length >= 2) {
      // Mix scent matches with random category products
      return [
        ...scentMatches.slice(0, 2),
        ...categoryProducts.filter(p => !scentMatches.includes(p)).slice(0, 2)
      ];
    }
  }

  return categoryProducts.slice(0, 4);
};

const ProductCard = ({ product }: { product: IProduct }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const cart = useCart()
  
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount) / 100 
    : product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-pink-50 via-white to-amber-50">
          <Image
            src={product.primaryImage}
            fill
            alt={`${product.name} - Premium perfume`}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 600px) 50vw, 25vw"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Tag size={12} />
              {product.discount}% OFF
            </div>
          )}

          {/* Premium Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Sparkles size={10} />
            Premium
          </div>

          {/* Quick Actions Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
                className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isLiked 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-pink-500 hover:text-white'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Choose default size: first variant key or fallback measurement-based default
                  const sizeKeys = product.variantPrices ? Object.keys(product.variantPrices) : []
                  const defaultSize = sizeKeys[0] || (product.measurement === 'ml' ? '3 ml' : '3 gm')
                  cart?.addToCart?.(product, 1, defaultSize)
                }}
                className="p-3 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-full backdrop-blur-sm hover:from-pink-700 hover:to-red-600 transition-all duration-200 shadow-lg"
                aria-label="Add to cart"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>

          {/* View Product Label */}
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <span className="bg-white/95 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm flex items-center gap-2">
              View Details
              <ArrowRight size={14} />
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-3">
          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>

          {/* Fragrance Family */}
          {product.smell && product.smell.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.smell.slice(0, 2).map((scent, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                >
                  {scent}
                </span>
              ))}
              {product.smell.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{product.smell.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {product.discount ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    {discountedPrice.toFixed(0)} BDT
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.price} BDT
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {product.price} BDT
                </span>
              )}
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">4.5</span>
              </div>
            </div>

            {/* Savings */}
            {product.discount && (
              <p className="text-xs text-green-600 font-medium">
                Save {(product.price - discountedPrice).toFixed(0)} BDT
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className={`text-xs font-medium ${
              product.stock === "0" 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {product.stock === "0" ? 'Out of Stock' : 'In Stock'}
            </span>
            
            <span className="text-xs text-gray-500">
              {product.measurement === 'ml' ? 'Multiple sizes' : 'Standard size'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const allProducts = await getProducts();
        const current = allProducts.find(p => p._id === currentProductId);
        setCurrentProduct(current || null);
        
        const related = getSmartRelatedProducts(allProducts, category, currentProductId, current);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRelated();
  }, [category, currentProductId]);

  if (loading) {
    return (
      <section className="mt-10 max-w-screen-full mx-auto px-4 lg:px-8">
        <div className="h-8 w-48 bg-gray-300 rounded mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!relatedProducts.length) return null;

  const categoryDisplayName = {
    'inspiredPerfumeOil': 'Inspired Perfume Oils',
    'artificialOud': 'Artificial Oud Collection',
    'naturalCollection': 'Natural Collection',
    'orientalCollection': 'Oriental Collection',
    'forWomen': 'Women\'s Fragrances',
    'giftsAndPackages': 'Gift Sets',
    'newArrivals': 'New Arrivals',
  }[category] || 'Related Products';

  return (
    <section
      aria-label="Related products"
      className="mt-10 max-w-screen-full mx-auto px-4 lg:px-8"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            You May Also Like
          </h2>
          <p className="text-gray-600">
            More beautiful fragrances from our {categoryDisplayName.toLowerCase()}
          </p>
        </div>
        
        <Link 
          href={`/${category.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
          className="hidden md:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition-colors group"
        >
          View All
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="md:hidden text-center">
        <Link 
          href={`/${category.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-red-600 transition-all duration-200 shadow-lg"
        >
          View All {categoryDisplayName}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Enhanced Trust Section */}
      {/* <div className="mt-12 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-2xl p-8 border border-pink-100">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Star size={16} className="text-white" />
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-white" />
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Why Choose KhushbuWaala?
          </h3>
          <p className="text-gray-600 mb-4">
            Authentic fragrances, fast delivery, and guaranteed quality. Join thousands of satisfied customers across Bangladesh.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              100% Authentic
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Fast Delivery
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Premium Quality
            </div>
            <div className="flex items-center gap-2 text-indigo-700">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Easy Returns
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
}
