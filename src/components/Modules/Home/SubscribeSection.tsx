import NewsletterForm from "@/components/Shared/Newsletter";
import { SectionTitle } from "./SectionTitle";

// Server Component - Purely presentational wrapper for the Client Component form
export function SubscribeSection() {
  return (
    <section className="py-12 px-4" aria-labelledby="newsletter-heading">
      <SectionTitle title="Subscribe to Our Newsletter" underlineWidth="w-52" className="mb-8" />
      <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto text-center">
        Subscribing to our newsletter allows you access to what we do and our corporate activities.
      </p>
      <div className="max-w-lg mx-auto">
        {/* NewsletterForm is a Client Component */}
        <NewsletterForm />
      </div>
    </section>
  )
}
