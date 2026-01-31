import { Suspense } from "react";
import { Metadata } from "next";
import { NoticeBar } from "@/components/Modules/Shop/NoticeBar";
import { ShopBanner } from "@/components/Modules/Shop/ShopBanner";
import { ShopProducts } from "@/components/Modules/Shop/ShopProducts";
import { initializeStore } from "@/redux/store/ssrStore";
import { productApi } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";
import { ShopShell } from "@/components/Modules/Shop/ShopShell";

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
export default async function NaturalCollectionPage({
  searchParams: rawSearchParams
}: {
  searchParams: Record<string, string | undefined>
}) {
  const searchParams = await Promise.resolve(rawSearchParams); // ✅ async-safe
  // const store = initializeStore();

  const page = Number(searchParams.page) || 1;
  const categoryName = "NATURAL-ATTAR";
  const categoryId = "";

  return (
    <>
      {/* Hidden crawlable pagination links */}
      {page > 1 && (
        <link
          rel="prev"
          href={`/natural-attar?page=${page - 1}`}
        />
      )}
      {page < 100 && (
        <link
          rel="next"
          href={`/natural-attar?page=${page + 1}`}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopStructuredData) }}
      />

      <ShopShell
        bannerHeading="Explore Natural and Authentic Attar"
        bannerText="Choose The Best Quality Natural & Authentic Attar"
        bannerImages={{ desktop: "/images/n111.png", mobile: "/images/n1.webp" }}
        bannerAlt="anner displaying the best quality natural & authentic attar"
        noticesHeading="Natural Attar"
        initialPage={page}
        categoryId={categoryId}
        categoryName={categoryName}
        lockCategory={true} // ✅ category locked
      />
    </>
  );
}