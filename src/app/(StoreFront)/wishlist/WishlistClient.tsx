"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ReusableUI/ProductCard";
import { Separator } from "@/components/ui/separator";
import { Heart, Grid2X2, Grid3X3, Grid, Trash2, ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";

export default function WishlistClient() {
  const wishlist = useWishlist();
  const cart = useCart();
  const [columns, setColumns] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setColumns(4);
      else if (window.innerWidth >= 640) setColumns(2);
      else setColumns(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridClass = useMemo(() => {
    switch (columns) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      default: return "grid-cols-5";
    }
  }, [columns]);

  const handleAddAllToCart = () => {
    if (!wishlist) return
    wishlist.wishlistItems.forEach(item => {
      const defaultSize = "3 ml";
      cart?.addToCart?.({
        _id: item.id,
        name: item.name,
        price: item.price,
        primaryImage: item.image,
        smell: [],
        category: "wishlist",
      } as any, 1, defaultSize)
    })
  }

  if (!wishlist) return null;

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center text-white shadow-sm">
              <Heart className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Wishlist</h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" onClick={() => setColumns(2)}><Grid2X2 className="w-4 h-4 mr-2"/>2</Button>
            <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setColumns(3)}><Grid3X3 className="w-4 h-4 mr-2"/>3</Button>
            <Button variant="outline" className="hidden lg:inline-flex" onClick={() => setColumns(4)}><Grid className="w-4 h-4 mr-2"/>4</Button>
          </div>
        </div>

        <Separator className="my-6" />

        {wishlist.wishlistItems.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Saved items: <span className="font-semibold text-gray-900">{wishlist.wishlistItems.length}</span></p>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={wishlist.clearWishlist}>
                  <Trash2 className="w-4 h-4 mr-2" /> Clear wishlist
                </Button>
                <Button onClick={handleAddAllToCart} className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add all to cart
                </Button>
              </div>
            </div>

            <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
              {wishlist.wishlistItems.map((item) => (
                <div key={item.id} className="group relative">
                  <ProductCard
                    product={{
                      _id: item.id,
                      name: item.name,
                      price: item.price,
                      primaryImage: item.image,
                      smell: [],
                      category: "wishlist",
                    }}
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => wishlist.removeFromWishlist(item.id)}
                      className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 border-white/60"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center text-red-500 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-6">Your wishlist is empty</h2>
            <p className="text-gray-600 mt-2 max-w-md">Explore our collection and add your favorite fragrances to your wishlist to view or buy them later.</p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/shop" className="inline-flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <ShoppingCart className="w-4 h-4 mr-2" /> Browse Collection
              </Link>
              <Link href="/" className="inline-flex items-center px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


