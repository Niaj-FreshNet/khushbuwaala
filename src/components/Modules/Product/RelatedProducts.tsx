"use client";
import React, { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/Data/data";
import Link from "next/link";
import Image from "next/image";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      const all = await getProducts();
      const filtered = all.filter(
        (p) => p.category === category && p._id !== currentProductId
      );
      setRelatedProducts(filtered.slice(0, 4));
    }
    fetchRelated();
  }, [category, currentProductId]);

  if (!relatedProducts.length) return null;

  return (
    <section
      aria-label="Related products"
      className="mt-20 max-w-screen-xl mx-auto px-4 lg:px-8"
    >
      <h2 className="text-2xl font-extrabold mb-8 text-gray-900 tracking-wide">
        You may also like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
        {relatedProducts.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="group relative rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:-rotate-1 transition-transform duration-300 border border-gray-200 bg-white"
          >
            <div className="relative w-full aspect-[3/4] rounded-t-2xl overflow-hidden bg-gradient-to-tr from-red-100 via-pink-50 to-white group-hover:from-pink-100">
              <Image
                src={product.primaryImage}
                fill
                alt={product.name}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 600px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-pink-600 text-white px-5 py-1.5 rounded-full text-sm shadow-lg transition">
                View Product
              </div>
            </div>
            <div className="p-5 flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
              <p className="text-red-600 font-semibold text-lg">
                {product.discount
                  ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                  : product.price}{" "}
                BDT
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
