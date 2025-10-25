import type React from "react"
import Link from "next/link"
import { Home, Mail, Phone, Users, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import NewsletterForm from "./Newsletter"
import FooterCollapsible from "./FooterCollapsible"
import SocialIcons from "../Icons/SocialIcons/SocialIcons"
import Image from "next/image"

// SEO: Enhanced Structured Data for Footer (Server-side)
const footerStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KhushbuWaala",
  url: "https://khushbuwaala.com",
  logo: "https://khushbuwaala.com/images/khushbuwaala-logo.webp",
  description: "Premium perfumes, oriental attars, and natural fragrances with authentic quality",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+8801566395807",
    contactType: "customer service",
    email: "khushbuwaala@gmail.com",
    availableLanguage: ["English", "Bengali"],
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "BD",
    addressLocality: "Dhaka",
    addressRegion: "Dhaka Division",
  },
  sameAs: [
    "https://facebook.com/khushbuwaala",
    "https://instagram.com/khushbuwaala",
    "https://twitter.com/khushbuwaala",
    "https://youtube.com/@khushbuwaala",
  ],
}

interface FooterSection {
  id: string
  title: string
  underlineWidth: string
  links: Array<{
    label: string
    href: string
    icon?: React.ReactNode
    external?: boolean
    badge?: string
    description?: string
  }>
}

// Server Component - No interactivity needed here
export const Footer = () => {
  const footerSections: FooterSection[] = [
    {
      id: "companyInfo",
      title: "Get in Touch",
      underlineWidth: "w-20",
      links: [
        {
          label: "Visit Our Office",
          href: "/contact",
          icon: <Home className="h-4 w-4" />,
          description: "Find our physical location",
        },
        {
          label: "khushbuwaala@gmail.com",
          href: "mailto:khushbuwaala@gmail.com",
          icon: <Mail className="h-4 w-4" />,
          external: true,
          description: "Email us anytime",
        },
        {
          label: "+8801566-395807",
          href: "tel:+8801566395807",
          icon: <Phone className="h-4 w-4" />,
          external: true,
          description: "Call us now",
        },
        {
          label: "Customer Support",
          href: "/contact#",
          icon: <Users className="h-4 w-4" />,
          badge: "24/7",
          description: "We're here to help",
        },
      ],
    },
    {
      id: "quickLinks",
      title: "Company",
      underlineWidth: "w-16",
      links: [
        { label: "About Us", href: "/about", description: "Our story and mission" },
        { label: "News & Updates", href: "/news", description: "Latest company news" },
        { label: "Our Values", href: "/manifesto", description: "What we believe in" },
        { label: "Careers", href: "/career", badge: "Hiring", description: "Join our team" },
        {
          label: "Store Locator",
          href: "/stores",
          icon: <MapPin className="h-4 w-4" />,
          description: "Find stores near you",
        },
      ],
    },
    {
      id: "policies",
      title: "Policies",
      underlineWidth: "w-14",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy", description: "How we protect your data" },
        { label: "Return & Refund", href: "/refund-policy", description: "Easy returns within 30 days" },
        { label: "Shipping Info", href: "/shipping-policy", description: "Delivery information" },
        { label: "Exchange Policy", href: "/exchange-policy", description: "Product exchange terms" },
        { label: "Terms of Service", href: "/terms-conditions", description: "Usage terms and conditions" },
      ],
    },
    {
      id: "account",
      title: "Your Account",
      underlineWidth: "w-20",
      links: [
        { label: "Track Your Order", href: "/track-order", description: "Real-time order tracking" },
        { label: "My Wishlist", href: "/wishlist", description: "Saved favorite items" },
        { label: "Shopping Cart", href: "/cart", description: "Review your selections" },
        { label: "Order History", href: "/orders", description: "View past purchases" },
        {
          label: "Click & Collect",
          href: "/click-collect",
          badge: "New",
          description: "Order online, pickup in-store",
        },
      ],
    },
  ]

  return (
    <>
      {/* SEO: Enhanced Structured Data - Server-side rendered */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(footerStructuredData) }} />

      {/* Newsletter Section - Contains Client Component */}
      {/* <section className="bg-gradient-to-r from-red-50 to-red-100 py-12 px-4" aria-labelledby="newsletter-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="newsletter-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with KhushbuWaala
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Be the first to know about new arrivals, exclusive offers, and fragrance tips. Join our community of perfume
            lovers.
          </p>
          <NewsletterForm />
        </div>
      </section> */}

      {/* Main Footer - Server Component */}
      <footer className="bg-white border-t border-gray-200" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Logo and Brand Section - Static Server Component */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block group">
              <Image
                src="/images/khushbuwaala.webp"
                alt="KhushbuWaala - Premium Perfumes"
                className="h-12 w-auto mx-auto transition-transform duration-300 group-hover:scale-110"
                width={120}
                height={48}
              />
            </Link>
            <p className="mt-4 text-gray-600 text-sm max-w-md mx-auto">
              Crafting exceptional fragrances that tell your unique story. Premium quality, authentic ingredients,
              unforgettable scents.
            </p>
          </div>

          {/* Footer Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {footerSections.map((section) => (
              <div key={section.id} className="space-y-6">
                {/* Mobile Collapsible - Client Component */}
                <div className="md:hidden">
                  <FooterCollapsible section={section} />
                </div>

                {/* Desktop Static - Server Component */}
                <div className="hidden md:block">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <div
                    className={`h-0.5 ${section.underlineWidth} bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6`}
                  />
                  <nav aria-label={`${section.title} navigation`}>
                    <ul className="space-y-4">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <div className="group">
                            {link.external ? (
                              <a
                                href={link.href}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                {...(link.href.startsWith("mailto:") || link.href.startsWith("tel:")
                                  ? {}
                                  : { target: "_blank", rel: "noopener noreferrer" })}
                              >
                                {link.icon && (
                                  <span className="text-red-500 group-hover:text-red-600 transition-colors">
                                    {link.icon}
                                  </span>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                      {link.label}
                                    </span>
                                    {link.badge && (
                                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                        {link.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {link.description && <p className="text-xs text-gray-500 mt-1">{link.description}</p>}
                                </div>
                              </a>
                            ) : (
                              <Link
                                href={link.href}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                              >
                                {link.icon && (
                                  <span className="text-red-500 group-hover:text-red-600 transition-colors">
                                    {link.icon}
                                  </span>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                      {link.label}
                                    </span>
                                    {link.badge && (
                                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                        {link.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {link.description && <p className="text-xs text-gray-500 mt-1">{link.description}</p>}
                                </div>
                              </Link>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media & Trust Badges - Server Component */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Follow Us</h4>
                {/* Social Icons - Server Component */}
                <SocialIcons />
              </div>

              <div className="flex flex-col items-center md:items-end">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">We Accept</h4>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                    Cash on Delivery
                  </div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">Bank Transfer</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">Mobile Banking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Bottom - Server Component */}
      <div className="bg-gray-900 text-white py-4" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-300 text-center md:text-left">
              © {new Date().getFullYear()} KhushbuWaala. All rights reserved. Crafted with ❤️ in Bangladesh.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <span>Made with Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
