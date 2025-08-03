"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Tag, Shield, Truck, Clock, Star, Award, Sparkles, Zap, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductDetailsProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    discount?: number;
    variantPrices?: { [size: string]: number };
    measurement?: string;
    slug?: string;
    smell?: string[];
    notes?: string;
    specification?: string;
    origin?: string;
    brand?: string;
    stock?: string;
  };
}

function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Perfume longevity mapping
const getLongevityInfo = (category: string, measurement?: string) => {
  if (measurement === 'ml') {
    return {
      duration: '6-8 hours',
      projection: 'Moderate to Strong',
      sillage: 'Good',
      rating: 4.5
    };
  }
  return {
    duration: '4-6 hours', 
    projection: 'Moderate',
    sillage: 'Moderate',
    rating: 4.0
  };
};

// Trust badges for perfume authenticity
const TrustBadges = () => (
  <div className="grid grid-cols-2 gap-3 mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
    <div className="flex items-center gap-2 text-sm">
      <Shield className="w-4 h-4 text-green-600" />
      <span className="text-green-700 font-medium">Authentic Quality</span>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <Truck className="w-4 h-4 text-blue-600" />
      <span className="text-blue-700 font-medium">Fast Delivery</span>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <Award className="w-4 h-4 text-purple-600" />
      <span className="text-purple-700 font-medium">Premium Brand</span>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle className="w-4 h-4 text-indigo-600" />
      <span className="text-indigo-700 font-medium">7 Day Return</span>
    </div>
  </div>
);

// Fragrance strength indicator
const FragranceStrength = ({ measurement }: { measurement?: string }) => {
  const strength = measurement === 'ml' ? 4 : 3;
  const maxStrength = 5;
  
  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-amber-800">Fragrance Intensity</span>
        <span className="text-sm text-amber-700">{strength}/5</span>
      </div>
      <div className="flex gap-1">
        {[...Array(maxStrength)].map((_, i) => (
          <div 
            key={i}
            className={`h-2 flex-1 rounded ${
              i < strength 
                ? 'bg-gradient-to-r from-amber-400 to-orange-400' 
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-amber-700 mt-1">
        {strength >= 4 ? 'Strong & Long-lasting' : 'Moderate & Balanced'}
      </p>
    </div>
  );
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  const sizes =
    product.measurement === "ml"
      ? ["3 ml", "6 ml", "12 ml", "25 ml"]
      : product.measurement === "gm"
      ? ["3 gm", "6 gm", "12 gm"]
      : ["1 piece"];

  const basePrice = product.price;
  const variantPrice = selectedSize
    ? product.variantPrices?.[selectedSize] ?? basePrice
    : basePrice;

  const discountedPrice = product.discount
    ? variantPrice - (variantPrice * product.discount) / 100
    : variantPrice;

  const longevityInfo = getLongevityInfo(product.measurement || '', product.measurement);
  const savings = product.discount ? variantPrice - discountedPrice : 0;

  // Mobile sticky add to cart bar
  const mobileBar = (
    <div className="fixed bottom-0 left-0 md:hidden right-0 z-50 bg-white/95 backdrop-blur-md shadow-2xl border-t border-pink-100 p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 mr-4">
          <div className="font-bold text-gray-900 truncate text-lg">{product.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-pink-600 font-bold text-xl">{discountedPrice.toFixed(0)} BDT</span>
            {product.discount && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-pink-600 via-red-500 to-orange-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          onClick={() => window.scrollTo({top: 0, left: 0, behavior: "smooth"})}
        >
          <ShoppingCart className="mr-2 w-5 h-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );

  return (
    <section aria-labelledby="product-name" className="space-y-8 pb-24 md:pb-0">
      {/* Sticky mobile add-to-cart bar */}
      {mobileBar}
      
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 id="product-name" className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            {/* Brand and Origin */}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {product.brand && (
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {product.brand}
                </span>
              )}
              {product.origin && (
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Origin: {product.origin}
                </span>
              )}
            </div>

            {/* Fragrance Family */}
            {product.smell && product.smell.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {product.smell.map((scent, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                  >
                    {scent}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock === "0" 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {product.stock === "0" ? 'Out of Stock' : 'In Stock'}
            </div>
            
            {/* Rating Display */}
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.floor(longevityInfo.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">({longevityInfo.rating})</span>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-gray-50 to-pink-50 p-6 rounded-2xl border border-pink-100">
          <div className="flex items-center gap-4 mb-2">
            {product.discount ? (
              <>
                <span className="text-2xl text-gray-400 line-through font-medium">{variantPrice} BDT</span>
                <span className="text-4xl font-bold text-red-600">{discountedPrice.toFixed(0)} BDT</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-red-500 text-white font-bold rounded-full text-sm shadow-lg">
                    <Tag size={16} /> 
                    SAVE {product.discount}%
                  </span>
                </div>
              </>
            ) : (
              <span className="text-4xl font-bold text-gray-900">{variantPrice} BDT</span>
            )}
          </div>
          
          {savings > 0 && (
            <p className="text-green-700 font-medium text-sm">
              You save {savings.toFixed(0)} BDT with this offer!
            </p>
          )}

          {/* Performance Indicators */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-pink-200">
            <div className="text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Longevity</div>
              <div className="font-semibold text-sm">{longevityInfo.duration}</div>
            </div>
            <div className="text-center">
              <Zap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Projection</div>
              <div className="font-semibold text-sm">{longevityInfo.projection}</div>
            </div>
            <div className="text-center">
              <Sparkles className="w-5 h-5 text-pink-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Sillage</div>
              <div className="font-semibold text-sm">{longevityInfo.sillage}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">About This Fragrance</h2>
        <div className="text-gray-700 text-base leading-relaxed">
          {showFullDesc ? product.description : truncate(product.description, 180)}
          {!showFullDesc && product.description.length > 180 && (
            <button
              onClick={() => setShowFullDesc(true)}
              className="text-pink-600 hover:text-pink-700 underline font-semibold ml-2 transition-colors"
            >
              Read more
            </button>
          )}
        </div>
        
        {/* Fragrance Notes */}
        {product.notes && (
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">Fragrance Notes</h3>
            <p className="text-indigo-700 text-sm leading-relaxed">{product.notes}</p>
          </div>
        )}
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-lg">Size Options</h3>
          <span className="text-sm text-gray-600">Choose your preferred size</span>
        </div>
        
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
          {sizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={selectedSize === size ? "default" : "outline"}
              className={`relative overflow-hidden transition-all duration-300 h-14 ${
                selectedSize === size
                  ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white font-bold scale-105 shadow-lg ring-4 ring-pink-300/50"
                  : "text-gray-900 hover:text-pink-700 border-2 border-gray-300 bg-white hover:border-pink-300 hover:shadow-md"
              }`}
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
            >
              <span className="relative z-10">{size}</span>
              {selectedSize === size && (
                <div className="absolute top-1 right-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </Button>
          ))}
        </div>
        
        {selectedSize && (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            Selected: <span className="font-semibold">{selectedSize}</span> - Perfect for {
              selectedSize.includes('3') ? 'trying out the fragrance' :
              selectedSize.includes('6') ? 'travel and daily touch-ups' :
              selectedSize.includes('12') ? 'regular daily use' :
              'extended use and best value'
            }
          </p>
        )}
      </div>

      {/* Quantity Selection */}
      <div className="flex items-center gap-6">
        <h3 className="font-semibold text-gray-900">Quantity</h3>
        <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-pink-300 transition-colors">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 text-xl hover:bg-gray-100 text-gray-700 transition-colors font-bold"
            aria-label="Decrease quantity"
          >
            –
          </button>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-16 text-center border-none focus:outline-none bg-transparent text-xl font-semibold py-3"
            aria-live="polite"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-3 text-xl hover:bg-gray-100 text-gray-700 transition-colors font-bold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Fragrance Strength Indicator */}
      <FragranceStrength measurement={product.measurement} />

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            disabled={product.stock === "0"}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 via-red-500 to-orange-400 hover:from-pink-700 hover:via-red-600 hover:to-orange-500 text-white font-bold rounded-xl px-8 py-4 text-lg shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
            onClick={() => alert("Added to Cart!")}
          >
            <ShoppingCart className="w-6 h-6" />
            {product.stock === "0" ? "Out of Stock" : "Add to Cart"}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className={`flex items-center justify-center gap-3 border-2 rounded-xl px-6 py-4 shadow-md transition-all duration-300 ${
              addedToWishlist
                ? "border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100"
                : "border-pink-300 text-pink-700 bg-white hover:bg-pink-50 hover:border-pink-400"
            }`}
            aria-label="Add to wishlist"
            onClick={() => setAddedToWishlist(!addedToWishlist)}
          >
            <Heart className={`w-5 h-5 ${addedToWishlist ? 'fill-current' : ''}`} />
            {addedToWishlist ? "Added to Wishlist" : "Add to Wishlist"}
          </Button>
        </div>
        
        {/* Total Price Display */}
        {quantity > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-medium">
                Total for {quantity} items:
              </span>
              <span className="text-2xl font-bold text-blue-900">
                {(discountedPrice * quantity).toFixed(0)} BDT
              </span>
            </div>
            {product.discount && (
              <div className="text-sm text-blue-700 mt-1">
                You save {(savings * quantity).toFixed(0)} BDT in total!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust Signals */}
      <TrustBadges />

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Why Choose KhushbuWaala?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">100% Authentic</div>
              <div className="text-gray-600">Genuine fragrances only</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Fast Delivery</div>
              <div className="text-gray-600">2-3 days across Bangladesh</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Premium Quality</div>
              <div className="text-gray-600">Carefully curated collection</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Easy Returns</div>
              <div className="text-gray-600">7-day return policy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
