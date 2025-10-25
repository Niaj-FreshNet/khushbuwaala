import { Package, LifeBuoy, RefreshCcw, Lock } from "lucide-react"
import { SectionTitle } from "./SectionTitle"

// Server Component - Purely presentational
export function ServicesSection() {
  const services = [
    {
      title: "FREE SHIPPING",
      description: "Free shipping for items over 1000 BDT.",
      icon: <Package className="h-8 w-8 text-red-500" />,
    },
    {
      title: "SUPPORT 24/7",
      description: "Contact us 24 hours a day, 7 days a week.",
      icon: <LifeBuoy className="h-8 w-8 text-red-500" />,
    },
    {
      title: "EASY EXCHANGE",
      description: "Free exchange within 7 days.",
      icon: <RefreshCcw className="h-8 w-8 text-red-500" />,
    },
    {
      title: "SECURE PAYMENT",
      description: "We ensure secure payment.",
      icon: <Lock className="h-8 w-8 text-red-500" />,
    },
  ]

  return (
    <section className="py-12 px-4" aria-labelledby="services-heading">
      <SectionTitle title="Our Services" underlineWidth="w-36" className="mb-8" />
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex-shrink-0 mr-4">{service.icon}</div>
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
