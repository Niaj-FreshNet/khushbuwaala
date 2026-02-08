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
      CategoryName: "Natural Collections",
      CategoryImage: "/images/natural-category.jpg",
      CategoryLink: "/natural-attar",
      description: "Pure natural attar and organic fragrances, crafted from the finest natural ingredients.",
    },
  ]

  return (
    <section className="py-1 sm:py-2" aria-labelledby="categories-heading">
      <div className="px-4">
        <SectionTitle
          title="Shop by Categories"
          subtitle="Explore our diverse range of exquisite fragrances"
          underlineWidth="w-48"
          className="mb-4"
          variant="modern"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ✅ Client component handles motion + rendering */}
        <CategoryGridClient categories={categories} />
      </div>
    </section>
  )
}
