import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google" // Assuming fontSans and fontSerif are defined elsewhere or replaced by Inter
import "./globals.css"
import { siteConfig } from "@/config/site" // Import the re-introduced siteConfig
import { Providers } from "@/lib/Providers" // Your client-side providers wrapper

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

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
      className={`${inter.variable}`} // Using inter.variable as a placeholder
    >
      {/* SEO: Structured Data for Website - Server-side rendered */}
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
      <body className={`min-h-screen text-foreground bg-background font-sans antialiased ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
