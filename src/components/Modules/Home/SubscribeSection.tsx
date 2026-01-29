import NewsletterForm from "@/components/Shared/Newsletter"
import { SectionTitle } from "./SectionTitle"

export function SubscribeSection() {
  return (
    <section className="py-16 px-4" aria-labelledby="newsletter-heading">
      <div className="max-w-screen-lg mx-auto rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/60 p-6 sm:p-10 shadow-sm">
        <SectionTitle
          title="Get Exclusive Offers & New Arrivals"
          underlineWidth="w-64"
          className="mb-4"
          subtitle="Join our list for early access to drops, deals, and signature collections."
        />

        <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto text-center">
          No spam — only fragrance updates, restocks, and special discounts.
        </p>

        <div className="max-w-xl mx-auto">
          <NewsletterForm />
          <p className="mt-3 text-xs text-gray-500 text-center">
            By subscribing, you agree to receive emails from KhushbuWaala. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
