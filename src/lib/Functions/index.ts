import { IProductResponse } from "@/types/product.types";

export async function getProductBySlug(slug: string): Promise<IProductResponse | null> {
  try {
    const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-product-by-slug/${slug}`,
      `http://localhost:7302/api/products/get-product-by-slug/${slug}`,
      {
        method: "GET",
        // Force SSR fetch (avoid caching stale data for SEO)
        next: { revalidate: 60 }, // revalidate every 1 min (adjust as needed)
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data: IProductResponse = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching product by slug:", error);
    return null;
  }
}
