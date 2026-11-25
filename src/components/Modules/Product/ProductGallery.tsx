"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Shuffle,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { IProduct } from "@/types/product.types";
import { useProductSelectionOptional } from "@/context/ProductSelectionContext";
import { sortVariantsBySize } from "@/lib/productPricing";

type GalleryVariant = { id?: string; size?: number | string; price?: number; isDefault?: boolean; images?: string[] };

interface ProductGalleryProps {
  product: Pick<IProduct, "id" | "name" | "primaryImage" | "otherImages"> & { variants?: GalleryVariant[] };
  /** A small control drawn in the bottom-left corner of the photo (the save button). */
  corner?: React.ReactNode;
}

export default function ProductGallery({ product, corner }: ProductGalleryProps) {
  const variants = product.variants;

  // Every picture of the product, once each: the main picture, the extra pictures, then each
  // size's own pictures (smallest size first).
  const images = useMemo(() => {
    const sizePictures = sortVariantsBySize(variants ?? []).flatMap((v) => v.images ?? []);
    const list: string[] = [];
    for (const x of [product.primaryImage, ...(product.otherImages ?? []), ...sizePictures]) {
      const src = x ? String(x) : "";
      if (src && !list.includes(src)) list.push(src);
    }
    return list.length ? list : ["/default-product-image.jpg"];
  }, [product.primaryImage, product.otherImages, variants]);

  const [activeIdx, setActiveIdx] = useState(0);

  // The picture follows the chosen size: a size with its own picture shows that picture (the
  // default size too); a size without one shows the main picture. The page itself opens on the
  // main picture, so nothing moves until the customer picks a size.
  const selectedVariantId = useProductSelectionOptional()?.selectedVariant?.id;
  const lastVariantId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!selectedVariantId) return;
    if (lastVariantId.current === undefined) {
      lastVariantId.current = selectedVariantId;
      return;
    }
    if (lastVariantId.current === selectedVariantId) return;
    lastVariantId.current = selectedVariantId;

    setIsRotating(false);
    const own = (variants ?? []).find((v) => v.id === selectedVariantId)?.images?.[0];
    const ownIdx = own ? images.indexOf(String(own)) : -1;
    setActiveIdx(ownIdx >= 0 ? ownIdx : 0);
  }, [selectedVariantId, variants, images]);
  // The frame takes the shape of the photo (square up to 3:4 tall), so a tall photo is not cut
  // at the top where its name is written.
  const [frame, setFrame] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Hover zoom is switched off (photos open in the full-screen viewer instead).
  const zoomEnabled = false;
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

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
    <section className="space-y-3" aria-label="Product gallery">
      {/* Main Image Container - Exact square matching the product photos */}
      <div className="relative group w-full">
        <div
          className="relative w-full rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ aspectRatio: frame }}
          onClick={() => setLightbox(true)}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Open product image lightbox"
        >
          {/* Main Product Image */}
          <div className="relative w-full h-full">
            <Image
              src={images[activeIdx]}
              alt={`${product.name} - Premium perfume bottle`}
              fill
              fetchPriority="high"
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  setFrame(Math.min(1, Math.max(0.75, img.naturalWidth / img.naturalHeight)));
                }
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover object-top transition-transform duration-500 ${
                zoomActive ? "scale-150" : "scale-100"
              } ${isRotating ? "animate-pulse" : ""}`}
              style={
                zoomActive
                  ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }
                  : undefined
              }
              priority={activeIdx === 0}
              loading={activeIdx === 0 ? "eager" : "lazy"}
            />
          </div>

          {/* Control Buttons anchored cleanly to bottom corner */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
              <button
                className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isRotating
                    ? "bg-purple-600 text-white"
                    : "bg-white/80 text-gray-800 hover:bg-white border border-gray-200"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRotation();
                }}
                aria-label="Toggle 360° view"
                title="360° View"
                type="button"
              >
                <Shuffle size={16} className={isRotating ? "animate-spin" : ""} />
              </button>
            </div>
          )}

          {/* Save button: bottom-left, clear of the name printed at the top of the photos */}
          {corner ? (
            <div className="absolute bottom-3 left-3 z-20" onClick={(e) => e.stopPropagation()}>
              {corner}
            </div>
          ) : null}

          {/* Zoom Instruction */}
          {zoomActive && (
            <div className="hidden sm:block absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
              Move mouse to zoom
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto py-1 justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all w-14 h-14 sm:w-16 sm:h-16 ${
                activeIdx === idx
                  ? "border-emerald-500 ring-2 ring-emerald-200 scale-105 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
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
                width={64}
                height={64}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
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
                priority={false}
                loading="eager"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}