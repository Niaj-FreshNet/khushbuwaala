import { SectionTitle } from "./SectionTitle"
import { ReviewsGridClient } from "./ReviewsGridClient"

const REVIEWS = [
  {
    image: "/images/reviews1.webp",
    facebook: "#",
    instagram: "#",
    youtube: "#",
    tiktok: "#",
  },
  {
    image: "/images/reviews2.webp",
    instagram: "#",
    youtube: "#",
  },
  {
    image: "/images/reviews3.webp",
    facebook: "#",
    tiktok: "#",
  },
  {
    image: "/images/reviews4.webp",
    instagram: "#",
  },
]


export function ReviewsSection() {
  return (
    <section className="py-14 px-4 text-center" aria-labelledby="reviews-heading">
      <SectionTitle
        title="Inspired by Our Customers"
        underlineWidth="w-52"
        className="mb-8"
        subtitle="Real people. Real reactions. Real compliments."
      />

      <ReviewsGridClient items={REVIEWS} />
    </section>
  )
}
