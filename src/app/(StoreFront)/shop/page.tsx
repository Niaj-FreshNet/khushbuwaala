import { NoticeBar } from "@/components/Modules/Shop/NoticeBar"
import { ShopBanner } from "@/components/Modules/Shop/ShopBanner"
import { ShopProducts } from "@/components/Modules/Shop/ShopProducts"
import type { Metadata } from "next"

// SEO: Page-specific Metadata for the shop page
export const metadata: Metadata = {
  title: "Shop - Best Quality Perfume Oil Collection | KhushbuWaala",
  description:
    "Explore KhushbuWaala's collection of world-class perfume oils. Free nationwide shipping on orders over 1000 BDT. Up to 50% off!",
  keywords: "perfume oil, fragrance, best perfume oils, KhushbuWaala, shop perfume online, attar, natural fragrance",
  alternates: {
    canonical: "https://khushbuwaala.com/shop", // Canonical URL for the shop page
  },
  openGraph: {
    title: "Shop - Best Quality Perfume Oil Collection | KhushbuWaala",
    description:
      "Explore KhushbuWaala's collection of world-class perfume oils. Free nationwide shipping on orders over 1000 BDT. Up to 50% off!",
    url: "https://khushbuwaala.com/shop",
    images: [
      {
        url: "/images/n111.webp", // Specific OG image for shop page
        width: 1920,
        height: 360,
        alt: "KhushbuWaala Shop Banner - Best Quality Perfume Oil Collection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop - Best Quality Perfume Oil Collection | KhushbuWaala",
    description:
      "Explore KhushbuWaala's collection of world-class perfume oils. Free nationwide shipping on orders over 1000 BDT. Up to 50% off!",
    images: ["/images/n111.webp"], // Specific Twitter image for shop page
  },
}

// Server Component - Orchestrates all sections of the shop page
export default function ShopPage() {
  const notices = [
    "Free Nationwide Shipping on Orders Over 1000 BDT.",
    "Up to 50% Off on Selected Items!",
    "Alter Your Attire Effortlessly at KhushbuWaala Banasree Outlet",
  ]

  return (
    <div className="w-full mx-auto">
      {/* Shop Banner */}
      <ShopBanner
        heading={"Best Quality Perfume Oil Collection"}
        text={"Choose Your Desired Perfume Oil from Worlds Best Perfume Oil Collection"}
        buttonText={"Shop Now"}
        link={"/shop"}
        images={{
          desktop: "/images/n111.webp",
          mobile: "/images/n1.webp",
        }}
        altText="Banner displaying the best quality perfume oil collection"
        variant="primary"
        overlayPattern="gradient"
      />

      {/* Notice Bar */}
      <div className="py-6 bg-gray-50">
        <NoticeBar heading="World's Best Perfume Oils" notices={notices} interval={4000} />
      </div>

      {/* Shop Products Section */}
      <div className="bg-white py-8">
        <ShopProducts />
      </div>
    </div>
  )
}
