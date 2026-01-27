import { IProduct } from "@/types/product.types";
import ProductActionsClient from "./ProductActions.client";

export default function ProductDetailsServer({ product }: { product: Partial<IProduct> }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* ✅ These render instantly as HTML */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
        {product.name}
      </h1>

      <p className="text-xl font-bold">
        ৳{(product.minPrice ?? 0).toLocaleString()}
      </p>

      <p className="text-gray-700 leading-relaxed">
        {product.description || "Experience luxury with this premium fragrance."}
      </p>

      {/* ✅ Only interactive part becomes client */}
      <ProductActionsClient
        productId={product.id as string}
        totalStock={product.totalStock ?? 0}
        minPrice={product.minPrice ?? 0}
        variants={product.variants ?? []}
        discounts={product.discounts ?? []}
      />
    </div>
  );
}
