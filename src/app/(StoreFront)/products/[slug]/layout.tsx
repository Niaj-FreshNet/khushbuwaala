// app/product/[productSlug]/layout.tsx
import React, { ReactNode } from "react";

export const metadata = {
  // Optional: static metadata fallback
  title: "Product Details | KhushbuWaala",
  description: "Explore our premium products at KhushbuWaala.",
};

export default function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="max-w-screen-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {children}
    </section>
  );
}
