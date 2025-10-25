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
  title: "Natural Attar Collection | KhushbuWaala",
  description:
    "Explore KhushbuWaala's Natural and Authentic Attar collection. Premium fragrances with free nationwide shipping on orders over ৳1000.",
  keywords: [
    "natural attar",
    "authentic attar",
    "premium fragrance",
    "KhushbuWaala shop",
    "Bangladesh perfume",
  ].join(", "),
  alternates: { canonical: "https://khushbuwaala.com/natural-collection" },
};

// Structured Data (Optional)
const shopStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Natural Attar Collection",
  description:
    "Explore KhushbuWaala's curated collection of natural and authentic attars",
  url: "https://khushbuwaala.com/natural-collection",
  mainEntity: {
    "@type": "ItemList",
    name: "Perfume Oil Products",
    description: "Premium quality natural and authentic attars",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://khushbuwaala.com" },
      { "@type": "ListItem", position: 2, name: "Natural Attar", item: "https://khushbuwaala.com/natural-collection" },
    ],
  },
};

// Page Component
export default async function NaturalCollectionPage() {
  const category = "natural";
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
          heading="Explore Natural and Authentic Attar"
          text="Choose The Best Quality Natural & Authentic Attar"
          buttonText="Shop Now"
          link="/shop"
          images={{ desktop: "/images/n111.png", mobile: "/images/n1.webp" }}
          altText="Banner displaying the best quality natural & authentic attar"
          variant="premium"
        />

        {/* Notice Bar */}
        <div className="py-8 bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <NoticeBar heading="Natural Attar" notices={notices} interval={4500} />
        </div>

        {/* Shop Products */}
        <div id="products" className="bg-white pt-0 pb-8">
          <Suspense fallback={<ShopProductsSkeleton />}>
            <ShopProducts
              initialProducts={products}
              initialPage={1}
              totalPages={totalPages}
              category={category}
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
