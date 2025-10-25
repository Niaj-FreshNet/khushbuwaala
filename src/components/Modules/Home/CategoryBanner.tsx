import Image from "next/image"
import Link from "next/link"
import { SectionTitle } from "./SectionTitle"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  CategoryName: string
  CategoryImage: string
  CategoryLink: string
  description: string
}

// Server Component - Purely presentational
function CategoryCard({ CategoryName, CategoryImage, CategoryLink, description }: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="relative w-full h-56 md:h-64">
        <Image
          src={CategoryImage || "/placeholder.svg"}
          alt={CategoryName}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Enhanced Overlay for Text and Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 drop-shadow-lg leading-snug break-words">
            {CategoryName}
          </h3>
          <p className="text-gray-200 text-sm md:text-base mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {description}
          </p>
          <Button
            asChild
            className="w-fit px-6 py-2 bg-white text-red-600 font-semibold rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
          >
            <Link 
              href={CategoryLink}
              aria-label={`Explore ${CategoryName} category`}
              title={`Shop ${CategoryName}`}
            >
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Server Component - Purely presentational
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
    <section className="py-12 px-4" aria-labelledby="categories-heading">
      <SectionTitle
        title="Shop by Categories"
        subtitle="Explore our diverse range of exquisite fragrances"
        underlineWidth="w-48"
        className="mb-4"
        variant="modern"
      />
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.CategoryName} {...category} />
        ))}
      </div>
    </section>
  )
}
