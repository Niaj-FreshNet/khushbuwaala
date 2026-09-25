"use client"

import { Package, LifeBuoy, RefreshCcw, Lock } from "lucide-react"
import { SectionTitle } from "./SectionTitle"
import { motion, useReducedMotion } from "framer-motion"

export function ServicesSection() {
  const reduce = useReducedMotion()

  const services = [
    {
      title: "Fast Delivery",
      description: "Free delivery on orders over 1000 BDT (selected areas).",
      icon: <Package className="h-6 w-6" />,
    },
    {
      title: "Support 24/7",
      description: "Chat or call anytime — we’re always here to help.",
      icon: <LifeBuoy className="h-6 w-6" />,
    },
    {
      title: "Easy Exchange",
      description: "Hassle-free exchange within 7 days (terms apply).",
      icon: <RefreshCcw className="h-6 w-6" />,
    },
    {
      title: "Secure Payment",
      description: "Trusted checkout with encrypted transactions.",
      icon: <Lock className="h-6 w-6" />,
    },
  ]

  return (
    <section
      className="mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] px-3 sm:px-6 lg:px-8"
      aria-labelledby="services-heading"
    >
      <SectionTitle
        title="Why Choose KhushbuWaala"
        className="mt-6 sm:mt-8 lg:mt-10 mb-2 sm:mb-4"
      />

      {/* Grid: Removed max-w-7xl so it fills the outer container smoothly */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 lg:gap-3">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reduce ? undefined : { duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
            whileHover={reduce ? undefined : { y: -4 }}
            className="group rounded-lg border border-emerald-200 bg-white shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-start gap-3.5 sm:gap-4">
                {/* Icon badge */}
                <div className="shrink-0 rounded-xl bg-linear-to-br from-rose-50 to-pink-50 border border-rose-100 p-2.5 sm:p-3 text-emerald-600 group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>

                <div>
                  <h3 className="text-sm  font-semibold text-gray-900 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}