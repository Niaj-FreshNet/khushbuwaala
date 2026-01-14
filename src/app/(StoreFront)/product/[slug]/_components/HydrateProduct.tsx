"use client";
import React from "react";
import { IProductResponse } from "@/types/product.types";
import ProductDetailPage from "./ProductDetailPage";
import ProductPageLoading from "../loading";
import { useGetProductBySlugQuery } from "@/redux/store/api/product/productApi";

interface Props {
  initialData: IProductResponse;
  slug: string;
}

export default function HydrateProduct({ initialData, slug }: Props) {
  // Use initialData to hydrate RTK Query cache
  const { data: productResponse, isLoading } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });

  // Use server-fetched data immediately, then update when client-side fetch completes
  const product = productResponse?.data || initialData;

  // Only show loading on initial mount if no initial data
  if (isLoading && !initialData) {
    return <ProductPageLoading />;
  }

  return <ProductDetailPage product={product} />;
}