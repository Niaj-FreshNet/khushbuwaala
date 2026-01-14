import { IProductResponse } from "@/types/product.types";

export async function getProductBySlug(slug: string): Promise<IProductResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-product-by-slug/${slug}`,
      {
        method: "GET",
        // Use revalidate for ISR (Incremental Static Regeneration)
        next: { revalidate: 3600 }, // 1 hour - adjust based on how often products update
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(`❌ Failed to fetch product: ${res.status} ${res.statusText}`);
      return null;
    }

    const apiResponse = await res.json();
    
    // Extract the actual product data from the API response
    // Based on your API structure: { success, statusCode, message, data }
    return apiResponse.data || null;
    
  } catch (error) {
    console.error("❌ Error fetching product by slug:", error);
    return null;
  }
}