import { CategoryCard } from "./CategoryCard"
import { SectionTitle } from "./SectionTitle"

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
    <section className="py-10 sm:py-12" aria-labelledby="categories-heading">
      {/* Keep title aligned nicely (with padding),
          but grid below goes full-bleed on mobile */}
      <div className="px-4">
        <SectionTitle
          title="Shop by Categories"
          subtitle="Explore our diverse range of exquisite fragrances"
          underlineWidth="w-48"
          className="mb-4"
          variant="modern"
        />
      </div>

      {/* Full-bleed grid on mobile */}
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-5 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.CategoryName} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}
