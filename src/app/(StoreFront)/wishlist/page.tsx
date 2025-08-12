/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist | KhushbuWaala",
  description: "Save your favorite fragrances to your wishlist. Compare, revisit, and buy when ready. Authentic perfumes and attars with fast delivery in Bangladesh.",
  openGraph: {
    title: "Wishlist | KhushbuWaala",
    description: "Save your favorite fragrances to your wishlist. Compare, revisit, and buy when ready.",
  },
};

export default function WishlistPage() {
  return <WishlistClient />
}


