import ProductGallery from "@/components/Modules/Product/ProductGallery";
import ProductAccordion from "@/components/Modules/Product/ProductAccordion";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Shared/Breadcrumbs";
import TrustSignals from "@/components/Modules/Product/TrustSignals";
import StickyCartObserver from "@/components/Modules/Product/StickyCartObserver";
import { Info } from "lucide-react";
import ProductDetailSection from "@/components/Modules/Product/ProductDetailSection";
import { ProductSelectionProvider } from "@/context/ProductSelectionContext";
import { IProduct, IProductResponse } from "@/types/product.types";
import mapProductResponseToProduct from "@/lib/Functions/ClientFn";
import { Suspense } from "react";
import SimilarScents from "@/components/Modules/Product/SimilarScents";
import ScentProfile, { type ProductProfile } from "@/components/Modules/Product/ScentProfile";
import WishlistButton from "@/components/Modules/Product/WishlistButton";
import ProductPageBottomBar from "@/components/Modules/Product/ProductPageBottomBar";
import ViewItemDataLayer from "./ViewItemDataLayer";
import TrackVariantChange from "./TrackVariantChange";

interface IProductResponseProps {
    product: IProductResponse;
}

// ✅ Category mapping for breadcrumbs
const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { name: string; href: string }> = {
        inspiredPerfumeOil: {
            name: "Inspired Perfume Oils",
            href: "/inspired-perfume-oil",
        },
        artificialOud: { name: "Artificial Oud", href: "/artificial-oud" },
        orientalCollection: {
            name: "Oriental Collection",
            href: "/oriental-attar",
        },
        naturalCollection: {
            name: "Natural Attar",
            href: "/natural-attar",
        },
        organicAttar: {
            name: "Organic Attar",
            href: "/organic-attar",
        },
        forWomen: { name: "For Women", href: "/womens-perfume" },
        giftsAndPackages: {
            name: "Gifts & Packages",
            href: "/gifts-and-packages",
        },
        newArrivals: { name: "New Arrivals", href: "/new-arrivals" },
    };

    return categoryMap[category] || { name: "Shop", href: "/shop" };
};

// The collection page of each category (category name in lowercase with dashes)
const CATEGORY_PAGES: Record<string, { name: string; href: string }> = {
    "inspired-perfume-oil": { name: "Inspired Perfume Oils", href: "/inspired-perfume-oil" },
    "oriental-attar": { name: "Oriental & Arabian Attar", href: "/oriental-attar" },
    "artificial-oud": { name: "Oud Collection", href: "/artificial-oud" },
    "natural-attar-oil": { name: "Natural Attar", href: "/organic-attar" },
    "brand-perfumes": { name: "Brand Perfumes", href: "/brand-perfumes" },
    "gifts-and-packages": { name: "Gift Sets & Packages", href: "/gifts-and-packages" },
};

// ✅ Generate dynamic breadcrumbs
const generateBreadcrumbs = (product: IProduct, categoryName?: string): BreadcrumbItem[] => {
    const key = (categoryName || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryInfo = CATEGORY_PAGES[key] ?? getCategoryInfo(product.categoryId);

    return [
        { name: "Home", href: "/" },
        { name: categoryInfo.name, href: categoryInfo.href },
        { name: product.name, href: `/product/${product.slug}`, current: true },
    ];
};

// ✅ Loading fallback for Suspense
function RelatedProductsLoading() {
    return (
        <div className="h-96 flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
    );
}

// ✅ SERVER COMPONENT - No "use client"
export default function ProductDetailPage({ product }: IProductResponseProps) {
    const mappedProduct = mapProductResponseToProduct(product);
    const categoryName = product.category?.categoryName;
    const profile = (product as IProductResponse & { profile?: ProductProfile }).profile;
    const breadcrumbItems = generateBreadcrumbs(mappedProduct, categoryName);
    // const categoryInfo = getCategoryInfo(mappedProduct.categoryId);

    return (
        <>
            <StickyCartObserver />

            {/* Breadcrumbs */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-1.5 sm:pt-2.5 pb-0.5 sm:pb-1.5">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
            </div>

            <main className="bg-white">
                <ProductSelectionProvider product={mappedProduct}>
                    <ViewItemDataLayer product={mappedProduct} categoryName={categoryName} />
                    <TrackVariantChange product={mappedProduct} />

                    {/* Hero Section */}
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-gray-50/30 via-white to-blue-50/20 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-linear-to-bl from-blue-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-linear-to-tr from-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

                        {/* ✅ tighter vertical spacing + proper container padding */}
                        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-start">
                                {/* Product Gallery */}
                                <div className="w-full order-1 flex justify-center">
                                    <div className="relative w-full max-w-[520px] lg:max-w-none lg:sticky lg:top-16">
                                        <ProductGallery product={product} />
                                        <WishlistButton
                                            product={{ id: product.id, name: product.name, slug: product.slug, primaryImage: product.primaryImage, minPrice: product.minPrice, brand: product.brand }}
                                            categoryName={categoryName}
                                            className="absolute right-3 top-3 z-10"
                                        />
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="w-full order-2">
                                    <div className="lg:sticky lg:top-16">
                                        <ProductDetailSection product={mappedProduct} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Product Information Section */}
                    <section className="bg-white relative">
                        {/* ✅ same container + less padding */}
                        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
                            <div className="mb-4">
                                <ScentProfile profile={profile} name={product.name} />
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-1">
                                {/* <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div> */}
                                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                                    Product Details
                                </h2>
                            </div>

                            <div id="product-accordion">
                                <ProductAccordion product={mappedProduct} />
                            </div>
                        </div>
                    </section>

                    {/* Related Products */}
                    <section className="bg-linear-to-b from-gray-50 to-white relative">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-50/30 to-transparent pointer-events-none" />
                        {/* ✅ MUCH smaller padding */}
                        <div className="relative max-w-7xl mx-auto">
                            <Suspense fallback={<RelatedProductsLoading />}>
                                <SimilarScents slug={product.slug} name={product.name} familyId={profile?.mainFamilies?.[0]?.id} />
                            </Suspense>
                        </div>
                    </section>

                    {/* Trust Signals Section */}
                    <section>

                        {/* ✅ reduced padding + reduced heading gap */}
                        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                            {/* <div className="text-center mb-3 sm:mb-6 mt-2 sm:mt-4">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                                    Why Choose Khushbuwaala?
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                                    Your trusted partner for authentic, premium fragrances with exceptional service
                                </p>
                            </div> */}

                            <TrustSignals />
                        </div>
                    </section>

                    <ProductPageBottomBar product={mappedProduct} />
                </ProductSelectionProvider>
            </main>
        </>
    );
}