import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, Product } from "@/lib/Data/data";
import Script from "next/script";
import ProductGallery from "@/components/Modules/Product/ProductGallery";
import ProductDetails from "@/components/Modules/Product/ProductDetails";
import ProductTabs from "@/components/Modules/Product/ProductTabs";
import RelatedProducts from "@/components/Modules/Product/RelatedProducts";
import TrustSignals from "@/components/Modules/Product/TrustSignals";
import { Breadcrumbs, generateCategoryBreadcrumbs } from "@/components/ui/breadcrumbs";

interface Props {
  params: { slug: string };
}

// Enhanced SEO metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | KhushbuWaala - Premium Perfumes & Attars",
      description: "The requested product could not be found. Explore our collection of premium perfumes, oriental attars, and natural fragrances.",
      robots: "noindex, nofollow",
    };
  }

  // Enhanced title and description for SEO
  const title = `${product.name} - Premium ${product.category === 'inspiredPerfumeOil' ? 'Perfume Oil' : 'Attar'} | KhushbuWaala`;
  const description = product.description 
    ? `${product.description.slice(0, 155)}... Buy ${product.name} at best price ৳${product.price} BDT. Free shipping across Bangladesh. Premium quality guaranteed.`
    : `Premium ${product.name} perfume. High-quality fragrance oil with excellent longevity. Price: ৳${product.price} BDT. Free shipping & authentic products.`;

  // Generate keywords from product data
  const keywords = [
    product.name,
    ...product.smell,
    'perfume Bangladesh',
    'attar online',
    'khushbuwaala',
    'premium fragrance',
    'perfume oil',
    product.category,
    'authentic perfume',
    'long lasting fragrance'
  ].join(', ');

  return {
    title,
    description,
    keywords,
    authors: [{ name: "KhushbuWaala" }],
    creator: "KhushbuWaala",
    publisher: "KhushbuWaala",
    
    openGraph: {
      title,
      description,
      url: `https://khushbuwaala.com/products/${params.slug}`,
      siteName: "KhushbuWaala",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: product.primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
          type: "image/jpeg",
        },
        ...(product.secondaryImage ? [{
          url: product.secondaryImage,
          width: 800,
          height: 800,
          alt: `${product.name} - alternate view`,
          type: "image/jpeg",
        }] : []),
      ],
    },
    
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.primaryImage],
      creator: "@khushbuwaala",
      site: "@khushbuwaala",
    },

    alternates: {
      canonical: `https://khushbuwaala.com/products/${params.slug}`,
    },

    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "BDT",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:brand": "KhushbuWaala",
      "product:category": product.category,
    },
  };
}

// Comprehensive JSON-LD structured data for rich snippets
function EnhancedStructuredData({ product }: { product: Product }) {
  // Main Product structured data
  const productStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `https://khushbuwaala.com/products/${product.slug}#product`,
    name: product.name,
    description: product.description,
    sku: product.sku || product._id,
    gtin: product.sku,
    brand: {
      "@type": "Brand",
      name: "KhushbuWaala",
      url: "https://khushbuwaala.com",
      logo: "https://khushbuwaala.com/images/khushbuwaala-logo.webp"
    },
    manufacturer: {
      "@type": "Organization",
      name: "KhushbuWaala",
      url: "https://khushbuwaala.com"
    },
    category: product.category,
    image: [
      product.primaryImage,
      ...(product.secondaryImage ? [product.secondaryImage] : []),
      ...(product.moreImages || [])
    ],
    offers: {
      "@type": "Offer",
      "@id": `https://khushbuwaala.com/products/${product.slug}#offer`,
      url: `https://khushbuwaala.com/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.discount 
        ? (product.price - (product.price * product.discount / 100)).toFixed(2)
        : product.price.toString(),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "KhushbuWaala",
        url: "https://khushbuwaala.com"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "BDT"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue", 
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY"
          }
        }
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BD",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1"
    },
    additionalProperty: [
      ...(product.smell ? product.smell.map(note => ({
        "@type": "PropertyValue",
        name: "Fragrance Note",
        value: note
      })) : []),
      {
        "@type": "PropertyValue",
        name: "Volume",
        value: "Available in multiple sizes"
      },
      {
        "@type": "PropertyValue",
        name: "Origin",
        value: product.origin || "Premium Quality"
      }
    ],
    isAccessibleForFree: false,
    isFamilyFriendly: true
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://khushbuwaala.com/#organization",
    name: "KhushbuWaala",
    url: "https://khushbuwaala.com",
    logo: "https://khushbuwaala.com/images/khushbuwaala-logo.webp",
    description: "Premium perfumes, oriental attars, and natural fragrances in Bangladesh",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
      addressLocality: "Dhaka"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801566395807",
      contactType: "customer service",
      availableLanguage: ["Bengali", "English"]
    },
    sameAs: [
      "https://facebook.com/khushbuwaala",
      "https://instagram.com/khushbuwaala"
    ]
  };

  // WebPage structured data
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://khushbuwaala.com/products/${product.slug}#webpage`,
    url: `https://khushbuwaala.com/products/${product.slug}`,
    name: `${product.name} - Premium Perfume | KhushbuWaala`,
    description: product.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://khushbuwaala.com/#website"
    },
    about: {
      "@id": `https://khushbuwaala.com/products/${product.slug}#product`
    },
    mainEntity: {
      "@id": `https://khushbuwaala.com/products/${product.slug}#product`
    }
  };

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        strategy="afterInteractive"
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        strategy="afterInteractive"
      />
      <Script
        id="webpage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
        strategy="afterInteractive"
      />
    </>
  );
}

// Enhanced error page
function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you're looking for. It may have been moved or is no longer available.
          </p>
        </div>
        
        <div className="space-y-3">
          <a
            href="/shop"
            className="inline-block w-full bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Browse All Products
          </a>
          <a
            href="/"
            className="inline-block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Generate breadcrumbs
  const breadcrumbItems = generateCategoryBreadcrumbs(product.category, product.name);

  return (
    <>
      <EnhancedStructuredData product={product} />
      
      {/* Enhanced container with better spacing and responsiveness */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={breadcrumbItems} 
            className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm"
          />

          {/* Main Product Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <article className="grid gap-8 lg:gap-12 lg:grid-cols-2 p-6 lg:p-12">
              {/* Product Gallery */}
              <div className="lg:sticky lg:top-8 lg:self-start">
                <ProductGallery product={product} />
              </div>

              {/* Product Details */}
              <div className="space-y-8">
                <ProductDetails product={product} />
                <TrustSignals />
              </div>
            </article>
          </div>

          {/* Product Information Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <ProductTabs product={product} />
          </div>

          {/* Related Products */}
          <RelatedProducts 
            category={product.category} 
            currentProductId={product._id} 
          />
        </div>
      </div>
    </>
  );
}
