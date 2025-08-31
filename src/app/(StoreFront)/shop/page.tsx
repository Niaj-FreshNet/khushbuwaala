import { Suspense } from "react";
import { Metadata } from "next";
import { NoticeBar } from "@/components/Modules/Shop/NoticeBar";
import { ShopBanner } from "@/components/Modules/Shop/ShopBanner";
import { ShopProducts } from "@/components/Modules/Shop/ShopProducts";
import { initializeStore } from "@/redux/store/ssrStore";
import { productApi } from "@/redux/store/api/product/productApi";
import { IProductResponse } from "@/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic metadata for SEO
export async function generateMetadata({
    searchParams: rawSearchParams,
}: {
    searchParams: { page?: string; category?: string; specification?: string; section?: string };
}): Promise<Metadata> {
    const searchParams = await Promise.resolve(rawSearchParams); // ✅ async-safe
    const page = Number(searchParams.page) || 1;

    const title = `Shop Perfumes${page > 1 ? ` - Page ${page}` : ""} | KhushbuWaala`;
    const description = `Browse${page > 1 ? ` page ${page} of` : ""} KhushbuWaala's premium perfume oils. Discover authentic fragrances with free shipping on orders over ৳1000.`;

    return {
        title,
        description,
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
            canonical: `https://khushbuwaala.com/shop${page > 1 ? `?page=${page}` : ""}`,
            languages: {
                "en-BD": `https://khushbuwaala.com/shop${page > 1 ? `?page=${page}` : ""}`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://khushbuwaala.com/shop${page > 1 ? `?page=${page}` : ""}`,
            images: [
                {
                    url: "/images/n111.webp",
                    width: 1920,
                    height: 550,
                    alt: "KhushbuWaala Premium Perfume Oil Collection"
                },
            ],
            type: "website",
            siteName: "KhushbuWaala",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/images/n111.webp"],
        },
        robots: {
            index: page <= 3,
            follow: true,
            googleBot: {
                index: page <= 3,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1
            },
        },
    };
}

// Structured data
const shopStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Premium Perfume Oil Collection",
    description: "Explore KhushbuWaala's curated collection of world-class perfume oils and fragrances",
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
                item: "https://khushbuwaala.com"
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Shop",
                item: "https://khushbuwaala.com/shop"
            },
        ],
    },
};

export default async function ShopPage({
    searchParams: rawSearchParams
}: {
    searchParams: Record<string, string | undefined>
}) {
    const searchParams = await Promise.resolve(rawSearchParams); // ✅ async-safe
    const store = initializeStore();

    const page = Number(searchParams.page) || 1;
    const category = searchParams.category;
    const specification = searchParams.specification;
    const section = searchParams.section;
    const priceMin = searchParams.priceMin ? Number(searchParams.priceMin) : undefined;
    const priceMax = searchParams.priceMax ? Number(searchParams.priceMax) : undefined;
    const smells = searchParams.smells;
    const sortBy = searchParams.sortBy as
        | "name"
        | "price_asc"
        | "price_desc"
        | "newest"
        | "oldest"
        | "popularity"
        | undefined;

    // Prefetch products
    const { data } = await store.dispatch(
        productApi.endpoints.getAllProducts.initiate({
            page,
            limit: 20,
            category,
            specification,
            section,
            priceMin,
            priceMax,
            smells,
            sortBy,
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(shopStructuredData) }} />
            <div className="w-full mx-auto">
                <ShopBanner
                    heading="Best Quality Perfume Oil Collection"
                    text="Choose Your Desired Perfume Oil from World's Best Perfume Oil Collection"
                    buttonText="Shop Now"
                    link="/shop"
                    images={{ desktop: "/images/n111.png", mobile: "/images/n1.webp" }}
                    altText="Banner displaying the best quality perfume oil collection"
                    variant="premium"
                />
                <div className="py-8 bg-gradient-to-r from-gray-50 via-white to-gray-50">
                    <NoticeBar heading="World's Finest Perfume Oils" notices={notices} interval={4500} />
                </div>
                <div id="products" className="bg-white pt-0 pb-8">
                    <Suspense fallback={<ShopProductsSkeleton />}>
                        <ShopProducts
                            initialProducts={products}
                            initialPage={page}
                            totalPages={totalPages}
                            category={category}
                            specification={specification}
                            section={section}
                            priceMin={priceMin}
                            priceMax={priceMax}
                            smells={smells}
                            sortBy={sortBy}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    );
}

// Skeleton component
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