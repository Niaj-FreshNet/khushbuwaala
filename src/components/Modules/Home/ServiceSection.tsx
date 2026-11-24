"use client"

import { Package, LifeBuoy, RefreshCcw, Lock } from "lucide-react"
import { SectionTitle } from "./SectionTitle"

export function ServicesSection() {

  const services = [
    {
      title: "Delivery across Bangladesh",
      description: "Free delivery on orders of ৳1,000 or more.",
      icon: <Package className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      title: "Help choosing",
      description: "Not sure which one? Message or call us and we will suggest a scent.",
      icon: <LifeBuoy className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      title: "Easy Exchange",
      description: "Hassle-free exchange within 7 days (terms apply).",
      icon: <RefreshCcw className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      title: "Cash on delivery",
      description: "Pay when the parcel arrives, or pay online at checkout.",
      icon: <Lock className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
  ]

  return (
    <section
      className="mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] px-3 sm:px-4 lg:px-6 2xl:px-8"
      aria-labelledby="services-heading"
    >
      <SectionTitle
        title="Why Choose Khushbuwaala"
        className="mt-6 sm:mt-8 lg:mt-10 mb-2 sm:mb-4"
      />

      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="group rounded-xl border border-emerald-200/80 bg-white shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="p-3 sm:p-4 flex flex-col items-center sm:items-start text-center sm:text-left h-full">
              {/* Icon badge */}
              <div className="shrink-0 rounded-xl bg-linear-to-br from-rose-50 to-pink-50 border border-rose-100 p-2 sm:p-2.5 text-emerald-600 group-hover:scale-105 transition-transform mb-2 sm:mb-3">
                {service.icon}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-normal">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}