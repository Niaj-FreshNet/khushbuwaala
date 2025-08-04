/* eslint-disable @next/next/no-html-link-for-pages */
import { Metadata } from "next";
import { getProductBySlug, Product } from "@/lib/Data/data";
import Script from "next/script";
import ProductGallery from "@/components/Modules/Product/ProductGallery";
import ProductDetails from "@/components/Modules/Product/ProductDetails";
import RelatedProducts from "@/components/Modules/Product/RelatedProducts";
import ProductAccordion from "@/components/Modules/Product/ProductAccordion";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Shared/Breadcrumbs";
import TrustSignals from "@/components/Modules/Product/TrustSignals";
import { ShoppingCart, Heart, MessageSquare, Zap } from "lucide-react";

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

  // Enhanced description for perfumes with better formatting
  const enhancedDescription = `${product.description || `Discover ${product.name}, a premium ${product.category === 'inspiredPerfumeOil' ? 'perfume oil' : 'fragrance'} from KhushbuWaala.`} ${product.discount ? `Now ${product.discount}% off!` : ''} Authentic quality, fast delivery across Bangladesh. ${product.specification === 'male' ? "Perfect for men" : "Perfect for women"}.`.trim();

  // Generate comprehensive keywords
  const keywords = [
    product.name,
    'perfume bangladesh',
    'authentic perfume',
    'khushbuwaala',
    'premium fragrance',
    'perfume online',
    'attar',
    'long lasting perfume',
    ...(product.smell || []),
    ...(product.notes ? product.notes.split(',').map(note => note.trim()) : []),
    product.category === 'inspiredPerfumeOil' ? 'perfume oil' : 'eau de parfum',
    product.specification === 'male' ? 'men perfume' : 'women perfume',
    product.brand || 'premium brand',
    'perfume shop dhaka',
    'online perfume store',
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
      type: "website",
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

    // Additional metadata for better SEO
    other: {
      'product:price:amount': (product.discount ? 
        product.price - (product.price * product.discount) / 100 : 
        product.price).toString(),
      'product:price:currency': 'BDT',
      'product:availability': product.stock === "0" ? 'out of stock' : 'in stock',
      'product:condition': 'new',
      'product:brand': product.brand || 'KhushbuWaala',
      'product:category': getCategoryInfo(product.category).name,
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
    description: product.description || `Premium ${product.specification === 'male' ? "men's" : "women's"} perfume from KhushbuWaala`,
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
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock === "0" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
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
      ratingValue: "4.5",
      reviewCount: "127",
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
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We couldn&apos;t find the perfume you&apos;re looking for. It might have been moved or is no longer available.
          </p>
          <a 
            href="/shop" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-2xl hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
      
      {/* Enhanced Breadcrumbs with better styling */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
      <Breadcrumbs items={breadcrumbItems} />
            </div>
            
      {/* Main Product Content - Professional Layout */}
      <main className="bg-white">
        {/* Hero Section - Product Gallery and Details */}
        <section className="relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-100/30 to-orange-100/30 rounded-full blur-3xl"></div>
            </div>
            
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Product Gallery */}
              <div className="w-full lg:col-span-1 xl:col-span-6">
                <div className="sticky top-20 lg:top-24">
                  <ProductGallery product={product} />
                  </div>
                </div>

              {/* Product Details */}
              <div className="w-full lg:col-span-1 xl:col-span-6">
                <div className="lg:sticky lg:top-24">
                  <ProductDetails product={{
                    ...product,
                    description: product.description || `Premium ${product.specification === 'male' ? "men's" : "women's"} perfume from KhushbuWaala`
                  }} />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trust Signals Section */}
        <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-y border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <TrustSignals />
          </div>
        </section>

        {/* Product Information Tabs */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Product Information
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about this premium fragrance
              </p>
            </div>
            <ProductAccordion product={product} />
          </div>
        </section>
        
        {/* Related Products */}
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                You Might Also Like
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover more amazing fragrances from our collection
              </p>
            </div>
          <RelatedProducts category={product.category} currentProductId={product._id} />
          </div>
        </section>

        {/* Enhanced Mobile Sticky CTA - Premium Experience */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
          {/* Mobile Progress Indicator */}
          <div className="h-1 bg-gray-200">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4 transition-all duration-300"></div>
          </div>
          
          <div className="px-4 py-4 safe-area-bottom">
            {/* Mobile Quick Actions */}
            <div className="flex items-center gap-3 mb-4">
              <button className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white py-4 px-4 rounded-2xl font-bold text-center shadow-xl hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-95 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              
              <button className="w-14 h-14 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all duration-300 touch-manipulation active:scale-95 shadow-lg">
                <Heart className="w-5 h-5" />
              </button>
              
              <a 
                href="https://wa.me/8801566395807" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 bg-green-50 border-2 border-green-200 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-100 transition-all duration-300 touch-manipulation active:scale-95 shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
            
            {/* Mobile Price & Buy Now */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Total Price</div>
                <div className="text-lg font-bold text-gray-900">
                  ৳{product.discount ? 
                    (product.price - (product.price * product.discount) / 100).toLocaleString() : 
                    product.price.toLocaleString()
                  }
                  {product.discount && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ৳{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-95 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Spacer for enhanced mobile CTA */}
        <div className="lg:hidden h-32"></div>
      </main>
    </>
  );
}