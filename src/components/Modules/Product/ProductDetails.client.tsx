"use client";

import React, { useMemo, useState, useTransition, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useProductSelectionOptional } from "@/context/ProductSelectionContext";
import { IDiscount, IProduct, IProductVariant } from "@/types/product.types";
import { useRouter } from "next/navigation";
import ProductDetailsUI from "./ProductDetailsUI.server";

export default function ProductDetailsClient({
  product,
}: {
  product: Partial<IProduct>;
}) {
  const cart = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // keep your selection context support
  const selection = useProductSelectionOptional();

  const sortedVariants = useMemo(() => {
    return [...(product.variants ?? [])].sort((a, b) => a.size - b.size);
  }, [product.variants]);

  const availableVariants = useMemo(() => sortedVariants.slice(0, 4), [sortedVariants]);

  const [fallbackSelected, setFallbackSelected] = useState<IProductVariant | null>(
    sortedVariants[0] ?? null
  );
  const [fallbackQuantity, setFallbackQuantity] = useState(1);

  const quantity = selection?.quantity ?? fallbackQuantity;
  const setQuantity = selection?.setQuantity ?? setFallbackQuantity;

  const selectedVariant = selection?.selectedVariant ?? fallbackSelected;

  const selectedSizeLabel = selectedVariant
    ? `${selectedVariant.size} ${selectedVariant.unit.toLowerCase()}`
    : product.variants?.[0]
      ? `${product.variants[0].size} ${product.variants[0].unit.toLowerCase()}`
      : "3 ml";

  const currentPrice = selectedVariant?.price ?? product.minPrice ?? 0;

  const { discount, discountedPrice } = useMemo(() => {
    const now = new Date();

    const allDiscounts = [
      ...(selectedVariant?.discounts ?? []),
      ...(product.discounts ?? []),
    ];

    const active =
      allDiscounts.find((d) => {
        const startOk = !d.startDate || new Date(d.startDate) <= now;
        const endOk = !d.endDate || new Date(d.endDate) >= now;
        return startOk && endOk;
      }) || null;

    let final = currentPrice;

    if (active) {
      if (active.type === "percentage") final = currentPrice - (currentPrice * active.value) / 100;
      if (active.type === "fixed") final = currentPrice - active.value;
    }

    return { discount: active as IDiscount | null, discountedPrice: final };
  }, [product.discounts, selectedVariant, currentPrice]);

  const isOutOfStock = (product.totalStock ?? 0) <= 0;

  const onSelectVariant = useCallback(
    (variant: IProductVariant) => {
      if (selection) selection.setSelectedVariant(variant);
      else setFallbackSelected(variant);
    },
    [selection]
  );

  const onQtyDec = useCallback(() => setQuantity((q) => Math.max(1, q - 1)), [setQuantity]);
  const onQtyInc = useCallback(() => setQuantity((q) => Math.min(10, q + 1)), [setQuantity]);

  const onReadMore = useCallback(() => {
    document.getElementById("product-accordion")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      const btn = document.querySelector('[data-section="description"]') as HTMLButtonElement | null;
      btn?.click();
    }, 500);
  }, []);

  const onAddToCart = useCallback(async () => {
    if (isOutOfStock) return;
    setIsAddingToCart(true);

    // remove artificial delays if you want even faster UI
    cart?.addToCart?.(product as any, quantity, selectedSizeLabel, currentPrice);

    setIsAddingToCart(false);
  }, [cart, product, quantity, selectedSizeLabel, currentPrice, isOutOfStock]);

  const onBuyNow = useCallback(async () => {
    if (isOutOfStock) return;
    setIsBuyingNow(true);

    cart?.addToCart?.(product as any, quantity, selectedSizeLabel, currentPrice);

    startTransition(() => router.push("/checkout"));
    setIsBuyingNow(false);
  }, [cart, product, quantity, selectedSizeLabel, currentPrice, router, startTransition, isOutOfStock]);

  return (
    <ProductDetailsUI
      product={product}
      discount={discount}
      discountedPrice={discountedPrice}
      currentPrice={currentPrice}
      quantity={quantity}
      isOutOfStock={isOutOfStock}
      selectedSizeLabel={selectedSizeLabel}
      availableVariants={availableVariants}
      onReadMore={onReadMore}
      onSelectVariant={onSelectVariant}
      onQtyDec={onQtyDec}
      onQtyInc={onQtyInc}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
      isAddingToCart={isAddingToCart}
      isBuyingNow={isBuyingNow}
      isPending={isPending}
    />
  );
}
