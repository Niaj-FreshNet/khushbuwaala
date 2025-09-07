"use client";

import React from "react";
import { IProductResponse } from "@/types/product.types";
import ProductDetailPage from "./ProductDetailPage";

interface Props {
  initialData: IProductResponse;
  slug: string;
}

export default function HydrateProduct({ initialData }: Props) {
  // No client-side fetching here, just render the product
  return <ProductDetailPage product={initialData} />;
}
