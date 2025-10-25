import React from "react";
import { getProductBySlug } from "@/lib/Functions/ServerFn";
import HydrateProduct from "./_components/HydrateProduct";

interface Props {
  params: { slug: string };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Use await destructuring
  const { slug } = await params; // <-- notice the await
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We couldn't find the perfume you're looking for.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-2xl hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Browse Our Collection
          </a>
        </div>
      </div>
    );
  }

  return <HydrateProduct initialData={product} slug={params.slug} />;
}
