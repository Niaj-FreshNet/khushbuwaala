import { fetchHomeReviews } from "@/lib/homeReviews"
import { SectionTitle } from "./SectionTitle"
import { HomeReviewsCarousel } from "./HomeReviewsCarousel"

// "What our customers say": the shop's 5-star product reviews, in a slider. Which reviews show is
// decided in the admin (Reviews page). With nothing to show the section is simply left out, so
// the page never has an empty band or made-up praise.
export async function HomeReviews() {
  const reviews = await fetchHomeReviews()
  if (reviews.length < 3) return null

  return (
    <section
      aria-label="Customer reviews"
      className="mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] px-3 sm:px-4 lg:px-6 2xl:px-8 mt-8 sm:mt-10 lg:mt-12 mb-8 sm:mb-10"
    >
      <SectionTitle
        title="What our customers say"
        subtitle="Five-star reviews left on our product pages."
        className="mb-1 sm:mb-2"
      />
      <HomeReviewsCarousel reviews={reviews} />
    </section>
  )
}
