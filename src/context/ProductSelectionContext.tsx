"use client";

import React, { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/Data/data";

interface ProductSelectionContextValue {
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  isWishlisted: boolean;
  toggleWishlist: () => void;
}

const ProductSelectionContext = createContext<ProductSelectionContextValue | undefined>(undefined);

function deriveDefaultSizes(product: Product): string[] {
  if (product.variantPrices) return Object.keys(product.variantPrices);
  if (product.measurement === "ml") return ["3 ml", "6 ml", "12 ml", "25 ml"];
  return ["3 gm", "6 gm", "12 gm"];
}

export function ProductSelectionProvider({ product, children }: { product: Product; children: ReactNode }) {
  const sizeKeys = useMemo(() => deriveDefaultSizes(product), [product]);
  const [selectedSize, setSelectedSize] = useState<string>(sizeKeys[0] || "3 ml");
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const toggleWishlist = () => setIsWishlisted((prev) => !prev);

  const value = useMemo<ProductSelectionContextValue>(
    () => ({ selectedSize, setSelectedSize, quantity, setQuantity, isWishlisted, toggleWishlist }),
    [selectedSize, quantity, isWishlisted]
  );

  return <ProductSelectionContext.Provider value={value}>{children}</ProductSelectionContext.Provider>;
}

// Optional consumer that returns undefined if not wrapped
export function useProductSelectionOptional() {
  return useContext(ProductSelectionContext);
}

// Strict consumer that throws if not wrapped (not used yet but exported for completeness)
export function useProductSelection() {
  const ctx = useContext(ProductSelectionContext);
  if (!ctx) throw new Error("useProductSelection must be used within a ProductSelectionProvider");
  return ctx;
}


