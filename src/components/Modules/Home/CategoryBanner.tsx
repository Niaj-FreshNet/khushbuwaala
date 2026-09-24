import { SectionTitle } from "./SectionTitle"
import { CategoryGridClient } from "./CategoryGridClient"

export function CategoryBanner() {
  const categories = [
    {
      CategoryName: "Inspired Perfume Oil",
      CategoryImage: "/images/inspired-category.jpg",
      CategoryLink: "/inspired-perfume-oil",
      description: "High-quality inspired perfume oils that capture the essence of luxury fragrances.",
    },
    {
      CategoryName: "Oriental & Arabian Attar",
      CategoryImage: "/images/oriental-category.jpg",
      CategoryLink: "/oriental-attar",
      description: "Authentic oriental and Arabian attar, rich in tradition and exotic aromas.",
    },
    {
      CategoryName: "Artificial Oud",
      CategoryImage: "/images/oud-category.jpg",
      CategoryLink: "/artificial-oud",
      description: "Premium artificial oud fragrances, offering deep and captivating woody notes.",
    },
    {
      CategoryName: "Organic Attar",
      CategoryImage: "/images/natural-category.jpg",
      CategoryLink: "/organic-attar",
      description: "Pure natural attar and organic fragrances, crafted from the finest natural ingredients.",
    },
  ]

  return (
    <section className="pt-1 sm:pt-2 pb-0 sm:pb-0" aria-labelledby="categories-heading">
      <div className="px-0">
        <SectionTitle
          title="Shop by Categories"
          subtitle=""
          // className="mb-4"
          variant="premium"
          underlineVariant="full"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ✅ Client component handles motion + rendering */}
        <CategoryGridClient categories={categories} />
      </div>
    </section>
  )
}
