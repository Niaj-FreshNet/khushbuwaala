import type { Metadata } from "next"
import { BannerSection } from "@/components/Modules/Home/BannerSection"
import { CarouselSlider } from "@/components/Modules/Home/CaoruselSlider"
import { CategoryBanner } from "@/components/Modules/Home/CategoryBanner"
import { ProductCarouselSection } from "@/components/Modules/Home/ProductCarouselSection"
import { ReviewsSection } from "@/components/Modules/Home/ReviewSection"
import { ServicesSection } from "@/components/Modules/Home/ServiceSection"
import { SubscribeSection } from "@/components/Modules/Home/SubscribeSection"

// Image assets for banners (using placeholder queries)
const InspiredBannerDesktop = "/placeholder.svg?height=480&width=1920"
const InspiredBannerMobile = "/placeholder.svg?height=300&width=768"
const OrientalBannerDesktop = "/placeholder.svg?height=480&width=1920"
const OrientalBannerMobile = "/placeholder.svg?height=300&width=768"
const OudBannerDesktop = "/placeholder.svg?height=480&width=1920"
const OudBannerMobile = "/placeholder.svg?height=300&width=768"

// SEO: Page-specific Metadata for the homepage
export const metadata: Metadata = {
    title: "Home", // This will be combined with the template from root layout
    description:
        "Discover KhushbuWaala's exquisite collection of premium perfumes, oriental attars, and natural fragrances. Shop best sellers, new arrivals, and more.",
    keywords:
        "perfume, attar, fragrance, KhushbuWaala, homepage, best sellers, new arrivals, inspired perfume, oriental attar, artificial oud, natural collection",
    alternates: {
        canonical: "https://khushbuwaala.com/", // Canonical URL for the homepage
    },
    openGraph: {
        title: "KhushbuWaala - Premium Perfumes & Attars | Authentic Fragrances",
        description:
            "Your ultimate destination for premium perfumes and attars. Explore our best sellers, new collections, and exclusive offers.",
        url: "https://khushbuwaala.com/",
        images: [
            {
                url: "/images/og-image-homepage.jpg", // Specific OG image for homepage
                width: 1200,
                height: 630,
                alt: "KhushbuWaala Homepage - Premium Perfumes",
            },
        ],
    },
    // Add more specific metadata as needed for the homepage
}

// Server Component - Orchestrates all sections of the homepage
export default function HomePage() {
    return (
        <div className="w-full mx-auto">
            {/* Hero Carousel Slider */}
            <CarouselSlider />

            {/* Best Sellers Section */}
            <div className="bg-gray-50 py-12">
                <ProductCarouselSection title="Best Sellers" section="featured" linkPath="/shop" />
            </div>

            {/* Category Banner Section */}
            <CategoryBanner />

            {/* Inspired Perfume Banner */}
            <BannerSection
                heading="Premium Inspired Perfume Oils"
                text="Get The Best Perfume Oil Editions Inspired From Designer Perfumes"
                buttonText="Shop Now"
                link="/inspired-perfume-oil"
                bannerMobile={InspiredBannerMobile}
                bannerDesktop={InspiredBannerDesktop}
            />

            {/* Inspired Perfume Products Section */}
            <div className="bg-gray-50 py-12">
                <ProductCarouselSection
                    title="Inspired Perfume Oils"
                    category="inspiredPerfumeOil"
                    linkPath="/inspired-perfume-oil"
                />
            </div>

            {/* Oriental Fragrances Banner */}
            <BannerSection
                heading="Explore Oriental Fragrances"
                text="Choose Your Desired Perfume Oil from Oriental & Arabian Attar Collections"
                buttonText="Shop Now"
                link="/oriental-attar"
                bannerMobile={OrientalBannerMobile}
                bannerDesktop={OrientalBannerDesktop}
            />

            {/* Oriental Products Section */}
            <div className="bg-gray-50 py-12">
                <ProductCarouselSection title="Arabian Attar" category="oriental" linkPath="/oriental-attar" />
            </div>

            {/* Artificial Oud Banner */}
            <BannerSection
                heading="Best Artificial Editions Of Oud Oils"
                text="Choose The Royal Fragrances From Artificial Oud Collection"
                buttonText="Shop Now"
                link="/artificial-oud"
                bannerMobile={OudBannerMobile}
                bannerDesktop={OudBannerDesktop}
            />

            {/* Artificial Oud Products Section */}
            <div className="bg-gray-50 py-12">
                <ProductCarouselSection title="Artificial Oud" category="artificialOud" linkPath="/artificial-oud" />
            </div>

            {/* Services Section */}
            <ServicesSection />

            {/* Reviews Section */}
            <ReviewsSection />

            {/* Subscribe Section */}
            <SubscribeSection />
        </div>
    )
}
