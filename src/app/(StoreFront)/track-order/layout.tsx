import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Order | Khushbuwaala - Order Status",
  description:
    "Track your order by ID, see live status updates, and view delivery details. Secure and simple tracking for your purchases.",
  keywords: [
    "track order",
    "order tracking",
    "order status",
    "Khushbuwaala order",
  ],
  openGraph: {
    title: "Track Your Order | Khushbuwaala",
    description: "Check the status of your order with your order ID.",
    type: "website",
    locale: "en_US",
    siteName: "Khushbuwaala",
  },
  twitter: {
    card: "summary",
    title: "Track Your Order | Khushbuwaala",
    description: "Check the status of your order with your order ID.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/track-order" },
}

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Track Order",
            description: "Track your order by ID and view its current status.",
          }),
        }}
      />
    </>
  )
}


