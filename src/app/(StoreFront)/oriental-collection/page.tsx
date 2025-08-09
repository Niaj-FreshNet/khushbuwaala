import { NoticeBar } from "@/components/Modules/Shop/NoticeBar";
import { ShopBanner } from "@/components/Modules/Shop/ShopBanner";
import { ShopProducts } from "@/components/Modules/Shop/ShopProducts";
import type { Metadata } from "next";

// SEO: Enhanced page-specific metadata
export const metadata: Metadata = {
  title: "Shop - Premium Perfume Oil Collection | KhushbuWaala",
  description:
    "Discover KhushbuWaala's world-class perfume oil collection. Premium quality fragrances with free nationwide shipping on orders over ৳1000. Up to 50% off selected items!",
  keywords: [
    "perfume oil",
    "premium fragrance",
    "attar collection",
    "KhushbuWaala shop",
    "online perfume store",
    "natural fragrance",
    "oriental perfume",
    "inspired perfume oil",
    "artificial oud",
    "Bangladesh perfume",
  ].join(", "),
  alternates: {
    canonical: "https://khushbuwaala.com/shop",
  },
  openGraph: {
    title: "Shop - Premium Perfume Oil Collection | KhushbuWaala",
    description:
      "Explore our curated collection of world-class perfume oils. Premium quality, authentic fragrances with fast delivery across Bangladesh.",
    url: "https://khushbuwaala.com/shop",
    images: [
      {
        url: "/images/n111.webp",
        width: 1920,
        height: 550,
        alt: "KhushbuWaala Premium Perfume Oil Collection",
      },
    ],
    type: "website",
    siteName: "KhushbuWaala",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Premium Perfume Oils | KhushbuWaala",
    description:
      "Discover authentic fragrances with free shipping on orders over ৳1000",
    images: ["/images/n111.webp"],
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

// Enhanced structured data for the shop page
const shopStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Premium Perfume Oil Collection",
  description:
    "Explore KhushbuWaala's curated collection of world-class perfume oils and fragrances",
  url: "https://khushbuwaala.com/shop",
  mainEntity: {
    "@type": "ItemList",
    name: "Perfume Oil Products",
    description: "Premium quality perfume oils and fragrances",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://khushbuwaala.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://khushbuwaala.com/shop",
      },
    ],
  },
};

export default function OrinetalCollectionPage() {

  const category = "oriental";

  const notices = [
    "🚚 Free Nationwide Shipping on Orders Over ৳1000",
    "🔥 Up to 50% Off on Selected Premium Items",
    "✨ Authentic Quality Guaranteed - 100% Original Products",
    "🏪 Visit Our Banasree Outlet for In-Person Experience",
    "💝 Special Gift Wrapping Available for All Orders",
  ];

  return (
    <div className="w-full mx-auto">
      {/* Shop Banner */}
      <ShopBanner
                    heading="Explore Oriental Fragrances"
                    text="Choose Your Desired Perfume Oil from Oriental & Arabian Attar Collections"
        buttonText={"Shop Now"}
        link={"/oriental-collection"}
        images={{
          desktop: "/images/n111.png",
          mobile: "/images/n1.webp",
        }}
                    altText="Banner displaying the best quality perfume oil collection"
        variant="premium"
      />

      {/* Enhanced Notice Bar */}
      <div className="py-8 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <NoticeBar
                    heading="Oriental & Arabian Attar"
          notices={notices}
          interval={4500}
        />
      </div>

      {/* Enhanced Shop Products Section */}
      <div id="products" className="bg-white pt-0 pb-8">
        <ShopProducts category={category} />
      </div>
    </div>
  );
}
