import type { MetadataRoute } from "next";
import { collections } from "@/config/collections";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;
const API = process.env.NEXT_PUBLIC_API_URL;

export const revalidate = 3600;

type SitemapProduct = { slug: string; updatedAt?: string | null };

/** Every published product. Uses the discovery list; falls back to the paged product list. */
async function getProducts(): Promise<SitemapProduct[]> {
  try {
    const res = await fetch(`${API}/discover/sitemap`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const body = await res.json();
      if (Array.isArray(body?.data?.products)) return body.data.products;
    }
  } catch {
    // fall through to the older endpoint
  }

  const products: SitemapProduct[] = [];
  try {
    for (let page = 1; page <= 50; page++) {
      const res = await fetch(`${API}/products/get-all-products?limit=100&page=${page}`, { next: { revalidate: 3600 } });
      if (!res.ok) break;
      const body = await res.json();
      const rows: SitemapProduct[] = Array.isArray(body?.data) ? body.data : [];
      products.push(...rows.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })));
      if (page >= (body?.meta?.totalPage ?? 1)) break;
    }
  } catch {
    // a sitemap without products is still valid
  }
  return products;
}

async function getBlogSlugs(): Promise<SitemapProduct[]> {
  try {
    const res = await fetch(`${API}/blog/get-all-blogs?limit=200`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const body = await res.json();
    const rows = Array.isArray(body?.data?.data) ? body.data.data : Array.isArray(body?.data) ? body.data : [];
    return rows
      .filter((b: { slug?: string; isPublish?: boolean }) => b?.slug && b.isPublish !== false)
      .map((b: { slug: string; updatedAt?: string }) => ({ slug: b.slug, updatedAt: b.updatedAt }));
  } catch {
    return [];
  }
}

/** Collection pages that currently have products (empty ones are left out until they are stocked). */
async function getLiveCategoryIds(): Promise<Set<string> | null> {
  try {
    const res = await fetch(`${API}/discover/sitemap`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const body = await res.json();
    const categories: { id: string }[] = body?.data?.categories ?? [];
    return new Set(categories.map((c) => c.id));
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, blogs, liveCategories] = await Promise.all([getProducts(), getBlogSlugs(), getLiveCategoryIds()]);

  const collectionPages: MetadataRoute.Sitemap = Object.values(collections)
    .filter((c) => {
      const category = "locked" in c && c.locked && "category" in c.locked ? c.locked.category?.[0] : undefined;
      return !category || !liveCategories || liveCategories.has(category);
    })
    .map((c) => ({
      url: `${BASE_URL}${c.basePath}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: c.basePath === "/shop" ? 0.9 : 0.8,
    }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // the journal is listed only while it has published articles
    ...(blogs.length > 0 ? [{ url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 }] : []),
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/track-order`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/exchange-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...collectionPages, ...productPages, ...blogPages];
}
