import { Metadata } from "next";
import { getProductBySlug, Product } from "@/lib/Data/data";
import Script from "next/script";
import ProductGallery from "@/components/Modules/Product/ProductGallery";
import ProductDetails from "@/components/Modules/Product/ProductDetails";
import ProductAccordion from "@/components/Modules/Product/ProductAccordion";
import RelatedProducts from "@/components/Modules/Product/RelatedProducts";

interface Props {
  params: { slug: string };
}

// Generate SEO metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | KhushbuWaala",
      description: "Sorry, product not found.",
    };
  }

  return {
    title: `${product.name} | KhushbuWaala`,
    description: product.description || "Premium products at KhushbuWaala",
    // openGraph: {
    //   title: product.name,
    //   description: product.description,
    //   url: `https://khushbuwaala.com/product/${product.slug}`,
    //   type: "product",
    //   images: [
    //     {
    //       url: product.primaryImage,
    //       width: 800,
    //       height: 800,
    //       alt: product.name,
    //     },
    //   ],
    // },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.primaryImage],
    },
  };
}

// JSON-LD structured data for SEO rich snippets
function StructuredData({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.primaryImage],
    description: product.description,
    sku: product._id,
    offers: {
      "@type": "Offer",
      url: `https://khushbuwaala.com/product/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price.toString(),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <Script
      id="ld-json"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-3xl font-bold text-red-600 mb-2">
          Product not found.
        </h2>
        <p className="text-lg text-gray-500">
          We couldn’t find the product you’re looking for.
        </p>
      </div>
    );

  return (
    <>
      <StructuredData product={product} />
      <article className="relative grid gap-12 lg:grid-cols-2 max-w-screen-xl mx-auto py-10 lg:py-20 px-4 sm:px-6">
        <ProductGallery product={product} />
        <div className="flex flex-col gap-8 lg:sticky lg:top-28">
          <ProductDetails product={product} />
          <ProductAccordion product={product} />
        </div>
      </article>
      <RelatedProducts category={product.category} currentProductId={product._id} />
    </>
  );
}
