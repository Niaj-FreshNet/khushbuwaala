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
  selectedVariantId?: string | number;
  discount: IDiscount | null;
  discountedPrice: number;
  currentPrice: number;
  quantity: number;
  isOutOfStock?: boolean; /* OUT OF STOCK - disabled */
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
  selectedVariantId,
  discount,
  discountedPrice,
  currentPrice,
  quantity,
  isOutOfStock, /* OUT OF STOCK - disabled */
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
  // const fragrances = product.fragrances ?? [];
  return (
    <div className="space-y-1 sm:space-y-2">
      {/* Header Section */}
      <div className="space-y-2 sm:space-y-2">
        {/* Discount Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {discount && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 sm:px-4 shadow-sm sm:shadow-md">
              <Tag className="w-3 h-3 mr-2" />
              {discount.type === "percentage"
                ? `${discount.value}% OFF`
                : `৳${discount.value} OFF`}
            </Badge>
          )}
        </div>

        {/* Product Name */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
            {product.name}
          </h1>
          <div className="w-20 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Price Section */}
        <div className="relative p-1.5 sm:p-2.5 bg-gradient-to-r from-blue-50/70 via-indigo-50/60 to-purple-50/70 rounded-xl border-1 border-blue-100/80 overflow-hidden">
          <div className="relative flex items-center justify-between gap-3">
            {/* Left: Prices */}
            <div className="flex items-baseline gap-2 sm:gap-2.5 min-w-0">
              <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight shrink-0">
                ৳{(discount ? discountedPrice : currentPrice).toLocaleString()}
              </span>
              {discount && (
                <span className="text-xs sm:text-sm text-gray-400 line-through truncate font-medium">
                  ৳{currentPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Right: Responsive Text (Shortened for Mobile, Full for Desktop) */}
            {discount && (
              <div className="text-right shrink-0">
                {/* Mobile: Compact Pill Badge */}
                <div className="sm:hidden text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-lg">
                  Save ৳{(currentPrice - discountedPrice).toLocaleString()}
                  <span className="text-emerald-600/80 font-medium ml-1">
                    ({discount.type === "percentage" ? `${discount.value}% OFF` : `৳${discount.value.toLocaleString()}`})
                  </span>
                </div>

                {/* Desktop: Full Original Two-Line Text */}
                <div className="hidden sm:block">
                  <div className="text-md font-bold text-green-600 leading-tight">
                    You save ৳{(currentPrice - discountedPrice).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-700 leading-tight mt-0.5">
                    That's {discount.type === "percentage" ? `${discount.value}%` : `৳${discount.value.toLocaleString()}`} off!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-2.5 sm:px-4 pt-2.5 sm:pt-3 pb-1 sm:pb-2.5 bg-white rounded-2xl border-1 border-gray-200">
        {(() => {
          const description =
            product.description?.toString() ||
            "Experience luxury with this premium fragrance.";

          const normalized = description.replace(/\r\n/g, "\n").trim();

          // 1. Preserve lines, limit up to 3 lines
          const PREVIEW_LINES = 3;
          const lines = normalized.split("\n");
          const isLong = lines.length > PREVIEW_LINES || normalized.length > 160;

          const lineLimited = lines.slice(0, PREVIEW_LINES).join("\n");

          const PREVIEW_CHARS = 200;
          let baseText = lineLimited;
          if (baseText.length > PREVIEW_CHARS) {
            baseText = baseText.slice(0, PREVIEW_CHARS).trimEnd();
          }

          // Clean any trailing dots so it ends cleanly with "..."
          const cleanText = baseText.replace(/\.+$/, "").trimEnd();

          // Split strictly by newline to preserve every return/enter
          const paragraphs = cleanText.split("\n");

          return (
            <div className="text-gray-700 leading-relaxed break-words text-sm sm:text-base">
              {paragraphs.map((line, idx) => {
                const isLast = idx === paragraphs.length - 1;

                // If line is empty (e.g. double enter), render a controlled subtle gap
                if (!line.trim()) {
                  return <div key={idx} className="h-1.5" />;
                }

                return (
                  <p key={idx} className={!isLast ? "mb-1.5" : "inline"}>
                    <span>{line}</span>
                    {isLast && isLong && (
                      <>
                        <span>...</span>
                        <button
                          onClick={onReadMore}
                          type="button"
                          className="inline-flex items-center ml-1 text-sm sm:text-base text-blue-700 hover:text-blue-900 font-semibold hover:underline active:scale-[0.98] align-baseline"
                        >
                          Read more
                        </button>
                      </>
                    )}
                  </p>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Fragrance Notes */}
      {/* {fragrances.length > 0 && (
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
      )} */}

      {/* Size Selection */}
      <div className="space-y-1 sm:space-y-2 p-1.5 sm:p-2 bg-white rounded-2xl border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-sm sm:text-md font-bold text-gray-900">Choose Size</h3>
        </div>

        <div className="grid grid-cols-3 grid-cols-4 gap-2 sm:gap-4">
          {availableVariants.map((variant) => {
            const label = `${variant.size} ${variant.unit.toLowerCase()}`;
            const isSelected = selectedVariantId ? variant.id === selectedVariantId : selectedSizeLabel === label;

            const vDiscount = getVariantDiscount(variant);
            const hasDiscount = !!vDiscount;

            // Calculate variant discounted price if applicable
            const variantFinalPrice = hasDiscount
              ? vDiscount.type === "percentage"
                ? Math.round(variant.price * (1 - vDiscount.value / 100))
                : Math.max(0, Math.round(variant.price - vDiscount.value))
              : variant.price;

            return (
              <button
                key={variant.id}
                onClick={() => onSelectVariant(variant)}
                type="button"
                className={cn(
                  "group relative p-1.5 sm:p-2.5 rounded-xl border transition-all duration-200 active:scale-[0.98] sm:hover:scale-105",
                  isSelected
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-sm sm:shadow-md ring-2 ring-blue-200"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                )}
              >
                {/* Per-variant discount pill badge */}
                {hasDiscount && (
                  <div className="absolute -top-2 -right-1.5 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                    {vDiscount.type === "percentage"
                      ? `-${Math.round(vDiscount.value)}%`
                      : `-৳${Math.round(vDiscount.value)}`}
                  </div>
                )}

                {isSelected && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div className="text-center">
                  <div className="font-bold text-xs sm:text-sm tracking-tight">{label}</div>

                  {/* Prices: Cut base price + Discounted price side-by-side */}
                  <div className="flex items-center justify-center gap-1.5 mt-0.5 flex-wrap">
                    {hasDiscount ? (
                      <>
                        <span className="text-xs sm:text-sm text-gray-600">
                          ৳{variantFinalPrice.toLocaleString()}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                          ৳{variant.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm text-gray-600 font-semibold">
                        ৳{variant.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="px-2 sm:px-3 py-1 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between gap-3">

          {/* LEFT — Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div> */}

            <div className="leading-tight">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Quantity
              </h3>
              {/* <p className="text-[10px] sm:text-xs text-gray-500">
                Max 100
              </p> */}
            </div>
          </div>

          {/* CENTER — Quantity Stepper */}
          <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden select-none touch-manipulation">
            <button
              onClick={onQtyDec}
              disabled={quantity <= 1}
              type="button"
              aria-label="Decrease quantity"
              className="w-7 h-7 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="min-w-[48px] sm:min-w-[90px] h-9 sm:h-12 bg-white border-x border-gray-200 flex items-center justify-center">
              <span className="font-bold text-gray-900 text-base sm:text-xl">
                {quantity}
              </span>
            </div>

            <button
              onClick={onQtyInc}
              disabled={quantity >= 100}
              type="button"
              aria-label="Increase quantity"
              className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* RIGHT — Total Price */}
          <div className="text-right shrink-0 leading-tight">
            <div className="text-[11px] sm:text-sm text-gray-500 font-medium">
              Total
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              ৳{(discountedPrice * quantity).toLocaleString()}
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div id="action-buttons" className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-2 sm:mt-3 mb-2 sm:mb-3 w-full">
        <Button
          className={cn(
            "flex-1 h-16 sm:h-18 text-base sm:text-xl font-bold rounded-xl transition-all duration-300 active:scale-[0.99] sm:hover:scale-[1.03]",
            /* isOutOfStock
              ? "bg-gray-400 cursor-not-allowed text-white"
              : */ isAddingToCart
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-md sm:shadow-xl"
          )}
          onClick={(e) => onAddToCart(e)}
          disabled={/* isOutOfStock || */ isAddingToCart || isBuyingNow}
        >
          {isAddingToCart ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
              <span>Adding...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              <span>{/* isOutOfStock ? "Out of Stock" : */ "Add to Cart"}</span>
            </div>
          )}
        </Button>

        {/* {!isOutOfStock && ( */}
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
        {/* )} */}
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-2 p-1.5 sm:p-2.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-3 p-1 sm:p-2.5 bg-white/60 rounded-2xl">
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