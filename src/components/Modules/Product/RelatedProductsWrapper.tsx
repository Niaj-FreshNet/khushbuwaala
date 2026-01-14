"use client";

import dynamic from "next/dynamic";
import { IProduct } from "@/types/product.types";

// ✅ Dynamic import with ssr: false in a CLIENT component
const RelatedProducts = dynamic(
  () => import("@/components/Modules/Product/RelatedProducts"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    ),
  }
);

interface RelatedProductsWrapperProps {
  product: Partial<IProduct>;
}

export default function RelatedProductsWrapper({
  product,
}: RelatedProductsWrapperProps) {
//   return <RelatedProducts product={product as IProduct} />;
  return <RelatedProducts product={product as any} />;

}