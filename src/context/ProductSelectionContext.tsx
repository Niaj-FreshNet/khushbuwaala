"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { IProduct, IProductVariant } from "@/types/product.types";

interface ProductSelectionContextValue {
  selectedVariant: IProductVariant | null;
  setSelectedVariant: React.Dispatch<React.SetStateAction<IProductVariant | null>>;

  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;

  isWishlisted: boolean;
  toggleWishlist: () => void;
}

const ProductSelectionContext = createContext<ProductSelectionContextValue | undefined>(
  undefined
);

function getDefaultVariant(product: IProduct): IProductVariant | null {
  if (product.variants && product.variants.length > 0) {
    return product.variants[0];
  }
  return null;
}

export function ProductSelectionProvider({
  product,
  children,
}: {
  product: IProduct;
  children: ReactNode;
}) {
  const defaultVariant = useMemo(() => getDefaultVariant(product), [product]);

  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(
    defaultVariant
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const toggleWishlist = () => setIsWishlisted((prev) => !prev);

  const value = useMemo<ProductSelectionContextValue>(
    () => ({
      selectedVariant,
      setSelectedVariant,
      quantity,
      setQuantity,
      isWishlisted,
      toggleWishlist,
    }),
    [selectedVariant, quantity, isWishlisted]
  );

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  );
}

export function useProductSelectionOptional() {
  return useContext(ProductSelectionContext);
}

export function useProductSelection() {
  const ctx = useContext(ProductSelectionContext);
  if (!ctx)
    throw new Error(
      "useProductSelection must be used within a ProductSelectionProvider"
    );
  return ctx;
}
