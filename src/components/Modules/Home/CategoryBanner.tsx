import Image from "next/image"
import Link from "next/link"
import { SectionTitle } from "./SectionTitle"

interface CategoryCardProps {
  CategoryName: string
  CategoryImage: string
  CategoryLink: string
  description: string
}

// Server Component - Purely presentational
function CategoryCard({ CategoryName, CategoryImage, CategoryLink, description }: CategoryCardProps) {
  return (
    <Link
      href={CategoryLink}
      className="block group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      aria-label={`Explore ${CategoryName} category`}
      title={`Shop ${CategoryName}`}
    >
      <div className="relative w-full h-48 md:h-64">
        <Image
          src={CategoryImage || "/placeholder.svg"}
          alt={CategoryName}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-40">
          <p className="text-2xl md:text-3xl font-bold text-white px-4 text-shadow transition-transform duration-300 group-hover:scale-105">
            {CategoryName}
          </p>
        </div>
      </div>
    </Link>
  )
}

// Server Component - Purely presentational
export function CategoryBanner() {
  const categories = [
    {
      CategoryName: "Inspired Perfume Oil",
      CategoryImage: "/placeholder.svg?height=256&width=300",
      CategoryLink: "/inspired-perfume-oil",
      description: "High-quality inspired perfume oils",
    },
    {
      CategoryName: "Oriental & Arabian Attar",
      CategoryImage: "/placeholder.svg?height=256&width=300",
      CategoryLink: "/oriental-attar",
      description: "Authentic oriental and Arabian attar",
    },
    {
      CategoryName: "Artificial Oud",
      CategoryImage: "/placeholder.svg?height=256&width=300",
      CategoryLink: "/artificial-oud",
      description: "Premium artificial oud fragrances",
    },
    {
      CategoryName: "Natural Collections",
      CategoryImage: "/placeholder.svg?height=256&width=300",
      CategoryLink: "/natural-attar",
      description: "Pure natural attar and organic fragrances",
    },
  ]

  return (
    <section className="py-12 px-4" aria-labelledby="categories-heading">
      <SectionTitle title="Shop by Categories" underlineWidth="w-48" className="mb-8" />
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.CategoryName} {...category} />
        ))}
      </div>
    </section>
  )
}
