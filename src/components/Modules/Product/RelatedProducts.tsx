"use client";

import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";
import { IProduct } from "@/types/product.types";
import { useGetRelatedProductsQuery } from "@/redux/store/api/product/productApi";

interface RelatedProductsProps {
  product: IProduct; // current product
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  console.log("Rendering RelatedProducts component");
  console.log("Current product ID:", product.id);

  const { data, isLoading } = useGetRelatedProductsQuery(product?.id!, {
  skip: !product?.id,
});

  console.log("Related products isLoading:", isLoading);
  console.log("Related products data:", data);

  if (isLoading) {
    return (
      <section className="mt-10 max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="h-8 w-48 bg-gray-300 rounded mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!data) return null;

  // Flatten related products arrays
  const relatedProducts = [
    ...(data.sameBrand ?? []),
    ...(data.sameCategory ?? []),
    ...(data.similarAccords ?? []),
    ...(data.recentlyViewed ?? []),
  ];

  // Deduplicate products by ID
  const uniqueProducts = Array.from(
    new Map(relatedProducts.map((p) => [p.id, p])).values()
  );

  if (!uniqueProducts.length) return null;

  return (
    <section
      aria-label="Related products"
      className="mt-12 max-w-screen-xl mx-auto px-4 lg:px-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        You may also like
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {uniqueProducts.map((p) => {
          const activeDiscount = p.discounts?.[0];
          const basePrice = p.minPrice ?? 0;
          const discountedPrice = activeDiscount
            ? activeDiscount.type === "percentage"
              ? basePrice - (basePrice * activeDiscount.value) / 100
              : basePrice - activeDiscount.value
            : basePrice;

          return (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group relative block rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={p.primaryImage}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {activeDiscount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Tag size={12} />
                    {activeDiscount.type === "percentage"
                      ? `${activeDiscount.value}% OFF`
                      : `- ${activeDiscount.value}৳`}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {p.name}
                </h4>

                <div className="mt-2 flex items-center gap-2">
                  {activeDiscount ? (
                    <>
                      <span className="text-sm font-bold text-red-600">
                        ৳{discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-xs line-through text-gray-400">
                        ৳{basePrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">
                      ৳{basePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span
                    className={`text-xs font-medium ${
                      p.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {p.variants?.[0]?.unit
                      ? `Sizes in ${p.variants[0].unit}`
                      : "Standard size"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
