import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google" // Using Inter as a placeholder for fontSans/fontSerif
import "./globals.css"
import { siteConfig } from "@/config/site" // Ensure this file exists and is correctly configured
import { Providers } from "@/lib/Providers" // Your client-side providers wrapper

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// SEO: Structured Data for KhushbuWaala Navigation (moved from navbar)
const navigationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "KhushbuWaala Main Navigation",
  url: "https://khushbuwaala.com",
  hasPart: [
    {
      "@type": "WebPage",
      name: "Home",
      url: "https://khushbuwaala.com/",
      description: "KhushbuWaala homepage with featured perfumes and collections",
    },
    {
      "@type": "WebPage",
      name: "New Arrivals",
      url: "https://khushbuwaala.com/new-arrivals",
      description: "Latest perfume arrivals and new fragrance collections",
    },
    {
      "@type": "WebPage",
      name: "All Collection",
      url: "https://khushbuwaala.com/shop",
      description: "Complete collection of perfumes, attars, and fragrances",
    },
    {
      "@type": "WebPage",
      name: "For Women",
      url: "https://khushbuwaala.com/womens-perfume",
      description: "Exclusive perfume collection designed for women",
    },
    {
      "@type": "WebPage",
      name: "Gifts and Packages",
      url: "https://khushbuwaala.com/gifts-and-packages",
      description: "Perfect gift sets and perfume packages for special occasions",
    },
  ],
}

// SEO: Enhanced Structured Data for Organization (moved from footer)
const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KhushbuWaala",
  url: "https://khushbuwaala.com",
  logo: "https://khushbuwaala.com/images/khushbuwaala-logo.webp", // Corrected path
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

// SEO: Comprehensive Metadata for the entire site
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Premium Perfumes & Attars | Authentic Fragrances`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  robots: "index, follow", // Ensure search engines index and follow links
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `${siteConfig.name} - Premium Perfumes & Attars`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Premium Perfumes`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Premium Perfumes & Attars`,
    description: siteConfig.description,
    images: [siteConfig.twitterImage],
    creator: "@yourtwitterhandle", // Replace with your Twitter handle
  },
  verification: siteConfig.verification,
}

// SEO: Viewport configuration
export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming for better mobile experience
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en" // SEO: Specify language for better accessibility and indexing
      suppressHydrationWarning // Recommended for dark mode setup with next-themes
      className={`${inter.variable}`} // Using inter.variable as a placeholder for fontSans/fontSerif
    >
      <body className={`min-h-screen text-foreground bg-background font-sans antialiased ${inter.className}`}>
        {/* SEO: Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteConfig.url}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* SEO: Structured Data for Navigation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationStructuredData) }}
        />
        {/* SEO: Enhanced Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
