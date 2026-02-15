import { SectionTitle } from "./SectionTitle"
import { ReviewsGridClient } from "./ReviewsGridClient"

const REVIEWS = [
  {
    image: "/images/reviews1.webp",
    facebook: "https://www.facebook.com/khushbuwaala",
    instagram: "https://www.instagram.com/khushbuwaala_perfumes",
    youtube: "https://www.youtube.com/@khushbuwaala_perfumes",
  },
  {
    image: "/images/reviews2.webp",
    instagram: "https://www.instagram.com/khushbuwaala_perfumes",
    youtube: "https://www.youtube.com/@khushbuwaala_perfumes",
  },
  {
    image: "/images/reviews3.webp",
    facebook: "https://www.facebook.com/khushbuwaala",
  },
  {
    image: "/images/reviews4.webp",
    instagram: "https://www.instagram.com/khushbuwaala_perfumes",
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
