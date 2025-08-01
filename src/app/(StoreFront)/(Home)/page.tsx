import type { Metadata } from "next"
import { BannerSection } from "@/components/Modules/Home/BannerSection"
import { CarouselSlider } from "@/components/Modules/Home/CaoruselSlider"
import { CategoryBanner } from "@/components/Modules/Home/CategoryBanner"
import { ProductCarouselSection } from "@/components/Modules/Home/ProductCarouselSection"
import { ReviewsSection } from "@/components/Modules/Home/ReviewSection"
import { ServicesSection } from "@/components/Modules/Home/ServiceSection"
import { SubscribeSection } from "@/components/Modules/Home/SubscribeSection"
import { Crown, Gem, Sparkles, Star } from "lucide-react"

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

      {/* Best Sellers Section with premium variant */}
      <div className="bg-gray-50 py-12">
        <ProductCarouselSection
          title="Best Sellers"
          section="featured"
          linkPath="/shop"
          titleVariant="premium"
          titleSubtitle="Discover our most loved fragrances"
          titleIcon={<Crown className="h-6 w-6" />}
          // titleUnderlineVariant="full"
        />
      </div>

      {/* Category Banner Section */}
      <CategoryBanner />

      {/* Enhanced Inspired Perfume Banner with Art Direction */}
      <BannerSection
        heading="Premium Inspired Perfume Oils"
        text="Get The Best Perfume Oil Editions Inspired From Designer Perfumes"
        buttonText="Shop Now"
        link="/inspired-perfume-oil"
        images={{
          mobile: "/images/banner1-mobile.webp", // 768x400 - portrait crop
          tablet: "/images/banner1-tablet.webp", // 1024x500 - landscape crop
          desktop: "/images/banner1.webp", // 1920x600 - wide landscape
        }}
        variant="primary"
      />

      {/* Inspired Perfume Products Section with gradient variant */}
      <div className="bg-gray-50 py-12">
        <ProductCarouselSection
          title="Inspired Perfume Oils"
          category="inspiredPerfumeOil"
          linkPath="/inspired-perfume-oil"
          titleVariant="gradient"
          titleSubtitle="Designer-inspired fragrances at affordable prices"
          titleIcon={<Sparkles className="h-6 w-6" />}
        />
      </div>

      {/* Enhanced Oriental Fragrances Banner */}
      <BannerSection
        heading="Explore Oriental Fragrances"
        text="Choose Your Desired Perfume Oil from Oriental & Arabian Attar Collections"
        buttonText="Shop Now"
        link="/oriental-attar"
        images={{
          mobile: "/images/banner2-mobile.webp",
          desktop: "/images/banner2.webp", // Tablet will fallback to desktop
        }}
        variant="secondary"
      />

      {/* Oriental Products Section with elegant variant */}
      <div className="bg-gray-50 py-12">
        <ProductCarouselSection
          title="Arabian Attar"
          category="oriental"
          linkPath="/oriental-attar"
          titleVariant="elegant"
          titleSubtitle="Traditional Middle Eastern fragrances"
          titleIcon={<Star className="h-6 w-6" />}
        />
      </div>

      {/* Enhanced Artificial Oud Banner */}
      <BannerSection
        heading="Best Artificial Editions Of Oud Oils"
        text="Choose The Royal Fragrances From Artificial Oud Collection"
        buttonText="Shop Now"
        link="/artificial-oud"
        images={{
          mobile: "/images/banner3-mobile.webp",
          desktop: "/images/banner3.webp",
        }}
        variant="tertiary"
      />

      {/* Artificial Oud Products Section with modern variant */}
      <div className="bg-gray-50 py-12">
        <ProductCarouselSection
          title="Artificial Oud"
          category="artificialOud"
          linkPath="/artificial-oud"
          titleVariant="modern"
          titleSubtitle="Premium oud alternatives"
          titleIcon={<Gem className="h-6 w-6" />}
        />
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
