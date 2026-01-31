"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCw,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { IProduct } from "@/types/product.types";

interface ProductGalleryProps {
  product: Pick<IProduct, "id" | "name" | "primaryImage" | "otherImages">;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // ✅ Prevent undefined/empty URLs (important for next/image)
  const images = useMemo(() => {
    const list = [product.primaryImage, ...(product.otherImages ?? [])]
      .filter(Boolean)
      .map((x) => String(x));
    return list.length ? list : ["/default-product-image.jpg"];
  }, [product.primaryImage, product.otherImages]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const [isRotating, setIsRotating] = useState(false);

  // ✅ Separate "zoom mode" from hover
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Auto-rotate simulation for 360° effect
  useEffect(() => {
    if (!isRotating || images.length < 2) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isRotating, images.length]);

  const nextImage = useCallback(
    () => setActiveIdx((prev) => (prev + 1) % images.length),
    [images.length]
  );
  const prevImage = useCallback(
    () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  );

  const toggleRotation = useCallback(() => {
    setIsRotating((v) => !v);
    if (images.length < 2) setActiveIdx(0);
  }, [images.length]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // ✅ Only calculate when zoom is actually being used
      if (!zoomEnabled || !isHovering) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    },
    [zoomEnabled, isHovering]
  );

  const zoomActive = zoomEnabled && isHovering;

  return (
    <section className="space-y-8" aria-label="Product gallery">
      {/* Main Image Container */}
      <div className="relative group">
        <div
          className="relative rounded-xl p-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 shadow-lg border border-blue-100/50 backdrop-blur-sm
  aspect-square sm:aspect-[4/5]
  min-h-[320px] sm:min-h-[500px]
  flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => setLightbox(true)}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Open product image lightbox"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/15 to-transparent rounded-full blur-3xl"></div>

          {/* Main Product Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[activeIdx]}
              alt={`${product.name} - Premium perfume bottle`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-contain transition-all duration-500 ${zoomActive ? "scale-150" : "scale-100"
                } ${isRotating ? "animate-pulse" : ""} drop-shadow-2xl`}
              style={
                zoomActive
                  ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }
                  : undefined
              }
              // ✅ Only LCP image should be priority
              priority={activeIdx === 0}
              loading={activeIdx === 0 ? "eager" : "lazy"}
            />
          </div>

          {/* Control Buttons */}
          <div className="absolute top-3 right-3 sm:top-2 sm:right-6 flex flex-col sm:flex-row gap-2 sm:gap-3 z-20">
            {images.length > 1 && (
              <button
                className={`p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${isRotating
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white border border-gray-200"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRotation();
                }}
                aria-label="Toggle 360° view"
                title="360° View"
                type="button"
              >
                <RotateCw size={14} className={`${isRotating ? "animate-spin" : ""} sm:hidden`} />
                <RotateCw size={16} className={`${isRotating ? "animate-spin" : ""} hidden sm:block`} />
              </button>
            )}

            {/* Zoom Button */}
            <button
              className={`p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${zoomEnabled
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white border border-gray-200"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                setZoomEnabled((v) => !v);
              }}
              aria-label="Toggle zoom"
              title="Zoom In/Out"
              type="button"
            >
              <Search size={14} className={`${zoomEnabled ? "animate-spin" : ""} sm:hidden`} />
              <Search size={16} className={`${zoomEnabled ? "animate-spin" : ""} hidden sm:block`} />
            </button>

            {/* Expand Button */}
            <button
              className="p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg
                bg-gradient-to-r bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white border border-gray-200"
              aria-label="Expand image"
              title="Full Screen"
              type="button"
            >
              <Maximize2 size={14} className="sm:hidden" />
              <Maximize2 size={16} className="hidden sm:block" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 text-gray-700 rounded-full hover:bg-gray-900 hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg border border-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
                type="button"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 text-gray-700 rounded-full hover:bg-gray-900 hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg border border-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
                type="button"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Decorative */}
          <div className="absolute top-1/4 right-1/5 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
          <div
            className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Zoom Instruction */}
          {zoomActive && (
            <div className="hidden sm:block absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Move mouse to zoom
            </div>
          )}
        </div>

        {/* Premium Badge */}
        <div className="absolute uppercase -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 border-2 border-white">
          Order Now
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-md font-semibold text-gray-900 mb-1">Product Views</h3>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex gap-4 overflow-x-auto py-2 justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {images.map((src, idx) => (
              <button
                key={src + idx}
                className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${activeIdx === idx
                  ? "border-blue-500 ring-4 ring-blue-200/50 scale-110 shadow-lg"
                  : "border-gray-300 hover:border-blue-400 hover:scale-105 hover:shadow-md"
                  }`}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsRotating(false);
                }}
                aria-label={`Show image ${idx + 1}`}
                type="button"
              >
                <Image
                  src={src}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog.Root open={lightbox} onOpenChange={setLightbox}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/95" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Title className="sr-only">
              {product.name} - Full size image {activeIdx + 1} of {images.length}
            </Dialog.Title>

            <button
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
              onClick={() => setLightbox(false)}
              aria-label="Close lightbox"
              type="button"
            >
              <X size={24} />
            </button>

            <div className="absolute top-4 left-4 z-10 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
              {activeIdx + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                  disabled={activeIdx === 0}
                  onClick={prevImage}
                  aria-label="Previous image"
                  type="button"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                  disabled={activeIdx === images.length - 1}
                  onClick={nextImage}
                  aria-label="Next image"
                  type="button"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <Image
                src={images[activeIdx]}
                alt={`${product.name} - Full size view`}
                width={900}
                height={900}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                // ✅ Lightbox should not be priority
                priority={false}
                loading="eager"
              />
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-sm overflow-x-auto">
                {images.map((src, idx) => (
                  <button
                    key={src + idx}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeIdx === idx
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Jump to image ${idx + 1}`}
                    type="button"
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style> */}
    </section>
  );
}
