"use client";

import { useGetProductBySlugQuery } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import ProductDetailPage from "./ProductDetailPage";


interface Props {
  initialData: IProductResponse;
  slug: string;
}

export default function HydrateProduct({ initialData, slug }: Props) {
  const { data: product = initialData } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });

  return <ProductDetailPage product={product} />;
}
