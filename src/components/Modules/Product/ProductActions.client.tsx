"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap, Minus, Plus, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { IProductVariant, IDiscount } from "@/types/product.types";

export default function ProductActionsClient({
    productId,
    totalStock,
    minPrice,
    variants,
    discounts,
}: {
    productId: string;
    totalStock: number;
    minPrice: number;
    variants: IProductVariant[];
    discounts: IDiscount[];
}) {
    const cart = useCart();
    const router = useRouter();

    const sortedVariants = useMemo(() => [...variants].sort((a, b) => a.size - b.size), [variants]);
    const first = sortedVariants[0];

    const [selected, setSelected] = useState<IProductVariant | null>(first ?? null);
    const [qty, setQty] = useState(1);

    const isOutOfStock = totalStock <= 0;

    const currentPrice = selected?.price ?? minPrice;

    const addToCart = () => {
        if (isOutOfStock) return;
        cart?.addToCart?.({ _id: productId } as any, qty, `${selected?.size} ${selected?.unit}`, currentPrice);
    };

    const buyNow = () => {
        if (isOutOfStock) return;
        addToCart();
        router.push("/checkout");
    };

    return (
        <div className="space-y-5">
            {/* Sizes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sortedVariants.slice(0, 4).map((v) => {
                    const isSelected = selected?.id === v.id;
                    return (
                        <button
                            key={v.id}
                            onClick={() => setSelected(v)}
                            className={cn(
                                "relative p-3 rounded-xl border-2 transition-all",
                                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                            )}
                        >
                            {isSelected && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </span>
                            )}
                            <div className="font-bold">{v.size} {v.unit.toLowerCase()}</div>
                            <div className="text-sm text-gray-600">৳{v.price.toLocaleString()}</div>
                        </button>
                    );
                })}
            </div>

            {/* Qty */}
            <div className="flex items-center justify-between">
                <div className="flex items-center border-2 rounded-2xl overflow-hidden">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3">
                        <Minus className="w-5 h-5" />
                    </button>
                    <div className="px-6 py-3 font-bold">{qty}</div>
                    <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="p-3">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-right font-bold">
                    ৳{(currentPrice * qty).toLocaleString()}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <Button
                    disabled={isOutOfStock}
                    onClick={addToCart}
                    className="flex-1"
                >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                {!isOutOfStock && (
                    <Button onClick={buyNow} className="flex-1">
                        <Zap className="w-5 h-5 mr-2" />
                        Buy Now
                    </Button>
                )}
            </div>
        </div>
    );
}
