"use client";

import { useCart } from "@/context/CartContext";
import { Badge, Heart, Loader2, MessageSquare, ShoppingCart, Tag, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useProductSelectionOptional } from "@/context/ProductSelectionContext";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
// import { toggleWishlist, selectIsInWishlist } from "@/redux/store/features/wishlist/wishlistSlice";
import { IDiscount, IProduct, IProductVariant } from "@/types/product.types";
import { useRouter } from "next/navigation";
import flyToCart from "./FlyToCart";
import { kwPushAddToCart } from "@/lib/Analytics/kwEcom";

export default function ProductPageBottomBar({ product }: { product: IProduct }) {
    const cart = useCart()
    const router = useRouter()
    // const sizeKeys = product.variantPrices
    //     ? Object.keys(product.variantPrices)
    //     : product.measurement === "ml"
    //         ? ["3 ml", "6 ml", "12 ml", "25 ml"]
    //         : ["3 gm", "6 gm", "12 gm"]
    const sizeKeys = product.variants?.length
        ? product.variants.map(v => `${v.size} ${v.unit.toLowerCase()}`)
        : ["3 ml", "6 ml", "12 ml", "25 ml"]

    const selection = useProductSelectionOptional();
    const [fallbackSelectedSize, setFallbackSelectedSize] = useState<string>(sizeKeys[0] || "3 ml");
    const [fallbackQuantity, setFallbackQuantity] = useState<number>(1);
    const dispatch = useAppDispatch();

    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [isPending, startTransition] = useTransition();

    const busy = isAdding || isBuying || isPending;

    // const selectedSize = selection?.selectedSize ?? fallbackSelectedSize;
    // const setSelectedSize = selection?.setSelectedSize ?? setFallbackSelectedSize;
    const quantity = selection?.quantity ?? fallbackQuantity;
    const setQuantity = selection?.setQuantity ?? setFallbackQuantity;
    // const isWishlisted = useAppSelector(useMemo(() => selectIsInWishlist(product._id), [product._id]));
    // const onToggleWishlist = () => dispatch(toggleWishlist(product));

    const selectedSize = selection?.selectedVariant
        ? `${selection.selectedVariant.size} ${selection.selectedVariant.unit.toLowerCase()}`
        : fallbackSelectedSize;

    //   const price = selection?.selectedVariant
    //     ? `${selection.selectedVariant.price}`
    //     : 0;

    //   const selectedPrice = Number(price)

    const setSelectedSize = (size: string) => {
        if (!selection) return setFallbackSelectedSize(size);

        const variant = product.variants?.find(
            (v) => `${v.size} ${v.unit.toLowerCase()}` === size
        );
        if (variant) selection.setSelectedVariant(variant);
    };

    // Available sizes based on product data
    const availableSizes = sizeKeys;

    useEffect(() => {
        const el = document.getElementById("sticky-cart");
        if (!el) return;

        const applyPadding = () => {
            const h = el.getBoundingClientRect().height;
            document.documentElement.style.setProperty("--kw-bottom-bar-h", `${h}px`);
        };

        applyPadding();

        const ro = new ResizeObserver(applyPadding);
        ro.observe(el);

        window.addEventListener("resize", applyPadding);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", applyPadding);
            document.documentElement.style.removeProperty("--kw-bottom-bar-h");
        };
    }, []);

    // Get current price
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

    // ✅ Determine selected variant price (before discount)
    const price = selection?.selectedVariant?.price ?? product.minPrice ?? 0;

    // ✅ Get final price after checking discount
    const selectedPrice = discount ? discountedPrice : price;

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

    // const handleAddToCart = async () => {
    //     if (isOutOfStock) return;
    //     cart?.addToCart?.(product as any, quantity, selectedSize, selectedPrice);
    // };

    const handleAddToCart = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
            if (isOutOfStock || busy) return;

            setIsAdding(true);
            try {
                // ✅ fly animation first (from button → cart icon)
                flyToCart(e.currentTarget, (product as any)?.primaryImage);

                cart?.addToCart?.(product as any, quantity, selectedSize, selectedPrice);

                kwPushAddToCart({
                    currency: "BDT",
                    value: selectedPrice * 1,
                    items: [
                        {
                            item_id: String((product as any).id || (product as any).slug || product.name),
                            item_name: product.name,
                            item_brand: (product as any).brand || "KhushbuWaala",
                            item_category: (product as any).categoryId || (product as any).category?.categoryName || "product",
                            item_variant: defaultSize || undefined,
                            price: selectedPrice,
                            quantity: 1,
                        },
                    ],
                });

                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("kw:cart-added"));
                }

                await new Promise((r) => setTimeout(r, 1000));
            } finally {
                setIsAdding(false);
            }
        }, [cart, product, quantity, selectedSize, selectedPrice, isOutOfStock, busy]);

    const handleBuyNow = useCallback(async () => {
        if (isOutOfStock || busy) return;

        setIsBuying(true);
        try {
            cart?.addToCart?.(product as any, quantity, selectedSize, selectedPrice);
            await new Promise((r) => setTimeout(r, 1000));

            startTransition(() => {
                router.push("/checkout");
            });
        } finally {
            setIsBuying(false);
        }
    }, [cart, product, quantity, selectedSize, selectedPrice, router, isOutOfStock, busy, startTransition]);

    return (
        <>
            {/* Sticky Bottom Bar */}
            <div
                id="sticky-cart"
                className="fixed inset-x-0 bottom-0 z-50">
                {/* Backdrop / Blur */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/70" />

                {/* Content */}
                <div className="relative mx-auto max-w-7xl px-3 sm:px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3">
                    {/* =========================
            DESKTOP / TABLET (md+)
        ========================== */}
                    <div className="hidden md:flex items-center justify-between gap-6">
                        {/* Left: product */}
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                                <img
                                    src={product.primaryImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                                    {discountValue > 0 && (
                                        <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                                            {discountValue}% OFF
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                    <span className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
                                        Size: <span className="font-semibold text-gray-900">{selectedSize}</span>
                                    </span>
                                    <span className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
                                        Qty: <span className="font-semibold text-gray-900">{quantity}</span>
                                    </span>

                                    {totalDiscounted !== totalCurrent && (
                                        <span className="px-2 py-1 rounded-lg bg-green-50 border border-green-100 text-green-700 font-semibold">
                                            Save ৳{(totalCurrent - totalDiscounted).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: price + actions grouped (professional) */}
                        <div className="flex items-center gap-4">
                            {/* Price stacked near CTA */}
                            <div className="text-right mr-2">
                                <div className="text-xs text-gray-500 font-medium">Total</div>
                                <div className="text-2xl font-extrabold text-gray-900 leading-tight">
                                    ৳{totalDiscounted.toLocaleString()}
                                </div>
                                {totalDiscounted !== totalCurrent && (
                                    <div className="text-sm text-gray-500 line-through font-semibold">
                                        ৳{totalCurrent.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            <button
                                disabled={isOutOfStock || busy}
                                aria-busy={busy}
                                onClick={handleAddToCart}
                                className="h-12 px-6 rounded-2xl font-bold shadow-lg transition-all duration-200
                 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white
                 hover:shadow-xl hover:scale-[1.02]
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <span className="flex items-center gap-2">
                                    {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                                    {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
                                </span>
                            </button>

                            <button
                                disabled={isOutOfStock || busy}
                                aria-busy={busy}
                                onClick={handleBuyNow}
                                className="h-12 px-7 rounded-2xl font-extrabold shadow-lg transition-all duration-200
                 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white
                 hover:shadow-xl hover:scale-[1.02]
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <span className="flex items-center gap-2">
                                    {isBuying || isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                    {isOutOfStock ? "Out of Stock" : isBuying || isPending ? "Processing..." : "Buy Now"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* =========================
            MOBILE (below md)
        ========================== */}
                    <div className="md:hidden space-y-3">
                        {/* Row 1: product + price + quick meta */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                                <img
                                    src={product.primaryImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-extrabold text-gray-900 truncate">{product.name}</h4>
                                    <div className="text-right shrink-0">
                                        <div className="text-[10px] text-gray-500 font-semibold">Total</div>
                                        <div className="text-lg font-extrabold text-gray-900 leading-none">
                                            ৳{totalDiscounted.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
                                        {selectedSize}
                                    </span>
                                    <span className="text-[11px] px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
                                        Qty {quantity}
                                    </span>
                                    {totalDiscounted !== totalCurrent && (
                                        <span className="text-[11px] px-2 py-1 rounded-lg bg-green-50 border border-green-100 text-green-700 font-semibold">
                                            Save ৳{(totalCurrent - totalDiscounted).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: main CTAs (big + thumb friendly) */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                disabled={isOutOfStock || busy}
                                aria-busy={busy}
                                onClick={handleAddToCart}
                                className="h-12 rounded-2xl font-extrabold shadow-lg transition-all duration-200
                         bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white
                         active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                                    {isOutOfStock ? "Out" : isAdding ? "Adding..." : "Cart"}
                                </span>
                            </button>

                            <button
                                disabled={isOutOfStock || busy}
                                aria-busy={busy}
                                onClick={handleBuyNow}
                                className="h-12 rounded-2xl font-extrabold shadow-lg transition-all duration-200
                         bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white
                         active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isBuying || isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                    {isOutOfStock ? "Out" : isBuying || isPending ? "..." : "Buy Now"}
                                </span>
                            </button>
                        </div>

                        {/* <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold">
                                    Cash on Delivery
                                </span>
                                <span className="text-[11px] px-2 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold">
                                    Fast Delivery
                                </span>
                            </div>

                            <div className="flex items-center rounded-2xl border border-gray-200 bg-white overflow-hidden">
                                <button
                                    onClick={() => handleQuantityChange("decrement")}
                                    disabled={busy || quantity <= 1}
                                    className="h-9 w-10 grid place-items-center text-gray-700 disabled:opacity-50"
                                >
                                    −
                                </button>
                                <div className="h-9 px-3 grid place-items-center text-sm font-bold text-gray-900 border-x border-gray-200">
                                    {quantity}
                                </div>
                                <button
                                    onClick={() => handleQuantityChange("increment")}
                                    disabled={busy || quantity >= 10}
                                    className="h-9 w-10 grid place-items-center text-gray-700 disabled:opacity-50"
                                >
                                    +
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}