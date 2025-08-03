// app/product/[productSlug]/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2 text-sm mb-6 animate-pulse">
        <div className="h-4 w-12 bg-gray-300 rounded"></div>
        <div className="h-4 w-1 bg-gray-300 rounded"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <div className="h-4 w-1 bg-gray-300 rounded"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>

      {/* Main Product Loading */}
      <div className="grid gap-12 lg:grid-cols-2 py-6 lg:py-12">
        {/* Product Gallery Skeleton */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative rounded-2xl p-2 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 shadow-2xl aspect-[4/5] min-h-[420px] flex items-center justify-center">
            <div className="w-full h-full bg-gray-300 rounded-xl animate-pulse relative overflow-hidden">
              {/* Perfume Bottle Silhouette Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Perfume Bottle Shape */}
                  <div className="w-16 h-32 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-lg rounded-b-3xl mx-auto animate-pulse">
                    {/* Bottle Cap */}
                    <div className="w-12 h-6 bg-gray-500 rounded-t-lg mx-auto -mb-1 animate-bounce delay-500"></div>
                    {/* Spray Nozzle */}
                    <div className="w-8 h-3 bg-gray-600 rounded-full mx-auto -mt-1 animate-bounce delay-700"></div>
                  </div>
                  {/* Fragrance Mist Effect */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-pink-300 rounded-full animate-ping delay-1000"></div>
                    <div className="w-1 h-1 bg-pink-200 rounded-full animate-ping absolute -top-2 left-1 delay-[1200ms]"></div>
                    <div className="w-1 h-1 bg-pink-200 rounded-full animate-ping absolute -top-3 right-1 delay-[1400ms]"></div>
                  </div>
                </div>
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer"></div>
            </div>
          </div>
          
          {/* Thumbnail Skeletons */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-7 pb-24 md:pb-0">
          {/* Product Title */}
          <div className="space-y-3">
            <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-8 w-3/4 bg-gray-300 rounded-lg animate-pulse delay-100"></div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse delay-200"></div>
            <div className="h-8 w-20 bg-green-200 rounded-full animate-pulse delay-300"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse delay-[400ms]"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse delay-500"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse delay-[600ms]"></div>
          </div>

          {/* Size Options */}
          <div className="space-y-2">
            <div className="h-6 w-16 bg-gray-300 rounded animate-pulse delay-700"></div>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="h-10 w-16 bg-gray-300 rounded-lg animate-pulse"
                  style={{ animationDelay: `${800 + i * 100}ms` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-20 bg-gray-300 rounded animate-pulse delay-[1200ms]"></div>
            <div className="h-12 w-32 bg-gray-300 rounded-xl animate-pulse delay-[1300ms]"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5">
            <div className="h-14 w-40 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg animate-pulse delay-[1400ms]"></div>
            <div className="h-14 w-32 bg-gray-300 rounded-lg animate-pulse delay-[1500ms]"></div>
          </div>

          {/* Accordion Skeletons */}
          <div className="space-y-4 mt-12">
            <div className="h-14 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl animate-pulse delay-[1600ms]"></div>
            <div className="h-14 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-xl animate-pulse delay-[1700ms]"></div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-20 px-4 lg:px-8">
        <div className="h-8 w-48 bg-gray-300 rounded mb-8 animate-pulse delay-[1800ms]"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="rounded-2xl shadow-lg overflow-hidden border border-gray-200 bg-white animate-pulse"
              style={{ animationDelay: `${1900 + i * 100}ms` }}
            >
              <div className="w-full aspect-[3/4] bg-gray-300"></div>
              <div className="p-5 space-y-2">
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-5 w-20 bg-red-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Text with Perfume-themed Messages */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce delay-[400ms]"></div>
          <span className="text-gray-700 font-medium ml-2">Loading fragrance details...</span>
        </div>
      </div>
    </div>
  );
}
