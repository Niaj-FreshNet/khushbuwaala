/* eslint-disable @next/next/no-html-link-for-pages */
import { Metadata } from "next";
import { getProductBySlug, Product } from "@/lib/Data/data";
import Script from "next/script";
import ProductGallery from "@/components/Modules/Product/ProductGallery";
import RelatedProducts from "@/components/Modules/Product/RelatedProducts";
import ProductAccordion from "@/components/Modules/Product/ProductAccordion";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Shared/Breadcrumbs";
import TrustSignals from "@/components/Modules/Product/TrustSignals";
import StickyCartObserver from "@/components/Modules/Product/StickyCartObserver";
import { ShoppingCart, Heart, MessageSquare, Zap, Info, Sparkles } from "lucide-react";
import ProductDetailSection from "@/components/Modules/Product/ProductDetailSection";
import ProductPageBottomBar from "@/components/Modules/Product/ProductPageBottomBar";
import { ProductSelectionProvider } from "@/context/ProductSelectionContext";
import { IProductResponse } from "@/types/product.types";

interface IProductResponseProps {
    product: IProductResponse;
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

export default function ProductDetailPage({ product }: IProductResponseProps) {
    // export default async function ProductPage({ }: Props) {
    //   console.log("Params slug:", params.slug);
    //   const slug = params.slug;
    // const product = await getProductBySlug(params.slug);

    // const router = useRouter();
    // const { slug } = router.query;
    // console.log("slug:", slug);

    // Fetch product by ID using RTK Query
    //   const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug, {
    //     skip: !slug,
    //   });

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
            <StickyCartObserver />

            {/* Breadcrumbs */}
            <div className="bg-white">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
            </div>

            {/* Main Product Content */}
            <main className="bg-white">
                <ProductSelectionProvider product={product}>
                    {/* Hero Section - Product Gallery and Details */}
                    <section className="relative overflow-hidden">
                        {/* Subtle Background Elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-blue-50/20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-start">
                                {/* Product Gallery */}
                                <div className="w-full order-1 lg:order-1">
                                    <div className="sticky top-20 lg:top-16">
                                        <ProductGallery product={product} />
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="w-full order-2 lg:order-2">
                                    <div className="lg:sticky lg:top-16">
                                        <ProductDetailSection product={product} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Product Information Section */}
                    <section className="bg-white relative">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                            <div className="text-left mb-4 flex items-center gap-3">
                                {/* <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quantity</h3>
          </div> */}
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
                                    <Info className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    Product Details
                                </h2>
                                {/* <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                Everything you need to know about this premium fragrance, from ingredients to shipping
              </p> */}
                            </div>
                            <div id="product-accordion">
                                <ProductAccordion product={product} />
                            </div>
                        </div>
                    </section>

                    {/* Related Products */}
                    <section className="bg-gradient-to-b from-gray-50 to-white relative mb-16 lg:mb-24">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent pointer-events-none"></div>
                        <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                            {/* <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                You Might Also Love
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover more exquisite fragrances from our carefully curated collection
              </p>
            </div> */}
                            <RelatedProducts category={product.category} currentProductId={product._id} />
                        </div>
                    </section>

                    {/* Trust Signals Section */}
                    <section className="relative bg-gradient-to-r from-slate-50 via-blue-50/50 to-indigo-50/30">
                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
                        <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    Why Choose KhushbuWaala?
                                </h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    Your trusted partner for authentic, premium fragrances with exceptional service
                                </p>
                            </div>
                            <TrustSignals />
                        </div>
                    </section>

                    <ProductPageBottomBar product={product} />
                </ProductSelectionProvider>
            </main>
        </>
    );
}