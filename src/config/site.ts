// SEO: Core site configuration for metadata
export const siteConfig = {
  name: "Khushbuwaala",
  url: "https://khushbuwaala.com",
  // One place for the shop's contact numbers (international format, no "+", for wa.me links)
  contact: { phone: "+8801777152588", whatsapp: "8801777152588" },
  description:
    "Discover Khushbuwaala's exquisite collection of premium perfumes, oriental attars, and natural fragrances. Authentic quality with fast delivery across Bangladesh.",
  keywords: "perfume, attar, fragrance, Khushbuwaala, oriental perfume, natural attar, Bangladesh perfume",
  authors: [{ name: "Khushbuwaala" }],
  creator: "Khushbuwaala",
  publisher: "Khushbuwaala",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  // Link-preview picture (Facebook, WhatsApp, X). These files exist in /public; the old
  // og-image.jpg / twitter-image.jpg paths were 404s.
  ogImage: "/hero1desktop11.webp",
  twitterImage: "/hero1desktop11.webp",
}
