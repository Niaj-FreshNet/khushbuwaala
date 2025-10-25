import { MetadataRoute } from "next";

// If you have dynamic product pages, you can optionally fetch product slugs at runtime.
// For build-time static sitemap, keep it simple.
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    {
      url: "https://khushbuwaala.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://khushbuwaala.com/shop",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Example static pages
    {
      url: "https://khushbuwaala.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://khushbuwaala.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Example: paginate shop pages statically
  const totalPages = 5; // You can set a static number here
  for (let i = 2; i <= totalPages; i++) {
    urls.push({
      url: `https://khushbuwaala.com/shop?page=${i}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    });
  }

  return urls;
}
