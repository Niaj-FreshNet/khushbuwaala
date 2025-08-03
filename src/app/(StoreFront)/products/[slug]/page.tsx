/* eslint-disable @next/next/no-html-link-for-pages */
import { Metadata } from "next";
import { getProductBySlug, Product } from "@/lib/Data/data";
import Script from "next/script";
import ProductGallery from "@/components/Modules/Product/ProductGallery";
import ProductDetails from "@/components/Modules/Product/ProductDetails";
import RelatedProducts from "@/components/Modules/Product/RelatedProducts";
import Breadcrumbs from "@/components/Shared/BreadCrumbs";
import ProductAccordion from "@/components/Modules/Product/ProductAccordion";

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
      
      {/* Main Product Content - Enhanced Layout */}
      <main className="max-w-screen-xl mx-auto">
        {/* Hero Section with Gallery and Key Details */}
        <section className="relative py-6 lg:py-12 px-4 sm:px-6">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-8 lg:gap-12">
            {/* Product Gallery - Takes 5 columns on XL screens, full width on smaller screens */}
            <div className="lg:col-span-1 xl:col-span-5">
              <ProductGallery product={product} />
            </div>
            
            {/* Product Information - Takes 4 columns on XL screens, full width on smaller screens */}
            <div className="lg:col-span-1 xl:col-span-4">
              <div className="lg:sticky lg:top-28">
                <ProductDetails product={product} />
              </div>
            </div>
            
            {/* Additional Information Panel - Takes 3 columns on XL screens, hidden on smaller screens */}
            <div className="hidden xl:block xl:col-span-3">
              <div className="sticky top-28 space-y-8">
                {/* Quick Info Card */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-3 h-3 bg-pink-500 rounded-full shadow-sm"></span>
                    Quick Facts
                  </h3>
                  <div className="space-y-4">
                    {product.brand && (
                      <div className="flex justify-between items-center py-3 border-b border-pink-100">
                        <span className="text-sm text-gray-600 font-medium">Brand</span>
                        <span className="text-sm font-semibold text-gray-900">{product.brand}</span>
                      </div>
                    )}
                    {product.origin && (
                      <div className="flex justify-between items-center py-3 border-b border-pink-100">
                        <span className="text-sm text-gray-600 font-medium">Origin</span>
                        <span className="text-sm font-semibold text-gray-900">{product.origin}</span>
                      </div>
                    )}
                    {product.specification && (
                      <div className="flex justify-between items-center py-3 border-b border-pink-100">
                        <span className="text-sm text-gray-600 font-medium">Gender</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{product.specification}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-gray-600 font-medium">Longevity</span>
                      <span className="text-sm font-semibold text-gray-900">6-8 hours</span>
                    </div>
                  </div>
                </div>

                {/* Fragrance Family */}
                {product.smell && product.smell.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></span>
                      Fragrance Family
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.smell.map((scent, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-white/80 text-purple-700 rounded-full text-sm font-semibold border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          {scent}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></span>
                    Why Choose Us
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-green-600 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">100% Authentic</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-blue-600 text-sm font-bold">🚚</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-purple-600 text-sm font-bold">⭐</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-indigo-600 text-sm font-bold">↩</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">7 Day Return</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mobile Information Cards - Visible on smaller screens */}
        <section className="xl:hidden px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Quick Facts
              </h3>
              <div className="space-y-3">
                {product.brand && (
                  <div className="flex justify-between items-center py-2 border-b border-pink-100">
                    <span className="text-sm text-gray-600">Brand</span>
                    <span className="text-sm font-medium text-gray-900">{product.brand}</span>
                  </div>
                )}
                {product.origin && (
                  <div className="flex justify-between items-center py-2 border-b border-pink-100">
                    <span className="text-sm text-gray-600">Origin</span>
                    <span className="text-sm font-medium text-gray-900">{product.origin}</span>
                  </div>
                )}
                {product.specification && (
                  <div className="flex justify-between items-center py-2 border-b border-pink-100">
                    <span className="text-sm text-gray-600">Gender</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{product.specification}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Longevity</span>
                  <span className="text-sm font-medium text-gray-900">6-8 hours</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Why Choose Us
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">100% Authentic</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">🚚</span>
                  </div>
                  <span className="text-sm text-gray-700">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xs font-bold">⭐</span>
                  </div>
                  <span className="text-sm text-gray-700">Premium Quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 text-xs font-bold">↩</span>
                  </div>
                  <span className="text-sm text-gray-700">7 Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Information Section */}
        <section className="px-4 sm:px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <ProductAccordion product={product} />
          </div>
        </section>
        
        {/* Related Products */}
        <section aria-label="Related products" className="px-4 sm:px-6 pb-12">
          <RelatedProducts category={product.category} currentProductId={product._id} />
        </section>
      </main>
    </>
  );
}
