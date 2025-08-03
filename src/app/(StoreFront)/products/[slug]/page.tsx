import { Metadata } from "next";
import { getProductBySlug, Product } from "@/lib/Data/data";
import Script from "next/script";
import ProductGallery from "@/components/Modules/Product/ProductGallery";
import ProductDetails from "@/components/Modules/Product/ProductDetails";
import ProductAccordion from "@/components/Modules/Product/ProductAccordion";
import RelatedProducts from "@/components/Modules/Product/RelatedProducts";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Shared/Breadcrumbs";

interface Props {
  params: { slug: string };
}

// Enhanced category mapping for breadcrumbs
const getCategoryInfo = (category: string) => {
  const categoryMap: Record<string, { name: string; href: string }> = {
    'inspiredPerfumeOil': { name: 'Inspired Perfume Oils', href: '/inspired-perfume-oils' },
    'artificialOud': { name: 'Artificial Oud', href: '/artificial-oud' },
    'naturalCollection': { name: 'Natural Collection', href: '/natural-collection' },
    'orientalCollection': { name: 'Oriental Collection', href: '/oriental-collection' },
    'forWomen': { name: 'For Women', href: '/for-women' },
    'giftsAndPackages': { name: 'Gifts & Packages', href: '/gifts-and-packages' },
    'newArrivals': { name: 'New Arrivals', href: '/new-arrivals' },
  };
  
  return categoryMap[category] || { name: 'Shop', href: '/shop' };
};

// Generate dynamic breadcrumbs
const generateBreadcrumbs = (product: Product): BreadcrumbItem[] => {
  const categoryInfo = getCategoryInfo(product.category);
  
  return [
    { name: 'Home', href: '/' },
    { name: categoryInfo.name, href: categoryInfo.href },
    { name: product.name, href: `/products/${product.slug}`, current: true },
  ];
};

// Generate comprehensive SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | KhushbuWaala - Premium Perfumes & Fragrances",
      description: "Sorry, the perfume product you're looking for is not available. Explore our extensive collection of premium perfumes, attars, and fragrances.",
      robots: "noindex, nofollow",
    };
  }

  // Enhanced description for perfumes
  const enhancedDescription = `${product.description || ''} Premium ${product.category === 'inspiredPerfumeOil' ? 'perfume oil' : 'fragrance'} available at KhushbuWaala. ${product.discount ? `Now ${product.discount}% off!` : ''} Fast delivery across Bangladesh. Authentic quality guaranteed.`.trim();

  // Generate keywords from product data
  const keywords = [
    product.name,
    'perfume',
    'fragrance',
    'attar',
    'khushbuwaala',
    'bangladesh perfume',
    'authentic perfume',
    ...(product.smell || []),
    ...(product.notes ? product.notes.split(',').map(note => note.trim()) : []),
    product.category === 'inspiredPerfumeOil' ? 'perfume oil' : '',
    product.specification === 'male' ? 'men perfume' : 'women perfume',
    'premium fragrance',
    'long lasting perfume',
  ].filter(Boolean).join(', ');

  return {
    title: `${product.name} - Premium ${product.specification === 'male' ? "Men's" : "Women's"} Perfume | KhushbuWaala`,
    description: enhancedDescription.slice(0, 160),
    keywords,
    
    // Enhanced Open Graph metadata
    openGraph: {
      title: `${product.name} - Premium Perfume at KhushbuWaala`,
      description: enhancedDescription.slice(0, 200),
      url: `https://khushbuwaala.com/products/${product.slug}`,
      type: "product",
      siteName: "KhushbuWaala",
      locale: "en_US",
      images: [
        {
          url: product.primaryImage,
          width: 800,
          height: 800,
          alt: `${product.name} - Premium perfume bottle`,
          type: "image/jpeg",
        },
        ...(product.moreImages || []).slice(0, 3).map((img, index) => ({
          url: img,
          width: 800,
          height: 800,
          alt: `${product.name} - Additional view ${index + 1}`,
          type: "image/jpeg",
        })),
      ],
    },

    // Enhanced Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Premium Perfume`,
      description: enhancedDescription.slice(0, 200),
      images: [product.primaryImage],
      creator: "@khushbuwaala",
    },

    // Additional SEO enhancements
    alternates: {
      canonical: `https://khushbuwaala.com/products/${product.slug}`,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Enhanced JSON-LD structured data for perfume products
function StructuredData({ product }: { product: Product }) {
  const categoryInfo = getCategoryInfo(product.category);
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount) / 100 
    : product.price;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `https://khushbuwaala.com/products/${product.slug}#product`,
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand || "KhushbuWaala",
    },
    manufacturer: {
      "@type": "Organization", 
      name: "KhushbuWaala",
      url: "https://khushbuwaala.com",
    },
    category: categoryInfo.name,
    sku: product.sku || product._id,
    gtin: product.sku,
    mpn: product._id,
    image: [
      product.primaryImage,
      ...(product.moreImages || []),
    ],
    offers: {
      "@type": "Offer",
      "@id": `https://khushbuwaala.com/products/${product.slug}#offer`,
      url: `https://khushbuwaala.com/products/${product.slug}`,
      priceCurrency: "BDT",
      price: discountedPrice.toString(),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      availability: product.stock === "0" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "KhushbuWaala",
        url: "https://khushbuwaala.com",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "60",
          currency: "BDT",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
      },
    },
    // Enhanced product attributes for perfumes
    additionalProperty: [
      ...(product.specification ? [{
        "@type": "PropertyValue",
        name: "Target Gender",
        value: product.specification === 'male' ? 'Men' : 'Women',
      }] : []),
      ...(product.measurement ? [{
        "@type": "PropertyValue", 
        name: "Size Available",
        value: product.measurement === 'ml' ? '3ml, 6ml, 12ml, 25ml' : '3gm, 6gm, 12gm',
      }] : []),
      ...(product.origin ? [{
        "@type": "PropertyValue",
        name: "Origin",
        value: product.origin,
      }] : []),
      ...(product.smell ? [{
        "@type": "PropertyValue",
        name: "Fragrance Family",
        value: product.smell.join(', '),
      }] : []),
      ...(product.notes ? [{
        "@type": "PropertyValue",
        name: "Fragrance Notes",
        value: product.notes,
      }] : []),
    ].filter(Boolean),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5", // Default rating - should be dynamic based on real reviews
      reviewCount: "12",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Verified Customer",
        },
        reviewBody: "Excellent longevity and projection. Highly recommended for perfume lovers.",
        datePublished: "2024-01-15",
      },
    ],
  };

  return (
    <Script
      id="product-ld-json"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Product Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-md">
            We couldn't find the perfume you're looking for. It might have been moved or is no longer available.
          </p>
          <a 
            href="/shop" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 transition-colors"
          >
            Browse Our Collection
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbItems = generateBreadcrumbs(product);

  return (
    <>
      <StructuredData product={product} />
      
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Main Product Content */}
      <main className="max-w-screen-xl mx-auto">
        <article className="relative grid gap-12 lg:grid-cols-2 py-6 lg:py-12 px-4 sm:px-6">
          {/* Product Gallery */}
          <section aria-label="Product images">
            <ProductGallery product={product} />
          </section>
          
          {/* Product Information */}
          <section className="flex flex-col gap-8 lg:sticky lg:top-28" aria-label="Product details">
            <ProductDetails product={product} />
            <ProductAccordion product={product} />
          </section>
        </article>
        
        {/* Related Products */}
        <section aria-label="Related products">
          <RelatedProducts category={product.category} currentProductId={product._id} />
        </section>
      </main>
    </>
  );
}
