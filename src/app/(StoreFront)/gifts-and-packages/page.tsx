import { Suspense } from "react";
import { Metadata } from "next";
import { NoticeBar } from "@/components/Modules/Shop/NoticeBar";
import { ShopBanner } from "@/components/Modules/Shop/ShopBanner";
import { ShopProducts } from "@/components/Modules/Shop/ShopProducts";
import { initializeStore } from "@/redux/store/ssrStore";
import { productApi } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";

// Metadata
export const metadata: Metadata = {
  title: "Perfume Gift Packages | KhushbuWaala",
  description:
    "Explore KhushbuWaala's curated perfume gift packages. Premium quality fragrances with free nationwide shipping on orders over ৳1000.",
  keywords: [
    "perfume gift",
    "perfume packages",
    "premium fragrance",
    "KhushbuWaala shop",
    "Bangladesh perfume",
  ].join(", "),
  alternates: { canonical: "https://khushbuwaala.com/gifts-and-packages" },
};

// Structured Data
const shopStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Perfume Gift Packages",
  description:
    "Explore KhushbuWaala's curated collection of perfume gift packages",
  url: "https://khushbuwaala.com/gifts-and-packages",
  mainEntity: {
    "@type": "ItemList",
    name: "Perfume Gift Products",
    description: "Premium perfume gift packages and boxes",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://khushbuwaala.com" },
      { "@type": "ListItem", position: 2, name: "Gifts & Packages", item: "https://khushbuwaala.com/gifts-and-packages" },
    ],
  },
};

// Page Component
export default async function GiftsAndPackagesPage() {
  const category = "giftsAndPackages";
  const store = initializeStore();

  // Fetch products on server
  const { data } = await store.dispatch(
    productApi.endpoints.getAllProducts.initiate({
      page: 1,
      limit: 20,
      category,
    })
  );

  const products: IProductResponse[] = data?.data || [];
  const totalPages = data?.meta.totalPage || 1;

  const notices = [
    "🚚 Free Nationwide Shipping on Orders Over ৳1000",
    "🔥 Up to 50% Off on Selected Premium Items",
    "✨ Authentic Quality Guaranteed - 100% Original Products",
    "🏪 Visit Our Banasree Outlet for In-Person Experience",
    "💝 Special Gift Wrapping Available for All Orders",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopStructuredData) }}
      />
      <div className="w-full mx-auto">
        {/* Shop Banner */}
        <ShopBanner
          heading="Perfume Packages and Gift Boxes"
          text="Choose Your Desired Perfume Oil Packages and Gifts for The Season"
          buttonText="Shop Now"
          link="/gifts-and-packages"
          images={{ desktop: "/images/n111.png", mobile: "/images/n1.webp" }}
          altText="Banner displaying the best quality perfume oil gift packages"
          variant="premium"
        />

        {/* Notice Bar */}
        <div className="py-8 bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <NoticeBar heading="Gifts & Packages" notices={notices} interval={4500} />
        </div>

        {/* Shop Products */}
        <div id="products" className="bg-white pt-0 pb-8">
          <Suspense fallback={<ShopProductsSkeleton />}>
            <ShopProducts
              category={category}
              initialProducts={products}
              initialPage={1}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// Skeleton
function ShopProductsSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <Skeleton className="w-full h-64 rounded-t-xl" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
