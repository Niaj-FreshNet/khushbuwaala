import { cache } from "react";
import { IProductResponse } from "@/types/product.types";

// ✅ Dedupes fetch between generateMetadata + page render in same request
export const getProductBySlug = cache(async (slug: string): Promise<IProductResponse | null> => {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/products/get-product-by-slug/${slug}`,
      {
        // ✅ ISR cache
        next: {
          revalidate: 3600,
          tags: [`product-${slug}`],
        },
      }
    );

    if (!res.ok) return null;

    const apiResponse = await res.json();
    return apiResponse.data ?? null;
  } catch {
    return null;
  }
});
