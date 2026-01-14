import { IProduct } from "@/types/product.types";
import ProductDetailsClient from "./ProductDetails.client";

export default function ProductDetailsShell({ product }: { product: Partial<IProduct> }) {
  // ✅ Server renders instantly (SEO + first paint)
  // ✅ Client handles interactivity (cart, router, size/qty clicks, read more)
  return <ProductDetailsClient product={product} />;
}
