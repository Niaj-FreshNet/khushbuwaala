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
  getVariantDiscount: (variant?: IProductVariant) => IDiscount | null;

  // handlers (from client)
  onReadMore?: () => void;
  onSelectVariant: (variant: IProductVariant) => void;
  onQtyDec: () => void;
  onQtyInc: () => void;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  getVariantDiscount,
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
  // console.log('currentPrice', currentPrice);
  const fragrances = product.fragrances ?? [];
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-5">
      {/* Header Section */}
      <div className="space-y-3">
        {/* Discount Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {discount && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm sm:shadow-md">
              <Tag className="w-3 h-3 mr-2" />
              {discount.type === "percentage"
                ? `${discount.value}% OFF`
                : `৳${discount.value} OFF`}
            </Badge>
          )}
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            {product.name}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Price Section */}
        <div className="relative p-2.5 sm:p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative space-y-2 sm:space-y-3">
            <div className="flex items-baseline gap-4 flex-wrap">
              {discount ? (
                <>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    ৳{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-base sm:text-xl text-gray-500 line-through">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
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
      <div className="p-2.5 sm:p-4 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-900">Description</h3>

          {/* optional: show "Read more" button in header when long */}
          {/* (keeps UI clean) */}
        </div>

        {(() => {
          const description =
            product.description?.toString() ||
            "Experience luxury with this premium fragrance.";

          const normalized = description.replace(/\r\n/g, "\n").trim();

          // ✅ Compact preview rules
          const PREVIEW_CHARS = 120;  // change 180/220/260 based on your UI
          const PREVIEW_LINES = 3;    // show max 3 lines (new-line based)

          const lines = normalized.split("\n");

          // make a text that is max PREVIEW_LINES (keeps formatting)
          const lineLimited = lines.slice(0, PREVIEW_LINES).join("\n");

          // now enforce max chars too (keeps card short always)
          const preview =
            lineLimited.length > PREVIEW_CHARS
              ? lineLimited.slice(0, PREVIEW_CHARS).trimEnd() + "..."
              : lineLimited;

          const isLong =
            normalized.length > preview.replace(/\.\.\.$/, "").length ||
            lines.length > PREVIEW_LINES;

          return (
            <div className="space-y-3">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-sm sm:text-md">
                {preview}
              </div>

              {isLong && (
                <button
                  onClick={onReadMore}
                  type="button"
                  className="inline-flex items-center rounded-md px-0 py-1.5 text-sm sm:text-base text-blue-700 hover:text-blue-900 font-semibold hover:underline active:scale-[0.98]"
                >
                  Read more
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Fragrance Notes */}
      {fragrances.length > 0 && (
        <div className="p-2.5 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-2 sm:mb-4 flex items-center justify-between gap-2 text-sm sm:text-base">
            <span>Fragrance Family</span>
          </h3>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {fragrances.slice(0, 4).map((f, idx) => (
              <span
                key={(f as any).id ?? `${(f as any).name ?? "fr"}-${idx}`}
                className="px-3 py-1.5 bg-white/70 text-purple-700 rounded-full text-xs sm:text-sm font-medium border border-purple-200"
              >
                {(f as any).name ?? String(f)}
              </span>
            ))}

            {fragrances.length > 4 && (
              <span className="px-3 py-1.5 bg-white/70 text-purple-700 rounded-full text-xs sm:text-sm font-medium border border-purple-200">
                +{fragrances.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-3 sm:space-y-4 p-3.5 sm:p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900">Choose Size</h3>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
          {availableVariants.map((variant) => {
            const label = `${variant.size} ${variant.unit.toLowerCase()}`;
            const isSelected = selectedSizeLabel === label;

            const vDiscount = getVariantDiscount(variant); // ✅
            const hasDiscount = !!vDiscount;

            return (
              <button
                key={variant.id}
                onClick={() => onSelectVariant(variant)}
                className={cn(
                  "group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] sm:hover:scale-105",
                  isSelected
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-sm sm:shadow-md ring-2 ring-blue-200"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                )}
              >
                {/* ✅ per-variant discount badge */}
                {hasDiscount && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                    {vDiscount!.type === "percentage"
                      ? `-${Math.round(vDiscount!.value)}%`
                      : `-৳${Math.round(vDiscount!.value)}`}
                  </div>
                )}

                {isSelected && (
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="text-center">
                  <div className="font-bold text-sm sm:text-base">{label}</div>
                  {/* <div className="text-xs sm:text-sm text-gray-500">৳{variant.price.toLocaleString()}</div> */}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="p-3.5 sm:p-5 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-none">Quantity</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">Max 100 per order</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Total</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              ৳{(discountedPrice * quantity).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-gray-50 overflow-hidden w-full sm:w-auto">
            <button
              onClick={onQtyDec}
              disabled={quantity <= 1}
              className="w-12 h-10 sm:w-14 sm:h-12 flex items-center justify-center text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              type="button"
              aria-label="Decrease quantity"
            >
              <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex-1 sm:flex-none min-w-[80px] sm:min-w-[110px] w-12 h-10 sm:w-14 sm:h-12 bg-white border-x border-gray-200 flex items-center justify-center">
              <span className="font-bold text-gray-900 text-lg sm:text-xl">{quantity}</span>
            </div>

            <button
              onClick={onQtyInc}
              disabled={quantity >= 100}
              className="w-12 h-10 sm:w-14 sm:h-12 flex items-center justify-center text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              type="button"
              aria-label="Increase quantity"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-4 h-4" /> Secure checkout
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div id="action-buttons" className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-3 sm:mt-6 w-full">
        <Button
          className={cn(
            "flex-1 h-16 sm:h-18 text-base sm:text-xl font-bold rounded-xl transition-all duration-300 active:scale-[0.99] sm:hover:scale-[1.03]",
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed text-white"
              : isAddingToCart
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-md sm:shadow-xl"
          )}
          onClick={(e) => onAddToCart(e)}
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
              "flex-1 h-16 sm:h-18 text-base sm:text-xl font-bold rounded-xl transition-all duration-300 active:scale-[0.99] sm:hover:scale-[1.03]",
              isBuyingNow
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-md sm:shadow-xl"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/60 rounded-2xl">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="font-semibold text-emerald-800 text-sm">100% Authentic</div>
            <div className="text-xs text-emerald-600">Original</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
