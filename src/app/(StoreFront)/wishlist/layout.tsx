import type { Metadata } from "next"

// A personal page: nothing here for search engines.
export const metadata: Metadata = {
  title: "Your wishlist",
  description: "The perfumes you have saved at Khushbuwaala.",
  robots: { index: false, follow: true },
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
