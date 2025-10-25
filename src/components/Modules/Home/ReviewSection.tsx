import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import { getReviews, type Review } from "@/lib/Data/data"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionTitle } from "./SectionTitle"

// Server Component - Purely presentational
async function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {reviews.map((celebrity) => (
          <div key={celebrity.id} className="relative group overflow-hidden rounded-lg shadow-md">
            <Image
              src={celebrity.image || "/placeholder.svg"}
              alt={`Review by celebrity ${celebrity.id}`}
              width={256}
              height={256}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 flex justify-center items-center">
              <div className="flex space-x-4">
                <Link
                  href={celebrity.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook profile"
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <Facebook className="h-8 w-8" />
                </Link>
                <Link
                  href={celebrity.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram profile"
                  className="text-white hover:text-pink-400 transition-colors"
                >
                  <Instagram className="h-8 w-8" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton Loader for Reviews
function ReviewsSkeleton() {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-screen-lg">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-full h-64 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// Server Component for data fetching and rendering the ReviewsGrid
export async function ReviewsSection() {
  const reviews = await getReviews()

  return (
    <section className="py-12 px-4 text-center" aria-labelledby="reviews-heading">
      <SectionTitle title="Inspired by us" underlineWidth="w-36" className="mb-8" />
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsGrid reviews={reviews} />
      </Suspense>
    </section>
  )
}
