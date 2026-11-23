import type { Metadata } from "next"
import { CarouselSlider } from "@/components/Modules/Home/CaoruselSlider"
import { CategoryBanner } from "@/components/Modules/Home/CategoryBanner"
import { ServicesSection } from "@/components/Modules/Home/ServiceSection"
import { HomeProductRow } from "@/components/Modules/Home/HomeProductRow"
import { HomeDiscovery } from "@/components/Modules/Home/HomeDiscovery"
import { BrandStory } from "@/components/Modules/Home/BrandStory"
import { homeRows } from "@/config/home"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: { absolute: "Khushbuwaala – Perfume Oils, Attar & Oud in Bangladesh" },
  description:
    "Perfume oils, Arabian attars and oud from Khushbuwaala, Dhaka. Find a scent by how it smells, how long it lasts and your budget. Cash on delivery across Bangladesh.",
  alternates: { canonical: `${siteConfig.url}/` },
  openGraph: {
    title: "Khushbuwaala – Perfume Oils, Attar & Oud in Bangladesh",
    description: "Find a perfume by how it smells, how long it lasts and your budget. Cash on delivery across Bangladesh.",
    url: `${siteConfig.url}/`,
    images: [{ url: "/hero1desktop11.webp", alt: "Khushbuwaala perfume oils" }],
  },
}

// Product rows are fetched on the server and refreshed every minute (see lib/discovery), so the
// page is ready-made HTML: nothing waits for JavaScript before products appear.
export default function HomePage() {
  const [firstRow, ...otherRows] = homeRows

  return (
    <div className="w-full mx-auto">
      <h1 className="sr-only">Khushbuwaala: perfume oils, attar and oud in Bangladesh</h1>

      <CarouselSlider />

      {/* No loading placeholders here on purpose: the page is built ahead of time and refreshed
          every minute, so a placeholder would only add markup that no visitor ever sees. */}
      {firstRow && <HomeProductRow {...firstRow} />}

      <HomeDiscovery />

      <CategoryBanner />

      {otherRows.map((row) => (
        <HomeProductRow key={row.title} {...row} />
      ))}

      <BrandStory />

      <ServicesSection />
    </div>
  )
}
