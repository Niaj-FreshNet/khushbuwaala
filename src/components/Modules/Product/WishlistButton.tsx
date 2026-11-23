"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

type Props = {
  product: { id: string; name: string; slug: string; primaryImage: string; minPrice?: number; brand?: string | null };
  categoryName?: string;
  className?: string;
};

/** Save / unsave heart for the product page (cards have their own). */
export default function WishlistButton({ product, categoryName, className }: Props) {
  const wishlist = useWishlist();
  const saved = wishlist.isInWishlist(product.id);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      onClick={() => (saved ? wishlist.removeFromWishlist(product.id) : wishlist.addToWishlist({ ...product, category: { label: categoryName } }))}
      className={cn(
        "min-h-0! flex h-11 w-11 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-transform active:scale-90",
        saved ? "border-red-200 text-red-600" : "border-white/70 text-stone-700 hover:text-red-600",
        className
      )}
    >
      <Heart className={cn("h-5 w-5", saved && "fill-current")} />
    </button>
  );
}
