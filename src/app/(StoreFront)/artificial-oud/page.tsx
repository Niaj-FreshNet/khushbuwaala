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
  title: "Artificial Oud Collection | KhushbuWaala",
  description:
    "Explore KhushbuWaala's Artificial Oud collection. Premium fragrances with free nationwide shipping on orders over ৳1000.",
  keywords: [
    "artificial oud",
    "oud perfume",
    "premium fragrance",
    "KhushbuWaala shop",
    "Bangladesh perfume",
  ].join(", "),
  alternates: { canonical: "https://khushbuwaala.com/artificial-oud" },
};

// Structured Data (Optional)
const shopStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Artificial Oud Collection",
  description:
    "Explore KhushbuWaala's curated collection of artificial oud perfumes and oils",
  url: "https://khushbuwaala.com/artificial-oud",
  mainEntity: {
    "@type": "ItemList",
    name: "Perfume Oil Products",
    description: "Premium quality artificial oud perfumes and oils",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://khushbuwaala.com" },
      { "@type": "ListItem", position: 2, name: "Artificial Oud", item: "https://khushbuwaala.com/artificial-oud" },
    ],
  },
};

// Page Component
export default async function ArtificialOudPage({
  searchParams: rawSearchParams
}: {
  searchParams: Record<string, string | undefined>
}) {
  const searchParams = await Promise.resolve(rawSearchParams); // ✅ async-safe

  const page = Number(searchParams.page) || 1;
  const categoryName = "ARTIFICIAL-OUD";
  const categoryId = "6904ab807a035c41185d2729";

  return (
    <>
      {/* Hidden crawlable pagination links */}
      {page > 1 && (
        <link
          rel="prev"
          href={`/artificial-oud?page=${page - 1}`}
        />
      )}
      {page < 100 && (
        <link
          rel="next"
          href={`/artificial-oud?page=${page + 1}`}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopStructuredData) }}
      />

      <ShopShell
        bannerHeading="The Best Artificial Editions Of Oud Oils"
        bannerText="Choose The Royal Fragrances From Artificial Oud Collection"
        bannerImages={{ desktop: "/images/n111.png", mobile: "/images/n1.webp" }}
        bannerAlt="Banner displaying artificial oud perfume collection"
        noticesHeading="Artificial Oud"
        initialPage={page}
        categoryId={categoryId}
        categoryName={categoryName}
        lockCategory={true} // ✅ category locked
      />
    </>
  );
}