import { MetadataRoute } from "next";

const BASE_URL = "https://khushbuwaala.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /* --------------------------------
     Static Pages (HIGH SEO VALUE)
  -------------------------------- */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/manifesto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  /* --------------------------------
     Shop Pagination (SEO crawl depth)
  -------------------------------- */
  const pagination: MetadataRoute.Sitemap = [];
  const totalPages = 5; // adjust later if needed

  for (let i = 2; i <= totalPages; i++) {
    pagination.push({
      url: `${BASE_URL}/shop?page=${i}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  /* --------------------------------
     Dynamic Product Pages (OPTIONAL)
     Fetch from your API
  -------------------------------- */

  let products: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(
      "https://api.khushbuwaala.com/products/slugs",
      {
        // helps ISR cache
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      const data: { slug: string; updatedAt?: string }[] =
        await res.json();

      products = data.map((product) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {
    // silently fail — sitemap still works
  }

  return [...staticPages, ...pagination, ...products];
}
