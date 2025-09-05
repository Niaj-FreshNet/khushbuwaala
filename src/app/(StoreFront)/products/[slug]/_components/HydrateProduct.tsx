"use client";

import { useGetProductBySlugQuery } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import ProductDetailPage from "./ProductDetailPage";


interface Props {
  initialData: IProductResponse;
  slug: string;
}

export default function HydrateProduct({ initialData, slug }: Props) {
  const { data: productResponse = { data: initialData } as any } =
    useGetProductBySlugQuery(slug, {
      skip: !slug,
    });
    
  const product = productResponse.data;

  return <ProductDetailPage product={product} />;
}
