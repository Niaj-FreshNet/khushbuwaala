import { IProduct, IProductResponse } from "@/types/product.types";

export default function mapProductResponseToProduct(
  product: IProductResponse
): Partial<IProduct> {
  return {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants?.map(v => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    })),
  };
}
