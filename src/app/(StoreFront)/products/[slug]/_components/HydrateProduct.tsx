"use client";

import { useGetProductBySlugQuery } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import ProductDetailPage from "./ProductDetailPage";
import ProductPageLoading from "../loading";


interface Props {
  initialData: IProductResponse;
  slug: string;
}

export default function HydrateProduct({ initialData, slug }: Props) {
  const { data: productResponse, isLoading, isFetching = { data: initialData } as any } =
    useGetProductBySlugQuery(slug, {
      skip: !slug,
    });

  // Use fallback initial data if API hasn't returned yet
  const product = productResponse?.data || initialData;

  // Show loading state if it's still fetching for the first time
  if (isLoading && !productResponse) return <ProductPageLoading />;

  // Optionally, you could show a "skeleton" or smaller loading UI when refetching
  if (isFetching && productResponse) {
    // e.g., show a subtle loader or shimmer on the product page
    return <ProductDetailPage product={product} />;
  }

  return <ProductDetailPage product={product} />;
}
