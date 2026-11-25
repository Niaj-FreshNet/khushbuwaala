import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/Functions/ServerFn";
import ProductDetailPage from "./_components/ProductDetailPage";
import { siteConfig } from "@/config/site";
import { htmlToText, toSummary } from "@/lib/text";
import type { IProductResponse } from "@/types/product.types";
import { apiFetch } from "@/lib/apiFetch";

interface Props {
  params: Promise<{ slug: string }>;
}

// Fields the admin can fill in for search engines; older products do not have them.
type SeoFields = { metaTitle?: string | null; metaDescription?: string | null; reviewCount?: number; averageRating?: number };

const titleCase = (text: string) => text.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_m, sep: string, ch: string) => sep + ch.toUpperCase());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
      description: "The product you're looking for could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const seo = product as IProductResponse & SeoFields;
  const category = product.category?.categoryName ? titleCase(product.category.categoryName) : "Perfume";
  const title = seo.metaTitle?.trim() || `${product.name} – ${category} Price in Bangladesh`;
  const description =
    seo.metaDescription?.trim() ||
    toSummary(product.description) ||
    `Buy ${product.name} from Khushbuwaala with delivery across Bangladesh.`;
  const url = `${siteConfig.url}/product/${slug}`;
  const image = product.primaryImage;

  return {
    // absolute: the site name is added once here, not again by the layout template
    title: { absolute: `${title} | ${siteConfig.name}` },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url,
      siteName: siteConfig.name,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

/** schema.org Product data for Google (rich results, Shopping). Only facts the page shows. */
function productStructuredData(product: IProductResponse, slug: string) {
  const seo = product as IProductResponse & SeoFields;
  const prices = (product.variants ?? []).map((v) => Number(v.price)).filter((p) => Number.isFinite(p) && p > 0);
  const url = `${siteConfig.url}/product/${slug}`;
  const reviewCount = Number(seo.reviewCount) || 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: htmlToText(product.description).slice(0, 5000),
    image: [product.primaryImage, ...(product.otherImages ?? [])].filter(Boolean),
    sku: product.id,
    url,
    ...(product.brand?.trim() ? { brand: { "@type": "Brand", name: product.brand.trim() } } : {}),
    ...(product.category?.categoryName ? { category: titleCase(product.category.categoryName) } : {}),
    ...(prices.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            url,
            priceCurrency: "BDT",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: siteConfig.name },
          },
        }
      : {}),
    // a rating is only sent when real, published reviews exist
    ...(reviewCount > 0 && Number(seo.averageRating) > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: Number(seo.averageRating).toFixed(1), reviewCount } }
      : {}),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData(product, slug)).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetailPage product={product} />
    </>
  );
}

// A price or stock change in the admin shows here within 5 minutes (it used to take up to an hour).
export const revalidate = 300;

// Product pages are built ahead of time, so a visitor arriving from an ad gets a ready page.
// A product added later is built on its first visit.
export async function generateStaticParams() {
  try {
    const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/discover/sitemap`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const body = await res.json();
    const products: { slug: string }[] = body?.data?.products ?? [];
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
