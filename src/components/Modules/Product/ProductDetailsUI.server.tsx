import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Tag,
  Shield,
  Truck,
  CheckCircle,
  Minus,
  Plus,
  Gift,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IProduct, IProductVariant, IDiscount } from "@/types/product.types";

type Props = {
  product: Partial<IProduct>;
  // computed
  discount: IDiscount | null;
  discountedPrice: number;
  currentPrice: number;
  quantity: number;
  isOutOfStock: boolean;
  selectedSizeLabel: string;
  availableVariants: IProductVariant[];

  // handlers (from client)
  onReadMore?: () => void;
  onSelectVariant: (variant: IProductVariant) => void;
  onQtyDec: () => void;
  onQtyInc: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;

  isAddingToCart: boolean;
  isBuyingNow: boolean;
  isPending: boolean;
};

export default function ProductDetailsUI({
  product,
  discount,
  discountedPrice,
  currentPrice,
  quantity,
  isOutOfStock,
  selectedSizeLabel,
  availableVariants,
  onReadMore,
  onSelectVariant,
  onQtyDec,
  onQtyInc,
  onAddToCart,
  onBuyNow,
  isAddingToCart,
  isBuyingNow,
  isPending,
}: Props) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Discount Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {discount && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 animate-pulse shadow-md">
              <Tag className="w-3 h-3 mr-2" />
              {discount.type === "percentage"
                ? `${discount.value}% OFF`
                : `৳${discount.value} OFF`}
            </Badge>
          )}
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            {product.name}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Price Section */}
        <div className="relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100 shadow-none overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative space-y-4">
            <div className="flex items-baseline gap-4 flex-wrap">
              {discount ? (
                <>
                  <span className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900">
                    ৳{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900">
                  ৳{currentPrice.toLocaleString()}
                </span>
              )}
            </div>

            {discount && (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-green-600 font-bold text-lg">
                    You save ৳{(currentPrice - discountedPrice).toLocaleString()}
                  </div>
                  <div className="text-green-700 text-sm">
                    {discount.type === "percentage"
                      ? `That's ${discount.value}% off!`
                      : `That's ৳${discount.value.toLocaleString()} off!`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-none">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {(() => {
              const description =
                product.description || "Experience luxury with this premium fragrance.";
              const words = description.split(" ");
              const truncated = words.slice(0, 25).join(" ");

              if (words.length > 25) {
                return (
                  <>
                    {truncated}...
                    <button
                      onClick={onReadMore}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-semibold hover:underline"
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
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            Fragrance
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.accords.map((note, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/70 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-6 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Choose Size</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableVariants.map((variant) => {
            const label = `${variant.size} ${variant.unit.toLowerCase()}`;
            const isSelected = selectedSizeLabel === label;

            return (
              <button
                key={variant.id}
                onClick={() => onSelectVariant(variant)}
                className={cn(
                  "group relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105",
                  isSelected
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-md ring-2 ring-blue-200"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                )}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="text-center">
                  <div className="font-bold text-lg">{label}</div>
                  <div className="text-sm text-gray-500">
                    ৳{variant.price.toLocaleString()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quantity</h3>
          </div>

          <div className="hidden md:flex items-center border-2 border-gray-200 rounded-2xl bg-gray-50">
            <button
              onClick={onQtyDec}
              disabled={quantity <= 1}
              className="p-4 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-l-xl"
            >
              <Minus className="w-6 h-6" />
            </button>
            <div className="px-8 py-4 bg-white border-x border-gray-200">
              <span className="font-bold text-gray-900 text-2xl">{quantity}</span>
            </div>
            <button
              onClick={onQtyInc}
              disabled={quantity >= 10}
              className="p-4 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-r-xl"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600 font-medium">Total</div>
            <div className="text-2xl font-bold text-gray-900">
              ৳{(discountedPrice * quantity).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-center mt-4">
          <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-gray-50">
            <button
              onClick={onQtyDec}
              disabled={quantity <= 1}
              className="p-4 text-gray-600 hover:text-gray-800 disabled:opacity-50 rounded-l-xl"
            >
              <Minus className="w-6 h-6" />
            </button>
            <div className="px-8 py-4 bg-white border-x border-gray-200">
              <span className="font-bold text-gray-900 text-2xl">{quantity}</span>
            </div>
            <button
              onClick={onQtyInc}
              disabled={quantity >= 10}
              className="p-4 text-gray-600 hover:text-gray-800 disabled:opacity-50 rounded-r-xl"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-6 sm:mt-8 w-full">
        <Button
          className={cn(
            "flex-1 h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.03]",
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed text-white"
              : isAddingToCart
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-xl"
          )}
          onClick={onAddToCart}
          disabled={isOutOfStock || isAddingToCart || isBuyingNow}
        >
          {isAddingToCart ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
              <span>Adding...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </div>
          )}
        </Button>

        {!isOutOfStock && (
          <Button
            className={cn(
              "flex-1 h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.03]",
              isBuyingNow
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-xl"
            )}
            onClick={onBuyNow}
            disabled={isAddingToCart || isBuyingNow || isPending}
          >
            {isBuyingNow ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <span>Buy Now</span>
              </div>
            )}
          </Button>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="font-semibold text-emerald-800 text-sm">100% Authentic</div>
            <div className="text-xs text-emerald-600">Original</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-blue-800 text-sm">Fast Delivery</div>
            <div className="text-xs text-blue-600">1-2 Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
