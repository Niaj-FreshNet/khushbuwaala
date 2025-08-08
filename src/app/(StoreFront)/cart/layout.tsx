import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart | Khushbuwaala - Premium Perfume Oils",
  description: "Review your selected premium perfume oils and proceed to secure checkout. Free shipping available on orders over ৳1000. Fast delivery across Bangladesh.",
  keywords: [
    "shopping cart",
    "perfume oil cart",
    "checkout",
    "Khushbuwaala cart",
    "premium perfume oils",
    "attar shopping",
    "fragrance cart",
    "perfume checkout",
    "online perfume store Bangladesh"
  ],
  openGraph: {
    title: "Shopping Cart | Khushbuwaala",
    description: "Review your premium perfume oil selection and complete your purchase securely.",
    type: "website",
    locale: "en_US",
    siteName: "Khushbuwaala",
  },
  twitter: {
    card: "summary",
    title: "Shopping Cart | Khushbuwaala",
    description: "Review your premium perfume oil selection and complete your purchase securely.",
  },
  robots: {
    index: false, // Cart pages shouldn't be indexed
    follow: true,
  },
  alternates: {
    canonical: "/cart",
  },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      {/* JSON-LD structured data for cart page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ShoppingCart",
            "mainEntity": {
              "@type": "Organization",
              "name": "Khushbuwaala",
              "url": "https://khushbuwaala.com",
              "description": "Premium perfume oils and attar collection in Bangladesh"
            }
          }),
        }}
      />
    </>
  )
}
