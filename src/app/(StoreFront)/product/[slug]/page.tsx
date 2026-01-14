import { Metadata } from "next";
import { getProductBySlug } from "@/lib/Functions/ServerFn";
import HydrateProduct from "./_components/HydrateProduct";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
    };
  }

  // Extract first image for Open Graph
  const firstImage = product.primaryImage || "/default-product-image.jpg";

  return {
    title: `${product.name} - KhushbuWaala`,
    description: product.description?.substring(0, 160) || `Buy ${product.name} online`,
    keywords: [
      product.name,
      product.brand,
      typeof product.category === "string"
        ? product.category
        : product.category?.categoryName,
      "perfume",
      "fragrance",
      "KhushbuWaala",
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description || `Buy ${product.name} online`,
      images: [
        {
          url: firstImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Buy ${product.name} online`,
      images: [firstImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Use Next.js notFound() for better UX and SEO
  if (!product) {
    notFound();
  }

  return <HydrateProduct initialData={product} slug={slug} />;
}