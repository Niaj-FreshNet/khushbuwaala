"use client";

import React, { useMemo, useState, useTransition, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useProductSelectionOptional } from "@/context/ProductSelectionContext";
import { IProduct, IProductVariant } from "@/types/product.types";
import { isCartProduct } from "@/types/cart.types";
import { activeAutoDiscount, offeredVariants, pickStartingVariant, sortVariantsBySize } from "@/lib/productPricing";
import { useRouter } from "next/navigation";
import ProductDetailsUI from "./ProductDetailsUI.server";
import flyToCart from "./FlyToCart";
import { kwPushAddToCart, kwPushBeginCheckout, kwCategoryName } from "@/lib/Analytics/kwEcom";

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

  const sortedVariants = useMemo(() => sortVariantsBySize(product.variants ?? []), [product.variants]);

  const availableVariants = useMemo(() => offeredVariants(sortedVariants), [sortedVariants]);

  const safeUnit = (unit: unknown) => String(unit || "").trim().toLowerCase();

  // The size shown first: the product's default size (see pickStartingVariant).
  const lowestPriceVariant: IProductVariant | null = pickStartingVariant(sortedVariants);

  const [fallbackSelected, setFallbackSelected] = useState<IProductVariant | null>(null);

  const [fallbackQuantity, setFallbackQuantity] = useState(1);

  const quantity =
    typeof selection?.quantity === "number" && selection.quantity > 0
      ? selection.quantity
      : fallbackQuantity;

  const setQuantity = selection?.setQuantity ?? setFallbackQuantity;

  // Effective variant prioritizes user selection context, then fallback, then lowestPriceVariant
  const effectiveVariant = selection?.selectedVariant ?? fallbackSelected ?? lowestPriceVariant;

  const selectedSizeLabel = effectiveVariant
    ? `${String(effectiveVariant.size).trim()} ${safeUnit(effectiveVariant.unit)}`
    : "6 ml";

  const currentPrice = effectiveVariant?.price ?? product.minPrice ?? 0;

  const { discount, discountedPrice } = useMemo(() => {
    const active = activeAutoDiscount(product, effectiveVariant);

    let final = currentPrice;

    if (active) {
      if (active.type === "percentage") final = currentPrice * (1 - active.value / 100);
      else if (active.type === "fixed") final = currentPrice - active.value;
    }

    final = Math.max(0, Math.round(final));
    return { discount: active, discountedPrice: final };
  }, [product, effectiveVariant, currentPrice]);

  // Out-of-stock blocking is switched off: every product can be ordered.

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
    const el = document.getElementById("product-accordion");

    // If not found, just open description (fallback)
    if (!el) {
      window.dispatchEvent(new Event("kw:open-description"));
      return;
    }

    // ✅ offset for sticky navbar (adjust if needed)
    const offset = 10;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    // ✅ scroll first
    window.scrollTo({ top, behavior: "smooth" });

    // ✅ then open after scroll begins (prevents layout shift cancelling scroll)
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event("kw:open-description"));
      }, 500);
    });
  }, []);

  const onAddToCart = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isAddingToCart || isBuyingNow) return;

      setIsAddingToCart(true);
      try {
        // ✅ fly animation first (from button → cart icon)
        if (!isCartProduct(product)) return;
        flyToCart(e.currentTarget, product.primaryImage);

        // If addToCart is sync, this still gives user feedback for a moment
        cart.addToCart(product, quantity, selectedSizeLabel, discountedPrice);

        // ✅ TRACK: add_to_cart (GA4 + Meta via GTM)
        kwPushAddToCart({
          currency: "BDT",
          value: discountedPrice * quantity,
          items: [
            {
              item_id: String(product.id || product.slug),
              item_name: String(product.name || ""),
              item_brand: String(product.brand || "Khushbuwaala"),
              item_category: kwCategoryName(product),
              item_variant: selectedSizeLabel, // ✅ variant
              price: discountedPrice,
              quantity,
            },
          ],
        });

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("kw:cart-added"));
        }

        // tiny UX delay so spinner is actually visible (optional but recommended)
        await new Promise((r) => setTimeout(r, 1000));
      } finally {
        setIsAddingToCart(false);
      }
    }, [cart, product, quantity, selectedSizeLabel, discountedPrice, isAddingToCart, isBuyingNow]);

  const onBuyNow = useCallback(async () => {
    if (isBuyingNow || isAddingToCart) return;

    setIsBuyingNow(true);
    try {
      if (!isCartProduct(product)) return;
      cart.addToCart(product, quantity, selectedSizeLabel, discountedPrice);

      // ✅ TRACK begin_checkout from Buy Now (single-item checkout intent)
      kwPushBeginCheckout({
        currency: "BDT",
        value: discountedPrice * quantity,
        items: [
          {
            item_id: String(product.id || product.slug),
            item_name: String(product.name || ""),
            item_brand: String(product.brand || "Khushbuwaala"),
            item_category: kwCategoryName(product),
            item_variant: selectedSizeLabel,
            price: discountedPrice,
            quantity,
          },
        ],
      });

      await new Promise((r) => setTimeout(r, 500));
      startTransition(() => router.push("/checkout"));
    } finally {
      setIsBuyingNow(false);
    }
  }, [cart, product, quantity, selectedSizeLabel, discountedPrice, router, startTransition, isBuyingNow, isAddingToCart]);

  return (
    <ProductDetailsUI
      product={product}
      selectedVariantId={effectiveVariant?.id}
      discount={discount}
      discountedPrice={discountedPrice}
      currentPrice={currentPrice}
      quantity={quantity}
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
};