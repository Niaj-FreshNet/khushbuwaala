"use client";

import React from "react";
import { IProduct, IProductVariant } from "@/types/product.types";
import { useProductSelection } from "@/context/ProductSelectionContext";

interface ProductVariantsSelectorProps {
  product: IProduct;
}

export default function ProductVariantsSelector({ product }: ProductVariantsSelectorProps) {
  // Must be inside the provider, throws if missing
  const { selectedVariant, setSelectedVariant } = useProductSelection();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variant = product.variants.find((v) => v.id === e.target.value);
    if (variant) setSelectedVariant(variant);
  };

  return (
    <select
      value={selectedVariant?.id ?? ""}
      onChange={handleChange}
      className="border rounded-md p-2"
      aria-label="Select product variant"
    >
      {product.variants.map((variant: IProductVariant) => (
        <option key={variant.id} value={variant.id}>
          {variant.size} {variant.unit} — ${variant.price.toFixed(2)}
        </option>
      ))}
    </select>
  );
}
