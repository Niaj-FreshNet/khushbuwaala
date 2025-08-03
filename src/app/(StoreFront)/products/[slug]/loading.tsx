// app/product/[productSlug]/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-pulse">
      <div className="w-full h-80 bg-gray-300 rounded-lg" />
      <div className="w-3/4 h-8 bg-gray-300 rounded" />
      <div className="w-1/2 h-6 bg-gray-300 rounded" />
      <div className="w-full h-16 bg-gray-300 rounded" />
    </div>
  );
}
