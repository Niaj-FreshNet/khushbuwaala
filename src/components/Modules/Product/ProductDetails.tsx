"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Tag } from "lucide-react";
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
  };
}

function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);

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

  // Mobile sticky add to cart bar
  const mobileBar = (
    <div className="fixed bottom-0 left-0 md:hidden right-0 z-50 bg-white/95 backdrop-blur shadow-lg border-t border-gray-100 flex justify-between items-center px-4 py-3">
      <div>
        <div className="font-medium text-gray-900 truncate max-w-[120px]">{product.name}</div>
        <span className="text-pink-600 font-bold text-lg">{discountedPrice.toFixed(2)} BDT</span>
      </div>
      <Button
        className="bg-gradient-to-r from-red-600 via-pink-500 to-yellow-400 text-white font-bold px-8 py-3 rounded-xl animate-pulse focus:ring-4 focus:ring-pink-300"
        onClick={() => window.scrollTo({top: 0, left: 0, behavior: "smooth"})}
      >
        <ShoppingCart className="mr-2" /> Add to Cart
      </Button>
    </div>
  );

  return (
    <section aria-labelledby="product-name" className="space-y-7 pb-24 md:pb-0">
      {/* Sticky mobile add-to-cart bar */}
      {mobileBar}
      <h1 id="product-name" className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
        {product.name}
      </h1>
      <div className="flex items-center gap-4 mt-1">
        {product.discount ? (
          <>
            <span className="text-xl text-gray-400 line-through">{variantPrice} BDT</span>
            <span className="text-4xl font-bold text-red-600">{discountedPrice.toFixed(2)} BDT</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">
              <Tag size={16} /> {product.discount}% OFF
            </span>
          </>
        ) : (
          <span className="text-4xl font-bold text-gray-900">{variantPrice} BDT</span>
        )}
      </div>
      <div className="mt-3 text-gray-700 text-lg">
        {showFullDesc ? product.description : truncate(product.description, 140)}{" "}
        {!showFullDesc && product.description.length > 140 && (
          <Button
            onClick={() => setShowFullDesc(true)}
            className="text-red-600 underline font-semibold ml-1"
          >
            Read more
          </Button>
        )}
      </div>
      {/* Sizes with ripple and highlight */}
      <div className="mt-8">
        <div className="font-semibold text-gray-700 mb-2">Size</div>
        <div className="flex gap-3 flex-wrap">
          {sizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={selectedSize === size ? "default" : "outline"}
              className={`shadow ${selectedSize === size
                ? "bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white font-bold scale-105"
                : "text-gray-900 hover:text-pink-700 border-gray-300 bg-white"
                } transition-all duration-200 rounded-lg px-5 py-2`}
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      {/* Quantity spinner */}
      <div className="mt-7 flex items-center gap-4">
        <div className="font-semibold text-gray-700">Quantity</div>
        <div className="flex items-center border rounded-xl overflow-hidden w-max bg-gray-50 shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-xl hover:bg-gray-100 text-gray-700 transition"
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
            className="w-14 text-center border-none focus:outline-none bg-transparent text-xl"
            aria-live="polite"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2 text-xl hover:bg-gray-100 text-gray-700 transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-5 mt-10">
        <Button
          size="lg"
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-pink-500 to-yellow-500 hover:from-red-700 hover:to-pink-600 text-white uppercase font-bold rounded-lg px-10 py-4 text-lg shadow-xl transition-transform hover:-translate-y-1"
          aria-label="Add to cart"
          onClick={() => alert("Added to Cart!")}
        >
          <ShoppingCart /> Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 border-2 border-pink-500 text-pink-700 bg-white/95 hover:bg-pink-50 rounded-lg px-8 py-4 shadow transition"
          aria-label="Add to wishlist"
        >
          <Heart /> Wishlist
        </Button>
      </div>
    </section>
  );
}
