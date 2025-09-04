"use client";

import { useGetProductBySlugQuery } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import ProductDetailPage from "./ProductDetailPage";
import mapProductResponseToProduct from "@/lib/Functions/ClientFn";


interface Props {
  initialData: IProductResponse;
  slug: string;
}

export default function HydrateProduct({ initialData, slug }: Props) {
  const { data: productData = initialData } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });
  // console.log("product:", product);
  // const product = mapProductResponseToProduct(productData);
  const product = productData.data;

  return <ProductDetailPage product={product} />;
}
