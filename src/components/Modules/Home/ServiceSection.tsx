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
    <section className="py-14 px-4" aria-labelledby="services-heading">
      <SectionTitle
        title="Why Shop With KhushbuWaala"
        underlineWidth="w-52"
        className="mb-8"
        subtitle="Premium fragrances, authentic sources, and service you can trust."
      />

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reduce ? undefined : { duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
            whileHover={reduce ? undefined : { y: -4 }}
            className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Icon badge */}
                <div className="shrink-0 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-3 text-red-600 group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* subtle divider + micro trust */}
              <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-rose-100 to-transparent" />
              <p className="mt-4 text-xs text-gray-500">
                100% genuine • Carefully packed • Quality checked
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
